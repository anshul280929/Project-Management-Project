import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import Box from '@mui/material/Box';

// ─── ConfirmDialog ──────────────────────────────────────
// Generic "Are you sure?" confirmation modal.
// Used for destructive actions (delete project, story, user).

interface ConfirmDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Called when the dialog should close (Cancel or backdrop click) */
  onClose: () => void;
  /** Called when the user confirms the action */
  onConfirm: () => void;
  /** Dialog title (default: "Confirm Action") */
  title?: string;
  /** Dialog body message */
  message?: string;
  /** Label for the confirm button (default: "Delete") */
  confirmLabel?: string;
  /** Label for the cancel button (default: "Cancel") */
  cancelLabel?: string;
  /** If true, the confirm button uses error/destructive styling (default: true) */
  destructive?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to continue? This action cannot be undone.',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  destructive = true,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 'var(--radius-md)',
            p: 1,
          },
        },
      }}
    >
      {/* ── Title with warning icon ── */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          pb: 1,
        }}
      >
        {destructive && (
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 44, 193, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <WarningAmberRoundedIcon
              sx={{
                fontSize: 22,
                color: 'var(--color-accent-magenta)',
              }}
            />
          </Box>
        )}
        {title}
      </DialogTitle>

      {/* ── Message ── */}
      <DialogContent sx={{ pt: 0 }}>
        <DialogContentText
          sx={{
            color: 'text.secondary',
            fontSize: '14px',
          }}
        >
          {message}
        </DialogContentText>
      </DialogContent>

      {/* ── Actions ── */}
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: 'rgba(0, 0, 0, 0.12)',
            color: 'text.primary',
            '&:hover': {
              borderColor: 'rgba(0, 0, 0, 0.24)',
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
            },
          }}
        >
          {cancelLabel}
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          variant="contained"
          sx={
            destructive
              ? {
                  backgroundColor: 'var(--color-accent-magenta)',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: 'var(--color-accent-magenta-dark)',
                  },
                }
              : {}
          }
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
