'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Interview } from '@/types';
import { mockUser, mockInterviews } from './mock-data';

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  interviews: Interview[];
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  addInterview: (interview: Omit<Interview, 'id' | 'userId' | 'createdAt'>) => void;
  updateInterview: (id: string, updates: Partial<Interview>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [interviews, setInterviews] = useState<Interview[]>(mockInterviews);

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(mockUser);
  };

  const signup = async (email: string, password: string, name: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser({ ...mockUser, email, name });
  };

  const logout = () => {
    setUser(null);
  };

  const addInterview = (interview: Omit<Interview, 'id' | 'userId' | 'createdAt'>) => {
    const newInterview: Interview = {
      ...interview,
      id: Math.random().toString(36).substr(2, 9),
      userId: user?.id || '1',
      createdAt: new Date(),
    };
    setInterviews(prev => [newInterview, ...prev]);
  };

  const updateInterview = (id: string, updates: Partial<Interview>) => {
    setInterviews(prev =>
      prev.map(interview =>
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
        login,
        signup,
        logout,
        addInterview,
        updateInterview,
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
