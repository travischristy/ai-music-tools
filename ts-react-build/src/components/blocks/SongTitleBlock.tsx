import React from 'react';
import { Paper, TextField, Typography, Box } from '@mui/material';
import { useLyricsCanvas } from '../../contexts/LyricsCanvasContext';

export function SongTitleBlock() {
  const { state, dispatch } = useLyricsCanvas();

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value.length <= 45) {
      dispatch({ type: 'SET_SONG_TITLE', payload: value });
    }
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
    </Paper>
  );
}
