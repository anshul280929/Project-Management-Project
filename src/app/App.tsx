import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme';
import { AppProvider } from '../context/AppContext';
import ProjectListPage from '../features/projects/ProjectListPage';
import AppShell from '../components/layout/AppShell';
import UserListPage from '../features/users/UserListPage';
import UserDetailPage from '../features/users/UserDetailPage';
import StoryListPage from '../features/stories/StoryListPage';
import StoryDetailPage from '../features/stories/StoryDetailPage';
import '../App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <BrowserRouter>
          <Routes>
            {/* ── Landing: Project List ── */}
            <Route path="/" element={<ProjectListPage />} />

            {/* ── Project sub-routes (wrapped in AppShell) ── */}
            <Route path="/project/:projectId" element={<AppShell />}>
              {/* Feature pages will be added here in later phases */}
              <Route index element={<div>Dashboard</div>} />
              <Route path="board" element={<div>Board</div>} />
              <Route path="stories" element={<StoryListPage />} />
              <Route path="story/:storyId" element={<StoryDetailPage />} />
              <Route path="team" element={<UserListPage />} />
              <Route path="team/:userId" element={<UserDetailPage />} />
            </Route>

            {/* ── Catch-all ── */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
