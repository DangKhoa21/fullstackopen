import { useState } from "react";
import { TextField, Button, Box, Typography } from '@mui/material';

const BlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const createBlog = async (event) => {
    event.preventDefault();
    const blog = { title, author, url };
    addBlog(blog);
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <Box 
      component="form" 
      onSubmit={createBlog} 
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 400 }}
    >
      <Typography variant="h6">Create New Blog</Typography>
      <TextField
        label="Title"
        value={title}
        name="Title"
        onChange={({ target }) => setTitle(target.value)}
        variant="outlined"
        required
      />
      <TextField
        label="Author"
        value={author}
        name="Author"
        onChange={({ target }) => setAuthor(target.value)}
        variant="outlined"
        required
      />
      <TextField
        label="URL"
        value={url}
        name="URL"
        onChange={({ target }) => setUrl(target.value)}
        variant="outlined"
        required
      />
      <Button type="submit" variant="contained" color="primary">
        Create
      </Button>
    </Box>
  );
};

export default BlogForm;
