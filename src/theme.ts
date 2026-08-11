import { createTheme } from '@mui/material/styles';

// ─── Design Tokens (from DESIGN.md) ─────────────────────
const tokens = {
  colors: {
    primary:          '#000000',
    onPrimary:        '#ffffff',
    ink:              '#000000',
    body:             '#959494',
    canvas:           '#ffffff',
    canvasDark:       '#010120',
    surfaceDark:      '#313641',
    onDark:           '#ffffff',
    accentOrange:     '#fc4c02',
    accentMagenta:    '#ef2cc1',
    accentPeriwinkle: '#bdbbff',
    accentMint:       '#c8f6f9',
    hairline:         '#959494',
  },
  fonts: {
    display: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    mono:    "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace",
  },
  radii: {
    xs:   3.25,
    sm:   4,
    md:   8,
    full: 9999,
  },
} as const;

// ─── MUI Theme ──────────────────────────────────────────
const theme = createTheme({
  // ── Palette ──
  palette: {
    primary: {
      main:         tokens.colors.primary,
      contrastText: tokens.colors.onPrimary,
    },
    secondary: {
      main:         tokens.colors.accentPeriwinkle,
      contrastText: tokens.colors.ink,
    },
    error: {
      main: tokens.colors.accentMagenta,
    },
    warning: {
      main: tokens.colors.accentOrange,
    },
    info: {
      main: '#47bfff',
    },
    success: {
      main: '#31c48d',
    },
    text: {
      primary:   tokens.colors.ink,
      secondary: tokens.colors.body,
    },
    background: {
      default: tokens.colors.canvas,
      paper:   tokens.colors.canvas,
    },
    divider: 'rgba(0, 0, 0, 0.08)',
  },

  // ── Typography ──
  typography: {
    fontFamily: tokens.fonts.display,

    // Display variants
    h1: {
      fontFamily: tokens.fonts.display,
      fontSize:   '64px',
      fontWeight: 500,
      lineHeight: '70.4px',
      letterSpacing: '-1.92px',
    },
    h2: {
      fontFamily: tokens.fonts.display,
      fontSize:   '40px',
      fontWeight: 500,
      lineHeight: '48px',
      letterSpacing: '-0.8px',
    },
    h3: {
      fontFamily: tokens.fonts.display,
      fontSize:   '28px',
      fontWeight: 500,
      lineHeight: '32.2px',
      letterSpacing: '-0.42px',
    },
    h4: {
      fontFamily: tokens.fonts.display,
      fontSize:   '22px',
      fontWeight: 500,
      lineHeight: '25.3px',
      letterSpacing: '-0.22px',
    },
    h5: {
      fontFamily: tokens.fonts.display,
      fontSize:   '18px',
      fontWeight: 500,
      lineHeight: '23.4px',
      letterSpacing: '-0.18px',
    },
    h6: {
      fontFamily: tokens.fonts.display,
      fontSize:   '16px',
      fontWeight: 500,
      lineHeight: '20.8px',
      letterSpacing: '-0.16px',
    },
    body1: {
      fontFamily: tokens.fonts.display,
      fontSize:   '16px',
      fontWeight: 400,
      lineHeight: '20.8px',
      letterSpacing: '-0.16px',
    },
    body2: {
      fontFamily: tokens.fonts.display,
      fontSize:   '14px',
      fontWeight: 400,
      lineHeight: '19.6px',
    },
    caption: {
      fontFamily: tokens.fonts.display,
      fontSize:   '14px',
      fontWeight: 400,
      lineHeight: '19.6px',
    },
    overline: {
      fontFamily:    tokens.fonts.mono,
      fontSize:      '11px',
      fontWeight:    500,
      lineHeight:    '11px',
      letterSpacing: '0.55px',
      textTransform: 'uppercase' as const,
    },
    button: {
      fontFamily:    tokens.fonts.mono,
      fontSize:      '14px',
      fontWeight:    500,
      lineHeight:    '16px',
      letterSpacing: '0.08px',
      textTransform: 'uppercase' as const,
    },
  },

  // ── Shape ──
  shape: {
    borderRadius: tokens.radii.sm,
  },

  // ── Spacing (base = 8px, MUI default) ──
  spacing: 8,

  // ── Component Overrides ──
  components: {
    // ─ Global baseline ─
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: tokens.fonts.display,
          color: tokens.colors.ink,
          backgroundColor: tokens.colors.canvas,
        },
      },
    },

    // ─ Button ─
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          fontFamily:    tokens.fonts.mono,
          fontSize:      '14px',
          fontWeight:    500,
          letterSpacing: '0.08px',
          textTransform: 'uppercase' as const,
          borderRadius:  tokens.radii.sm,
          padding:       '8px 24px',
          transition:    'all 150ms ease',
        },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            backgroundColor: tokens.colors.primary,
            color:           tokens.colors.onPrimary,
            '&:hover': {
              backgroundColor: '#1a1a1a',
            },
          },
        },
        {
          props: { variant: 'contained', color: 'secondary' },
          style: {
            backgroundColor: tokens.colors.accentMint,
            color:           tokens.colors.ink,
            '&:hover': {
              backgroundColor: '#a8e8eb',
            },
          },
        },
        {
          props: { variant: 'outlined' },
          style: {
            borderColor: 'rgba(0, 0, 0, 0.08)',
            color:       tokens.colors.ink,
            '&:hover': {
              borderColor:     'rgba(0, 0, 0, 0.2)',
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
            },
          },
        },
        {
          props: { variant: 'text' },
          style: {
            color: tokens.colors.ink,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          },
        },
      ],
    },

    // ─ Card ─
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: tokens.radii.sm,
          border:       '1px solid rgba(0, 0, 0, 0.08)',
          transition:   'all 250ms ease',
          '&:hover': {
            transform:  'translateY(-2px)',
            boxShadow:  '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)',
            borderColor: 'rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },

    // ─ Chip (used for badges) ─
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily:    tokens.fonts.display,
          fontSize:      '12px',
          fontWeight:    500,
          borderRadius:  tokens.radii.sm,
          height:        '24px',
        },
      },
    },

    // ─ Dialog (Modal) ─
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: tokens.radii.md,
          boxShadow:    '0 16px 48px rgba(0, 0, 0, 0.16), 0 4px 16px rgba(0, 0, 0, 0.08)',
        },
      },
    },

    // ─ TextField / Input ─
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size:    'small',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: tokens.radii.sm,
            fontSize:     '16px',
            fontFamily:   tokens.fonts.display,
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.08)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.2)',
            },
            '&.Mui-focused fieldset': {
              borderColor: tokens.colors.accentPeriwinkle,
              borderWidth: '2px',
            },
          },
          '& .MuiInputLabel-root': {
            fontFamily: tokens.fonts.display,
            fontSize:   '14px',
          },
        },
      },
    },

    // ─ Select ─
    MuiSelect: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          borderRadius: tokens.radii.sm,
          fontFamily:   tokens.fonts.display,
          fontSize:     '16px',
        },
      },
    },

    // ─ Avatar ─
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontFamily: tokens.fonts.display,
          fontWeight: 500,
          fontSize:   '14px',
        },
      },
    },

    // ─ Paper ─
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: tokens.radii.sm,
        },
      },
    },

    // ─ AppBar (if used) ─
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundColor: tokens.colors.canvas,
          color:           tokens.colors.ink,
          borderBottom:    '1px solid rgba(0, 0, 0, 0.08)',
        },
      },
    },

    // ─ Drawer (Sidebar) ─
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: tokens.colors.canvasDark,
          color:           tokens.colors.onDark,
          borderRight:     'none',
        },
      },
    },

    // ─ List Items (for sidebar nav) ─
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius:  tokens.radii.md,
          fontFamily:    tokens.fonts.display,
          fontSize:      '14px',
          fontWeight:    500,
          color:         tokens.colors.body,
          margin:        '2px 8px',
          padding:       '8px 16px',
          '&:hover': {
            color:           tokens.colors.onDark,
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
          },
          '&.Mui-selected': {
            color:           tokens.colors.onDark,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
            },
          },
        },
      },
    },

    // ─ Tooltip ─
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: tokens.colors.surfaceDark,
          color:           tokens.colors.onDark,
          fontFamily:      tokens.fonts.display,
          fontSize:        '12px',
          borderRadius:    tokens.radii.sm,
        },
      },
    },

    // ─ Table ─
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontFamily:    tokens.fonts.mono,
            fontSize:      '11px',
            fontWeight:    500,
            letterSpacing: '0.55px',
            textTransform: 'uppercase' as const,
            color:         tokens.colors.body,
            borderBottom:  '1px solid rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily:   tokens.fonts.display,
          fontSize:     '14px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          padding:      '12px 16px',
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 150ms ease',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
          },
          cursor: 'pointer',
        },
      },
    },
  },
});

export default theme;
