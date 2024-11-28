// components/SearchBar.js
import React from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ label, value, onChange }) => {
  return (
    <TextField
      label={label}
      variant="outlined"
      fullWidth
      value={value}
      onChange={e => onChange(e.target.value)}
      sx={{ marginBottom: 2, marginTop: 2 }}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton edge="start" color="primary">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }
      }}
    />
  );
};

export default SearchBar;
