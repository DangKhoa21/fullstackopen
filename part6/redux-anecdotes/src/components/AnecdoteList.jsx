import { useSelector, useDispatch } from 'react-redux'
import { voteForAnecdote } from '../reducers/anecdoteReducer'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'

const AnedocteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    if (filter.length === 0) {
      return anecdotes
    }
    return anecdotes.filter((anecdote) => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
  })

  const vote = (anecdote) => {
    dispatch(voteForAnecdote(anecdote))
    dispatch(setNotificationWithTimeout(`you voted '${anecdotes.find(a => a.id === anecdote.id).content}'`, 5))
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      <ul>
        {anecdotes.toSorted((a, b) => b.votes - a.votes)
          .map((anecdote) => (
            <li key={anecdote.id}>
              <div>
                {anecdote.content}
              </div>
              <div>
                has {anecdote.votes}
                <button onClick={() => vote(anecdote)}>vote</button>
              </div>
            </li>
        ))}
      </ul>
    </div>
  )
}

export default AnedocteList