import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded';
import FolderOffRoundedIcon from '@mui/icons-material/FolderOffRounded';

import { useProjects } from '../../hooks/useProjects';
import { useStories } from '../../hooks/useStories';
import { useUsers } from '../../hooks/useUsers';
import ProjectCard from './ProjectCard';
import ProjectFormModal from './ProjectFormModal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import type { Project } from '../../types';
import './ProjectListPage.css';

// ─── ProjectListPage ────────────────────────────────────
// Landing page for the app. Full-width dark hero band with
// title + tagline, followed by a responsive card grid of
// ProjectCard components.

const ProjectListPage: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject } = useProjects();
  const { allStories } = useStories();
  const { users } = useUsers();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  // Pre-compute story counts per project
  const storyCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const s of allStories) {
      map[s.projectId] = (map[s.projectId] ?? 0) + 1;
    }
    return map;
  }, [allStories]);

  // Map user IDs → User objects, indexed for O(1) lookup
  const userMap = useMemo(() => {
    const m: Record<string, (typeof users)[0]> = {};
    for (const u of users) {
      m[u.id] = u;
    }
    return m;
  }, [users]);

  const handleOpenCreate = () => {
    setEditingProject(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setModalOpen(true);
  };

  const handleSubmit = (name: string, description: string) => {
    if (editingProject) {
      updateProject({ ...editingProject, name, description });
    } else {
      addProject(name, description);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteProject(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <Box className="project-list-page page-enter">
      {/* ═══ Hero Band ═══ */}
      <Box className="hero-band project-list-page__hero">
        <Container maxWidth="lg" disableGutters>
          {/* Overline */}
          <Typography
            variant="overline"
            className="project-list-page__eyebrow"
            sx={{ color: 'var(--color-body)', mb: 1.5, display: 'block' }}
          >
            workspace
          </Typography>

          {/* Title */}
          <Typography
            variant="h1"
            component="h1"
            className="text-display-xxl project-list-page__title"
            sx={{ color: 'var(--color-on-dark)', mb: 1 }}
          >
            Agile Project Manager
          </Typography>

          {/* Tagline */}
          <Typography
            variant="body1"
            className="project-list-page__tagline"
            sx={{
              color: 'var(--color-body)',
              maxWidth: 520,
              mb: 4,
              lineHeight: 1.6,
            }}
          >
            Plan sprints, track stories, and ship faster — all from one
            beautiful board.
          </Typography>

          {/* CTA */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddRoundedIcon />}
            onClick={handleOpenCreate}
            sx={{
              borderRadius: 'var(--radius-full)',
              px: 4,
              py: 1.25,
            }}
          >
            Create Project
          </Button>
        </Container>

        {/* Gradient ribbon */}
        <Box className="hero-band__gradient-ribbon" />
      </Box>

      {/* ═══ Project Grid / Empty State ═══ */}
      <Container maxWidth="lg" sx={{ py: 5 }}>
        {projects.length === 0 ? (
          <EmptyState
            icon={FolderOffRoundedIcon}
            title="No projects yet"
            description="Create your first project to start planning sprints, tracking stories, and collaborating with your team."
            actionLabel="Create Project"
            onAction={handleOpenCreate}
          />
        ) : (
          <>
            {/* Section eyebrow */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <RocketLaunchRoundedIcon
                  sx={{ fontSize: 18, color: 'text.secondary' }}
                />
                <Typography
                  variant="overline"
                  sx={{ color: 'text.secondary' }}
                >
                  {projects.length} project{projects.length !== 1 ? 's' : ''}
                </Typography>
              </Box>
            </Box>

            {/* Card grid */}
            <Box className="card-grid">
              {projects.map((project) => {
                const memberUsers = project.members
                  .map((id) => userMap[id])
                  .filter(Boolean);

                return (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    storyCount={storyCountMap[project.id] ?? 0}
                    members={memberUsers}
                    onEdit={handleOpenEdit}
                    onDelete={setDeleteTarget}
                  />
                );
              })}
            </Box>
          </>
        )}
      </Container>

      {/* ═══ Create / Edit Modal ═══ */}
      <ProjectFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        project={editingProject}
      />

      {/* ═══ Delete Confirmation ═══ */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? All stories within this project will also be permanently removed.`}
        confirmLabel="Delete"
      />
    </Box>
  );
};

export default ProjectListPage;
