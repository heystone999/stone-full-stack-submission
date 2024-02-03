const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ sum }) => <p><b>total of {sum} exercises</b></p>

const Part = ({ part }) =>
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => {
  const total = parts.reduce((s, p) => {
    console.log('what is happening', s, p)
    return s + p.exercises
  }, 0)
  return (<>
    <Part
      part={parts[0]}
    />
    <Part
      part={parts[1]}
    />
    <Part
      part={parts[2]}
    />
    <Total sum={total} />
  </>)
}
const Course = ({ course }) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
    </div>
  )
}

const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }


  return (
    <div>
      <Course course={course} />
    </div>
  )
}

export default App