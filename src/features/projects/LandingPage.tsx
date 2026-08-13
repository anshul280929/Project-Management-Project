import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded';
import FolderOffRoundedIcon from '@mui/icons-material/FolderOffRounded';
import ViewKanbanRoundedIcon from '@mui/icons-material/ViewKanbanRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';


import { useProjects } from '../../hooks/useProjects';
import { useStories } from '../../hooks/useStories';
import { useUsers } from '../../hooks/useUsers';
import ProjectCard from './ProjectCard';
import ProjectFormModal from './ProjectFormModal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import type { Project } from '../../types';
import './LandingPage.css';

// ─── Features data ──────────────────────────────────────────
const features = [
  {
    icon: <ViewKanbanRoundedIcon />,
    title: 'Kanban boards',
    description:
      'Visualise your workflow with drag-and-drop boards. Move stories across columns and keep your entire team aligned on progress.',
    colorClass: 'orange',
  },
  {
    icon: <AssignmentRoundedIcon />,
    title: 'Story management',
    description:
      'Create, assign, and track user stories with rich detail — priorities, statuses, and effort points all in one place.',
    colorClass: 'magenta',
  },
  {
    icon: <GroupsRoundedIcon />,
    title: 'Team collaboration',
    description:
      'Invite team members, assign roles, and see who is working on what. Collaboration happens naturally, not in siloed threads.',
    colorClass: 'periwinkle',
  },
  {
    icon: <SpeedRoundedIcon />,
    title: 'Real-time dashboard',
    description:
      'Get an instant pulse on project health with velocity charts, burndown views, and status breakdowns — no refresh needed.',
    colorClass: 'mint',
  },
  {
    icon: <TimelineRoundedIcon />,
    title: 'Sprint tracking',
    description:
      'Plan sprints, set goals, and measure velocity over time. See exactly how your team is delivering against commitments.',
    colorClass: 'blue',
  },
  {
    icon: <AutoAwesomeRoundedIcon />,
    title: 'Smart workflows',
    description:
      'Automate repetitive transitions and keep your process lean. Rules-based status updates so nothing slips through the cracks.',
    colorClass: 'dark',
  },
];

// ─── How-it-works data ──────────────────────────────────────
const steps = [
  {
    number: 1,
    title: 'Create a project',
    description:
      'Set up your workspace in seconds. Name your project, add a description, and you are ready to start.',
  },
  {
    number: 2,
    title: 'Build your backlog',
    description:
      'Add user stories, set priorities, and assign team members. Your backlog becomes the single source of truth.',
  },
  {
    number: 3,
    title: 'Ship with confidence',
    description:
      'Track progress on the Kanban board, review dashboard metrics, and deliver on time — every sprint.',
  },
];

// ─── Intersection Observer Hook ─────────────────────────────
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// ═════════════════════════════════════════════════════════════
//  LandingPage Component
// ═════════════════════════════════════════════════════════════
const LandingPage: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject } = useProjects();
  const { allStories } = useStories();
  const { users } = useUsers();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [navScrolled, setNavScrolled] = useState(false);

  // Refs for section scrolling
  const featuresRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const howRef = useRef<HTMLElement>(null);

  // Scroll listener for navbar
  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fade-in hooks for each section
  const statsFade = useFadeIn();
  const featuresFade = useFadeIn();
  const howFade = useFadeIn();
  const projectsFade = useFadeIn();
  const ctaFade = useFadeIn();

  // Pre-compute story counts per project
  const storyCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const s of allStories) {
      map[s.projectId] = (map[s.projectId] ?? 0) + 1;
    }
    return map;
  }, [allStories]);

  // Map user IDs → User objects
  const userMap = useMemo(() => {
    const m: Record<string, (typeof users)[0]> = {};
    for (const u of users) {
      m[u.id] = u;
    }
    return m;
  }, [users]);

  const handleOpenCreate = useCallback(() => {
    setEditingProject(null);
    setModalOpen(true);
  }, []);

  const handleOpenEdit = useCallback((project: Project) => {
    setEditingProject(project);
    setModalOpen(true);
  }, []);

  const handleSubmit = useCallback(
    (name: string, description: string) => {
      if (editingProject) {
        updateProject({ ...editingProject, name, description });
      } else {
        addProject(name, description);
      }
    },
    [editingProject, updateProject, addProject]
  );

  const handleConfirmDelete = useCallback(() => {
    if (deleteTarget) {
      deleteProject(deleteTarget.id);
      setDeleteTarget(null);
    }
  }, [deleteTarget, deleteProject]);

  const scrollTo = useCallback((ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Total stats
  const totalStories = allStories.length;
  const totalMembers = useMemo(() => {
    const uniqueIds = new Set<string>();
    for (const p of projects) {
      for (const id of p.members) {
        uniqueIds.add(id);
      }
    }
    return uniqueIds.size;
  }, [projects]);

  return (
    <Box className="landing-page page-enter">
      {/* ═══════ Navigation Bar ═══════ */}
      <nav className={`landing-nav ${navScrolled ? 'landing-nav--scrolled' : ''}`}>
        <div className="landing-nav__brand">
          <div className="landing-nav__brand-icon">
            <RocketLaunchRoundedIcon sx={{ fontSize: 18, color: '#fff' }} />
          </div>
          <span className="landing-nav__brand-name">Agile PM</span>
        </div>
        <div className="landing-nav__links">
          <span className="landing-nav__link" onClick={() => scrollTo(featuresRef)}>
            Features
          </span>
          <span className="landing-nav__link" onClick={() => scrollTo(howRef)}>
            How it works
          </span>
          <span className="landing-nav__link" onClick={() => scrollTo(projectsRef)}>
            Projects
          </span>
        </div>
        <button className="landing-nav__cta" onClick={handleOpenCreate}>
          Get Started
        </button>
      </nav>

      {/* ═══════ Hero Band ═══════ */}
      <section className="landing-hero">
        {/* Background orbs */}
        <div className="landing-hero__orb landing-hero__orb--1" />
        <div className="landing-hero__orb landing-hero__orb--2" />
        <div className="landing-hero__orb landing-hero__orb--3" />

        <div className="landing-hero__container">
          {/* Left: Copy */}
          <div className="landing-hero__content">
            <div className="landing-hero__eyebrow">
              <span className="landing-hero__eyebrow-dot" />
              Agile Project Management
            </div>

            <h1 className="landing-hero__headline">
              Ship faster with{' '}
              <span className="landing-hero__headline-gradient">
                clarity and confidence
              </span>
            </h1>

            <p className="landing-hero__description">
              A modern project management tool built for agile teams. Organise
              stories, track sprints, and deliver great software — all in one
              beautifully crafted workspace.
            </p>

            <div className="landing-hero__ctas">
              <button className="landing-hero__cta-primary" onClick={handleOpenCreate}>
                <AddRoundedIcon sx={{ fontSize: 18 }} />
                Create project
              </button>
              <button
                className="landing-hero__cta-secondary"
                onClick={() => scrollTo(featuresRef)}
              >
                Explore features
              </button>
            </div>
          </div>

          {/* Right: App mockup */}
          <div className="landing-hero__visual">
            <div className="landing-hero__mockup">
              <div className="landing-hero__mockup-header">
                <div className="landing-hero__mockup-dot" />
                <div className="landing-hero__mockup-dot" />
                <div className="landing-hero__mockup-dot" />
              </div>

              {/* Simulated kanban columns */}
              <div className="landing-hero__mockup-row">
                <div className="landing-hero__mockup-pill" style={{ width: '60px' }} />
                <div className="landing-hero__mockup-pill" style={{ width: '70px', marginLeft: 'auto' }} />
                <div className="landing-hero__mockup-pill" style={{ width: '55px' }} />
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '8px',
                  marginTop: '12px',
                }}
              >
                {/* Column 1 */}
                <div>
                  <div className="landing-hero__mockup-card landing-hero__mockup-card--accent landing-hero__mockup-card--orange">
                    <div className="landing-hero__mockup-line" style={{ width: '80%' }} />
                    <div className="landing-hero__mockup-line" style={{ width: '60%' }} />
                  </div>
                  <div className="landing-hero__mockup-card landing-hero__mockup-card--accent landing-hero__mockup-card--orange">
                    <div className="landing-hero__mockup-line" style={{ width: '70%' }} />
                    <div className="landing-hero__mockup-line" style={{ width: '90%' }} />
                    <div className="landing-hero__mockup-line" style={{ width: '40%' }} />
                  </div>
                </div>
                {/* Column 2 */}
                <div>
                  <div className="landing-hero__mockup-card landing-hero__mockup-card--accent landing-hero__mockup-card--magenta">
                    <div className="landing-hero__mockup-line" style={{ width: '90%' }} />
                    <div className="landing-hero__mockup-line" style={{ width: '50%' }} />
                    <div className="landing-hero__mockup-line" style={{ width: '70%' }} />
                  </div>
                  <div className="landing-hero__mockup-card landing-hero__mockup-card--accent landing-hero__mockup-card--magenta">
                    <div className="landing-hero__mockup-line" style={{ width: '60%' }} />
                    <div className="landing-hero__mockup-line" style={{ width: '80%' }} />
                  </div>
                </div>
                {/* Column 3 */}
                <div>
                  <div className="landing-hero__mockup-card landing-hero__mockup-card--accent landing-hero__mockup-card--periwinkle">
                    <div className="landing-hero__mockup-line" style={{ width: '75%' }} />
                    <div className="landing-hero__mockup-line" style={{ width: '55%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="landing-hero__ribbon" />
      </section>

      {/* ═══════ Stats Band ═══════ */}
      <section
        className="landing-stats"
        ref={statsFade.ref}
      >
        <div
          className={`landing-stats__container landing-fade-in ${statsFade.isVisible ? 'landing-fade-in--visible' : ''}`}
        >
          <div className="landing-stats__tile landing-stats__tile--mint">
            <div className="landing-stats__number">{projects.length}</div>
            <div className="landing-stats__label">Active Projects</div>
          </div>
          <div className="landing-stats__tile landing-stats__tile--periwinkle">
            <div className="landing-stats__number">{totalStories}</div>
            <div className="landing-stats__label">User Stories</div>
          </div>
          <div className="landing-stats__tile landing-stats__tile--peach">
            <div className="landing-stats__number">{totalMembers}</div>
            <div className="landing-stats__label">Team Members</div>
          </div>
        </div>
      </section>

      {/* ═══════ Features Band ═══════ */}
      <section className="landing-features" ref={featuresRef}>
        <div className="landing-features__container" ref={featuresFade.ref}>
          <div
            className={`landing-features__header landing-fade-in ${featuresFade.isVisible ? 'landing-fade-in--visible' : ''}`}
          >
            <div className="landing-features__eyebrow">The platform</div>
            <h2 className="landing-features__title">
              Everything your agile team needs
            </h2>
            <p className="landing-features__subtitle">
              From backlog grooming to sprint retrospectives, every tool you
              need lives inside one cohesive, delightfully designed workspace.
            </p>
          </div>

          <div className="landing-features__grid">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`landing-features__card landing-fade-in landing-fade-in--d${index + 1} ${featuresFade.isVisible ? 'landing-fade-in--visible' : ''}`}
              >
                <div
                  className={`landing-features__card-icon landing-features__card-icon--${feature.colorClass}`}
                >
                  {feature.icon}
                </div>
                <h3 className="landing-features__card-title">{feature.title}</h3>
                <p className="landing-features__card-description">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ How It Works Band (Dark) ═══════ */}
      <section className="landing-how" ref={howRef}>
        <div className="landing-how__container" ref={howFade.ref}>
          <div
            className={`landing-how__header landing-fade-in ${howFade.isVisible ? 'landing-fade-in--visible' : ''}`}
          >
            <div className="landing-how__eyebrow">How it works</div>
            <h2 className="landing-how__title">Up and running in minutes</h2>
          </div>

          <div className="landing-how__steps">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`landing-how__step landing-fade-in landing-fade-in--d${index + 1} ${howFade.isVisible ? 'landing-fade-in--visible' : ''}`}
              >
                <div
                  className={`landing-how__step-number landing-how__step-number--${step.number}`}
                >
                  {step.number}
                </div>
                <h3 className="landing-how__step-title">{step.title}</h3>
                <p className="landing-how__step-desc">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ Projects Band ═══════ */}
      <section className="landing-projects" ref={projectsRef}>
        <div className="landing-projects__container" ref={projectsFade.ref}>
          <div
            className={`landing-projects__header landing-fade-in ${projectsFade.isVisible ? 'landing-fade-in--visible' : ''}`}
          >
            <div>
              <div className="landing-projects__eyebrow">Your workspace</div>
              <h2 className="landing-projects__title">Your projects</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {projects.length > 0 && (
                <span className="landing-projects__count">
                  <RocketLaunchRoundedIcon sx={{ fontSize: 14 }} />
                  {projects.length} project{projects.length !== 1 ? 's' : ''}
                </span>
              )}
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddRoundedIcon />}
                onClick={handleOpenCreate}
                sx={{ px: 3, py: 1 }}
              >
                Create Project
              </Button>
            </div>
          </div>

          {projects.length === 0 ? (
            <EmptyState
              icon={FolderOffRoundedIcon}
              title="No projects yet"
              actionLabel="Create Project"
              onAction={handleOpenCreate}
            />
          ) : (
            <Box
              className={`card-grid landing-fade-in landing-fade-in--d2 ${projectsFade.isVisible ? 'landing-fade-in--visible' : ''}`}
            >
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
          )}
        </div>
      </section>

      {/* ═══════ Bottom CTA Band ═══════ */}
      <section className="landing-cta-band" ref={ctaFade.ref}>
        <div className="landing-cta-band__orb landing-cta-band__orb--1" />
        <div className="landing-cta-band__orb landing-cta-band__orb--2" />

        <div
          className={`landing-cta-band__container landing-fade-in ${ctaFade.isVisible ? 'landing-fade-in--visible' : ''}`}
        >
          <h2 className="landing-cta-band__title">
            Start building what matters
          </h2>
          <p className="landing-cta-band__subtitle">
            Join teams who deliver on time, every sprint. No credit card
            required — create your first project in under a minute.
          </p>
          <button className="landing-cta-band__button" onClick={handleOpenCreate}>
            Get Started Now
          </button>
        </div>
      </section>

      {/* ═══════ Footer Wordmark ═══════ */}
      <footer className="landing-footer">
        <div className="landing-footer__wordmark">agile project manager</div>
        <div className="landing-footer__links">
          <span className="landing-footer__link" onClick={() => scrollTo(featuresRef)} style={{ cursor: 'pointer' }}>
            Features
          </span>
          <span className="landing-footer__link" onClick={() => scrollTo(howRef)} style={{ cursor: 'pointer' }}>
            How it works
          </span>
          <span className="landing-footer__link" onClick={() => scrollTo(projectsRef)} style={{ cursor: 'pointer' }}>
            Projects
          </span>
        </div>
        <p className="landing-footer__copyright">
          © {new Date().getFullYear()} Agile Project Manager. Crafted with care.
        </p>
      </footer>

      {/* ═══════ Modals ═══════ */}
      <ProjectFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        project={editingProject}
      />

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

export default LandingPage;
