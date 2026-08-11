import React from 'react';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';

// ─── FilterBar ──────────────────────────────────────────
// Generic horizontal container for filter controls.
// Feature-specific filters (Select dropdowns, Chips, toggles)
// are composed as children inside this bar.

interface ActiveFilter {
  /** Unique key for this filter (e.g. 'status', 'priority') */
  key: string;
  /** Display label shown on the chip */
  label: string;
}

interface FilterBarProps {
  /** Filter control elements (MUI Select, SearchBar, etc.) */
  children: React.ReactNode;
  /** Currently active filters displayed as removable chips */
  activeFilters?: ActiveFilter[];
  /** Called when a filter chip is removed */
  onRemoveFilter?: (key: string) => void;
  /** Called when "Clear all" is clicked */
  onClearAll?: () => void;
  /** Optional sx overrides */
  sx?: SxProps<Theme>;
}

const FilterBar: React.FC<FilterBarProps> = ({
  children,
  activeFilters = [],
  onRemoveFilter,
  onClearAll,
  sx,
}) => {
  return (
    <Stack spacing={1.5} sx={sx}>
      {/* ── Filter Controls Row ── */}
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}
      >
        {children}
      </Stack>

      {/* ── Active Filter Chips ── */}
      {activeFilters.length > 0 && (
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1 }}
        >
          <Typography
            variant="overline"
            sx={{ color: 'text.secondary', mr: 0.5 }}
          >
            Active:
          </Typography>

          {activeFilters.map((filter) => (
            <Chip
              key={filter.key}
              label={filter.label}
              size="small"
              onDelete={
                onRemoveFilter
                  ? () => onRemoveFilter(filter.key)
                  : undefined
              }
              sx={{
                backgroundColor: 'rgba(189, 187, 255, 0.15)',
                color: 'text.primary',
                fontWeight: 500,
                '& .MuiChip-deleteIcon': {
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'text.primary',
                  },
                },
              }}
            />
          ))}

          {activeFilters.length > 1 && onClearAll && (
            <Chip
              label="Clear all"
              size="small"
              variant="outlined"
              onClick={onClearAll}
              sx={{
                cursor: 'pointer',
                borderColor: 'rgba(0, 0, 0, 0.12)',
                color: 'text.secondary',
                '&:hover': {
                  borderColor: 'rgba(0, 0, 0, 0.3)',
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            />
          )}
        </Stack>
      )}
    </Stack>
  );
};

export default FilterBar;
