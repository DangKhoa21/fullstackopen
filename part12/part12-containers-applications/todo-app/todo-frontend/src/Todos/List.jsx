import React from 'react'
import Todo from './Todo'

const TodoList = ({ todos, deleteTodo, completeTodo }) => {
  return (
    <>
      {todos.map(todo => {
        return (
        <Todo
          todo={todo}
          key={todo._id}
          deleteTodo={deleteTodo}
          completeTodo={completeTodo}
        />
        )
      }).reduce((acc, cur) => [...acc, <hr key={acc.length}/>, cur], [])}
    </>
  )
}

export default TodoList
