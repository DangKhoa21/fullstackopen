import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";
import "./App.css";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const verifyLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setNotification({ message: `${user.name} logged in`, type: "success" });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } catch (e) {
      setNotification({ message: e.response.data.error, type: "error" });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  const likeBlog = async (updatedBlog) => {
    try {
      await blogService.update(updatedBlog.id, updatedBlog);
      setBlogs(await blogService.getAll());
    } catch (e) {
      console.log(e);
    }
  };

  const removeBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.deleteOne(blog.id);
        setBlogs(await blogService.getAll());
      } catch (exception) {
        console.log(exception);
      }
    }
  };

  const togglableRef = useRef();

  const addBlog = async (blog) => {
    try {
      await blogService.create(blog);
      togglableRef.current.toggleVisibility();
      setBlogs(await blogService.getAll());
      setNotification({
        message: `a new blog ${blog.title} by ${blog.author} added`,
        type: "success",
      });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } catch (e) {
      setNotification({ message: e.response.data.error, type: "error" });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  return (
    <div>
      {user === null ? (
        <div>
          <h2>log in to application</h2>
          {notification && (
            <Notification
              message={notification.message}
              type={notification.type}
            />
          )}
          <LoginForm verifyLogin={verifyLogin} />
        </div>
      ) : (
        <div>
          <h2>blogs</h2>

          {notification && (
            <Notification
              message={notification.message}
              type={notification.type}
            />
          )}

          <p>
            {user.name} logged in{" "}
            <button
              onClick={() => {
                window.localStorage.clear();
                setUser(null);
              }}
            >
              logout
            </button>
          </p>

          <h2>create new</h2>
          <Togglable buttonLabel="new blog" ref={togglableRef}>
            <BlogForm addBlog={addBlog} />
          </Togglable>
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                user={user}
                likeBlog={likeBlog}
                removeBlog={removeBlog}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default App;
