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
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import type { Project } from '../../types';

// ─── ProjectFormModal ───────────────────────────────────
// Create / Edit dialog for projects.
// In "create" mode, fields are blank.
// In "edit" mode, fields are pre-filled with existing data.

interface ProjectFormModalProps {
  open: boolean;
  onClose: () => void;
  /** Called on successful submit with (name, description). */
  onSubmit: (name: string, description: string) => void;
  /** If provided, the modal opens in edit mode with pre-filled data. */
  project?: Project | null;
}

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  project,
}) => {
  const isEditMode = Boolean(project);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState('');

  // Reset form when modal opens / project changes
  useEffect(() => {
    if (open) {
      setName(project?.name ?? '');
      setDescription(project?.description ?? '');
      setNameError('');
    }
  }, [open, project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError('Project name is required.');
      return;
    }

    onSubmit(trimmedName, description.trim());
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
            {isEditMode ? 'EDIT PROJECT' : 'NEW PROJECT'}
          </Typography>
          <Typography variant="h5" component="span" sx={{ fontWeight: 600 }}>
            {isEditMode ? 'Update Project' : 'Create Project'}
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
            <TextField
              label="Project Name"
              placeholder="e.g. Sprint Board, Mobile App"
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
              slotProps={{ htmlInput: { maxLength: 80 } }}
            />
            <TextField
              label="Description"
              placeholder="What's this project about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={4}
              slotProps={{ htmlInput: { maxLength: 500 } }}
            />
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
            {isEditMode ? 'Save Changes' : 'Create Project'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProjectFormModal;
