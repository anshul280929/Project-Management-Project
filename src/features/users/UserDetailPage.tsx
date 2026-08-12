import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';

import { useUsers } from '../../hooks/useUsers';
import { useStories } from '../../hooks/useStories';
import UserFormModal from './UserFormModal';
import { getInitials } from '../../utils/helpers';
import { ROLE_COLORS, PRIORITY_COLORS, STATUS_COLORS } from '../../utils/constants';
import { WorkflowStatus, UserRole } from '../../types';
import './UserDetailPage.css';

// ─── UserDetailPage ─────────────────────────────────────
// Detailed profile view for a single team member.
// Displays: avatar, name, role, stats, and a table of
// assigned stories within the current project.

const UserDetailPage: React.FC = () => {
  const { projectId, userId } = useParams<{ projectId: string; userId: string }>();
  const navigate = useNavigate();
  const { getUserById, updateUser } = useUsers();
  const { stories } = useStories(projectId);

  const [editModalOpen, setEditModalOpen] = useState(false);

  const user = userId ? getUserById(userId) : undefined;

  // Stories assigned to this user within this project
  const assignedStories = useMemo(() => {
    if (!userId) return [];
    return stories.filter((s) => s.assignedUserId === userId);
  }, [stories, userId]);

  // Stat breakdowns
  const stats = useMemo(() => {
    const total = assignedStories.length;
    const inProgress = assignedStories.filter(
      (s) => s.status === WorkflowStatus.IN_PROGRESS,
    ).length;
    const done = assignedStories.filter(
      (s) => s.status === WorkflowStatus.DONE,
    ).length;
    return { total, inProgress, done };
  }, [assignedStories]);

  if (!user) {
    return (
      <Box sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h5" color="text.secondary">
          User not found
        </Typography>
      </Box>
    );
  }

  const roleColor = ROLE_COLORS[user.role];

  const handleEditSubmit = (name: string, role: UserRole, avatarColor: string) => {
    updateUser({ ...user, name, role, avatarColor });
  };

  return (
    <Box>
      {/* ═══ Profile Hero ═══ */}
      <Box className="user-detail__hero">
        <Box className="user-detail__avatar-ring">
          <Avatar
            sx={{
              width: 90,
              height: 90,
              fontSize: 32,
              fontWeight: 600,
              bgcolor: user.avatarColor,
              border: '3px solid #fff',
            }}
          >
            {getInitials(user.name)}
          </Avatar>
        </Box>

        <Box className="user-detail__info">
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontWeight: 600, mb: 0.5 }}
          >
            {user.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Chip
              label={user.role}
              size="small"
              sx={{
                backgroundColor: roleColor.bg,
                color: roleColor.text,
                border: `1px solid ${roleColor.border}`,
                fontSize: 12,
                fontWeight: 600,
                height: 26,
              }}
            />
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
          </Box>
        </Box>
      </Box>

      {/* ═══ Stats Grid ═══ */}
      <Box className="user-detail__stats">
        <Box className="user-detail__stat-card">
          <Typography className="user-detail__stat-number">
            {stats.total}
          </Typography>
          <Typography className="user-detail__stat-label">
            Total Assigned
          </Typography>
        </Box>
        <Box
          className="user-detail__stat-card"
          sx={{ borderColor: 'var(--color-accent-blue, #47bfff) !important' }}
        >
          <Typography
            className="user-detail__stat-number"
            sx={{ color: 'var(--color-accent-blue-dark, #0077c8) !important' }}
          >
            {stats.inProgress}
          </Typography>
          <Typography className="user-detail__stat-label">
            In Progress
          </Typography>
        </Box>
        <Box
          className="user-detail__stat-card"
          sx={{ borderColor: 'var(--color-accent-mint, #31c48d) !important' }}
        >
          <Typography
            className="user-detail__stat-number"
            sx={{ color: 'var(--color-accent-mint-dark, #0e7040) !important' }}
          >
            {stats.done}
          </Typography>
          <Typography className="user-detail__stat-label">
            Done
          </Typography>
        </Box>
      </Box>

      {/* ═══ Assigned Stories Table ═══ */}
      <Box className="user-detail__section-header">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssignmentRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>
            Assigned Stories ({assignedStories.length})
          </Typography>
        </Box>
      </Box>

      {assignedStories.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 6,
            color: 'text.secondary',
            border: '1px dashed rgba(0,0,0,0.12)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <Typography variant="body2">
            No stories assigned to {user.name} in this project.
          </Typography>
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: '0.55px',
                    textTransform: 'uppercase',
                    color: 'text.secondary',
                  }}
                >
                  Title
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: '0.55px',
                    textTransform: 'uppercase',
                    color: 'text.secondary',
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: '0.55px',
                    textTransform: 'uppercase',
                    color: 'text.secondary',
                  }}
                >
                  Priority
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: '0.55px',
                    textTransform: 'uppercase',
                    color: 'text.secondary',
                  }}
                >
                  Points
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignedStories.map((story) => {
                const statusColor = STATUS_COLORS[story.status];
                const priorityColor = PRIORITY_COLORS[story.priority];

                return (
                  <TableRow
                    key={story.id}
                    hover
                    onClick={() =>
                      navigate(`/project/${projectId}/story/${story.id}`)
                    }
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {story.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={story.status}
                        size="small"
                        sx={{
                          backgroundColor: statusColor.bg,
                          color: statusColor.text,
                          border: `1px solid ${statusColor.border}`,
                          fontSize: 11,
                          fontWeight: 600,
                          height: 24,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={story.priority}
                        size="small"
                        sx={{
                          backgroundColor: priorityColor.bg,
                          color: priorityColor.text,
                          border: `1px solid ${priorityColor.border}`,
                          fontSize: 11,
                          fontWeight: 600,
                          height: 24,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 500,
                        }}
                      >
                        {story.storyPoints}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* ═══ Edit Modal ═══ */}
      <UserFormModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        user={user}
      />
    </Box>
  );
};

export default UserDetailPage;
