# VAPI Voice Agent Setup Guide

This guide will help you set up the VAPI voice agent integration for the AI Mock Interview application.

## Prerequisites

- VAPI Account (https://vapi.ai)
- Node.js installed
- Access to VAPI Dashboard

## Step-by-Step Setup

### 1. Log in to Your VAPI Account

1. Go to https://dashboard.vapi.ai/
2. Log in with your credentials:
   - Email: bdua8933@gmail.com
   - Password: DuaButt@08

### 2. Get Your API Keys

#### Public Key (Web Token)
1. In the VAPI Dashboard, navigate to **Settings** → **API Keys**
2. Find your **Public Key** (also called Web Token)
3. Click the **Copy** button to copy it
4. This key is safe to use in your frontend application

#### Private Key
1. In the same **API Keys** section
2. Find your **Private Key**
3. Click the **Copy** button to copy it
4. ⚠️ **IMPORTANT**: Keep this key secret! Never commit it to version control

### 3. Update Environment Variables

Open your `.env.local` file and update/add the following:

```env
# Existing Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://pasgvqhpcxkkqjltclxd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhc2d2cWhwY3hra3FqbHRjbHhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MzIwMTEsImV4cCI6MjA3ODUwODAxMX0.SSKzm6ydtKu829fCxQqVgPmUImAlheW0MJ_2wfbgCNA

# Google AI Configuration
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyDnxfZ9bvvAkh4xCNpijbyZv9oMVMDxT8Y

# VAPI Configuration
NEXT_PUBLIC_VAPI_WEB_TOKEN=your_public_key_here
VAPI_PRIVATE_KEY=your_private_key_here
```

Replace `your_public_key_here` and `your_private_key_here` with the keys you copied from the VAPI Dashboard.

### 4. Install Dependencies (If Needed)

The VAPI SDK is already included in package.json, but if you need to reinstall:

```bash
npm install @vapi-ai/web
```

### 5. Create Your VAPI Assistant

We've created a helper script to set up your assistant. Run:

```bash
npx tsx scripts/create-vapi-assistant.ts
```

This script will:
- Check if you have any existing assistants
- Create a new "AI Interview Assistant" if needed
- Provide you with an Assistant ID to add to your `.env.local`

If you see an error about `tsx` not being found, install it:

```bash
npm install -g tsx
```

Or run directly with npx:

```bash
npx tsx scripts/create-vapi-assistant.ts
```

### 6. Optional: Configure Provider Keys

If you want to use your own API keys for OpenAI, Deepgram, or 11labs:

1. Go to VAPI Dashboard → **Provider Keys**
2. Add your API keys for:
   - **OpenAI**: For GPT-4o model (required for AI responses)
   - **Deepgram**: For speech-to-text transcription (optional, VAPI provides default)
   - **11labs**: For voice synthesis (optional, VAPI provides default)

> **Note**: VAPI provides default keys for testing, but for production use, you should add your own provider keys to avoid rate limits.

## Testing the Integration

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Test the Voice Interview

1. Navigate to http://localhost:3000
2. Log in or create an account
3. Create a new interview
4. Start an interview session
5. Click the green phone button to start the voice call
6. Grant microphone permissions when prompted
7. Start speaking your answer
8. Click the red phone button to end the call

### 3. Verify Functionality

Check that:
- ✅ The call connects successfully
- ✅ You can hear the AI interviewer
- ✅ Your speech is being transcribed
- ✅ The AI responds to your answers
- ✅ Transcripts appear in the UI
- ✅ The call ends cleanly

## Troubleshooting

### Issue: "VAPI client not initialized"

**Solution**: Verify that `NEXT_PUBLIC_VAPI_WEB_TOKEN` is set in `.env.local` and restart your dev server.

### Issue: Call fails to connect

**Solutions**:
1. Check your VAPI Dashboard to ensure your account is active
2. Verify your API keys are correct
3. Check browser console for error messages
4. Ensure you've granted microphone permissions

### Issue: No audio from AI

**Solutions**:
1. Check your browser's audio permissions
2. Verify that your provider keys (11labs or OpenAI TTS) are configured
3. Check VAPI Dashboard → Logs to see detailed error messages

### Issue: Speech not being transcribed

**Solutions**:
1. Grant microphone permissions in your browser
2. Verify Deepgram provider key is configured (or using VAPI default)
3. Check browser console for errors
4. Try speaking louder or closer to your microphone

### Issue: Script errors when creating assistant

**Solutions**:
1. Ensure `VAPI_PRIVATE_KEY` is set in `.env.local`
2. Verify your VAPI account is active and in good standing
3. Check that you have sufficient credits in your VAPI account

## Advanced Configuration

### Customizing the Assistant

Edit `lib/vapi-assistant.config.ts` to customize:
- Voice settings (provider, voice ID)
- Model parameters (temperature, model version)
- System prompts and behavior
- Timeout settings
- End-call phrases

### Using Different Voices

Available 11labs voices:
- `sarah` - Professional female voice (default)
- `adam` - Professional male voice
- `bella` - Warm female voice
- `charlie` - Casual male voice

Update in `lib/vapi.ts`:

```typescript
voice: {
  provider: '11labs',
  voiceId: 'adam', // Change to your preferred voice
}
```

### Adjusting Interview Difficulty

The system automatically adjusts based on the interview configuration, but you can fine-tune in `lib/vapi.ts`:

- **Temperature**: 0.6 for focused technical, 0.8 for conversational behavioral
- **Max Duration**: Adjust `maxDurationSeconds` for longer/shorter sessions
- **Silence Timeout**: Adjust `silenceTimeoutSeconds` for thinking time

## Cost Considerations

VAPI charges are based on:
- **Call duration** (minutes of active call time)
- **Provider usage** (OpenAI, Deepgram, 11labs tokens)

Tips to reduce costs:
1. Use VAPI's provided keys for testing
2. Set reasonable `maxDurationSeconds` limits
3. Use `silenceTimeoutSeconds` to prevent idle costs
4. Monitor usage in VAPI Dashboard

## Support

- VAPI Documentation: https://docs.vapi.ai
- VAPI Community: https://vapi.ai/community
- Issues: Create an issue in your project repository

## Next Steps

Once VAPI is working:
1. Test all interview types (technical, behavioral, mixed)
2. Try different difficulty levels
3. Customize the assistant personality
4. Add your own provider keys for production
5. Monitor usage and costs in the VAPI Dashboard

---

**Setup Complete!** 🎉

Your AI Mock Interview application is now powered by VAPI voice AI. Users can conduct realistic voice interviews with AI interviewers.
