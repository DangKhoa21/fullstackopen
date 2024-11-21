import { List, ListItem, ListItemText } from '@mui/material';

const CommentsList = ({ comments }) => {
  return (
    <List>
      {comments.map((comment) => (
        <ListItem key={comment.id} sx={{ border: '1px solid lightgray', borderRadius: 1, my: 1 }}>
          <ListItemText primary={comment.content} />
        </ListItem>
      ))}
    </List>
  );
};

export default CommentsList;
