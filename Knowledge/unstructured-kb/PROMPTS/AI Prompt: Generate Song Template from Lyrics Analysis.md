# AI Prompt: Generate Song Template from Lyrics Analysis

**Goal:** Analyze the provided song lyrics in detail and generate a structured, guiding songwriting template based on the analysis. The template should capture the observed structure, techniques, patterns, and functions of each section to guide the writing of *new* lyrics in a similar style.

**Input:** Full lyrics of the song to be analyzed will be provided following this prompt.

**Instructions for AI Assistant:**

1. **Identify Song Structure:**
    - Carefully read the provided lyrics.
    - Identify and label the distinct sections (e.g., Verse 1, Pre-Chorus, Chorus, Bridge, Refrain, Outro). Use standard naming conventions where applicable, or descriptive names if the structure is unconventional.
    - Determine the overall sequence of these sections.
1. **Analyze Each Identified Section:**
    - For *each* section identified in Step 1, perform a detailed analysis covering the following songwriting principles (referencing the underlying knowledge base concepts):
        - **Function:** What is the primary role of this section in the song's narrative and emotional arc? (e.g., Introduce setting, build tension, state theme, provide release, offer contrast).
        - **Theme/Content:** What specific themes, topics, or emotions are explored in this section?
        - **Imagery & Language:** Characterize the style of imagery (e.g., concrete, sensory, abstract, metaphorical). Note the tone and style of language used. Identify any notable power words or specific literary devices.
        - **Rhyme Scheme:** Analyze the rhyme pattern (end rhymes, internal rhymes, slant rhymes, near rhymes, assonance/consonance). Is it consistent, loose, or largely absent? Note specific examples.
        - **Rhythm & Flow:** Describe the general rhythmic feel. Analyze syllable count patterns per line (is there consistency, variation, a specific pattern like short/long/medium?). Assess the overall flow and naturalness of the phrasing.
        - **PRA Elements:** Identify key Patterns (melodic/rhythmic motifs suggested by lyrics), Repetition (repeated lines, phrases, or structures), and how the section contributes to the overall emotional Arc.
        - **Tension/Hype:** Assess the level of musical/emotional tension or hype typically associated with this section's function and lyrical content (e.g., verses build tension, chorus provides hype/release).
        - **Cliché Check:** Note if the section relies on common clichés or uses fresh, original language/imagery.
1. **Generate Guiding Template:**
    - Synthesize the analysis from Step 2 into a structured template (use a clear format like YAML or detailed Markdown headings).
    - For *each* section, the template should provide actionable guidance for writing *new* lyrics, based *specifically* on the analysis of the *input* song for that section.
    - The guidance for each section should include prompts related to:
        - Its identified **Function**.
        - The **Themes/Content** it should explore.
        - The **Style of Imagery/Language** to use (e.g., "Use concrete, sensory details similar to input V1...").
        - The observed **Rhyme Approach** (e.g., "Aim for subtle slant rhymes like 'word/heard'...")
        - The observed **Rhythmic Feel/Syllable Guidance** (e.g., "Maintain a rhythmic pattern around X syllables per line, similar to input V1...").
        - Key **Repetitions or Patterns** to include.
        - Target **Tension/Hype Level**.
        - Reminders for **Cliché Avoidance** or specific **Techniques** observed (if any).

**Output Format:** Present the final output as a structured template (YAML preferred, or well-organized Markdown) clearly outlining the guidance for each section of the song structure identified in the input lyrics. Ensure the guidance is detailed enough to be genuinely helpful for drafting new lyrics in the analyzed style.

---

### Song Lyrics:


```other
Right from the start
I was stabbed in the heart
Didn't know I wasn't breathing
Didn't know I had been bleeding

Opened my door
Thought I was alone but
Someone was hiding
In a dark room in my home

Hum it, you will remember some of it
But if you solve it you will remember all of it

Creeper in my home, crawled in through the window
I grabbed a kitchen knife, couldn't stick it in though
Creeper had his own, shining in the moonlight
My home was very cold, and something didn't feel right

Right from the start
I was stabbed in the heart
Didn't know I wasn't breathing
Didn't know I had been bleeding

Opened my door
Thought I was not alone, but
Someone was hiding in the dark room in my home

Right from the start
I was stabbed in the heart
Didn't know I wasn't breathing
Didn't know I had been bleeding

Opened my door
Thought I was alone, but
Someone was hiding in the dark room in my home

Right from the start
I was stabbed in the heart
Didn't know I wasn't breathing
Didn't know I had been bleeding

Opened my door
Thought I was alone, but
Someone was hiding
In a dark room in my home
```