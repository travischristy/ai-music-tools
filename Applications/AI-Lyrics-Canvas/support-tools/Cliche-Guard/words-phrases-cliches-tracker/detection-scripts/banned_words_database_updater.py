#!/usr/bin/env python3
"""
Banned Words Database Enhancement Tool
Integrates cliché detection results with existing banned words database
"""

import pandas as pd
import json
import numpy as np
from collections import defaultdict
import nltk
from nltk.corpus import wordnet
import re

class BannedWordsDatabaseUpdater:
    def __init__(self, existing_db_path=None):
        self.existing_db = None
        if existing_db_path:
            self.load_existing_database(existing_db_path)
        
        # Initialize synonym and rhyme detection
        nltk.download('wordnet', quiet=True)
        
    def load_existing_database(self, db_path):
        """Load existing banned words database"""
        try:
            if db_path.endswith('.csv'):
                self.existing_db = pd.read_csv(db_path)
            elif db_path.endswith('.xlsx'):
                self.existing_db = pd.read_excel(db_path)
            print(f"Loaded existing database with {len(self.existing_db)} entries")
        except Exception as e:
            print(f"Warning: Could not load existing database: {e}")
            self.existing_db = None
    
    def load_cliche_analysis(self, analysis_file='cliche_analysis_report.json'):
        """Load results from cliché analysis"""
        with open(analysis_file, 'r') as f:
            return json.load(f)
    
    def generate_variants(self, phrase):
        """Generate common variants of a phrase"""
        variants = set([phrase])
        words = phrase.split()
        
        # Add variants with articles
        if len(words) >= 2:
            if words[0] not in ['the', 'a', 'an']:
                variants.add(f"the {phrase}")
                variants.add(f"a {phrase}")
        
        # Add possessive variants
        if len(words) >= 2:
            variants.add(f"{words[0]}'s {' '.join(words[1:])}")
        
        # Add plural variants for nouns
        if len(words) == 2:
            # Simple pluralization (this could be enhanced with a proper stemmer)
            last_word = words[-1]
            if last_word.endswith('y'):
                plural = last_word[:-1] + 'ies'
            elif last_word.endswith(('s', 'sh', 'ch', 'x', 'z')):
                plural = last_word + 'es'
            else:
                plural = last_word + 's'
            variants.add(f"{words[0]} {plural}")
        
        return list(variants)
    
    def find_synonyms(self, word):
        """Find synonyms using WordNet"""
        synonyms = set()
        for syn in wordnet.synsets(word):
            for lemma in syn.lemmas():
                synonyms.add(lemma.name().replace('_', ' '))
        
        # Remove the original word and return as list
        synonyms.discard(word)
        return list(synonyms)[:5]  # Limit to top 5 synonyms
    
    def find_rhyming_words(self, word):
        """Find basic rhyming words (simplified approach)"""
        # This is a simplified rhyme finder - in production you'd use a proper rhyming dictionary
        rhyme_patterns = {
            'night': ['light', 'bright', 'sight', 'fight', 'right'],
            'love': ['above', 'dove', 'shove'],
            'heart': ['part', 'start', 'art', 'smart'],
            'dream': ['stream', 'beam', 'team', 'seem'],
            'fire': ['desire', 'higher', 'wire', 'tire'],
            'way': ['day', 'say', 'play', 'stay'],
            'time': ['rhyme', 'climb', 'prime', 'sublime'],
            'pain': ['rain', 'gain', 'chain', 'stain']
        }
        
        return rhyme_patterns.get(word.lower(), [])
    
    def assess_severity(self, phrase, frequency, weighted_score):
        """Assess severity level of cliché"""
        if weighted_score > 100 or frequency > 50:
            return "CRITICAL"
        elif weighted_score > 50 or frequency > 25:
            return "HIGH"
        elif weighted_score > 20 or frequency > 10:
            return "MEDIUM"
        else:
            return "LOW"
    
    def generate_context_explanation(self, phrase, frequency):
        """Generate explanation for why phrase should be avoided"""
        templates = [
            f"Extremely overused phrase appearing {frequency} times in dataset. Creates predictable, generic lyrics.",
            f"Clichéd expression ({frequency} occurrences) that reduces lyrical originality and emotional impact.",
            f"Formulaic phrase used {frequency} times. Suggests lack of creative vocabulary and fresh expression.",
            f"Repetitive lyrical element ({frequency} uses) that makes songs sound AI-generated or template-based."
        ]
        
        # Choose template based on frequency
        if frequency > 50:
            return templates[0]
        elif frequency > 25:
            return templates[1]
        elif frequency > 10:
            return templates[2]
        else:
            return templates[3]
    
    def extract_often_combined_words(self, phrase, cliche_data):
        """Find words commonly combined with this phrase"""
        combined_words = set()
        phrase_words = set(phrase.split())
        
        # Look through bigrams and trigrams for combinations
        for item in cliche_data['top_cliche_bigrams'] + cliche_data['top_cliche_trigrams']:
            item_phrase = item['phrase']
            item_words = set(item_phrase.split())
            
            # If there's overlap, add the non-overlapping words
            if phrase_words.intersection(item_words):
                combined_words.update(item_words - phrase_words)
        
        return list(combined_words)[:5]  # Limit to top 5
    
    def create_enhanced_database_entries(self, cliche_analysis):
        """Create new database entries from cliché analysis"""
        new_entries = []
        entry_id = 1000  # Start from high number to avoid conflicts
        
        # Process bigrams
        for item in cliche_analysis['top_cliche_bigrams']:
            phrase = item['phrase']
            frequency = item['raw_frequency']
            weighted_score = item['weighted_score']
            
            # Skip if already in existing database
            if self.existing_db is not None:
                if phrase in self.existing_db['root_word_phrase'].values:
                    continue
            
            # Generate entry data
            variants = self.generate_variants(phrase)
            often_combined = self.extract_often_combined_words(phrase, cliche_analysis)
            severity = self.assess_severity(phrase, frequency, weighted_score)
            context = self.generate_context_explanation(phrase, frequency)
            
            # Find synonyms for key words in phrase
            words = phrase.split()
            all_synonyms = []
            rhyming_synonyms = []
            
            for word in words:
                synonyms = self.find_synonyms(word)
                rhymes = self.find_rhyming_words(word)
                all_synonyms.extend(synonyms)
                rhyming_synonyms.extend(rhymes)
            
            entry = {
                'id': entry_id,
                'root_word_phrase': phrase,
                'variants': ' | '.join(variants),
                'often_combined_with': ' | '.join(often_combined),
                'severity': severity,
                'context_why_avoid': context,
                'synonyms': ' | '.join(all_synonyms[:8]),  # Limit synonyms
                'synonyms_that_rhyme': ' | '.join(rhyming_synonyms[:5]),
                'synonyms_same_syllables': '',  # Would need syllable counting library
                'frequency_score': frequency,
                'weighted_score': round(weighted_score, 2),
                'phrase_type': 'bigram',
                'analysis_source': 'automated_detection'
            }
            
            new_entries.append(entry)
            entry_id += 1
        
        # Process trigrams (similar process)
        for item in cliche_analysis['top_cliche_trigrams']:
            phrase = item['phrase']
            frequency = item['raw_frequency']
            weighted_score = item['weighted_score']
            
            # Skip if already exists or too similar to existing
            if self.existing_db is not None:
                if phrase in self.existing_db['root_word_phrase'].values:
                    continue
            
            # Generate entry data (similar to bigrams)
            variants = self.generate_variants(phrase)
            often_combined = self.extract_often_combined_words(phrase, cliche_analysis)
            severity = self.assess_severity(phrase, frequency, weighted_score)
            context = self.generate_context_explanation(phrase, frequency)
            
            entry = {
                'id': entry_id,
                'root_word_phrase': phrase,
                'variants': ' | '.join(variants),
                'often_combined_with': ' | '.join(often_combined),
                'severity': severity,
                'context_why_avoid': context,
                'synonyms': '',  # Could be enhanced
                'synonyms_that_rhyme': '',
                'synonyms_same_syllables': '',
                'frequency_score': frequency,
                'weighted_score': round(weighted_score, 2),
                'phrase_type': 'trigram',
                'analysis_source': 'automated_detection'
            }
            
            new_entries.append(entry)
            entry_id += 1
        
        return new_entries
    
    def merge_with_existing_database(self, new_entries):
        """Merge new entries with existing database"""
        new_df = pd.DataFrame(new_entries)
        
        if self.existing_db is not None:
            # Add new columns to existing database if they don't exist
            for col in new_df.columns:
                if col not in self.existing_db.columns:
                    self.existing_db[col] = ''
            
            # Add missing columns to new dataframe
            for col in self.existing_db.columns:
                if col not in new_df.columns:
                    new_df[col] = ''
            
            # Merge databases
            merged_df = pd.concat([self.existing_db, new_df], ignore_index=True)
        else:
            merged_df = new_df
        
        return merged_df
    
    def generate_summary_report(self, merged_df, new_entries_count):
        """Generate summary report of database update"""
        
        severity_counts = merged_df['severity'].value_counts()
        phrase_type_counts = merged_df.get('phrase_type', pd.Series()).value_counts()
        
        report = f"""
BANNED WORDS DATABASE UPDATE SUMMARY
=====================================

Original database entries: {len(merged_df) - new_entries_count if self.existing_db is not None else 0}
New entries added: {new_entries_count}
Total entries after update: {len(merged_df)}

SEVERITY BREAKDOWN:
{severity_counts.to_string()}

PHRASE TYPE BREAKDOWN:
{phrase_type_counts.to_string() if not phrase_type_counts.empty else 'N/A'}

TOP 10 HIGHEST WEIGHTED SCORES:
"""
        
        # Add top entries by weighted score
        if 'weighted_score' in merged_df.columns:
            top_weighted = merged_df.nlargest(10, 'weighted_score')[['root_word_phrase', 'weighted_score', 'severity']]
            for idx, row in top_weighted.iterrows():
                report += f"  '{row['root_word_phrase']}' - Score: {row['weighted_score']}, Severity: {row['severity']}\n"
        
        report += f"""
FILES GENERATED:
- enhanced_banned_words_database.csv
- enhanced_banned_words_database.xlsx
- database_update_report.txt
"""
        
        return report
    
    def save_enhanced_database(self, merged_df, base_filename='enhanced_banned_words_database'):
        """Save the enhanced database in multiple formats"""
        
        # Sort by weighted score (if available) then by severity
        if 'weighted_score' in merged_df.columns:
            merged_df = merged_df.sort_values(['weighted_score', 'severity'], 
                                            ascending=[False, False])
        
        # Save as CSV
        csv_filename = f"{base_filename}.csv"
        merged_df.to_csv(csv_filename, index=False)
        
        # Save as Excel with formatting
        xlsx_filename = f"{base_filename}.xlsx"
        with pd.ExcelWriter(xlsx_filename, engine='openpyxl') as writer:
            merged_df.to_excel(writer, sheet_name='Banned Words Database', index=False)
            
            # Get the workbook and worksheet
            workbook = writer.book
            worksheet = writer.sheets['Banned Words Database']
            
            # Auto-adjust column widths
            for column in worksheet.columns:
                max_length = 0
                column_letter = column[0].column_letter
                for cell in column:
                    try:
                        if len(str(cell.value)) > max_length:
                            max_length = len(str(cell.value))
                    except:
                        pass
                adjusted_width = min(max_length + 2, 50)
                worksheet.column_dimensions[column_letter].width = adjusted_width
        
        return csv_filename, xlsx_filename
    
    def create_alternative_suggestions(self, phrase):
        """Generate creative alternatives to clichéd phrases"""
        
        # Common cliché replacements
        alternatives_map = {
            'broken heart': ['fractured spirit', 'wounded soul', 'aching chest', 'torn emotions'],
            'shattered dreams': ['abandoned hopes', 'forgotten aspirations', 'dissolved visions', 'scattered ambitions'],
            'endless night': ['infinite darkness', 'perpetual shadow', 'boundless evening', 'eternal twilight'],
            'burning desire': ['intense longing', 'fervent wish', 'passionate yearning', 'deep craving'],
            'lost love': ['vanished affection', 'departed romance', 'absent devotion', 'missing connection'],
            'broken dreams': ['crushed hopes', 'failed aspirations', 'ruined plans', 'collapsed visions'],
            'heart fire': ['chest burning', 'soul blazing', 'inner flame', 'spirit ignited'],
            'love forever': ['eternal devotion', 'endless affection', 'timeless bond', 'perpetual care']
        }
        
        return alternatives_map.get(phrase, [])

def main():
    """Main execution function for database enhancement"""
    
    print("BANNED WORDS DATABASE ENHANCEMENT TOOL")
    print("=" * 50)
    
    # Initialize the updater
    updater = BannedWordsDatabaseUpdater()
    
    # Try to load existing database
    existing_db_files = [
        'Banned Words and Phrases Database 07062025.csv',
        'banned_words_database.csv',
        'banned_words.csv'
    ]
    
    for db_file in existing_db_files:
        try:
            updater.load_existing_database(db_file)
            print(f"Loaded existing database: {db_file}")
            break
        except:
            continue
    
    # Load cliché analysis results
    try:
        cliche_analysis = updater.load_cliche_analysis('cliche_analysis_report.json')
        print("Loaded cliché analysis results")
    except FileNotFoundError:
        print("Error: cliche_analysis_report.json not found.")
        print("Please run the lyrical cliché detector first.")
        return
    
    # Create new database entries
    print("Generating new database entries from cliché analysis...")
    new_entries = updater.create_enhanced_database_entries(cliche_analysis)
    print(f"Generated {len(new_entries)} new entries")
    
    # Merge with existing database
    print("Merging with existing database...")
    merged_df = updater.merge_with_existing_database(new_entries)
    
    # Save enhanced database
    print("Saving enhanced database...")
    csv_file, xlsx_file = updater.save_enhanced_database(merged_df)
    
    # Generate and save summary report
    summary_report = updater.generate_summary_report(merged_df, len(new_entries))
    
    with open('database_update_report.txt', 'w') as f:
        f.write(summary_report)
    
    # Print summary to console
    print(summary_report)
    
    print(f"\nDatabase enhancement complete!")
    print(f"Enhanced database saved as: {csv_file} and {xlsx_file}")
    print(f"Summary report saved as: database_update_report.txt")
    
    # Additional analysis and recommendations
    print("\n" + "=" * 50)
    print("RECOMMENDATIONS FOR FURTHER ENHANCEMENT")
    print("=" * 50)
    
    print("""
1. SEMANTIC ANALYSIS ENHANCEMENT:
   - Implement Word2Vec or BERT embeddings for better semantic clustering
   - Add sentiment analysis to categorize emotional clichés
   - Create thematic categories (love, loss, hope, etc.)

2. CONTEXTUAL REFINEMENT:
   - Add song structure position weighting (verse/chorus/bridge)
   - Implement rhyme scheme dependency analysis
   - Add genre-specific cliché scoring

3. VALIDATION PROCESS:
   - Set up human expert review process for high-frequency phrases
   - Create A/B testing framework for alternative suggestions
   - Implement user feedback collection system

4. REAL-TIME APPLICATION:
   - Build API for real-time lyric filtering
   - Create graduated warning system (avoid/discourage/flag)
   - Implement context-aware alternative suggestion engine

5. DATABASE MAINTENANCE:
   - Schedule regular re-analysis of new lyrical data
   - Track temporal trends in cliché usage
   - Monitor effectiveness of alternative suggestions
""")

if __name__ == "__main__":
    main()