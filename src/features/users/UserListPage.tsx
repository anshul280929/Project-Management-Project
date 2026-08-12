import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import GroupRemoveRoundedIcon from '@mui/icons-material/GroupRemoveRounded';

import { useUsers } from '../../hooks/useUsers';
import { useStories } from '../../hooks/useStories';
import UserCard from './UserCard';
import UserFormModal from './UserFormModal';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import type { User } from '../../types';
import { UserRole } from '../../types';
import './UserListPage.css';

// ─── UserListPage ───────────────────────────────────────
// Team management page for a project. Displays a responsive
// grid of UserCard components with add / edit / delete.

const UserListPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const {
    projectMembers,
    addUser,
    updateUser,
    addMemberToProject,
    removeMemberFromProject,
  } = useUsers();
  const { stories } = useStories(projectId);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const members = useMemo(
    () => (projectId ? projectMembers(projectId) : []),
    [projectId, projectMembers],
  );

  // Count stories assigned to each user within this project
  const assignedCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const story of stories) {
      if (story.assignedUserId) {
        map[story.assignedUserId] = (map[story.assignedUserId] ?? 0) + 1;
      }
    }
    return map;
  }, [stories]);

  const handleOpenCreate = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleSubmit = (name: string, role: UserRole, avatarColor: string) => {
    if (editingUser) {
      updateUser({ ...editingUser, name, role, avatarColor });
    } else {
      const newUser = addUser(name, role, avatarColor);
      // Automatically add the new user to this project
      if (projectId) {
        addMemberToProject(projectId, newUser.id);
      }
    }
  };

  const handleConfirmDelete = () => {
    if (deleteTarget && projectId) {
      removeMemberFromProject(projectId, deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <Box>
      {/* ── Page header ── */}
      <Box className="user-list-page__header">
        <Box className="user-list-page__header-left">
          <PeopleAltRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>
            {members.length} member{members.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonAddRoundedIcon />}
          onClick={handleOpenCreate}
          sx={{ px: 3 }}
        >
          Add Member
        </Button>
      </Box>

      {/* ── Grid / Empty State ── */}
      {members.length === 0 ? (
        <EmptyState
          icon={GroupRemoveRoundedIcon}
          title="No team members yet"
          description="Add your first team member to start assigning stories and collaborating."
          actionLabel="Add Member"
          onAction={handleOpenCreate}
        />
      ) : (
        <Box className="card-grid">
          {members.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              assignedStoryCount={assignedCountMap[user.id] ?? 0}
              projectId={projectId!}
              onEdit={handleOpenEdit}
              onDelete={setDeleteTarget}
            />
          ))}
        </Box>
      )}

      {/* ── Create / Edit Modal ── */}
      <UserFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        user={editingUser}
      />

      {/* ── Delete Confirmation ── */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Remove Team Member"
        message={`Are you sure you want to remove "${deleteTarget?.name}" from this project? Their story assignments within this project will be unaffected, but they will no longer appear in the team list.`}
        confirmLabel="Remove"
      />
    </Box>
  );
};

export default UserListPage;
