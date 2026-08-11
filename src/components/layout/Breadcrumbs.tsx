import { useLocation, useParams, Link as RouterLink } from 'react-router-dom';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { useAppContext } from '../../context/AppContext';

// ─── Route → label mapping ────────────────────────────
function useBreadcrumbTrail(): { label: string; to?: string }[] {
  const { pathname } = useLocation();
  const { projectId, storyId, userId } = useParams<{
    projectId?: string;
    storyId?: string;
    userId?: string;
  }>();
  const { state } = useAppContext();

  const trail: { label: string; to?: string }[] = [];

  // Not inside a project — no breadcrumbs
  if (!projectId) return trail;

  const project = state.projects.find((p) => p.id === projectId);
  const projectName = project?.name ?? 'Project';

  // Remove trailing slash
  const path = pathname.replace(/\/$/, '');
  const segments = path.split('/').filter(Boolean);
  // segments: ['project', ':id', ...rest]

  // Always start with project name
  trail.push({ label: projectName, to: `/project/${projectId}` });

  // Determine the sub-section
  const subSection = segments[2]; // e.g., 'board', 'stories', 'team', undefined (dashboard)

  if (!subSection) {
    // Dashboard — last crumb (no link)
    trail[trail.length - 1].to = undefined;
    return trail;
  }

  if (subSection === 'board') {
    trail.push({ label: 'Board' });
  } else if (subSection === 'stories') {
    if (storyId) {
      trail.push({ label: 'Stories', to: `/project/${projectId}/stories` });
      const story = state.stories.find((s) => s.id === storyId);
      trail.push({ label: story?.title ?? 'Story' });
    } else {
      trail.push({ label: 'Stories' });
    }
  } else if (subSection === 'story' && storyId) {
    // Alternate route: /project/:id/story/:storyId
    trail.push({ label: 'Stories', to: `/project/${projectId}/stories` });
    const story = state.stories.find((s) => s.id === storyId);
    trail.push({ label: story?.title ?? 'Story' });
  } else if (subSection === 'team') {
    if (userId) {
      trail.push({ label: 'Team', to: `/project/${projectId}/team` });
      const user = state.users.find((u) => u.id === userId);
      trail.push({ label: user?.name ?? 'Member' });
    } else {
      trail.push({ label: 'Team' });
    }
  }

  return trail;
}

// ─── Component ─────────────────────────────────────────
export default function Breadcrumbs() {
  const trail = useBreadcrumbTrail();

  if (trail.length === 0) return null;

  return (
    <MuiBreadcrumbs
      separator={<NavigateNextRoundedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />}
      aria-label="breadcrumb"
    >
      {trail.map((crumb, index) => {
        const isLast = index === trail.length - 1;

        if (isLast || !crumb.to) {
          return (
            <Typography
              key={crumb.label}
              variant="body2"
              sx={{ color: 'text.primary', fontWeight: 500 }}
            >
              {crumb.label}
            </Typography>
          );
        }

        return (
          <Link
            key={crumb.label}
            component={RouterLink}
            to={crumb.to}
            underline="hover"
            variant="body2"
            sx={{ color: 'text.secondary' }}
          >
            {crumb.label}
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
}
