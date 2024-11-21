import { useState, useEffect } from 'react'
import { getAll, create, update, deletePersonOf } from './services/phonebook'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [query, setQuery] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addInfo = (event) => {
    event.preventDefault()
    if (persons.find(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(person => person.name === newName)
        const newPerson = { ...person, number: newNumber }
        update(person.id, newPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== returnedPerson.id ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
            setErrorMessage(`${newName} number has been updated`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
      }
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setErrorMessage(`${newName} has been added to phonebook`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
      .catch(error => {
        setErrorMessage(error.response.data.error)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const deletePerson = (id) => {
    const person = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      deletePersonOf(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setErrorMessage(`${person.name} has been deleted from phonebook`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
        .catch(error => {
          setErrorMessage(
            `Note '${person.name}' was already removed from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          setPersons(persons.filter(n => n.id !== id))
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
      <Filter onChange={event => setQuery(event.target.value)} />

      <h3>Add a new</h3>

      <PersonForm 
        name={newName} number={newNumber} 
        onNameChange={event => setNewName(event.target.value)}
        onNumberChange={event => setNewNumber(event.target.value)}
        onSubmit={addInfo}
      />

      <h3>Numbers</h3>

      <Persons persons={persons} query={query} deletePerson={deletePerson} />
    </div>
  )
}

const Filter = ({ onChange }) => {
  return (
    <div>
      filter shown with <input onChange={onChange} />
    </div>
  )
}

const PersonForm = ({ name, number, onNameChange, onNumberChange, onSubmit }) => {
  return (
    <div>
      <form>
        <div>
          name: <input value={name} onChange={onNameChange} />
        </div>
        <div>
          number: <input value={number} onChange={onNumberChange} />
        </div>
        <div>
          <button type="submit" onClick={onSubmit}>add</button>
        </div>
      </form>
    </div>
  )
}

const Persons = ({ persons, query, deletePerson }) => {
  return (
    <div>
      {persons
        .filter(person => person.name.toLowerCase().includes(query.toLowerCase()))
        .map(person => {
          return (
          <div key={person.id}>
            <p>{person.name} {person.number}</p>
            <button onClick={() => deletePerson(person.id)}>delete</button>
          </div>
        )})
      }
    </div>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}

export default App