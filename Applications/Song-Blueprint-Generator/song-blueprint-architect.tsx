import { useState } from 'react';

const SongBlueprintArchitect = () => {
  const [lyrics, setLyrics] = useState('');
  const [guidanceLevel, setGuidanceLevel] = useState('medium');
  const [precision, setPrecision] = useState('section');
  const [genre, setGenre] = useState('pop');
  const [energyStyle, setEnergyStyle] = useState('hollywood');
  const [focusArea, setFocusArea] = useState('structure');
  const [includePrompts, setIncludePrompts] = useState(true);
  const [includeMetatags, setIncludeMetatags] = useState(true);
  const [anonymizeOutput, setAnonymizeOutput] = useState(true);
  const [blueprint, setBlueprint] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const guidanceLevels = {
    low: 'General direction and overall energy curve',
    medium: 'Detailed section-by-section guidance with specific techniques',
    high: 'Line-by-line analysis with precise implementation instructions'
  };

  const precisionLevels = {
    song: 'Song-level guidance (overall structure and energy)',
    section: 'Section-level guidance (verse, chorus, bridge functions)',
    line: 'Line-level guidance (specific lyrical techniques and word choices)'
  };

  const genreOptions = {
    pop: 'Pop/Commercial',
    rock: 'Rock/Alternative',
    country: 'Country/Folk',
    hiphop: 'Hip-Hop/Rap',
    electronic: 'Electronic/EDM',
    indie: 'Indie/Singer-Songwriter',
    rb: 'R&B/Soul',
    jazz: 'Jazz/Blues'
  };

  const energyStyles = {
    hollywood: 'Hollywood Structure (3-Act)',
    linear: 'Linear Build (Gradual Rise)',
    roller: 'Roller Coaster (Multiple Peaks)',
    plateau: 'Plateau (Sustained Energy)',
    custom: 'Custom Energy Curve'
  };

  const focusAreas = {
    structure: 'Song Structure & Energy',
    lyrics: 'Lyrical Content & Flow',
    hooks: 'Hooks & Memorability',
    emotion: 'Emotional Arc & Impact',
    commercial: 'Commercial Appeal',
    artistic: 'Artistic Expression'
  };

  const analyzeAndGenerateBlueprint = async () => {
    if (!lyrics.trim()) return;
    
    setIsGenerating(true);
    
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          messages: [
            {
              role: "user",
              content: `You are the Master Songwriting Architect. Analyze these lyrics and create a comprehensive blueprint based on the Suno AI Knowledge Base frameworks.

LYRICS TO ANALYZE:
${lyrics}

CONFIGURATION:
- Guidance Level: ${guidanceLevel} (${guidanceLevels[guidanceLevel]})
- Precision Level: ${precision} (${precisionLevels[precision]})
- Target Genre: ${genreOptions[genre]}
- Energy Structure: ${energyStyles[energyStyle]}
- Focus Area: ${focusAreas[focusArea]}
- Include Suno Prompts: ${includePrompts}
- Include Metatags: ${includeMetatags}
- Anonymize Output: ${anonymizeOutput}

Apply the following frameworks from your knowledge base:
1. The Addiction Formula (energy curves, gratification/anticipation)
2. Hollywood Structure (3-act progression)
3. PRA Method (Pattern, Repetition, Arc)
4. Song Blueprinting principles
5. Suno AI v4.5 implementation techniques

CRITICAL ANONYMIZATION REQUIREMENT:
${anonymizeOutput ? `
The final blueprint output MUST be completely anonymized:
- Remove ALL original lyrics from the blueprint sections
- Remove any artist names, song titles, or identifying information
- Use generic placeholders like "Original content here" or describe lyrical concepts without quoting
- The blueprint should be usable by any songwriter without revealing the source material
- Focus on structural, emotional, and technical guidance rather than specific content
` : ''}

REQUIRED OUTPUT FORMAT:
Return a JSON object with this exact structure:

{
  "analysis": {
    "inputSummary": "brief description of input material for processing reference",
    "currentStructure": "detected structure",
    "energyCurve": "energy progression analysis",
    "emotionalArc": "emotional journey description",
    "strengths": ["identified strengths"],
    "improvements": ["improvement opportunities"]
  },
  "blueprint": {
    "theme": "core thematic concept (anonymized)",
    "targetEmotion": "primary emotional goal",
    "structure": "recommended song structure for ${genreOptions[genre]}",
    "energyPattern": "specific ${energyStyles[energyStyle]} implementation",
    "sections": [
      {
        "name": "section name",
        "function": "specific purpose in song arc",
        ${anonymizeOutput ? '"guidance": "structural and emotional guidance without original content",' : '"currentLyrics": "existing lyrics for reference",\n        "guidance": "specific guidance based on selected level",'}
        "techniques": ["recommended techniques for ${focusAreas[focusArea]}"],
        "energyLevel": "low/medium/high",
        ${includePrompts ? '"sunoDirectives": "Suno AI prompting suggestions",' : ''}
        "keyElements": ["essential elements for this section"]
      }
    ],
    "markdownBlueprint": "Complete markdown-formatted blueprint ready for export"
  },
  ${includePrompts || includeMetatags ? `"implementation": {
    ${includePrompts ? '"sunoPrompt": "complete style prompt for Suno AI",' : ''}
    ${includeMetatags ? '"metatags": "recommended structural metatags",' : ''}
    "keyTechniques": ["priority techniques"],
    "nextSteps": ["actionable steps"]
  },` : ''}
  "exportReady": "Complete markdown blueprint without any original content references"
}

BE PRECISE AND GROUNDED IN THE FRAMEWORKS. DO NOT OUTPUT ANYTHING OTHER THAN VALID JSON.`
            }
          ]
        })
      });

      const data = await response.json();
      let responseText = data.content[0].text;
      
      // Clean any markdown formatting
      responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      
      const blueprintData = JSON.parse(responseText);
      setBlueprint(blueprintData);
      
    } catch (error) {
      console.error("Error generating blueprint:", error);
      alert("Error generating blueprint. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const getSectionBackground = (energyLevel) => {
    switch(energyLevel) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-yellow-50 border-yellow-200';
      case 'low': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Song Blueprint Architect</h1>
        <p className="text-gray-600 text-lg">Master Songwriting System powered by Suno AI Knowledge Base</p>
      </div>

      {/* Input Section */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Input Your Lyrics</h2>
        
        <textarea
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          placeholder="Paste your song lyrics here... Include any existing structure tags like [Verse], [Chorus], [Bridge]"
          className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Guidance Level</label>
            <select
              value={guidanceLevel}
              onChange={(e) => setGuidanceLevel(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low - General Direction</option>
              <option value="medium">Medium - Detailed Section Analysis</option>
              <option value="high">High - Line-by-Line Precision</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">{guidanceLevels[guidanceLevel]}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Precision Level</label>
            <select
              value={precision}
              onChange={(e) => setPrecision(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="song">Song-Level</option>
              <option value="section">Section-Level</option>
              <option value="line">Line-Level</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">{precisionLevels[precision]}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Genre</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(genreOptions).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Energy Structure</label>
            <select
              value={energyStyle}
              onChange={(e) => setEnergyStyle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(energyStyles).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Focus Area</label>
            <select
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(focusAreas).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mt-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={includePrompts}
              onChange={(e) => setIncludePrompts(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Include Suno Prompts</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={includeMetatags}
              onChange={(e) => setIncludeMetatags(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Include Metatags</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={anonymizeOutput}
              onChange={(e) => setAnonymizeOutput(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Anonymize Blueprint</span>
          </label>
        </div>

        <button
          onClick={analyzeAndGenerateBlueprint}
          disabled={!lyrics.trim() || isGenerating}
          className="mt-4 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isGenerating ? 'Generating Blueprint...' : 'Generate Song Blueprint'}
        </button>
      </div>

      {/* Blueprint Results */}
      {blueprint && (
        <div className="space-y-6">
          {/* Analysis Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Song Analysis</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Input Summary</h3>
                <p className="text-gray-700 mb-4 text-sm italic">{blueprint.analysis.inputSummary}</p>
                
                <h3 className="font-semibold text-lg mb-2">Current Structure</h3>
                <p className="text-gray-700 mb-4">{blueprint.analysis.currentStructure}</p>
                
                <h3 className="font-semibold text-lg mb-2">Energy Curve</h3>
                <p className="text-gray-700">{blueprint.analysis.energyCurve}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Emotional Arc</h3>
                <p className="text-gray-700 mb-4">{blueprint.analysis.emotionalArc}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-green-700 mb-2">Strengths</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {blueprint.analysis.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-orange-700 mb-2">Improvements</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {blueprint.analysis.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-orange-500 mr-2">•</span>
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Exportable Blueprint */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Exportable Song Blueprint</h2>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(blueprint.exportReady);
                  alert('Blueprint copied to clipboard!');
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
              >
                Copy Blueprint
              </button>
            </div>
            
            <div className="p-4 bg-gray-900 text-green-400 rounded-lg font-mono text-sm overflow-auto max-h-96">
              <pre>{blueprint.exportReady}</pre>
            </div>
          </div>

          {/* Quick Reference Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Quick Reference</h2>
            
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">Core Elements</h3>
              <div className="grid md:grid-cols-4 gap-4 text-sm">
                <div><strong>Theme:</strong> {blueprint.blueprint.theme}</div>
                <div><strong>Target Emotion:</strong> {blueprint.blueprint.targetEmotion}</div>
                <div><strong>Structure:</strong> {blueprint.blueprint.structure}</div>
                <div><strong>Energy Pattern:</strong> {blueprint.blueprint.energyPattern}</div>
              </div>
            </div>

            <h3 className="font-semibold text-lg mb-4">Section Overview</h3>
            
            <div className="space-y-3">
              {blueprint.blueprint.sections.map((section, index) => (
                <div key={index} className={`p-3 rounded-lg border-2 ${getSectionBackground(section.energyLevel)}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{section.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      section.energyLevel === 'high' ? 'bg-red-200 text-red-800' :
                      section.energyLevel === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-blue-200 text-blue-800'
                    }`}>
                      {section.energyLevel.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-2"><strong>Function:</strong> {section.function}</p>
                  
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="font-medium text-gray-600 mb-1">Key Elements:</p>
                      <ul className="text-gray-700 space-y-1">
                        {section.keyElements.map((element, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-blue-500 mr-1">•</span>
                            {element}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <p className="font-medium text-gray-600 mb-1">Techniques:</p>
                      <ul className="text-gray-700 space-y-1">
                        {section.techniques.slice(0, 3).map((technique, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-green-500 mr-1">•</span>
                            {technique}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Implementation Section */}
          {(includePrompts || includeMetatags) && blueprint.implementation && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Implementation Guide</h2>
              
              <div className="space-y-6">
                {includePrompts && blueprint.implementation.sunoPrompt && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Suno AI Style Prompt</h3>
                    <div className="p-4 bg-gray-100 rounded-lg font-mono text-sm">
                      {blueprint.implementation.sunoPrompt}
                    </div>
                  </div>
                )}
                
                {includeMetatags && blueprint.implementation.metatags && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Structural Metatags</h3>
                    <div className="p-4 bg-gray-100 rounded-lg font-mono text-sm">
                      {blueprint.implementation.metatags}
                    </div>
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Priority Techniques</h3>
                    <ul className="space-y-2">
                      {blueprint.implementation.keyTechniques.map((technique, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-600 mr-2 font-bold">▶</span>
                          <span className="text-gray-700">{technique}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Next Steps</h3>
                    <ul className="space-y-2">
                      {blueprint.implementation.nextSteps.map((step, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-600 mr-2 font-bold">{index + 1}.</span>
                          <span className="text-gray-700">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Implementation Guide</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Suno AI Style Prompt</h3>
                <div className="p-4 bg-gray-100 rounded-lg font-mono text-sm">
                  {blueprint.implementation.sunoPrompt}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Structural Metatags</h3>
                <div className="p-4 bg-gray-100 rounded-lg font-mono text-sm">
                  {blueprint.implementation.metatags}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Priority Techniques</h3>
                  <ul className="space-y-2">
                    {blueprint.implementation.keyTechniques.map((technique, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-600 mr-2 font-bold">▶</span>
                        <span className="text-gray-700">{technique}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Next Steps</h3>
                  <ul className="space-y-2">
                    {blueprint.implementation.nextSteps.map((step, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-600 mr-2 font-bold">{index + 1}.</span>
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SongBlueprintArchitect;