import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
  Slider,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { useLyricsCanvas } from '../../contexts/LyricsCanvasContext';
import { useAIWorkflows } from '../../hooks/useAIWorkflows';

export function AIWorkflowButtons() {
  const { state, dispatch } = useLyricsCanvas();
  const { generateLyrics, analyzeLyrics, editLyrics, enhanceLyrics } = useAIWorkflows();

  const [generateAnchor, setGenerateAnchor] = useState<null | HTMLElement>(null);
  const [analyzeAnchor, setAnalyzeAnchor] = useState<null | HTMLElement>(null);
  const [editAnchor, setEditAnchor] = useState<null | HTMLElement>(null);
  const [enhanceAnchor, setEnhanceAnchor] = useState<null | HTMLElement>(null);

  const [generateOptions, setGenerateOptions] = useState({
    creativity: 0.7,
    stylePrompts: 3,
    sections: 'full',
  });

  const [analyzeOptions, setAnalyzeOptions] = useState({
    includeRhymes: true,
    includeCliches: true,
    includeSentiment: true,
  });

  const handleGenerate = async (options: any) => {
    dispatch({ type: 'SET_GENERATING', payload: true });
    try {
      const result = await generateLyrics({
        songTitle: state.songTitle,
        styleOfMusic: state.styleOfMusic,
        customLyrics: state.customLyrics,
        ...options,
      });
      dispatch({ type: 'SET_CUSTOM_LYRICS', payload: result.lyrics });
      dispatch({ type: 'ADD_API_LOG', payload: { request: options, response: result } });
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      dispatch({ type: 'SET_GENERATING', payload: false });
    }
    setGenerateAnchor(null);
  };

  const handleAnalyze = async (options: any) => {
    dispatch({ type: 'SET_ANALYZING', payload: true });
    try {
      const result = await analyzeLyrics({
        customLyrics: state.customLyrics,
        styleOfMusic: state.styleOfMusic,
        ...options,
      });
      dispatch({ type: 'SET_ANALYSIS_RESULTS', payload: result });
      dispatch({ type: 'ADD_API_LOG', payload: { request: options, response: result } });
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      dispatch({ type: 'SET_ANALYZING', payload: false });
    }
    setAnalyzeAnchor(null);
  };

  return (
    <Paper className="canvas-block">
      <Typography variant="h6" gutterBottom>
        AI Agent Workflows
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={(e) => setGenerateAnchor(e.currentTarget)}
          disabled={state.isGenerating}
        >
          {state.isGenerating ? 'Generating...' : 'Generate'}
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={(e) => setAnalyzeAnchor(e.currentTarget)}
          disabled={state.isAnalyzing}
        >
          {state.isAnalyzing ? 'Analyzing...' : 'Analyze'}
        </Button>

        <Button
          variant="contained"
          color="info"
          onClick={(e) => setEditAnchor(e.currentTarget)}
        >
          Edit / Iterate
        </Button>

        <Button
          variant="contained"
          color="success"
          onClick={(e) => setEnhanceAnchor(e.currentTarget)}
        >
          Enhance / Expand
        </Button>
      </Box>

      ```tsx:src/components/blocks/AIWorkflowButtons.tsx
      {/* Generate Menu */}
      <Menu
        anchorEl={generateAnchor}
        open={Boolean(generateAnchor)}
        onClose={() => setGenerateAnchor(null)}
        PaperProps={{ sx: { minWidth: 300, p: 2 } }}
      >
        <Typography variant="subtitle2" gutterBottom>
          Generation Options
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography gutterBottom>Creativity: {generateOptions.creativity}</Typography>
          <Slider
            value={generateOptions.creativity}
            onChange={(_, value) => setGenerateOptions(prev => ({ ...prev, creativity: value as number }))}
            min={0.1}
            max={2.0}
            step={0.1}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography gutterBottom>Style Prompts: {generateOptions.stylePrompts}</Typography>
          <Slider
            value={generateOptions.stylePrompts}
            onChange={(_, value) => setGenerateOptions(prev => ({ ...prev, stylePrompts: value as number }))}
            min={1}
            max={20}
            step={1}
          />
        </Box>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Generation Type</InputLabel>
          <Select
            value={generateOptions.sections}
            onChange={(e) => setGenerateOptions(prev => ({ ...prev, sections: e.target.value }))}
          >
            <MenuItem value="full">Full Song</MenuItem>
            <MenuItem value="verse">Verse Only</MenuItem>
            <MenuItem value="chorus">Chorus Only</MenuItem>
            <MenuItem value="bridge">Bridge Only</MenuItem>
            <MenuItem value="expand">Expand/Fill-in</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          fullWidth
          onClick={() => handleGenerate(generateOptions)}
        >
          Generate Lyrics
        </Button>
      </Menu>

      {/* Analyze Menu */}
      <Menu
        anchorEl={analyzeAnchor}
        open={Boolean(analyzeAnchor)}
        onClose={() => setAnalyzeAnchor(null)}
        PaperProps={{ sx: { minWidth: 300, p: 2 } }}
      >
        <Typography variant="subtitle2" gutterBottom>
          Analysis Options
        </Typography>

        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={analyzeOptions.includeRhymes}
                onChange={(e) => setAnalyzeOptions(prev => ({ ...prev, includeRhymes: e.target.checked }))}
              />
            }
            label="Rhyme Analysis"
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={analyzeOptions.includeCliches}
                onChange={(e) => setAnalyzeOptions(prev => ({ ...prev, includeCliches: e.target.checked }))}
              />
            }
            label="Cliché Detection"
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={analyzeOptions.includeSentiment}
                onChange={(e) => setAnalyzeOptions(prev => ({ ...prev, includeSentiment: e.target.checked }))}
              />
            }
            label="Sentiment Analysis"
          />
        </Box>

        <Button
          variant="contained"
          fullWidth
          onClick={() => handleAnalyze(analyzeOptions)}
        >
          Analyze Lyrics
        </Button>
      </Menu>

      {/* Edit Menu */}
      <Menu
        anchorEl={editAnchor}
        open={Boolean(editAnchor)}
        onClose={() => setEditAnchor(null)}
        PaperProps={{ sx: { minWidth: 250, p: 1 } }}
      >
        <MenuItem onClick={() => { /* Handle edit */ setEditAnchor(null); }}>
          Refine Existing Lyrics
        </MenuItem>
        <MenuItem onClick={() => { /* Handle iterate */ setEditAnchor(null); }}>
          Create Variations
        </MenuItem>
        <MenuItem onClick={() => { /* Handle restructure */ setEditAnchor(null); }}>
          Restructure Sections
        </MenuItem>
      </Menu>

      {/* Enhance Menu */}
      <Menu
        anchorEl={enhanceAnchor}
        open={Boolean(enhanceAnchor)}
        onClose={() => setEnhanceAnchor(null)}
        PaperProps={{ sx: { minWidth: 250, p: 1 } }}
      >
        <MenuItem onClick={() => { /* Handle style guidance */ setEnhanceAnchor(null); }}>
          Add Style Guidance
        </MenuItem>
        <MenuItem onClick={() => { /* Handle find replace */ setEnhanceAnchor(null); }}>
          Find & Replace Clichés
        </MenuItem>
        <MenuItem onClick={() => { /* Handle humanize */ setEnhanceAnchor(null); }}>
          Humanize (Add Ad-libs)
        </MenuItem>
      </Menu>
    </Paper>
  );
}
