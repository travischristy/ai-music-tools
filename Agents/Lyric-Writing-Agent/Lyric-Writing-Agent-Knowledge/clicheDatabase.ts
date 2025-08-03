// clicheDatabase.ts

interface ClicheEntry {
  term: string;
  type: 'word' | 'phrase' | 'pattern';
  category?: string;
  reason?: string;
  alternatives?: string[];
  pattern?: RegExp;
}

export const CLICHE_DATABASE: ClicheEntry[] = [
  // Single Words
  {
    term: 'shadows',
    type: 'word',
    reason: 'Overused concept in lyrics, lacks specificity',
    alternatives: ['Try describing what actually created the darkness or what specific thing is being hidden']
  },
  {
    term: 'storms',
    type: 'word',
    reason: 'Generic metaphor for emotional turbulence',
    alternatives: ['Describe the actual emotional impact using concrete details']
  },
  {
    term: 'waves',
    type: 'word',
    reason: 'Generic metaphor for overwhelming emotions',
    alternatives: ['Use specific, personal experiences to convey being overwhelmed']
  },
  {
    term: 'whispers',
    type: 'word',
    reason: 'Overly dramatic and unoriginal',
    alternatives: ['Describe the actual quiet conversation or subtle communication']
  },
  {
    term: 'echoes',
    type: 'word',
    reason: 'Overused for describing memories or past events',
    alternatives: ['Reference specific sounds or memories']
  },
  {
    term: 'shine',
    type: 'word',
    reason: 'Generic descriptor lacking impact',
    alternatives: ['Describe the specific quality of light or success']
  },
  {
    term: 'glow',
    type: 'word',
    reason: 'Overused for describing light or warmth',
    alternatives: ['Describe the specific source or quality of light']
  },
  {
    term: 'spark',
    type: 'word',
    category: 'Fire/Heat Metaphors',
    reason: 'Overused metaphor for inspiration or attraction',
    alternatives: ['Describe the specific moment or catalyst']
  },
  {
    term: 'ignite',
    type: 'word',
    category: 'Fire/Heat Metaphors',
    reason: 'Clichéd way to describe passion or beginning',
    alternatives: ['Describe the actual moment something began']
  },

  // Emotional State Patterns
  {
    term: 'heart',
    type: 'pattern',
    pattern: /heart\s+(beats|breaks|skips)/i,
    category: 'Emotional State Descriptors',
    reason: 'Overused way to describe emotional states',
    alternatives: ['Describe physical sensations or specific emotional reactions']
  },
  {
    term: 'soul',
    type: 'pattern',
    pattern: /soul\s+(searching|crying|dancing)/i,
    category: 'Emotional State Descriptors',
    reason: 'Abstract and overused emotional description',
    alternatives: ['Describe concrete actions or specific feelings']
  },
  {
    term: 'spirit',
    type: 'pattern',
    pattern: /spirit\s+(soars|flies|rises)/i,
    category: 'Emotional State Descriptors',
    reason: 'Vague spiritual/emotional metaphor',
    alternatives: ['Describe specific moments of joy or freedom']
  },

  // Common Phrases
  {
    term: 'shattered dreams',
    type: 'phrase',
    reason: 'Common in AI lyrics, lacks personal touch',
    alternatives: ['Describe specific hopes that were lost']
  },
  {
    term: 'endless night',
    type: 'phrase',
    reason: 'Lacks unique emotional depth',
    alternatives: ['Reference specific late-night moments or experiences']
  },
  {
    term: 'fading light',
    type: 'phrase',
    reason: 'Predictable metaphor for loss/decline',
    alternatives: ['Describe the specific moment of transition or loss']
  },
  {
    term: 'lost in time',
    type: 'phrase',
    reason: 'Generic way to convey nostalgia',
    alternatives: ['Reference specific dates or memorable moments']
  },

  // Time-Based Patterns
  {
    term: 'moment by moment',
    type: 'phrase',
    category: 'Time-Based Progressions',
    reason: 'Creates artificial pacing',
    alternatives: ['Describe specific moments in sequence']
  },
  {
    term: 'day after day',
    type: 'phrase',
    category: 'Time-Based Progressions',
    reason: 'Vague temporal progression',
    alternatives: ['Specify actual timeframes or significant days']
  },

  // Movement Clichés
  {
    term: 'moving forward',
    type: 'phrase',
    category: 'Direction/Movement Clichés',
    reason: 'Vague progression metaphor',
    alternatives: ['Describe specific actions taken to progress']
  },
  {
    term: 'walking away',
    type: 'phrase',
    category: 'Direction/Movement Clichés',
    reason: 'Overused for describing endings',
    alternatives: ['Describe the specific act of leaving or ending']
  }
];

// Enhanced detection function
export function detectCliches(text: string): ClicheMatch[] {
  const matches: ClicheMatch[] = [];
  const words = text.toLowerCase().split(/\s+/);
  
  CLICHE_DATABASE.forEach(entry => {
    if (entry.type === 'word') {
      const regex = new RegExp(`\\b${entry.term}\\b`, 'gi');
      let match;
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          text: match[0],
          type: 'word',
          index: match.index,
          length: match[0].length,
          explanation: entry.reason,
          alternatives: entry.alternatives,
          category: entry.category
        });
      }
    } else if (entry.type === 'phrase') {
      const regex = new RegExp(entry.term, 'gi');
      let match;
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          text: match[0],
          type: 'phrase',
          index: match.index,
          length: match[0].length,
          explanation: entry.reason,
          alternatives: entry.alternatives,
          category: entry.category
        });
      }
    } else if (entry.type === 'pattern' && entry.pattern) {
      let match;
      while ((match = entry.pattern.exec(text)) !== null) {
        matches.push({
          text: match[0],
          type: 'pattern',
          index: match.index,
          length: match[0].length,
          explanation: entry.reason,
          alternatives: entry.alternatives,
          category: entry.category
        });
      }
    }
  });
  
  return matches;
}

// Update the tooltip component to show more detailed information
const ClicheTooltip: React.FC<{ match: ClicheMatch }> = ({ match }) => {
  return (
    <div className="max-w-xs p-2 text-sm">
      <p className="font-medium text-red-600">
        {match.category ? `${match.category}: ` : ''}
        Cliché Detected: "{match.text}"
      </p>
      <p className="mt-1 text-gray-600">{match.explanation}</p>
      {match.alternatives && match.alternatives.length > 0 && (
        <div className="mt-2">
          <p className="font-medium text-green-600">Try Instead:</p>
          <ul className="list-disc pl-4 text-gray-600">
            {match.alternatives.map((alt, i) => (
              <li key={i}>{alt}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Update the LineEditor component to use the enhanced tooltip
// ... (previous LineEditor code remains the same, just update the tooltip usage)
<span 
  key={`cliche-${idx}`}
  className="bg-yellow-100 border-b-2 border-yellow-400 cursor-help relative group"
>
  {text.slice(cliche.index, cliche.index + cliche.length)}
  <div className="absolute hidden group-hover:block bottom-full left-0 mb-2 z-50">
    <ClicheTooltip match={cliche} />
  </div>
</span>
