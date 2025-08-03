# Lyric Agent Operation Guide

## Quick Start

1. **Open VS Code**
   - Open the `Lyric-Analysis-Agent-Workspace` folder
   - Ensure Cline extension is active
   - Select Ollama as the active AI backend

2. **Activate Environment**
   ```bash
   conda activate lyric-analysis
   ```

3. **Analyze Lyrics**
   - Place lyrics in `Input/Lyrics/`
   - Run analysis script from integrated terminal
   - View reports in `Output/Analysis-Report/`

## Using the Cline Extension

1. **Setup**:
   - Command Palette (`Cmd+Shift+P`)
   - Type "Cline: Select Model"
   - Choose Ollama endpoint

2. **Interaction**:
   - Use Command Palette or sidebar icon to open Cline
   - Paste lyrics into the chat
   - Ask for specific analysis or validation

3. **Commands**:
   ```
   /analyze [lyrics]     - Run full analysis
   /validate [lyrics]    - Check metatag formatting
   /fix [lyrics]        - Get formatting corrections
   ```

## Analysis Process

1. **Input Preparation**:
   ```markdown
   **Title:** [Song Title]
   **Style:** [Musical style description]
   
   [Verse 1]
   Your lyrics here...
   ```

2. **Running Analysis**:
   ```bash
   # From integrated terminal
   cd Analysis-System/Scripts
   python analyze_lyrics.py "../Input/Lyrics/your-file.md" "../Output/Analysis-Report/report.md"
   ```

3. **Viewing Results**:
   - Open generated report in VS Code
   - Check for:
     - Metatag errors
     - Syllable patterns
     - Rhyme schemes

## Common Tasks

1. **Fix Metatag Formatting**:
   ```markdown
   # Original
   [Verse 1: Soft]
   
   # Correct
   [Verse 1]
   [Soft]
   ```

2. **Add Backup Vocals**:
   ```markdown
   Main: Feel the rhythm
   (Feel it, feel it)
   ```

3. **Add Performance Notes**:
   ```markdown
   [Verse 1]
   [Whispered]
   First line...
   ```

## Troubleshooting

1. **Environment Issues**:
   ```bash
   # Recreate environment
   conda create -n lyric-analysis python=3.10
   conda activate lyric-analysis
   cd Analysis-System/Library
   pip install -r requirements.txt
   ```

2. **NLTK Errors**:
   ```python
   # Download missing data
   python -c "import nltk; nltk.download('all')"
   ```

3. **Path Issues**:
   - Use absolute paths
   - Create missing directories:
     ```bash
     mkdir -p Output/Analysis-Report
     ```

## Best Practices

1. **File Organization**:
   - One lyrics file per song
   - Use descriptive filenames
   - Keep backup copies

2. **Analysis Workflow**:
   1. Validate metatags first
   2. Check syllable patterns
   3. Review rhyme schemes
   4. Make corrections
   5. Re-run analysis

3. **Version Control**:
   - Save original in `Input/`
   - Save corrected in `Output/Revised-Lyrics/`
   - Include timestamp in filenames

## Reference Materials

- Check `Reference/` folder for:
  - Metatag rules
  - Example lyrics
  - Common patterns
  - Troubleshooting guides
