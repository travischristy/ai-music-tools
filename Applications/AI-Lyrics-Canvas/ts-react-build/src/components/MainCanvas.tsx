import React from 'react';
import { Grid, Typography, Box, IconButton, Chip, Tooltip } from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import { useSettings } from '../contexts/SettingsContext.tsx';
import { SongTitleBlock } from './blocks/SongTitleBlock.tsx';
import { StyleOfMusicBlock } from './blocks/StyleOfMusicBlock.tsx';
import { CustomLyricsBlock } from './blocks/CustomLyricsBlock.tsx';
import { SongBlueprintsBlock } from './blocks/SongBlueprintsBlock.tsx';
import { AIWorkflowButtons } from './blocks/AIWorkflowButtons.tsx';
import { AnalysisResultsBlock } from './blocks/AnalysisResultsBlock.tsx';
import { APILoggerBlock } from './blocks/APILoggerBlock.tsx';

export function MainCanvas() {
  const { state: settingsState, actions: settingsActions } = useSettings();
  
  const getProviderDisplayName = (provider: string) => {
    switch (provider) {
      case 'openrouter': return 'OpenRouter';
      case 'openai': return 'OpenAI';
      case 'anthropic': return 'Anthropic';
      case 'mock': return 'Mock (Demo)';
      default: return provider;
    }
  };
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #ec4899 100%)',
        p: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            color: 'white',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          }}
        >
          AI Lyrics Canvas
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title={`Current AI Provider: ${getProviderDisplayName(settingsState.selectedProvider)}`}>
            <Chip
              label={getProviderDisplayName(settingsState.selectedProvider)}
              size="small"
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                '& .MuiChip-label': { fontWeight: 'bold' }
              }}
            />
          </Tooltip>
          
          <Tooltip title="Open Settings">
            <IconButton
              onClick={() => settingsActions.openSettings()}
              sx={{
                color: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                },
              }}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          <SongTitleBlock />
          <StyleOfMusicBlock />
          <SongBlueprintsBlock />
          <CustomLyricsBlock />
          <AIWorkflowButtons />
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          <AnalysisResultsBlock />
          <APILoggerBlock />
        </Grid>
      </Grid>
    </Box>
  );
}
