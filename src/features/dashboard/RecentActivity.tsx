import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import { type Story } from '../../types';
import { STATUS_COLORS, PRIORITY_COLORS } from '../../utils/constants';
import { formatRelativeTime, getInitials } from '../../utils/helpers';
import { useUsers } from '../../hooks/useUsers';
import EmptyState from '../../components/ui/EmptyState';
import './RecentActivity.css';

interface RecentActivityProps {
  stories: Story[];
  onNewStory?: () => void;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ stories, onNewStory }) => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const { getUserById } = useUsers();

  // Get top 6 most recently updated/created stories
  const recentStories = useMemo(() => {
    return [...stories]
      .sort((a, b) => new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime())
      .slice(0, 6);
  }, [stories]);

  const handleStoryClick = (storyId: string) => {
    if (projectId) {
      navigate(`/project/${projectId}/story/${storyId}`);
    }
  };

  const handleViewAll = () => {
    if (projectId) {
      navigate(`/project/${projectId}/stories`);
    }
  };

  return (
    <Card className="recent-activity-card">
      <CardHeader
        title={
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <HistoryRoundedIcon sx={{ color: 'primary.main', fontSize: 20 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: 16 }}>
              Recent Story Activity
            </Typography>
          </Stack>
        }
        action={
          <Button
            size="small"
            endIcon={<ArrowForwardRoundedIcon />}
            onClick={handleViewAll}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            View All ({stories.length})
          </Button>
        }
        sx={{ borderBottom: '1px solid rgba(0,0,0,0.06)', py: 1.5, px: 2.5 }}
      />
      <CardContent sx={{ p: '0 !important' }}>
        {recentStories.length === 0 ? (
          <Box sx={{ py: 4 }}>
            <EmptyState
              title="No recent stories"
              description="Start by adding your first user story to this project."
              actionLabel="Create Story"
              onAction={onNewStory}
            />
          </Box>
        ) : (
          <Box>
            {recentStories.map((story) => {
              const assignedUser = story.assignedUserId ? getUserById(story.assignedUserId) : null;
              const statusStyle = STATUS_COLORS[story.status] || { bg: '#f1f5f9', text: '#475569' };
              const priorityStyle = PRIORITY_COLORS[story.priority] || { bg: '#f1f5f9', text: '#475569' };

              return (
                <Box
                  key={story.id}
                  className="activity-item"
                  onClick={() => handleStoryClick(story.id)}
                >
                  <Box sx={{ flex: 1, minWidth: 0, mr: 2 }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
                      <Typography
                        className="activity-item-title"
                        noWrap
                        variant="body2"
                      >
                        {story.title}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                      {/* Status Chip */}
                      <Chip
                        label={story.status}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: 10,
                          fontWeight: 600,
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.text,
                        }}
                      />
                      {/* Priority Chip */}
                      <Chip
                        label={story.priority}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: 10,
                          fontWeight: 600,
                          backgroundColor: priorityStyle.bg,
                          color: priorityStyle.text,
                        }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                        • {story.storyPoints} {story.storyPoints === 1 ? 'pt' : 'pts'}
                      </Typography>
                    </Stack>
                  </Box>

                  {/* Right side: Assignee & Timestamp */}
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                    {assignedUser ? (
                      <Avatar
                        sx={{
                          width: 26,
                          height: 26,
                          fontSize: 11,
                          bgcolor: assignedUser.avatarColor,
                          fontWeight: 600,
                        }}
                        title={assignedUser.name}
                      >
                        {getInitials(assignedUser.name)}
                      </Avatar>
                    ) : (
                      <Chip
                        label="Unassigned"
                        size="small"
                        variant="outlined"
                        sx={{ height: 22, fontSize: 10, color: 'text.secondary' }}
                      />
                    )}
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ minWidth: 70, textAlign: 'right', fontSize: 11 }}
                    >
                      {formatRelativeTime(story.updatedDate)}
                    </Typography>
                  </Stack>
                </Box>
              );
            })}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
