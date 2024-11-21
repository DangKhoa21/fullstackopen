import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";
import { test } from "vitest";

test("create blog calls event handler with right details", async () => {
  const addBlog = vi.fn();

  render(<BlogForm addBlog={addBlog} />);

  const user = userEvent.setup();
  const title = screen.getByPlaceholderText("Title");
  const author = screen.getByPlaceholderText("Author");
  const url = screen.getByPlaceholderText("URL");
  const sendButton = screen.getByText("create");

  await user.type(
    title,
    "Component testing is done with react-testing-library",
  );
  await user.type(author, "Edsger W. Dijkstra");
  await user.type(
    url,
    "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
  );
  await user.click(sendButton);

  expect(addBlog.mock.calls).toHaveLength(1);
  expect(addBlog.mock.calls[0][0]).toEqual({
    title: "Component testing is done with react-testing-library",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
  });
});
