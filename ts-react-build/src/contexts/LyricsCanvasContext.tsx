import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface SongSection {
  id: string;
  type: 'Verse' | 'Chorus' | 'Bridge' | 'Intro' | 'Outro' | 'Pre-Chorus' | 'Post-Chorus' | 'Hook' | 'Refrain' | 'Instrumental Break' | 'Instrumental Build';
  content: string;
  lines: string[];
}

export interface AnalysisResult {
  rhymeScheme: string[];
  syllableCounts: number[];
  cliches: Array<{ word: string; severity: 'high' | 'medium' | 'low'; suggestions: string[] }>;
  overusedWords: string[];
  sentiment: string;
  strength: number;
}

export interface LyricsCanvasState {
  songTitle: string;
  styleOfMusic: string;
  customLyrics: string;
  sections: SongSection[];
  analysisResults: AnalysisResult | null;
  blueprintGuidanceLevel: number;
  isAnalyzing: boolean;
  isGenerating: boolean;
  apiLogs: Array<{ timestamp: Date; request: any; response: any }>;
  undoStack: string[];
  redoStack: string[];
}

type LyricsCanvasAction =
  | { type: 'SET_SONG_TITLE'; payload: string }
  | { type: 'SET_STYLE_OF_MUSIC'; payload: string }
  | { type: 'SET_CUSTOM_LYRICS'; payload: string }
  | { type: 'ADD_SECTION'; payload: SongSection }
  | { type: 'REMOVE_SECTION'; payload: string }
  | { type: 'UPDATE_SECTION'; payload: { id: string; content: string } }
  | { type: 'SET_ANALYSIS_RESULTS'; payload: AnalysisResult }
  | { type: 'SET_BLUEPRINT_GUIDANCE_LEVEL'; payload: number }
  | { type: 'SET_ANALYZING'; payload: boolean }
  | { type: 'SET_GENERATING'; payload: boolean }
  | { type: 'ADD_API_LOG'; payload: { request: any; response: any } }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SAVE_STATE' };

const initialState: LyricsCanvasState = {
  songTitle: '',
  styleOfMusic: '',
  customLyrics: '',
  sections: [],
  analysisResults: null,
  blueprintGuidanceLevel: 3,
  isAnalyzing: false,
  isGenerating: false,
  apiLogs: [],
  undoStack: [],
  redoStack: [],
};

function lyricsCanvasReducer(state: LyricsCanvasState, action: LyricsCanvasAction): LyricsCanvasState {
  switch (action.type) {
    case 'SET_SONG_TITLE':
      return { ...state, songTitle: action.payload };
    case 'SET_STYLE_OF_MUSIC':
      return { ...state, styleOfMusic: action.payload };
    case 'SET_CUSTOM_LYRICS':
      return { ...state, customLyrics: action.payload };
    case 'ADD_SECTION':
      return { ...state, sections: [...state.sections, action.payload] };
    case 'REMOVE_SECTION':
      return { ...state, sections: state.sections.filter(s => s.id !== action.payload) };
    case 'UPDATE_SECTION':
      return {
        ...state,
        sections: state.sections.map(s =>
          s.id === action.payload.id ? { ...s, content: action.payload.content } : s
        ),
      };
    case 'SET_ANALYSIS_RESULTS':
      return { ...state, analysisResults: action.payload };
    case 'SET_BLUEPRINT_GUIDANCE_LEVEL':
      return { ...state, blueprintGuidanceLevel: action.payload };
    case 'SET_ANALYZING':
      return { ...state, isAnalyzing: action.payload };
    case 'SET_GENERATING':
      return { ...state, isGenerating: action.payload };
    case 'ADD_API_LOG':
      return {
        ...state,
        apiLogs: [...state.apiLogs, { timestamp: new Date(), ...action.payload }],
      };
    case 'SAVE_STATE':
      return {
        ...state,
        undoStack: [...state.undoStack, JSON.stringify(state)],
        redoStack: [],
      };
    case 'UNDO':
      if (state.undoStack.length === 0) return state;
      const previousState = JSON.parse(state.undoStack[state.undoStack.length - 1]);
      return {
        ...previousState,
        undoStack: state.undoStack.slice(0, -1),
        redoStack: [...state.redoStack, JSON.stringify(state)],
      };
    case 'REDO':
      if (state.redoStack.length === 0) return state;
      const nextState = JSON.parse(state.redoStack[state.redoStack.length - 1]);
      return {
        ...nextState,
        undoStack: [...state.undoStack, JSON.stringify(state)],
        redoStack: state.redoStack.slice(0, -1),
      };
    default:
      return state;
  }
}

const LyricsCanvasContext = createContext<{
  state: LyricsCanvasState;
  dispatch: React.Dispatch<LyricsCanvasAction>;
} | null>(null);

export function LyricsCanvasProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(lyricsCanvasReducer, initialState);

  return (
    <LyricsCanvasContext.Provider value={{ state, dispatch }}>
      {children}
    </LyricsCanvasContext.Provider>
  );
}

export function useLyricsCanvas() {
  const context = useContext(LyricsCanvasContext);
  if (!context) {
    throw new Error('useLyricsCanvas must be used within a LyricsCanvasProvider');
  }
  return context;
}
