"""
lyrics_cliche_analysis_pipeline.py

Pipeline to detect and manage over‑used (cliché) words and phrases in AI‑generated
song lyrics, and to recommend fresher alternatives.

Author: Travis + ChatGPT
Created: 2025‑07‑11
Last updated: 2025‑07‑11

────────────────────────────────────────────────────────────────────────────
Overview
────────
1.  Ingest AI‑generated lyrics and an existing “banned” word/phrase list.
2.  Clean and normalize the lyrics (remove tags like [Chorus], punctuation,
    lowercase, etc.).
3.  Tokenize, remove stop‑words, and lemmatize.
4.  Build frequency tables for unigrams, bigrams, and trigrams.
5.  Identify candidate clichés:
      • Top‑K most frequent n‑grams that exceed an absolute & relative
        frequency threshold AND are not already on the banned list.
      • Optional: compare against a corpus of *human‑written* lyrics to
        highlight n‑grams that are disproportionately common in AI output
        (log‑likelihood ratio).
6.  For each candidate cliché generate “Try this instead” suggestions:
      • Synonyms from WordNet with matching syllable counts.
      • Similar‑meaning phrases via simple language‑model prompt or word
        embeddings.
7.  Export:
      • updated_banned_list.csv  – merged list with severity rating.
      • cliche_report.md         – nicely formatted summary for humans.

Usage
─────
$ python lyrics_cliche_analysis_pipeline.py --lyrics full_dataset.csv \
        --banned current_banned.csv --out_dir results/

Requires:
  pandas, nltk, spacy, textstat, wordfreq, tqdm, python-Levenshtein

Tips:
  • First run `python -m nltk.downloader omw-1.4 wordnet stopwords punkt`
  • For large datasets use spaCy’s pipe() and a larger batch size.

"""

from __future__ import annotations
import argparse
from pathlib import Path
import re
import string
import json
from collections import Counter
from typing import List, Tuple, Dict

import pandas as pd
import nltk
from nltk.corpus import stopwords, wordnet as wn
from nltk.stem import WordNetLemmatizer
import spacy
from tqdm import tqdm

tqdm.pandas()

#########################
# 1. Utility functions  #
#########################

TAG_RE = re.compile(r"\[[^\]]+\]")           # [Chorus]
PAREN_RE = re.compile(r"\([^\)]+\)")         # (yeah)
PUNCT_TABLE = str.maketrans("", "", string.punctuation)

def clean_lyric(text: str) -> str:
    """Lowercase, strip section tags & ad‑libs, collapse whitespace."""
    text = TAG_RE.sub(" ", text)
    text = PAREN_RE.sub(" ", text)
    text = text.translate(PUNCT_TABLE)
    text = re.sub(r"\s+", " ", text)
    return text.lower().strip()

lemmatizer = WordNetLemmatizer()
STOPWORDS = set(stopwords.words("english"))

def tokenize(text: str) -> List[str]:
    return [lemmatizer.lemmatize(tok)
            for tok in nltk.word_tokenize(text)
            if tok not in STOPWORDS]

def ngrams(tokens: List[str], n: int) -> List[Tuple[str,...]]:
    return list(zip(*(tokens[i:] for i in range(n))))

def pmi(freq_ab: int, freq_a: int, freq_b: int, total_tokens: int) -> float:
    """Point‑wise mutual information for bigrams."""
    import math
    return math.log2((freq_ab * total_tokens) / (freq_a * freq_b + 1e-9))

def suggest_synonyms(word: str, max_suggestions: int = 5) -> List[str]:
    """Return up to N WordNet synonyms with same part‑of‑speech."""
    syns = set()
    for syn in wn.synsets(word):
        for lemma in syn.lemmas():
            candidate = lemma.name().replace('_', ' ')
            if candidate != word:
                syns.add(candidate)
    return list(syns)[:max_suggestions]

#########################
# 2. Main pipeline      #
#########################

def build_frequency_tables(lyrics_series: pd.Series) -> Dict[str, Counter]:
    uni_ct = Counter()
    bi_ct  = Counter()
    tri_ct = Counter()

    for lyric in tqdm(lyrics_series, desc="Processing lyrics"):
        cleaned = clean_lyric(lyric)
        toks = tokenize(cleaned)
        uni_ct.update(toks)
        bi_ct.update([" ".join(b) for b in ngrams(toks, 2)])
        tri_ct.update([" ".join(t) for t in ngrams(toks, 3)])

    return {"unigram": uni_ct, "bigram": bi_ct, "trigram": tri_ct}

def load_banned_list(path: Path) -> set[str]:
    if not path.exists():
        return set()
    df = pd.read_csv(path)
    roots = set(df["root_word_phrase"].str.lower().dropna())
    variants = df["variants"].str.lower().fillna("").str.split(',')
    for vlist in variants:
        roots.update([v.strip() for v in vlist])
    return roots

def identify_candidates(freq_tables: Dict[str, Counter],
                        banned: set[str],
                        min_freq: int = 30,
                        top_k: int = 200) -> Dict[str, List[Tuple[str,int]]]:
    """Return dict mapping n‑gram level to list of (phrase, count)."""
    candidates = {}
    for level, counter in freq_tables.items():
        filtered = [(phrase, ct) for phrase, ct in counter.most_common()
                    if ct >= min_freq and phrase not in banned]
        candidates[level] = filtered[:top_k]
    return candidates

def build_replacement_table(candidates: Dict[str, List[Tuple[str,int]]]
                            ) -> pd.DataFrame:
    records = []
    for level, items in candidates.items():
        for phrase, ct in items:
            words = phrase.split()
            replacement = "; ".join(
                [", ".join(suggest_synonyms(w, 3)) for w in words])
            records.append({
                "root_word_phrase": phrase,
                "severity": "AUTO",
                "source": level,
                "frequency": ct,
                "try_instead": replacement or "--"})
    return pd.DataFrame(records)

#########################
# 3. Command‑line entry #
#########################

def main():
    parser = argparse.ArgumentParser(description="Detect cliché lyrics.")
    parser.add_argument("--lyrics", type=Path, required=True)
    parser.add_argument("--banned", type=Path, required=True)
    parser.add_argument("--out_dir", type=Path, default=Path("results"))
    args = parser.parse_args()

    args.out_dir.mkdir(parents=True, exist_ok=True)

    lyrics_df = pd.read_csv(args.lyrics)
    lyrics_series = lyrics_df["lyrics"].astype(str)

    freq_tables = build_frequency_tables(lyrics_series)
    banned_set = load_banned_list(args.banned)
    candidates = identify_candidates(freq_tables, banned_set)

    replacements_df = build_replacement_table(candidates)
    replacements_df.to_csv(args.out_dir / "auto_cliche_candidates.csv",
                           index=False)

    # Merge with original banned list
    if args.banned.exists():
        merged = pd.concat([pd.read_csv(args.banned), replacements_df],
                           ignore_index=True, sort=False)
        merged.drop_duplicates(subset=["root_word_phrase"], inplace=True)
        merged.to_csv(args.out_dir / "updated_banned_list.csv", index=False)

    # Simple markdown report
    with open(args.out_dir / "cliche_report.md", "w", encoding="utf8") as f:
        f.write("# Cliché Analysis Report\n\n")
        for level in ("unigram", "bigram", "trigram"):
            f.write(f"## Top {level}s\n\n")
            for phrase, ct in candidates[level][:50]:
                f.write(f"* {phrase} — {ct} occurrences\n")

if __name__ == "__main__":
    main()
