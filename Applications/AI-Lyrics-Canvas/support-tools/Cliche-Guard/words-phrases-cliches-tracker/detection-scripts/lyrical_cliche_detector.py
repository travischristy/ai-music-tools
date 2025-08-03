#!/usr/bin/env python3
"""
Comprehensive Lyrical Cliché Detection System
Identifies overused words, phrases, and patterns in song lyrics
"""

import pandas as pd
import numpy as np
import nltk
from nltk.tokenize import word_tokenize, sent_tokenize, TweetTokenizer
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tag import pos_tag
from collections import Counter, defaultdict
import re
from itertools import combinations
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity
import matplotlib.pyplot as plt
import seaborn as sns

def download_nltk_data():
    """Download necessary NLTK data if not already present."""
    required_data = {
        'tokenizers/punkt': 'punkt',
        'corpora/stopwords': 'stopwords',
        'corpora/wordnet': 'wordnet',
        'taggers/averaged_perceptron_tagger': 'averaged_perceptron_tagger'
    }
    for path, name in required_data.items():
        try:
            nltk.data.find(path)
        except LookupError:
            print(f"Downloading NLTK data: {name}...")
            nltk.download(name, quiet=True)

download_nltk_data()

class LyricalCliqueDetector:
    def __init__(self):
        self.tokenizer = TweetTokenizer()
        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = set(stopwords.words('english'))
        # Add lyric-specific stop words
        self.stop_words.update(['oh', 'yeah', 'la', 'na', 'da', 'hey', 'whoa'])
        
        # Results storage
        self.processed_lyrics = []
        self.cliche_database = {}
        self.pattern_analysis = {}
        
    def preprocess_text(self, text):
        """Clean and preprocess lyrical text"""
        if pd.isna(text):
            return ""
        
        # Convert to lowercase and remove extra whitespace
        text = re.sub(r'\s+', ' ', str(text).lower().strip())

        # Normalize common unicode artifacts
        text = text.replace('äôs', "'s").replace('äô', "'")
        
        # Remove common lyrical artifacts
        text = re.sub(r'\[.*?\]', '', text)  # Remove [Verse], [Chorus] tags
        text = re.sub(r'\(.*?\)', '', text)  # Remove parenthetical notes
        text = re.sub(r'[^\w\s\'-]', ' ', text)  # Keep only words, spaces, apostrophes, hyphens
        
        return text
    
    def tokenize_and_lemmatize(self, text):
        """Tokenize text and apply lemmatization"""
        tokens = self.tokenizer.tokenize(text)
        
        # Remove stop words and short tokens
        filtered_tokens = [token for token in tokens 
                          if token not in self.stop_words and len(token) > 1]
        
        # Lemmatize
        lemmatized = [self.lemmatizer.lemmatize(token) for token in filtered_tokens]
        
        return lemmatized
    
    def extract_ngrams(self, tokens, n=2):
        """Extract n-grams from tokenized text"""
        if len(tokens) < n:
            return []
        return [' '.join(tokens[i:i+n]) for i in range(len(tokens) - n + 1)]
    
    def extract_skip_grams(self, tokens, n=2, k=1):
        """Extract skip-grams (n-grams with gaps)"""
        skip_grams = []
        for i in range(len(tokens) - n - k + 1):
            for j in range(k + 1):
                if i + n + j <= len(tokens):
                    gram = tokens[i:i+1] + ['*'] * j + tokens[i+1+j:i+n+j]
                    skip_grams.append(' '.join(gram))
        return skip_grams
    
    def analyze_pos_patterns(self, text):
        """Analyze part-of-speech patterns in lyrics"""
        tokens = self.tokenizer.tokenize(text)
        pos_tags = pos_tag(tokens)
        
        # Extract common POS patterns
        pos_sequence = [tag for word, tag in pos_tags if word.lower() not in self.stop_words]
        
        # Generate POS n-grams
        pos_bigrams = [f"{pos_sequence[i]}_{pos_sequence[i+1]}" 
                      for i in range(len(pos_sequence) - 1)]
        pos_trigrams = [f"{pos_sequence[i]}_{pos_sequence[i+1]}_{pos_sequence[i+2]}" 
                       for i in range(len(pos_sequence) - 2)]
        
        return pos_bigrams, pos_trigrams
    
    def calculate_contextual_weight(self, phrase, position_info=None):
        """Calculate contextual importance weight for phrases"""
        base_weight = 1.0
        
        # Emotional intensity keywords get higher weight
        emotional_intensifiers = ['heart', 'soul', 'dream', 'love', 'pain', 'tear', 'blood']
        if any(word in phrase.lower() for word in emotional_intensifiers):
            base_weight *= 1.5
        
        # Rhyme-scheme dependent phrases get lower weight (they might be necessary)
        common_rhymes = ['night/light', 'love/above', 'away/day', 'fire/desire']
        for rhyme_pair in common_rhymes:
            if any(word in phrase.lower() for word in rhyme_pair.split('/')):
                base_weight *= 0.8
        
        # TODO: Add position-based weighting when song structure data is available
        # if position_info:
        #     if position_info.get('section') == 'chorus':
        #         base_weight *= 2.0
        #     elif position_info.get('section') == 'opening':
        #         base_weight *= 1.8
        
        return base_weight
    
    def semantic_clustering(self, phrases, n_clusters=50):
        """Group semantically similar phrases using TF-IDF and clustering"""
        if len(phrases) < n_clusters:
            n_clusters = max(2, len(phrases) // 5)
        
        # Create TF-IDF vectors
        vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
        tfidf_matrix = vectorizer.fit_transform(phrases)
        
        # Perform clustering
        # The 'auto' option for n_init is recommended for scikit-learn >= 1.4
        # For older versions, n_init=10 is a safe default.
        kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init='auto')
        clusters = kmeans.fit_predict(tfidf_matrix)
        
        # Group phrases by cluster
        clustered_phrases = defaultdict(list)
        for phrase, cluster in zip(phrases, clusters):
            clustered_phrases[int(cluster)].append(phrase)
        
        return dict(clustered_phrases)
    
    def process_lyrics_dataset(self, df, lyrics_column='lyrics'):
        """Process entire lyrics dataset"""
        print("Processing lyrics dataset...")
        
        # Storage for analysis
        all_tokens = []
        all_bigrams = []
        all_trigrams = []
        all_skip_grams = []
        pos_bigrams_all = []
        pos_trigrams_all = []
        
        processed_count = 0
        
        for idx, row in df.iterrows():
            if pd.isna(row[lyrics_column]):
                continue
                
            # Preprocess
            clean_text = self.preprocess_text(row[lyrics_column])
            if not clean_text:
                continue
            
            # Tokenize and lemmatize
            tokens = self.tokenize_and_lemmatize(clean_text)
            all_tokens.extend(tokens)
            
            # Extract n-grams
            bigrams = self.extract_ngrams(tokens, 2)
            trigrams = self.extract_ngrams(tokens, 3)
            skip_grams = self.extract_skip_grams(tokens, 2, 1)
            
            all_bigrams.extend(bigrams)
            all_trigrams.extend(trigrams)
            all_skip_grams.extend(skip_grams)
            
            # POS analysis
            pos_bi, pos_tri = self.analyze_pos_patterns(clean_text)
            pos_bigrams_all.extend(pos_bi)
            pos_trigrams_all.extend(pos_tri)
            
            processed_count += 1
            if processed_count % 100 == 0:
                print(f"Processed {processed_count} songs...")
        
        print(f"Completed processing {processed_count} songs.")
        
        # Calculate frequencies
        self.token_freq = Counter(all_tokens)
        self.bigram_freq = Counter(all_bigrams)
        self.trigram_freq = Counter(all_trigrams)
        self.skip_gram_freq = Counter(all_skip_grams)
        self.pos_bigram_freq = Counter(pos_bigrams_all)
        self.pos_trigram_freq = Counter(pos_trigrams_all)
        
        return {
            'total_songs': processed_count,
            'unique_tokens': len(self.token_freq),
            'unique_bigrams': len(self.bigram_freq),
            'unique_trigrams': len(self.trigram_freq)
        }
    
    def identify_cliches(self, min_frequency=10, top_n=100):
        """Identify clichéd phrases based on frequency and contextual analysis"""
        
        # Get most frequent phrases
        top_bigrams = self.bigram_freq.most_common(top_n)
        top_trigrams = self.trigram_freq.most_common(top_n)
        
        # Filter by minimum frequency
        frequent_bigrams = [(phrase, freq) for phrase, freq in top_bigrams 
                           if freq >= min_frequency]
        frequent_trigrams = [(phrase, freq) for phrase, freq in top_trigrams 
                            if freq >= min_frequency]
        
        # Apply contextual weighting
        weighted_bigrams = []
        for phrase, freq in frequent_bigrams:
            weight = self.calculate_contextual_weight(phrase)
            weighted_score = freq * weight
            weighted_bigrams.append((phrase, freq, weight, weighted_score))
        
        weighted_trigrams = []
        for phrase, freq in frequent_trigrams:
            weight = self.calculate_contextual_weight(phrase)
            weighted_score = freq * weight
            weighted_trigrams.append((phrase, freq, weight, weighted_score))
        
        # Sort by weighted score
        weighted_bigrams.sort(key=lambda x: x[3], reverse=True)
        weighted_trigrams.sort(key=lambda x: x[3], reverse=True)
        
        # Semantic clustering of top phrases
        if len(frequent_bigrams) > 20:
            bigram_phrases = [phrase for phrase, _ in frequent_bigrams[:50]]
            bigram_clusters = self.semantic_clustering(bigram_phrases)
        else:
            bigram_clusters = {}
        
        return {
            'weighted_bigrams': weighted_bigrams,
            'weighted_trigrams': weighted_trigrams,
            'semantic_clusters': bigram_clusters,
            'pos_patterns': {
                'bigrams': self.pos_bigram_freq.most_common(20),
                'trigrams': self.pos_trigram_freq.most_common(20)
            }
        }
    
    def generate_cliche_report(self, results, output_file='cliche_analysis_report.json'):
        """Generate comprehensive cliché analysis report"""
        
        report = {
            'analysis_summary': {
                'total_unique_bigrams': len(self.bigram_freq),
                'total_unique_trigrams': len(self.trigram_freq),
                'high_frequency_bigrams': len(results['weighted_bigrams']),
                'high_frequency_trigrams': len(results['weighted_trigrams'])
            },
            'top_cliche_bigrams': [
                {
                    'phrase': phrase,
                    'raw_frequency': freq,
                    'contextual_weight': weight,
                    'weighted_score': score,
                    'severity': 'HIGH' if score > 50 else 'MEDIUM' if score > 20 else 'LOW'
                }
                for phrase, freq, weight, score in results['weighted_bigrams']
            ],
            'top_cliche_trigrams': [
                {
                    'phrase': phrase,
                    'raw_frequency': freq,
                    'contextual_weight': weight,
                    'weighted_score': score,
                    'severity': 'HIGH' if score > 30 else 'MEDIUM' if score > 15 else 'LOW'
                }
                for phrase, freq, weight, score in results['weighted_trigrams']
            ],
            'structural_patterns': {
                'most_common_pos_bigrams': results['pos_patterns']['bigrams'],
                'most_common_pos_trigrams': results['pos_patterns']['trigrams']
            },
            'semantic_clusters': results['semantic_clusters']
        }
        
        # Save report
        with open(output_file, 'w') as f:
            json.dump(report, f, indent=2)
        
        return report
    
    def create_visualizations(self, results, output_file='cliche_analysis_visualizations.png'):
        """Create visualizations of the cliché analysis"""
        
        # Set up the plotting style
        plt.style.use('default')
        fig, axes = plt.subplots(2, 2, figsize=(15, 12))
        
        # 1. Top bigram frequencies
        top_bigrams = results['weighted_bigrams'][:15]
        phrases = [item[0] for item in top_bigrams]
        frequencies = [item[1] for item in top_bigrams]
        
        axes[0, 0].barh(range(len(phrases)), frequencies)
        axes[0, 0].set_yticks(range(len(phrases)))
        axes[0, 0].set_yticklabels(phrases)
        axes[0, 0].set_xlabel('Frequency')
        axes[0, 0].set_title('Most Overused Bigrams')
        axes[0, 0].invert_yaxis()
        
        # 2. Top trigram frequencies
        top_trigrams = results['weighted_trigrams'][:15]
        phrases_tri = [item[0] for item in top_trigrams]
        frequencies_tri = [item[1] for item in top_trigrams]
        
        axes[0, 1].barh(range(len(phrases_tri)), frequencies_tri)
        axes[0, 1].set_yticks(range(len(phrases_tri)))
        axes[0, 1].set_yticklabels(phrases_tri)
        axes[0, 1].set_xlabel('Frequency')
        axes[0, 1].set_title('Most Overused Trigrams')
        axes[0, 1].invert_yaxis()
        
        # 3. Weighted vs Raw frequency comparison
        raw_freqs = [item[1] for item in top_bigrams[:10]]
        weighted_scores = [item[3] for item in top_bigrams[:10]]
        
        x = np.arange(len(raw_freqs))
        width = 0.35
        
        axes[1, 0].bar(x - width/2, raw_freqs, width, label='Raw Frequency')
        axes[1, 0].bar(x + width/2, weighted_scores, width, label='Weighted Score')
        axes[1, 0].set_ylabel('Score')
        axes[1, 0].set_title('Raw vs Weighted Frequency Scores')
        axes[1, 0].set_xticks(x)
        axes[1, 0].set_xticklabels([item[0] for item in top_bigrams[:10]], rotation=45, ha='right')
        axes[1, 0].legend()
        
        # 4. POS pattern frequency
        pos_patterns = results['pos_patterns']['bigrams'][:10]
        pos_labels = [item[0] for item in pos_patterns]
        pos_freqs = [item[1] for item in pos_patterns]
        
        axes[1, 1].bar(range(len(pos_labels)), pos_freqs)
        axes[1, 1].set_xticks(range(len(pos_labels)))
        axes[1, 1].set_xticklabels(pos_labels, rotation=45)
        axes[1, 1].set_ylabel('Frequency')
        axes[1, 1].set_title('Most Common POS Patterns')
        
        plt.tight_layout()
        plt.savefig(output_file, dpi=300, bbox_inches='tight')
        plt.show()

def main():
    """Main execution function"""
    
    # Initialize detector
    detector = LyricalCliqueDetector()
    
    # Load your dataset
    print("Loading dataset...")
    # Replace with your actual file loading
    # df = pd.read_excel('ai_lyrics_datase.xlsx')  # or pd.read_csv for CSV files
    
    # For demonstration, create sample data structure
    print("Note: Replace the sample data loading with your actual dataset")
    print("Expected dataset format: DataFrame with 'lyrics' column containing song lyrics")
    
    # Sample dataset structure (replace this with your actual data loading)
    sample_data = {
        'lyrics': [
            "In the darkness of the night, I find my light, broken dreams and shattered heart",
            "Love is all we need, in this crazy world, heart on fire with desire",
            "Dancing in the moonlight, feeling so alive, never gonna give up the fight",
            "Time to shine, leave it all behind, broken dreams but hope remains",
            "In the silence of the night, stars are shining bright, love will find a way"
        ] * 100  # Repeat for demonstration
    }
    df = pd.DataFrame(sample_data)
    
    # Process the dataset
    stats = detector.process_lyrics_dataset(df, 'lyrics')
    print(f"Processing complete. Stats: {stats}")
        
    # Identify clichés
    print("Identifying clichéd phrases...")
    results = detector.identify_cliches(min_frequency=10, top_n=200)
        
    # Generate comprehensive report
    print("Generating analysis report...")
    report_file = 'cliche_analysis_report.json'
    report = detector.generate_cliche_report(results, output_file=report_file)
        
    # Create visualizations
    print("Creating visualizations...")
    viz_file = 'cliche_analysis_visualizations.png'
    detector.create_visualizations(results, output_file=viz_file)
    
    # Print summary
    print("\n" + "="*50)
    print("LYRICAL CLICHÉ ANALYSIS SUMMARY")
    print("="*50)
    
    print(f"Total unique bigrams analyzed: {len(detector.bigram_freq)}")
    print(f"Total unique trigrams analyzed: {len(detector.trigram_freq)}")
    
    print("\nTop 10 Most Clichéd Bigrams:")
    for i, (phrase, freq, weight, score) in enumerate(results['weighted_bigrams'][:10], 1):
        print(f"{i:2d}. '{phrase}' - Frequency: {freq}, Weighted Score: {score:.1f}")
    
    print("\nTop 10 Most Clichéd Trigrams:")
    for i, (phrase, freq, weight, score) in enumerate(results['weighted_trigrams'][:10], 1):
        print(f"{i:2d}. '{phrase}' - Frequency: {freq}, Weighted Score: {score:.1f}")
    
    print("\nTop Structural (POS) Patterns:")
    for i, (pattern, freq) in enumerate(results['pos_patterns']['bigrams'][:5], 1):
        print(f"{i}. {pattern} - {freq} occurrences")
    
    print(f"\nDetailed analysis saved to: {report_file}")
    print(f"Visualizations saved to: {viz_file}")

if __name__ == "__main__":
    main()
