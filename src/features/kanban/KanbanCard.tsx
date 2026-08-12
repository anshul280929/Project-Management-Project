import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import type { Story, User } from '../../types';
import { WorkflowStatus } from '../../types';
import { PRIORITY_COLORS, WORKFLOW_STATUSES } from '../../utils/constants';
import { getInitials, formatRelativeTime } from '../../utils/helpers';
import './KanbanCard.css';

interface KanbanCardProps {
  story: Story;
  assignedUser?: User;
  onEdit?: (story: Story) => void;
  onDelete?: (storyId: string) => void;
  onStatusChange?: (storyId: string, status: WorkflowStatus) => void;
  onDragStart?: (storyId: string) => void;
  onDragEnd?: () => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  story,
  assignedUser,
  onEdit,
  onDelete,
  onStatusChange,
  onDragStart,
  onDragEnd,
}) => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [isDragging, setIsDragging] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const menuOpen = Boolean(anchorEl);
  const priorityColor = PRIORITY_COLORS[story.priority];

  const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setAnchorEl(null);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation when clicking action buttons or drag handle
    if ((e.target as HTMLElement).closest('.kanban-card-actions') || menuOpen) {
      return;
    }
    navigate(`/project/${projectId}/story/${story.id}`);
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', story.id);
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
    if (onDragStart) {
      onDragStart(story.id);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    if (onDragEnd) {
      onDragEnd();
    }
  };

  const handleMoveStatus = (newStatus: WorkflowStatus) => {
    handleMenuClose();
    if (onStatusChange) {
      onStatusChange(story.id, newStatus);
    }
  };

  return (
    <Card
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleCardClick}
      className={`kanban-card ${isDragging ? 'dragging' : ''}`}
      sx={{
        position: 'relative',
        cursor: 'grab',
        userSelect: 'none',
        borderRadius: 2,
        border: '1px solid var(--color-hairline, #e2e8f0)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: '#ffffff',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
          borderColor: 'var(--color-primary-periwinkle, #6366f1)',
          '& .drag-handle': {
            opacity: 1,
          },
        },
        '&:active': {
          cursor: 'grabbing',
        },
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        {/* ── Top Bar: Priority + Points + Drag indicator / Actions ── */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Drag Handle indicator */}
            <DragIndicatorIcon
              className="drag-handle"
              sx={{
                fontSize: 18,
                color: 'text.disabled',
                opacity: 0.4,
                transition: 'opacity 0.2s ease',
              }}
            />
            {/* Priority Chip */}
            <Chip
              label={story.priority}
              size="small"
              sx={{
                backgroundColor: priorityColor.bg,
                color: priorityColor.text,
                border: `1px solid ${priorityColor.border}`,
                fontSize: 10,
                fontWeight: 700,
                height: 20,
                letterSpacing: '0.03em',
              }}
            />
          </Box>

          <Box
            className="kanban-card-actions"
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            {/* Story Points Pill */}
            <Chip
              label={`${story.storyPoints} pt${story.storyPoints > 1 ? 's' : ''}`}
              size="small"
              variant="outlined"
              sx={{
                fontSize: 10,
                fontWeight: 600,
                height: 20,
                borderColor: 'var(--color-hairline, #e2e8f0)',
                color: 'text.secondary',
                fontFamily: 'var(--font-mono)',
              }}
            />

            {/* Actions Menu Trigger */}
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{ p: 0.5, color: 'text.secondary' }}
            >
              <MoreVertIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Box>

        {/* ── Title ── */}
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            fontSize: '0.925rem',
            lineHeight: 1.35,
            color: 'text.primary',
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {story.title}
        </Typography>

        {/* ── Footer: Assignee + Relative Time ── */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pt: 1.5,
            borderTop: '1px border-subtle var(--color-hairline, #f1f5f9)',
          }}
        >
          {/* Assignee Avatar */}
          {assignedUser ? (
            <Tooltip title={`Assigned to ${assignedUser.name}`} arrow>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar
                  sx={{
                    width: 24,
                    height: 24,
                    fontSize: 10,
                    fontWeight: 700,
                    bgcolor: assignedUser.avatarColor,
                  }}
                >
                  {getInitials(assignedUser.name)}
                </Avatar>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 500,
                    color: 'text.secondary',
                    fontSize: 12,
                    maxWidth: 100,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {assignedUser.name}
                </Typography>
              </Box>
            </Tooltip>
          ) : (
            <Typography
              variant="caption"
              sx={{
                color: 'text.disabled',
                fontSize: 11,
                fontStyle: 'italic',
              }}
            >
              Unassigned
            </Typography>
          )}

          {/* Timestamp */}
          <Typography
            variant="caption"
            sx={{
              color: 'text.disabled',
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
            }}
          >
            {formatRelativeTime(story.updatedDate || story.createdDate)}
          </Typography>
        </Box>
      </CardContent>

      {/* ── Card Context Menu ── */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={() => handleMenuClose()}
        onClick={(e) => e.stopPropagation()}
        slotProps={{
          paper: {
            elevation: 3,
            sx: { minWidth: 170, borderRadius: 2 },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            if (onEdit) onEdit(story);
          }}
        >
          <ListItemIcon>
            <EditRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Edit Story" />
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleMenuClose();
            if (onDelete) onDelete(story.id);
          }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon sx={{ color: 'error.main' }}>
            <DeleteRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Delete Story" />
        </MenuItem>

        <Divider />

        <Box sx={{ px: 2, py: 0.5 }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'text.disabled',
              fontSize: 10,
              letterSpacing: '0.05em',
            }}
          >
            Move Status
          </Typography>
        </Box>

        {WORKFLOW_STATUSES.map((status) => (
          <MenuItem
            key={status}
            disabled={status === story.status}
            onClick={() => handleMoveStatus(status)}
            sx={{ fontSize: 13, py: 0.75 }}
          >
            <ListItemIcon sx={{ minWidth: 28 }}>
              <ArrowForwardIcon
                sx={{
                  fontSize: 14,
                  color: status === story.status ? 'text.disabled' : 'primary.main',
                }}
              />
            </ListItemIcon>
            <ListItemText primary={status} />
          </MenuItem>
        ))}
      </Menu>
    </Card>
  );
};

export default KanbanCard;
