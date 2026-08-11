import { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { useAppContext } from '../../context/AppContext';
import { StorageService } from '../../services/storageService';
import { getInitials } from '../../utils/helpers';
import Breadcrumbs from './Breadcrumbs';

// ─── Component ─────────────────────────────────────────
export default function Header() {
  const { state } = useAppContext();
  const [currentUserId, setCurrentUserId] = useState<string>('');

  // Load persisted current user on mount
  useEffect(() => {
    const stored = StorageService.getCurrentUserId();
    if (stored && state.users.some((u) => u.id === stored)) {
      setCurrentUserId(stored);
    }
  }, [state.users]);

  function handleUserChange(event: SelectChangeEvent) {
    const userId = event.target.value;
    setCurrentUserId(userId);
    StorageService.setCurrentUserId(userId);
  }

  const selectedUser = state.users.find((u) => u.id === currentUserId);

  return (
    <AppBar position="sticky" color="default">
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          minHeight: '64px !important',
          px: { xs: 2, md: 3 },
        }}
      >
        {/* ── Left: Breadcrumbs ── */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Breadcrumbs />
        </Box>

        {/* ── Right: Current User Picker ── */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {selectedUser && (
            <Avatar
              sx={{
                width: 28,
                height: 28,
                fontSize: 11,
                bgcolor: selectedUser.avatarColor,
              }}
            >
              {getInitials(selectedUser.name)}
            </Avatar>
          )}

          <Select
            value={currentUserId}
            onChange={handleUserChange}
            displayEmpty
            size="small"
            variant="outlined"
            renderValue={(value) => {
              if (!value) {
                return (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Select user…
                  </Typography>
                );
              }
              return (
                <Typography variant="body2">
                  {selectedUser?.name ?? 'Unknown'}
                </Typography>
              );
            }}
            sx={{
              minWidth: 160,
              '& .MuiSelect-select': { display: 'flex', alignItems: 'center', gap: 1 },
            }}
          >
            <MenuItem value="" disabled>
              <em>Select user…</em>
            </MenuItem>
            {state.users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      fontSize: 10,
                      bgcolor: user.avatarColor,
                    }}
                  >
                    {getInitials(user.name)}
                  </Avatar>
                  <Typography variant="body2">{user.name}</Typography>
                </Box>
              </MenuItem>
            ))}
            {state.users.length === 0 && (
              <MenuItem disabled>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    No users yet
                  </Typography>
                </Box>
              </MenuItem>
            )}
          </Select>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
