# AI Mock Interview System

A complete, production-ready web application built with Next.js that helps users practice job interviews with AI-powered voice agents. Features real authentication, database persistence, AI-generated questions, and voice recording capabilities.

![AI Mock Interview](public/robot.png)

## Features

### Core Features
- 🔐 **Real Authentication** - Secure user auth with Supabase
- 📊 **Dashboard** - Track statistics, progress, and interview history
- 🤖 **AI-Generated Questions** - Custom questions powered by Google Gemini AI
- 🎤 **Voice Recording** - Real-time speech-to-text transcription
- 📝 **AI Evaluation** - Detailed feedback and scoring on answers
- 💾 **Database Persistence** - All data saved to Supabase PostgreSQL
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

### Interview Types
- **Technical Interviews** - Coding, system design, algorithms
- **Behavioral Interviews** - STAR method, situational questions
- **Mixed Interviews** - Combination of technical and behavioral

### Difficulty Levels
- Easy, Medium, Hard - Tailored to your experience level

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling with custom theme
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon system

### Backend
- **Supabase** - PostgreSQL database + Authentication
- **Google Gemini AI** - Question generation & answer evaluation
- **Next.js API Routes** - Serverless backend functions

### Voice & AI
- **Web Speech API** - Browser-based speech recognition
- **MediaRecorder API** - Audio recording
- **Speech Synthesis API** - Text-to-speech

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Backend Services

**You need to configure:**
1. Supabase account (database + auth)
2. Google Gemini API key (AI features)

**📖 See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed step-by-step instructions!**

### 3. Configure Environment Variables

Create `.env.local` in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini AI
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Set Up Database

Run the SQL schema in your Supabase dashboard:

```bash
# The schema file is: supabase-schema.sql
# Copy and paste into Supabase SQL Editor
```

### 5. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
ai-mock-interview/
├── app/
│   ├── api/                    # API routes (Gemini AI integration)
│   │   ├── generate-questions/ # AI question generation
│   │   └── evaluate-answer/    # AI answer evaluation
│   ├── auth/                   # Authentication pages
│   ├── dashboard/              # Main dashboard
│   ├── interview/              # Interview pages
│   │   ├── create/            # Create interview form
│   │   └── [id]/              # Dynamic interview routes
│   │       ├── session/       # Conduct interview
│   │       └── results/       # View results
│   ├── globals.css            # Global styles + custom theme
│   ├── layout.tsx             # Root layout with AppProvider
│   └── page.tsx               # Landing page
├── components/
│   ├── ui/                    # Reusable UI components (buttons, cards, etc.)
│   ├── dashboard/             # Dashboard-specific components
│   │   └── navbar.tsx         # Navigation bar with logo
│   └── interview/             # Interview components
├── lib/
│   ├── supabase.ts           # Supabase client & types
│   ├── auth-supabase.ts      # Authentication functions
│   ├── context-supabase.tsx  # Global state management
│   ├── voice-recording.ts    # Voice recording utilities
│   ├── utils.ts              # Helper functions
│   └── mock-data.ts          # Sample/fallback data
├── types/
│   └── index.ts              # TypeScript interfaces
├── public/                   # Static assets
│   ├── logo.svg             # App logo
│   ├── robot.png            # AI avatar
│   ├── user-avatar.png      # User avatar
│   ├── pattern.png          # Background pattern
│   └── favicon.ico          # Favicon
├── supabase-schema.sql       # Database schema
├── SETUP_GUIDE.md           # Detailed setup instructions
└── package.json             # Dependencies
```

## How It Works

### 1. User Flow

```
Sign Up → Create Interview → AI Generates Questions →
Record Answers → AI Evaluates → View Results & Feedback
```

### 2. Authentication

- Powered by Supabase Auth
- Email/password authentication
- Secure session management
- Row Level Security (RLS) for data protection

### 3. AI Question Generation

```
User Input (Job Role, Type, Difficulty)
    ↓
Next.js API Route (/api/generate-questions)
    ↓
Google Gemini AI
    ↓
Structured Questions with Categories
    ↓
Stored in Supabase
```

### 4. Voice Recording

- Browser's MediaRecorder API captures audio
- Web Speech API transcribes speech to text in real-time
- Transcripts saved with each answer
- Optional: Text-to-speech for AI voice

### 5. AI Evaluation

```
User Answer + Question Context
    ↓
Next.js API Route (/api/evaluate-answer)
    ↓
Google Gemini AI Analysis
    ↓
Score (0-100) + Detailed Feedback
    ↓
Saved to Database
```

## Key Features Explained

### Dashboard
- Interview statistics (total, completed, pending)
- Average score tracking
- Quick access to create new interviews
- List of all interviews with status badges

### Interview Creation
- AI-powered question generation
- Customizable parameters:
  - Job role (e.g., "Senior Frontend Developer")
  - Company (optional)
  - Interview type (technical/behavioral/mixed)
  - Difficulty level (easy/medium/hard)
  - Number of questions (3-10)

### Interview Session
- Real-time voice recording
- Live transcription display
- Progress indicator
- Skip functionality
- AI avatar visual
- Question-by-question flow

### Results Page
- Overall score with visual indicator
- Question-by-question breakdown
- AI-generated feedback
- Strengths and improvement areas
- Practice tips

## Database Schema

### `users` Table
- User profiles from Supabase Auth
- Extends auth.users with custom fields

### `interviews` Table
- Complete interview records
- Questions (stored as JSONB)
- Answers and transcripts
- Scores and feedback
- Status tracking

See `supabase-schema.sql` for complete schema.

## API Routes

### `POST /api/generate-questions`
Generates interview questions using Google Gemini AI

**Request:**
```json
{
  "jobRole": "Frontend Developer",
  "company": "Google",
  "interviewType": "mixed",
  "difficulty": "medium",
  "numberOfQuestions": 5
}
```

**Response:**
```json
{
  "questions": [
    {
      "question": "Tell me about...",
      "category": "Behavioral"
    }
  ]
}
```

### `POST /api/evaluate-answer`
Evaluates user answer using AI

**Request:**
```json
{
  "question": "...",
  "answer": "...",
  "category": "...",
  "jobRole": "..."
}
```

**Response:**
```json
{
  "score": 85,
  "feedback": "Great answer...",
  "strengths": ["..."],
  "improvements": ["..."]
}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `NEXT_PUBLIC_GEMINI_API_KEY` | Google Gemini API key (client) | Yes |
| `GEMINI_API_KEY` | Google Gemini API key (server) | Yes |

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Deployment

### Recommended Platforms
- **Vercel** - One-click deployment, zero config
- **Netlify** - Easy setup with continuous deployment
- **Railway** - Node.js hosting with database options

### Deployment Steps

1. Push code to GitHub
2. Connect repository to hosting platform
3. Add environment variables in platform settings
4. Deploy!

### Important Notes
- Set all environment variables in production
- Ensure Supabase project is not paused
- Test voice features with HTTPS (required for microphone)

## Browser Compatibility

| Feature | Chrome | Edge | Firefox | Safari |
|---------|--------|------|---------|--------|
| Core App | ✅ | ✅ | ✅ | ✅ |
| Voice Recording | ✅ | ✅ | ✅ | ⚠️ HTTPS only |
| Speech Recognition | ✅ | ✅ | ⚠️ Limited | ❌ |
| Text-to-Speech | ✅ | ✅ | ✅ | ✅ |

**Recommended:** Chrome or Edge for full voice features

## Security

- ✅ Supabase Row Level Security (RLS) enabled
- ✅ User data isolated per account
- ✅ Secure authentication with JWT
- ✅ Environment variables for sensitive data
- ✅ API keys never exposed to client
- ✅ SQL injection protection via Supabase

## Troubleshooting

### Common Issues

**"Invalid API key"**
- Check `.env.local` has correct Gemini API key
- Restart dev server after changing env vars

**"Database connection failed"**
- Verify Supabase credentials
- Check Supabase project is active (not paused)
- Confirm SQL schema was executed

**Microphone not working**
- Allow microphone permissions in browser
- Use HTTPS or localhost
- Check browser compatibility

**Questions not generating**
- Verify Gemini API key is valid
- Check browser console for errors
- Ensure API has not hit rate limits

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed troubleshooting.

## Future Enhancements

### Planned Features
- [ ] Real-time transcription with AssemblyAI/Deepgram
- [ ] Video recording option
- [ ] Interview scheduling and reminders
- [ ] Share results with recruiters
- [ ] Export as PDF report
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Practice with peers (collaborative mode)

### Advanced AI Features
- [ ] Follow-up questions based on answers
- [ ] Personality assessment
- [ ] Industry-specific question banks
- [ ] Custom evaluation rubrics
- [ ] Progress tracking over time

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for learning or production!

## Support

- **Setup Issues**: See [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Supabase Help**: [Supabase Documentation](https://supabase.com/docs)
- **Gemini AI Help**: [Google AI Documentation](https://ai.google.dev/docs)
- **Next.js Help**: [Next.js Documentation](https://nextjs.org/docs)

---

**Built with ❤️ using Next.js, Supabase, and Google Gemini AI**

🎉 **Ready to ace your next interview? Get started now!**
#   m o c k - - a i - i n t e r v i e w  
 #   m o c k - - a i - i n t e r v i e w  
 