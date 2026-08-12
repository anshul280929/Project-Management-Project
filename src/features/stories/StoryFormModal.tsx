import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
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
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import { Priority, WorkflowStatus, type Story } from '../../types';
import { PRIORITIES, WORKFLOW_STATUSES, STORY_POINTS } from '../../utils/constants';
import { useUsers } from '../../hooks/useUsers';

// ─── StoryFormModal ─────────────────────────────────────
// Create / Edit dialog for user stories.
// In "create" mode, fields are blank.
// In "edit" mode, fields are pre-filled with existing data.

interface StoryFormModalProps {
  open: boolean;
  onClose: () => void;
  /** Called on submit with a partial story payload (id, timestamps handled externally) */
  onSubmit: (data: {
    title: string;
    description: string;
    priority: Priority;
    storyPoints: number;
    assignedUserId: string | null;
    status: WorkflowStatus;
  }) => void;
  /** If provided, modal opens in edit mode with pre-filled data */
  story?: Story | null;
}

const StoryFormModal: React.FC<StoryFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  story,
}) => {
  const isEditMode = Boolean(story);
  const { projectId } = useParams<{ projectId: string }>();
  const { projectMembers } = useUsers();

  // Members for the assignee dropdown
  const members = useMemo(
    () => (projectId ? projectMembers(projectId) : []),
    [projectId, projectMembers],
  );

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [storyPoints, setStoryPoints] = useState<number>(1);
  const [assignedUserId, setAssignedUserId] = useState<string>('');
  const [status, setStatus] = useState<WorkflowStatus>(WorkflowStatus.BACKLOG);
  const [titleError, setTitleError] = useState('');

  // Reset form when modal opens / story changes
  useEffect(() => {
    if (open) {
      setTitle(story?.title ?? '');
      setDescription(story?.description ?? '');
      setPriority(story?.priority ?? Priority.MEDIUM);
      setStoryPoints(story?.storyPoints ?? 1);
      setAssignedUserId(story?.assignedUserId ?? '');
      setStatus(story?.status ?? WorkflowStatus.BACKLOG);
      setTitleError('');
    }
  }, [open, story]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitleError('Title is required.');
      return;
    }

    onSubmit({
      title: trimmedTitle,
      description: description.trim(),
      priority,
      storyPoints,
      assignedUserId: assignedUserId || null,
      status,
    });
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
            {isEditMode ? 'EDIT STORY' : 'NEW STORY'}
          </Typography>
          <Typography variant="h5" component="span" sx={{ fontWeight: 600 }}>
            {isEditMode ? 'Update Story' : 'Create Story'}
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
            {/* Title */}
            <TextField
              label="Title"
              placeholder="e.g. Implement user authentication"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError('');
              }}
              error={Boolean(titleError)}
              helperText={titleError}
              fullWidth
              autoFocus
              required
              slotProps={{ htmlInput: { maxLength: 120 } }}
            />

            {/* Description */}
            <TextField
              label="Description"
              placeholder="Describe the story requirements…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              minRows={3}
              maxRows={8}
              slotProps={{ htmlInput: { maxLength: 2000 } }}
            />

            {/* Priority & Story Points — side-by-side */}
            <Stack direction="row" spacing={2}>
              <FormControl fullWidth>
                <InputLabel id="story-priority-label">Priority</InputLabel>
                <Select
                  labelId="story-priority-label"
                  value={priority}
                  label="Priority"
                  onChange={(e) => setPriority(e.target.value as Priority)}
                >
                  {PRIORITIES.map((p) => (
                    <MenuItem key={p} value={p}>
                      {p}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="story-points-label">Story Points</InputLabel>
                <Select
                  labelId="story-points-label"
                  value={storyPoints}
                  label="Story Points"
                  onChange={(e) => setStoryPoints(Number(e.target.value))}
                >
                  {STORY_POINTS.map((sp) => (
                    <MenuItem key={sp} value={sp}>
                      {sp} {sp === 1 ? 'point' : 'points'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            {/* Assigned User */}
            <FormControl fullWidth>
              <InputLabel id="story-assignee-label">Assigned To</InputLabel>
              <Select
                labelId="story-assignee-label"
                value={assignedUserId}
                label="Assigned To"
                onChange={(e) => setAssignedUserId(e.target.value as string)}
              >
                <MenuItem value="">
                  <em>Unassigned</em>
                </MenuItem>
                {members.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name} — {user.role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Status */}
            <FormControl fullWidth>
              <InputLabel id="story-status-label">Status</InputLabel>
              <Select
                labelId="story-status-label"
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value as WorkflowStatus)}
              >
                {WORKFLOW_STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
            {isEditMode ? 'Save Changes' : 'Create Story'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default StoryFormModal;
