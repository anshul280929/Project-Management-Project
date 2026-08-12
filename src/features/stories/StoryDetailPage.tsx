import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import UpdateRoundedIcon from '@mui/icons-material/UpdateRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';

import { useStories, type CreateStoryInput } from '../../hooks/useStories';
import { useUsers } from '../../hooks/useUsers';
import { getInitials, formatDate, formatRelativeTime } from '../../utils/helpers';
import { PRIORITY_COLORS, STATUS_COLORS } from '../../utils/constants';
import { Priority, WorkflowStatus, type Story } from '../../types';
import StoryStatusSelect from './StoryStatusSelect';
import StoryFormModal from './StoryFormModal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import './StoryDetailPage.css';

// ─── StoryDetailPage ────────────────────────────────────
// Detailed view for a single user story. Shows full story
// info, status control, assignee, and action buttons.

const StoryDetailPage: React.FC = () => {
  const { projectId, storyId } = useParams<{
    projectId: string;
    storyId: string;
  }>();
  const navigate = useNavigate();
  const { getStoryById, updateStory, deleteStory, changeStatus } =
    useStories(projectId);
  const { getUserById } = useUsers();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const story = storyId ? getStoryById(storyId) : undefined;
  const assignedUser = story?.assignedUserId
    ? getUserById(story.assignedUserId)
    : undefined;

  const priorityColor = story ? PRIORITY_COLORS[story.priority] : null;
  const statusColor = story ? STATUS_COLORS[story.status] : null;

  if (!story) {
    return (
      <Box sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h5" color="text.secondary">
          Story not found
        </Typography>
      </Box>
    );
  }

  const handleEditSubmit = (data: {
    title: string;
    description: string;
    priority: Priority;
    storyPoints: number;
    assignedUserId: string | null;
    status: WorkflowStatus;
  }) => {
    updateStory({
      ...story,
      ...data,
    });
  };

  const handleDelete = () => {
    deleteStory(story.id);
    navigate(`/project/${projectId}/stories`, { replace: true });
  };

  const handleStatusChange = (newStatus: WorkflowStatus) => {
    changeStatus(story.id, newStatus);
  };

  return (
    <Box>
      {/* ═══ Story Header ═══ */}
      <Box className="story-detail__header">
        <Box className="story-detail__title-row">
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 600,
              letterSpacing: '-0.5px',
              flex: 1,
              lineHeight: 1.2,
            }}
          >
            {story.title}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditRoundedIcon sx={{ fontSize: 16 }} />}
              onClick={() => setEditModalOpen(true)}
              sx={{
                borderColor: 'rgba(0,0,0,0.12)',
                color: 'text.secondary',
                fontSize: 12,
                '&:hover': {
                  borderColor: 'rgba(0,0,0,0.24)',
                  color: 'text.primary',
                },
              }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<DeleteRoundedIcon sx={{ fontSize: 16 }} />}
              onClick={() => setDeleteDialogOpen(true)}
              sx={{
                borderColor: 'rgba(0,0,0,0.12)',
                color: 'text.secondary',
                fontSize: 12,
                '&:hover': {
                  borderColor: 'var(--color-accent-magenta)',
                  color: 'var(--color-accent-magenta)',
                },
              }}
            >
              Delete
            </Button>
          </Stack>
        </Box>

        {/* Badges row */}
        <Stack direction="row" spacing={1.5} sx={{ mt: 1.5 }}>
          <Chip
            label={story.priority}
            size="small"
            sx={{
              backgroundColor: priorityColor!.bg,
              color: priorityColor!.text,
              border: `1px solid ${priorityColor!.border}`,
              fontSize: 12,
              fontWeight: 600,
              height: 26,
            }}
          />
          <Chip
            label={story.status}
            size="small"
            sx={{
              backgroundColor: statusColor!.bg,
              color: statusColor!.text,
              border: `1px solid ${statusColor!.border}`,
              fontSize: 12,
              fontWeight: 600,
              height: 26,
            }}
          />
          <Chip
            icon={<StarRoundedIcon sx={{ fontSize: '14px !important' }} />}
            label={`${story.storyPoints} ${story.storyPoints === 1 ? 'point' : 'points'}`}
            size="small"
            variant="outlined"
            sx={{
              fontSize: 12,
              fontWeight: 500,
              height: 26,
              borderColor: 'rgba(0,0,0,0.12)',
              '& .MuiChip-icon': { ml: 0.5 },
            }}
          />
        </Stack>
      </Box>

      {/* ═══ Detail Card ═══ */}
      <Paper
        elevation={0}
        className="story-detail__card"
        sx={{
          border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: 'var(--radius-md)',
          p: 0,
          overflow: 'hidden',
        }}
      >
        {/* Description */}
        {story.description && (
          <Box sx={{ px: 3, pt: 3, pb: 2 }}>
            <Typography
              variant="overline"
              sx={{
                color: 'text.secondary',
                fontSize: 11,
                mb: 1,
                display: 'block',
              }}
            >
              Description
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.primary',
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
              }}
            >
              {story.description}
            </Typography>
          </Box>
        )}

        {story.description && <Divider />}

        {/* Metadata grid */}
        <Box className="story-detail__meta-grid" sx={{ px: 3, py: 2.5 }}>
          {/* Status */}
          <Box className="story-detail__meta-item">
            <Typography className="story-detail__meta-label">Status</Typography>
            <StoryStatusSelect
              value={story.status}
              onChange={handleStatusChange}
            />
          </Box>

          {/* Story Points */}
          <Box className="story-detail__meta-item">
            <Typography className="story-detail__meta-label">
              Story Points
            </Typography>
            <Typography
              sx={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                fontSize: 20,
              }}
            >
              {story.storyPoints}
            </Typography>
          </Box>

          {/* Assigned User */}
          <Box className="story-detail__meta-item">
            <Typography className="story-detail__meta-label">
              Assigned To
            </Typography>
            {assignedUser ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.8 },
                }}
                onClick={() =>
                  navigate(
                    `/project/${projectId}/team/${assignedUser.id}`,
                  )
                }
              >
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    fontSize: 12,
                    fontWeight: 600,
                    bgcolor: assignedUser.avatarColor,
                  }}
                >
                  {getInitials(assignedUser.name)}
                </Avatar>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    textDecoration: 'underline',
                    textDecorationColor: 'rgba(0,0,0,0.2)',
                    textUnderlineOffset: 2,
                  }}
                >
                  {assignedUser.name}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonRoundedIcon
                  sx={{ fontSize: 20, color: 'text.disabled' }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: 'text.disabled' }}
                >
                  Unassigned
                </Typography>
              </Box>
            )}
          </Box>

          {/* Priority */}
          <Box className="story-detail__meta-item">
            <Typography className="story-detail__meta-label">
              Priority
            </Typography>
            <Chip
              label={story.priority}
              size="small"
              sx={{
                backgroundColor: priorityColor!.bg,
                color: priorityColor!.text,
                border: `1px solid ${priorityColor!.border}`,
                fontSize: 12,
                fontWeight: 600,
                height: 26,
              }}
            />
          </Box>
        </Box>

        <Divider />

        {/* Timestamps */}
        <Box
          sx={{
            px: 3,
            py: 2,
            display: 'flex',
            gap: 4,
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <CalendarTodayRoundedIcon
              sx={{ fontSize: 14, color: 'text.secondary' }}
            />
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary' }}
            >
              Created {formatDate(story.createdDate)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <UpdateRoundedIcon
              sx={{ fontSize: 14, color: 'text.secondary' }}
            />
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary' }}
            >
              Updated {formatRelativeTime(story.updatedDate)}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* ═══ Edit Modal ═══ */}
      <StoryFormModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        story={story}
      />

      {/* ═══ Delete Confirmation ═══ */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Story"
        message={`Are you sure you want to delete "${story.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
      />
    </Box>
  );
};

export default StoryDetailPage;
