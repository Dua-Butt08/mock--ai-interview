-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can only read their own data
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Create interviews table
CREATE TABLE IF NOT EXISTS public.interviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  job_role TEXT NOT NULL,
  company TEXT NOT NULL,
  interview_type TEXT CHECK (interview_type IN ('technical', 'behavioral', 'mixed')) NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) NOT NULL,
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT CHECK (status IN ('pending', 'in-progress', 'completed')) DEFAULT 'pending',
  score INTEGER CHECK (score >= 0 AND score <= 100),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

-- Users can read their own interviews
CREATE POLICY "Users can read own interviews" ON public.interviews
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own interviews
CREATE POLICY "Users can create own interviews" ON public.interviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own interviews
CREATE POLICY "Users can update own interviews" ON public.interviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own interviews
CREATE POLICY "Users can delete own interviews" ON public.interviews
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS interviews_user_id_idx ON public.interviews(user_id);
CREATE INDEX IF NOT EXISTS interviews_created_at_idx ON public.interviews(created_at DESC);
CREATE INDEX IF NOT EXISTS interviews_status_idx ON public.interviews(status);
