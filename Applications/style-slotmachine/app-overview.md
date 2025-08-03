## AI Music Tool: Tag Slot Machine

The core of the tag generation process is the "Tag Slot Machine". This feature moves beyond simple checkboxes to offer a dynamic and engaging way to explore and combine musical descriptors.

**Concept:**
Imagine a slot machine, but instead of fruits, the reels (or "wheels") are filled with potential music tags. You configure the machine, spin the unlocked wheels (or select manually), and lock in your desired combination.

**Configuration:**
Before spinning, you set up the machine:

1.  **Genre Wheels:** Choose how many distinct Genre wheels you want (1, 2, or 3). Each wheel will draw from the available genre tags.
2.  **Vocal Wheel:** Select the primary vocal characteristic (e.g., Male Vocals, Female Vocals, Instrumental). This adds a single, dedicated Vocal wheel.
3.  **Optional Category Wheels:** You have fine-grained control over adding wheels for other descriptive categories:
    * **Periods:** (e.g., 1980s, Baroque)
    * **Instruments:** (e.g., Electric Guitar, Synthesizer)
    * **Emotions:** (e.g., Energetic, Melancholic)
    * **Productions:** (e.g., Lo-fi, Studio Recording)
    For each optional category, you first check a box to include it, and then select how many wheels (1, 2, or 3) you want for that specific category.

**Wheel Appearance & Data Sources:**

* **Layout:** The wheels appear horizontally in the "slot machine" area. A key feature is **vertical stacking**: if you select more than one wheel for the same category (e.g., 3 Genre wheels), they will stack vertically within a single column. These stacked wheels are slightly smaller to maintain a consistent overall layout.
* **View:** The wheels are designed to be taller than typical dropdowns, allowing you to see more potential tags at once within the scrollable content area. A subtle 3D perspective effect is applied to give the impression of a cylindrical wheel.
* **Tag Population:** The tags that populate each wheel can come from multiple sources (depending on implementation and user setup):
    * **Internal JSON:** The extension includes default JSON files (`music-style-slotmachine/database/tagbuilder/*.json`) containing a wide variety of tags for each category.

**Interaction:**

1.  **Manual Selection:** Click directly on any tag within a wheel's scrolling list to select it.
2.  **Locking/Unlocking:** Each wheel has a "Lock/Unlock" button. When you manually select a tag, the wheel usually locks automatically. You can toggle the lock state manually. Locked wheels are excluded from randomization.
3.  **Shuffle:** Click the "Shuffle Unlocked" button. This triggers a randomization process where every wheel *not* currently locked will instantly display a new, randomly chosen tag from its available options.
4.  **AI Suggestions (Optional):** An input field allows you to describe music and use the configured OpenRouter AI model to suggest relevant tags, which you can then select or use as inspiration.

**Output:**
As you select or shuffle tags, the "Generated Tags" text area automatically updates with a comma-separated list of the currently selected tag from each active wheel. A "Copy Tags" button allows you to quickly grab this string for use elsewhere.
