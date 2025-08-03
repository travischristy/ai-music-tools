#!/usr/bin/env python3
"""
Complete Lyrical Cliché Analysis Pipeline
Executes the full analysis from raw data to enhanced banned words database
"""

import os
import sys
import pandas as pd
from datetime import datetime

def setup_environment():
    """Install required packages if not available"""
    required_packages = [
        'pandas', 'numpy', 'nltk', 'scikit-learn', 
        'matplotlib', 'seaborn', 'openpyxl'
    ]
    
    missing_packages = []
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print(f"Installing missing packages: {', '.join(missing_packages)}")
        import subprocess
        for package in missing_packages:
            subprocess.check_call([sys.executable, "-m", "pip", "install", package])

def load_lyrics_dataset():
    """Load the lyrics dataset from various possible file formats"""
    
    possible_files = [
        'ai_lyrics_datase.xlsx',
        'ai_lyrics_dataset.xlsx', 
        'lyrics_dataset.xlsx',
        'ai_lyrics_datase.csv',
        'ai_lyrics_dataset.csv',
        'lyrics_dataset.csv'
    ]
    
    for filename in possible_files:
        if os.path.exists(filename):
            print(f"Found dataset: {filename}")
            try:
                if filename.endswith('.xlsx'):
                    df = pd.read_excel(filename)
                else:
                    df = pd.read_csv(filename)
                
                print(f"Dataset loaded successfully: {len(df)} rows, {len(df.columns)} columns")
                print(f"Columns: {list(df.columns)}")
                return df, filename
            except Exception as e:
                print(f"Error loading {filename}: {e}")
                continue
    
    # If no file found, create sample data for demonstration
    print("No dataset file found. Creating sample data for demonstration...")
    print("Please replace this with your actual dataset loading.")
    
    sample_lyrics = [
        "In the darkness of the night, I find my light, broken dreams and shattered heart",
        "Love is all we need, in this crazy world, heart on fire with desire",  
        "Dancing in the moonlight, feeling so alive, never gonna give up the fight",
        "Time to shine, leave it all behind, broken dreams but hope remains",
        "In the silence of the night, stars are shining bright, love will find a way",
        "Heart on fire, burning with desire, in the dark of night",
        "Shattered dreams, broken heart, love will tear us apart",
        "In the moonlight, everything's alright, dancing through the night",
        "Time will tell, cast a spell, in this living hell",
        "Love forever, now or never, we're in this together",
        "Broken wings, the pain it brings, heart still sings",
        "In the rain, through the pain, nothing left to gain",
        "Fire inside, nowhere to hide, take it all in stride",
        "Dreams come true, me and you, love will see us through",
        "In the end, my only friend, on you I can depend"
    ] * 200  # Multiply to create more data points
    
    df = pd.DataFrame({'lyrics': sample_lyrics})
    return df, 'sample_data'

def detect_lyrics_column(df):
    """Automatically detect which column contains the lyrics"""
    
    possible_columns = ['lyrics', 'lyric', 'text', 'song_text', 'content', 'words']
    
    # First try exact matches
    for col in possible_columns:
        if col in df.columns:
            return col
    
    # Then try partial matches
    for col in df.columns:
        col_lower = col.lower()
        if any(keyword in col_lower for keyword in ['lyric', 'text', 'song', 'content']):
            return col
    
    # If no clear match, use the column with the most text-like content
    text_scores = {}
    for col in df.columns:
        if df[col].dtype == 'object':
            # Calculate average text length as a heuristic
            avg_length = df[col].dropna().astype(str).str.len().mean()
            text_scores[col] = avg_length
    
    if text_scores:
        lyrics_column = max(text_scores, key=text_scores.get)
        print(f"Auto-detected lyrics column: '{lyrics_column}'")
        return lyrics_column
    
    return None

def main():
    """Execute complete analysis pipeline"""
    
    print("COMPREHENSIVE LYRICAL CLICHÉ ANALYSIS")
    print("=" * 60)
    print(f"Analysis started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Setup environment
    print("Step 1: Setting up environment...")
    setup_environment()
    
    # Import after potential installation
    from lyrical_cliche_detector import LyricalCliqueDetector
    from banned_words_database_updater import BannedWordsDatabaseUpdater
    
    print("✓ Environment setup complete")
    print()
    
    # Load dataset
    print("Step 2: Loading lyrics dataset...")
    df, source_file = load_lyrics_dataset()
    
    if df is None:
        print("❌ Could not load dataset. Please ensure your data file is available.")
        return
    
    lyrics_column = detect_lyrics_column(df)
    if lyrics_column is None:
        print("❌ Could not detect lyrics column. Please check your dataset format.")
        return
    
    print(f"✓ Dataset loaded from: {source_file}")
    print(f"✓ Using column: '{lyrics_column}' for lyrics")
    print(f"✓ Total songs to analyze: {len(df)}")
    print()
    
    # Initialize cliché detector
    print("Step 3: Initializing cliché detection system...")
    detector = LyricalCliqueDetector()
    print("✓ Cliché detector initialized")
    print()
    
    # Process the dataset
    print("Step 4: Processing lyrics dataset...")
    print("This may take several minutes for large datasets...")
    
    stats = detector.process_lyrics_dataset(df, lyrics_column)
    
    print("✓ Dataset processing complete")
    print(f"  - Songs processed: {stats['total_songs']}")
    print(f"  - Unique tokens found: {stats['unique_tokens']}")
    print(f"  - Unique bigrams found: {stats['unique_bigrams']}")
    print(f"  - Unique trigrams found: {stats['unique_trigrams']}")
    print()
    
    # Identify clichés
    print("Step 5: Identifying clichéd phrases...")
    
    # Adjust parameters based on dataset size
    min_freq = max(3, stats['total_songs'] // 100)  # Dynamic minimum frequency
    top_n = min(200, stats['unique_bigrams'] // 10)  # Dynamic top N
    
    results = detector.identify_cliches(min_frequency=min_freq, top_n=top_n)
    
    print(f"✓ Cliché identification complete")
    print(f"  - High-frequency bigrams identified: {len(results['weighted_bigrams'])}")
    print(f"  - High-frequency trigrams identified: {len(results['weighted_trigrams'])}")
    print()
    
    # Generate comprehensive report
    print("Step 6: Generating analysis report...")
    report = detector.generate_cliche_report(results)
    print("✓ Analysis report generated: cliche_analysis_report.json")
    print()
    
    # Create visualizations
    print("Step 7: Creating visualizations...")
    try:
        detector.create_visualizations(results)
        print("✓ Visualizations created: cliche_analysis_visualizations.png")
    except Exception as e:
        print(f"⚠️  Visualization creation failed: {e}")
    print()
    
    # Update banned words database
    print("Step 8: Updating banned words database...")
    updater = BannedWordsDatabaseUpdater()
    
    # Try to load existing database
    existing_files = [
        'Banned Words and Phrases Database 07062025.csv',
        'banned_words_database.csv'
    ]
    
    for file in existing_files:
        if os.path.exists(file):
            try:
                updater.load_existing_database(file)
                print(f"✓ Loaded existing database: {file}")
                break
            except:
                continue
    
    # Generate new entries
    new_entries = updater.create_enhanced_database_entries(report)
    merged_df = updater.merge_with_existing_database(new_entries)
    
    # Save enhanced database
    csv_file, xlsx_file = updater.save_enhanced_database(merged_df)
    print(f"✓ Enhanced database saved: {csv_file} and {xlsx_file}")
    
    # Generate summary
    summary_report = updater.generate_summary_report(merged_df, len(new_entries))
    with open('database_update_report.txt', 'w') as f:
        f.write(summary_report)
    
    print("✓ Summary report saved: database_update_report.txt")
    print()
    
    # Final summary
    print("=" * 60)
    print("ANALYSIS COMPLETE - SUMMARY")
    print("=" * 60)
    
    print(f"📊 Dataset Analysis:")
    print(f"   • Songs processed: {stats['total_songs']:,}")
    print(f"   • Clichéd bigrams identified: {len(results['weighted_bigrams'])}")
    print(f"   • Clichéd trigrams identified: {len(results['weighted_trigrams'])}")
    
    print(f"\n📝 Files Generated:")
    print(f"   • cliche_analysis_report.json - Detailed analysis results")
    print(f"   • cliche_analysis_visualizations.png - Visual charts")
    print(f"   • {csv_file} - Enhanced banned words database (CSV)")
    print(f"   • {xlsx_file} - Enhanced banned words database (Excel)")
    print(f"   • database_update_report.txt - Update summary")
    
    # Show top clichés
    print(f"\n🚫 Top 10 Most Clichéd Phrases:")
    for i, item in enumerate(results['weighted_bigrams'][:10], 1):
        # Correctly unpack the tuple: (phrase, freq, weight, score)
        phrase, freq, _, score = item
        print(f"   {i:2d}. '{phrase}' (Score: {score:.1f}, Frequency: {freq})")
    
    print(f"\n✅ Analysis completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Usage recommendations
    print(f"\n💡 Next Steps:")
    print(f"   1. Review the generated banned words database")
    print(f"   2. Validate high-scoring clichés with human experts")
    print(f"   3. Integrate database into your AI lyric generation system")
    print(f"   4. Set up regular re-analysis with new data")
    print(f"   5. Consider implementing graduated restriction levels")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n❌ Analysis interrupted by user")
    except Exception as e:
        print(f"\n❌ Analysis failed with error: {e}")
        import traceback
        traceback.print_exc()
