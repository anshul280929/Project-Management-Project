import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme';
import '../App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>Agile Project Manager</div>
    </ThemeProvider>
  );
}

export default App;
