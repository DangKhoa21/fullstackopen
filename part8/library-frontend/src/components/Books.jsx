import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ALL_GENRES } from '../queries'

import { useState } from 'react'

const Books = (props) => {
  const [genre, setGenre] = useState(null)
  const result = useQuery(ALL_BOOKS, {
    variables: { genre },
  })

  const genresList = useQuery(ALL_GENRES).data?.allGenres

  if (!props.show) {
    return null
  }

  const books = result.data ? result.data.allBooks : []

  if (result.loading) {
    return <div>loading...</div>
  }

  if (result.error) {
    return <div>{result.error.message}</div>
  }

  return (
    <div>
      <h2>books</h2>

      {genre && <div>in genre <b>{genre}</b></div>}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {genresList.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <button onClick={() => setGenre(null)}>all genres</button>
          {genresList.map((genre) => genre && (
            <button key={genre} onClick={() => setGenre(genre)}>
              {genre}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Books
