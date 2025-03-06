import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Todo from "./Todo";
import { expect } from "vitest";

test("renders the todo item correctly", async () => {
  const todo = {
    id: 1,
    text: "sample todo",
    done: false,
  };

  const mockDeleteTodo = vi.fn();
  const mockCompleteTodo = vi.fn();

  render(<Todo todo={todo} deleteTodo={mockDeleteTodo} completeTodo={mockCompleteTodo} />);

  expect(screen.getByText(todo.text)).toBeInTheDocument();
  expect(screen.getByText("Set as done")).toBeInTheDocument();

  const user = userEvent.setup();
  await user.click(screen.getByText("Set as done"));
  expect(mockCompleteTodo).toHaveBeenCalledWith(todo);

  await user.click(screen.getByText("Delete"));
  expect(mockDeleteTodo).toHaveBeenCalledWith(todo);
});