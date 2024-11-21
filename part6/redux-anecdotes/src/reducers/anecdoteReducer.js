import { createSlice, current } from '@reduxjs/toolkit'
import anecdotesService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote: (state, action) => {
      state.push(action.payload)
    },
    voteAnecdote: (state, action) => {
      const updatedAnecdote = action.payload
      
      console.log(current(state))

      return state.map(anecdote =>
        anecdote.id !== updatedAnecdote.id ? anecdote : updatedAnecdote
      )
    },
    setAnecdotes: (state, action) => {
      return action.payload
    }
  }
})

export const { appendAnecdote, voteAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdotesService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createNewAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdotesService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteForAnecdote = (anecdote) => {
  return async dispatch => {
    const votedAnecdote = await anecdotesService.update({...anecdote, votes: anecdote.votes + 1})
    dispatch(voteAnecdote(votedAnecdote))
  }
}

export default anecdoteSlice.reducer