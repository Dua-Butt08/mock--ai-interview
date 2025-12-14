import { Interview, Question } from '@/types';

export const mockUser = {
  id: '1',
  email: 'demo@example.com',
  name: 'Demo User',
  createdAt: new Date('2024-01-01'),
};

export const mockQuestions: Question[] = [
  {
    id: 'q1',
    question: 'Tell me about yourself and your background.',
    category: 'Introduction',
  },
  {
    id: 'q2',
    question: 'What interests you about this role?',
    category: 'Motivation',
  },
  {
    id: 'q3',
    question: 'Describe a challenging project you worked on.',
    category: 'Experience',
  },
  {
    id: 'q4',
    question: 'How do you handle tight deadlines and pressure?',
    category: 'Behavioral',
  },
  {
    id: 'q5',
    question: 'Where do you see yourself in 5 years?',
    category: 'Career Goals',
  },
];

export const mockInterviews: Interview[] = [
  {
    id: '1',
    userId: '1',
    jobRole: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    interviewType: 'mixed',
    difficulty: 'medium',
    questions: mockQuestions,
    status: 'completed',
    createdAt: new Date('2024-10-15'),
    completedAt: new Date('2024-10-15'),
    score: 85,
    feedback: 'Great responses overall. Strong technical knowledge and good communication skills.',
  },
  {
    id: '2',
    userId: '1',
    jobRole: 'Full Stack Engineer',
    company: 'StartupXYZ',
    interviewType: 'technical',
    difficulty: 'hard',
    questions: mockQuestions.slice(0, 3),
    status: 'completed',
    createdAt: new Date('2024-10-20'),
    completedAt: new Date('2024-10-20'),
    score: 78,
    feedback: 'Solid technical foundation. Could improve on explaining complex concepts more clearly.',
  },
  {
    id: '3',
    userId: '1',
    jobRole: 'Product Manager',
    company: 'BigTech Co.',
    interviewType: 'behavioral',
    difficulty: 'medium',
    questions: mockQuestions,
    status: 'pending',
    createdAt: new Date('2024-11-01'),
  },
];

export const sampleQuestionsByCategory = {
  technical: [
    'Explain the difference between var, let, and const in JavaScript.',
    'What is the virtual DOM and how does it work?',
    'Describe the REST API architecture and its principles.',
    'How would you optimize a slow-loading web application?',
    'Explain async/await and how it differs from promises.',
  ],
  behavioral: [
    'Tell me about a time you had a conflict with a team member.',
    'Describe a situation where you had to meet a tight deadline.',
    'How do you prioritize tasks when everything is urgent?',
    'Tell me about a project that didn\'t go as planned.',
    'Describe your leadership style.',
  ],
  mixed: [
    'Walk me through your most complex project.',
    'How do you stay updated with new technologies?',
    'Describe a time you had to learn something new quickly.',
    'What\'s your approach to code reviews?',
    'How do you handle feedback and criticism?',
  ],
};
