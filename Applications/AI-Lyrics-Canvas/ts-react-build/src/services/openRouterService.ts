// OpenRouter API Service
export interface OpenRouterModel {
  id: string;
  canonical_slug: string;
  name: string;
  created: number;
  description: string;
  context_length: number;
  architecture: {
    input_modalities: string[];
    output_modalities: string[];
    tokenizer: string;
    instruct_type: string | null;
  };
  pricing: {
    prompt: string;
    completion: string;
    request: string;
    image: string;
    web_search: string;
    internal_reasoning: string;
    input_cache_read: string;
    input_cache_write: string;
  };
  top_provider: {
    context_length: number;
    max_completion_tokens: number;
    is_moderated: boolean;
  };
  per_request_limits: any;
  supported_parameters: string[];
}

export interface OpenRouterModelsResponse {
  data: OpenRouterModel[];
}

export interface OpenRouterConfig {
  apiKey: string;
  baseUrl: string;
  selectedModel: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  stop: string[];
}

export class OpenRouterService {
  private config: OpenRouterConfig;
  private modelsCache: OpenRouterModel[] | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor(config: OpenRouterConfig) {
    this.config = config;
  }

  updateConfig(newConfig: Partial<OpenRouterConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  async fetchAvailableModels(): Promise<OpenRouterModel[]> {
    // Check cache first
    const now = Date.now();
    if (this.modelsCache && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
      return this.modelsCache;
    }

    try {
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status} ${response.statusText}`);
      }

      const data: OpenRouterModelsResponse = await response.json();
      
      // Cache the results
      this.modelsCache = data.data;
      this.cacheTimestamp = now;
      
      return data.data;
    } catch (error) {
      console.error('OpenRouter models fetch error:', error);
      throw new Error('Failed to fetch available models from OpenRouter');
    }
  }

  async generateCompletion(prompt: string, options?: Partial<OpenRouterConfig>): Promise<any> {
    const config = { ...this.config, ...options };
    
    try {
      const response = await fetch(`${config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AI Lyrics Canvas',
        },
        body: JSON.stringify({
          model: config.selectedModel,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: config.temperature,
          max_tokens: config.maxTokens,
          top_p: config.topP,
          frequency_penalty: config.frequencyPenalty,
          presence_penalty: config.presencePenalty,
          stop: config.stop.length > 0 ? config.stop : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
      }

      return await response.json();
    } catch (error) {
      console.error('OpenRouter completion error:', error);
      throw error;
    }
  }

  // Filter models by capabilities
  getModelsByCapability(models: OpenRouterModel[], capability: string): OpenRouterModel[] {
    return models.filter(model => model.supported_parameters.includes(capability));
  }

  // Get models sorted by price (cheapest first)
  getModelsByPrice(models: OpenRouterModel[]): OpenRouterModel[] {
    return [...models].sort((a, b) => {
      const priceA = parseFloat(a.pricing.prompt) + parseFloat(a.pricing.completion);
      const priceB = parseFloat(b.pricing.prompt) + parseFloat(b.pricing.completion);
      return priceA - priceB;
    });
  }

  // Get models by context length (largest first)
  getModelsByContextLength(models: OpenRouterModel[]): OpenRouterModel[] {
    return [...models].sort((a, b) => b.context_length - a.context_length);
  }

  // Search models by name or description
  searchModels(models: OpenRouterModel[], query: string): OpenRouterModel[] {
    const lowercaseQuery = query.toLowerCase();
    return models.filter(model => 
      model.name.toLowerCase().includes(lowercaseQuery) ||
      model.description.toLowerCase().includes(lowercaseQuery) ||
      model.id.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Get popular/recommended models
  getRecommendedModels(models: OpenRouterModel[]): OpenRouterModel[] {
    const recommendedIds = [
      'openai/gpt-4o',
      'openai/gpt-4o-mini',
      'anthropic/claude-3.5-sonnet',
      'anthropic/claude-3-haiku',
      'google/gemini-2.0-flash-exp',
      'meta-llama/llama-3.1-405b-instruct',
      'mistralai/mistral-large',
      'cohere/command-r-plus',
    ];

    return models.filter(model => recommendedIds.includes(model.id));
  }

  // Calculate estimated cost for a request
  calculateEstimatedCost(model: OpenRouterModel, inputTokens: number, outputTokens: number): number {
    const promptCost = parseFloat(model.pricing.prompt) * inputTokens;
    const completionCost = parseFloat(model.pricing.completion) * outputTokens;
    const requestCost = parseFloat(model.pricing.request);
    
    return promptCost + completionCost + requestCost;
  }

  // Format price for display
  formatPrice(price: string): string {
    const numPrice = parseFloat(price);
    if (numPrice === 0) return 'Free';
    if (numPrice < 0.000001) return `$${(numPrice * 1000000).toFixed(2)}/M tokens`;
    if (numPrice < 0.001) return `$${(numPrice * 1000).toFixed(2)}/K tokens`;
    return `$${numPrice.toFixed(6)}/token`;
  }
}

// Default configuration
export const defaultOpenRouterConfig: OpenRouterConfig = {
  apiKey: process.env.REACT_APP_OPENROUTER_API_KEY || '',
  baseUrl: 'https://openrouter.ai/api/v1',
  selectedModel: 'openai/gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 2000,
  topP: 1.0,
  frequencyPenalty: 0.0,
  presencePenalty: 0.0,
  stop: [],
};

// Singleton instance
export const openRouterService = new OpenRouterService(defaultOpenRouterConfig);
