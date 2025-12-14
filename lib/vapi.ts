'use client';

import Vapi from '@vapi-ai/web';

// Initialize Vapi client
let vapiInstance: Vapi | null = null;

export const getVapiClient = () => {
  if (!vapiInstance && typeof window !== 'undefined') {
    const publicKey = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN;
    if (!publicKey) {
      console.error('NEXT_PUBLIC_VAPI_WEB_TOKEN is not set in environment variables');
      return null;
    }
    vapiInstance = new Vapi(publicKey);
  }
  return vapiInstance;
};

// Interview assistant configuration
export interface InterviewAssistantConfig {
  jobRole: string;
  company?: string;
  interviewType: 'technical' | 'behavioral' | 'mixed';
  difficulty: 'easy' | 'medium' | 'hard';
  currentQuestion: string;
  questionCategory: string;
}

export const createInterviewAssistant = (config: InterviewAssistantConfig) => {
  return {
    name: `AI Interview - ${config.jobRole}`,
    transcriber: {
      provider: 'deepgram',
      model: 'nova-2',
      language: 'en-US',
    },
    voice: {
      provider: '11labs',
      voiceId: 'sarah', // Professional, clear voice
    },
    model: {
      provider: 'openai',
      model: 'gpt-4o',
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: `You are an experienced and professional interviewer conducting a ${config.interviewType} interview for the position of ${config.jobRole}${config.company ? ` at ${config.company}` : ''}.

Interview Details:
- Difficulty Level: ${config.difficulty}
- Question Category: ${config.questionCategory}
- Current Question: ${config.currentQuestion}

Your Responsibilities:
1. Present the interview question clearly and professionally
2. Listen actively to the candidate's response
3. Ask 2-3 relevant follow-up questions to assess deeper understanding
4. Provide subtle hints if the candidate struggles (without giving away the answer)
5. Maintain a natural, encouraging conversation flow
6. After fully exploring the topic, thank them for their answer

Behavioral Guidelines:
- Professional yet warm and approachable
- Patient - allow thinking time without pressure
- For technical questions: Probe for conceptual understanding, not just rote memorization
- For behavioral questions: Guide using STAR method (Situation, Task, Action, Result)
- Provide constructive, balanced feedback
- Keep your responses concise (30-50 words typically)
- Use natural speech patterns suitable for voice conversation

Remember: You're evaluating both technical competency and communication skills. Be encouraging but maintain professional assessment standards.`,
        },
      ],
    },
    firstMessage: `Hello! I'm your AI interviewer for this ${config.interviewType} interview session. I'll be asking you questions about the ${config.jobRole} position${config.company ? ` at ${config.company}` : ''}.

Take your time with your answers. Let's begin with our first question:

${config.currentQuestion}`,
    recordingEnabled: true,
    endCallMessage: 'Thank you for your time. Best of luck with your interview!',
    maxDurationSeconds: 600, // 10 minutes per question
    silenceTimeoutSeconds: 30,
  };
};

export const startInterviewCall = async (config: InterviewAssistantConfig) => {
  const vapi = getVapiClient();
  if (!vapi) {
    throw new Error('Vapi client not initialized');
  }

  const assistant = createInterviewAssistant(config);

  try {
    await vapi.start(assistant);
    return vapi;
  } catch (error) {
    console.error('Failed to start Vapi call:', error);
    throw error;
  }
};

export const stopInterviewCall = async () => {
  const vapi = getVapiClient();
  if (!vapi) {
    throw new Error('Vapi client not initialized');
  }

  try {
    await vapi.stop();
  } catch (error) {
    console.error('Failed to stop Vapi call:', error);
    throw error;
  }
};

export type VapiEvent =
  | { type: 'call-start' }
  | { type: 'call-end' }
  | { type: 'speech-start' }
  | { type: 'speech-end' }
  | { type: 'message'; message: { role: string; content: string } }
  | { type: 'error'; error: Error };
