const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const _ = require('lodash')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

beforeEach(helper.initialDatabase)

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('unique identifier of blog is called id', async () => {
  const response = await api.get('/api/blogs')
  assert(Object.prototype.hasOwnProperty.call(response.body[0], 'id'))
})

test('a valid blog with token can be added ', async () => {
  const user = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })

  const newBlog = {
    title: 'async/await simplifies making async calls',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `bearer ${user.body.token}`)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const contents = blogsAtEnd.map(blog => {
    return {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes
    }
  })
  assert(_.some(contents, newBlog))
})

test('a valid blog with no token can not be added ', async () => {
  const newBlog = {
    title: 'async/await simplifies making async calls',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('create blog without likes got likes set to 0', async () => {
  const newBlog = {
    title: 'async/await simplifies making async calls',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const contents = blogsAtEnd.map(blog => {
    return {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes
    }
  })
  assert(_.some(contents, { ...newBlog, likes: 0 }))
})

test('create blog without url or title is not added', async () => {
  const newBlog = {
    author: 'Edsger W. Dijkstra',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('deletion of a blog', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

  const contents = blogsAtEnd.map(blog => {
    return {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes
    }
  })
  assert(!_.some(contents, blogToDelete))
})

test('update of a blog', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send({
      title : blogToUpdate.title,
      author : blogToUpdate.author,
      url : blogToUpdate.url,
      likes : blogToUpdate.likes + 1
    })
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

  const contents = blogsAtEnd.map(blog => {
    return {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes,
      id: blog.id
    }
  })
  assert(_.some(contents, { ...blogToUpdate, likes: blogToUpdate.likes + 1 }))
})

after(async () => {
  await mongoose.connection.close()
})