import { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const CommentForm = ({ addComment }) => {
  const [comment, setComment] = useState('');

  const createComment = (event) => {
    event.preventDefault();
    addComment(comment);
    setComment('');
  };

  return (
    <Box component="form" onSubmit={createComment} sx={{ display: 'flex', marginBottom: 2, }}>
      <TextField
        variant="outlined"
        size="small"
        value={comment}
        onChange={({ target }) => setComment(target.value)}
        placeholder="Add a comment"
      />
      <Button type="submit" variant="contained" color="primary" sx={{ marginLeft: 1 }}>
        Add
      </Button>
    </Box>
  );
};

export default CommentForm;
