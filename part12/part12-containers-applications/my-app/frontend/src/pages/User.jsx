import { Typography, CircularProgress } from "@mui/material";
import { Link, useMatch } from "react-router-dom";

const User = ({ users, usersQuery }) => {
  const match = useMatch("/users/:id");

  if (usersQuery.isPending) {
    return <CircularProgress />;
  }
  if (usersQuery.isError) {
    return <Typography color="error">{usersQuery.error.message}</Typography>;
  }

  const user = match ? users.find((user) => user.id === match.params.id) : null;
  if (!user) {
    return <Typography variant="h6">User not found</Typography>;
  }

  return (
    <div>
      <Typography variant="h6">{user.name}</Typography>
      <Typography variant="body1">Added Blogs:</Typography>
      <Typography component="ul">
        {user.blogs.map((blog) => (
          <Typography key={blog.id} component="li">
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </Typography>
        ))}
      </Typography>
    </div>
  );
};

export default User;
