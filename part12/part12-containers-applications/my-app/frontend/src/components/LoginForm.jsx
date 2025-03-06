import { useState } from "react";
import { TextField, Button, Box, CircularProgress, Typography, Link } from '@mui/material';
import { Link as RouterLink } from "react-router-dom";

const LoginForm = ({ verifyLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await verifyLogin({ username, password });
    } catch (error) {
      console.error(error); // Optional: handle error
    } finally {
      setLoading(false);
      setUsername("");
      setPassword("");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleLogin}
      noValidate
      autoComplete="off"
      sx={{ maxWidth: 400, mx: "auto", mt: 5 }}
    >
      <Typography variant="h6" gutterBottom>
        Login
      </Typography>
      <TextField
        label="Username"
        variant="outlined"
        fullWidth
        margin="normal"
        value={username}
        onChange={({ target }) => setUsername(target.value)}
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={password}
        onChange={({ target }) => setPassword(target.value)}
      />
      <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
        {loading ? <CircularProgress size={24} /> : "Login"}
      </Button>

      <Typography variant="body2" sx={{ mt: 2 }}>
        Don&apos;t have an account? <Link component={RouterLink} to="/register">Sign up</Link>
      </Typography>
    </Box>
  );
};

export default LoginForm;
