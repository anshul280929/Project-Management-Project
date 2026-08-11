import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import ViewKanbanRoundedIcon from '@mui/icons-material/ViewKanbanRounded';
import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';

// ─── Nav Item Definitions ──────────────────────────────
interface NavItem {
  label: string;
  icon: React.ReactNode;
  /** Path segment appended to /project/:projectId */
  path: string;
  /** If true, match the exact index route */
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: <DashboardRoundedIcon fontSize="small" />, path: '',       exact: true },
  { label: 'Board',     icon: <ViewKanbanRoundedIcon fontSize="small" />, path: 'board'  },
  { label: 'Stories',   icon: <ListAltRoundedIcon fontSize="small" />,    path: 'stories'},
  { label: 'Team',      icon: <GroupRoundedIcon fontSize="small" />,      path: 'team'   },
];

// ─── Component ─────────────────────────────────────────
export default function Sidebar() {
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const basePath = `/project/${projectId}`;

  /** Determine if a nav item is the active route */
  function isActive(item: NavItem): boolean {
    if (item.exact) {
      return location.pathname === basePath || location.pathname === `${basePath}/`;
    }
    return location.pathname.startsWith(`${basePath}/${item.path}`);
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        py: 3,
      }}
    >
      {/* ── Brand ── */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 3, mb: 4 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            background: 'linear-gradient(135deg, #fc4c02, #ef2cc1, #bdbbff)',
            borderRadius: '8px',
            flexShrink: 0,
          }}
        />
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: 16,
            color: '#ffffff',
            whiteSpace: 'nowrap',
          }}
        >
          Agile PM
        </Typography>
      </Box>

      {/* ── Nav Items ── */}
      <List component="nav" sx={{ flex: 1, px: 0.5 }}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item);
          return (
            <ListItemButton
              key={item.label}
              selected={active}
              onClick={() => navigate(item.exact ? basePath : `${basePath}/${item.path}`)}
              sx={{
                position: 'relative',
                // Active gradient left-edge indicator
                ...(active && {
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 3,
                    height: 20,
                    background: 'linear-gradient(180deg, #fc4c02, #ef2cc1, #bdbbff)',
                    borderRadius: '9999px',
                  },
                }),
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                slotProps={{ primary: { sx: { fontSize: 14, fontWeight: 500 } } }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* ── Divider + Back to Projects ── */}
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mx: 3, mb: 1 }} />
      <List component="nav" sx={{ px: 0.5 }}>
        <ListItemButton onClick={() => navigate('/')}>
          <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
            <ArrowBackRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="All Projects"
            slotProps={{ primary: { sx: { fontSize: 14, fontWeight: 500 } } }}
          />
        </ListItemButton>
      </List>
    </Box>
  );
}
