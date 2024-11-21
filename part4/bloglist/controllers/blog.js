
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comment')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
    .populate('user', { username: 1, name: 1 })
    .populate('comments', { content: 1, id: 1 })

  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.use((request, response, next) => {
  if (!request.auth) {
    return response.status(401).json({ error: 'token missing' })
  }
  if (!request.auth.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  next()
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const creator = await User.findById(request.auth.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: creator.id
  })

  const result = await blog.save()
  creator.blogs = creator.blogs.concat(result.id)
  await creator.save()
  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  const requesterId = request.auth.id
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }
  if (blog.user.toString() !== requesterId) {
    return response.status(401).json({ error: 'unauthorized action' })
  }
  await blog.deleteOne()
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: body.user
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const body = request.body
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).end()
  }

  const comment = new Comment({
    content: body.content,
    blog: blog.id
  })
  const savedComment = await comment.save()
  blog.comments = blog.comments.concat(savedComment.id)
  await blog.save()

  response.status(201).json(savedComment)
})

module.exports = blogsRouter