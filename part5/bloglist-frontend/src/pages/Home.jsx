import { useState } from "react";
import { Box, Typography, CircularProgress, Card, CardContent, CardActionArea } from "@mui/material";
import { Link } from "react-router-dom";
import BlogForm from "../components/BlogForm";
import Togglable from "../components/Togglable";
import SearchBar from "../components/SearchBar";

const Home = ({ blogs, blogsQuery, createBlogMutation, togglableRef }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBlogs = blogs?.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ padding: 1 }}>
      <Typography variant="h4">Blogs App</Typography>
      <Togglable buttonLabel="New Blog" ref={togglableRef}>
        <BlogForm addBlog={(blog) => createBlogMutation.mutate(blog)} />
      </Togglable>

      <SearchBar label="Search Blogs" value={searchQuery} onChange={setSearchQuery} />

      {blogsQuery.isPending && <CircularProgress />}
      {blogsQuery.isError && <Typography color="error">{blogsQuery.error.message}</Typography>}

      {filteredBlogs && filteredBlogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Card key={blog.id} sx={{ marginBottom: 2 }}>
            <CardActionArea component={Link} to={`/blogs/${blog.id}`}>
              <CardContent>
                <Typography variant="h6">{blog.title}</Typography>
                <Typography color="textSecondary">by {blog.author}</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
    </Box>
  );
};

export default Home;
