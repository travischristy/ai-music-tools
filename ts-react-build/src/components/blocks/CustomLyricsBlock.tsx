import React, { useState, useEffect } from 'react';
import {
  Paper,
  TextField,
  Typography,
  Box,
  Chip,
  Tooltip,
} from '@mui/material';
import { useLyricsCanvas } from '../../contexts/LyricsCanvasContext';
import { useRealTimeAnalysis } from '../../hooks/useRealTimeAnalysis';

export function CustomLyricsBlock() {
  const { state, dispatch } = useLyricsCanvas();
  const { analyzeText } = useRealTimeAnalysis();
  const [localAnalysis, setLocalAnalysis] = useState<any>(null);

  const handleLyricsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    dispatch({ type: 'SET_CUSTOM_LYRICS', payload: value });
  };

  useEffect(() => {
    if (state.customLyrics) {
      const analysis = analyzeText(state.customLyrics);
      setLocalAnalysis(analysis);
    }
  }, [state.customLyrics, analyzeText]);

  const renderAnalyzedText = () => {
    if (!localAnalysis || !state.customLyrics) {
      return state.customLyrics;
    }

    const lines = state.customLyrics.split('\n');
    return lines.map((line, index) => {
      const lineAnalysis = localAnalysis.lines?.[index];
      return (
        <Box key={index} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
          <Typography component="span" sx={{ flexGrow: 1 }}>
            {line}
          </Typography>
          {lineAnalysis && (
            <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              {lineAnalysis.rhymeScheme && (
                <Chip
                  size="small"
                  label={lineAnalysis.rhymeScheme}
                  className="rhyme-indicator"
                  sx={{
                    backgroundColor: getRhymeColor(lineAnalysis.rhymeScheme),
                    color: 'white',
                    minWidth: '24px',
                    height: '24px',
                  }}
                />
              )}
              <Typography variant="caption" className="syllable-count">
                {lineAnalysis.syllableCount} syl
              </Typography>
            </Box>
          )}
        </Box>
      );
    });
  };

  const getRhymeColor = (scheme: string) => {
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];
    const charCode = scheme.charCodeAt(0) - 65; // A=0, B=1, etc.
    return colors[charCode % colors.length];
  };

  return (
    <Paper className="canvas-block">
      <Typography variant="h6" gutterBottom>
        Custom Lyrics
      </Typography>

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          multiline
          minRows={12}
          variant="outlined"
          placeholder="Write your lyrics here... Use [Section] tags for structure."
          value={state.customLyrics}
          onChange={handleLyricsChange}
          className="expandable-textarea"
        />
      </Box>

      {localAnalysis && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Real-time Analysis
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {localAnalysis.cliches?.map((cliche: any, index: number) => (
              <Tooltip key={index} title={`Severity: ${cliche.severity}`}>
                <Chip
                  label={cliche.word}
                  size="small"
                  color={cliche.severity === 'high' ? 'error' : cliche.severity === 'medium' ? 'warning' : 'info'}
                  variant="outlined"
                />
              </Tooltip>
            ))}
          </Box>
          <Typography variant="caption" color="text.secondary">
            Lines: {localAnalysis.lineCount} | Words: {localAnalysis.wordCount} | 
            Unique rhymes: {localAnalysis.uniqueRhymes}
          </Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="outlined" size="small">Copy</Button>
        <Button variant="outlined" size="small">Save</Button>
        <Button variant="outlined" size="small">Export</Button>
      </Box>
    </Paper>
  );
}
