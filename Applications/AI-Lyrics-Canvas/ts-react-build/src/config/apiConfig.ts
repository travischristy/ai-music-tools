// API Configuration for AI Lyrics Canvas
export interface APIConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
  timeout: number;
}

// Default configuration - can be overridden via environment variables
export const defaultAPIConfig: APIConfig = {
  baseUrl: process.env.REACT_APP_API_BASE_URL || 'https://api.openai.com/v1',
  apiKey: process.env.REACT_APP_API_KEY || '',
  model: process.env.REACT_APP_MODEL || 'gpt-4',
  maxTokens: parseInt(process.env.REACT_APP_MAX_TOKENS || '2000'),
  temperature: parseFloat(process.env.REACT_APP_TEMPERATURE || '0.7'),
  timeout: parseInt(process.env.REACT_APP_TIMEOUT || '30000'),
};

// Generation parameters for different AI workflows
export interface GenerationParams {
  lyrics: {
    temperature: number;
    maxTokens: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
  };
  analysis: {
    temperature: number;
    maxTokens: number;
    topP: number;
  };
  enhancement: {
    temperature: number;
    maxTokens: number;
    topP: number;
    frequencyPenalty: number;
  };
}

export const defaultGenerationParams: GenerationParams = {
  lyrics: {
    temperature: 0.8,
    maxTokens: 1500,
    topP: 0.9,
    frequencyPenalty: 0.3,
    presencePenalty: 0.2,
  },
  analysis: {
    temperature: 0.3,
    maxTokens: 800,
    topP: 0.8,
  },
  enhancement: {
    temperature: 0.6,
    maxTokens: 1200,
    topP: 0.85,
    frequencyPenalty: 0.2,
  },
};

// Supported AI providers
export enum AIProvider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  COHERE = 'cohere',
  LOCAL = 'local',
}

// Provider-specific configurations
export const providerConfigs = {
  [AIProvider.OPENAI]: {
    baseUrl: 'https://api.openai.com/v1',
    models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }),
  },
  [AIProvider.ANTHROPIC]: {
    baseUrl: 'https://api.anthropic.com/v1',
    models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
    headers: (apiKey: string) => ({
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
    }),
  },
  [AIProvider.COHERE]: {
    baseUrl: 'https://api.cohere.ai/v1',
    models: ['command', 'command-light', 'command-nightly'],
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }),
  },
  [AIProvider.LOCAL]: {
    baseUrl: 'http://localhost:11434/v1', // Ollama default
    models: ['llama2', 'codellama', 'mistral'],
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },
};

// Validate API configuration
export function validateAPIConfig(config: APIConfig): boolean {
  if (!config.baseUrl) {
    console.error('API base URL is required');
    return false;
  }
  
  if (!config.apiKey && !config.baseUrl.includes('localhost')) {
    console.error('API key is required for external services');
    return false;
  }
  
  if (!config.model) {
    console.error('Model name is required');
    return false;
  }
  
  return true;
}
