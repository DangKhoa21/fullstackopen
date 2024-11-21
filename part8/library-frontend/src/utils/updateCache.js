// function that takes care of manipulating cache
export const updateCache = (cache, {query, variables}, addedBook) => {
  if (query.definitions[0].name.value === 'allBooks') {
    cache.updateQuery({query, variables}, (data) => {
      if (data) {
        const { allBooks } = data
        return {
          allBooks: uniqBy(allBooks.concat(addedBook), 'title'),
        }
      }
    })
  } else if (query.definitions[0].name.value === 'allAuthors') {
    cache.updateQuery({ query, variables}, ({ allAuthors }) => {
      return {
        allAuthors: uniqBy(allAuthors.concat(addedBook.author), 'name'),
      }
    })
  } else if (query.definitions[0].name.value === 'allGenres') {
    cache.updateQuery({ query, variables}, ({ allGenres }) => {
      return { 
        allGenres: allGenres.concat(addedBook.genres).filter((value, index, self) => self.indexOf(value) === index),
      }
    })
  }
}

const uniqBy = (a, key) => {
  let seen = new Set()
  return a.filter((item) => {
    let k = item[key]
    return seen.has(k) ? false : seen.add(k)
  })
}