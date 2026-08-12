import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';

import type { Story, User } from '../../types';
import { WorkflowStatus, Priority } from '../../types';
import { WORKFLOW_STATUSES, STATUS_COLORS } from '../../utils/constants';
import { filterStories } from '../../utils/helpers';
import { useActiveProject } from '../../hooks/useActiveProject';
import { useStories, type CreateStoryInput } from '../../hooks/useStories';
import { useUsers } from '../../hooks/useUsers';
import useFilters from '../../hooks/useFilters';
import { StorageService } from '../../services/storageService';
import KanbanFilters from './KanbanFilters';
import KanbanColumn from './KanbanColumn';
import StoryFormModal from '../stories/StoryFormModal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import './KanbanPage.css';

export const KanbanPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const project = useActiveProject();

  const { stories, addStory, updateStory, deleteStory, changeStatus } = useStories(projectId);
  const { users, projectMembers } = useUsers();
  const { filters, clearFilters } = useFilters();

  // State for Create / Edit Story Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<WorkflowStatus>(WorkflowStatus.BACKLOG);

  // State for Delete Confirmation Dialog
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Project Members
  const members = useMemo(
    () => (projectId ? projectMembers(projectId) : []),
    [projectId, projectMembers]
  );

  // User Map for fast lookup
  const usersMap = useMemo(() => {
    const map = new Map<string, User>();
    users.forEach((user) => map.set(user.id, user));
    return map;
  }, [users]);

  // Current logged in user ID for "My Tasks" filter
  const currentUserId = StorageService.getCurrentUserId();

  // Filtered stories according to search & filter criteria
  const filteredStories = useMemo(() => {
    return filterStories(stories, {
      search: filters.search || undefined,
      status: (filters.status as WorkflowStatus) || undefined,
      priority: (filters.priority as Priority) || undefined,
      assignee: filters.assignee || undefined,
      myTasks: filters.myTasks,
      currentUserId: currentUserId ?? undefined,
    });
  }, [stories, filters, currentUserId]);

  // Modal Handlers
  const handleOpenCreateModal = (status?: WorkflowStatus) => {
    setEditingStory(null);
    setDefaultStatus(status || WorkflowStatus.BACKLOG);
    setModalOpen(true);
  };

  const handleOpenEditModal = (story: Story) => {
    setEditingStory(story);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingStory(null);
  };

  const handleModalSubmit = (data: {
    title: string;
    description: string;
    priority: Priority;
    storyPoints: number;
    assignedUserId: string | null;
    status: WorkflowStatus;
  }) => {
    if (!projectId) return;

    if (editingStory) {
      updateStory({
        ...editingStory,
        ...data,
      });
    } else {
      const input: CreateStoryInput = {
        projectId,
        ...data,
      };
      addStory(input);
    }
    handleCloseModal();
  };

  // Delete Handler
  const handleDeleteConfirm = () => {
    if (deleteConfirmId) {
      deleteStory(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  // Drag and Drop Handler
  const handleDropStory = (storyId: string, targetStatus: WorkflowStatus) => {
    const targetStory = stories.find((s) => s.id === storyId);
    if (targetStory && targetStory.status !== targetStatus) {
      changeStatus(storyId, targetStatus);
    }
  };

  // Status Change Handler (Dropdown alternative to drag-and-drop)
  const handleStatusChange = (storyId: string, newStatus: WorkflowStatus) => {
    changeStatus(storyId, newStatus);
  };

  if (!project && projectId) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Project not found.
        </Typography>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/')}>
          Return to Projects
        </Button>
      </Box>
    );
  }

  return (
    <Box className="kanban-page" sx={{ display: 'flex', flexDirection: 'column', pb: 4 }}>
      {/* ── Page Header & Stats Band ── */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.5rem', sm: '1.75rem' },
              color: 'text.primary',
              letterSpacing: '-0.02em',
              mb: 0.5,
            }}
          >
            Kanban Board
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
            Drag and drop cards across columns to update workflow status in real time.
          </Typography>
        </Box>

        {/* Breakdown Metric Chips */}
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          <Chip
            label={`Total: ${stories.length}`}
            variant="outlined"
            size="small"
            sx={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}
          />
          {WORKFLOW_STATUSES.map((st) => {
            const count = stories.filter((s) => s.status === st).length;
            const statusColor = STATUS_COLORS[st];
            return (
              <Chip
                key={st}
                label={`${st}: ${count}`}
                size="small"
                sx={{
                  fontWeight: 600,
                  fontSize: 11,
                  backgroundColor: statusColor.bg,
                  color: statusColor.text,
                  border: `1px solid ${statusColor.border}`,
                  fontFamily: 'var(--font-mono)',
                }}
              />
            );
          })}
        </Stack>
      </Box>

      {/* ── Kanban Filters Component ── */}
      <KanbanFilters
        members={members}
        currentUserId={currentUserId}
        onCreateStory={() => handleOpenCreateModal(WorkflowStatus.BACKLOG)}
      />

      {/* ── Main Board Content / Empty States ── */}
      {stories.length === 0 ? (
        <EmptyState
          icon={ViewWeekIcon}
          title="No stories on the board"
          description="Create your first user story to populate the Kanban columns."
          actionLabel="Create Story"
          onAction={() => handleOpenCreateModal(WorkflowStatus.BACKLOG)}
        />
      ) : filteredStories.length === 0 ? (
        <EmptyState
          icon={FilterAltOffIcon}
          title="No matching stories found"
          description="Try adjusting or clearing your filters to see cards on the board."
          actionLabel="Clear Filters"
          onAction={clearFilters}
        />
      ) : (
        /* ── 4 Columns Grid (horizontally scrollable on small screens) ── */
        <Box
          className="kanban-board-grid"
          sx={{
            display: 'flex',
            gap: 2.5,
            overflowX: 'auto',
            pb: 2,
            alignItems: 'stretch',
          }}
        >
          {WORKFLOW_STATUSES.map((status) => {
            const columnStories = filteredStories.filter((s) => s.status === status);
            return (
              <KanbanColumn
                key={status}
                status={status}
                stories={columnStories}
                usersMap={usersMap}
                onAddStory={handleOpenCreateModal}
                onEditStory={handleOpenEditModal}
                onDeleteStory={(id) => setDeleteConfirmId(id)}
                onStatusChange={handleStatusChange}
                onDropStory={handleDropStory}
              />
            );
          })}
        </Box>
      )}

      {/* ── Story Form Modal (Create / Edit) ── */}
      <StoryFormModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        story={
          editingStory ||
          ({
            status: defaultStatus,
          } as Story)
        }
      />

      {/* ── Confirm Delete Dialog ── */}
      <ConfirmDialog
        open={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete User Story"
        message="Are you sure you want to delete this story? This action cannot be undone."
        confirmLabel="Delete Story"
        destructive
      />
    </Box>
  );
};

export default KanbanPage;
