import { useState } from "react";
import { Typography, CircularProgress, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";

const Users = ({ usersQuery, users }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users?.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Typography variant="h6">Users</Typography>
      <SearchBar label="Search Users" value={searchQuery} onChange={setSearchQuery} />

      {usersQuery.isPending && <CircularProgress />}
      {usersQuery.isError && <Typography color="error">{usersQuery.error.message}</Typography>}

      {filteredUsers && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell align="right">Blogs Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Link to={`/users/${user.id}`}>{user.name}</Link>
                  </TableCell>
                  <TableCell align="right">{user.blogs.length}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default Users;
