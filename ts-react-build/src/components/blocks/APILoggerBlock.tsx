import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Collapse,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useLyricsCanvas } from '../../contexts/LyricsCanvasContext';

export function APILoggerBlock() {
  const { state } = useLyricsCanvas();
  const [expanded, setExpanded] = useState(false);
  const [selectedLog, setSelectedLog] = useState<number | null>(null);

  const handleResendRequest = (logIndex: number) => {
    const log = state.apiLogs[logIndex];
    console.log('Resending request:', log.request);
    // Implement resend logic here
  };

  return (
    <Paper className="canvas-block">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">
          API Logger ({state.apiLogs.length})
        </Typography>
        <IconButton onClick={() => setExpanded(!expanded)}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ mt: 2 }}>
          {state.apiLogs.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No API requests logged yet.
            </Typography>
          ) : (
            <List dense>
              {state.apiLogs.slice(-10).reverse().map((log, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">
                          {log.timestamp.toLocaleTimeString()}
                        </Typography>
                        <Chip
                          label={log.request.type || 'Unknown'}
                          size="small"
                          color="primary"
                        />
                      </Box>
                    }
                    secondary={
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="caption">
                            View Details
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" fontWeight="bold">
                              Request:
                            </Typography>
                            <Box
                              component="pre"
                              sx={{
                                fontSize: '0.75rem',
                                backgroundColor: 'rgba(0,0,0,0.2)',
                                p: 1,
                                borderRadius: 1,
                                overflow: 'auto',
                                maxHeight: 200,
                              }}
                            >
                              {JSON.stringify(log.request, null, 2)}
                            </Box>
                          </Box>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" fontWeight="bold">
                              Response:
                            </Typography>
                            <Box
                              component="pre"
                              sx={{
                                fontSize: '0.75rem',
                                backgroundColor: 'rgba(0,0,0,0.2)',
                                p: 1,
                                borderRadius: 1,
                                overflow: 'auto',
                                maxHeight: 200,
                              }}
                            >
                              {JSON.stringify(log.response, null, 2)}
                            </Box>
                          </Box>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<RefreshIcon />}
                            onClick={() => handleResendRequest(index)}
                          >
                            Resend Request
                          </Button>
                        </AccordionDetails>
                      </Accordion>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
}
