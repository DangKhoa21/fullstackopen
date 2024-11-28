import { useState, useEffect, useRef, useContext } from "react";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import BlogForm from "./components/BlogForm";
import NotFound from "./components/NotFound";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import Menu from "./components/Menu";

import {
  Box,
  Typography, 
  CircularProgress, 
  TableContainer, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody ,
  Paper,
  Card,
  CardContent,
  CardActionArea
} from "@mui/material";

import blogService from "./services/blogs";
import usersService from "./services/users";
import NotificationContext from "./contexts/NotificationContext";
import UserContext from "./contexts/UserContext";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import "./App.css";

import { 
  Routes, 
  Route,
  Link,
  useMatch
} from "react-router-dom";

const App = () => {
  const [, notificationDispatch] = useContext(NotificationContext);
  const [user, userDispatch, login, logout] = useContext(UserContext);
  const queryClient = useQueryClient()

  const notify = (type, message) => {
    notificationDispatch({ type, payload: message });
  };

  const blogsQuery = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
    retry: 2
  })
  const blogs = blogsQuery.data

  const togglableRef = useRef();
  const createBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (returnedBlog) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      togglableRef.current.toggleVisibility();
      notify("SUCCESS", `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`);
    },
    onError: (error) => {
      console.log(error.response?.data?.error || "An error occurred")
      notify("ERROR", error.response?.data?.error || "An error occurred")
    }
  });

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      blogService.setToken(user.token);
      userDispatch({ type: "LOGIN", payload: user });
    }
  }, [userDispatch]);

  const verifyLogin = async ({ username, password }) => {
    login(username, password);
  };

  const register = async ({ username, name, password, password2 }) => {
    if (password !== password2) {
      notify("ERROR", "Passwords do not match");
      return;
    }
    try {
      const user = await usersService.create({ username, name, password });
      notify("SUCCESS", `User ${user.name} created`);
    } catch (error) {
      notify("ERROR", error.response?.data?.error || "An error occurred");
    }
  };
  
  const Home = () => (
    <Box sx={{ padding: 1 }}>
      <Typography variant="h4">Blogs App</Typography>
      <Togglable buttonLabel="New Blog" ref={togglableRef}>
        <BlogForm addBlog={(blog) => createBlogMutation.mutate(blog)} />
      </Togglable>
  
      {blogsQuery.isPending && <CircularProgress />}
      {blogsQuery.isError && <Typography color="error">{blogsQuery.error.message}</Typography>}
  
      {blogs && blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Card key={blog.id} sx={{ marginBottom: 2 }}>
            <CardActionArea component={Link} to={`/blogs/${blog.id}`}>
              <CardContent>
                <Typography variant="h6">
                    {blog.title}
                </Typography>
                <Typography color="textSecondary">by {blog.author}</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
    </Box>
  )

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: usersService.getAll,
    retry: 2
  })
  const users = usersQuery.data

  const Users = () => (
    <div>
      <Typography variant="h6">Users</Typography>
      {usersQuery.isPending && <CircularProgress />}
      {usersQuery.isError && <Typography color="error">{usersQuery.error.message}</Typography>}
      {users && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell align="right">Blogs Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Link to={`/users/${user.id}`}>{user.name}</Link>
                  </TableCell>
                  <TableCell align="right">{user.blogs.length}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  )

  const User = () => {
    const match = useMatch("/users/:id")
    
    if (usersQuery.isPending) {
      return <CircularProgress />;
    }
    if (usersQuery.isError) {
      return <Typography color="error">{usersQuery.error.message}</Typography>;
    }
  
    const user = match ? users.find(user => user.id === match.params.id) : null;
    if (!user) {
      return <Typography variant="h6">User not found</Typography>;
    }
  
    return (
      <div>
        <Typography variant="h6">{user.name}</Typography>
        <Typography variant="body1">Added Blogs:</Typography>
        <Typography component='ul'>
          {user.blogs.map((blog) => (
            <Typography key={blog.id} component='li'>
              <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
            </Typography>
          ))}
        </Typography>
      </div>
    );
  }

  return (
    <div>
      {!user ? (
        <div>
          <Notification />

          <Routes>
            <Route path="/register" element={<RegisterForm register={register} />} />
            <Route path="*" element={<LoginForm verifyLogin={verifyLogin} />} />
          </Routes>
        </div>
      ) : (
        <div>
          <Notification />
          <Menu user={user} logout={logout} />

          <Routes>
            <Route path="/users/:id" element={<User />} />
            <Route path="/users" element={<Users />} />
            <Route path="/blogs/:id" element={<Blog />} />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      )}
    </div>
  );
};

export default App;
