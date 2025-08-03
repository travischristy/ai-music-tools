# AI Lyrics Canvas

- AI Agents, Workflows, Knowledge Base, and Template Tools Help Create, Edit, Save, and Work on Song Lyrics
- Custom Knowledge Base is Expansive
- Generate extremely unique and original lyrics (even with AI!) using the Chimera Lyrics Engine
- Reduce commonly founds and overused words, phrases, and weak cliches using analysis and replacement features to make more original lyrics (even with AI!)
- SUNO AI specific helpers support working with the latest models (v4.5+), best practives for metatags, style prompt guidance, and online suno.com web app platform features/limitations


## Main User Interface and Application Components

Song Lyrics Co-Writing Notepad (customized and tuned for Suno AI Music Generation)


The Main Tab of the app is a collaborate and interactive notebook specifically designed and integrated for writing custom lyrics and style of music prompts for the Suno AI platform, where AI agent workflows are called dynamically by the USER to facilitate a highly collaborative and flexible Songwriting and Musical Creatiive Brainstorming workspace

- Similar to a Word Processing / Modern Notepad App like Notion or Craft.
- Main UI Blocks work similarly to the "Canvas" and "Artifacts" features in popular modern chat app interfaces, allowing both the user and AI to generate and edit it's contents with recursive tracking feeatures to undo/redo changes
- Real-time User Input Processing and Suggestions Output (uses something like NLP or free/local AI, not continous LLM calls)

### UI BLOCKS

#### Song Title (Input/Output)
  - 45-character limit
  - Clean, minimalist text field
  - Real-time character count validation
  

#### Style Of Music 

- aka "Style of Music" is now called "Style" in latest Suno AI update
- Generate User Request Menu (sliders for #, variation)
- Advanced Control (weirdness, style influence, audio input influence)

##### Text Input/Output Canvas Block

- Input Length Limited to <= 1000 characters (default)
- Alternative allows User Selected Length Limited to <= 200 characters can be set by user (optional)
- Support for detailed genre and mood prompts development, edits, and iterations that follow proven style of music prompt best practives for latest Suno Models and Platform Features

##### Suno Model v4.5+ Custom/Advanced Control Settings & Suggestions
- Wierdness %
- Style Influence %
- Input Audio Influence
- Excluded Style (negative prompt) Prompt (Input/Output text block Supports built in Suno feature with AI suggestions
    
- Expandable text block area (vertical expansion feaature)

### Custom Lyrics 

- Main Component of UI
- Largest UI component is the main user focus and tends to be the place most users spend the most time working

#### Text Block (Input/Output) Canvas Block

- Expandable text area


#### Real-time Processing and Suggeestions Context
- The backend not AI
- Responsive to user input / changes
- Uses tools: thesaurus, rhyme strength, rhyme alternatives, rhyme pattern validation, syllable counting, cliches/banned words and phrases check)

#### Song Blueprints
- Includes Analyze and Generate Blueprint Menu Options
- Includes Quick Blueprint Builder via Add Section Buttons
- UI Location / Arrangement should be just above or adjacent to Custom Lyrics Main Text Block
- Allows the User to Build Song Template or Select from a Saved Template which populates the custom lyrics text block with the template contents
- Click and Build Template allows user to quickly build empty template using buttons and build menu setting to add listed song sections from a menu. The button inserts the following into custom lyrics: section header in brackets always, and 4 empty lines (default), 
- Blueprint Guidance Level Options: The user should be able to control the level of guidance provided by the blueprint/template using a slider to control the verbosity and specificity of the guidance included in Song Blueprints and Template / Quick Section Template Builder
    - User selection controls how the system instructs the AI or App Backend to build the Song Blueprint.
    - Slider configures blueprint from predefined levels( more less degree of specificity and verbostity for the help and notes provided on song themes, concept, lyric tools, energy/hype, syllable and rhyme pattern suggestions at the line level section level or more/less broad).

#### AI AGENT WORKFLOW ACTION BUTTONS (AI CUSTOM LYRICS WORKFLOWS)

- Generate Button
  - User Menu / Advanced Control Options
- Analyze Button
  - User Menu / Advanced Control Options
- Edit / Iterate Button
  - User Menu / Advanced Control Options
- Enhance / Expand Button
  - User Menu / Advanced Control Options
    
### Analysis Results

Block with easy Expand/Minimize buttons display any advanced reasoning, analysis results, and other AI Agent report

### UI BUTTONS ALLOW USERS TO QUICKLY AND EASILY WORK WITH GENERATED TEXT CONTENT AND AI RESPONSES
- Copy, Save/Export, and Share Buttons for Style Block
- Copy, Save/Export, and Share Buttons for Lyrics Block
- Copy, Save/Export, and Share Buttons for Analysis Block
 


### API Logger
- Helps debug and track AI/API/Workflows etc. because it saves all sent context from requests (the system instructions, user prompt, all attached context the workflow sends the AI via API requests
- Allows the user to resend any previous requests easily
- Provide history for looking back at previous requests

---


## AI Agent Workflows and Assistance Features

### GENERATE

- Song Blueprint from Custom Lyrics Input
    - Song Blueprint Verbosity and Specificity Sliders
     - Control how specific / detailed the information the AI provides in the song Blueprint (Slider 1-5)
- New Custom Lyrics: New from User Song Concept, No Custom Lyrics Input Necessary
    - Various levels of user provided input and guidance settings / levels offers flexible AI agent powered support (also considers style input, user concept input, and additional user context if provided)
    - Full Song, Sections Specified by User from menu, Expand/Fill-in (if lyrics are missing words, lines, or sections from established song blueprint)
- For Existing Custom Lyrics: Edits / Enhancements / Analysis with Report
    - First AI will Analyze Custom Lyrics Input (also considers style input, user concept input, and additional user context if provided)
    - Custom Lyrics Output in easy copy box formatted for Suno AI Input
    - Analysis Report Provided as additional context in seperate UI area
- Style of Music: Extrapolates Ideas from Custom Lyrics Input and/or User Song Concept Input
    - # of Unique Style Prompts to Generate Slider: 1 - 20
    - Temperature and Creativity Slider: 0.1 - 2.0
- Style of Music: Iterates from Style Input
    - # of Unique Style Prompts to Generate (Slider: 1 - 20)
    - Deviation / Degree of Difference from style input (slider 1-5)
    - Temperature / Creativity (Slider 0.1 - 2.0)
    
- ### Enhance

- Custom Lyrics:
    - Add Style Guidance: Custom Lyrics Input enhanced by adding Guidance and Metatags in brackets from the Style Input
    - AI Find and Replace in custom lyrics input, checks for Cliches, Overused Words and Phrases, and Banned Words from provided project database and runs replacement Workflow to remove/replace instances found with words/phrases/imageery/metaphors that align with the syllable and rhyming patterns in the custom lyrics input.
    - Humanize from Custom Lyrics Input (and Style Input)
        - adds vocalizations, adlibs, backup vocals, call-backs, etc in parenthesis to custom lyrics



### Song Blueprints 

#### AI Agent Blueprint Builder from custom lyrics, style, and user concept / context inputs.

#### Blueprint Buider uses Quick Add buttons to assemble template in the Custom Lyrics input Canvas
- **Section Management**
  - Dynamic addition/removal of song sections
  - Support for multiple section types:
    - Intro
    - Verse
    - Pre-Chorus
    - Chorus
    - Bridge
    - Outro
    - Hook
    - Refrain
    - Instrumental Break
    - Instrumental Build

- **Line Management**
  - Line numbering system
  - Individual line editing
  - Real-time analysis of:
    - Rhyme scheme (displayed as letters A, B, C, etc.)
    - Syllable count
    - Word strength indicators

- **Visual Indicators**
  - Color-coded rhyme schemes
  - Syllable count display
  - Real-time feedback on line modifications

### Suggestion Panel
- **Rhyming Alternatives**
  - Strength-based sorting (0-100%)
  - Color-coded strength indicators
  - Interactive suggestion chips
  - Hover effects for selection

- **Thematic Suggestions**
  - Context-aware word suggestions
  - Strength percentage display
  - Visual strength indicators
  - Category-based organization

## 2. Application Features (AI Agents, Workflows, and Code/Scripts in Application Backend)

### Genre and Style Analysis
- Real-time genre suggestions based on input
- Style pattern recognition
- Musical context awareness
- Genre-appropriate vocabulary suggestions

### Analyze: Rhymes, Syllables, Style, Sentiment, & More

- **Pattern Recognition**
  - End rhyme detection
  - Internal rhyme analysis
  - Assonance identification
  - Consonance detection
  
- **Strength Scoring**
  - Perfect rhyme detection
  - Slant rhyme identification
  - Phonetic similarity scoring
  - Context-appropriate suggestions

- **Syllable Analysis**
- **Real-time Counting**
  - Automatic syllable detection
  - Support for complex words
  - Compound word handling
  - Custom dictionary support
  
### Export Options
  - PDF export
  - Text file export
  - Formatted copying
  - Share functionality
  

## 3. User Experience Features

### Responsive Design
- **Adaptive Layout**
  - Desktop optimization
  - Tablet compatibility
  - Dynamic resizing
  - Consistent spacing

### Theme and Styling
- **Dark Mode**
  - Eye-friendly color scheme
  - Gradient backgrounds
  - High contrast text
  - Professional aesthetics

- **Visual Feedback**
  - Hover effects
  - Click animations
  - Loading states
  - Success/error indicators

### Accessibility
- **Keyboard Navigation**
  - Tab indexing
  - Keyboard shortcuts
  - Focus indicators
  - Screen reader support

### Data Management
- **Auto-save**
  - Real-time content saving
  - Version history
  - Backup support
  - Recovery options

## 4. Technical Characteristics

### Frontend Architecture
- **React Components**
  - Functional components
  - TypeScript integration
  - Material-UI framework
  - Custom hooks

- **State Management**
  - Local component state
  - Context API usage
  - Efficient re-rendering
  - Performance optimization

### Backend Integration
- **API Endpoints**
  - RESTful architecture
  - WebSocket support
  - Error handling
  - Rate limiting

### Performance
- **Optimization**
  - Lazy loading
  - Code splitting
  - Caching strategies
  - Bundle optimization
