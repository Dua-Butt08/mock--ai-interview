/**
 * VAPI Assistant Configuration for AI Mock Interview
 * This file contains the assistant configuration for the voice interview feature
 */

export interface InterviewAssistantConfig {
  jobRole: string;
  company?: string;
  interviewType: 'technical' | 'behavioral' | 'mixed';
  difficulty: 'easy' | 'medium' | 'hard';
  currentQuestion: string;
  questionCategory: string;
}

/**
 * Creates a VAPI assistant configuration for conducting interviews
 */
export const createInterviewAssistantConfig = (config: InterviewAssistantConfig) => {
  return {
    name: `AI Interview Assistant - ${config.jobRole}`,
    transcriber: {
      provider: 'deepgram',
      model: 'nova-2',
      language: 'en-US',
    },
    voice: {
      provider: '11labs' as const,
      voiceId: 'sarah', // Professional female voice
    },
    model: {
      provider: 'openai',
      model: 'gpt-4o',
      temperature: 0.7,
      systemPrompt: `You are an experienced and professional interviewer conducting a ${config.interviewType} interview for the position of ${config.jobRole}${config.company ? ` at ${config.company}` : ''}.

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
6. After fully exploring the topic, signal readiness for the next question

Behavioral Guidelines:
- Professional yet warm and approachable
- Patient - allow thinking time without pressure
- For technical questions: Probe for conceptual understanding, not just rote memorization
- For behavioral questions: Guide using STAR method (Situation, Task, Action, Result)
- Provide constructive, balanced feedback
- Keep your responses concise (30-50 words typically)
- Use natural speech patterns suitable for voice conversation

Interview Flow:
1. Start by asking: "${config.currentQuestion}"
2. Listen to the complete answer
3. Ask follow-up questions based on their response
4. When satisfied with their answer, say: "Thank you for that answer. I think we've covered this well."
5. Wait for the candidate to signal they're ready for the next question

Remember: You're evaluating both technical competency and communication skills. Be encouraging but maintain professional assessment standards.`,
    },
    firstMessage: `Hello! I'm your AI interviewer for this ${config.interviewType} interview session. I'll be asking you questions about the ${config.jobRole} position${config.company ? ` at ${config.company}` : ''}.

Take your time with your answers, and feel free to ask for clarification if needed. Let's begin with our first question:

${config.currentQuestion}`,
    recordingEnabled: true,
    endCallMessage: 'Thank you for your time today. Best of luck with your interview process!',
    endCallPhrases: [
      "I'm done with this question",
      "Let's move to the next question",
      "Next question please",
      "I've finished my answer"
    ],
    maxDurationSeconds: 600, // 10 minutes per question max
    silenceTimeoutSeconds: 30,
  };
};

/**
 * Assistant configuration presets for different interview types
 */
export const ASSISTANT_PRESETS = {
  technical: {
    voice: {
      provider: '11labs' as const,
      voiceId: 'sarah',
    },
    temperature: 0.6, // More focused for technical questions
  },
  behavioral: {
    voice: {
      provider: '11labs' as const,
      voiceId: 'sarah',
    },
    temperature: 0.8, // More conversational for behavioral questions
  },
  mixed: {
    voice: {
      provider: '11labs' as const,
      voiceId: 'sarah',
    },
    temperature: 0.7, // Balanced approach
  },
};
