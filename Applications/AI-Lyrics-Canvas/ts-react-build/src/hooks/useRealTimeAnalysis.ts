import { useCallback } from 'react';

interface LineAnalysis {
  rhymeScheme: string;
  syllableCount: number;
  cliches: string[];
  strength: number;
}

interface TextAnalysis {
  lines: LineAnalysis[];
  lineCount: number;
  wordCount: number;
  uniqueRhymes: number;
  cliches: Array<{ word: string; severity: 'high' | 'medium' | 'low' }>;
  overallStrength: number;
}

// Common clichés database (simplified for demo)
const CLICHES_DB = {
  high: ['broken heart', 'shattered dreams', 'endless night', 'ticking clock'],
  medium: ['shadows', 'storms', 'fire', 'burning', 'falling'],
  low: ['love', 'heart', 'soul', 'forever', 'always'],
};

export function useRealTimeAnalysis() {
  const countSyllables = useCallback((word: string): number => {
    // Simplified syllable counting algorithm
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    
    const vowels = 'aeiouy';
    let count = 0;
    let previousWasVowel = false;
    
    for (let i = 0; i < word.length; i++) {
      const isVowel = vowels.includes(word[i]);
      if (isVowel && !previousWasVowel) {
        count++;
      }
      previousWasVowel = isVowel;
    }
    
    // Handle silent e
    if (word.endsWith('e')) count--;
    
    return Math.max(1, count);
  }, []);

  const getRhymeScheme = useCallback((lines: string[]): string[] => {
    const endWords = lines.map(line => {
      const words = line.trim().split(/\s+/);
      return words[words.length - 1]?.toLowerCase().replace(/[^\w]/g, '') || '';
    });

    const rhymeGroups: { [key: string]: string } = {};
    let currentLetter = 'A';

    return endWords.map(word => {
      if (!word) return '';
      
      // Simple rhyme detection based on ending sounds
      const ending = word.slice(-2);
      
      if (!rhymeGroups[ending]) {
        rhymeGroups[ending] = currentLetter;
        currentLetter = String.fromCharCode(currentLetter.charCodeAt(0) + 1);
      }
      
      return rhymeGroups[ending];
    });
  }, []);

  const detectCliches = useCallback((text: string) => {
    const cliches: Array<{ word: string; severity: 'high' | 'medium' | 'low' }> = [];
    const lowerText = text.toLowerCase();

    Object.entries(CLICHES_DB).forEach(([severity, phrases]) => {
      phrases.forEach(phrase => {
        if (lowerText.includes(phrase)) {
          cliches.push({ word: phrase, severity: severity as 'high' | 'medium' | 'low' });
        }
      });
    });

    return cliches;
  }, []);

  const analyzeText = useCallback((text: string): TextAnalysis => {
    const lines = text.split('\n').filter(line => line.trim() && !line.startsWith('['));
    const words = text.split(/\s+/).filter(word => word.trim());
    
    const rhymeScheme = getRhymeScheme(lines);
    const cliches = detectCliches(text);
    
    const lineAnalyses: LineAnalysis[] = lines.map((line, index) => {
      const lineWords = line.split(/\s+/).filter(word => word.trim());
      const syllableCount = lineWords.reduce((sum, word) => sum + countSyllables(word), 0);
      const lineCliches = detectCliches(line).map(c => c.word);
      
      return {
        rhymeScheme: rhymeScheme[index] || '',
        syllableCount,
        cliches: lineCliches,
        strength: Math.max(0, 100 - (lineCliches.length * 20)),
      };
    });

    const uniqueRhymes = new Set(rhymeScheme.filter(r => r)).size;
    const overallStrength = Math.max(0, 100 - (cliches.length * 10));

    return {
      lines: lineAnalyses,
      lineCount: lines.length,
      wordCount: words.length,
      uniqueRhymes,
      cliches,
      overallStrength,
    };
  }, [getRhymeScheme, detectCliches, countSyllables]);

  return { analyzeText };
}
