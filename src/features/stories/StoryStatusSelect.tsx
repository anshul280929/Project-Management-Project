import React from 'react';
import FormControl from '@mui/material/FormControl';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';

import { WorkflowStatus } from '../../types';
import { WORKFLOW_STATUSES, STATUS_COLORS } from '../../utils/constants';
import './StoryStatusSelect.css';

// ─── StoryStatusSelect ──────────────────────────────────
// Compact inline dropdown for changing a story's workflow
// status. Each option is color-coded to match the status.

interface StoryStatusSelectProps {
  /** Current status value */
  value: WorkflowStatus;
  /** Called when the user picks a new status */
  onChange: (status: WorkflowStatus) => void;
  /** Optional: make the select read-only */
  disabled?: boolean;
  /** Optional: compact size for table rows */
  compact?: boolean;
}

const StoryStatusSelect: React.FC<StoryStatusSelectProps> = ({
  value,
  onChange,
  disabled = false,
  compact = false,
}) => {
  const currentColor = STATUS_COLORS[value];

  const handleChange = (e: SelectChangeEvent<string>) => {
    e.stopPropagation();
    onChange(e.target.value as WorkflowStatus);
  };

  return (
    <FormControl
      size="small"
      className="story-status-select"
      onClick={(e) => e.stopPropagation()}
    >
      <Select
        value={value}
        onChange={handleChange}
        disabled={disabled}
        variant="outlined"
        sx={{
          minWidth: compact ? 130 : 150,
          height: compact ? 30 : 34,
          fontSize: compact ? 12 : 13,
          fontWeight: 600,
          backgroundColor: currentColor.bg,
          color: currentColor.text,
          border: `1px solid ${currentColor.border}`,
          borderRadius: 'var(--radius-sm)',
          transition: 'all 200ms ease',
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '& .MuiSelect-icon': {
            color: currentColor.text,
            fontSize: 18,
          },
          '&:hover': {
            backgroundColor: currentColor.bg,
            filter: 'brightness(0.97)',
          },
        }}
        MenuProps={{
          slotProps: {
            paper: {
              sx: {
                borderRadius: 'var(--radius-sm)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                mt: 0.5,
              },
            },
          },
        }}
      >
        {WORKFLOW_STATUSES.map((status) => {
          const color = STATUS_COLORS[status];
          return (
            <MenuItem key={status} value={status}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: color.border,
                    flexShrink: 0,
                  }}
                />
                {status}
              </Box>
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default StoryStatusSelect;
