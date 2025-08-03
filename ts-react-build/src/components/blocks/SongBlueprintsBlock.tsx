import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  ButtonGroup,
  Slider,
  Chip,
  Grid,
} from '@mui/material';
import { useLyricsCanvas } from '../../contexts/LyricsCanvasContext';

const SECTION_TYPES = [
  'Intro', 'Verse', 'Pre-Chorus', 'Chorus', 'Bridge', 'Outro',
  'Hook', 'Refrain', 'Instrumental Break', 'Instrumental Build'
];

export function SongBlueprintsBlock() {
  const { state, dispatch } = useLyricsCanvas();

  const addSection = (sectionType: string) => {
    const newSection = {
      id: `${sectionType}-${Date.now()}`,
      type: sectionType as any,
      content: '',
      lines: ['', '', '', ''], // 4 empty lines by default
    };

    dispatch({ type: 'ADD_SECTION', payload: newSection });

    // Add section to custom lyrics
    const sectionText = `[${sectionType}]\n\n\n\n\n`;
    const updatedLyrics = state.customLyrics + sectionText;
    dispatch({ type: 'SET_CUSTOM_LYRICS', payload: updatedLyrics });
  };

  const handleGuidanceLevelChange = (event: Event, newValue: number | number[]) => {
    dispatch({ type: 'SET_BLUEPRINT_GUIDANCE_LEVEL', payload: newValue as number });
  };

  return (
    <Paper className="canvas-block">
      <Typography variant="h6" gutterBottom>
        Song Blueprints
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>
          Blueprint Guidance Level: {state.blueprintGuidanceLevel}
        </Typography>
        <Slider
          value={state.blueprintGuidanceLevel}
          onChange={handleGuidanceLevelChange}
          min={1}
          max={5}
          step={1}
          marks
          sx={{ mb: 2 }}
        />
        <Typography variant="caption" color="text.secondary">
          1: Minimal guidance | 5: Detailed guidance with syllable/rhyme suggestions
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Quick Add Sections
        </Typography>
        <Grid container spacing={1}>
          {SECTION_TYPES.map((section) => (
            <Grid item key={section}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => addSection(section)}
                sx={{ mb: 1 }}
              >
                + {section}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Current Sections
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {state.sections.map((section) => (
            <Chip
              key={section.id}
              label={section.type}
              onDelete={() => dispatch({ type: 'REMOVE_SECTION', payload: section.id })}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      </Box>

      <ButtonGroup variant="outlined" size="small">
        <Button>Analyze Blueprint</Button>
        <Button>Generate Blueprint</Button>
        <Button>Load Template</Button>
      </ButtonGroup>
    </Paper>
  );
}
