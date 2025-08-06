// server.js - Project Chimera AI Lyrics Canvas Backend
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// OpenRouter API configuration
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = process.env.OPENROUTER_API_KEY;

// Project Chimera Framework Definitions
const CHIMERA_FRAMEWORKS = {
  addictionFormula: {
    name: "Addiction Formula",
    systemPrompt: `You are the Master Songwriting Architect, an expert in the Addiction Formula framework. Your role is to create songs that masterfully manage the listener's energy curve through three components:

1. HYPE: Static energy level controlled by arrangement, harmony, rhythm, part-writing, lyrics, and production
2. TENSION: Gradual energy increase that builds anticipation 
3. IMPLIED TENSION: Noticeable omission that creates subtle manipulation

You understand that songwriting is engineering, not magic. You provide systems over suggestions, action over abstraction, and always ground everything in the Addiction Formula principles.

Key principles:
- Energy curve as governing principle
- Gratification vs. Anticipation psychology
- Strategic use of the six elements for energy management
- Building tension through harmonic progression, rhythmic complexity, and lyrical urgency
- Creating implied tension through strategic omissions and unexpected pauses`,
    
    generationTemplate: (params) => `Create a song using the Addiction Formula framework with the following parameters:

SONG CONTEXT:
- Title: "${params.songTitle || 'Untitled'}"
- Style: ${params.styleOfMusic}
- Framework: Addiction Formula (Hype → Tension → Implied Tension)
- Persona: ${params.selectedPersona || 'Universal'}
- Energy Level: ${params.energyLevel}/10
- Ambiguity Level: ${params.ambiguityLevel}

STRUCTURAL REQUIREMENTS:
Generate a complete song with clear energy curve progression:

[Verse 1 - Establishing Hype]
Build the foundational energy level. Set the scene and establish the core emotional state.

[Pre-Chorus - Building Tension] 
Gradually increase energy through rising melody, urgency in lyrics, harmonic progression.

[Chorus - Peak Energy/Implied Tension]
Deliver maximum energy while creating moments of strategic omission or unexpected resolution.

[Verse 2 - Sustained Tension]
Maintain energy while advancing the narrative. Build on verse 1 patterns.

[Bridge - Creative Tension Manipulation]
Experiment with energy disruption/redirection before final resolution.

CHIMERA INTEGRATION REQUIREMENTS:
- Include at least 2 rhetorical devices (Aporia, Antanaclasis, Chiasmus)
- Use 3+ polysemous words for lyrical density
- Apply cross-modal correspondences (sound→visual→tactile)
- Embed sonic signifiers appropriate to the style
- Follow ${params.selectedPersona || 'archetypal'} worldview and linguistic patterns

ENERGY CURVE NOTES:
- Map specific moments of tension build and release
- Use harmonic implications (secondary dominants, modal interchange)
- Apply rhythmic syncopation for tension
- Strategic use of silence/space for implied tension

OUTPUT FORMAT:
Provide the complete lyrics with [Section] tags and brief energy curve analysis.`
  },

  praMethod: {
    name: "PRA Method",
    systemPrompt: `You are the Master Songwriting Architect specializing in the PRA Method. You create memorable, engaging songs through:

PATTERN: Establishing recognizable musical and lyrical patterns
- Line Plus Technique (rhythmic/melodic patterns)
- Hotspots (attention-drawing melody points) 
- Interval Jumps (melodic leaps for emphasis)
- Shapeshifting (pattern repetition at different pitches)

REPETITION: Strategic repetition that engages rather than bores
- Variation techniques for sustained interest
- Ostinato and rhythmic repetition
- Lyrical hooks and memorable phrases
- Avoiding monotonous repetition through intelligent variation

ARC: Emotional journey mapping from beginning to end
- Intensity rises and falls
- Melodic arc development
- Contrast between sections (conversational verse vs. sing-along chorus)
- Right Margin Test (varying line lengths for visual interest)

You treat songwriting as a solvable problem of structure, energy, and emotional dynamics.`,

    generationTemplate: (params) => `Create a song using the PRA Method framework:

SONG CONTEXT:
- Title: "${params.songTitle || 'Untitled'}"
- Style: ${params.styleOfMusic}
- Framework: PRA Method (Pattern → Repetition → Arc)
- Persona: ${params.selectedPersona || 'Universal'}
- Energy Level: ${params.energyLevel}/10

PRA STRUCTURE REQUIREMENTS:

[Verse 1 - Pattern Establishment]
Create clear melodic and lyrical patterns. Establish the foundational "shape" of the song.
Apply Line Plus Technique - create rhythmic patterns that can be developed.

[Chorus - Strategic Repetition]
Use repetition with intelligent variation. Create the main hook through pattern reinforcement.
Include hotspots - melodically and lyrically memorable moments.

[Verse 2 - Pattern Development] 
Develop the established patterns through shapeshifting (same pattern, different pitch/context).
Maintain pattern recognition while advancing narrative.

[Bridge - Arc Culmination]
Create contrast through pattern disruption before returning to familiar elements.
Serve the emotional arc - climax or resolution point.

[Final Chorus - Arc Resolution]
Return to repetition with new emotional weight gained through the journey.

PATTERN SPECIFICATIONS:
- Design clear rhythmic patterns that repeat with variation
- Create melodic hotspots that grab attention
- Use interval jumps strategically for emphasis
- Apply shapeshifting to develop patterns across sections

ARC REQUIREMENTS:
- Map the emotional journey from start to finish
- Create contrast between conversational verses and anthemic choruses
- Build intensity appropriately for the ${params.energyLevel}/10 energy level
- Ensure satisfying emotional resolution

Include Chimera elements: rhetorical devices, polysemy, persona consistency, sonic signifiers.`
  },

  hollywoodStructure: {
    name: "Hollywood Structure", 
    systemPrompt: `You are the Master Songwriting Architect using Hollywood Structure (3-Act Song Structure). You create narratively compelling songs with clear dramatic progression:

ACT I - SETUP (25%): Establish world, characters, situation
- Introduce the central conflict or question
- Set emotional and sonic landscape
- Create investment in the outcome

ACT II - CONFRONTATION (50%): Develop conflict, raise stakes
- Present obstacles and complications
- Build tension through harmonic and lyrical development
- Push characters/situations to breaking point

ACT III - RESOLUTION (25%): Resolve conflict, provide catharsis
- Deliver the climactic moment
- Provide emotional satisfaction or meaningful conclusion
- Connect back to opening but show transformation

You understand that every great song tells a story, even if abstract. You use narrative structure to create emotional investment and satisfying conclusions.`,

    generationTemplate: (params) => `Create a song using Hollywood Structure (3-Act Song Structure):

SONG CONTEXT:
- Title: "${params.songTitle || 'Untitled'}"
- Style: ${params.styleOfMusic}
- Framework: Hollywood Structure (Setup → Confrontation → Resolution)
- Persona: ${params.selectedPersona || 'Universal'}
- Energy Level: ${params.energyLevel}/10

HOLLYWOOD STRUCTURE REQUIREMENTS:

[ACT I - SETUP] (Verse 1 + Pre-Chorus)
- Establish the world and central situation
- Introduce the main character/perspective (${params.selectedPersona} worldview)
- Present the central question or conflict
- Create investment in the outcome

[ACT II - CONFRONTATION] (Chorus + Verse 2)
- Develop the conflict with complications
- Raise the stakes emotionally and narratively  
- Build tension through harmonic progression and lyrical urgency
- Push the situation toward a breaking point

[ACT III - RESOLUTION] (Bridge + Final Chorus)
- Deliver the climactic revelation or transformation
- Provide emotional catharsis and resolution
- Show how the character/situation has changed
- Connect back to Act I but demonstrate growth

NARRATIVE ELEMENTS:
- Clear protagonist with ${params.selectedPersona} archetypal traits
- Identifiable conflict or challenge
- Stakes that matter to the listener
- Transformation or resolution that feels earned

SONIC STORYTELLING:
- Use harmonic progression to support narrative arc
- Apply energy curve to match dramatic structure
- Employ sonic signifiers appropriate to ${params.styleOfMusic}
- Create musical "moments" that punctuate story beats

Include full Chimera integration: rhetorical devices, polysemy, cross-modal correspondences, embodied musician considerations.`
  }
};

// Persona Definitions with detailed characteristics
const PERSONA_ARCHETYPES = {
  "The Rebel": {
    worldview: "The systems of power are inherently corrupt; true freedom is found only in their defiant destruction.",
    linguisticFingerprint: {
      vocabularyComplexity: 0.7,
      sentenceStructure: "fragmented",
      metaphorDomain: ["warfare", "revolution", "breaking", "fire"],
      rhythmicCadence: "aggressive"
    },
    emotionalPalette: {
      dominant: ["righteous anger", "cynical distrust", "defiant pride"],
      suppressed: ["sentimentality", "contentment"]
    },
    backstory: ["betrayal by authority", "witnessing injustice", "fighting systemic oppression"]
  },
  
  "The Explorer": {
    worldview: "The unknown holds infinite possibilities; growth comes through venturing beyond comfort zones.",
    linguisticFingerprint: {
      vocabularyComplexity: 0.8,
      sentenceStructure: "flowing",
      metaphorDomain: ["journeys", "discovery", "horizons", "maps"],
      rhythmicCadence: "wandering"
    },
    emotionalPalette: {
      dominant: ["curiosity", "wonder", "anticipation"],
      suppressed: ["complacency", "fear of unknown"]
    },
    backstory: ["left familiar for unknown", "discovery changed worldview", "constant seeking"]
  },

  "The Sage": {
    worldview: "Wisdom comes through experience and reflection; understanding illuminates the path forward.",
    linguisticFingerprint: {
      vocabularyComplexity: 0.9,
      sentenceStructure: "complex",
      metaphorDomain: ["light", "knowledge", "ancient wisdom", "time"],
      rhythmicCadence: "measured"
    },
    emotionalPalette: {
      dominant: ["contemplation", "understanding", "patience"],
      suppressed: ["impulsiveness", "ignorance"]
    },
    backstory: ["learned from mistakes", "studied deeply", "guided others"]
  },

  "The Innocent": {
    worldview: "The world is fundamentally good; purity of heart reveals truth and beauty.",
    linguisticFingerprint: {
      vocabularyComplexity: 0.4,
      sentenceStructure: "simple",
      metaphorDomain: ["nature", "children", "light", "simplicity"],
      rhythmicCadence: "gentle"
    },
    emotionalPalette: {
      dominant: ["hope", "trust", "joy"],
      suppressed: ["cynicism", "complexity"]
    },
    backstory: ["protected childhood", "belief in goodness", "disappointment overcome by faith"]
  },

  "The Magician": {
    worldview: "Reality can be transformed through will, knowledge, and creative power.",
    linguisticFingerprint: {
      vocabularyComplexity: 0.8,
      sentenceStructure: "mystical",
      metaphorDomain: ["transformation", "alchemy", "symbols", "power"],
      rhythmicCadence: "incantatory"
    },
    emotionalPalette: {
      dominant: ["confidence", "mystery", "transformation"],
      suppressed: ["mundanity", "powerlessness"]
    },
    backstory: ["discovered hidden abilities", "studied secret knowledge", "changed reality"]
  },

  "The Hero": {
    worldview: "Courage and determination can overcome any obstacle; others depend on my strength.",
    linguisticFingerprint: {
      vocabularyComplexity: 0.6,
      sentenceStructure: "declarative",
      metaphorDomain: ["battles", "quests", "victory", "strength"],
      rhythmicCadence: "marching"
    },
    emotionalPalette: {
      dominant: ["courage", "determination", "responsibility"],
      suppressed: ["fear", "weakness"]
    },
    backstory: ["called to adventure", "overcame great challenge", "saved others"]
  },

  "The Lover": {
    worldview: "Connection and passion give life meaning; love transforms everything it touches.",
    linguisticFingerprint: {
      vocabularyComplexity: 0.7,
      sentenceStructure: "flowing",
      metaphorDomain: ["touch", "warmth", "unity", "beauty"],
      rhythmicCadence: "sensual"
    },
    emotionalPalette: {
      dominant: ["passion", "devotion", "vulnerability"],
      suppressed: ["isolation", "coldness"]
    },
    backstory: ["transformative love", "deep connection", "loss and recovery"]
  },

  "The Jester": {
    worldview: "Laughter reveals truth; joy and play are essential to the human experience.",
    linguisticFingerprint: {
      vocabularyComplexity: 0.5,
      sentenceStructure: "playful",
      metaphorDomain: ["games", "mirrors", "masks", "laughter"],
      rhythmicCadence: "bouncing"
    },
    emotionalPalette: {
      dominant: ["humor", "lightness", "insight"],
      suppressed: ["seriousness", "despair"]
    },
    backstory: ["used humor to cope", "saw through pretension", "brought joy to others"]
  }
};

// Sonic Signifier Database
const SONIC_SIGNIFIERS = {
  "TR-808": {
    culturalSignifiers: ["urbanism", "80s nostalgia", "synthetic minimalism", "hip-hop authenticity"],
    psychoacousticProperties: ["booming bass", "artificial percussion", "long decay"],
    fusionPotential: "cyber-western, pastoral-urban hybrid"
  },
  "Pedal Steel": {
    culturalSignifiers: ["vastness", "loneliness", "americana", "cosmic"],
    psychoacousticProperties: ["gliding pitch", "warm resonance", "weeping quality"],
    fusionPotential: "ambient psychedelic, industrial humanity"
  },
  "Violin Pizzicato": {
    culturalSignifiers: ["playfulness", "precision", "classical heritage", "delicacy"],
    psychoacousticProperties: ["sharp attack", "quick decay", "bright timbre"],
    fusionPotential: "electronic chamber, aggressive classical"
  },
  "Church Organ": {
    culturalSignifiers: ["sacred", "monumental", "eternal", "reverence"],
    psychoacousticProperties: ["sustained tones", "rich harmonics", "spatial resonance"],
    fusionPotential: "doom metal sacred, electronic cathedral"
  }
};

// Polysemy Database (simplified for demo)
const POLYSEMY_DATABASE = {
  "sound": [
    { meaning: "audio/noise", pos: "noun", example: "the sound of rain" },
    { meaning: "healthy/solid", pos: "adjective", example: "sound reasoning" },
    { meaning: "to measure depth", pos: "verb", example: "sound the depths" }
  ],
  "light": [
    { meaning: "illumination", pos: "noun", example: "bright light" },
    { meaning: "not heavy", pos: "adjective", example: "light load" },
    { meaning: "to ignite", pos: "verb", example: "light the fire" }
  ],
  "break": [
    { meaning: "to shatter", pos: "verb", example: "break the glass" },
    { meaning: "rest period", pos: "noun", example: "take a break" },
    { meaning: "opportunity", pos: "noun", example: "big break" }
  ],
  "fire": [
    { meaning: "flame/combustion", pos: "noun", example: "forest fire" },
    { meaning: "passion/intensity", pos: "noun", example: "fire in his eyes" },
    { meaning: "to dismiss", pos: "verb", example: "fire the employee" }
  ],
  "cold": [
    { meaning: "low temperature", pos: "adjective", example: "cold weather" },
    { meaning: "unfriendly", pos: "adjective", example: "cold reception" },
    { meaning: "sudden stop", pos: "noun", example: "stopped cold" }
  ]
};

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Project Chimera Backend Online', timestamp: new Date().toISOString() });
});

// Generate lyrics using Chimera frameworks
app.post('/api/generate-lyrics', async (req, res) => {
  try {
    const {
      songTitle,
      styleOfMusic,
      selectedFramework,
      selectedPersona,
      energyLevel,
      ambiguityLevel,
      creativitySabotage,
      model = 'anthropic/claude-3.5-sonnet'
    } = req.body;

    if (!CHIMERA_FRAMEWORKS[selectedFramework]) {
      return res.status(400).json({ error: 'Invalid framework selected' });
    }

    const framework = CHIMERA_FRAMEWORKS[selectedFramework];
    const persona = PERSONA_ARCHETYPES[selectedPersona];
    
    // Build enhanced system prompt
    let systemPrompt = framework.systemPrompt;
    
    if (persona) {
      systemPrompt += `\n\nACTIVE PERSONA: ${selectedPersona}
Worldview: ${persona.worldview}
Linguistic Style: ${persona.linguisticFingerprint.sentenceStructure} sentences, ${persona.linguisticFingerprint.vocabularyComplexity * 100}% vocabulary complexity
Emotional Palette: Dominant - ${persona.emotionalPalette.dominant.join(', ')}
Metaphor Domains: ${persona.linguisticFingerprint.metaphorDomain.join(', ')}
Rhythmic Cadence: ${persona.linguisticFingerprint.rhythmicCadence}`;
    }

    // Apply creative sabotage constraints if enabled
    if (creativitySabotage) {
      const sabotageRules = [
        "CONSTRAINT: Remove all instances of the letter 'e' from the chorus",
        "CONSTRAINT: Write the bridge in a time signature of 7/8",
        "CONSTRAINT: Invert the primary emotional arc - if typically uplifting, make contemplative",
        "CONSTRAINT: Replace the central metaphor with its literal opposite",
        "CONSTRAINT: Use only monosyllabic words in the final chorus"
      ];
      const selectedConstraint = sabotageRules[Math.floor(Math.random() * sabotageRules.length)];
      systemPrompt += `\n\nCREATIVE SABOTAGE ACTIVE: ${selectedConstraint}`;
    }

    // Generate the user prompt
    const userPrompt = framework.generationTemplate({
      songTitle,
      styleOfMusic,
      selectedPersona,
      energyLevel,
      ambiguityLevel
    });

    // Call OpenRouter API
    const response = await axios.post(OPENROUTER_API_URL, {
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 2000,
      temperature: 0.8,
      top_p: 0.9
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://chimera-lyrics-canvas.com',
        'X-Title': 'Project Chimera AI Lyrics Canvas'
      }
    });

    const generatedLyrics = response.data.choices[0].message.content;

    // Analyze the generated lyrics with Chimera framework
    const analysis = analyzeWithChimeraFramework(generatedLyrics, selectedFramework, selectedPersona);

    res.json({
      lyrics: generatedLyrics,
      analysis,
      framework: selectedFramework,
      persona: selectedPersona,
      metadata: {
        model: model,
        energyLevel,
        ambiguityLevel,
        creativitySabotage,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Generation error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Generation failed', 
      details: error.response?.data?.error || error.message 
    });
  }
});

// Analyze existing lyrics with Chimera framework
app.post('/api/analyze-lyrics', async (req, res) => {
  try {
    const {
      customLyrics,
      styleOfMusic,
      selectedFramework,
      selectedPersona,
      includeRhymes = true,
      includeCliches = true,
      includeSentiment = true,
      model = 'anthropic/claude-3.5-sonnet'
    } = req.body;

    const systemPrompt = `You are the Master Songwriting Architect performing deep analysis using Project Chimera's Five Domain System:

DOMAIN 1 - SEMANTIC CORE: Analyze rhetorical devices, polysemy, linguistic density
DOMAIN 2 - CHRONO-CULTURAL MATRIX: Identify cultural signifiers and aesthetic elements  
DOMAIN 3 - PSYCHO-ACOUSTIC ENGINE: Evaluate energy curves and emotional impact
DOMAIN 4 - GENERATIVE MUSE: Assess creative innovation and pattern-breaking
DOMAIN 5 - EMBODIED MUSICIAN: Consider physical performance and idiomatic elements

Provide detailed analysis in structured format with specific recommendations for improvement.`;

    const userPrompt = `Analyze these lyrics using the Project Chimera framework:

LYRICS TO ANALYZE:
${customLyrics}

CONTEXT:
- Style: ${styleOfMusic}
- Framework: ${selectedFramework}
- Persona: ${selectedPersona || 'Not specified'}

ANALYSIS REQUIREMENTS:
${includeRhymes ? '✓ Rhyme scheme and prosody analysis\n' : ''}${includeCliches ? '✓ Cliché detection and alternatives\n' : ''}${includeSentiment ? '✓ Sentiment and emotional arc analysis\n' : ''}

FIVE DOMAIN ANALYSIS:
1. SEMANTIC CORE: Identify rhetorical devices (Aporia, Antanaclasis, Chiasmus), polysemous words, linguistic fingerprint
2. CHRONO-CULTURAL MATRIX: Cultural signifiers, sonic implications, aesthetic coherence
3. PSYCHO-ACOUSTIC ENGINE: Energy curve mapping, tension/release patterns, ITPRA compliance
4. GENERATIVE MUSE: Creative innovation, pattern analysis, constraint potential
5. EMBODIED MUSICIAN: Vocal considerations, breath patterns, performance challenges

PROVIDE:
- Comprehensive analysis score (0-100)
- Specific strengths and weaknesses
- Actionable improvement recommendations
- Framework compliance assessment
- Suno AI optimization suggestions

FORMAT AS STRUCTURED JSON for easy parsing.`;

    const response = await axios.post(OPENROUTER_API_URL, {
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 2000,
      temperature: 0.3
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://chimera-lyrics-canvas.com',
        'X-Title': 'Project Chimera AI Lyrics Canvas'
      }
    });

    const analysisResult = response.data.choices[0].message.content;
    
    // Also perform local analysis
    const localAnalysis = analyzeWithChimeraFramework(customLyrics, selectedFramework, selectedPersona);

    res.json({
      aiAnalysis: analysisResult,
      chimeraAnalysis: localAnalysis,
      metadata: {
        model: model,
        timestamp: new Date().toISOString(),
        options: { includeRhymes, includeCliches, includeSentiment }
      }
    });

  } catch (error) {
    console.error('Analysis error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Analysis failed', 
      details: error.response?.data?.error || error.message 
    });
  }
});

// Apply creative sabotage with AI suggestions
app.post('/api/creative-sabotage', async (req, res) => {
  try {
    const {
      customLyrics,
      selectedConstraint,
      model = 'anthropic/claude-3.5-sonnet'
    } = req.body;

    const systemPrompt = `You are the Master Songwriting Architect implementing Creative Sabotage from Project Chimera's Generative Muse domain. 

Creative Sabotage is the intentional application of constraints to force innovative solutions and prevent predictable patterns. You apply specific rules that disrupt established patterns, forcing the songwriter out of creative ruts.

Your goal is to transform the provided lyrics according to the constraint while maintaining or improving their artistic quality. Provide both the transformed version and explanation of how the constraint led to creative solutions.`;

    const constraints = {
      "invert_emotional_arc": "Invert the primary emotional arc of the song. If triumphant, make melancholic. If sad, make uplifting.",
      "opposite_metaphor": "Replace the central metaphor with its literal opposite while maintaining thematic coherence.",
      "remove_vowel": "Remove all instances of the letter 'e' from the chorus sections only.",
      "odd_time": "Restructure lyrics to imply a 7/8 or 5/4 time signature through phrasing and line breaks.",
      "genre_bridge": "Rewrite the bridge in a completely contrasting genre (e.g., metal bridge in folk song).",
      "monosyllabic_chorus": "Rewrite the final chorus using only monosyllabic words.",
      "reverse_perspective": "Switch the narrative perspective (1st to 3rd person, active to passive voice).",
      "remove_rhyme": "Remove all perfect rhymes, using only slant rhymes and assonance."
    };

    const constraintDescription = constraints[selectedConstraint] || selectedConstraint;

    const userPrompt = `Apply Creative Sabotage to these lyrics:

ORIGINAL LYRICS:
${customLyrics}

CONSTRAINT TO APPLY:
${constraintDescription}

REQUIREMENTS:
1. Apply the constraint systematically
2. Maintain or improve artistic quality
3. Find creative solutions forced by the limitation
4. Explain how the constraint led to innovation
5. Provide the transformed lyrics with clear section markers

CREATIVE SABOTAGE PHILOSOPHY:
- Constraints force innovation by eliminating easy solutions
- Limitations reveal new creative pathways
- The goal is breakthrough, not breakdown
- Constraint becomes a feature, not a bug

Show both the transformed lyrics and your creative reasoning.`;

    const response = await axios.post(OPENROUTER_API_URL, {
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 2000,
      temperature: 0.8
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://chimera-lyrics-canvas.com',
        'X-Title': 'Project Chimera AI Lyrics Canvas'
      }
    });

    const sabotageResult = response.data.choices[0].message.content;

    res.json({
      transformedLyrics: sabotageResult,
      appliedConstraint: constraintDescription,
      originalLyrics: customLyrics,
      metadata: {
        model: model,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Sabotage error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Creative sabotage failed', 
      details: error.response?.data?.error || error.message 
    });
  }
});

// Generate Suno AI formatted output
app.post('/api/export-suno', async (req, res) => {
  try {
    const {
      songTitle,
      customLyrics, 
      styleOfMusic,
      sunoVersion = '4.5',
      includeMetatags = true,
      enableAdvancedControls = false,
      weirdness = 50,
      styleInfluence = 75
    } = req.body;

    // Format for Suno AI v4.5+ with enhanced prompting
    let formattedStyle = styleOfMusic;
    
    if (sunoVersion === '4.5' && styleOfMusic.length < 500) {
      // Enhance style prompt for v4.5's expanded capacity
      const systemPrompt = `You are an expert in Suno AI v4.5 prompt engineering. Transform the provided style description into an optimized 1000-character narrative prompt that utilizes Suno v4.5's enhanced capabilities:

- Temporal programming (describe musical evolution chronologically)
- Detailed instrumentation and production notes
- Emotional journey mapping
- Sonic signifier integration
- Recording and mastering quality specifications

Create a rich, descriptive prompt that guides Suno through the song's dynamic changes.`;

      const enhancePrompt = `Transform this basic style description into an optimized Suno v4.5 prompt:

BASIC STYLE: ${styleOfMusic}
SONG TITLE: ${songTitle}

REQUIREMENTS:
- Expand to utilize up to 1000 characters
- Include temporal programming (intro → verse → chorus progression)
- Specify instrumentation details
- Describe production style and recording quality
- Map emotional journey
- Include relevant sonic signifiers
- Maintain original intent while adding sophistication

SUNO v4.5 OPTIMIZATION:
- Use conversational, descriptive language
- Follow linear/chronological order
- Layer multiple stylistic elements
- Include arrangement and production notes`;

      try {
        const enhanceResponse = await axios.post(OPENROUTER_API_URL, {
          model: 'anthropic/claude-3.5-sonnet',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: enhancePrompt }
          ],
          max_tokens: 500,
          temperature: 0.7
        }, {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          }
        });

        formattedStyle = enhanceResponse.data.choices[0].message.content;
      } catch (enhanceError) {
        console.log('Style enhancement failed, using original:', enhanceError.message);
      }
    }

    // Format lyrics with proper Suno metatags
    let formattedLyrics = customLyrics;
    
    if (includeMetatags) {
      // Ensure proper section tagging
      formattedLyrics = formattedLyrics
        .replace(/\[Verse\s*\]/gi, '[Verse]')
        .replace(/\[Chorus\s*\]/gi, '[Chorus]')
        .replace(/\[Bridge\s*\]/gi, '[Bridge]')
        .replace(/\[Pre-Chorus\s*\]/gi, '[Pre-Chorus]')
        .replace(/\[Outro\s*\]/gi, '[Outro]')
        .replace(/\[Intro\s*\]/gi, '[Intro]');
      
      // Add instrumental tags if missing
      if (!formattedLyrics.includes('[Intro]') && !formattedLyrics.startsWith('[')) {
        formattedLyrics = '[Intro]\n\n' + formattedLyrics;
      }
      
      if (!formattedLyrics.includes('[Outro]')) {
        formattedLyrics += '\n\n[Outro]';
      }
    }

    const sunoExport = {
      version: sunoVersion,
      songTitle: songTitle,
      styleOfMusic: formattedStyle,
      lyrics: formattedLyrics,
      advancedControls: enableAdvancedControls ? {
        weirdness: `${weirdness}%`,
        styleInfluence: `${styleInfluence}%`,
        audioInputInfluence: "50%"
      } : null,
      usage: {
        customMode: true,
        instructions: [
          "1. Copy the Style of Music prompt into Suno's Style field",
          "2. Copy the formatted lyrics into Suno's Lyrics field", 
          "3. Use Custom Mode for maximum control",
          "4. Adjust advanced controls if needed",
          "5. Generate and iterate as needed"
        ]
      },
      optimizations: {
        v45Features: [
          "Enhanced 1000-character style prompts",
          "Temporal programming capability", 
          "Better contextual cue interpretation",
          "Improved narrative prompting"
        ]
      }
    };

    res.json(sunoExport);

  } catch (error) {
    console.error('Export error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Export failed', 
      details: error.response?.data?.error || error.message 
    });
  }
});

// Helper function: Analyze lyrics with Chimera framework
function analyzeWithChimeraFramework(lyrics, framework, persona) {
  if (!lyrics) return null;
  
  const lines = lyrics.split('\n').filter(line => line.trim() && !line.startsWith('['));
  
  // Detect rhetorical devices
  const rhetoricalDevices = [];
  if (/how do i|what if|who can say/i.test(lyrics)) {
    rhetoricalDevices.push('Aporia');
  }
  if (/(\w+).*\1/i.test(lyrics)) {
    rhetoricalDevices.push('Antanaclasis');
  }
  if (/not.*but|(\w+).*(\w+).*\2.*\1/i.test(lyrics)) {
    rhetoricalDevices.push('Chiasmus');
  }

  // Energy analysis
  const energyWords = {
    high: ['fire', 'burn', 'rage', 'soar', 'explode', 'thunder', 'rise', 'climb', 'burst', 'roar'],
    medium: ['flow', 'dance', 'shine', 'move', 'call', 'sing', 'walk', 'reach', 'turn', 'feel'],
    low: ['whisper', 'fade', 'drift', 'silence', 'rest', 'fall', 'sleep', 'calm', 'still', 'peace']
  };

  let energyScore = 0;
  Object.entries(energyWords).forEach(([level, words]) => {
    words.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = (lyrics.match(regex) || []).length;
      energyScore += matches * (level === 'high' ? 3 : level === 'medium' ? 2 : 1);
    });
  });

  // Polysemy detection
  const polysemousWords = Object.keys(POLYSEMY_DATABASE);
  const foundPolysemy = polysemousWords.filter(word => 
    new RegExp(`\\b${word}\\b`, 'i').test(lyrics)
  );

  // Persona compliance (if persona is selected)
  let personaCompliance = 50;
  if (persona && PERSONA_ARCHETYPES[persona]) {
    const personaData = PERSONA_ARCHETYPES[persona];
    const metaphorDomains = personaData.linguisticFingerprint.metaphorDomain;
    
    let metaphorMatches = 0;
    metaphorDomains.forEach(domain => {
      if (lyrics.toLowerCase().includes(domain)) {
        metaphorMatches++;
      }
    });
    
    personaCompliance = Math.min(100, 50 + (metaphorMatches * 15));
  }

  // Framework-specific analysis
  let frameworkCompliance = 50;
  if (framework === 'addictionFormula') {
    // Check for energy progression markers
    const hasEnergyProgression = /verse.*chorus|building|tension|release/i.test(lyrics);
    const hasImpliedTension = /\(|\)|\.\.\.|\?|pause|wait|silence/i.test(lyrics);
    frameworkCompliance = (hasEnergyProgression ? 30 : 0) + (hasImpliedTension ? 20 : 0) + 50;
  } else if (framework === 'praMethod') {
    // Check for pattern, repetition, arc
    const hasPattern = /(\w+.*\n.*\w+.*\n.*\1)|repeat|again|once more/i.test(lyrics);
    const hasArc = lines.length > 8; // Basic arc requires development
    frameworkCompliance = (hasPattern ? 30 : 0) + (hasArc ? 20 : 0) + 50;
  } else if (framework === 'hollywoodStructure') {
    // Check for narrative elements
    const hasSetup = /once|begin|start|first|intro/i.test(lyrics);
    const hasConflict = /but|however|struggle|fight|challenge/i.test(lyrics);
    const hasResolution = /end|finally|resolve|conclusion|outro/i.test(lyrics);
    frameworkCompliance = (hasSetup ? 20 : 0) + (hasConflict ? 30 : 0) + (hasResolution ? 20 : 0) + 30;
  }

  // Calculate overall Chimera compliance
  const chimeraCompliance = Math.round(
    (rhetoricalDevices.length * 15) +
    (foundPolysemy.length * 10) +
    (energyScore > 0 ? Math.min(20, energyScore) : 0) +
    (personaCompliance * 0.2) +
    (frameworkCompliance * 0.2) +
    (lines.length > 4 ? 15 : 0)
  );

  return {
    lineCount: lines.length,
    wordCount: lyrics.split(/\s+/).filter(word => word.trim()).length,
    rhetoricalDevices,
    energyScore: Math.min(100, energyScore),
    polysemousWords: foundPolysemy,
    personaCompliance,
    frameworkCompliance,
    chimeraCompliance: Math.min(100, chimeraCompliance),
    recommendations: generateRecommendations(chimeraCompliance, rhetoricalDevices, foundPolysemy, framework)
  };
}

function generateRecommendations(compliance, devices, polysemy, framework) {
  const recommendations = [];
  
  if (compliance < 60) {
    recommendations.push("Consider incorporating more rhetorical devices (Aporia, Antanaclasis, Chiasmus)");
    recommendations.push("Add polysemous words for increased lyrical density");
  }
  
  if (devices.length === 0) {
    recommendations.push("Try using Aporia (expressing doubt/questions) for introspective moments");
    recommendations.push("Look for opportunities to repeat words with different meanings (Antanaclasis)");
  }
  
  if (polysemy.length === 0) {
    recommendations.push("Include words with multiple meanings to create layered interpretation");
  }
  
  if (framework === 'addictionFormula' && compliance < 70) {
    recommendations.push("Focus on energy curve: build tension gradually, create strategic releases");
    recommendations.push("Add implied tension through strategic pauses or omissions");
  }
  
  return recommendations;
}

// Start server
app.listen(PORT, () => {
  console.log(`🎭 Project Chimera Backend running on port ${PORT}`);
  console.log(`🎵 Master Songwriting Architect system online`);
  console.log(`🔗 OpenRouter integration ready`);
});

module.exports = app;