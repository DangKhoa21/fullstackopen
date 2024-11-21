import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getNotes, createNote, updateNote } from './requests'

const App = () => {
  const queryClient = useQueryClient()

  const newNoteMutation = useMutation({ 
    mutationFn: createNote,
    onSuccess: (newNote) => {
      const notes = queryClient.getQueryData(['notes'])
      queryClient.setQueryData(['notes'], notes.concat(newNote))
    }
  })

  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    newNoteMutation.mutate({ content, important: true })
  }

  const updateNoteMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })

  const toggleImportance = (note) => {
    updateNoteMutation.mutate({...note, important: !note.important })
  }

  const result = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes,
    refetchOnWindowFocus: false,
  })
  console.log(JSON.parse(JSON.stringify(result)))

  if ( result.isLoading ) {
    return <div>loading data...</div>
  }

  const notes = result.data

  return(
    <div>
      <h2>Notes app</h2>
      <form onSubmit={addNote}>
        <input name="note" />
        <button type="submit">add</button>
      </form>
      {notes.map(note =>
        <li key={note.id} onClick={() => toggleImportance(note)}>
          {note.content} 
          <strong> {note.important ? 'important' : ''}</strong>
        </li>
      )}
    </div>
  )
}

export default App

// import { useReducer } from 'react'

// const counterReducer = (state, action) => {
//   switch (action.type) {
//     case "INC":
//         return state + 1
//     case "DEC":
//         return state - 1
//     case "ZERO":
//         return 0
//     default:
//         return state
//   }
// }

// const App = () => {
//   const [counter, counterDispatch] = useReducer(counterReducer, 0)

//   return (
//     <div>
//       <div>{counter}</div>
//       <div>
//         <button onClick={() => counterDispatch({ type: "INC"})}>+</button>
//         <button onClick={() => counterDispatch({ type: "DEC"})}>-</button>
//         <button onClick={() => counterDispatch({ type: "ZERO"})}>0</button>
//       </div>
//     </div>
//   )
// }

// export default App