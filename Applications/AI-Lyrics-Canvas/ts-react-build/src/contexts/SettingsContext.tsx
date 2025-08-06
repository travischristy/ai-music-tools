import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { OpenRouterConfig, OpenRouterModel, defaultOpenRouterConfig, openRouterService } from '../services/openRouterService.ts';

export interface SettingsState {
  openRouterConfig: OpenRouterConfig;
  availableModels: OpenRouterModel[];
  isLoadingModels: boolean;
  modelsError: string | null;
  selectedProvider: 'mock' | 'openrouter' | 'openai' | 'anthropic';
  settingsOpen: boolean;
}

type SettingsAction =
  | { type: 'SET_OPENROUTER_CONFIG'; payload: Partial<OpenRouterConfig> }
  | { type: 'SET_AVAILABLE_MODELS'; payload: OpenRouterModel[] }
  | { type: 'SET_LOADING_MODELS'; payload: boolean }
  | { type: 'SET_MODELS_ERROR'; payload: string | null }
  | { type: 'SET_SELECTED_PROVIDER'; payload: SettingsState['selectedProvider'] }
  | { type: 'SET_SETTINGS_OPEN'; payload: boolean }
  | { type: 'RESET_SETTINGS' };

const initialState: SettingsState = {
  openRouterConfig: defaultOpenRouterConfig,
  availableModels: [],
  isLoadingModels: false,
  modelsError: null,
  selectedProvider: process.env.REACT_APP_USE_MOCK_API === 'true' ? 'mock' : 'openrouter',
  settingsOpen: false,
};

function settingsReducer(state: SettingsState, action: SettingsAction): SettingsState {
  switch (action.type) {
    case 'SET_OPENROUTER_CONFIG':
      return {
        ...state,
        openRouterConfig: { ...state.openRouterConfig, ...action.payload },
      };
    case 'SET_AVAILABLE_MODELS':
      return { ...state, availableModels: action.payload, modelsError: null };
    case 'SET_LOADING_MODELS':
      return { ...state, isLoadingModels: action.payload };
    case 'SET_MODELS_ERROR':
      return { ...state, modelsError: action.payload, isLoadingModels: false };
    case 'SET_SELECTED_PROVIDER':
      return { ...state, selectedProvider: action.payload };
    case 'SET_SETTINGS_OPEN':
      return { ...state, settingsOpen: action.payload };
    case 'RESET_SETTINGS':
      return { ...initialState, settingsOpen: state.settingsOpen };
    default:
      return state;
  }
}

const SettingsContext = createContext<{
  state: SettingsState;
  dispatch: React.Dispatch<SettingsAction>;
  actions: {
    updateOpenRouterConfig: (config: Partial<OpenRouterConfig>) => void;
    fetchModels: () => Promise<void>;
    setProvider: (provider: SettingsState['selectedProvider']) => void;
    openSettings: () => void;
    closeSettings: () => void;
    resetSettings: () => void;
  };
} | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(settingsReducer, initialState);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('aiLyricsCanvasSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        dispatch({ type: 'SET_OPENROUTER_CONFIG', payload: parsed.openRouterConfig });
        dispatch({ type: 'SET_SELECTED_PROVIDER', payload: parsed.selectedProvider });
      } catch (error) {
        console.error('Failed to load settings from localStorage:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    const settingsToSave = {
      openRouterConfig: state.openRouterConfig,
      selectedProvider: state.selectedProvider,
    };
    localStorage.setItem('aiLyricsCanvasSettings', JSON.stringify(settingsToSave));
  }, [state.openRouterConfig, state.selectedProvider]);

  const actions = {
    updateOpenRouterConfig: (config: Partial<OpenRouterConfig>) => {
      dispatch({ type: 'SET_OPENROUTER_CONFIG', payload: config });
      openRouterService.updateConfig(config);
    },

    fetchModels: async () => {
      if (!state.openRouterConfig.apiKey) {
        dispatch({ type: 'SET_MODELS_ERROR', payload: 'OpenRouter API key is required' });
        return;
      }

      dispatch({ type: 'SET_LOADING_MODELS', payload: true });
      dispatch({ type: 'SET_MODELS_ERROR', payload: null });

      try {
        const models = await openRouterService.fetchAvailableModels();
        dispatch({ type: 'SET_AVAILABLE_MODELS', payload: models });
      } catch (error) {
        dispatch({ 
          type: 'SET_MODELS_ERROR', 
          payload: error instanceof Error ? error.message : 'Failed to fetch models' 
        });
      } finally {
        dispatch({ type: 'SET_LOADING_MODELS', payload: false });
      }
    },

    setProvider: (provider: SettingsState['selectedProvider']) => {
      dispatch({ type: 'SET_SELECTED_PROVIDER', payload: provider });
    },

    openSettings: () => {
      dispatch({ type: 'SET_SETTINGS_OPEN', payload: true });
    },

    closeSettings: () => {
      dispatch({ type: 'SET_SETTINGS_OPEN', payload: false });
    },

    resetSettings: () => {
      dispatch({ type: 'RESET_SETTINGS' });
      localStorage.removeItem('aiLyricsCanvasSettings');
    },
  };

  return (
    <SettingsContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
