import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Typography,
  Box,
  Slider,
  FormControlLabel,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  ButtonGroup,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useLyricsCanvas } from '../../contexts/LyricsCanvasContext.tsx';

export function StyleOfMusicBlock() {
  const { state, dispatch } = useLyricsCanvas();
  const [characterLimit, setCharacterLimit] = useState(1000);
  const [useShortLimit, setUseShortLimit] = useState(false);
  const [weirdness, setWeirdness] = useState(50);
  const [styleInfluence, setStyleInfluence] = useState(75);
  const [audioInfluence, setAudioInfluence] = useState(50);
  const [excludedStyle, setExcludedStyle] = useState('');

  const handleStyleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const limit = useShortLimit ? 200 : 1000;
    if (value.length <= limit) {
      dispatch({ type: 'SET_STYLE_OF_MUSIC', payload: value });
    }
  };

  const handleLimitToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUseShortLimit(event.target.checked);
    setCharacterLimit(event.target.checked ? 200 : 1000);
  };

  const handleSave = () => {
    const styleData = {
      style: state.styleOfMusic,
      weirdness,
      styleInfluence,
      audioInfluence,
      excludedStyle,
      characterLimit,
      timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(styleData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `style-of-music-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    const exportText = `Style of Music\n===============\n\n${state.styleOfMusic}\n\nSuno v4.5+ Settings:\n- Weirdness: ${weirdness}%\n- Style Influence: ${styleInfluence}%\n- Audio Input Influence: ${audioInfluence}%\n- Excluded Style: ${excludedStyle || 'None'}\n\nExported on: ${new Date().toLocaleString()}`;
    
    const textBlob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(textBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `style-export-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Paper className="canvas-block">
      <Typography variant="h6" gutterBottom>
        Style of Music
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={useShortLimit}
              onChange={handleLimitToggle}
            />
          }
          label="Use 200 character limit"
        />
      </Box>

      <TextField
        fullWidth
        multiline
        minRows={4}
        variant="outlined"
        placeholder="Describe the style, genre, mood, and instrumentation..."
        value={state.styleOfMusic}
        onChange={handleStyleChange}
        helperText={`${state.styleOfMusic.length}/${characterLimit} characters`}
        sx={{ mb: 2 }}
      />

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Suno v4.5+ Advanced Controls</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>Weirdness: {weirdness}%</Typography>
            <Slider
              value={weirdness}
              onChange={(_, value) => setWeirdness(value as number)}
              min={0}
              max={100}
              sx={{ mb: 2 }}
            />

            <Typography gutterBottom>Style Influence: {styleInfluence}%</Typography>
            <Slider
              value={styleInfluence}
              onChange={(_, value) => setStyleInfluence(value as number)}
              min={0}
              max={100}
              sx={{ mb: 2 }}
            />

            <Typography gutterBottom>Audio Input Influence: {audioInfluence}%</Typography>
            <Slider
              value={audioInfluence}
              onChange={(_, value) => setAudioInfluence(value as number)}
              min={0}
              max={100}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              multiline
              minRows={2}
              variant="outlined"
              placeholder="Excluded styles (negative prompt)..."
              value={excludedStyle}
              onChange={(e) => setExcludedStyle(e.target.value)}
              label="Excluded Style"
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        <Button 
          variant="outlined" 
          size="small"
          onClick={() => navigator.clipboard.writeText(state.styleOfMusic)}
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
