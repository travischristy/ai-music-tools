import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container } from '@mui/material';
import { LyricsCanvasProvider } from './contexts/LyricsCanvasContext.tsx';
import { SettingsProvider } from './contexts/SettingsContext.tsx';
import { MainCanvas } from './components/MainCanvas.tsx';
import { SettingsDialog } from './components/SettingsDialog.tsx';
import './App.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
    },
    secondary: {
      main: '#ec4899',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#6366f1',
            },
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <SettingsProvider>
        <LyricsCanvasProvider>
          <Container maxWidth="xl" sx={{ py: 2 }}>
            <MainCanvas />
          </Container>
          <SettingsDialog />
        </LyricsCanvasProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;
