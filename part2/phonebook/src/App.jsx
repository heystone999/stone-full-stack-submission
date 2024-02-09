import { useState, useEffect } from 'react'
import personService from "./services/persons";


const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      filter shown with <input value={filter} onChange={handleFilterChange} />
    </div>
  )
}


const PersonForm = ({ newName, newNumber, handleNameChange, handleNumberChange, addPerson }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}


const Persons = ({ persons, filter, deletePerson }) => {
  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <ul>
      {filteredPersons.map((person, id) => (
        <li key={id}>
          {person.name} {person.number}
          <button onClick={() => deletePerson(person.id, person.name)}>delete</button>
        </li>
      ))}
    </ul>
  )
}


const Notification = ({ type, message }) => {
  const messageStyle = {
    color: type === "success" ? "green" : "red",
    background: "lightgrey",
    fontSize: "20px",
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px"
  }
  if (!message) {
    return null
  }
  return (
    <div style={messageStyle}>
      {message}
    </div>
  )
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])


  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(person => person.name === newName)

    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const updatePerson = { ...existingPerson, number: newNumber }

        personService
          .update(existingPerson.id, updatePerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => (
              person.id !== existingPerson.id ? person : returnedPerson
            )))
            setSuccessMessage(`Added ${newName}`)
            setTimeout(() => { setSuccessMessage(null) }, 5000)
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            console.error('Error: ', error)
            setErrorMessage(error.response.data.error)
            setTimeout(() => { setErrorMessage(null) }, 5000)
          })
      }
    } else {
      const newPerson = { name: newName, number: newNumber }

      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons([...persons, returnedPerson])
          setSuccessMessage(`Added ${returnedPerson.name}`)
          setTimeout(() => { setSuccessMessage(null) }, 5000)
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          console.error('Error: ', error)
          setErrorMessage(error.response.data.error)
          setTimeout(() => { setErrorMessage(null) }, 5000)
        })
    }
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      console.log(id, name);
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(error => {
          console.error('Error: ', error);
          alert('delete failed')
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      {successMessage && <Notification type="success" message={successMessage} />}
      {errorMessage && <Notification type="error" message={errorMessage} />}
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} deletePerson={deletePerson} />
    </div>
  )
}

export default App