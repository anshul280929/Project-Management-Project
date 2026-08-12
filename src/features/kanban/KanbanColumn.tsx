import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';

import type { Story, User } from '../../types';
import { WorkflowStatus } from '../../types';
import { STATUS_COLORS } from '../../utils/constants';
import KanbanCard from './KanbanCard';
import './KanbanColumn.css';

interface KanbanColumnProps {
  status: WorkflowStatus;
  stories: Story[];
  usersMap: Map<string, User>;
  onAddStory: (status: WorkflowStatus) => void;
  onEditStory: (story: Story) => void;
  onDeleteStory: (storyId: string) => void;
  onStatusChange: (storyId: string, status: WorkflowStatus) => void;
  onDropStory: (storyId: string, targetStatus: WorkflowStatus) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  stories,
  usersMap,
  onAddStory,
  onEditStory,
  onDeleteStory,
  onStatusChange,
  onDropStory,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const statusColor = STATUS_COLORS[status];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Check if we left the column container itself
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    if (!e.currentTarget.contains(relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const storyId = e.dataTransfer.getData('text/plain');
    if (storyId) {
      onDropStory(storyId, status);
    }
  };

  return (
    <Paper
      elevation={0}
      className={`kanban-column ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      sx={{
        flex: 1,
        minWidth: { xs: 280, sm: 300 },
        maxWidth: { md: 360 },
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-bg-subtle, #f8fafc)',
        borderRadius: 3,
        border: '1px solid var(--color-hairline, #e2e8f0)',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        minHeight: 480,
      }}
    >
      {/* ── Top Color Accent Bar ── */}
      <Box
        sx={{
          height: 4,
          backgroundColor: statusColor.border,
          width: '100%',
        }}
      />

      {/* ── Column Header ── */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--color-hairline, #e2e8f0)',
          backgroundColor: '#ffffff',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              fontSize: '0.875rem',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: 'text.primary',
            }}
          >
            {status}
          </Typography>

          <Chip
            label={stories.length}
            size="small"
            sx={{
              height: 20,
              fontSize: 11,
              fontWeight: 700,
              backgroundColor: statusColor.bg,
              color: statusColor.text,
              border: `1px solid ${statusColor.border}`,
              minWidth: 24,
            }}
          />
        </Box>

        <Tooltip title={`Add story to ${status}`} arrow>
          <IconButton
            size="small"
            onClick={() => onAddStory(status)}
            sx={{
              color: 'text.secondary',
              hover: { backgroundColor: 'action.hover' },
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* ── Scrollable Cards Area ── */}
      <Box
        className="kanban-column-cards"
        sx={{
          flex: 1,
          p: 1.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 260px)',
        }}
      >
        {stories.length > 0 ? (
          stories.map((story) => (
            <KanbanCard
              key={story.id}
              story={story}
              assignedUser={story.assignedUserId ? usersMap.get(story.assignedUserId) : undefined}
              onEdit={onEditStory}
              onDelete={onDeleteStory}
              onStatusChange={onStatusChange}
            />
          ))
        ) : (
          <Box
            className="kanban-empty-dropzone"
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 3,
              borderRadius: 2,
              border: '2px dashed var(--color-hairline, #cbd5e1)',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              textAlign: 'center',
              minHeight: 140,
              transition: 'all 0.2s ease',
            }}
          >
            <Typography variant="body2" sx={{ color: 'text.disabled', fontSize: 13, mb: 1 }}>
              No stories in {status}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: 11 }}>
              Drag stories here or click + to add
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default KanbanColumn;
