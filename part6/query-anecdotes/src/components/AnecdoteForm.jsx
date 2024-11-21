import { useContext } from 'react'
import NotificationContext from '../NotificationContext'
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createAnecdote } from "../requests"

const AnecdoteForm = () => {
  const [, notificationDispatch] = useContext(NotificationContext)
  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anecdotes"] })
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    newAnecdoteMutation.mutate({ content, votes: 0 }, {
      onSuccess: () => {  
        event.target.anecdote.value = ''
        notificationDispatch({
          type: 'SUCCESS',
          payload: `you created '${content}'`
        })
      },
      onError: () => {
        notificationDispatch({
          type: 'ERROR',
          payload: 'too short, must have length 5 or more'
        })
      }
    })
    setTimeout(() => {
      notificationDispatch({ type: 'CLEAR' })
    }, 5000)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
