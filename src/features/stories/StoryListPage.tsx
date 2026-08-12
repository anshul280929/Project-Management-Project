import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import FilterAltOffRoundedIcon from '@mui/icons-material/FilterAltOffRounded';

import { useStories, type CreateStoryInput } from '../../hooks/useStories';
import { useUsers } from '../../hooks/useUsers';
import { useFilters } from '../../hooks/useFilters';
import { filterStories } from '../../utils/helpers';
import { StorageService } from '../../services/storageService';
import { PRIORITIES, WORKFLOW_STATUSES } from '../../utils/constants';
import { Priority, WorkflowStatus } from '../../types';
import StoryRow from './StoryRow';
import StoryFormModal from './StoryFormModal';
import EmptyState from '../../components/ui/EmptyState';
import SearchBar from '../../components/ui/SearchBar';
import './StoryListPage.css';

// ─── StoryListPage ──────────────────────────────────────
// Story management page for a project. Displays a filterable,
// searchable data table of StoryRow components with create story.

// Mono caps table header style (reusable for all columns)
const tableHeadCellSx = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: '0.55px',
  textTransform: 'uppercase' as const,
  color: 'text.secondary',
  whiteSpace: 'nowrap' as const,
};

const StoryListPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { stories, addStory, changeStatus } = useStories(projectId);
  const { users, projectMembers } = useUsers();
  const { filters, setFilter, clearFilters } = useFilters();

  const [modalOpen, setModalOpen] = useState(false);

  // Members for filter dropdown
  const members = useMemo(
    () => (projectId ? projectMembers(projectId) : []),
    [projectId, projectMembers],
  );

  // Build user lookup map
  const userMap = useMemo(() => {
    const map: Record<string, (typeof users)[0]> = {};
    for (const u of users) {
      map[u.id] = u;
    }
    return map;
  }, [users]);

  // Apply filters to stories
  const currentUserId = StorageService.getCurrentUserId();
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

  // Check if any filters are active
  const hasActiveFilters = Boolean(
    filters.search || filters.status || filters.priority || filters.assignee || filters.myTasks,
  );

  const handleCreateStory = (data: {
    title: string;
    description: string;
    priority: Priority;
    storyPoints: number;
    assignedUserId: string | null;
    status: WorkflowStatus;
  }) => {
    if (!projectId) return;
    const input: CreateStoryInput = {
      projectId,
      ...data,
    };
    addStory(input);
  };

  const handleStatusChange = (storyId: string, status: WorkflowStatus) => {
    changeStatus(storyId, status);
  };

  return (
    <Box>
      {/* ── Page header ── */}
      <Box className="story-list-page__header">
        <Box className="story-list-page__header-left">
          <AutoStoriesRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>
            {stories.length} {stories.length === 1 ? 'story' : 'stories'}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddRoundedIcon />}
          onClick={() => setModalOpen(true)}
          sx={{ px: 3 }}
        >
          Create Story
        </Button>
      </Box>

      {/* ── Filter / Search bar ── */}
      <Box className="story-list-page__filters">
        <SearchBar
          value={filters.search}
          onChange={(value) => setFilter('search', value)}
          placeholder="Search stories…"
          sx={{ flex: 1, minWidth: 200 }}
          fullWidth={false}
        />

        <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap' }}>
          {/* Status filter */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="filter-status-label">Status</InputLabel>
            <Select
              labelId="filter-status-label"
              value={filters.status}
              label="Status"
              onChange={(e) => setFilter('status', e.target.value as WorkflowStatus | '')}
            >
              <MenuItem value="">All Statuses</MenuItem>
              {WORKFLOW_STATUSES.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Priority filter */}
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel id="filter-priority-label">Priority</InputLabel>
            <Select
              labelId="filter-priority-label"
              value={filters.priority}
              label="Priority"
              onChange={(e) => setFilter('priority', e.target.value as Priority | '')}
            >
              <MenuItem value="">All Priorities</MenuItem>
              {PRIORITIES.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Assignee filter */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="filter-assignee-label">Assignee</InputLabel>
            <Select
              labelId="filter-assignee-label"
              value={filters.assignee}
              label="Assignee"
              onChange={(e) => setFilter('assignee', e.target.value)}
            >
              <MenuItem value="">All Members</MenuItem>
              {members.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* My Tasks toggle */}
          <Chip
            label="My Tasks"
            variant={filters.myTasks ? 'filled' : 'outlined'}
            onClick={() => setFilter('myTasks', !filters.myTasks)}
            sx={{
              height: 36,
              borderRadius: 'var(--radius-full)',
              fontWeight: 500,
              fontSize: 13,
              cursor: 'pointer',
              ...(filters.myTasks
                ? {
                    backgroundColor: 'var(--color-ink)',
                    color: '#fff',
                    '&:hover': { backgroundColor: 'var(--color-ink)' },
                  }
                : {
                    borderColor: 'rgba(0,0,0,0.16)',
                    '&:hover': { borderColor: 'rgba(0,0,0,0.32)' },
                  }),
            }}
          />

          {/* Clear filters */}
          {hasActiveFilters && (
            <Chip
              label="Clear"
              icon={<FilterAltOffRoundedIcon sx={{ fontSize: '16px !important' }} />}
              variant="outlined"
              onClick={clearFilters}
              onDelete={clearFilters}
              sx={{
                height: 36,
                borderRadius: 'var(--radius-full)',
                fontWeight: 500,
                fontSize: 13,
                borderColor: 'rgba(0,0,0,0.12)',
                '& .MuiChip-deleteIcon': {
                  fontSize: 16,
                  color: 'text.secondary',
                },
              }}
            />
          )}
        </Stack>
      </Box>

      {/* ── Stories Table / Empty State ── */}
      {stories.length === 0 ? (
        <EmptyState
          icon={AutoStoriesRoundedIcon}
          title="No stories yet"
          description="Create your first user story to start tracking work in this project."
          actionLabel="Create Story"
          onAction={() => setModalOpen(true)}
        />
      ) : filteredStories.length === 0 ? (
        <EmptyState
          icon={FilterAltOffRoundedIcon}
          title="No matching stories"
          description="Try adjusting your filters or search query."
          actionLabel="Clear Filters"
          onAction={clearFilters}
        />
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
                <TableCell sx={tableHeadCellSx}>Title</TableCell>
                <TableCell sx={tableHeadCellSx}>Status</TableCell>
                <TableCell sx={tableHeadCellSx}>Priority</TableCell>
                <TableCell sx={{ ...tableHeadCellSx, textAlign: 'center' }}>
                  Points
                </TableCell>
                <TableCell sx={tableHeadCellSx}>Assignee</TableCell>
                <TableCell sx={tableHeadCellSx}>Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStories.map((story) => (
                <StoryRow
                  key={story.id}
                  story={story}
                  assignedUser={
                    story.assignedUserId
                      ? userMap[story.assignedUserId]
                      : undefined
                  }
                  onStatusChange={handleStatusChange}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* ── Create Story Modal ── */}
      <StoryFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateStory}
      />
    </Box>
  );
};

export default StoryListPage;
