import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';

import type { User } from '../../types';
import { getInitials } from '../../utils/helpers';
import { ROLE_COLORS } from '../../utils/constants';
import './UserCard.css';

// ─── UserCard ───────────────────────────────────────────
// A rich card for the team member grid. Displays user avatar,
// name, role badge, and assigned story count.
// Edit / Delete icon buttons appear on hover.

interface UserCardProps {
  user: User;
  assignedStoryCount: number;
  projectId: string;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  assignedStoryCount,
  projectId,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();

  const roleColor = ROLE_COLORS[user.role];

  const handleCardClick = () => {
    navigate(`/project/${projectId}/team/${user.id}`);
  };

  return (
    <Card className="user-card" elevation={0}>
      {/* ── Action buttons (hover) ── */}
      <Box className="user-card__actions">
        <Tooltip title="Edit member" arrow>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(user);
            }}
            sx={{
              bgcolor: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(4px)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
              '&:hover': { bgcolor: '#fff' },
            }}
          >
            <EditRoundedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Remove member" arrow>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(user);
            }}
            sx={{
              bgcolor: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(4px)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
              '&:hover': {
                bgcolor: '#fff',
                color: 'var(--color-accent-magenta)',
              },
            }}
          >
            <DeleteRoundedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* ── Card body (clickable) ── */}
      <CardContent
        onClick={handleCardClick}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          height: '100%',
          p: 3,
          '&:last-child': { pb: 3 },
          cursor: 'pointer',
        }}
      >
        {/* ── Avatar with gradient ring ── */}
        <Box className="user-card__avatar-ring" sx={{ mb: 2 }}>
          <Avatar
            sx={{
              width: 62,
              height: 62,
              fontSize: 22,
              fontWeight: 600,
              bgcolor: user.avatarColor,
              border: '3px solid #fff',
            }}
            alt={user.name}
          >
            {getInitials(user.name)}
          </Avatar>
        </Box>

        {/* ── Name ── */}
        <Typography
          variant="h5"
          component="h3"
          sx={{
            fontWeight: 600,
            mb: 0.75,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%',
          }}
        >
          {user.name}
        </Typography>

        {/* ── Role badge ── */}
        <Chip
          label={user.role}
          size="small"
          sx={{
            backgroundColor: roleColor.bg,
            color: roleColor.text,
            border: `1px solid ${roleColor.border}`,
            fontSize: 11,
            fontWeight: 600,
            height: 24,
            mb: 2,
          }}
        />

        {/* ── Spacer ── */}
        <Box sx={{ flex: 1 }} />

        {/* ── Stats row ── */}
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: 'center', width: '100%', justifyContent: 'center' }}
          className="user-card__meta"
        >
          <Chip
            icon={<AssignmentRoundedIcon sx={{ fontSize: '14px !important' }} />}
            label={`${assignedStoryCount} ${assignedStoryCount === 1 ? 'story' : 'stories'}`}
            size="small"
            variant="outlined"
            sx={{
              borderColor: 'rgba(0,0,0,0.08)',
              fontSize: 12,
              height: 26,
              '& .MuiChip-icon': { ml: 0.5 },
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default UserCard;
