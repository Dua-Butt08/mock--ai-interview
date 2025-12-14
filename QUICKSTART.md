# Quick Start - Get Running in 10 Minutes! ⚡

This guide will get you from zero to running in about 10 minutes.

## What You'll Need

1. A Supabase account (free) - [supabase.com](https://supabase.com)
2. A Google AI Studio account (free) - [makersuite.google.com](https://makersuite.google.com)

---

## Step 1: Clone & Install (2 min)

```bash
cd ai-mock-interview
npm install
```

---

## Step 2: Set Up Supabase (3 min)

### Create Project
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Name it `ai-mock-interview`
4. Choose a password & region
5. Click "Create new project" (wait ~2 min)

### Run Database Schema
1. Click **SQL Editor** in sidebar
2. Click "New Query"
3. Copy ENTIRE contents of `supabase-schema.sql`
4. Paste and click "Run"
5. Should see green "Success" messages

### Get Credentials
1. Go to **Settings** → **API**
2. Copy these two values:
   - **Project URL** → `https://xxx.supabase.co`
   - **anon public** key → `eyJ...` (long JWT token)

---

## Step 3: Get Gemini API Key (2 min)

1. Go to [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Sign in with Google
3. Click "Create API Key"
4. Select "Create API key in new project"
5. Copy the key (starts with `AIza...`)

---

## Step 4: Configure Environment (1 min)

1. Create file `.env.local` in project root
2. Paste this and replace with YOUR values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your_long_key
NEXT_PUBLIC_GEMINI_API_KEY=AIza...your_key
GEMINI_API_KEY=AIza...your_key
```

---

## Step 5: Run & Test (2 min)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Test Flow:
1. Click "Get Started"
2. Create account (any email/password)
3. Click "Create Interview"
4. Fill form → "Create Interview"
5. Wait for AI to generate questions
6. Click "Start Interview"
7. Allow microphone access
8. Click mic button and speak
9. Click "Complete Interview"
10. View your results!

---

## ✅ Success Checklist

- [ ] App loads at localhost:3000
- [ ] Can create account
- [ ] Can see dashboard
- [ ] Can create interview (AI generates questions)
- [ ] Can record voice answer
- [ ] Can see results page

---

## 🚨 Common Issues

**"Invalid API key"**
```bash
# Check .env.local exists and has correct keys
# Restart server after editing .env.local
npm run dev
```

**"Failed to generate questions"**
- Verify Gemini API key is correct
- Check browser console (F12) for errors
- Try again (API might be rate-limited)

**Database errors**
- Make sure SQL schema was run successfully
- Check Supabase project is not paused

**Microphone not working**
- Click "Allow" when browser asks
- Use Chrome or Edge (best compatibility)
- Localhost is required for mic access

---

## 📚 Next Steps

- Read [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed docs
- Read [README.md](./README.md) for architecture info
- Check Supabase dashboard to see your data
- Try different interview types!

---

## 🎯 Pro Tips

1. **Use Chrome** - Best voice support
2. **Speak clearly** - Web Speech API works best with clear audio
3. **Check Supabase** - Watch data populate in real-time
4. **Try API calls** - Check Network tab (F12) to see AI responses
5. **Check logs** - Browser console shows helpful errors

---

**That's it! You now have a fully functional AI interview system! 🎉**

Need help? See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed troubleshooting.
