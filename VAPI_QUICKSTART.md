# VAPI Voice Agent - Quick Start Guide

## ✅ What's Already Done

Your AI Mock Interview application now has VAPI voice agent integration! Here's what's been set up:

### Files Created:
- ✅ `lib/vapi.ts` - Main VAPI client and call management
- ✅ `lib/vapi-assistant.config.ts` - AI interviewer configuration
- ✅ `scripts/create-vapi-assistant.ts` - Assistant creation script
- ✅ `scripts/verify-vapi-setup.ts` - Setup verification script
- ✅ Documentation files (this guide + comprehensive guides)

### Configuration:
- ✅ VAPI SDK installed (`@vapi-ai/web`)
- ✅ Public key configured in `.env.local`
- ✅ Interview session page integrated with voice controls
- ✅ Real-time transcription support
- ✅ Professional AI interviewer with GPT-4o + 11Labs voice

## 🚀 Quick Setup (3 Steps)

### Step 1: Get Your VAPI Private Key

1. Open your browser and go to: **https://dashboard.vapi.ai/**

2. Log in with:
   - **Email**: `bdua8933@gmail.com`
   - **Password**: `DuaButt@08`

3. Navigate to: **Settings** → **API Keys**

4. Find **Private Key** and click **Copy**

5. Open `.env.local` and replace this line:
   ```env
   VAPI_PRIVATE_KEY=your_vapi_private_key_here
   ```

   With your actual key:
   ```env
   VAPI_PRIVATE_KEY=sk_live_xxxxxxxxxxxxx
   ```

### Step 2: Verify Setup

Run the verification script:

```bash
npm run vapi:verify
```

This will check if all your environment variables are correctly configured.

### Step 3: Create Your Assistant (Optional)

Create a persistent assistant in your VAPI account:

```bash
npm run vapi:create-assistant
```

This script will:
- Check for existing assistants
- Create a new "AI Interview Assistant" if needed
- Give you an Assistant ID to save

## 🎯 Test Your Integration

### 1. Start Development Server

```bash
npm run dev
```

### 2. Test Voice Interview

1. Open http://localhost:3000
2. Log in or sign up
3. Click **"Create Interview"**
4. Fill in the interview details (job role, type, difficulty)
5. Click **"Start Interview"**
6. **Click the GREEN PHONE button** to start voice call
7. Grant microphone permissions when prompted
8. Speak your answer to the AI interviewer
9. The AI will ask follow-up questions
10. **Click the RED PHONE button** to end the call
11. See your transcript and proceed to next question

## 🎨 What You Can Do

### Voice Interview Features:
- 🎤 **Real-time voice conversations** with AI interviewer
- 📝 **Live transcription** of your answers
- 🤖 **Intelligent follow-up questions** based on your responses
- 💡 **STAR method guidance** for behavioral questions
- 🔍 **Deep technical probing** for technical questions
- ⏱️ **10-minute limit** per question (configurable)
- 🔇 **30-second silence timeout** (configurable)

### Customization Options:

#### Change Voice
Edit `lib/vapi.ts`, line 38-41:

```typescript
voice: {
  provider: '11labs',
  voiceId: 'adam', // Try: sarah, adam, bella, charlie
}
```

#### Adjust AI Behavior
Edit `lib/vapi-assistant.config.ts`:
- Modify system prompts
- Change temperature (0.6 = focused, 0.8 = conversational)
- Adjust timeouts
- Customize first message

#### Add Your Own Provider Keys (Optional)
In VAPI Dashboard → **Provider Keys**, add:
- OpenAI API key (for GPT-4o)
- 11Labs API key (for premium voices)
- Deepgram API key (for better transcription)

> **Note**: VAPI provides default keys for testing, but for production, use your own to avoid rate limits.

## 📋 Available Commands

```bash
# Verify VAPI setup
npm run vapi:verify

# Create VAPI assistant
npm run vapi:create-assistant

# Complete setup (verify + create)
npm run vapi:setup

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔧 Troubleshooting

### "VAPI client not initialized"
- ✅ Check `NEXT_PUBLIC_VAPI_WEB_TOKEN` is set in `.env.local`
- ✅ Restart dev server: `npm run dev`

### Call fails to connect
- ✅ Verify keys in VAPI Dashboard
- ✅ Check VAPI account status and credits
- ✅ Check browser console (F12) for errors

### No audio from AI
- ✅ Check browser audio settings
- ✅ Verify provider keys in VAPI Dashboard
- ✅ Check VAPI Dashboard → Logs for errors

### Speech not transcribed
- ✅ Grant microphone permissions
- ✅ Speak clearly and close to mic
- ✅ Check Deepgram configuration

### Script errors
- ✅ Ensure `VAPI_PRIVATE_KEY` is set
- ✅ Check VAPI account is active
- ✅ Verify sufficient credits

## 💰 Cost Considerations

VAPI charges based on:
- **Call duration** (minutes of active call)
- **Provider usage** (OpenAI, Deepgram, 11Labs API calls)

Current configuration:
- Max 10 minutes per question
- 30-second silence timeout
- GPT-4o model
- 11Labs voice synthesis
- Deepgram Nova-2 transcription

**Tip**: Monitor usage in VAPI Dashboard → Billing

## 📚 Documentation

- 📖 **VAPI_SETUP_GUIDE.md** - Comprehensive setup guide
- 📝 **VAPI_INTEGRATION_SUMMARY.md** - Technical implementation details
- 🌐 **VAPI Docs**: https://docs.vapi.ai
- 💬 **VAPI Community**: https://vapi.ai/community

## 🎉 You're All Set!

Your AI Mock Interview application is now ready for voice-powered interviews!

### Next Steps:
1. ✅ Complete Step 1-3 above
2. ✅ Test voice interview feature
3. ✅ Customize voice and behavior (optional)
4. ✅ Add provider keys (optional)
5. ✅ Start conducting mock interviews!

---

**Need help?** Check the detailed guides or VAPI documentation linked above.
