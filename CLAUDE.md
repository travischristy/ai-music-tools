# CLAUDE.md - AI Music Tools Repository Guide

This document provides essential context for AI assistants working with the ai-music-tools repository.

## Project Overview

A comprehensive AI-assisted music production and songwriting toolset combining web applications, Python backend services, AI agents, and an extensive knowledge base. The primary focus is on AI-powered songwriting specifically optimized for **Suno AI** music generation.

### Key Capabilities
- Lyric generation, analysis, and enhancement
- Style/mood prompt creation for Suno AI
- Cliché detection and elimination
- Real-time lyrical analysis (rhyme, syllable, pattern)
- Song structure/blueprint generation
- Multi-provider AI integration (OpenAI, Anthropic, Cohere, OpenRouter)

## Repository Structure

```
ai-music-tools/
├── Applications/           # Production applications and tools
│   ├── AI-Lyrics-Canvas/   # Main React web application
│   │   ├── ts-react-build/ # TypeScript React implementation
│   │   └── support-tools/  # Supporting utilities
│   │       ├── Chimeric-Lyrics-Engine/  # Advanced AI lyric generation
│   │       ├── Suno-Prompt-Iterator/    # Style prompt generator
│   │       └── Cliche-Guard/            # Cliché detection toolkit
│   ├── Song-Blueprint-Generator/        # Song structure tool
│   ├── style-slotmachine/  # Dynamic music tag generator (Swift/iOS)
│   └── Suno-AI-Knowledge-Base/          # Platform knowledge
├── Agents/                 # AI agents and specialized workflows
│   ├── Lyric-Analysis-Agent/   # Lyrics analysis with Python backend
│   └── Lyric-Writing-Agent/    # Lyrics generation agent
├── Knowledge/              # Comprehensive knowledge base
│   ├── structured-kb/      # Versioned structured documentation
│   │   └── latest/2025.08.1/   # Current KB version
│   └── unstructured-kb/    # Legacy format documentation
├── database/               # Solr search index configuration
└── .github/workflows/      # CI/CD (mdBook deployment, PR labeling)
```

## Technology Stack

### Frontend (AI Lyrics Canvas - Main App)
- **React** 18.2.0 with functional components and hooks
- **TypeScript** 4.9.5+ for type safety
- **Material-UI (MUI)** 5.14+ for UI components
- **Emotion** for styled components
- **Create React App** (react-scripts 5.0.1) for build tooling

### Support Tools
- **Chimeric Lyrics Engine**: React 19.1 + Vite + Python backend
- **Suno Prompt Iterator**: React 18.2 + Tailwind CSS
- **Style Slot Machine**: Swift (iOS) / JavaScript (web)

### Backend & AI
- **Python** for analysis scripts and backend services
- **AI Providers**: OpenAI, Anthropic (Claude), Cohere, OpenRouter, Gemini
- **Solr** for full-text knowledge base search
- Mock API available for development without API costs

## Development Commands

### AI Lyrics Canvas (Main Application)
```bash
cd Applications/AI-Lyrics-Canvas/ts-react-build

npm start           # Development server (port 3000)
npm run build       # Production build
npm test            # Run tests with Jest
```

### Chimeric Lyrics Engine
```bash
cd Applications/AI-Lyrics-Canvas/support-tools/Chimeric-Lyrics-Engine/react-python/frontend

npm run dev         # Vite dev server
npm run build       # Production build
npm run lint        # ESLint check
npm run preview     # Preview production build
```

### Documentation Site
```bash
# Built automatically via GitHub Actions on push to main
# Uses mdBook v0.4.36 - output to ./book directory
```

## Environment Configuration

Create `.env` file in `ts-react-build/` based on `.env.example`:

```bash
# AI Provider Selection
REACT_APP_AI_PROVIDER=openai|anthropic|cohere|openrouter|mock
REACT_APP_API_BASE_URL=<api_url>
REACT_APP_API_KEY=<api_key>
REACT_APP_MODEL=gpt-4|claude-3-sonnet|etc

# Generation Parameters
REACT_APP_LYRICS_TEMPERATURE=0.8
REACT_APP_LYRICS_MAX_TOKENS=1500
REACT_APP_ANALYSIS_TEMPERATURE=0.3
REACT_APP_ENHANCEMENT_TEMPERATURE=0.6

# Development Options
REACT_APP_USE_MOCK_API=true|false
REACT_APP_ENABLE_API_LOGGING=true|false
```

## Code Architecture

### Component Structure (AI Lyrics Canvas)
```
src/
├── App.tsx                 # Root application component
├── components/
│   ├── MainCanvas.tsx      # Main canvas container
│   ├── SettingsDialog.tsx  # Application settings
│   └── blocks/             # Modular UI blocks
│       ├── SongTitleBlock.tsx
│       ├── StyleOfMusicBlock.tsx
│       ├── CustomLyricsBlock.tsx
│       ├── SongBlueprintsBlock.tsx
│       ├── AIWorkflowButtons.tsx
│       ├── AnalysisResultsBlock.tsx
│       └── APILoggerBlock.tsx
├── contexts/               # React Context providers
│   ├── LyricsCanvasContext.tsx
│   └── SettingsContext.tsx
├── hooks/                  # Custom React hooks
│   ├── useAIWorkflows.ts
│   └── useRealTimeAnalysis.ts
├── services/               # External API integrations
│   ├── aiService.ts
│   └── openRouterService.ts
└── config/
    └── apiConfig.ts        # API configuration constants
```

### Key Patterns
- **Canvas Blocks**: Modular, reusable UI sections for the main editing interface
- **Context API + useReducer**: Lightweight state management (no Redux)
- **Custom Hooks**: Encapsulate AI workflow and analysis logic
- **Service Layer**: Abstract AI provider implementations

## Coding Conventions

### Naming
- Components: `PascalCase` (e.g., `MainCanvas.tsx`)
- Hooks: `use` prefix (e.g., `useAIWorkflows.ts`)
- Services: Descriptive names (e.g., `aiService.ts`)
- Constants/Enums: `UPPER_SNAKE_CASE`

### Style Guidelines
- Functional components only (no class components)
- TypeScript for all new code
- Material-UI components for consistent styling
- Emotion for custom styled components

### File Organization
- Keep related components in `blocks/` subdirectory
- One context per concern (lyrics, settings)
- Hooks encapsulate complex logic
- Services abstract external dependencies

## Testing

- **Framework**: Jest (via react-scripts)
- **Libraries**: React Testing Library, @testing-library/jest-dom
- **Run**: `npm test` in the ts-react-build directory

## CI/CD Workflows

### mdBook Documentation (`mdbook.yml`)
- **Trigger**: Push to `main` branch or manual dispatch
- **Action**: Builds and deploys documentation to GitHub Pages
- **mdBook Version**: 0.4.36

### PR Labeler (`label.yml`)
- **Trigger**: Pull request events
- **Action**: Auto-labels PRs based on modified file paths

## Knowledge Base

The `/Knowledge/` directory contains songwriting frameworks and AI collaboration guides:

### Core Concepts
- **Songwriter as Corporation**: Professional methodology
- **Addiction Formula**: Energy management (Hype, Tension, Implied Tension)
- **PRA Method**: Pattern, Repetition, Arc
- **Hollywood Structure**: 3-act energy distribution for songs

### Platform Guides
- Suno AI v4.5+ implementation
- Metatag system and syntax
- Style prompt engineering
- Cliché detection databases

### Current Version
Located at: `Knowledge/structured-kb/latest/2025.08.1/`

## Important Files

| File | Purpose |
|------|---------|
| `Applications/AI-Lyrics-Canvas/ts-react-build/API_SETUP_GUIDE.md` | API configuration instructions |
| `Knowledge/structured-kb/latest/2025.08.1/00_Master_Index.md` | Knowledge base master index |
| `Knowledge/structured-kb/latest/2025.08.1/AI_Assistant_System_Prompt.md` | AI assistant instructions |

## Common Tasks

### Adding a New UI Block
1. Create component in `src/components/blocks/`
2. Follow existing block patterns (collapsible, styled)
3. Import and add to `MainCanvas.tsx`
4. Add relevant state to `LyricsCanvasContext` if needed

### Adding AI Workflow
1. Add workflow logic in `src/hooks/useAIWorkflows.ts`
2. Update `AIWorkflowButtons.tsx` with new action
3. Configure prompts and parameters in the hook
4. Test with mock API first (`REACT_APP_USE_MOCK_API=true`)

### Updating Knowledge Base
1. Edit files in `Knowledge/structured-kb/latest/` directory
2. Update `00_Master_Index.md` for new content
3. Documentation auto-deploys via mdBook workflow on merge to main

## Notes for AI Assistants

1. **Read before editing**: Always read relevant files before making changes
2. **Use mock API**: Set `REACT_APP_USE_MOCK_API=true` during development
3. **Check the Knowledge Base**: Songwriting concepts and Suno AI best practices are documented in `/Knowledge/`
4. **Follow existing patterns**: Match the component structure and naming conventions
5. **TypeScript required**: All new code should be TypeScript
6. **Avoid over-engineering**: Keep changes focused and minimal
7. **No secrets in commits**: `.env` files are gitignored - never commit API keys
