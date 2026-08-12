import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import AvatarGroup from '@mui/material/AvatarGroup';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

import type { Project, User } from '../../types';
import { formatDate } from '../../utils/helpers';
import { getInitials } from '../../utils/helpers';
import './ProjectCard.css';

// ─── ProjectCard ────────────────────────────────────────
// A rich card for the project list grid. Displays project
// name, truncated description, member avatars, story count,
// and creation date. Hover lifts the card.
// Edit / Delete icon buttons appear on hover.

interface ProjectCardProps {
  project: Project;
  storyCount: number;
  members: User[];
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  storyCount,
  members,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/project/${project.id}`);
  };

  return (
    <Card className="project-card" elevation={0}>
      {/* ── Action buttons (hover) ── */}
      <Box className="project-card__actions">
        <Tooltip title="Edit project" arrow>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(project);
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
        <Tooltip title="Delete project" arrow>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project);
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
        onClick={handleClick}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          p: 3,
          '&:last-child': { pb: 3 },
          cursor: 'pointer',
        }}
      >
        {/* ── Header row: icon + name ── */}
        <Stack direction="row" spacing={1.5} sx={{ mb: 1.5, alignItems: 'center' }}>
          <Box className="project-card__icon">
            <FolderOpenRoundedIcon sx={{ fontSize: 18, color: '#fff' }} />
          </Box>
          <Typography
            variant="h5"
            component="h3"
            sx={{
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {project.name}
          </Typography>
        </Stack>

        {/* ── Description ── */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.8em',
          }}
        >
          {project.description || 'No description provided.'}
        </Typography>

        {/* ── Member avatars ── */}
        {members.length > 0 && (
          <AvatarGroup
            max={4}
            sx={{
              mb: 2,
              justifyContent: 'flex-start',
              '& .MuiAvatar-root': {
                width: 28,
                height: 28,
                fontSize: 11,
                fontWeight: 600,
                border: '2px solid #fff',
              },
            }}
          >
            {members.map((m) => (
              <Avatar
                key={m.id}
                sx={{ bgcolor: m.avatarColor }}
                alt={m.name}
              >
                {getInitials(m.name)}
              </Avatar>
            ))}
          </AvatarGroup>
        )}

        {/* ── Spacer ── */}
        <Box sx={{ flex: 1 }} />

        {/* ── Meta row ── */}
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center' }}
          className="project-card__meta"
        >
          <Chip
            icon={<PeopleAltRoundedIcon sx={{ fontSize: '14px !important' }} />}
            label={`${members.length}`}
            size="small"
            variant="outlined"
            sx={{
              borderColor: 'rgba(0,0,0,0.08)',
              fontSize: 12,
              height: 26,
              '& .MuiChip-icon': { ml: 0.5 },
            }}
          />
          <Chip
            icon={<ArticleRoundedIcon sx={{ fontSize: '14px !important' }} />}
            label={`${storyCount}`}
            size="small"
            variant="outlined"
            sx={{
              borderColor: 'rgba(0,0,0,0.08)',
              fontSize: 12,
              height: 26,
              '& .MuiChip-icon': { ml: 0.5 },
            }}
          />

          <Box sx={{ flex: 1 }} />

          <Stack
            direction="row"
            spacing={0.5}
            sx={{ alignItems: 'center', color: 'text.secondary' }}
          >
            <CalendarTodayRoundedIcon sx={{ fontSize: 13 }} />
            <Typography
              variant="caption"
              sx={{ fontSize: 12, color: 'text.secondary' }}
            >
              {formatDate(project.createdDate)}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
