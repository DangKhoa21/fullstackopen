import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import { expect } from "vitest";

test("renders the blog initially with no details", () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    user: {},
  };

  const { container } = render(<Blog blog={blog} />);

  expect(
    screen.getByText("Component testing is done with react-testing-library"),
  ).toBeInTheDocument();
  expect(container.querySelector(".blog-details")).toHaveStyle("display: none");
});

test("renders the blog URL as a link", () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    user: {},
  };

  render(<Blog blog={blog} />);

  const linkElement = screen.getByRole("link", {
    name: /Component testing is done with react-testing-library/i,
  });
  expect(linkElement).toBeInTheDocument();
  expect(linkElement).toHaveAttribute("href", blog.url);
});

test("render blog details after clicking the button", async () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    user: {},
  };

  const { container } = render(<Blog blog={blog} />);

  const button = screen.getByText("view");
  const user = userEvent.setup();
  await user.click(button);

  expect(container.querySelector(".blog-details")).toHaveAttribute("style", "");
});

test("clicking the like button twice calls event handler twice", async () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    user: {},
  };

  const mockLikeBlog = vi.fn();

  render(<Blog blog={blog} likeBlog={mockLikeBlog} />);

  const button = screen.getByText("view");
  const user = userEvent.setup();
  await user.click(button);

  const likeButton = screen.getByText("like");
  await user.click(likeButton);
  await user.click(likeButton);

  expect(mockLikeBlog.mock.calls).toHaveLength(2);
});
