import { createContext, useReducer, useContext } from 'react'
import NotificationContext from './NotificationContext'
import blogService from '../services/blogs'
import loginService from '../services/login'

const userReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return action.payload
    case "LOGOUT":
      return null
    default:
      return null
  }
}

const UserContext = createContext()

export const UserContextProvider = (props) => {
  const [user, userDispatch] = useReducer(userReducer, null)
  const [, notificationDispatch] = useContext(NotificationContext)

  const login = async (username, password) => {
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      userDispatch({ type: "LOGIN", payload: user });
      notificationDispatch({
        type: "SUCCESS",
        payload: `Welcome ${user.name}!`,
      })
    } catch (e) {
      notificationDispatch({
        type: "ERROR",
        payload: e.response?.data?.error,
      })
    }
  };

  const logout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    blogService.setToken(null);
    userDispatch({ type: "LOGOUT" });
  };

  return (
    <UserContext.Provider value={[user, userDispatch, login, logout]}>
      {props.children}
    </UserContext.Provider>
  )
}

export default UserContext