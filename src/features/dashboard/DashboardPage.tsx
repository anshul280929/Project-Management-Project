import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ViewKanbanRoundedIcon from '@mui/icons-material/ViewKanbanRounded';
import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';

import { useActiveProject } from '../../hooks/useActiveProject';
import { useStories } from '../../hooks/useStories';
import { useUsers } from '../../hooks/useUsers';
import { formatDate } from '../../utils/helpers';
import { Priority, WorkflowStatus } from '../../types';
import StatsGrid from './StatsGrid';
import RecentActivity from './RecentActivity';
import TeamOverview from './TeamOverview';
import StoryFormModal from '../stories/StoryFormModal';
import EmptyState from '../../components/ui/EmptyState';
import './DashboardPage.css';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const activeProject = useActiveProject();
  const { stories, addStory } = useStories(projectId);
  const { projectMembers } = useUsers();

  const members = useMemo(
    () => (projectId ? projectMembers(projectId) : []),
    [projectId, projectMembers]
  );

  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);

  if (!activeProject) {
    return (
      <Box sx={{ p: 4 }}>
        <EmptyState
          title="Project Not Found"
          description="The requested project does not exist or has been deleted."
          actionLabel="Return to Projects"
          onAction={() => navigate('/')}
        />
      </Box>
    );
  }

  const handleCreateStorySubmit = (storyData: {
    title: string;
    description: string;
    priority: Priority;
    storyPoints: number;
    assignedUserId: string | null;
    status: WorkflowStatus;
  }) => {
    if (!projectId) return;
    addStory({
      projectId,
      ...storyData,
    });
  };

  return (
    <Box className="dashboard-container">
      {/* ── Dark Hero Section ── */}
      <Box className="dashboard-hero-band">
        <Box sx={{ maxWidth: 1400, margin: '0 auto' }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            sx={{
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', md: 'center' },
            }}
          >
            <Box>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1 }}>
                <FolderRoundedIcon sx={{ color: 'primary.light', fontSize: 24 }} />
                <Typography variant="overline" sx={{ letterSpacing: 1, color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
                  PROJECT DASHBOARD
                </Typography>
              </Stack>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#ffffff', mb: 1 }}>
                {activeProject.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', maxWidth: 650, mb: 2 }}>
                {activeProject.description || 'No description provided for this project.'}
              </Typography>

              <Stack direction="row" spacing={3} sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <CalendarTodayRoundedIcon sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 16 }} />
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Created {formatDate(activeProject.createdDate)}
                  </Typography>
                </Stack>
                <Chip
                  label={`${stories.length} User Stories`}
                  size="small"
                  sx={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff', fontSize: 11, fontWeight: 500 }}
                />
                <Chip
                  label={`${members.length} Team Members`}
                  size="small"
                  sx={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff', fontSize: 11, fontWeight: 500 }}
                />
              </Stack>
            </Box>

            {/* Quick Actions Toolbar */}
            <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={() => setIsCreateStoryOpen(true)}
                sx={{
                  backgroundColor: '#ffffff',
                  color: '#0d1117',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#f1f5f9',
                  },
                }}
              >
                New Story
              </Button>
              <Button
                variant="outlined"
                startIcon={<ViewKanbanRoundedIcon />}
                onClick={() => navigate(`/project/${projectId}/board`)}
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: '#ffffff',
                  '&:hover': {
                    borderColor: '#ffffff',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                  },
                }}
              >
                Kanban Board
              </Button>
              <Button
                variant="outlined"
                startIcon={<ListAltRoundedIcon />}
                onClick={() => navigate(`/project/${projectId}/stories`)}
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: '#ffffff',
                  '&:hover': {
                    borderColor: '#ffffff',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                  },
                }}
              >
                Stories List
              </Button>
              <Button
                variant="outlined"
                startIcon={<GroupRoundedIcon />}
                onClick={() => navigate(`/project/${projectId}/team`)}
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: '#ffffff',
                  '&:hover': {
                    borderColor: '#ffffff',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                  },
                }}
              >
                Team
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>

      {/* ── Main Content Area ── */}
      <Box className="dashboard-content-area">
        <Box sx={{ maxWidth: 1400, margin: '0 auto' }}>
          {/* ── Metrics & Progress Section ── */}
          <Typography className="dashboard-section-title">
            Project Metrics
          </Typography>
          <StatsGrid stories={stories} />

          {/* ── Activity Feed and Team Overview Grid ── */}
          <Typography className="dashboard-section-title">
            Activity & Team
          </Typography>
          <Box className="dashboard-grid-layout">
            <RecentActivity stories={stories} onNewStory={() => setIsCreateStoryOpen(true)} />
            <TeamOverview members={members} stories={stories} />
          </Box>
        </Box>
      </Box>

      {/* Story Form Modal for Quick Creation */}
      <StoryFormModal
        open={isCreateStoryOpen}
        onClose={() => setIsCreateStoryOpen(false)}
        onSubmit={handleCreateStorySubmit}
      />
    </Box>
  );
};

export default DashboardPage;
