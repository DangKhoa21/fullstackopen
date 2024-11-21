import { useState, useEffect } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Recommend from "./components/Recommend";
import LoginForm from "./components/LoginForm";

import { useApolloClient, useSubscription } from "@apollo/client";
import { ALL_AUTHORS, ALL_BOOKS, ALL_GENRES, BOOK_ADDED } from "./queries";

import { updateCache } from "./utils/updateCache"

const App = () => {
  const [token, setToken] = useState(null);
  const [page, setPage] = useState("authors");
  const client = useApolloClient();

  useEffect(() => {
    setToken(localStorage.getItem('library-user-token'))
  }, [])

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      window.alert(`Book '${addedBook.title}' added!`)
      updateCache(client.cache, { query: ALL_BOOKS, variables: { genre: null } }, addedBook)
      for (let genre of addedBook.genres) {
        updateCache(client.cache, { query: ALL_BOOKS, variables: { genre } }, addedBook)
      }
      updateCache(client.cache, { query: ALL_AUTHORS }, addedBook)
      updateCache(client.cache, { query: ALL_GENRES }, addedBook)
    },
  })

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage("authors")
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token ?
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommend")}>recommend</button>
            <button onClick={() => logout()}>logout</button>
          </> :
          <button onClick={() => setPage("login")}>login</button>
        }
      </div>

      <Authors show={page === "authors"} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} />

      <Recommend show={page === "recommend"} />

      <LoginForm show={page === "login"} setToken={setToken} setPage={setPage} />
    </div>
  );
};

export default App;
