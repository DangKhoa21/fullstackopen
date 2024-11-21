import { useState } from "react";

const Blog = ({ blog, user, likeBlog, removeBlog }) => {
  const [show, setShow] = useState(false);
  const [likes, setLikes] = useState(blog.likes);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    };
    likeBlog(updatedBlog);
    setLikes(blog.likes + 1);
  };

  const handleRemove = () => {
    removeBlog(blog);
  };

  return (
    <div style={blogStyle} className="blog">
      <div>
        <a href={blog.url}>{blog.title}</a>
        {show ? (
          <button onClick={() => setShow(false)}>hide</button>
        ) : (
          <button onClick={() => setShow(true)}>view</button>
        )}
      </div>
      <div style={{ display: show ? "" : "none" }} className="blog-details">
        <div>{blog.author}</div>
        <div>
          {likes} likes
          <button onClick={handleLike}>like</button>
        </div>
        {user.username === blog.user.username && (
          <button onClick={handleRemove}>remove</button>
        )}
      </div>
    </div>
  );
};

export default Blog;
