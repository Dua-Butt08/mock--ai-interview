/**
 * Mock question generator for when AI quota is exceeded
 * Provides high-quality fallback questions based on role and type
 */

interface QuestionTemplate {
  question: string;
  category: string;
}

interface QuestionBank {
  technical: {
    easy: QuestionTemplate[];
    medium: QuestionTemplate[];
    hard: QuestionTemplate[];
  };
  behavioral: {
    easy: QuestionTemplate[];
    medium: QuestionTemplate[];
    hard: QuestionTemplate[];
  };
}

const QUESTION_BANK: QuestionBank = {
  technical: {
    easy: [
      { question: "What is the difference between let, const, and var in JavaScript?", category: "JavaScript Basics" },
      { question: "Can you explain what HTML semantic elements are and give some examples?", category: "HTML/CSS" },
      { question: "What is a REST API and how does it work?", category: "Web Development" },
      { question: "Explain the difference between == and === in JavaScript", category: "JavaScript Basics" },
      { question: "What is the box model in CSS?", category: "HTML/CSS" },
      { question: "What is version control and why is it important?", category: "Development Tools" },
      { question: "Can you explain what a function is in programming?", category: "Programming Fundamentals" },
      { question: "What is the difference between frontend and backend development?", category: "Web Development" },
      { question: "What are arrays and how do you use them?", category: "Programming Fundamentals" },
      { question: "Explain what JSON is and why it's used", category: "Web Development" },
    ],
    medium: [
      { question: "How do closures work in JavaScript and when would you use them?", category: "JavaScript" },
      { question: "Explain the concept of event delegation in JavaScript", category: "JavaScript" },
      { question: "What is the difference between synchronous and asynchronous programming?", category: "Programming Concepts" },
      { question: "Can you explain how promises work in JavaScript?", category: "JavaScript" },
      { question: "What is the virtual DOM and how does React use it?", category: "React" },
      { question: "Explain the difference between SQL and NoSQL databases", category: "Databases" },
      { question: "What are design patterns and can you name a few?", category: "Software Design" },
      { question: "How does authentication differ from authorization?", category: "Security" },
      { question: "Explain the concept of middleware in web applications", category: "Backend Development" },
      { question: "What is responsive design and how do you implement it?", category: "Frontend Development" },
    ],
    hard: [
      { question: "Design a system for handling millions of concurrent users. What considerations would you make?", category: "System Design" },
      { question: "Explain how you would optimize a slow database query in a production system", category: "Performance Optimization" },
      { question: "Describe the CAP theorem and its implications for distributed systems", category: "Distributed Systems" },
      { question: "How would you implement a rate limiting system for an API?", category: "System Design" },
      { question: "Explain the trade-offs between microservices and monolithic architectures", category: "Architecture" },
      { question: "How would you design a caching strategy for a high-traffic application?", category: "Performance Optimization" },
      { question: "Describe your approach to debugging a memory leak in a production application", category: "Debugging" },
      { question: "How would you implement eventual consistency in a distributed system?", category: "Distributed Systems" },
      { question: "Explain the security considerations when building a payment processing system", category: "Security" },
      { question: "Design a scalable notification system that can handle multiple channels", category: "System Design" },
    ],
  },
  behavioral: {
    easy: [
      { question: "Tell me about yourself and your background in software development", category: "Introduction" },
      { question: "Why are you interested in this position?", category: "Motivation" },
      { question: "What are your strengths as a developer?", category: "Self-Assessment" },
      { question: "Describe a typical day in your current or most recent role", category: "Work Style" },
      { question: "What technologies are you most excited to learn?", category: "Growth Mindset" },
      { question: "How do you stay updated with new technologies and trends?", category: "Continuous Learning" },
      { question: "What type of work environment do you thrive in?", category: "Work Style" },
      { question: "Tell me about a project you're proud of", category: "Achievements" },
      { question: "What motivates you in your work?", category: "Motivation" },
      { question: "Where do you see yourself in five years?", category: "Career Goals" },
    ],
    medium: [
      { question: "Describe a time when you had to learn a new technology quickly. How did you approach it?", category: "Learning & Adaptability" },
      { question: "Tell me about a challenging bug you encountered and how you solved it", category: "Problem Solving" },
      { question: "Describe a situation where you disagreed with a team member. How did you handle it?", category: "Teamwork & Conflict" },
      { question: "Tell me about a time when you had to meet a tight deadline. What did you do?", category: "Time Management" },
      { question: "Describe a project that didn't go as planned. What did you learn from it?", category: "Learning from Failure" },
      { question: "Tell me about a time when you had to explain a technical concept to a non-technical person", category: "Communication" },
      { question: "Describe a situation where you took initiative to improve a process or system", category: "Initiative" },
      { question: "Tell me about a time when you received critical feedback. How did you respond?", category: "Growth Mindset" },
      { question: "Describe your experience working in an Agile environment", category: "Teamwork" },
      { question: "Tell me about a time when you had to balance multiple competing priorities", category: "Time Management" },
    ],
    hard: [
      { question: "Describe a time when you had to make a difficult architectural decision with limited information", category: "Decision Making" },
      { question: "Tell me about a situation where you had to lead a team through a major technical challenge", category: "Leadership" },
      { question: "Describe a time when you identified a critical security vulnerability. How did you handle it?", category: "Critical Thinking" },
      { question: "Tell me about a project where you had to balance technical debt with new feature development", category: "Strategic Thinking" },
      { question: "Describe a situation where you had to advocate for a significant technical change to stakeholders", category: "Influence & Communication" },
      { question: "Tell me about a time when you mentored a junior developer through a complex problem", category: "Leadership & Mentoring" },
      { question: "Describe how you handled a situation where a project was failing and needed to be turned around", category: "Crisis Management" },
      { question: "Tell me about a time when you had to refactor a large legacy codebase. What was your approach?", category: "Technical Leadership" },
      { question: "Describe a situation where you had to make trade-offs between performance, security, and time to market", category: "Strategic Thinking" },
      { question: "Tell me about your experience driving technical standards and best practices across a team or organization", category: "Leadership" },
    ],
  },
};

export function generateMockQuestions(
  jobRole: string,
  interviewType: 'technical' | 'behavioral' | 'mixed',
  difficulty: 'easy' | 'medium' | 'hard',
  numberOfQuestions: number
): QuestionTemplate[] {
  const questions: QuestionTemplate[] = [];

  if (interviewType === 'mixed') {
    // For mixed, get 50/50 split
    const technicalCount = Math.ceil(numberOfQuestions / 2);
    const behavioralCount = numberOfQuestions - technicalCount;

    questions.push(...getRandomQuestions(QUESTION_BANK.technical[difficulty], technicalCount));
    questions.push(...getRandomQuestions(QUESTION_BANK.behavioral[difficulty], behavioralCount));
  } else {
    // Get all questions from the specified type
    questions.push(...getRandomQuestions(QUESTION_BANK[interviewType][difficulty], numberOfQuestions));
  }

  // Shuffle and return requested number
  return shuffleArray(questions).slice(0, numberOfQuestions);
}

function getRandomQuestions(pool: QuestionTemplate[], count: number): QuestionTemplate[] {
  const shuffled = shuffleArray([...pool]);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
