import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Menu = ({ user, logout }) => (
  <AppBar position="static" sx={{ mb: 2}}>
    <Toolbar>
      <Typography variant="h6" component={Link} to="/" sx={{ color: 'white', textDecoration: 'none' }}>
        Blogs
      </Typography>
      <Button component={Link} to="/users" sx={{ color: 'white', mx: 2, textTransform: 'none', fontSize: '1rem' }}>
        Users
      </Button>
      <Typography variant="body1" sx={{ flexGrow: 1, color: 'white' }}>
        {user.name} logged in
      </Typography>
      <Button color="inherit" onClick={logout}>
        Logout
      </Button>
    </Toolbar>
  </AppBar>
);

export default Menu;
