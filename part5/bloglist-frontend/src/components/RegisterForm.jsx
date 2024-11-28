import { useState } from "react";
import { TextField, Button, Box, CircularProgress, Typography, Link } from '@mui/material';
import { Link as RouterLink } from "react-router-dom";

const RegisterForm = ({ register }) => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await register({ username, name, password, password2 });
    } catch (error) {
      console.error(error); // Optional: handle error
    } finally {
      setLoading(false);
      setUsername("");
      setName("");
      setPassword("");
      setPassword2("");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleRegister}
      noValidate
      autoComplete="off"
      sx={{ maxWidth: 400, mx: "auto", mt: 5 }}
    >
      <Typography variant="h6" gutterBottom>
        Login
      </Typography>
      <TextField
        label="Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={name}
        onChange={({ target }) => setName(target.value)}
        required
      />
      <TextField
        label="Username"
        variant="outlined"
        fullWidth
        margin="normal"
        value={username}
        onChange={({ target }) => setUsername(target.value)}
        required
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={password}
        onChange={({ target }) => setPassword(target.value)}
        required
      />
      <TextField
        label="Confirm Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={password2}
        onChange={({ target }) => setPassword2(target.value)}
        required
      />
      <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
        {loading ? <CircularProgress size={24} /> : "Register"}
      </Button>

      <Typography variant="body2" sx={{ mt: 2 }}>
        Already have an account?{" "}
        <Link component={RouterLink} to="/">
          Login
        </Link>
      </Typography>
    </Box>
  );
};

export default RegisterForm;
