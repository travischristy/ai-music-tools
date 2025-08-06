import { useCallback } from 'react';
import { aiService } from '../services/aiService.ts';
import { openRouterService } from '../services/openRouterService.ts';
import { useSettings } from '../contexts/SettingsContext.tsx';

// Feature flag to toggle between mock and real API
const USE_MOCK_API = process.env.REACT_APP_USE_MOCK_API === 'true';

interface GenerateOptions {
  songTitle: string;
  styleOfMusic: string;
  customLyrics: string;
  creativity: number;
  stylePrompts: number;
  sections: string;
}

interface AnalyzeOptions {
  customLyrics: string;
  styleOfMusic: string;
  includeRhymes: boolean;
  includeCliches: boolean;
  includeSentiment: boolean;
}

export function useAIWorkflows() {
  const { state: settingsState } = useSettings();
  
  const generateLyrics = useCallback(async (options: GenerateOptions) => {
    if (USE_MOCK_API) {
      // Mock implementation for development/testing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockLyrics = `[Verse 1]
In the ${options.styleOfMusic.includes('dark') ? 'shadows' : 'light'} of the morning
Where the ${options.songTitle || 'story'} begins
Every whisper tells a secret
That the heart already knows

[Chorus]
${options.songTitle || 'This is our song'}
Rising like the dawn
${options.songTitle || 'This is our song'}
Until the night is gone

[Verse 2]
Through the valleys and the mountains
Where the echoes never fade
Every step becomes a promise
That we'll never be the same

[Chorus]
${options.songTitle || 'This is our song'}
Rising like the dawn
${options.songTitle || 'This is our song'}
Until the night is gone`;

      return {
        lyrics: mockLyrics,
        metadata: {
          creativity: options.creativity,
          stylePrompts: options.stylePrompts,
          generatedAt: new Date().toISOString(),
        },
      };
    }

    // Real AI API implementation
    try {
      if (settingsState.selectedProvider === 'openrouter') {
        // Use OpenRouter service
        const prompt = `You are an expert songwriter and lyricist. Generate original, creative lyrics based on the following parameters:

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

        const response = await openRouterService.generateCompletion(prompt, {
          temperature: options.creativity,
        });

        return {
          lyrics: response.choices[0]?.message?.content || 'Failed to generate lyrics',
          metadata: {
            model: settingsState.openRouterConfig.selectedModel,
            provider: 'openrouter',
            creativity: options.creativity,
            stylePrompts: options.stylePrompts,
            generatedAt: new Date().toISOString(),
            tokensUsed: response.usage?.total_tokens || 0,
          },
        };
      } else {
        // Use other AI services (OpenAI, Anthropic, etc.)
        return await aiService.generateLyrics({
          songTitle: options.songTitle,
          styleOfMusic: options.styleOfMusic,
          customLyrics: options.customLyrics,
          creativity: options.creativity,
          sections: options.sections,
        });
      }
    } catch (error) {
      console.error('Failed to generate lyrics:', error);
      throw new Error('Lyrics generation failed. Please check your API configuration.');
    }
  }, []);

  const analyzeLyrics = useCallback(async (options: AnalyzeOptions) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const lines = options.customLyrics.split('\n').filter(line => line.trim() && !line.startsWith('['));
    
    return {
      rhymeScheme: lines.map((_, index) => String.fromCharCode(65 + (index % 4))),
      syllableCounts: lines.map(() => Math.floor(Math.random() * 10) + 5),
      cliches: [
        { word: 'broken heart', severity: 'high' as const, suggestions: ['wounded spirit', 'fractured soul'] },
        { word: 'shadows', severity: 'medium' as const, suggestions: ['darkness', 'silhouettes'] },
      ],
      overusedWords: ['the', 'and', 'of'],
      sentiment: 'melancholic',
      strength: Math.floor(Math.random() * 40) + 60,
    };
  }, []);

  const editLyrics = useCallback(async (options: any) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    return {
      editedLyrics: options.customLyrics + '\n\n[Bridge]\nEdited section here...',
      changes: ['Added bridge section', 'Improved rhyme scheme'],
    };
  }, []);

  const enhanceLyrics = useCallback(async (options: any) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1600));
    
    return {
      enhancedLyrics: options.customLyrics.replace(/\n/g, '\n(yeah) '),
      enhancements: ['Added vocal ad-libs', 'Improved flow'],
    };
  }, []);

  return {
    generateLyrics,
    analyzeLyrics,
    editLyrics,
    enhanceLyrics,
  };
}
