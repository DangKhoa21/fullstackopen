import { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from "../services/blogs";
import UserContext from "../contexts/UserContext";
import {
  useMatch,
  useNavigate
} from "react-router-dom";
import CommentForm from "./CommentForm";
import CommentsList from "./CommentsList";
import {
  Box,
  Typography,
  Link,
  Button
} from "@mui/material";

const Blog = () => {
  const navigate = useNavigate();
  const [user, , , ] = useContext(UserContext);
  const queryClient = useQueryClient();

  const match = useMatch("/blogs/:id");
  const blogQuery = useQuery({
    queryKey: ["blogs", match?.params.id],
    queryFn: () => blogService.getOne(match?.params.id),
    retry: 2    
  })
  const blog = blogQuery.data
  
  const likeBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: (returnedBlog) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
    onError: (error) => {
      console.log(error.response?.data?.error || "An error occurred")
    }
  })

  const removeBlogMutation = useMutation({
    mutationFn: blogService.deleteOne,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
    onError: (error) => {
      console.log(error.response?.data?.error || "An error occurred")
    }
  })
  const removeBlog = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      removeBlogMutation.mutate(blog.id)
    }
  };

  const addCommentMutation = useMutation({
    mutationFn: blogService.addComment,
    onSuccess: (returnedBlog) => {
      queryClient.invalidateQueries({ queryKey: ["blogs", returnedBlog.blog] });
    },
    onError: (error) => {
      console.log(error.response?.data?.error || "An error occurred")
    }
  })

  const handleLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    };
    likeBlogMutation.mutate({ id: blog.id, newObject: updatedBlog });
  };

  const handleRemove = () => {
    removeBlog(blog);
    navigate("/");
  };

  const addComment = (comment) => {
    addCommentMutation.mutate({ id: blog.id, newComment: { content: comment } });
  };

  if (blogQuery.isPending) {
    return <div>loading...</div>
  }
  if (blogQuery.isError) {
    return <div>{blogQuery.error.message}</div>
  }

  return (
    <Box className="blog" sx={{ padding: 2, border: '1px solid #ccc', borderRadius: 2, marginBottom: 2 }}>
      <Typography variant="h5">
        <Link href={blog.url} target="_blank" rel="noopener noreferrer">{blog.title}</Link>
      </Typography>
      <Typography variant="body1" sx={{ marginTop: 1 }}>
        {blog.likes} likes
        <Button size="small" variant="contained" color="primary" onClick={handleLike} sx={{ marginLeft: 1 }}>
          like
        </Button>
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
        added by {blog.user.name}
      </Typography>
      
      <Box sx={{ marginTop: 2 }}>
        <Typography variant="h6">Comments</Typography>
        <CommentForm addComment={addComment} />
        <CommentsList comments={blog.comments} />
      </Box>

      {user.id === blog.user.id &&
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            color="secondary" 
            sx={{ marginTop: 2, alignItems: 'end' }}
            onClick={handleRemove}
          >
            Delete this blog
          </Button>
        </Box>
      }
    </Box>
  );
};

export default Blog;
