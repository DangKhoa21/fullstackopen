
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const DataLoader = require('dataloader')

const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const bookCountLoader = new DataLoader(async (authorIds) => {
  console.log('loader called')
  const books = await Book.find({ author: { $in: authorIds } })
  console.log('books finished')
  return authorIds.map(authorId => books.filter(book => book.author.toString() === authorId).length)
})

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const { author, genre } = args;
      const query = {};
    
      if (genre) {
        query.genres = { $in: [genre] };
      }
    
      const books = await Book.find(query).populate('author', { name: 1 });
    
      if (author) {
        return books.filter(book => book.author.name === author);
      }
    
      return books;
    },    
    allAuthors: async () => Author.find({}),
    me: (root, args, context) => context.currentUser,
    allGenres: async () => Book.distinct('genres'),
  },

  Author: {
    bookCount: (root) => bookCountLoader.load(root.id)
  },

  Book: {
    author: async (root) => Author.findById(root.author)
  },

  Mutation: {
    addBook: async (root, args, context) => {
      const { currentUser } = context

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author })
        try {
          await author.save()
        } catch (error) {
          throw new GraphQLError('Saving author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error
            }
          })
        }
      }

      const book = new Book({ ...args, author})
      return book.save()
        .then((book) => {
          pubsub.publish('BOOK_ADDED', { bookAdded: book })
          return book
        })
        .catch(error => {
          throw new GraphQLError('Saving book failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.title,
              error
            }
          })
        })

    },
    editAuthor: async (root, args, context) => {
      const { name, setBornTo } = args
      const { currentUser } = context

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      return Author.findOneAndUpdate({ name }, { born: setBornTo }, { new: true })
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username, favouriteGenre: args.favouriteGenre })
      return user.save()
        .catch(error => {
          throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.username,
              error
            }
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }
      const userForToken = {
        username: user.username,
        id: user._id
      }
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  }
}

module.exports = resolvers