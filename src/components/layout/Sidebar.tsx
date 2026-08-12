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
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import WorkspacesRoundedIcon from '@mui/icons-material/WorkspacesRounded';
import { useAppContext } from '../../context/AppContext';

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
  const { state } = useAppContext();
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

  /** Switch to target project while preserving current tab route if applicable */
  function handleSwitchProject(targetProjectId: string) {
    if (targetProjectId === projectId) return;
    const match = location.pathname.match(/\/project\/[^/]+(\/(board|stories|team))?/);
    const subRoute = match?.[1] ?? '';
    navigate(`/project/${targetProjectId}${subRoute}`);
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        py: 3,
        overflow: 'hidden',
      }}
    >
      {/* ── Brand ── */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 3, mb: 3 }}>
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

      {/* ── Workspace Section (All Projects) ── */}
      <Box sx={{ px: 2, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <WorkspacesRoundedIcon sx={{ fontSize: 16, color: '#ef2cc1' }} />
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(255, 255, 255, 0.5)',
            fontWeight: 700,
            fontSize: '0.68rem',
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}
        >
          Workspace
        </Typography>
      </Box>

      <List
        component="nav"
        disablePadding
        sx={{
          maxHeight: 180,
          overflowY: 'auto',
          px: 1,
          mb: 2,
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'rgba(255,255,255,0.15)',
            borderRadius: 2,
          },
        }}
      >
        {state.projects.map((proj) => {
          const isCurrent = proj.id === projectId;
          return (
            <ListItemButton
              key={proj.id}
              selected={isCurrent}
              onClick={() => handleSwitchProject(proj.id)}
              sx={{
                borderRadius: '8px',
                mb: 0.5,
                py: 0.75,
                position: 'relative',
                ...(isCurrent && {
                  bgcolor: 'rgba(255, 255, 255, 0.1) !important',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 3,
                    height: 18,
                    background: 'linear-gradient(180deg, #fc4c02, #ef2cc1, #bdbbff)',
                    borderRadius: '9999px',
                  },
                }),
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 28,
                  color: isCurrent ? '#ef2cc1' : 'rgba(255, 255, 255, 0.5)',
                }}
              >
                <FolderRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={proj.name}
                slotProps={{
                  primary: {
                    sx: {
                      fontSize: 13,
                      fontWeight: isCurrent ? 600 : 500,
                      color: isCurrent ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    },
                  },
                }}
              />
            </ListItemButton>
          );
        })}
        {state.projects.length === 0 && (
          <Typography
            variant="caption"
            sx={{ px: 2, py: 1, color: 'rgba(255,255,255,0.4)', display: 'block' }}
          >
            No projects found
          </Typography>
        )}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mx: 2, mb: 2 }} />

      {/* ── Active Project Navigation Items ── */}
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
