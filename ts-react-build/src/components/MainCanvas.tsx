import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { SongTitleBlock } from './blocks/SongTitleBlock';
import { StyleOfMusicBlock } from './blocks/StyleOfMusicBlock';
import { CustomLyricsBlock } from './blocks/CustomLyricsBlock';
import { SongBlueprintsBlock } from './blocks/SongBlueprintsBlock';
import { AIWorkflowButtons } from './blocks/AIWorkflowButtons';
import { AnalysisResultsBlock } from './blocks/AnalysisResultsBlock';
import { APILoggerBlock } from './blocks/APILoggerBlock';

export function MainCanvas() {
  return (
    <Box>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{
          background: 'linear-gradient(45deg, #6366f1, #ec4899)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold',
          textAlign: 'center',
          mb: 4,
        }}
      >
        AI Lyrics Canvas
      </Typography>

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
