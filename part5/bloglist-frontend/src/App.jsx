import { useEffect, useRef, useContext } from "react";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import NotFound from "./components/NotFound";
import User from "./pages/User";
import Users from "./pages/Users";
import Home from "./pages/Home";
import Notification from "./components/Notification";
import Menu from "./components/Menu";

import blogService from "./services/blogs";
import usersService from "./services/users";
import NotificationContext from "./contexts/NotificationContext";
import UserContext from "./contexts/UserContext";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import "./App.css";

import { Routes, Route } from "react-router-dom";

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
  
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: usersService.getAll,
    retry: 2
  })
  const users = usersQuery.data

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
            <Route path="/users/:id" element={<User users={users} usersQuery={usersQuery}/>} />
            <Route path="/users" element={<Users users={users} usersQuery={usersQuery}/>} />
            <Route path="/blogs/:id" element={<Blog />} />
            <Route path="/" element={<Home blogs={blogs} blogsQuery={blogsQuery} createBlogMutation={createBlogMutation} togglableRef={togglableRef}/>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      )}
    </div>
  );
};

export default App;
