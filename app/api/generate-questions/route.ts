import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { generateMockQuestions } from '@/lib/mock-questions';

export const runtime = 'edge';

interface GenerateQuestionsRequest {
  jobRole: string;
  company?: string;
  interviewType: 'technical' | 'behavioral' | 'mixed';
  difficulty: 'easy' | 'medium' | 'hard';
  numberOfQuestions: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateQuestionsRequest = await request.json();
    const { jobRole, company, interviewType, difficulty, numberOfQuestions } = body;

    // Validate input
    if (!jobRole || !interviewType || !difficulty || !numberOfQuestions) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (numberOfQuestions < 3 || numberOfQuestions > 10) {
      return NextResponse.json(
        { error: 'Number of questions must be between 3 and 10' },
        { status: 400 }
      );
    }

    // Build the prompt based on interview type and difficulty
    const companyContext = company ? ` at ${company}` : '';

    let interviewFocus = '';
    if (interviewType === 'technical') {
      interviewFocus = 'Focus exclusively on technical questions covering programming concepts, algorithms, system design, and technical problem-solving.';
    } else if (interviewType === 'behavioral') {
      interviewFocus = 'Focus exclusively on behavioral questions covering past experiences, soft skills, teamwork, leadership, and workplace scenarios.';
    } else {
      interviewFocus = 'Create a balanced mix of both technical and behavioral questions.';
    }

    let difficultyContext = '';
    if (difficulty === 'easy') {
      difficultyContext = 'Questions should be entry-level, suitable for junior positions or candidates with 0-2 years of experience.';
    } else if (difficulty === 'medium') {
      difficultyContext = 'Questions should be intermediate-level, suitable for mid-level positions or candidates with 2-5 years of experience.';
    } else {
      difficultyContext = 'Questions should be advanced-level, suitable for senior positions or candidates with 5+ years of experience.';
    }

    const prompt = `You are an expert technical recruiter creating interview questions for a ${jobRole} position${companyContext}.

Interview Type: ${interviewType}
Difficulty Level: ${difficulty}
Number of Questions: ${numberOfQuestions}

${interviewFocus}
${difficultyContext}

IMPORTANT INSTRUCTIONS:
1. Generate exactly ${numberOfQuestions} interview questions
2. Each question should be clear, professional, and relevant to the ${jobRole} position
3. For technical questions: Cover relevant technologies, concepts, and problem-solving skills
4. For behavioral questions: Use the STAR method framework (Situation, Task, Action, Result)
5. Avoid special characters like /, *, #, or formatting symbols (these will be read by a voice assistant)
6. Each question should be a complete, standalone question
7. Questions should be conversational and suitable for voice interaction

For each question, provide:
- question: The interview question text
- category: A brief category label (e.g., "JavaScript", "System Design", "Leadership", "Problem Solving")

Return ONLY a valid JSON array in this exact format, with no additional text or formatting:
[
  {
    "question": "Can you describe your experience with...",
    "category": "Experience"
  },
  {
    "question": "How would you approach...",
    "category": "Problem Solving"
  }
]`;

    console.log('Generating questions with Google AI...');

    let questions;
    let usedFallback = false;

    try {
      // Try to generate questions using Google AI
      const { text } = await generateText({
        model: google('gemini-2.0-flash-exp'),
        prompt: prompt,
        temperature: 0.7,
      });

      console.log('AI Response:', text);

      // Parse the response
      try {
        // Remove any markdown code blocks if present
        const cleanedText = text
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();

        questions = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        console.error('Raw text:', text);

        // Fallback: try to extract JSON array from the text
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          questions = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Failed to parse questions from AI response');
        }
      }
    } catch (aiError: any) {
      // Check if this is a quota error
      const errorMessage = aiError.message || '';
      const isQuotaError = errorMessage.includes('quota') ||
                          errorMessage.includes('rate limit') ||
                          errorMessage.includes('429');

      if (isQuotaError) {
        console.log('⚠️ AI quota exceeded, using high-quality fallback questions');
        usedFallback = true;

        // Use mock questions as fallback
        questions = generateMockQuestions(
          jobRole,
          interviewType,
          difficulty,
          numberOfQuestions
        );
      } else {
        // For other errors, throw them
        throw aiError;
      }
    }

    // Validate the questions format
    if (!Array.isArray(questions) || questions.length === 0) {
      console.log('⚠️ Invalid AI response, using fallback questions');
      usedFallback = true;
      questions = generateMockQuestions(
        jobRole,
        interviewType,
        difficulty,
        numberOfQuestions
      );
    }

    // Ensure all questions have the required fields
    const validatedQuestions = questions.map((q, index) => ({
      question: q.question || `Question ${index + 1}`,
      category: q.category || 'General',
    }));

    console.log(`Successfully generated ${validatedQuestions.length} questions${usedFallback ? ' (using fallback)' : ''}`);

    return NextResponse.json(
      {
        success: true,
        questions: validatedQuestions,
        usedFallback: usedFallback,
        message: usedFallback ? 'AI quota exceeded. Using high-quality curated questions.' : undefined
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error generating questions:', error);

    // Last resort: use mock questions
    try {
      const body: GenerateQuestionsRequest = await request.json();
      const { jobRole, interviewType, difficulty, numberOfQuestions } = body;

      console.log('⚠️ Critical error, using fallback questions');
      const fallbackQuestions = generateMockQuestions(
        jobRole,
        interviewType,
        difficulty,
        numberOfQuestions
      );

      return NextResponse.json(
        {
          success: true,
          questions: fallbackQuestions,
          usedFallback: true,
          message: 'Using high-quality curated questions. AI service temporarily unavailable.'
        },
        { status: 200 }
      );
    } catch (fallbackError) {
      // If even fallback fails, return error
      return NextResponse.json(
        {
          error: 'Failed to generate questions',
          details: error.message || 'Unknown error'
        },
        { status: 500 }
      );
    }
  }
}
