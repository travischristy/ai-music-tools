# Lyric Analysis Agent

A specialized system for analyzing song lyrics, focusing on technical accuracy and formatting validation.

## Project Structure

```
Lyric-Analysis-Agent-Workspace/
├── Analysis-System/
│   ├── Library/
│   │   ├── lyric_analyzer.py    # Core analysis logic
│   │   └── requirements.txt     # Python dependencies
│   └── Scripts/
│       └── analyze_lyrics.py    # Main analysis script
├── Input/
│   └── Lyrics/                  # Place lyrics files here
├── Output/
│   ├── Analysis-Report/         # Analysis reports
│   └── Revised-Lyrics/          # Corrected lyrics
└── Reference/                   # Documentation and guidelines
```

## Setup

1. **Environment Setup**:
   ```bash
   # Create conda environment
   conda create -n lyric-analysis python=3.10
   conda activate lyric-analysis
   
   # Install dependencies
   cd Analysis-System/Library
   pip install -r requirements.txt
   ```

2. **NLTK Data**:
   ```python
   # Download required NLTK data
   python -c "import nltk; nltk.download('punkt'); nltk.download('cmudict'); nltk.download('punkt_tab')"
   ```

## Usage

1. **Input**:
   - Place your lyrics file in `Input/Lyrics/`
   - Use markdown format with .md extension
   - Follow the metatag formatting rules:
     - Use [ ] for section headers and non-sung text
     - Use ( ) for backup vocals and responses

2. **Running Analysis**:
   ```bash
   cd Analysis-System/Scripts
   python analyze_lyrics.py <input_file> <output_file>
   ```

3. **Output**:
   - Analysis reports are saved in `Output/Analysis-Report/`
   - Reports include:
     - Metatag validation
     - Syllable patterns
     - Rhyme schemes

## Metatag Rules

1. **Square Brackets [ ]**:
   - Section headers (must be on own line)
   - Performance instructions
   - Musical notes
   - Production notes
   ```markdown
   [Verse 1]
   [Soft, intimate]
   [Guitar Solo]
   ```

2. **Parentheses ( )**:
   - Backup vocals
   - Call and response
   - Ad libs
   - Echo effects
   ```markdown
   Main: Can you feel it?
   (Feel it, feel it)
   ```

## Analysis Features

1. **Metatag Validation**:
   - Checks correct usage of brackets and parentheses
   - Validates section header formatting
   - Identifies common formatting errors

2. **Syllable Analysis**:
   - Counts syllables per line
   - Documents patterns for each section
   - Flags inconsistencies

3. **Rhyme Analysis**:
   - Identifies rhyme schemes
   - Maps patterns within sections
   - Notes deviations

## Common Issues

1. **Metatag Errors**:
   ```markdown
   ❌ [Verse 1: Lead Vocal]    # Don't combine section with description
   ✅ [Verse 1]
      [Lead Vocal]

   ❌ [Echo: feel it]          # Don't use brackets for backup vocals
   ✅ (Feel it)
   ```

2. **Section Headers**:
   - Must be on their own line
   - Use numbers not words
   - No leading zeros
   - Space between section and number

## Support

For issues or questions:
1. Check the Reference folder for guidelines
2. Review example lyrics in Input/Lyrics
3. Examine analysis reports for specific error messages
