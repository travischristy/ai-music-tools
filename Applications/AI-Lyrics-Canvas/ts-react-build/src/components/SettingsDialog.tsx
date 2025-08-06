import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Typography,
  Box,
  Tabs,
  Tab,
  Chip,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  ExpandMore as ExpandMoreIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Star as StarIcon,
  AttachMoney as MoneyIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import { useSettings } from '../contexts/SettingsContext.tsx';
import { OpenRouterModel, openRouterService } from '../services/openRouterService.ts';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index} style={{ paddingTop: 16 }}>
      {value === index && children}
    </div>
  );
}

export function SettingsDialog() {
  const { state, actions } = useSettings();
  const [tabValue, setTabValue] = useState(0);
  const [modelSearch, setModelSearch] = useState('');
  const [modelFilter, setModelFilter] = useState<'all' | 'recommended' | 'cheapest' | 'fastest'>('all');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Fetch models when dialog opens and API key is available
  useEffect(() => {
    if (state.settingsOpen && state.openRouterConfig.apiKey && state.availableModels.length === 0) {
      actions.fetchModels();
    }
  }, [state.settingsOpen, state.openRouterConfig.apiKey]);

  const handleClose = () => {
    actions.closeSettings();
  };

  const handleConfigChange = (field: string, value: any) => {
    actions.updateOpenRouterConfig({ [field]: value });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleRefreshModels = () => {
    actions.fetchModels();
  };

  // Filter and search models
  const getFilteredModels = (): OpenRouterModel[] => {
    let filtered = state.availableModels;

    // Apply search filter
    if (modelSearch) {
      filtered = openRouterService.searchModels(filtered, modelSearch);
    }

    // Apply category filter
    switch (modelFilter) {
      case 'recommended':
        filtered = openRouterService.getRecommendedModels(filtered);
        break;
      case 'cheapest':
        filtered = openRouterService.getModelsByPrice(filtered).slice(0, 20);
        break;
      case 'fastest':
        filtered = filtered.filter(model => model.context_length <= 32000).slice(0, 20);
        break;
      default:
        break;
    }

    return filtered;
  };

  const selectedModel = state.availableModels.find(m => m.id === state.openRouterConfig.selectedModel);

  return (
    <Dialog
      open={state.settingsOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '70vh', maxHeight: '90vh' }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <SettingsIcon />
          AI Settings & Configuration
        </Box>
      </DialogTitle>

      <DialogContent>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tab label="Provider & Model" />
          <Tab label="Generation Parameters" />
          <Tab label="Advanced Settings" />
        </Tabs>

        {/* Provider & Model Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>AI Provider</InputLabel>
              <Select
                value={state.selectedProvider}
                onChange={(e) => actions.setProvider(e.target.value as any)}
                label="AI Provider"
              >
                <MenuItem value="mock">Mock API (Development)</MenuItem>
                <MenuItem value="openrouter">OpenRouter (400+ Models)</MenuItem>
                <MenuItem value="openai">OpenAI Direct</MenuItem>
                <MenuItem value="anthropic">Anthropic Direct</MenuItem>
              </Select>
            </FormControl>

            {state.selectedProvider === 'openrouter' && (
              <>
                <TextField
                  fullWidth
                  label="OpenRouter API Key"
                  type="password"
                  value={state.openRouterConfig.apiKey}
                  onChange={(e) => handleConfigChange('apiKey', e.target.value)}
                  placeholder="sk-or-v1-..."
                  sx={{ mb: 2 }}
                  helperText="Get your API key from https://openrouter.ai/keys"
                />

                {state.openRouterConfig.apiKey && (
                  <>
                    <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
                      <TextField
                        label="Search Models"
                        value={modelSearch}
                        onChange={(e) => setModelSearch(e.target.value)}
                        placeholder="Search by name or description..."
                        InputProps={{
                          startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                        }}
                        sx={{ flexGrow: 1 }}
                      />
                      <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Filter</InputLabel>
                        <Select
                          value={modelFilter}
                          onChange={(e) => setModelFilter(e.target.value as any)}
                          label="Filter"
                        >
                          <MenuItem value="all">All Models</MenuItem>
                          <MenuItem value="recommended">Recommended</MenuItem>
                          <MenuItem value="cheapest">Cheapest</MenuItem>
                          <MenuItem value="fastest">Fastest</MenuItem>
                        </Select>
                      </FormControl>
                      <Tooltip title="Refresh Models">
                        <IconButton onClick={handleRefreshModels} disabled={state.isLoadingModels}>
                          {state.isLoadingModels ? <CircularProgress size={24} /> : <RefreshIcon />}
                        </IconButton>
                      </Tooltip>
                    </Box>

                    {state.modelsError && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {state.modelsError}
                      </Alert>
                    )}

                    {state.isLoadingModels && (
                      <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
                        <CircularProgress size={20} />
                        <Typography>Loading available models...</Typography>
                      </Box>
                    )}

                    {!state.isLoadingModels && state.availableModels.length > 0 && (
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Selected Model</InputLabel>
                        <Select
                          value={state.openRouterConfig.selectedModel}
                          onChange={(e) => handleConfigChange('selectedModel', e.target.value)}
                          label="Selected Model"
                        >
                          {getFilteredModels().map((model) => (
                            <MenuItem key={model.id} value={model.id}>
                              <Box>
                                <Typography variant="body2" fontWeight="bold">
                                  {model.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {model.id} • Context: {model.context_length.toLocaleString()} tokens •{' '}
                                  Prompt: {openRouterService.formatPrice(model.pricing.prompt)} •{' '}
                                  Completion: {openRouterService.formatPrice(model.pricing.completion)}
                                </Typography>
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}

                    {selectedModel && (
                      <Card sx={{ mb: 2 }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {selectedModel.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {selectedModel.description}
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Box display="flex" alignItems="center" gap={1}>
                                <SpeedIcon fontSize="small" />
                                <Typography variant="body2">
                                  Context: {selectedModel.context_length.toLocaleString()} tokens
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6}>
                              <Box display="flex" alignItems="center" gap={1}>
                                <MoneyIcon fontSize="small" />
                                <Typography variant="body2">
                                  Prompt: {openRouterService.formatPrice(selectedModel.pricing.prompt)}
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                              Supported Parameters:
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                              {selectedModel.supported_parameters.slice(0, 8).map((param) => (
                                <Chip key={param} label={param} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                              ))}
                              {selectedModel.supported_parameters.length > 8 && (
                                <Chip label={`+${selectedModel.supported_parameters.length - 8} more`} size="small" />
                              )}
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </>
            )}
          </Box>
        </TabPanel>

        {/* Generation Parameters Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>Temperature: {state.openRouterConfig.temperature}</Typography>
              <Slider
                value={state.openRouterConfig.temperature}
                onChange={(_, value) => handleConfigChange('temperature', value)}
                min={0}
                max={2}
                step={0.1}
                marks={[
                  { value: 0, label: '0 (Deterministic)' },
                  { value: 1, label: '1 (Balanced)' },
                  { value: 2, label: '2 (Creative)' },
                ]}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>Max Tokens: {state.openRouterConfig.maxTokens}</Typography>
              <Slider
                value={state.openRouterConfig.maxTokens}
                onChange={(_, value) => handleConfigChange('maxTokens', value)}
                min={100}
                max={4000}
                step={100}
                marks={[
                  { value: 500, label: '500' },
                  { value: 2000, label: '2000' },
                  { value: 4000, label: '4000' },
                ]}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>Top P: {state.openRouterConfig.topP}</Typography>
              <Slider
                value={state.openRouterConfig.topP}
                onChange={(_, value) => handleConfigChange('topP', value)}
                min={0}
                max={1}
                step={0.05}
                marks={[
                  { value: 0.1, label: '0.1' },
                  { value: 0.5, label: '0.5' },
                  { value: 1, label: '1.0' },
                ]}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>Frequency Penalty: {state.openRouterConfig.frequencyPenalty}</Typography>
              <Slider
                value={state.openRouterConfig.frequencyPenalty}
                onChange={(_, value) => handleConfigChange('frequencyPenalty', value)}
                min={-2}
                max={2}
                step={0.1}
                marks={[
                  { value: -1, label: '-1' },
                  { value: 0, label: '0' },
                  { value: 1, label: '1' },
                ]}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>Presence Penalty: {state.openRouterConfig.presencePenalty}</Typography>
              <Slider
                value={state.openRouterConfig.presencePenalty}
                onChange={(_, value) => handleConfigChange('presencePenalty', value)}
                min={-2}
                max={2}
                step={0.1}
                marks={[
                  { value: -1, label: '-1' },
                  { value: 0, label: '0' },
                  { value: 1, label: '1' },
                ]}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Advanced Settings Tab */}
        <TabPanel value={tabValue} index={2}>
          <FormControlLabel
            control={
              <Switch
                checked={showAdvanced}
                onChange={(e) => setShowAdvanced(e.target.checked)}
              />
            }
            label="Show Advanced Options"
            sx={{ mb: 2 }}
          />

          {showAdvanced && (
            <Box>
              <TextField
                fullWidth
                label="Stop Sequences (comma-separated)"
                value={state.openRouterConfig.stop.join(', ')}
                onChange={(e) => handleConfigChange('stop', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                placeholder="\\n, END, STOP"
                sx={{ mb: 2 }}
                helperText="Custom sequences that will stop generation"
              />

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Cost Estimation</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {selectedModel && (
                    <Box>
                      <Typography variant="body2" gutterBottom>
                        Estimated cost for typical lyrics generation (1000 input + 500 output tokens):
                      </Typography>
                      <Typography variant="h6" color="primary">
                        ${openRouterService.calculateEstimatedCost(selectedModel, 1000, 500).toFixed(6)}
                      </Typography>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Reset Settings</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      This will reset all settings to their default values.
                    </Typography>
                    <Button
                      variant="outlined"
                      color="warning"
                      onClick={actions.resetSettings}
                    >
                      Reset All Settings
                    </Button>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          )}
        </TabPanel>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        <Button variant="contained" onClick={handleClose}>
          Save Settings
        </Button>
      </DialogActions>
    </Dialog>
  );
}
