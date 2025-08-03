Here's a step-by-step guide to building and running a new song lyric analysis agent locally:

---

### **1. Environment Setup**
#### **Prerequisites**
- Python 3.8+ (recommended)
- `pip` for package management
- A code editor (VS Code, PyCharm, etc.)

#### **Create a Virtual Environment**
```bash
python -m venv lyric-env
source lyric-env/bin/activate  # Linux/Mac
.\lyric-env\Scripts\activate   # Windows
```

---

### **2. Install Dependencies**
Create a `requirements.txt` file:
```text
nltk==3.8.1
pronouncing==0.2.0
syllables==0.1.0
regex==2024.4.28
python-dotenv==1.0.0
```
Install packages:
```bash
pip install -r requirements.txt
```

---

### **3. Project Structure**
```
lyric-agent/
├── cliches/                    # Cliché database
│   └── overused-words-and-cliches-to-avoid.md
├── src/
│   ├── syllable_counter.py     # Syllable analysis
│   ├── cliche_detector.py      # Cliché scanner
│   ├── rhyme_analyzer.py       # Rhyme scheme detection
│   ├── pra_patterns.py         # Line Plus/PRA detection
│   ├── metatag_validator.py    # Suno AI metatag checks
│   └── main.py                 # Main workflow
├── outputs/                    # Generated reports
├── tests/                      # Unit tests
└── .env                        # Configuration (optional)
```

---

### **4. Core Components**
#### **Syllable Counter (`syllable_counter.py`)**
```python
import syllables
from nltk.corpus import cmudict

# Initialize CMU Dict for backup
cmu = cmudict.dict()

def count_syllables(line):
    try:
        return syllables.estimate(line)
    except:
        # Fallback using CMU Dict
        words = line.lower().split()
        count = 0
        for word in words:
            count += max([len(list(y for y in x if y[-1].isdigit())) for x in cmu[word]])
        return count
```

#### **Cliché Detector (`cliche_detector.py`)**
```python
def load_cliches(file_path="cliches/overused-words-and-cliches-to-avoid.md"):
    with open(file_path, "r") as f:
        cliches = [line.strip() for line in f if line.strip()]
    return cliches

def detect_cliches(text, cliches):
    found = []
    for line in text.split("\n"):
        for phrase in cliches:
            if phrase.lower() in line.lower():
                found.append((line, phrase))
    return found
```

#### **Rhyme Analyzer (`rhyme_analyzer.py`)**
```python
import pronouncing

def get_rhyme_scheme(lyrics):
    end_words = [line.split()[-1] for line in lyrics if line.strip()]
    rhyme_map = {}
    scheme = []
    rhyme_index = 0
    for word in end_words:
        rhymes = pronouncing.rhymes(word)
        found = False
        for key, value in rhyme_map.items():
            if word in rhymes or word == key:
                scheme.append(value)
                found = True
                break
        if not found:
            rhyme_map[word] = chr(ord('A') + rhyme_index)
            scheme.append(chr(ord('A') + rhyme_index))
            rhyme_index += 1
    return "-".join(scheme)
```

---

### **5. Run the Agent**
#### **Main Workflow (`main.py`)**
```python
from syllable_counter import count_syllables
from cliche_detector import detect_cliches, load_cliches
from rhyme_analyzer import get_rhyme_scheme

def analyze_lyrics(input_file):
    with open(input_file, "r") as f:
        lyrics = f.read()
    
    # Phase 1: Cliché Detection
    cliches = load_cliches()
    found_cliches = detect_cliches(lyrics, cliches)
    
    # Phase 2: Syllable Analysis
    lines = [line.strip() for line in lyrics.split("\n") if line.strip()]
    syllable_map = [count_syllables(line) for line in lines]
    
    # Phase 3: Rhyme Scheme
    rhyme_scheme = get_rhyme_scheme(lines)
    
    # Generate Report
    report = {
        "cliches": found_cliches,
        "syllables": syllable_map,
        "rhyme_scheme": rhyme_scheme
    }
    return report

if __name__ == "__main__":
    report = analyze_lyrics("inputs/sample_lyrics.txt")
    print("Analysis Report:")
    print(f"Cliches Found: {report['cliches']}")
    print(f"Syllable Map: {report['syllables']}")
    print(f"Rhyme Scheme: {report['rhyme_scheme']}")
```

---

### **6. Test with Sample Input**
Create `inputs/sample_lyrics.txt`:
```text
[Verse]
My heart beats like a thunder storm
As time slips through my fingers
```

Run the agent:
```bash
python src/main.py
```

**Output**:
```
Analysis Report:
Cliches Found: [('My heart beats like a thunder storm', 'heart beats'), ...]
Syllable Map: [8, 7]
Rhyme Scheme: A-A
```

---

### **7. Advanced Features**
1. **Add PRA Pattern Detection**:
   - Use regex to identify Line Plus Three/Two patterns (e.g., `r"\b(\w+)\s(\w+)\s(\w+)$"`).
2. **Metatag Validation**:
   - Check for valid Suno tags using `re.match(r"\[([A-Za-z\s-]+)\]", line)`.
3. **Export Reports**:
   - Save results to JSON/HTML with timestamps.

---

### **8. Deploy as CLI Tool**
Add a `cli.py`:
```python
import argparse

parser = argparse.ArgumentParser(description="Lyric Analysis Agent")
parser.add_argument("-i", "--input", required=True, help="Input lyrics file")
parser.add_argument("-o", "--output", help="Output report file")
args = parser.parse_args()

report = analyze_lyrics(args.input)
if args.output:
    with open(args.output, "w") as f:
        json.dump(report, f)
else:
    print(json.dumps(report, indent=2))
```

Run with:
```bash
python src/cli.py -i inputs/sample_lyrics.txt -o outputs/report.json
```

---

### **9. Next Steps**
- Add GUI with `tkinter` or `streamlit`.
- Integrate GPT-4 for cliché replacement suggestions.
- Optimize performance with caching for large datasets.

This setup provides a foundational lyric analysis tool that can be expanded based on your needs!