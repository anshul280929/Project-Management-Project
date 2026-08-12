import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

import { UserRole, type User } from '../../types';
import { USER_ROLES } from '../../utils/constants';
import { getInitials, generateAvatarColor } from '../../utils/helpers';

// ─── UserFormModal ──────────────────────────────────────
// Create / Edit dialog for team members.
// In "create" mode, fields are blank.
// In "edit" mode, fields are pre-filled with existing data.

// Preset avatar color palette
const AVATAR_PALETTE = [
  '#ef2cc1', // Magenta
  '#fc4c02', // Orange
  '#863bff', // Purple
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#ec4899', // Pink
  '#f59e0b', // Amber
  '#a855f7', // Violet
  '#e11d48', // Rose
  '#0ea5e9', // Sky
  '#84cc16', // Lime
];

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  /** Called on submit with (name, role, avatarColor) */
  onSubmit: (name: string, role: UserRole, avatarColor: string) => void;
  /** If provided, modal opens in edit mode with pre-filled data */
  user?: User | null;
}

const UserFormModal: React.FC<UserFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  user,
}) => {
  const isEditMode = Boolean(user);

  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.DEVELOPER);
  const [avatarColor, setAvatarColor] = useState(AVATAR_PALETTE[0]);
  const [nameError, setNameError] = useState('');

  // Reset form when modal opens / user changes
  useEffect(() => {
    if (open) {
      setName(user?.name ?? '');
      setRole(user?.role ?? UserRole.DEVELOPER);
      setAvatarColor(user?.avatarColor ?? generateAvatarColor(user?.name ?? ''));
      setNameError('');
    }
  }, [open, user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError('Name is required.');
      return;
    }

    onSubmit(trimmedName, role, avatarColor);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
          },
        },
      }}
    >
      {/* ── Title bar ── */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2,
          px: 3,
          borderBottom: '1px solid rgba(0,0,0,0.08)',
        }}
      >
        <Box>
          <Typography
            variant="overline"
            sx={{
              color: 'text.secondary',
              fontSize: 11,
              mb: 0.25,
              display: 'block',
            }}
          >
            {isEditMode ? 'EDIT MEMBER' : 'NEW MEMBER'}
          </Typography>
          <Typography variant="h5" component="span" sx={{ fontWeight: 600 }}>
            {isEditMode ? 'Update Member' : 'Add Team Member'}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          aria-label="Close dialog"
          sx={{
            color: 'text.secondary',
            '&:hover': { color: 'text.primary' },
          }}
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ py: 3, px: 3 }}>
          <Stack spacing={3}>
            {/* Avatar preview */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Avatar
                sx={{
                  width: 72,
                  height: 72,
                  fontSize: 26,
                  fontWeight: 600,
                  bgcolor: avatarColor,
                  transition: 'background-color 250ms ease',
                }}
              >
                {getInitials(name || 'AB')}
              </Avatar>
            </Box>

            {/* Name */}
            <TextField
              label="Name"
              placeholder="e.g. Jane Doe"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError('');
              }}
              error={Boolean(nameError)}
              helperText={nameError}
              fullWidth
              autoFocus
              required
              slotProps={{ htmlInput: { maxLength: 60 } }}
            />

            {/* Role select */}
            <FormControl fullWidth>
              <InputLabel id="user-role-label">Role</InputLabel>
              <Select
                labelId="user-role-label"
                value={role}
                label="Role"
                onChange={(e) => setRole(e.target.value as UserRole)}
              >
                {USER_ROLES.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Avatar color picker */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  mb: 1,
                  display: 'block',
                }}
              >
                Avatar Color
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                }}
              >
                {AVATAR_PALETTE.map((color) => (
                  <Box
                    key={color}
                    onClick={() => setAvatarColor(color)}
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      bgcolor: color,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border:
                        avatarColor === color
                          ? '3px solid var(--color-ink)'
                          : '3px solid transparent',
                      transition: 'border-color 200ms ease, transform 200ms ease',
                      '&:hover': {
                        transform: 'scale(1.15)',
                      },
                    }}
                  >
                    {avatarColor === color && (
                      <CheckRoundedIcon
                        sx={{ fontSize: 18, color: '#fff' }}
                      />
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          </Stack>
        </DialogContent>

        {/* ── Actions ── */}
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: '1px solid rgba(0,0,0,0.08)',
          }}
        >
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" type="submit">
            {isEditMode ? 'Save Changes' : 'Add Member'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserFormModal;
