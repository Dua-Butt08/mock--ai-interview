'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Interview } from '@/types';
import { supabase } from './supabase';
import { signUpWithEmail, signInWithEmail, logOut, onAuthChange } from './auth-supabase';

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  interviews: Interview[];
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  addInterview: (interview: Omit<Interview, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  updateInterview: (id: string, updates: Partial<Interview>) => Promise<void>;
  loadInterviews: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load user and interviews on mount
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      if (user) {
        loadInterviews(user.id);
      } else {
        setInterviews([]);
      }
      setIsLoading(false);
    });

    return () => {
      unsubscribe.data.subscription.unsubscribe();
    };
  }, []);

  const loadInterviews = async (userId?: string) => {
    try {
      const uid = userId || user?.id;
      if (!uid) return;

      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedInterviews: Interview[] = (data || []).map((interview) => ({
        id: interview.id,
        userId: interview.user_id,
        jobRole: interview.job_role,
        company: interview.company,
        interviewType: interview.interview_type,
        difficulty: interview.difficulty,
        questions: interview.questions,
        status: interview.status,
        score: interview.score,
        feedback: interview.feedback,
        createdAt: new Date(interview.created_at),
        completedAt: interview.completed_at ? new Date(interview.completed_at) : undefined,
      }));

      setInterviews(formattedInterviews);
    } catch (error) {
      console.error('Error loading interviews:', error);
    }
  };

  const login = async (email: string, password: string) => {
    const user = await signInWithEmail(email, password);
    setUser(user);
    await loadInterviews(user.id);
  };

  const signup = async (email: string, password: string, name: string) => {
    const user = await signUpWithEmail(email, password, name);
    setUser(user);
  };

  const logout = async () => {
    await logOut();
    setUser(null);
    setInterviews([]);
  };

  const addInterview = async (interview: Omit<Interview, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) throw new Error('User must be logged in');

    const { data, error } = await supabase
      .from('interviews')
      .insert({
        user_id: user.id,
        job_role: interview.jobRole,
        company: interview.company,
        interview_type: interview.interviewType,
        difficulty: interview.difficulty,
        questions: interview.questions,
        status: interview.status,
        score: interview.score || null,
        feedback: interview.feedback || null,
      })
      .select()
      .single();

    if (error) throw error;

    const newInterview: Interview = {
      id: data.id,
      userId: data.user_id,
      jobRole: data.job_role,
      company: data.company,
      interviewType: data.interview_type,
      difficulty: data.difficulty,
      questions: data.questions,
      status: data.status,
      score: data.score,
      feedback: data.feedback,
      createdAt: new Date(data.created_at),
      completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
    };

    setInterviews((prev) => [newInterview, ...prev]);
  };

  const updateInterview = async (id: string, updates: Partial<Interview>) => {
    const dbUpdates: any = {};
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.score !== undefined) dbUpdates.score = updates.score;
    if (updates.feedback) dbUpdates.feedback = updates.feedback;
    if (updates.questions) dbUpdates.questions = updates.questions;
    if (updates.completedAt) dbUpdates.completed_at = updates.completedAt.toISOString();

    const { error } = await supabase
      .from('interviews')
      .update(dbUpdates)
      .eq('id', id);

    if (error) throw error;

    setInterviews((prev) =>
      prev.map((interview) =>
        interview.id === id ? { ...interview, ...updates } : interview
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        interviews,
        isLoading,
        login,
        signup,
        logout,
        addInterview,
        updateInterview,
        loadInterviews,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
