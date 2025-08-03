import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Bot, Clipboard, Settings, Wind, Music, Sparkles, Wand2, ChevronDown, ChevronUp, BrainCircuit, X, Server, ChevronsUpDown } from 'lucide-react';

// --- Reusable UI Components ---

const Card = ({ children, className = '' }) => (
  <div className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, className = '', variant = 'primary', disabled = false }) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-semibold transition-all duration-200 ease-in-out flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900';
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-500 text-white focus:ring-indigo-500 disabled:bg-indigo-800 disabled:text-gray-400 disabled:cursor-not-allowed',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-gray-200 focus:ring-gray-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed',
    ghost: 'bg-transparent hover:bg-gray-700/50 text-gray-300 focus:ring-gray-600'
  };
  return (
    <button onClick={onClick} className={`${baseClasses} ${variants[variant]} ${className}`} disabled={disabled}>
      {children}
    </button>
  );
};

const TextArea = ({ value, onChange, placeholder, rows = 5 }) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-200 placeholder-gray-500 resize-y"
    rows={rows}
  />
);

const Input = ({ value, onChange, placeholder, type = 'text', label }) => (
    <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-200 placeholder-gray-500"
        />
    </div>
);


const Slider = ({ label, value, onChange, min, max, step }) => (
  <div className="space-y-2">
    <label className="flex justify-between text-sm font-medium text-gray-300">
      <span>{label}</span>
      <span className="font-bold text-indigo-400">{value}</span>
    </label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-indigo-500"
    />
  </div>
);

const ResultCard = ({ title, text, onCopy }) => {
    if (!text) return null;
    return (
        <Card className="mt-6">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h3 className="font-semibold text-lg text-indigo-400 flex items-center"><Sparkles className="w-5 h-5 mr-2" /> {title}</h3>
                <Button onClick={() => onCopy(text)} variant="secondary" className="px-3 py-1 text-sm">
                    <Clipboard className="w-4 h-4 mr-1" /> Copy
                </Button>
            </div>
            <div className="p-4 whitespace-pre-wrap text-gray-300 bg-black/20 text-sm leading-relaxed font-mono">
                {text}
            </div>
        </Card>
    );
};


const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl border-2 border-indigo-500/50 shadow-2xl">
                <div className="p-4 flex justify-between items-center border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2"><Settings className="text-indigo-400"/> {title}</h2>
                    <Button onClick={onClose} variant="ghost" className="!p-2">
                        <X className="w-5 h-5"/>
                    </Button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </Card>
        </div>
    );
};

// --- NEW COMPONENT: API Log Viewer ---
const ApiLogViewer = ({ logs }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [expandedLogId, setExpandedLogId] = useState(null);

    const toggleLog = (id) => {
        setExpandedLogId(prev => (prev === id ? null : id));
    };

    if (logs.length === 0) {
        return (
            <div className="mt-8 text-center text-gray-500">
                API call logs will appear here after you generate a prompt.
            </div>
        );
    }

    return (
        <div className="mt-12">
            <h2 
                className="text-2xl font-bold text-white flex items-center justify-center gap-3 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Server className="w-6 h-6 text-indigo-400" />
                API Call Log
                <ChevronsUpDown className="w-5 h-5 text-gray-400" />
            </h2>
            {isOpen && (
                <Card className="mt-4 p-4 space-y-3 max-h-[600px] overflow-y-auto">
                    {logs.slice().reverse().map(log => (
                        <div key={log.id} className="bg-gray-900/70 rounded-lg border border-gray-700">
                            <div className="p-3 flex justify-between items-center cursor-pointer" onClick={() => toggleLog(log.id)}>
                                <div className="flex items-center gap-4">
                                    <span className={`px-2 py-1 text-xs font-bold rounded ${log.status === 'Success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {log.status}
                                    </span>
                                    <span className="font-mono text-sm text-gray-300">{log.type}</span>
                                </div>
                                <span className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                            </div>
                            {expandedLogId === log.id && (
                                <div className="border-t border-gray-700 p-4 text-xs space-y-4">
                                    <div className="font-mono text-gray-400">{log.request.endpoint}</div>
                                    
                                    <div>
                                        <h4 className="font-bold text-gray-200 mb-1">Request Settings</h4>
                                        <pre className="p-2 bg-black/30 rounded-md text-gray-400 whitespace-pre-wrap">{JSON.stringify(log.request.settings, null, 2)}</pre>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-200 mb-1">System Prompt</h4>
                                        <pre className="p-2 bg-black/30 rounded-md text-gray-400 whitespace-pre-wrap max-h-40 overflow-y-auto">{log.request.systemPrompt}</pre>
                                    </div>
                                     <div>
                                        <h4 className="font-bold text-gray-200 mb-1">User Prompt</h4>
                                        <pre className="p-2 bg-black/30 rounded-md text-gray-400 whitespace-pre-wrap max-h-40 overflow-y-auto">{log.request.userPrompt}</pre>
                                    </div>
                                    {log.response && (
                                    <div>
                                        <h4 className="font-bold text-gray-200 mb-1">Token Usage</h4>
                                        <pre className="p-2 bg-black/30 rounded-md text-gray-400 whitespace-pre-wrap">
                                            {log.response.tokens ? 
                                            `Input: ${log.response.tokens.prompt_tokens}\nOutput: ${log.response.tokens.completion_tokens}\nTotal: ${log.response.tokens.total_tokens}`
                                            : "Token usage data not provided by API."}
                                        </pre>
                                    </div>
                                    )}
                                    {log.error && (
                                     <div>
                                        <h4 className="font-bold text-red-400 mb-1">Error</h4>
                                        <pre className="p-2 bg-red-900/30 rounded-md text-red-300 whitespace-pre-wrap">{log.error}</pre>
                                    </div>
                                    )}
                                    <div className="text-gray-600 text-center pt-2">No data is cached by this application.</div>
                                </div>
                            )}
                        </div>
                    ))}
                </Card>
            )}
        </div>
    );
};


// --- Core Application Components ---

const SettingsPanel = ({ settings, setSettings, onSave, onCancel }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = (e, key) => {
    setLocalSettings(prev => ({ ...prev, [key]: e.target.value }));
  };

  return (
    <div className="space-y-6">
        <p className="text-gray-400 text-sm">Configure the AI provider settings. This will be used to make requests for prompt generation.</p>
        <Input 
            label="API Base URL"
            value={localSettings.baseUrl}
            onChange={(e) => handleChange(e, 'baseUrl')}
            placeholder="e.g., https://api.openai.com/v1"
        />
        <Input 
            label="API Key"
            type="password"
            value={localSettings.apiKey}
            onChange={(e) => handleChange(e, 'apiKey')}
            placeholder="Enter your API Key"
        />
        <Input 
            label="Model Name"
            value={localSettings.model}
            onChange={(e) => handleChange(e, 'model')}
            placeholder="e.g., gpt-4-turbo, gemini-pro"
        />
        <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={onCancel}>Cancel</Button>
            <Button variant="primary" onClick={() => onSave(localSettings)}>Save Settings</Button>
        </div>
    </div>
  );
};


const PromptOptimizer = ({ settings, showNotification, onCopy, addApiLog, lyrics, setLyrics, style, setStyle, result, setResult }) => {
    const [isLoading, setIsLoading] = useState(false);

    const isFormValid = useMemo(() => lyrics.trim() !== '' && style.trim() !== '', [lyrics, style]);

    const handleOptimize = async () => {
        if (!isFormValid || !settings.apiKey) {
            showNotification('Please fill in lyrics, style, and set your API key in Settings.', 'error');
            return;
        }
        setIsLoading(true);
        setResult('');

        const systemPrompt = `You are a world-class AI agent specializing in prompt engineering for the Suno v4.5 music generation model. Your sole task is to analyze the user's provided lyrics and style description, and then transform them into a single, perfect, detailed prompt for Suno. You must adhere to the following rules with absolute precision.

**Core Directives:**
1.  **Conversational Style Prompt:** Do not list keywords. Weave the style elements (genre, mood, instruments, vocals, production) into a natural, descriptive sentence or two. This is the "Style Prompt" part of the output.
2.  **Meta-Tag Integration:** Analyze the provided lyrics and insert structural meta-tags where they logically fit.
    * **Permitted Tags:** Use only standard song structure tags: [Intro], [Verse], [Pre-Chorus], [Chorus], [Bridge], [Hook], [Interlude], [Guitar Solo], [Instrumental], [Outro], [End], [Fade Out].
    * **Descriptive Tags:** You may add descriptive words inside these tags, like [Epic Chorus] or [Quiet Verse].
3.  **CRITICAL SYNTAX RULE:** All non-lyrical cues, including structural tags, instrumental directions, and sound effects, MUST be enclosed in SQUARE BRACKETS []. NEVER use parentheses () for these cues, as Suno will try to sing the text inside them.
4.  **Specificity Enhancement:** Based on the user's style description, add specific, concrete details. Suggest instruments (e.g., "booming 808s", "reverb-drenched piano", "distorted lead guitar"), production styles ("lo-fi", "vintage 70s production", "polished radio-ready mix"), and vocal characteristics ("soulful female lead", "raw male baritone", "ethereal backing harmonies").
5.  **Mood & Emotion:** Use evocative adjectives to define the atmosphere (e.g., "melancholic and introspective", "joyful and anthemic", "intense and cinematic").

**Strict Output Format:**
Provide ONLY the final combined prompt. The output must be two distinct parts, clearly separated:
1.  \`Style Prompt:\` (Your conversational style description goes here)
2.  \`Lyrics:\` (The user's lyrics, now enhanced with correctly formatted [meta-tags], go here)

Do not add any other explanations, greetings, or text outside of this exact format.

---
**Corrected Example:**

*User Input:*
- Style: rock song
- Lyrics: I'm walking down the street. It's a sunny day. I feel so good. Life is great today.

*Your Required Output:*
Style Prompt:
An upbeat, anthemic indie rock track with a driving drum beat, bright, slightly overdriven electric guitar chords, and a powerful, optimistic male vocal. The production is clean and energetic, perfect for a summer festival.

Lyrics:
[Intro]
[Upbeat guitar riff]

[Verse 1]
I'm walking down the street
It's a sunny day

[Chorus]
I feel so good
Life is great today
---`;

        const userPrompt = `Style: ${style}\n\nLyrics:\n${lyrics}`;
        const endpoint = `${settings.baseUrl}/chat/completions`;
        const temperature = 0.7;

        const logEntry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            type: 'Prompt Optimizer',
            status: 'Pending',
            request: {
                endpoint: endpoint,
                settings: { model: settings.model, temperature: temperature, 'top_p, top_k, etc.': 'Not Set (Provider Default)' },
                systemPrompt: systemPrompt,
                userPrompt: userPrompt,
            },
            response: null, error: null,
        };

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${settings.apiKey}` },
                body: JSON.stringify({ model: settings.model, messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }], temperature: temperature, })
            });
            const data = await response.json();
            if (!response.ok) { throw new Error(data.error ? data.error.message : `API request failed with status ${response.status}`); }
            const responseContent = data.choices[0].message.content;
            setResult(responseContent);
            showNotification('Prompt optimized successfully!', 'success');
            logEntry.status = 'Success';
            logEntry.response = { content: responseContent, tokens: data.usage || null, };
        } catch (error) {
            console.error('Optimization Error:', error);
            const errorMessage = error.message;
            setResult(`Error: ${errorMessage}`);
            showNotification(`Error: ${errorMessage}`, 'error');
            logEntry.status = 'Failure';
            logEntry.error = errorMessage;
        } finally {
            setIsLoading(false);
            addApiLog(logEntry);
        }
    };

    return (
        <Card className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-semibold text-lg text-white mb-2">Your Lyrics</h3>
                    <TextArea value={lyrics} onChange={(e) => setLyrics(e.target.value)} placeholder="Enter the lyrics for your song here..." rows={13} />
                </div>
                <div>
                    <h3 className="font-semibold text-lg text-white mb-2">Your Style Description</h3>
                    <TextArea value={style} onChange={(e) => setStyle(e.target.value)} placeholder="Describe the genre, mood, and feel..." rows={13} />
                </div>
            </div>
            <div className="mt-6 flex justify-center">
                <Button onClick={handleOptimize} disabled={isLoading || !isFormValid}>
                    {isLoading ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div><span>Optimizing...</span></> : <><Wand2 className="w-5 h-5" /> Optimize Prompt</>}
                </Button>
            </div>
            <ResultCard title="Optimized Suno Prompt" text={result} onCopy={onCopy}/>
        </Card>
    );
};


const StyleIterator = ({ settings, showNotification, onCopy, addApiLog, originalStyle, setOriginalStyle, deviation, setDeviation, numVariations, setNumVariations, results, setResults }) => {
    const [isLoading, setIsLoading] = useState(false);
    const isFormValid = useMemo(() => originalStyle.trim() !== '', [originalStyle]);

    const handleIterate = async () => {
        if (!isFormValid || !settings.apiKey) {
            showNotification('Please enter an original style and set your API key in Settings.', 'error');
            return;
        }
        setIsLoading(true);
        setResults([]);

        const systemPrompt = `You are an AI assistant and expert musicologist specializing in creative style iteration for the Suno v4.5 music generation model. Your sole task is to generate new style prompts. The user will provide an original style, a 'degree of deviation' (1-5), and a 'number of variations'. You must generate exactly the requested number of new, distinct style prompts.

**Core Directives & Deviation Logic:**
Interpret the 'degree of deviation' with musical intelligence:
- Level 1 (Subtle): Make minor tweaks. Change one instrument or a mood adjective. E.g., 'pop ballad with piano' -> 'pop ballad with acoustic guitar'.
- Level 2 (Noticeable): Change the sub-genre or primary mood. E.g., 'pop ballad' -> 'upbeat power pop'.
- Level 3 (Moderate): Blend in a new, compatible genre or make a significant tempo/vocal change. E.g., 'pop ballad' -> 'slow jam R&B version' or 'folk-pop rendition'.
- Level 4 (Significant): Reimagine in a distinctly different genre. The result should be surprising but still musically plausible. E.g., 'pop ballad' -> 'aggressive industrial metal track'.
- Level 5 (Radical): A complete artistic departure into a wildly different or experimental genre. E.g., 'pop ballad' -> 'minimalist experimental ambient soundscape'.

**Strict Output Format:**
- Provide ONLY the generated style prompts.
- Each prompt must be on a new line, prefixed with "Style Prompt:".
- Do not add any extra explanations, greetings, numbers, or bullet points. Your entire response should just be the list of prompts.

---
**Example:**

*User Input:*
- Original Style: A gentle acoustic folk song about nature
- Deviation: 3
- Variations: 2

*Your Required Output:*
Style Prompt: Upbeat indie folk-pop arrangement. Introduce light drums, a melodic bassline, and bright electric guitar arpeggios. Mood: optimistic and slightly whimsical.
Style Prompt: Ethereal, cinematic ambient folk piece. Emphasize layered acoustic textures, a very slow tempo, spacious reverb, and introduce atmospheric synth pads.
---`;
        
        const userPrompt = `Original Style: ${originalStyle}\nDeviation: ${deviation}\nVariations: ${numVariations}`;
        const endpoint = `${settings.baseUrl}/chat/completions`;
        const temperature = 0.9;

        const logEntry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            type: 'Style Iterator',
            status: 'Pending',
            request: {
                endpoint: endpoint,
                settings: { model: settings.model, temperature: temperature, 'top_p, top_k, etc.': 'Not Set (Provider Default)' },
                systemPrompt: systemPrompt,
                userPrompt: userPrompt,
            },
            response: null, error: null,
        };

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${settings.apiKey}` },
                body: JSON.stringify({ model: settings.model, messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }], temperature: temperature, })
            });

            const data = await response.json();
            if (!response.ok) { throw new Error(data.error ? data.error.message : `API request failed with status ${response.status}`); }
            const rawResult = data.choices[0].message.content;
            const parsedResults = rawResult.split('Style Prompt:').map(s => s.trim()).filter(Boolean);
            setResults(parsedResults);
            showNotification(`Generated ${parsedResults.length} variations!`, 'success');
            logEntry.status = 'Success';
            logEntry.response = { content: rawResult, tokens: data.usage || null, };
        } catch (error) {
            console.error('Iteration Error:', error);
            const errorMessage = error.message;
            setResults([`Error: ${errorMessage}`]);
            showNotification(`Error: ${errorMessage}`, 'error');
            logEntry.status = 'Failure';
            logEntry.error = errorMessage;
        } finally {
            setIsLoading(false);
            addApiLog(logEntry);
        }
    };
    
    return (
        <Card className="p-6">
            <div className="space-y-4">
                <div>
                    <h3 className="font-semibold text-lg text-white mb-2">Original Style Prompt</h3>
                    <TextArea value={originalStyle} onChange={(e) => setOriginalStyle(e.target.value)} placeholder="Enter the original Suno style prompt..." rows={4} />
                </div>
                <div className="grid md:grid-cols-2 gap-6 pt-2">
                     <Slider label="Degree of Deviation" value={deviation} onChange={(e) => setDeviation(e.target.value)} min="1" max="5" step="1"/>
                    <Slider label="Number of Variations" value={numVariations} onChange={(e) => setNumVariations(e.target.value)} min="1" max="5" step="1"/>
                </div>
            </div>
            <div className="mt-6 flex justify-center">
                <Button onClick={handleIterate} disabled={isLoading || !isFormValid}>
                    {isLoading ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div><span>Iterating...</span></> : <><Wind className="w-5 h-5" /> Generate Variations</>}
                </Button>
            </div>
            {results.length > 0 && (
                <div className="mt-6 space-y-4">
                    <h3 className="font-semibold text-xl text-indigo-400 text-center">Generated Style Variations</h3>
                    {results.map((res, index) => (
                        <Card key={index} className="bg-gray-900/70">
                           <div className="p-4 flex justify-between items-start">
                                <p className="text-gray-300 flex-1">{res}</p>
                                <Button onClick={() => onCopy(res)} variant="secondary" className="px-3 py-1 text-sm ml-4">
                                    <Clipboard className="w-4 h-4 mr-1" /> Copy
                                </Button>
                           </div>
                        </Card>
                    ))}
                </div>
            )}
        </Card>
    );
};

// --- Main App Component ---

const Notification = ({ message, type, onDismiss }) => {
    const baseClasses = 'fixed bottom-5 right-5 p-4 rounded-lg text-white shadow-lg transition-all duration-300 ease-in-out transform';
    const typeClasses = { success: 'bg-green-600', error: 'bg-red-600', info: 'bg-blue-600' };
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        if(message) {
            setVisible(true);
            const timer = setTimeout(() => { setVisible(false); setTimeout(onDismiss, 300); }, 4000);
            return () => clearTimeout(timer);
        }
    }, [message, onDismiss]);
    return (<div className={`${baseClasses} ${typeClasses[type]} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>{message}</div>);
}

export default function App() {
    const [activeTab, setActiveTab] = useState('optimizer');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [settings, setSettings] = useState({ baseUrl: 'https://api.openai.com/v1', apiKey: '', model: 'gpt-4-turbo' });
    const [notification, setNotification] = useState({ message: '', type: 'info', key: 0 });
    const [apiLogs, setApiLogs] = useState([]);

    const [lyrics, setLyrics] = useState('');
    const [style, setStyle] = useState('');
    const [optimizerResult, setOptimizerResult] = useState('');
    const [originalStyle, setOriginalStyle] = useState('');
    const [deviation, setDeviation] = useState(3);
    const [numVariations, setNumVariations] = useState(3);
    const [iteratorResults, setIteratorResults] = useState([]);

    useEffect(() => {
        const storedSettings = localStorage.getItem('sunoAiAssistantSettings');
        if (storedSettings) { setSettings(JSON.parse(storedSettings)); }
        else { setIsSettingsOpen(true); }
    }, []);
    
    const handleSaveSettings = (newSettings) => {
        setSettings(newSettings);
        localStorage.setItem('sunoAiAssistantSettings', JSON.stringify(newSettings));
        setIsSettingsOpen(false);
        showNotification('Settings saved successfully!', 'success');
    };

    const showNotification = (message, type = 'info') => {
        setNotification({ message, type, key: Date.now() });
    }

    const addApiLog = (logEntry) => {
        setApiLogs(prevLogs => [...prevLogs, logEntry]);
    };

    const handleCopyToClipboard = (textToCopy) => {
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.top = '0'; textArea.style.left = '0'; textArea.style.position = 'fixed';
        document.body.appendChild(textArea);
        textArea.focus(); textArea.select();
        try {
            const successful = document.execCommand('copy');
            if (successful) showNotification('Copied to clipboard!', 'success');
            else showNotification('Failed to copy.', 'error');
        } catch (err) {
            showNotification('Failed to copy to clipboard.', 'error');
            console.error('Fallback Copy Error:', err);
        }
        document.body.removeChild(textArea);
    };

    const TABS = [{ id: 'optimizer', label: 'Prompt Optimizer', icon: Wand2 }, { id: 'iterator', label: 'Style Iterator', icon: Wind }];

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans bg-grid-gray-700/20">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/80 to-gray-900"></div>
            <div className="relative container mx-auto px-4 py-8">
                
                <header className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-white flex items-center justify-center gap-3">
                        <BrainCircuit className="w-10 h-10 text-indigo-400" /> Suno AI Prompt Assistant
                    </h1>
                    <p className="text-gray-400 mt-2 text-lg">Craft perfect prompts for Suno v4.5 with AI-powered tools</p>
                </header>

                <div className="flex justify-between items-center mb-6">
                    <div className="bg-gray-800/80 border border-gray-700 rounded-lg p-1 flex items-center space-x-1">
                        {TABS.map(tab => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === tab.id ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}><tab.icon className="w-5 h-5" /><span>{tab.label}</span></button>))}
                    </div>
                     <Button onClick={() => setIsSettingsOpen(true)} variant="secondary"><Settings className="w-5 h-5" /><span>Settings</span></Button>
                </div>

                <main>
                    {activeTab === 'optimizer' && 
                        <PromptOptimizer 
                            settings={settings} 
                            showNotification={showNotification} 
                            onCopy={handleCopyToClipboard} 
                            addApiLog={addApiLog}
                            lyrics={lyrics} setLyrics={setLyrics}
                            style={style} setStyle={setStyle}
                            result={optimizerResult} setResult={setOptimizerResult}
                        />}
                    {activeTab === 'iterator' && 
                        <StyleIterator 
                            settings={settings} 
                            showNotification={showNotification} 
                            onCopy={handleCopyToClipboard} 
                            addApiLog={addApiLog}
                            originalStyle={originalStyle} setOriginalStyle={setOriginalStyle}
                            deviation={deviation} setDeviation={setDeviation}
                            numVariations={numVariations} setNumVariations={setNumVariations}
                            results={iteratorResults} setResults={setIteratorResults}
                        />}
                </main>
                
                <ApiLogViewer logs={apiLogs} />

                <footer className="text-center mt-12 text-gray-500 text-sm">
                    <p>Powered by AI. Based on research for Suno v4.5.</p>
                </footer>
            </div>
            
            <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="AI Provider Settings">
                <SettingsPanel settings={settings} setSettings={setSettings} onSave={handleSaveSettings} onCancel={() => setIsSettingsOpen(false)} />
            </Modal>
            
            <Notification key={notification.key} message={notification.message} type={notification.type} onDismiss={() => setNotification({ message: '', type: 'info', key: 0 })} />
        </div>
    );
}
