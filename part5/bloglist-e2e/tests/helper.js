const loginWith = async (page, username, password)  => {
  await page.locator('input[name="Username"]').fill(username)
  await page.locator('input[name="Password"]').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const logout = async (page)  => {
  await page.getByRole('button', { name: 'logout' }).click()
}

const createBlog = async (page, blog) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.locator('input[name="Title"]').fill(blog.title)
  await page.locator('input[name="Author"]').fill(blog.author)
  await page.locator('input[name="URL"]').fill(blog.url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.getByRole('link', { name: blog.title }).waitFor()
}

export { loginWith, logout, createBlog }