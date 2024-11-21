import { useState } from 'react'
import { useMutation, useLazyQuery } from '@apollo/client'
import { LOGIN, CURRENT_USER } from '../queries'

const LoginForm = ({ show, setToken, setPage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login, ] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message)
    },
    onCompleted: async (data) => {
      const token = data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
      await refetchCurrentUser()
      setPage('authors')
    },
  })

  const [refetchCurrentUser] = useLazyQuery(CURRENT_USER, {
    fetchPolicy: 'cache-and-network'
  });

  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm