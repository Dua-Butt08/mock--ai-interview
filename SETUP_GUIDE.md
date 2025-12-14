# AI Mock Interview System - Complete Setup Guide

This guide will walk you through setting up the complete backend system with Supabase database, Google Gemini AI, and voice recording features.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- A Google AI Studio account (for Gemini API)
- A modern web browser (Chrome/Edge recommended for voice features)

---

## Step 1: Install Dependencies

The dependencies should already be installed. If not, run:

```bash
npm install
```

---

## Step 2: Set Up Supabase Database

### 2.1 Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub or create an account
4. Click "New Project"
5. Fill in:
   - **Project name**: `ai-mock-interview` (or any name you prefer)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Select closest to you
6. Click "Create new project" (takes ~2 minutes to set up)

### 2.2 Run Database Schema

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click "New Query"
3. Copy the entire contents of `supabase-schema.sql` file from the project root
4. Paste it into the SQL editor
5. Click "Run" button (bottom right)
6. You should see success messages for all tables and policies

### 2.3 Get Your Supabase Credentials

1. Go to **Project Settings** (gear icon in left sidebar)
2. Click on **API** in the settings menu
3. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (the long JWT token)

---

## Step 3: Set Up Google Gemini AI

### 3.1 Get Gemini API Key

1. Go to [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Select "Create API key in new project" or choose existing project
5. Copy the API key (starts with `AIza...`)

**Important**: This is a free API with generous limits, but keep your key secure!

---

## Step 4: Configure Environment Variables

1. In the project root, create a file named `.env.local` (note the dot at the start)
2. Add your credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Google Gemini AI Configuration
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

3. Replace the values with your actual credentials from Steps 2 and 3
4. Save the file

**Security Note**: Never commit `.env.local` to git! It's already in `.gitignore`.

---

## Step 5: Test the Database Connection

1. Start the development server:

```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000)
3. Click "Get Started" or "Login"
4. Try creating an account:
   - Enter any email (e.g., `test@example.com`)
   - Enter a password (min 6 characters)
   - Enter your name
5. Click "Sign Up"

### Verify in Supabase:

1. Go to your Supabase dashboard
2. Click **Authentication** → **Users**
3. You should see your new user listed
4. Click **Table Editor** → **users**
5. You should see your user profile

---

## Step 6: Test AI Question Generation

1. After signing up/in, you'll see the Dashboard
2. Click "Create Interview" or "New Interview"
3. Fill in the form:
   - Job Role: `Frontend Developer`
   - Company: `Google` (optional)
   - Interview Type: `Mixed`
   - Difficulty: `Medium`
   - Number of Questions: `5`
4. Click "Create Interview"
5. Wait 2-5 seconds for AI to generate questions

### Troubleshooting:

- If you see "Failed to generate questions":
  - Check your Gemini API key is correct in `.env.local`
  - Restart the dev server (`Ctrl+C`, then `npm run dev` again)
  - Check browser console (F12) for error messages

---

## Step 7: Test Voice Recording (Optional but Recommended)

### Browser Requirements:

- **Chrome/Edge**: Full support ✅
- **Firefox**: Partial support (recording works, transcription limited)
- **Safari**: Requires HTTPS or localhost

### How to Test:

1. Go to Dashboard and click "Start Interview" on any pending interview
2. You'll be prompted to allow microphone access - click "Allow"
3. Click the microphone button to start recording
4. Speak your answer clearly
5. The Web Speech API will transcribe in real-time (simulated in the current version)
6. Click "Next Question" when done

### Voice Features Implemented:

- ✅ Microphone recording
- ✅ Real-time transcription display
- ✅ Text-to-speech for AI questions (browser-based)
- ⚠️ Cloud transcription (requires additional API like AssemblyAI or Deepgram - not included)

---

## Step 8: Verify Everything Works

### Test Checklist:

- [ ] Can create account and login
- [ ] Can see dashboard with stats
- [ ] Can create new interview with AI-generated questions
- [ ] Can start interview session
- [ ] Can record/transcribe answers
- [ ] Can complete interview and see results
- [ ] Data persists after refresh (check Supabase)

---

## Common Issues and Solutions

### Issue: "Invalid API key" error

**Solution**:
- Check your Gemini API key in `.env.local`
- Make sure there are no extra spaces
- Restart dev server after changing `.env.local`

### Issue: "Database connection failed"

**Solution**:
- Verify Supabase URL and anon key are correct
- Check Supabase project is not paused (free tier pauses after 1 week inactivity)
- Run the SQL schema again

### Issue: Microphone not working

**Solution**:
- Check browser permissions (Settings → Privacy → Microphone)
- Use HTTPS or localhost (required for mic access)
- Try a different browser (Chrome recommended)

### Issue: "Failed to create interview"

**Solution**:
- Check you're logged in
- Verify database schema was created correctly
- Check browser console for specific error
- Make sure Row Level Security policies are enabled

---

## Architecture Overview

```
Frontend (Next.js)
    ↓
Supabase Auth (User Management)
    ↓
Supabase Database (Interview Storage)
    ↓
Next.js API Routes
    ↓
Google Gemini AI (Question Generation & Evaluation)
    ↓
Browser APIs (Voice Recording & Speech Recognition)
```

---

## Database Schema

### `users` table
- `id` (UUID, primary key)
- `email` (text)
- `name` (text)
- `created_at` (timestamp)

### `interviews` table
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key)
- `job_role` (text)
- `company` (text)
- `interview_type` (enum: technical/behavioral/mixed)
- `difficulty` (enum: easy/medium/hard)
- `questions` (jsonb array)
- `status` (enum: pending/in-progress/completed)
- `score` (integer, 0-100)
- `feedback` (text)
- `created_at` (timestamp)
- `completed_at` (timestamp, nullable)

---

## Voice Recording Implementation

The voice recording system uses browser APIs:

1. **MediaRecorder API**: Records audio from microphone
2. **Web Speech API**: Real-time speech-to-text transcription
3. **Speech Synthesis API**: Text-to-speech for AI voice

### To Enable Advanced Transcription:

For production-quality transcription, integrate:
- **AssemblyAI**: Real-time transcription service
- **Deepgram**: Fast and accurate speech-to-text
- **OpenAI Whisper API**: High-quality transcription

These require additional API keys and implementation (not included in this starter).

---

## Next Steps

### Enhance Your System:

1. **Add Real-Time Transcription**
   - Integrate AssemblyAI or Deepgram API
   - Update `lib/voice-recording.ts`

2. **Improve AI Evaluation**
   - Add more detailed rubrics
   - Store evaluation criteria per question
   - Compare against ideal answers

3. **Add More Features**
   - Interview scheduling
   - Share results with recruiters
   - Practice with friends (multi-user sessions)
   - Export interview reports as PDF

4. **Deploy to Production**
   - Deploy to Vercel, Netlify, or any Node.js host
   - Use production environment variables
   - Set up custom domain

---

## Support

If you encounter issues:

1. Check browser console (F12) for errors
2. Check Supabase logs (Dashboard → Logs)
3. Verify all environment variables are set
4. Try clearing browser cache and cookies
5. Test in incognito/private mode

For Supabase help: [https://supabase.com/docs](https://supabase.com/docs)
For Gemini AI help: [https://ai.google.dev/docs](https://ai.google.dev/docs)

---

## Security Best Practices

- ✅ Never commit `.env.local` to version control
- ✅ Use Row Level Security (RLS) in Supabase
- ✅ Keep API keys secure
- ✅ Use HTTPS in production
- ✅ Implement rate limiting for API routes
- ✅ Validate all user inputs
- ✅ Sanitize data before storing

---

## Development Tips

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm start

# Check for errors
npm run lint
```

---

**🎉 Congratulations!** Your AI Mock Interview System is now fully configured and ready to use!
