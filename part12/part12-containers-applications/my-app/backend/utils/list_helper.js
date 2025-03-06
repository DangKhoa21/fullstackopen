const _ = require('lodash')

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length ? blogs.reduce((sum, blog) => sum + blog.likes, 0) : 0
}

const favoriteBlog = (blogs) => {
  if (blogs.length) {
    const blogsCpy = blogs.map(blog => ({ title: blog.title, author: blog.author, likes: blog.likes }))
    const max = blogsCpy.reduce((max, blog) => blog.likes > max.likes ? blog : max, blogsCpy[0])
    return { title: max.title, author: max.author, likes: max.likes }
  }
  return {}
}

const mostBlogs = (blogs) => {
  if (blogs.length) {
    // an object with author as key and number of blogs as value
    // sample: { 'Michael Chan': 2, 'Robert C. Martin': 3 }
    const authors = _.countBy(blogs, 'author')

    // return the author with the most blogs
    const max = Object.keys(authors).reduce((a, b) => authors[a] > authors[b] ? a : b)
    return { author: max, blogs: authors[max] }
  }
  return {}
}

const mostLikes = (blogs) => {
  if (blogs.length) {
    // an object with author as key and number of likes as value
    // sample: { 'Michael Chan': 7, 'Robert C. Martin': 12 }
    const authors  = blogs.reduce((acc, blog) => {
      acc[blog.author] = (acc[blog.author] || 0) + blog.likes
      return acc
    }, {})

    // return the author with the most likes
    const max = Object.keys(authors).reduce((a, b) => authors[a] > authors[b] ? a : b)
    return { author: max, likes: authors[max] }
  }
  return {}
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}