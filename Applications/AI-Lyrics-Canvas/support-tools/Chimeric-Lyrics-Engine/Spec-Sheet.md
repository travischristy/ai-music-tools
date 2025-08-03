# **Chimeric Lyrics Engine: Application Specification Sheet v1.2**

### **1.0 Overview**

The **Chimeric Lyrics Engine** is a sophisticated, AI-powered songwriting co-pilot designed to assist users in generating and revising lyrics through a suite of advanced, research-backed creative workflows. It functions as a dynamic partner, moving beyond simple text generation to offer intentional, structured, and innovative methods for lyrical creation.

The application leverages the Gemini 2.5 Pro model, guided by a deep knowledge base of literary theory, music psychology, and lyrical analysis, to produce output that is original, emotionally resonant, and technically sound.

### **2.0 Core Application Features**

The application is built around a user-friendly interface that provides granular control over the AI's creative process.

| Feature | Description | Use Case |
| :--- | :--- | :--- |
| **Goal Selection** | User chooses between two primary modes: **Generate New Lyrics** from a concept or **Revise Existing Lyrics**. | Quickly toggles the application's entire context, from starting a song from scratch to refining a work-in-progress. |
| **Multi-Workflow Selection** | Allows the user to select and combine **1 to 5 distinct creative workflows** to be fused into a single prompt. | Craft highly specific and nuanced creative requests, such as generating surrealist imagery (**Dalí's Method**) that also contains witty wordplay (**Antanaclasis**). |
| **The Generative Muse** | A randomization feature that allows the user to specify a number of workflows (1-5) to be randomly selected by the app. | Breaks creative blocks by introducing unexpected combinations of methods, forcing the user out of habitual patterns. |
| **Supplementary Context Upload** | Users can upload `.txt` and `.md` files to provide additional context for a generation request, such as character backstories, thematic notes, or personal cliché lists. | Provides the AI with deep, specific knowledge for a given task, ensuring the output is highly tailored to the user's unique project. |
| **Dynamic Parameter Tuning**| An interactive UI section that populates with sliders, text inputs, and radio buttons specific to the selected workflows (e.g., "Lyrical Density," "Ambiguity Level"). | Allows for fine-tuning the intensity and application of each creative method, giving the user precise control over the final output. |
| **AI-Assisted Ideation** | Includes the **"Concept Expander"** and **"Surrealist Lens Suggester,"** which call the Gemini API to flesh out simple ideas or suggest creative metaphors. | Helps users overcome initial hurdles in the creative process by using the AI for brainstorming and ideation *before* the main lyric generation. |
| **Output Configuration** | Toggles allow the user to control the output format, including showing/hiding the AI's reasoning, the final constructed prompt, and activating the **Cliché Guardrail™**. | Empowers the user to customize the response for their needs, whether they want a clean final product or a detailed breakdown for learning purposes. |
| **Cliché Guardrail™** | A mandatory, final verification step (when enabled) that scans the AI's output against a comprehensive internal knowledge base of overused words and phrases and forces regeneration if a violation is found. | Ensures a high degree of lyrical originality and prevents the model from defaulting to generic, predictable language. |

### **3.0 Creative Workflows (The "Chimera" Engine)**

These are the core creative methods derived from the research report that the user can select. Each represents a distinct approach to the art of lyric writing.

#### **3.1 The Semantic Core (The Poet-Philosopher)**

Workflows focused on the sophisticated use of language and rhetoric.

* **Aporia & Rhetorical Doubt**: Expresses real or feigned doubt to build tension or frame a powerful argument. **Use Case**: Crafting introspective verses that pose questions answered powerfully in the chorus.
* **Antanaclasis & Polysemy**: Repeats a single word with a different meaning each time for witty, dense, and layered wordplay. **Use Case**: Creating a clever hook or a profound line that makes the listener re-evaluate a concept.
* **Chiasmus & Inverted Parallelism**: Creates a balanced, symmetrical "ABBA" structure of ideas to deliver a memorable, philosophical statement. **Use Case**: Writing a powerful, conclusive bridge or final line that feels both profound and complete.

#### **3.2 Lyrical Auteurship (Case Studies)**

Workflows that emulate the core principles of master lyricists.

* **Leonard Cohen Model**: Generates ambiguous lyrics by fusing sacred and profane imagery, resisting a single interpretation. **Use Case**: Writing lyrics with deep, multi-layered meaning that invite listener interpretation.
* **Tom Waits Model**: Writes from the first-person perspective of a specific, gritty, and often marginalized character persona. **Use Case**: Creating authentic, story-driven lyrics with a strong, consistent character voice.
* **Kendrick Lamar Model**: Employs rapid perspective shifts within a single song and blends the typical functions of song sections (e.g., a narrative chorus). **Use Case**: Exploring a complex, multi-faceted theme from different viewpoints within the same song.

#### **3.3 The Generative Muse (The Agent of Chaos)**

Workflows designed to intentionally disrupt creative patterns and force innovation.

* **Dalí's Paranoiac-Critical Method**: Describes a core subject through the imagery and vocabulary of a completely unrelated concept or "lens." **Use Case**: Generating highly original, surreal, and dream-like metaphors that are guaranteed to be non-cliché.
* **The Cut-Up Technique (Burroughs/Bowie)**: Fragments and randomly reassembles a source text to create unexpected juxtapositions and novel lyrical ideas. **Use Case**: Overcoming writer's block by generating surprising new source material from existing text.
* **Creative Sabotage (Constraint-Based)**: Applies a strict, arbitrary rule to a draft (e.g., "remove the letter 'e'," "invert the core emotion") to force a radical and innovative revision.

#### **3.4 Psycho-Acoustic Engine (The Emotional Architect)**

Workflows based on the science of how music and sound affect human emotion.

* **The Huron ITPRA Model**: Engineers an emotional journey by intentionally manipulating the listener's expectations of melody and harmony, creating either satisfying resolutions or powerful "nice surprises." **Use Case**: Structuring the lyrical and implied musical arc of a song to maximize emotional impact, such as building tension in a pre-chorus that resolves powerfully in the chorus.

### **4.0 Core Knowledge & AI Expertise**

The Chimeric Lyrics Engine's capabilities are built upon a specialized, internal knowledge base synthesized from the project's research. This is what allows the AI to move beyond generic responses.

* **The Polysemy & Homophone Database**: A structured database of words with multiple meanings and words that sound alike. This is the technical foundation that powers the **Antanaclasis** workflow and enables sophisticated wordplay.
* **Compendium of Lyrical Personas**: A framework for procedurally generating unique character voices based on Jungian archetypes and narrative roles. This informs the **Tom Waits Model** and can be used to add depth to any lyrical request.
* **Lexicon of Literary & Rhetorical Devices**: Detailed, AI-parsable definitions and application frameworks for complex devices like **Aporia** and **Chiasmus**, allowing the AI to understand not just what they are, but *how* and *why* to use them effectively.
* **Psycho-Acoustic Models**: An actionable understanding of music psychology theories, like **Huron's ITPRA Model**, which allows the AI to structure lyrics with an awareness of how they will interact with music to manage a listener's cycle of tension and reward.
* **Anti-Cliché Knowledge Base**: A comprehensive and continuously updated list of overused words, phrases, and metaphors that are cross-referenced by the **Cliché Guardrail™** to ensure lyrical originality.