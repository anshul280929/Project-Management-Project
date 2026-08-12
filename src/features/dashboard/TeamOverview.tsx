import React from 'react';
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
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { type User, type Story, WorkflowStatus } from '../../types';
import { ROLE_COLORS } from '../../utils/constants';
import { getInitials } from '../../utils/helpers';
import EmptyState from '../../components/ui/EmptyState';
import './TeamOverview.css';

interface TeamOverviewProps {
  members: User[];
  stories: Story[];
}

export const TeamOverview: React.FC<TeamOverviewProps> = ({ members, stories }) => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const handleMemberClick = (userId: string) => {
    if (projectId) {
      navigate(`/project/${projectId}/team/${userId}`);
    }
  };

  const handleManageTeam = () => {
    if (projectId) {
      navigate(`/project/${projectId}/team`);
    }
  };

  return (
    <Card className="team-overview-card">
      <CardHeader
        title={
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <PeopleRoundedIcon sx={{ color: 'primary.main', fontSize: 20 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: 16 }}>
              Project Team ({members.length})
            </Typography>
          </Stack>
        }
        action={
          <Button
            size="small"
            endIcon={<ArrowForwardRoundedIcon />}
            onClick={handleManageTeam}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Manage Team
          </Button>
        }
        sx={{ borderBottom: '1px solid rgba(0,0,0,0.06)', py: 1.5, px: 2.5 }}
      />
      <CardContent sx={{ p: '0 !important' }}>
        {members.length === 0 ? (
          <Box sx={{ py: 4 }}>
            <EmptyState
              title="No team members assigned"
              description="Add members to this project to start assigning user stories."
              actionLabel="Add Team Members"
              onAction={handleManageTeam}
            />
          </Box>
        ) : (
          <Box>
            {members.map((member) => {
              const assignedStories = stories.filter((s) => s.assignedUserId === member.id);
              const doneCount = assignedStories.filter((s) => s.status === WorkflowStatus.DONE).length;
              const inProgressCount = assignedStories.filter(
                (s) => s.status === WorkflowStatus.IN_PROGRESS || s.status === WorkflowStatus.TESTING
              ).length;
              const roleStyle = ROLE_COLORS[member.role] || { bg: '#f1f5f9', text: '#475569' };

              return (
                <Box
                  key={member.id}
                  className="team-member-item"
                  onClick={() => handleMemberClick(member.id)}
                >
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', minWidth: 0 }}>
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: member.avatarColor,
                        fontSize: 14,
                        fontWeight: 600,
                      }}
                    >
                      {getInitials(member.name)}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" className="team-member-name" noWrap>
                        {member.name}
                      </Typography>
                      <Chip
                        label={member.role}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: 10,
                          fontWeight: 600,
                          backgroundColor: roleStyle.bg,
                          color: roleStyle.text,
                        }}
                      />
                    </Box>
                  </Stack>

                  {/* Workload stats */}
                  <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {assignedStories.length} {assignedStories.length === 1 ? 'story' : 'stories'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                        {doneCount} done • {inProgressCount} active
                      </Typography>
                    </Box>
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

export default TeamOverview;
