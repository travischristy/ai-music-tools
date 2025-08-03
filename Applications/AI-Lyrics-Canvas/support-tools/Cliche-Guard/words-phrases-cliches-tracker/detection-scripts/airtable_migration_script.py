#!/usr/bin/env python3
"""
Airtable Migration Script for Banned Words Database
Migrates data from CSV/Excel to the new Airtable structure
"""

import pandas as pd
import requests
import json
from datetime import datetime
import time
import os

class AirtableMigrator:
    def __init__(self, access_token, base_id):
        self.access_token = access_token
        self.base_id = base_id
        self.base_url = f"https://api.airtable.com/v0/{base_id}"
        self.headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        # Table IDs (update these with your actual table IDs)
        self.tables = {
            "banned_words": "tbl2glAuZiezipFUV",
            "alternatives": "tblEexwzCLrOSzW4g", 
            "clusters": "tblgvZxD5eZHaGgpN",
            "analysis": "tblUo48s2eP8CYcIF"
        }
    
    def create_airtable_record(self, table_name, fields):
        """Create a single record in Airtable"""
        url = f"{self.base_url}/{self.tables[table_name]}"
        
        data = {
            "fields": fields
        }
        
        response = requests.post(url, headers=self.headers, json=data)
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error creating record: {response.status_code} - {response.text}")
            return None
    
    def batch_create_records(self, table_name, records_list):
        """Create multiple records in batch (max 10 per batch)"""
        url = f"{self.base_url}/{self.tables[table_name]}"
        
        # Process in batches of 10 (Airtable limit)
        for i in range(0, len(records_list), 10):
            batch = records_list[i:i+10]
            
            data = {
                "records": [{"fields": record} for record in batch]
            }
            
            response = requests.post(url, headers=self.headers, json=data)
            
            if response.status_code == 200:
                created_records = response.json()["records"]
                print(f"Created batch {i//10 + 1}: {len(created_records)} records")
            else:
                print(f"Error in batch {i//10 + 1}: {response.status_code} - {response.text}")
            
            # Rate limiting - Airtable allows 5 requests per second
            time.sleep(0.2)
    
    def map_severity_level(self, severity_str):
        """Map old severity format to new Airtable select options"""
        if not severity_str or pd.isna(severity_str):
            return "MEDIUM"
        
        severity_map = {
            "critical": "CRITICAL",
            "high": "HIGH", 
            "medium": "MEDIUM",
            "low": "LOW"
        }
        
        return severity_map.get(str(severity_str).lower().strip(), "MEDIUM")
    
    def map_phrase_type(self, phrase):
        """Determine phrase type based on word count"""
        if not phrase or pd.isna(phrase):
            return "Unigram"
        
        word_count = len(str(phrase).split())
        
        if word_count == 1:
            return "Unigram"
        elif word_count == 2:
            return "Bigram"
        elif word_count == 3:
            return "Trigram"
        else:
            return "Bigram"  # Default for longer phrases
    
    def migrate_banned_words_csv(self, csv_file_path):
        """Migrate from existing banned words CSV format"""
        print(f"Loading data from {csv_file_path}...")
        
        try:
            df = pd.read_csv(csv_file_path)
        except Exception as e:
            print(f"Error loading CSV: {e}")
            return
        
        print(f"Found {len(df)} records to migrate")
        
        # Map CSV columns to Airtable fields
        migrated_records = []
        
        for idx, row in df.iterrows():
            # Extract data with fallbacks for missing columns
            root_phrase = row.get('root_word_phrase', row.get('phrase', str(row.iloc[0])))
            
            record = {
                "Root Word/Phrase": str(root_phrase) if not pd.isna(root_phrase) else f"Unknown_{idx}",
                "Severity Level": self.map_severity_level(row.get('severity')),
                "Phrase Type": self.map_phrase_type(root_phrase),
                "Date Identified": datetime.now().strftime("%Y-%m-%d"),
                "Status": "Active Ban"
            }
            
            # Optional fields with fallbacks
            if 'context_why_avoid' in row and not pd.isna(row['context_why_avoid']):
                record["Context Why Avoid"] = str(row['context_why_avoid'])
            
            if 'variants' in row and not pd.isna(row['variants']):
                record["Variants"] = str(row['variants'])
            
            if 'often_combined_with' in row and not pd.isna(row['often_combined_with']):
                record["Often Combined With"] = str(row['often_combined_with'])
            
            # Add frequency data if available
            if 'frequency_score' in row and not pd.isna(row['frequency_score']):
                try:
                    record["Frequency Score"] = int(float(row['frequency_score']))
                except:
                    pass
            
            if 'weighted_score' in row and not pd.isna(row['weighted_score']):
                try:
                    record["Weighted Score"] = float(row['weighted_score'])
                except:
                    pass
            
            migrated_records.append(record)
        
        # Upload to Airtable in batches
        if migrated_records:
            print(f"Uploading {len(migrated_records)} records to Airtable...")
            self.batch_create_records("banned_words", migrated_records)
            print("✓ Migration complete!")
        else:
            print("No valid records found to migrate")
    
    def migrate_from_cliche_analysis(self, analysis_json_path):
        """Migrate from cliché analysis JSON results"""
        print(f"Loading cliché analysis from {analysis_json_path}...")
        
        try:
            with open(analysis_json_path, 'r') as f:
                analysis_data = json.load(f)
        except Exception as e:
            print(f"Error loading analysis JSON: {e}")
            return
        
        # Create analysis session record first
        analysis_session = {
            "Analysis Date": datetime.now().strftime("%Y-%m-%d"),
            "Dataset Source": "cliche_analysis_report.json",
            "Analysis Method": "Automated NLP",
            "Analyst": "Automated System",
            "Notes": "Migrated from comprehensive cliché analysis with semantic clustering and contextual weighting."
        }
        
        if 'analysis_summary' in analysis_data:
            summary = analysis_data['analysis_summary']
            analysis_session["Total Songs Analyzed"] = summary.get('total_songs_processed', 0)
            analysis_session["New Clichés Found"] = summary.get('high_frequency_bigrams', 0) + summary.get('high_frequency_trigrams', 0)
        
        session_record = self.create_airtable_record("analysis", analysis_session)
        session_id = session_record['id'] if session_record else None
        
        # Migrate bigrams
        migrated_records = []
        if 'top_cliche_bigrams' in analysis_data:
            for item in analysis_data['top_cliche_bigrams']:
                record = {
                    "Root Word/Phrase": item['phrase'],
                    "Severity Level": item.get('severity', 'MEDIUM'),
                    "Frequency Score": item.get('raw_frequency', 0),
                    "Weighted Score": item.get('weighted_score', 0.0),
                    "Phrase Type": "Bigram",
                    "Date Identified": datetime.now().strftime("%Y-%m-%d"),
                    "Status": "Active Ban" if item.get('severity') in ['CRITICAL', 'HIGH'] else "Under Review",
                    "Context Why Avoid": f"Automated detection found this phrase {item.get('raw_frequency', 0)} times with weighted score {item.get('weighted_score', 0):.1f}. High frequency indicates formulaic AI generation."
                }
                
                if session_id:
                    record["Analysis Source"] = [session_id]
                
                migrated_records.append(record)
        
        # Migrate trigrams
        if 'top_cliche_trigrams' in analysis_data:
            for item in analysis_data['top_cliche_trigrams']:
                record = {
                    "Root Word/Phrase": item['phrase'],
                    "Severity Level": item.get('severity', 'MEDIUM'),
                    "Frequency Score": item.get('raw_frequency', 0),
                    "Weighted Score": item.get('weighted_score', 0.0),
                    "Phrase Type": "Trigram",
                    "Date Identified": datetime.now().strftime("%Y-%m-%d"),
                    "Status": "Active Ban" if item.get('severity') in ['CRITICAL', 'HIGH'] else "Under Review",
                    "Context Why Avoid": f"Automated detection found this phrase {item.get('raw_frequency', 0)} times with weighted score {item.get('weighted_score', 0):.1f}. High frequency indicates formulaic AI generation."
                }
                
                if session_id:
                    record["Analysis Source"] = [session_id]
                
                migrated_records.append(record)
        
        # Upload records
        if migrated_records:
            print(f"Uploading {len(migrated_records)} cliché records to Airtable...")
            self.batch_create_records("banned_words", migrated_records)
            print("✓ Cliché analysis migration complete!")
    
    def create_semantic_clusters_from_analysis(self, analysis_json_path):
        """Create semantic clusters based on analysis results"""
        print("Creating semantic clusters...")
        
        try:
            with open(analysis_json_path, 'r') as f:
                analysis_data = json.load(f)
        except Exception as e:
            print(f"Error loading analysis JSON: {e}")
            return
        
        # Predefined cluster definitions based on common themes
        cluster_definitions = [
            {
                "Cluster Name": "Heartbreak & Emotional Pain",
                "Core Theme": "Heartbreak & Pain",
                "Priority Level": "Urgent - Address First",
                "Cluster Description": "Phrases describing emotional suffering, lost love, and romantic disappointment. These expressions are heavily overused in AI lyrics.",
                "keywords": ["broken", "heart", "shattered", "pain", "hurt", "tear", "cry"]
            },
            {
                "Cluster Name": "Dreams & Aspirations",
                "Core Theme": "Dreams & Aspirations", 
                "Priority Level": "High Priority",
                "Cluster Description": "Overused expressions about hopes, dreams, and future aspirations that create predictable lyrical content.",
                "keywords": ["dream", "hope", "wish", "future", "tomorrow", "aspiration"]
            },
            {
                "Cluster Name": "Light & Darkness Metaphors",
                "Core Theme": "Light & Darkness",
                "Priority Level": "High Priority", 
                "Cluster Description": "Clichéd metaphors contrasting light and darkness to represent hope/despair or good/evil.",
                "keywords": ["light", "dark", "shadow", "bright", "night", "day", "sun", "moon"]
            },
            {
                "Cluster Name": "Fire & Passion",
                "Core Theme": "Fire & Passion",
                "Priority Level": "Medium Priority",
                "Cluster Description": "Overused fire metaphors for passion, desire, and intense emotions.",
                "keywords": ["fire", "burn", "flame", "passion", "desire", "heat"]
            },
            {
                "Cluster Name": "Time & Memory",
                "Core Theme": "Time & Memory", 
                "Priority Level": "Medium Priority",
                "Cluster Description": "Formulaic expressions about time passing, memories, and nostalgia.",
                "keywords": ["time", "memory", "remember", "forget", "past", "forever", "always"]
            }
        ]
        
        cluster_records = []
        for cluster_def in cluster_definitions:
            # Calculate average score for phrases matching this cluster
            matching_phrases = []
            avg_score = 0
            
            if 'top_cliche_bigrams' in analysis_data:
                for item in analysis_data['top_cliche_bigrams']:
                    phrase = item['phrase'].lower()
                    if any(keyword in phrase for keyword in cluster_def['keywords']):
                        matching_phrases.append(item)
                        avg_score += item.get('weighted_score', 0)
            
            if 'top_cliche_trigrams' in analysis_data:
                for item in analysis_data['top_cliche_trigrams']:
                    phrase = item['phrase'].lower()
                    if any(keyword in phrase for keyword in cluster_def['keywords']):
                        matching_phrases.append(item)
                        avg_score += item.get('weighted_score', 0)
            
            if matching_phrases:
                avg_score = avg_score / len(matching_phrases)
                cluster_def['Cluster Score'] = round(avg_score, 2)
                cluster_records.append({k: v for k, v in cluster_def.items() if k != 'keywords'})
        
        # Create cluster records
        if cluster_records:
            print(f"Creating {len(cluster_records)} semantic clusters...")
            self.batch_create_records("clusters", cluster_records)
            print("✓ Semantic clusters created!")
    
    def generate_alternatives_for_common_cliches(self):
        """Generate alternative expressions for the most common clichés"""
        print("Creating alternative expressions...")
        
        # Common alternatives for frequent clichés
        alternatives_data = [
            {
                "phrase": "broken heart",
                "alternatives": [
                    {"expr": "fractured spirit", "type": "Conceptual Alternative", "tone": "Melancholy/Sad", "rating": 4, "context": "For deeper emotional pain beyond surface heartbreak"},
                    {"expr": "wounded soul", "type": "Conceptual Alternative", "tone": "Melancholy/Sad", "rating": 4, "context": "For spiritual/emotional injury"},
                    {"expr": "aching chest", "type": "Direct Synonym", "tone": "Melancholy/Sad", "rating": 3, "context": "More physical description of heartbreak"},
                    {"expr": "torn emotions", "type": "Direct Synonym", "tone": "Melancholy/Sad", "rating": 4, "context": "For conflicted feelings"}
                ]
            },
            {
                "phrase": "shattered dreams", 
                "alternatives": [
                    {"expr": "abandoned hopes", "type": "Direct Synonym", "tone": "Melancholy/Sad", "rating": 5, "context": "For deliberately given up aspirations"},
                    {"expr": "dissolved visions", "type": "Conceptual Alternative", "tone": "Melancholy/Sad", "rating": 4, "context": "For goals that faded gradually"},
                    {"expr": "collapsed ambitions", "type": "Direct Synonym", "tone": "Melancholy/Sad", "rating": 4, "context": "For failed career/life goals"},
                    {"expr": "forgotten aspirations", "type": "Direct Synonym", "tone": "Melancholy/Sad", "rating": 3, "context": "For dreams left behind"}
                ]
            },
            {
                "phrase": "endless night",
                "alternatives": [
                    {"expr": "infinite darkness", "type": "Direct Synonym", "tone": "Melancholy/Sad", "rating": 4, "context": "For overwhelming despair"},
                    {"expr": "perpetual shadow", "type": "Conceptual Alternative", "tone": "Melancholy/Sad", "rating": 5, "context": "For persistent sadness"},
                    {"expr": "boundless evening", "type": "Same Syllable Count", "tone": "Neutral", "rating": 3, "context": "Less dramatic alternative"},
                    {"expr": "eternal twilight", "type": "Rhyming Alternative", "tone": "Melancholy/Sad", "rating": 4, "context": "For in-between emotional states"}
                ]
            },
            {
                "phrase": "burning desire",
                "alternatives": [
                    {"expr": "intense longing", "type": "Direct Synonym", "tone": "Romantic/Love", "rating": 4, "context": "For passionate wanting without fire metaphor"},
                    {"expr": "fervent wish", "type": "Conceptual Alternative", "tone": "Hope/Inspiration", "rating": 3, "context": "For strong but hopeful desire"},
                    {"expr": "passionate yearning", "type": "Same Syllable Count", "tone": "Romantic/Love", "rating": 4, "context": "Maintains passion without cliché"},
                    {"expr": "deep craving", "type": "Direct Synonym", "tone": "Romantic/Love", "rating": 3, "context": "More visceral alternative"}
                ]
            },
            {
                "phrase": "fading light",
                "alternatives": [
                    {"expr": "dimming glow", "type": "Direct Synonym", "tone": "Melancholy/Sad", "rating": 3, "context": "For gradual loss of hope"},
                    {"expr": "dying radiance", "type": "Conceptual Alternative", "tone": "Melancholy/Sad", "rating": 4, "context": "For something once brilliant ending"},
                    {"expr": "waning brilliance", "type": "Same Syllable Count", "tone": "Neutral", "rating": 4, "context": "For natural decline"},
                    {"expr": "ebbing luminance", "type": "Conceptual Alternative", "tone": "Neutral", "rating": 3, "context": "Technical but poetic alternative"}
                ]
            }
        ]
        
        # We'll need to get the record IDs for the banned phrases first
        # This is a simplified version - in practice you'd query the existing records
        print("Note: This function creates sample alternatives.")
        print("In production, you'd need to link these to existing banned phrase records.")
        
        alternative_records = []
        for phrase_data in alternatives_data:
            for alt in phrase_data["alternatives"]:
                record = {
                    "Alternative Expression": alt["expr"],
                    "Synonym Type": alt["type"],
                    "Quality Rating": alt["rating"],
                    "Usage Context": alt["context"],
                    "Emotional Tone": alt["tone"]
                    # Note: "Related Banned Phrase" would need actual record IDs
                }
                alternative_records.append(record)
        
        if alternative_records:
            print(f"Creating {len(alternative_records)} alternative expressions...")
            self.batch_create_records("alternatives", alternative_records)
            print("✓ Alternative expressions created!")

def main():
    """Main execution function"""
    print("AIRTABLE MIGRATION TOOL FOR BANNED WORDS DATABASE")
    print("=" * 60)
    
    # Configuration - UPDATE THESE VALUES
    ACCESS_TOKEN = os.environ.get("AIRTABLE_ACCESS_TOKEN")
    BASE_ID = "appCyNTXY2q3OWIa7"      # Your base ID

    if not ACCESS_TOKEN:
        print("❌ Please set the AIRTABLE_ACCESS_TOKEN environment variable.")
        print("   You can get a token from https://airtable.com/create/tokens")
        print("   Then run: export AIRTABLE_ACCESS_TOKEN='your_token_here'")
        return
    
    # Initialize migrator
    migrator = AirtableMigrator(ACCESS_TOKEN, BASE_ID)
    
    print("Choose migration option:")
    print("1. Migrate from CSV file (existing banned words database)")
    print("2. Migrate from cliché analysis JSON")
    print("3. Create semantic clusters")
    print("4. Generate alternative expressions")
    print("5. Run complete migration (all steps)")
    
    choice = input("\nEnter your choice (1-5): ").strip()
    
    if choice == "1":
        csv_path = input("Enter path to your CSV file: ").strip()
        migrator.migrate_banned_words_csv(csv_path)
    
    elif choice == "2":
        json_path = input("Enter path to cliché analysis JSON: ").strip()
        migrator.migrate_from_cliche_analysis(json_path)
    
    elif choice == "3":
        json_path = input("Enter path to cliché analysis JSON: ").strip()
        migrator.create_semantic_clusters_from_analysis(json_path)
    
    elif choice == "4":
        migrator.generate_alternatives_for_common_cliches()
    
    elif choice == "5":
        print("Running complete migration...")
        
        # Step 1: Migrate existing CSV if available
        csv_files = ['Banned Words and Phrases Database 07062025.csv', 'banned_words.csv']
        for csv_file in csv_files:
            try:
                migrator.migrate_banned_words_csv(csv_file)
                break
            except FileNotFoundError:
                continue
        
        # Step 2: Migrate cliché analysis if available
        try:
            migrator.migrate_from_cliche_analysis('cliche_analysis_report.json')
        except FileNotFoundError:
            print("⚠️  cliche_analysis_report.json not found, skipping...")
        
        # Step 3: Create semantic clusters
        try:
            migrator.create_semantic_clusters_from_analysis('cliche_analysis_report.json')
        except FileNotFoundError:
            print("⚠️  Skipping semantic clusters (no analysis file)...")
        
        # Step 4: Generate alternatives
        migrator.generate_alternatives_for_common_cliches()
        
        print("✅ Complete migration finished!")
    
    else:
        print("Invalid choice. Please run the script again.")

if __name__ == "__main__":
    main()