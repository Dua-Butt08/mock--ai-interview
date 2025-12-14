export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface Interview {
  id: string;
  userId: string;
  jobRole: string;
  company: string;
  interviewType: 'technical' | 'behavioral' | 'mixed';
  difficulty: 'easy' | 'medium' | 'hard';
  questions: Question[];
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
  completedAt?: Date;
  score?: number;
  feedback?: string;
}

export interface Question {
  id: string;
  question: string;
  category: string;
  userAnswer?: string;
  idealAnswer?: string;
  score?: number;
  feedback?: string;
}

export interface InterviewSession {
  id: string;
  interviewId: string;
  currentQuestionIndex: number;
  isActive: boolean;
  startedAt: Date;
  endedAt?: Date;
}
