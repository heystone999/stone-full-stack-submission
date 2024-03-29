const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')


let authHeader
beforeEach(async () => {
  await User.deleteMany({})
  const user = helper.initialUsers[0]
  await api.post('/api/users').send(user)
  const response = await api.post('/api/login').send(user)
  authHeader = `Bearer ${response.body.token}`

  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})


describe('GET /api/blogs', () => {
  test('blogs are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)

  test('all notes are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })


  test('unique identifier property is id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
      expect(blog.id).toBeDefined()
    })
  })
})

describe('POST /api/blogs', () => {
  test('a new blog post can be created successfully', async () => {
    const newBlog = {
      title: "win",
      author: "ComradeProgrammer",
      url: "https://worldismine.win/",
      likes: 2
    }

    await api
      .post('/api/blogs')
      .set('Authorization', authHeader)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const urls = blogsAtEnd.map(r => r.url)
    expect(urls).toContain(newBlog.url)
  })


  test('missing likes property defaults to 0', async () => {
    const newBlog = {
      title: "missing likes",
      author: "stone",
      url: "http://url.com"
    }

    await api
      .post('/api/blogs')
      .set('Authorization', authHeader)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const savedBlog = response.body.find(blog => blog.title === newBlog.title)
    expect(savedBlog.likes).toBe(0)
  })


  test('missing title or url should return 400 Bad Request', async () => {
    const newBlog = {
      author: "stone",
      likes: 10
    }

    await api
      .post('/api/blogs')
      .set('Authorization', authHeader)
      .send(newBlog)
      .expect(400)
  })
})

describe('DELETE /api/blogs/id', () => {
  let blogId
  beforeEach(async () => {
    await Blog.deleteMany({})

    const newBlog = {
      title: "win",
      author: "ComradeProgrammer",
      url: "https://worldismine.win/",
      likes: 2
    }
    const response = await api
      .post('/api/blogs')
      .set('Authorization', authHeader)
      .send(newBlog)
    blogId = response.body.id
  })

  test('succeeds with statuscode 204 by the creator', async () => {
    await api
      .delete(`/api/blogs/${blogId}`)
      .set('Authorization', authHeader)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(0)
  })

  test('fails with statuscode 401 without valid auth header', async () => {
    await api
      .delete(`/api/blogs/${blogId}`)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(1)
  })
})

describe('PUT /api/blogs/id', () => {
  test('succeeds with statuscode 204 if blog exists', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const blog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)
    expect(updatedBlog.likes).toBe(blogToUpdate.likes + 1)
  })
})


afterAll(async () => {
  await mongoose.connection.close()
})