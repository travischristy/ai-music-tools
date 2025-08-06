import React from 'react';
import { Paper, TextField, Typography, Box, Button } from '@mui/material';
import { useLyricsCanvas } from '../../contexts/LyricsCanvasContext.tsx';

export function SongTitleBlock() {
  const { state, dispatch } = useLyricsCanvas();

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value.length <= 45) {
      dispatch({ type: 'SET_SONG_TITLE', payload: value });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(state.songTitle);
  };

  const handleSave = () => {
    const titleData = {
      title: state.songTitle,
      timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(titleData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `song-title-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    const exportText = `Song Title\n==========\n\n${state.songTitle}\n\nExported on: ${new Date().toLocaleString()}`;
    
    const textBlob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(textBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `title-export-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Paper className="canvas-block">
      <Typography variant="h6" gutterBottom>
        Song Title
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Enter your song title..."
        value={state.songTitle}
        onChange={handleTitleChange}
        helperText={`${state.songTitle.length}/45 characters`}
        sx={{ mb: 2 }}
      />
      
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button 
          variant="outlined" 
          size="small"
          onClick={handleCopy}
        >
          Copy
        </Button>
        <Button 
          variant="outlined" 
          size="small"
          onClick={handleSave}
        >
          Save
        </Button>
        <Button 
          variant="outlined" 
          size="small"
          onClick={handleExport}
        >
          Export
        </Button>
      </Box>
    </Paper>
  );
}
