import { defaultAPIConfig, defaultGenerationParams, AIProvider, providerConfigs, validateAPIConfig, APIConfig } from '../config/apiConfig.ts';

export class AIService {
  private config: APIConfig;
  private provider: AIProvider;

  constructor(config?: Partial<APIConfig>) {
    this.config = { ...defaultAPIConfig, ...config };
    this.provider = this.detectProvider();
    
    if (!validateAPIConfig(this.config)) {
      throw new Error('Invalid API configuration');
    }
  }

  private detectProvider(): AIProvider {
    const url = this.config.baseUrl.toLowerCase();
    if (url.includes('openai.com')) return AIProvider.OPENAI;
    if (url.includes('anthropic.com')) return AIProvider.ANTHROPIC;
    if (url.includes('cohere.ai')) return AIProvider.COHERE;
    if (url.includes('localhost') || url.includes('127.0.0.1')) return AIProvider.LOCAL;
    return AIProvider.OPENAI; // default
  }

  private getHeaders(): Record<string, string> {
    const providerConfig = providerConfigs[this.provider];
    return providerConfig.headers(this.config.apiKey);
  }

  private async makeRequest(endpoint: string, payload: any): Promise<any> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(this.config.timeout),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  }

  async generateLyrics(options: {
    songTitle: string;
    styleOfMusic: string;
    customLyrics?: string;
    creativity: number;
    sections: string;
  }): Promise<{ lyrics: string; metadata: any }> {
    const prompt = this.buildLyricsPrompt(options);
    const params = defaultGenerationParams.lyrics;

    const payload = this.buildPayload(prompt, {
      ...params,
      temperature: options.creativity,
    });

    const response = await this.makeRequest('/chat/completions', payload);
    
    return {
      lyrics: this.extractContent(response),
      metadata: {
        model: this.config.model,
        temperature: options.creativity,
        generatedAt: new Date().toISOString(),
        tokensUsed: response.usage?.total_tokens || 0,
      },
    };
  }

  async analyzeLyrics(options: {
    customLyrics: string;
    styleOfMusic: string;
    includeRhymes: boolean;
    includeCliches: boolean;
    includeSentiment: boolean;
  }): Promise<any> {
    const prompt = this.buildAnalysisPrompt(options);
    const params = defaultGenerationParams.analysis;

    const payload = this.buildPayload(prompt, params);
    const response = await this.makeRequest('/chat/completions', payload);
    
    try {
      const analysisText = this.extractContent(response);
      return JSON.parse(analysisText);
    } catch (error) {
      console.error('Failed to parse analysis response:', error);
      throw new Error('Invalid analysis response format');
    }
  }

  async enhanceLyrics(options: {
    customLyrics: string;
    styleOfMusic: string;
    enhancementType: 'adlibs' | 'flow' | 'style' | 'structure';
  }): Promise<{ enhancedLyrics: string; enhancements: string[] }> {
    const prompt = this.buildEnhancementPrompt(options);
    const params = defaultGenerationParams.enhancement;

    const payload = this.buildPayload(prompt, params);
    const response = await this.makeRequest('/chat/completions', payload);
    
    const content = this.extractContent(response);
    
    // Parse the response to extract enhanced lyrics and changes
    const lines = content.split('\n');
    const enhancedLyrics = lines.filter(line => !line.startsWith('ENHANCEMENT:')).join('\n');
    const enhancements = lines.filter(line => line.startsWith('ENHANCEMENT:')).map(line => line.replace('ENHANCEMENT:', '').trim());
    
    return {
      enhancedLyrics: enhancedLyrics.trim(),
      enhancements,
    };
  }

  private buildLyricsPrompt(options: any): string {
    return `You are an expert songwriter and lyricist. Generate original, creative lyrics based on the following parameters:

Song Title: "${options.songTitle}"
Style/Genre: "${options.styleOfMusic}"
Sections to include: ${options.sections}
${options.customLyrics ? `Existing lyrics to build upon:\n${options.customLyrics}` : ''}

Requirements:
- Create unique, original lyrics that avoid common clichés
- Follow proper song structure with clear section markers [Verse], [Chorus], etc.
- Match the specified style and mood
- Use vivid imagery and strong metaphors
- Ensure good rhyme schemes and syllable flow
- Make it suitable for Suno AI music generation

Generate the complete lyrics:`;
  }

  private buildAnalysisPrompt(options: any): string {
    return `Analyze the following lyrics and provide a detailed JSON response:

Lyrics:
${options.customLyrics}

Style Context: ${options.styleOfMusic}

Provide analysis in this exact JSON format:
{
  "rhymeScheme": ["A", "B", "A", "B"],
  "syllableCounts": [8, 7, 8, 7],
  "cliches": [
    {"word": "broken heart", "severity": "high", "suggestions": ["wounded spirit", "fractured soul"]}
  ],
  "overusedWords": ["the", "and"],
  "sentiment": "melancholic",
  "strength": 75,
  "suggestions": ["Improve metaphors", "Vary line lengths"]
}

Include ${options.includeRhymes ? 'rhyme analysis, ' : ''}${options.includeCliches ? 'cliche detection, ' : ''}${options.includeSentiment ? 'sentiment analysis' : ''}.`;
  }

  private buildEnhancementPrompt(options: any): string {
    const enhancementInstructions = {
      adlibs: 'Add vocal ad-libs, backing vocals, and call-and-response elements in parentheses',
      flow: 'Improve the rhythmic flow and syllable patterns for better musicality',
      style: 'Enhance the style to better match the specified genre and mood',
      structure: 'Improve the song structure and add transitions between sections'
    };

    return `Enhance the following lyrics by ${enhancementInstructions[options.enhancementType]}:

Original Lyrics:
${options.customLyrics}

Style: ${options.styleOfMusic}

Instructions:
- ${enhancementInstructions[options.enhancementType]}
- Maintain the original meaning and flow
- Mark each enhancement with "ENHANCEMENT: [description]" on separate lines
- Return the enhanced lyrics with all improvements

Enhanced lyrics:`;
  }

  private buildPayload(prompt: string, params: any): any {
    const basePayload = {
      model: this.config.model,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: params.maxTokens,
      temperature: params.temperature,
    };

    // Add provider-specific parameters
    if (this.provider === AIProvider.OPENAI) {
      return {
        ...basePayload,
        top_p: params.topP,
        frequency_penalty: params.frequencyPenalty,
        presence_penalty: params.presencePenalty,
      };
    }

    if (this.provider === AIProvider.ANTHROPIC) {
      return {
        model: this.config.model,
        max_tokens: params.maxTokens,
        messages: basePayload.messages,
        temperature: params.temperature,
      };
    }

    return basePayload;
  }

  private extractContent(response: any): string {
    if (this.provider === AIProvider.OPENAI) {
      return response.choices?.[0]?.message?.content || '';
    }
    
    if (this.provider === AIProvider.ANTHROPIC) {
      return response.content?.[0]?.text || '';
    }
    
    // Default extraction
    return response.choices?.[0]?.message?.content || response.content || '';
  }
}

// Singleton instance
export const aiService = new AIService();
