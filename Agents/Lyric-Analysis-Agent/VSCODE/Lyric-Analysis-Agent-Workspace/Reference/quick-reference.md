# Lyric Agent Quick Reference

## Analysis Phases

1. **Restricted Words & Clichés**
   - Common clichés detection
   - Overused adjectives
   - Weak verbs
   - Filler words

2. **Syllable Analysis**
   - Count per line
   - Pattern consistency
   - Section patterns

3. **Rhyme Scheme**
   - AABB detection
   - ABAB detection
   - Unusual patterns

4. **PRA Pattern Detection**
   - Pattern identification
   - Repetition tracking
   - Arc elements (build-up, climax, resolution)

5. **Metatag Validation**
   - Section headers
   - Performance notes
   - Backup vocals

## Metatag Rules

```markdown
[Section]        # Section headers
[Description]    # Performance notes
(Echo)           # Backup vocals
```

## Common Commands

```bash
# Activate Environment
conda activate lyric-analysis

# Run Analysis
python analyze_lyrics.py "input.md" "output.md"

# Update NLTK Data
python -c "import nltk; nltk.download('punkt')"
```

## Cline Commands

```
/analyze   - Full analysis
/validate  - Check formatting
/fix       - Get corrections
```

## File Structure

```
Input/Lyrics/          # Put lyrics here
Output/
  Analysis-Report/     # Analysis results
  Revised-Lyrics/      # Fixed lyrics
```

## Common Fixes

1. **Section Headers**:
   ```markdown
   [Verse 1: Soft]
   ✅ [Verse 1]
      [Soft]
   ```

2. **Backup Vocals**:
   ```markdown
   [Echo: ooh]
   ✅ (Ooh)
   ```

3. **Instructions**:
   ```markdown
   (Guitar Solo)
   ✅ [Guitar Solo]
   ```

## Analysis Features

1. Metatag Validation
2. Syllable Patterns
3. Rhyme Schemes

## Troubleshooting

1. **Missing Output Directory**:
   ```bash
   mkdir -p Output/Analysis-Report
   ```

2. **NLTK Errors**:
   ```python
   nltk.download('all')
   ```

3. **Environment Issues**:
   ```bash
   conda env remove -n lyric-analysis
   conda create -n lyric-analysis python=3.10
   ```
