import React from 'react';
import TextField, { type TextFieldProps } from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

// ─── SearchBar ──────────────────────────────────────────
// Thin wrapper over MUI TextField with a leading search icon.

interface SearchBarProps {
  /** Current search value */
  value: string;
  /** Called with the new value on every keystroke */
  onChange: (value: string) => void;
  /** Placeholder text shown when empty */
  placeholder?: string;
  /** Optional: pass-through MUI TextField props */
  sx?: TextFieldProps['sx'];
  /** Optional: full-width behaviour (default true) */
  fullWidth?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search…',
  sx,
  fullWidth = true,
}) => {
  return (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      fullWidth={fullWidth}
      size="small"
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon
                sx={{ fontSize: 20, color: 'text.secondary' }}
              />
            </InputAdornment>
          ),
        },
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
          transition: 'background-color 150ms ease, border-color 150ms ease',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
          '&.Mui-focused': {
            backgroundColor: '#fff',
          },
        },
        ...sx,
      }}
    />
  );
};

export default SearchBar;
