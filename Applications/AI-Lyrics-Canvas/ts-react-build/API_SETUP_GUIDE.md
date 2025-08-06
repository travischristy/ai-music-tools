# AI Lyrics Canvas - API Configuration Guide

## Overview

The AI Lyrics Canvas app supports multiple AI providers and can be configured to use either real AI APIs or mock implementations for development/testing.

## Quick Setup

### 1. Choose Your AI Provider

The app supports these AI providers:
- **OpenAI** (GPT-4, GPT-3.5-turbo) - Recommended
- **Anthropic** (Claude-3 models)
- **Cohere** (Command models)
- **Local AI** (Ollama, etc.)

### 2. Configure Environment Variables

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:

#### For OpenAI (Recommended):
```env
REACT_APP_AI_PROVIDER=openai
REACT_APP_API_BASE_URL=https://api.openai.com/v1
REACT_APP_API_KEY=sk-your-openai-api-key-here
REACT_APP_MODEL=gpt-4
REACT_APP_USE_MOCK_API=false
```

#### For Anthropic Claude:
```env
REACT_APP_AI_PROVIDER=anthropic
REACT_APP_API_BASE_URL=https://api.anthropic.com/v1
REACT_APP_API_KEY=your-anthropic-api-key-here
REACT_APP_MODEL=claude-3-sonnet-20240229
REACT_APP_USE_MOCK_API=false
```

#### For Local AI (Ollama):
```env
REACT_APP_AI_PROVIDER=local
REACT_APP_API_BASE_URL=http://localhost:11434/v1
REACT_APP_MODEL=llama2
REACT_APP_USE_MOCK_API=false
# No API key needed for local
```

#### For Development/Testing (Mock API):
```env
REACT_APP_USE_MOCK_API=true
# Other settings don't matter when using mock API
```

### 3. Restart the Development Server

After changing environment variables:
```bash
npm start
```

## Advanced Configuration

### Generation Parameters

Fine-tune AI generation behavior:

```env
# Lyrics Generation
REACT_APP_LYRICS_TEMPERATURE=0.8    # Creativity (0.0-2.0)
REACT_APP_LYRICS_MAX_TOKENS=1500    # Max response length

# Analysis
REACT_APP_ANALYSIS_TEMPERATURE=0.3  # More deterministic for analysis

# Enhancement
REACT_APP_ENHANCEMENT_TEMPERATURE=0.6
```

### API Timeouts and Limits

```env
REACT_APP_MAX_TOKENS=2000          # Global max tokens
REACT_APP_TIMEOUT=30000            # Request timeout (ms)
```

## Supported Models by Provider

### OpenAI
- `gpt-4` - Best quality, slower, more expensive
- `gpt-4-turbo` - Fast GPT-4 variant
- `gpt-3.5-turbo` - Faster, cheaper, good quality

### Anthropic
- `claude-3-opus-20240229` - Highest quality
- `claude-3-sonnet-20240229` - Balanced performance
- `claude-3-haiku-20240307` - Fastest, most affordable

### Local (Ollama)
- `llama2` - General purpose
- `mistral` - Good for creative tasks
- `codellama` - Better for structured output

## API Features

### 1. Lyrics Generation
- **Input**: Song title, style/genre, creativity level, sections
- **Output**: Complete song lyrics with proper structure
- **Customization**: Temperature, max tokens, style influence

### 2. Lyrics Analysis
- **Input**: Existing lyrics, style context
- **Output**: JSON analysis with rhyme schemes, syllable counts, cliches, sentiment
- **Features**: Real-time feedback, improvement suggestions

### 3. Lyrics Enhancement
- **Types**: Add ad-libs, improve flow, enhance style, restructure
- **Input**: Original lyrics, enhancement type, style context
- **Output**: Enhanced lyrics with change descriptions

## Error Handling

The app includes comprehensive error handling:
- API connection failures
- Invalid API keys
- Rate limiting
- Timeout handling
- Malformed responses

## Cost Management

### OpenAI Pricing (Approximate)
- GPT-4: ~$0.03-0.06 per generation
- GPT-3.5-turbo: ~$0.002-0.004 per generation

### Tips to Reduce Costs
1. Use `gpt-3.5-turbo` for development
2. Set appropriate `max_tokens` limits
3. Use mock API during development
4. Consider local AI for unlimited usage

## Troubleshooting

### Common Issues

1. **"API key is required" error**
   - Check your `.env` file has the correct API key
   - Restart the development server after changes

2. **"Invalid API configuration" error**
   - Verify your API base URL is correct
   - Check that your model name is supported

3. **Timeout errors**
   - Increase `REACT_APP_TIMEOUT` value
   - Check your internet connection
   - Try a different model

4. **Rate limiting**
   - Wait a few minutes before retrying
   - Consider upgrading your API plan
   - Use mock API for development

### Debug Mode

Enable detailed logging:
```env
REACT_APP_ENABLE_API_LOGGING=true
```

This will log all API requests/responses to the browser console.

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for all sensitive data
3. **Rotate API keys** regularly
4. **Monitor API usage** to detect unauthorized access
5. **Use least-privilege** API keys when possible

## Development Workflow

1. **Development**: Use `REACT_APP_USE_MOCK_API=true`
2. **Testing**: Use real API with `gpt-3.5-turbo`
3. **Production**: Use `gpt-4` or `claude-3-sonnet`

## Getting API Keys

### OpenAI
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy the key (starts with `sk-`)

### Anthropic
1. Go to https://console.anthropic.com/
2. Generate an API key
3. Copy the key

### Local AI (Ollama)
1. Install Ollama: https://ollama.ai/
2. Run: `ollama serve`
3. Pull a model: `ollama pull llama2`
4. No API key needed

## Support

For issues with the AI Lyrics Canvas app:
1. Check this guide first
2. Verify your environment configuration
3. Test with mock API to isolate issues
4. Check browser console for error messages
