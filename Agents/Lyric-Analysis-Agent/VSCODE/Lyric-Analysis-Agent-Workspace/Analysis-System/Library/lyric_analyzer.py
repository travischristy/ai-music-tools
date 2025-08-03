"""
Lyric Analysis Library for validating and analyzing song lyrics.
"""

import re
import nltk
from typing import Dict, List, Tuple

class LyricAnalyzer:
    def __init__(self):
        # Download required NLTK data
        try:
            nltk.data.find('tokenizers/punkt')
        except LookupError:
            nltk.download('punkt')
        try:
            nltk.data.find('corpora/cmudict')
        except LookupError:
            nltk.download('cmudict')
        
        self.syllable_dict = nltk.corpus.cmudict.dict()

    def analyze_lyrics(self, lyrics: str) -> Dict[str, Any]:
        """Run complete analysis loop on lyrics."""
        return {
            'phase1': self.validate_metatags(lyrics),
            'phase2': self.analyze_syllables(lyrics),
            'phase3': self.analyze_rhyme_scheme(lyrics)
        }

    def validate_metatags(self, lyrics: str) -> List[Dict]:
        """Validate metatag usage in lyrics."""
        errors = []
        lines = lyrics.split('\n')
        
        for i, line in enumerate(lines, 1):
            # Check section headers
            if re.match(r'\[.*:.*\]', line):
                errors.append({
                    'line': i,
                    'text': line,
                    'error': 'Section headers should not contain colons',
                    'fix': 'Split into separate lines: [Section] and [Description]'
                })
            
            # Check backup vocals in brackets
            if re.match(r'\[.*\?.*\]', line) or re.match(r'\[Echo:.*\]', line):
                errors.append({
                    'line': i,
                    'text': line,
                    'error': 'Backup vocals/responses should use parentheses',
                    'fix': 'Replace square brackets with parentheses'
                })
            
            # Check instructions in parentheses
            if re.match(r'\(Guitar Solo\)', line) or re.match(r'\(Instrumental\)', line):
                errors.append({
                    'line': i,
                    'text': line,
                    'error': 'Musical instructions should use square brackets',
                    'fix': 'Replace parentheses with square brackets'
                })

        return errors

    def count_syllables(self, word: str) -> int:
        """Count syllables in a word using CMU dictionary."""
        word = word.lower()
        if word in self.syllable_dict:
            return len([ph for ph in self.syllable_dict[word][0] if ph[-1].isdigit()])
        # Fallback method for words not in dictionary
        return len(re.findall(r'[aeiou]+', word))

    def analyze_syllables(self, lyrics: str) -> Dict[str, List[int]]:
        """Analyze syllable patterns in each section."""
        patterns = {}
        current_section = None
        current_pattern = []
        
        for line in lyrics.split('\n'):
            # Skip empty lines
            if not line.strip():
                continue
                
            # Check for section header
            section_match = re.match(r'\[(.*?)\]', line)
            if section_match:
                if current_section and current_pattern:
                    patterns[current_section] = current_pattern
                current_section = section_match.group(1)
                current_pattern = []
                continue
            
            # Skip non-sung lines (instructions, etc.)
            if line.strip().startswith('[') or line.strip().startswith('('):
                continue
            
            # Count syllables in line
            words = nltk.word_tokenize(line)
            syllable_count = sum(self.count_syllables(word) for word in words)
            if syllable_count > 0:
                current_pattern.append(syllable_count)
        
        # Add final section
        if current_section and current_pattern:
            patterns[current_section] = current_pattern
            
        return patterns

    def analyze_rhyme_scheme(self, lyrics: str) -> Dict[str, List[str]]:
        """Analyze rhyme scheme in each section."""
        schemes = {}
        current_section = None
        current_lines = []
        
        for line in lyrics.split('\n'):
            # Skip empty lines
            if not line.strip():
                continue
                
            # Check for section header
            section_match = re.match(r'\[(.*?)\]', line)
            if section_match:
                if current_section and current_lines:
                    schemes[current_section] = self._get_rhyme_scheme(current_lines)
                current_section = section_match.group(1)
                current_lines = []
                continue
            
            # Skip non-sung lines
            if line.strip().startswith('[') or line.strip().startswith('('):
                continue
            
            current_lines.append(line)
        
        # Add final section
        if current_section and current_lines:
            schemes[current_section] = self._get_rhyme_scheme(current_lines)
            
        return schemes
    
    def _get_rhyme_scheme(self, lines: List[str]) -> List[str]:
        """Helper function to determine rhyme scheme."""
        # Simple implementation - just looks at last word
        last_words = []
        scheme = []
        letter = ord('A')
        rhyme_map = {}
        
        for line in lines:
            words = nltk.word_tokenize(line)
            if not words:
                continue
            last_word = words[-1].lower()
            
            # Check if this rhyme already exists
            found = False
            for key, value in rhyme_map.items():
                if self._words_rhyme(last_word, key):
                    scheme.append(value)
                    found = True
                    break
            
            if not found:
                rhyme_map[last_word] = chr(letter)
                scheme.append(chr(letter))
                letter += 1
                if letter > ord('Z'):
                    letter = ord('A')
        
        return scheme
    
    def _words_rhyme(self, word1: str, word2: str) -> bool:
        """Simple rhyme detection."""
        # This is a very basic implementation
        # Could be improved with phonetic comparison
        if word1 == word2:
            return True
        if word1[-2:] == word2[-2:]:
            return True
        return False
