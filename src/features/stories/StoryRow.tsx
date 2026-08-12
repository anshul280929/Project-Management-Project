import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

import type { Story, User } from '../../types';
import { PRIORITY_COLORS } from '../../utils/constants';
import { getInitials, formatDate } from '../../utils/helpers';
import StoryStatusSelect from './StoryStatusSelect';
import { WorkflowStatus } from '../../types';
import './StoryRow.css';

// ─── StoryRow ───────────────────────────────────────────
// Single data table row for the Story List page.
// Displays: Title, Status (inline select), Priority badge,
// Story Points, Assigned User, Created Date.

interface StoryRowProps {
  story: Story;
  /** Assigned user object (or undefined if unassigned) */
  assignedUser?: User;
  /** Called when the user changes the status via inline select */
  onStatusChange: (storyId: string, status: WorkflowStatus) => void;
}

const StoryRow: React.FC<StoryRowProps> = ({
  story,
  assignedUser,
  onStatusChange,
}) => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const priorityColor = PRIORITY_COLORS[story.priority];

  const handleRowClick = () => {
    navigate(`/project/${projectId}/story/${story.id}`);
  };

  return (
    <TableRow
      hover
      onClick={handleRowClick}
      className="story-row"
      sx={{ cursor: 'pointer' }}
    >
      {/* ── Title ── */}
      <TableCell>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            maxWidth: 320,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {story.title}
        </Typography>
      </TableCell>

      {/* ── Status (inline select) ── */}
      <TableCell>
        <StoryStatusSelect
          value={story.status}
          onChange={(status) => onStatusChange(story.id, status)}
          compact
        />
      </TableCell>

      {/* ── Priority ── */}
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

      {/* ── Story Points ── */}
      <TableCell align="center">
        <Typography
          variant="body2"
          sx={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          {story.storyPoints}
        </Typography>
      </TableCell>

      {/* ── Assigned User ── */}
      <TableCell>
        {assignedUser ? (
          <Tooltip title={assignedUser.name} arrow>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{
                  width: 26,
                  height: 26,
                  fontSize: 11,
                  fontWeight: 600,
                  bgcolor: assignedUser.avatarColor,
                }}
              >
                {getInitials(assignedUser.name)}
              </Avatar>
              <Typography
                variant="body2"
                sx={{
                  fontSize: 13,
                  maxWidth: 120,
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
          <Typography variant="body2" sx={{ color: 'text.disabled', fontSize: 13 }}>
            Unassigned
          </Typography>
        )}
      </TableCell>

      {/* ── Created Date ── */}
      <TableCell>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: 12,
            fontFamily: 'var(--font-mono)',
          }}
        >
          {formatDate(story.createdDate)}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

export default StoryRow;
