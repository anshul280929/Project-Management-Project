import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import type { SxProps, Theme } from '@mui/material/styles';
import type { SvgIconComponent } from '@mui/icons-material';

// ─── EmptyState ─────────────────────────────────────────
// Centered placeholder for empty lists / views.
// Shows an optional icon, title, description, and CTA button.

interface EmptyStateProps {
  /** Main heading (e.g. "No projects yet") */
  title: string;
  /** Supportive description text */
  description?: string;
  /** Optional CTA button label */
  actionLabel?: string;
  /** Called when the CTA button is clicked */
  onAction?: () => void;
  /** Optional MUI icon component displayed above the title */
  icon?: SvgIconComponent;
  /** Optional sx overrides for the outer container */
  sx?: SxProps<Theme>;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon,
  sx,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: 10,
        px: 4,
        ...sx,
      }}
    >
      {/* ── Icon ── */}
      {Icon && (
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: 'rgba(189, 187, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <Icon
            sx={{
              fontSize: 36,
              color: 'var(--color-accent-periwinkle)',
            }}
          />
        </Box>
      )}

      {/* ── Title ── */}
      <Typography
        variant="h4"
        sx={{
          mb: description ? 1 : actionLabel ? 2 : 0,
          color: 'text.primary',
        }}
      >
        {title}
      </Typography>

      {/* ── Description ── */}
      {description && (
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            maxWidth: 360,
            mb: actionLabel ? 3 : 0,
          }}
        >
          {description}
        </Typography>
      )}

      {/* ── CTA Button ── */}
      {actionLabel && onAction && (
        <Button
          variant="contained"
          color="primary"
          onClick={onAction}
          sx={{
            px: 4,
          }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
