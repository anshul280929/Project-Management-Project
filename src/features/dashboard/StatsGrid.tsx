import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import Tooltip from '@mui/material/Tooltip';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { WorkflowStatus, type Story } from '../../types';
import './StatsGrid.css';

interface StatsGridProps {
  stories: Story[];
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stories }) => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  // Metrics calculations
  const totalStories = stories.length;
  const backlogStories = stories.filter((s) => s.status === WorkflowStatus.BACKLOG);
  const inProgressStories = stories.filter((s) => s.status === WorkflowStatus.IN_PROGRESS);
  const testingStories = stories.filter((s) => s.status === WorkflowStatus.TESTING);
  const doneStories = stories.filter((s) => s.status === WorkflowStatus.DONE);

  const totalPoints = stories.reduce((acc, s) => acc + s.storyPoints, 0);
  const completedPoints = doneStories.reduce((acc, s) => acc + s.storyPoints, 0);
  const completionPercentage = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;

  const handleTileClick = (status?: WorkflowStatus) => {
    if (!projectId) return;
    if (status) {
      navigate(`/project/${projectId}/board?status=${encodeURIComponent(status)}`);
    } else {
      navigate(`/project/${projectId}/board`);
    }
  };

  const statItems = [
    {
      title: 'Total Stories',
      count: totalStories,
      subtext: `${totalPoints} Story Points`,
      icon: <AssignmentRoundedIcon sx={{ color: 'primary.main', fontSize: 24 }} />,
      accentColor: 'var(--color-brand)',
      onClick: () => handleTileClick(),
    },
    {
      title: 'Backlog',
      count: backlogStories.length,
      subtext: `${backlogStories.reduce((acc, s) => acc + s.storyPoints, 0)} points`,
      icon: <HourglassEmptyRoundedIcon sx={{ color: '#64748b', fontSize: 24 }} />,
      accentColor: '#64748b',
      onClick: () => handleTileClick(WorkflowStatus.BACKLOG),
    },
    {
      title: 'In Progress',
      count: inProgressStories.length,
      subtext: `${inProgressStories.reduce((acc, s) => acc + s.storyPoints, 0)} points`,
      icon: <AutorenewRoundedIcon sx={{ color: '#0284c7', fontSize: 24 }} />,
      accentColor: '#0284c7',
      onClick: () => handleTileClick(WorkflowStatus.IN_PROGRESS),
    },
    {
      title: 'Testing',
      count: testingStories.length,
      subtext: `${testingStories.reduce((acc, s) => acc + s.storyPoints, 0)} points`,
      icon: <FactCheckRoundedIcon sx={{ color: '#d97706', fontSize: 24 }} />,
      accentColor: '#d97706',
      onClick: () => handleTileClick(WorkflowStatus.TESTING),
    },
    {
      title: 'Done',
      count: doneStories.length,
      subtext: `${completedPoints} points`,
      icon: <CheckCircleRoundedIcon sx={{ color: '#16a34a', fontSize: 24 }} />,
      accentColor: '#16a34a',
      onClick: () => handleTileClick(WorkflowStatus.DONE),
    },
  ];

  return (
    <Box className="stats-grid-container">
      {/* ── Metric Cards Grid ── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(5, 1fr)',
          },
          gap: 2.5,
        }}
      >
        {statItems.map((item) => (
          <Tooltip key={item.title} title={`Filter Kanban board by ${item.title}`} arrow placement="top">
            <Card className="stats-card" onClick={item.onClick}>
              <Box className="stats-card-accent-bar" style={{ backgroundColor: item.accentColor }} />
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: 0.5, fontSize: 11 }}>
                    {item.title}
                  </Typography>
                  {item.icon}
                </Stack>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.75, color: 'text.primary' }}>
                  {item.count}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                  {item.subtext}
                </Typography>
              </CardContent>
            </Card>
          </Tooltip>
        ))}
      </Box>

      {/* ── Progress Card ── */}
      <Card className="stats-progress-card">
        <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Project Sprint Completion
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {completedPoints} of {totalPoints} story points completed ({doneStories.length} of {totalStories} stories)
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: completionPercentage === 100 ? '#16a34a' : 'primary.main' }}>
            {completionPercentage}%
          </Typography>
        </Stack>

        <LinearProgress
          variant="determinate"
          value={completionPercentage}
          sx={{
            height: 10,
            borderRadius: 5,
            backgroundColor: 'rgba(0, 0, 0, 0.08)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 5,
              background: completionPercentage === 100 
                ? '#16a34a' 
                : 'linear-gradient(90deg, #10b981 0%, #3b82f6 100%)',
            },
          }}
        />
      </Card>
    </Box>
  );
};

export default StatsGrid;
