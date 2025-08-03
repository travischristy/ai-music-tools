import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  LinearProgress,
  IconButton,
  Collapse,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useLyricsCanvas } from '../../contexts/LyricsCanvasContext';

export function AnalysisResultsBlock() {
  const { state } = useLyricsCanvas();
  const [expanded, setExpanded] = useState(true);

  if (!state.analysisResults) {
    return (
      <Paper className="canvas-block">
        <Typography variant="h6" gutterBottom>
          Analysis Results
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Run analysis to see detailed results here.
        </Typography>
      </Paper>
    );
  }

  const { analysisResults } = state;

  return (
    <Paper className="canvas-block">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">
          Analysis Results
        </Typography>
        <IconButton onClick={() => setExpanded(!expanded)}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ mt: 2 }}>
          {/* Overall Strength */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Overall Strength: {analysisResults.strength}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={analysisResults.strength}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(255,255,255,0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: analysisResults.strength > 70 ? '#10b981' : 
                                 analysisResults.strength > 40 ? '#f59e0b' : '#ef4444',
                },
              }}
            />
          </Box>

          {/* Rhyme Scheme */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle2">Rhyme Scheme Analysis</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {analysisResults.rhymeScheme.map((scheme, index) => (
                  <Chip
                    key={index}
                    label={`Line ${index + 1}: ${scheme}`}
                    size="small"
                    sx={{
                      backgroundColor: getRhymeColor(scheme),
                      color: 'white',
                    }}
                  />
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Syllable Counts */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle2">Syllable Analysis</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {analysisResults.syllableCounts.map((count, index) => (
                  <Chip
                    key={index}
                    label={`L${index + 1}: ${count}`}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Clichés */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle2">
                Clichés Found ({analysisResults.cliches.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {analysisResults.cliches.map((cliche, index) => (
                  <Box key={index}>
                    <Chip
                      label={cliche.word}
                      color={cliche.severity === 'high' ? 'error' : 
                             cliche.severity === 'medium' ? 'warning' : 'info'}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="caption" display="block">
                      Suggestions: {cliche.suggestions.join(', ')}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Overused Words */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle2">
                Overused Words ({analysisResults.overusedWords.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {analysisResults.overusedWords.map((word, index) => (
                  <Chip
                    key={index}
                    label={word}
                    size="small"
                    color="warning"
                    variant="outlined"
                  />
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Sentiment */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Sentiment: {analysisResults.sentiment}
            </Typography>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
}

function getRhymeColor(scheme: string) {
  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];
  const charCode = scheme.charCodeAt(0) - 65; // A=0, B=1, etc.
  return colors[charCode % colors.length];
}
