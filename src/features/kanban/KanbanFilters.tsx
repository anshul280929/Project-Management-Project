import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';

import type { User } from '../../types';
import { Priority } from '../../types';
import { PRIORITIES } from '../../utils/constants';
import useFilters from '../../hooks/useFilters';
import './KanbanFilters.css';

interface KanbanFiltersProps {
  members: User[];
  currentUserId?: string | null;
  onCreateStory: () => void;
}

export const KanbanFilters: React.FC<KanbanFiltersProps> = ({
  members,
  currentUserId,
  onCreateStory,
}) => {
  const { filters, setFilter, clearFilters } = useFilters();

  const hasActiveFilters = Boolean(
    filters.search || filters.priority || filters.assignee || filters.myTasks
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        mb: 3.5,
        p: 2.25,
        backgroundColor: '#ffffff',
        borderRadius: 3,
        border: '1px solid var(--color-hairline, #e2e8f0)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
      }}
    >
      {/* ── Left Side: Filter inputs ── */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 1.5,
          flex: 1,
        }}
      >
        {/* 1. Search Bar */}
        <TextField
          size="small"
          placeholder="Filter stories..."
          value={filters.search}
          onChange={(e) => setFilter('search', e.target.value)}
          sx={{ minWidth: 220, flex: { xs: 1, sm: 'none' } }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                </InputAdornment>
              ),
            },
          }}
        />

        {/* 2. Assignee Dropdown */}
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select
            value={filters.assignee}
            onChange={(e) => setFilter('assignee', e.target.value)}
            displayEmpty
            renderValue={(selected) => {
              if (!selected) return <span style={{ color: '#94a3b8' }}>All Assignees</span>;
              if (selected === 'unassigned') return 'Unassigned';
              const user = members.find((m) => m.id === selected);
              return user ? user.name : 'Selected Assignee';
            }}
          >
            <MenuItem value="">
              <em>All Assignees</em>
            </MenuItem>
            <MenuItem value="unassigned">Unassigned</MenuItem>
            {members.map((member) => (
              <MenuItem key={member.id} value={member.id}>
                {member.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* 3. Priority Dropdown */}
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <Select
            value={filters.priority}
            onChange={(e) => setFilter('priority', e.target.value as Priority)}
            displayEmpty
            renderValue={(selected) => {
              if (!selected) return <span style={{ color: '#94a3b8' }}>All Priorities</span>;
              return `${selected} Priority`;
            }}
          >
            <MenuItem value="">
              <em>All Priorities</em>
            </MenuItem>
            {PRIORITIES.map((priority) => (
              <MenuItem key={priority} value={priority}>
                {priority}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* 4. My Tasks Pill */}
        {currentUserId && (
          <Tooltip title="Show stories assigned to me" arrow>
            <Chip
              icon={<PersonIcon sx={{ fontSize: 16 }} />}
              label="My Tasks"
              size="small"
              clickable
              color={filters.myTasks ? 'primary' : 'default'}
              variant={filters.myTasks ? 'filled' : 'outlined'}
              onClick={() => setFilter('myTasks', !filters.myTasks)}
              sx={{
                fontWeight: 600,
                height: 32,
                px: 0.5,
              }}
            />
          </Tooltip>
        )}

        {/* 5. Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            size="small"
            variant="text"
            startIcon={<ClearIcon />}
            onClick={clearFilters}
            sx={{ color: 'text.secondary', textTransform: 'none', fontSize: 13 }}
          >
            Clear Filters
          </Button>
        )}
      </Box>

      {/* ── Right Side: Create Story Action ── */}
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onCreateStory}
        sx={{
          fontWeight: 600,
          textTransform: 'none',
          px: 2.5,
          backgroundColor: '#000000',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#1f2937',
          },
        }}
      >
        Create Story
      </Button>
    </Box>
  );
};

export default KanbanFilters;
