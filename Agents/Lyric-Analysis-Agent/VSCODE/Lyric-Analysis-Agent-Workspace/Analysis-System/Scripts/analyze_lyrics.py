"""
Main script for analyzing lyrics.
"""

import os
import sys
import json
from pathlib import Path

# Add library to path
sys.path.append(str(Path(__file__).parent.parent / 'Library'))
from lyric_analyzer import LyricAnalyzer

def format_cliche_results(results: dict) -> str:
    """Format Phase 1 results."""
    output = ["## Phase 1: Restricted Words and Cliché Detection\n"]
    
    if results['cliches']:
        output.append("### Clichés Found:")
        for item in results['cliches']:
            output.append(f"Line {item['line']}: {item['cliche']}")
            output.append(f"```\n{item['text']}\n```\n")
    
    if results['restricted_words']:
        output.append("### Restricted Words Found:")
        for item in results['restricted_words']:
            output.append(f"Line {item['line']}: {item['word']} ({item['category']})")
            output.append(f"```\n{item['text']}\n```\n")
    
    if not results['cliches'] and not results['restricted_words']:
        output.append("✅ No clichés or restricted words found.\n")
    
    return "\n".join(output)

def format_syllable_analysis(results: dict) -> str:
    """Format Phase 2 results."""
    output = ["## Phase 2: Syllable Analysis\n"]
    
    for section, counts in results['patterns'].items():
        if section.lower() in ['intro', 'outro'] or 'instrumental' in section.lower():
            continue
        output.append(f"### {section}:")
        output.append("```")
        for i, count in enumerate(counts, 1):
            output.append(f"Line {i}: {count} syllables")
        output.append(f"Pattern: {','.join(map(str, counts))}")
        output.append("```\n")
    
    if results['inconsistencies']:
        output.append("### Inconsistencies Found:")
        for issue in results['inconsistencies']:
            output.append(f"- {issue['section']}: {issue['message']}")
            output.append(f"  Pattern: {','.join(map(str, issue['pattern']))}\n")
    
    return "\n".join(output)

def format_rhyme_analysis(results: dict) -> str:
    """Format Phase 3 results."""
    output = ["## Phase 3: Rhyme Scheme Analysis\n"]
    
    for section, scheme in results['schemes'].items():
        if section.lower() in ['intro', 'outro'] or 'instrumental' in section.lower():
            continue
        output.append(f"### {section}:")
        output.append(f"Scheme: {''.join(scheme)}\n")
    
    if results['inconsistencies']:
        output.append("### Unusual Patterns Found:")
        for issue in results['inconsistencies']:
            output.append(f"- {issue['section']}: {issue['message']}")
            output.append(f"  Scheme: {''.join(issue['scheme'])}\n")
    
    return "\n".join(output)

def format_pattern_analysis(results: dict) -> str:
    """Format Phase 4 results."""
    output = ["## Phase 4: PRA Pattern Detection\n"]
    
    if results['patterns']:
        output.append("### Patterns Found:")
        for pattern in results['patterns']:
            output.append(f"- {pattern['type']} (Lines {pattern['base_line']}-{pattern['extended_line']})")
            output.append("```")
            for line in pattern['text']:
                output.append(line)
            output.append("```\n")
    
    if results['repetitions']:
        output.append("### Repetitions Found:")
        for rep in results['repetitions']:
            output.append(f"- Line {rep['repeat_line']} repeats line {rep['first_occurrence']}")
            output.append(f"```\n{rep['text']}\n```\n")
    
    if results['arc_elements']:
        output.append("### Song Arc:")
        for arc in results['arc_elements']:
            output.append(f"Section Flow: {' → '.join(arc['section_flow'])}")
            output.append(f"Build-up: {'✅' if arc['has_buildup'] else '❌'}")
            output.append(f"Climax: {'✅' if arc['has_climax'] else '❌'}")
            output.append(f"Resolution: {'✅' if arc['has_resolution'] else '❌'}\n")
    
    return "\n".join(output)

def format_metatag_errors(errors: list) -> str:
    """Format Phase 5 results."""
    output = ["## Phase 5: Metatag Validation\n"]
    
    if not errors:
        output.append("✅ No metatag errors found.\n")
        return "\n".join(output)
    
    output.append("### Errors Found:")
    for error in errors:
        output.append(f"Line {error['line']}: {error['error']}")
        output.append(f"```\n{error['text']}\n```")
        output.append(f"Fix: {error['fix']}\n")
    
    return "\n".join(output)

def analyze_lyrics(input_file: str, output_file: str):
    """Analyze lyrics and write report."""
    # Read input file
    with open(input_file, 'r') as f:
        lyrics = f.read()
    
    # Initialize analyzer
    analyzer = LyricAnalyzer()
    
    # Run analysis loop
    results = analyzer.analyze_lyrics(lyrics)
    
    # Format report
    report = [
        "# Lyric Analysis Report\n",
        format_cliche_results(results['phase1']),
        format_syllable_analysis(results['phase2']),
        format_rhyme_analysis(results['phase3']),
        format_pattern_analysis(results['phase4']),
        format_metatag_errors(results['phase5']),
        "\n## Summary of Required Changes\n",
    ]
    
    # Add summary of changes needed
    changes = []
    if results['phase1']['cliches'] or results['phase1']['restricted_words']:
        changes.append("- Review and revise clichés and restricted words")
    if results['phase2']['inconsistencies']:
        changes.append("- Fix syllable pattern inconsistencies")
    if results['phase3']['inconsistencies']:
        changes.append("- Review unusual rhyme patterns")
    if not results['phase4']['arc_elements'][0]['has_climax']:
        changes.append("- Consider adding a clear climax section")
    if results['phase5']:
        changes.append("- Fix metatag formatting errors")
    
    report.extend(changes if changes else ["✅ No critical changes required."])
    
    # Write report
    with open(output_file, 'w') as f:
        f.write('\n\n'.join(report))

def main():
    if len(sys.argv) != 3:
        print("Usage: python analyze_lyrics.py <input_file> <output_file>")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    if not os.path.exists(input_file):
        print(f"Error: Input file {input_file} does not exist")
        sys.exit(1)
    
    analyze_lyrics(input_file, output_file)

if __name__ == '__main__':
    main()
