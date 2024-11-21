import { useState } from 'react'
import Select from 'react-select'

const BirthForm = ({ names, update }) => {
  const [selectedName, setSelectedName] = useState(null)
  const [born, setBorn] = useState('')

  return (
    <div>
      <h2>set birthyear</h2>
      <form
        onSubmit={event => {
          event.preventDefault()
          update({ variables: { name: selectedName, setBornTo: Number(born) } })
          setBorn('')
        }}
      >
        <Select
          options={names.map(name => ({ label: name, value: name }))}
          defaultValue={selectedName}
          onChange={({ value }) => setSelectedName(value)}
        />
        <div>
          born
          <input
            type='number'
            value={born}
            onChange={({ target }) => setBorn(Number(target.value))}
          />
        </div>
        <button>update author</button>
      </form>
    </div>
  )
}

export default BirthForm