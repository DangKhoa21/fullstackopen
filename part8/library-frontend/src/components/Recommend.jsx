import { useQuery } from '@apollo/client'
import { ALL_BOOKS, CURRENT_USER } from '../queries'

const Recommend = (props) => {
  const user = useQuery(CURRENT_USER)
  const genre = user.data ? user.data.me?.favouriteGenre : null
  const books = useQuery(ALL_BOOKS, { variables: { genre } })
  const recommended = books.data?.allBooks

  if (!props.show) {
    return null
  }

  if (user.loading || books.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>recommendations</h2>
      <div>
        books in your favourite genre <b>{genre}</b>
      </div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {recommended.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend