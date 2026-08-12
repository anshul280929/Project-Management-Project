import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  const { projectId } = useParams<{ projectId: string }>();
  const [currentUserId, setCurrentUserId] = useState<string>('');

  // Find active project if inside project route
  const currentProject = projectId
    ? state.projects.find((p) => p.id === projectId)
    : null;

  // Filter users according to current project's member list
  const availableUsers = currentProject
    ? state.users.filter((u) => currentProject.members.includes(u.id))
    : state.users;

  // Load/sync persisted current user with available project members
  useEffect(() => {
    const stored = StorageService.getCurrentUserId();
    if (stored && availableUsers.some((u) => u.id === stored)) {
      setCurrentUserId(stored);
    } else {
      setCurrentUserId('');
    }
  }, [availableUsers, projectId]);

  function handleUserChange(event: SelectChangeEvent) {
    const userId = event.target.value;
    setCurrentUserId(userId);
    if (userId) {
      StorageService.setCurrentUserId(userId);
    }
  }

  const selectedUser = availableUsers.find((u) => u.id === currentUserId);

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
            {availableUsers.map((user) => (
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
            {availableUsers.length === 0 && (
              <MenuItem disabled>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    No members in project
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
