# Chimeric Lyrics Engine – **Project Wiki**

*(Version 3.1 · August 2025)*

> **Purpose** — Serve as the single source‑of‑truth for every stakeholder: product, engineering, AI/ML, and design. Supersedes the previous “Development Brief.” All future edits follow the **Revision History** process (§0.2).

---

## 0 · Meta

### 0.1 Document Owners

| Role         | Name          | Slack  | GitHub   |
| ------------ | ------------- | ------ | -------- |
| Product Lead |  Travis (you) |  @trav | trav‑dev |
| Tech Lead    |  Devon H.     |  @devh | devh‑ops |
| AI Lead      |  Mira P.      |  @mira | mirap‑ai |

### 0.2 Revision History

| Ver  | Date        | Author    | Summary                                                                                    |
| ---- | ----------- | --------- | ------------------------------------------------------------------------------------------ |
|  3.1 |  2025‑08‑02 |  ChatGPT  | Transform brief → full wiki; add Lexicon datastore, placeholders, system prompt, ETL code. |
|  3.0 |  2025‑08‑01 |  Dev Team | Dual‑track plan, Power‑Ups, Model Selector.                                                |
|  2.0 |  2025‑07‑15 |  Dev Team | Melody Engine, Emotion Heat‑Map, Adaptive Profile.                                         |
|  1.0 |  2025‑06‑30 |  Dev Team | Initial Firebase brief.                                                                    |

---

## Table of Contents

1. [Vision & Scope](#1)
2. [Deployment Tracks](#2)
3. [Feature Catalogue](#3)
4. [System Architecture](#4)
5. [Data Model](#5)
6. [Lexicon Datastore](#6)
7. [AI Prompting & KB Integration](#7)
8. [Development Workflow](#8)
9. [Milestones & Roadmap](#9)
10. [Contributor Guides](#10)
11. [Appendices](#11)

---

## 1 · Vision & Scope&#x20;

Create an AI‑powered co‑writer that *democratises sophisticated lyric craft*. Users can generate or refine lyrics using a fusion of **12 creative workflows**, augmented with musical‑aware power‑ups: Melody, Emotion, Structure, and Style Profiling.

Key goals:

- **Originality** out‑of‑the‑box (Cliché Guardrail™).
- **Fine‑grained control** for pros, quick wins for hobbyists.
- **Cost elasticity**: run free for prototypes, scale gracefully.

---

## 2 · Deployment Tracks&#x20;

| Track                             | Purpose              | Infra Cost              | Default Model               | Notes                              |
| --------------------------------- | -------------------- | ----------------------- | --------------------------- | ---------------------------------- |
| **A • Local‑First / Always‑Free** | Internal dev & demos | **\$0** (within quotas) | *gemini‑2.5‑flash‑thinking* | Emulators + Cloud Run free tier.   |
| **B • Scalable Cloud (Paid)**     | Beta → Production    | ≈ \$54/mo + Gemini      | User‑selectable             | Adds autoscaling & quota‑breakers. |

Both tracks share schemas, prompts, CI; migration is environment‑vars only.

---

## 3 · Feature Catalogue&#x20;

### 3.1 Core

1. **Workflow Combiner** (up to 5, plus Generative Muse).
2. **Supplementary Context Upload** (.txt/.md).
3. **Model Selector**: Pro / Flash / Flash‑Thinking.

### 3.2 Power‑Ups

| Power‑Up                | Endpoint             | Free‑Tier Feasibility        |
| ----------------------- | -------------------- | ---------------------------- |
| Melody Engine           | `/melody/generate`   | Yes (Cloud Run job ≤512 MiB) |
| Emotion Heat‑Map        | `/analyze/emotion`   | Yes                          |
| Adaptive Writer Profile | `/profile/*`         | Yes (Firestore ≤1 GB)        |
| Structure Recommender   | `/structure/reorder` | Yes (Flash‑Thinking)         |

### 3.3 Originality Suite

- **Lexicon Guardrail** – cliché blocker (severity tiers).
- **Power‑Word Emphasis** – recommends vibrant synonyms.

---

## 4 · System Architecture&#x20;

### 4.1 High‑Level Diagram

```text
┌───────── Browser ─────────┐
│  React/Next.js Front‑End  │
└──────────┬──────────┬─────┘
           │          │SSR (Hosting)
           │REST/RTK  │
┌──────────▼──────────┐   cloud-config
│  API Layer (Node)   │── Next.js API routes
│  ↳ Functions Emu /  │
│    Cloud Run v2     │
└───────┬─────────────┘
        │async jobs            ┌───────────┐
        ├────────── Lexicon →  │  Firestore │
        │                      └───────────┘
        │                      ┌───────────┐
        ├────────── KB Vectors │  Milvus    │ (local)
        │                      └───────────┘
        │                      ┌───────────┐
        ├────────── Storage →  │  GCS/S3    │
        │                      └───────────┘
        └─> Gemini 2.5 (Flash‑Thinking by default)
```

*Dashed arrows* exist only in Track B.

---

## 5 · Data Model&#x20;

Full schematic already lives in `schema.prisma`; quick reference table included for convenience.

| Collection / Table | Purpose               | Track A Storage        |
| ------------------ | --------------------- | ---------------------- |
| `users`            | Auth & profile        | Firestore (≤10 k docs) |
| `projects`         | Song projects         | Firestore              |
| `drafts`           | Lyric versions        | Firestore              |
| `melody`           | MusicXML/MIDI refs    | Cloud Storage (≤5 GB)  |
| `emotion_scores`   | valence/arousal lines | Firestore              |
| `lexicon`          | clichés & power words | Firestore (hot‑loaded) |

---

## 6 · Lexicon Datastore&#x20;

### 6.1 Unified Schema

| Field                 | Type         | Required    | Notes               |                   |
| --------------------- | ------------ | ----------- | ------------------- | ----------------- |
| id                    | UUID         | ✔           | PK                  |                   |
| root                  | string       | ✔           | Canonical form      |                   |
| category              | enum \`avoid | recommend\` | ✔                   | Guard vs Emphasis |
| variants              | string[]     | –           | Case/inflections    |                   |
| severity              | enum         | avoid       | EXTREME/HIGH/MEDIUM |                   |
| tier                  | int          | recommend   | 1–3                 |                   |
| emotionalColour       | enum/string  | recommend   | Tone mapping        |                   |
| exampleUse            | string       | recommend   | Usage demo          |                   |
| synonyms\*            | string[]     | –           | swap pools          |                   |
| oftenCombinedWith     | string[]     | –           | n‑gram helper       |                   |
| createdAt / updatedAt | timestamp    | ✔           |                     |                   |

> *synonyms, synonymsRhyme, synonymsSameSyllables* stored as sibling arrays.

### 6.2 ETL Pipeline

```python
# scripts/ingest_lexicon.py (excerpt)
for src in (csv_rows, json_rows, md_rows):
    entry = normalise(src)
    db.collection("lexicon").document(entry["id"]).set(entry, merge=True)
```

Sources merged:

- `enhanced_banned_words_database.csv`
- `words_phrases_cliches.json`
- `kb/power-word-bank.md`

### 6.3 Runtime

- **Guardrail Trie** → built at startup from `category=avoid`.
- **Emphasis Engine** → Firestore query `where(category=='recommend' and tier==1)` etc.

---

## 7 · AI Prompting & KB Integration&#x20;

### 7.1 Static System Prompt (`lyrics-agent-vA1`)

Stored in `prompts/system/lyrics-agent-vA1.txt` – see Appendix A.

### 7.2 Retrieval‑Augmented Generation (RAG)

1. Query Milvus with user request embedding (k=5).
2. Inject chunks into prompt after Hollywood Structure section.
3. Total tokens ≤2048.

### 7.3 Model Selection Logic

```js
const MODEL_MAP = {
  pro: 'gemini-2.5-pro',
  flash: 'gemini-2.5-flash',
  'flash-thinking': 'gemini-2.5-flash-thinking'
};
model = req.body.model || user.preferredModel || 'flash-thinking';
```

---

## 8 · Development Workflow&#x20;

### 8.1 Two‑Week Sprint Board *(Sprint #03)*

| Issue  | Type                | Owner    | Status        |
| ------ | ------------------- | -------- | ------------- |
| CH‑101 | Repo bootstrap & CI | Dev Lead | ✅ Done        |
| CH‑102 | Lexicon ETL         | AI Eng   | ⏳ In‑Progress |
| CH‑103 | KB ingest script    | AI Eng   | ⏳             |
| CH‑104 | LilyPond Docker     | DevOps   | ⏳             |
| CH‑105 | Spark deploy stub   | Dev Lead | ⏳             |

### 8.2 Local Dev Commands

```bash
pnpm dev                  # Next.js
firebase emulators:start  # Auth/DB/Storage/Functions
USE_GEMINI=stub pnpm test # Fast unit tests
```

---

## 9 · Milestones & Roadmap&#x20;

| Phase                   | ETA      | Deliverables                            |
| ----------------------- | -------- | --------------------------------------- |
| **M‑0** Offline Sandbox | Aug 2025 | Local stack, Lexicon guardrail w/ stubs |
| **M‑1** Hosted Alpha    | Aug 2025 | Spark deploy, internal testers          |
| **M‑2** Live AI (Free)  | Sep 2025 | Flash‑Thinking, Melody render, KB RAG   |
| **M‑3** Beta (Paid)     | Jan 2026 | Pro/Flash models, scaling, billing      |
| **GA**                  | Apr 2026 | Multi‑org, analytics, plugin SDK        |

---

## 10 · Contributor Guides&#x20;

- **Templates** → see *Chimeric Lyrics Engine – Contributor Placeholders* (Doc ID `688def16…`).
- **Commit Message Style** → Conventional Commits (`feat:`, `fix:`, `docs:`).
- **Branch Naming** → `trackA/<issue‑key>` or `trackB/<issue‑key>`.
- **Code Owners** → `CODEOWNERS` file enforces PR reviews.

---

## 11 · Appendices&#x20;

### Appendix A — Full Static System Prompt

*(Content reproduced from placeholder doc.)*

### Appendix B — Placeholder Templates Snapshot

*Power‑Word Bank, Sample Prompts, Reference MIDI, Persona Notes* – see Contributor Placeholders doc.

### Appendix C — ETL Scripts

`/scripts/ingest_lexicon.py`, `/scripts/ingest_kb.py` – latest versions in repo.

---

> **End of Wiki (v3.1)**  – all edits subject to PR review.  Next planned update: integrate Q4‑2025 Suno v4.6 API changes.

