const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, logout, createBlog } = require('./helper')
const { title } = require('process')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Superuser',
        username: 'root',
        password: 'salainen'
      }
    })
    await request.post('/api/users', {
      data: {
        name: 'Anotheruser',
        username: 'another',
        password: 'another'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'log in to application' })).toBeVisible();
    await expect(page.getByText('username')).toBeVisible();
    await expect(page.locator('input[name="Username"]')).toBeVisible();
    await expect(page.getByText('password')).toBeVisible();
    await expect(page.locator('input[name="Password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible();
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'root', 'salainen')
      const div = page.locator('.notif.success')
      await expect(div).toContainText('Superuser logged in')
      await expect(div).toHaveCSS('border-style', 'solid')
      await expect(div).toHaveCSS('color', 'rgb(0, 128, 0)')
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'root', 'wrong')
      await expect(page.getByText('invalid username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'root', 'salainen')
    })
  
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, {
        title: 'Test title',
        author: 'Test author',
        url: 'https://www.testurl.com'
      })
      const div = page.locator('.notif.success')
      await expect(div).toContainText('a new blog Test title by Test author added')
    })

    describe('and created a blog', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, {
          title: 'Test title',
          author: 'Test author',
          url: 'https://www.testurl.com'
        })
      })
  
      test('it can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('1 likes')).toBeVisible()
      })

      test('it can be deleted by who added', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        page.on('dialog', dialog => dialog.accept())
        await page.getByRole('button', { name: 'remove' }).click()
        await expect(page.getByRole('link', { name: 'Test title' })).not.toBeVisible()
      })

      test('it cannot be deleted by others', async ({ page }) => {
        await logout(page)
        await loginWith(page, 'another', 'another')
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })
    })

    test('blogs are ordered according to likes', async ({ page }) => {
      const blogList = [
        { title: 'Test title 1', author: 'Test author 1', url: 'https://www.testurl1.com' },
        { title: 'Test title 2', author: 'Test author 2', url: 'https://www.testurl2.com' },
        { title: 'Test title 3', author: 'Test author 3', url: 'https://www.testurl3.com' }
      ]

      for (const blog of blogList) {
        await createBlog(page, blog)
      }

      await page.locator('.blog').all()
      // order count from 0 to 2, top to bottom
      // state format: blog: like - order
      // initial: 1: 0-0th, 2: 0-1th, 3: 0-2th

      // hit like for blog 2 one time
      await page.locator('.blog').nth(1).getByRole('button', { name: 'view' }).click()
      await page.locator('.blog').nth(1).getByRole('button', { name: 'like' }).click()
      // 1: 0-1th, 2: 1-0th, 3: 0-2th

      // hit like for blog 2 one more time
      await page.locator('.blog').nth(0).getByRole('button', { name: 'like' }).click()
      // 1: 0-1th, 2: 2-0th, 3: 0-2th

      // hit like for blog 3 one time
      await page.locator('.blog').nth(2).getByRole('button', { name: 'view' }).click()
      await page.locator('.blog').nth(2).getByRole('button', { name: 'like' }).click()
      // 1: 0-2th, 2: 2-0th, 3: 1-1th

      await expect(page.locator('.blog').nth(0)).toContainText('Test title 2')
      await expect(page.locator('.blog').nth(1)).toContainText('Test title 3')
      await expect(page.locator('.blog').nth(2)).toContainText('Test title 1')
    })
  })
})