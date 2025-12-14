import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          created_at?: string;
        };
      };
      interviews: {
        Row: {
          id: string;
          user_id: string;
          job_role: string;
          company: string;
          interview_type: 'technical' | 'behavioral' | 'mixed';
          difficulty: 'easy' | 'medium' | 'hard';
          questions: any;
          status: 'pending' | 'in-progress' | 'completed';
          score: number | null;
          feedback: string | null;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          job_role: string;
          company: string;
          interview_type: 'technical' | 'behavioral' | 'mixed';
          difficulty: 'easy' | 'medium' | 'hard';
          questions: any;
          status?: 'pending' | 'in-progress' | 'completed';
          score?: number | null;
          feedback?: string | null;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          job_role?: string;
          company?: string;
          interview_type?: 'technical' | 'behavioral' | 'mixed';
          difficulty?: 'easy' | 'medium' | 'hard';
          questions?: any;
          status?: 'pending' | 'in-progress' | 'completed';
          score?: number | null;
          feedback?: string | null;
          created_at?: string;
          completed_at?: string | null;
        };
      };
    };
  };
}
