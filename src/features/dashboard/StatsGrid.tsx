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
import { WorkflowStatus, type Story } from '../../types';
import StatusChart from './StatusChart';
import './StatsGrid.css';

interface StatsGridProps {
  stories: Story[];
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stories }) => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  // Metrics calculations
  const totalStories = stories.length;
  const totalPoints = stories.reduce((acc, s) => acc + s.storyPoints, 0);
  const doneStories = stories.filter((s) => s.status === WorkflowStatus.DONE);
  const completedPoints = doneStories.reduce((acc, s) => acc + s.storyPoints, 0);
  const completionPercentage = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;

  const handleTotalClick = () => {
    if (!projectId) return;
    navigate(`/project/${projectId}/board`);
  };

  return (
    <Box className="stats-grid-container">
      {/* ── Metrics Row: Total Stories Card + Chart ── */}
      <Box className="stats-metrics-row">
        {/* Total Stories Card (unchanged) */}
        <Tooltip title="View all stories on Kanban board" arrow placement="top">
          <Card className="stats-card" onClick={handleTotalClick}>
            <Box className="stats-card-accent-bar" style={{ backgroundColor: 'var(--color-brand)' }} />
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: 0.5, fontSize: 11 }}>
                  Total Stories
                </Typography>
                <AssignmentRoundedIcon sx={{ color: 'primary.main', fontSize: 24 }} />
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.75, color: 'text.primary' }}>
                {totalStories}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                {totalPoints} Story Points
              </Typography>
            </CardContent>
          </Card>
        </Tooltip>

        {/* Status Distribution Chart */}
        <StatusChart stories={stories} />
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

