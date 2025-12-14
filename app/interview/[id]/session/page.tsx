'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/dashboard/navbar';
import { useApp } from '@/lib/context-supabase';
import { getVapiClient, startInterviewCall, stopInterviewCall } from '@/lib/vapi';
import { SkipForward, CheckCircle, MessageSquare, Phone, PhoneOff, Mic } from 'lucide-react';

export default function InterviewSessionPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, interviews, updateInterview } = useApp();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'active' | 'ended'>('idle');

  const interview = interviews.find(i => i.id === params.id);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
    if (interview && interview.status === 'pending') {
      updateInterview(interview.id, { status: 'in-progress' });
    }
  }, [isAuthenticated, router, interview]);

  useEffect(() => {
    const vapi = getVapiClient();
    if (!vapi) return;

    const handleCallStart = () => {
      setIsCallActive(true);
      setCallStatus('active');
    };

    const handleCallEnd = () => {
      setIsCallActive(false);
      setCallStatus('ended');
      setIsSpeaking(false);
    };

    const handleSpeechStart = () => {
      setIsSpeaking(true);
    };

    const handleSpeechEnd = () => {
      setIsSpeaking(false);
    };

    const handleMessage = (message: any) => {
      if (message.role === 'user') {
        setTranscript(prev => prev + (prev ? '\n\n' : '') + 'You: ' + message.content);
      } else if (message.role === 'assistant') {
        setTranscript(prev => prev + (prev ? '\n\n' : '') + 'AI: ' + message.content);
      }
    };

    const handleError = (error: any) => {
      console.error('Vapi error:', error);
      setCallStatus('idle');
      setIsCallActive(false);
    };

    vapi.on('call-start', handleCallStart);
    vapi.on('call-end', handleCallEnd);
    vapi.on('speech-start', handleSpeechStart);
    vapi.on('speech-end', handleSpeechEnd);
    vapi.on('message', handleMessage);
    vapi.on('error', handleError);

    return () => {
      vapi.off('call-start', handleCallStart);
      vapi.off('call-end', handleCallEnd);
      vapi.off('speech-start', handleSpeechStart);
      vapi.off('speech-end', handleSpeechEnd);
      vapi.off('message', handleMessage);
      vapi.off('error', handleError);
    };
  }, []);

  if (!isAuthenticated || !interview) {
    return null;
  }

  const currentQuestion = interview.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === interview.questions.length - 1;

  const handleStartCall = async () => {
    try {
      setCallStatus('connecting');
      await startInterviewCall({
        jobRole: interview.jobRole,
        company: interview.company,
        interviewType: interview.interviewType,
        difficulty: interview.difficulty,
        currentQuestion: currentQuestion.question,
        questionCategory: currentQuestion.category,
      });
    } catch (error) {
      console.error('Failed to start call:', error);
      setCallStatus('idle');
    }
  };

  const handleEndCall = async () => {
    try {
      await stopInterviewCall();
      if (transcript) {
        setAnswer(transcript);
      }
    } catch (error) {
      console.error('Failed to end call:', error);
    }
  };

  const handleNextQuestion = async () => {
    if (isCallActive) {
      await handleEndCall();
    }

    const finalAnswer = answer || transcript || 'No answer provided';
    const newAnswers = [...answers, finalAnswer];
    setAnswers(newAnswers);
    setAnswer('');
    setTranscript('');

    if (isLastQuestion) {
      const updatedQuestions = interview.questions.map((q, i) => ({
        ...q,
        userAnswer: newAnswers[i],
      }));

      await updateInterview(interview.id, {
        status: 'completed',
        completedAt: new Date(),
        score: Math.floor(Math.random() * 20) + 75,
        feedback: 'Great job! You demonstrated strong knowledge and communication skills.',
        questions: updatedQuestions,
      });

      router.push(`/interview/${interview.id}/results`);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCallStatus('idle');
    }
  };

  const handleSkip = async () => {
    if (isCallActive) {
      await handleEndCall();
    }

    const newAnswers = [...answers, 'Skipped'];
    setAnswers(newAnswers);
    setAnswer('');
    setTranscript('');

    if (isLastQuestion) {
      router.push(`/interview/${interview.id}/results`);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCallStatus('idle');
    }
  };

  const hasAnswer = answer.trim() || transcript.trim();

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Image
                  src="/ai-avatar.png"
                  alt="AI Interviewer"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <h1 className="text-2xl font-bold">{interview.jobRole}</h1>
                  <p className="text-sm text-muted-foreground">
                    {interview.company || 'Interview Practice'}
                  </p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {interview.questions.length}
              </div>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / interview.questions.length) * 100}%` }}
              />
            </div>
          </div>

          <Card className="mb-6 border-purple-500/20">
            <CardHeader>
              <CardDescription className="text-xs uppercase tracking-wider text-purple-400">
                {currentQuestion.category}
              </CardDescription>
              <CardTitle className="text-2xl text-white">{currentQuestion.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <div className="text-center">
                    {callStatus === 'idle' && (
                      <p className="text-sm text-muted-foreground">Click to start voice interview</p>
                    )}
                    {callStatus === 'connecting' && (
                      <p className="text-sm text-blue-400">Connecting...</p>
                    )}
                    {callStatus === 'active' && (
                      <div className="space-y-2">
                        <p className="text-sm text-green-400">Call Active</p>
                        {isSpeaking && (
                          <div className="flex items-center justify-center gap-2">
                            <Mic className="w-4 h-4 text-green-400 animate-pulse" />
                            <span className="text-xs text-green-400">Listening...</span>
                          </div>
                        )}
                      </div>
                    )}
                    {callStatus === 'ended' && (
                      <p className="text-sm text-gray-400">Call Ended</p>
                    )}
                  </div>

                  {!isCallActive ? (
                    <Button
                      onClick={handleStartCall}
                      disabled={callStatus === 'connecting'}
                      className="w-32 h-32 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50"
                    >
                      <Phone className="w-12 h-12" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleEndCall}
                      className="w-32 h-32 rounded-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
                    >
                      <PhoneOff className="w-12 h-12" />
                    </Button>
                  )}

                  <p className="text-xs text-muted-foreground">
                    {isCallActive ? 'Click to end call' : 'Start voice interview with AI'}
                  </p>
                </div>

                {transcript && (
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Conversation Transcript:
                    </label>
                    <div className="w-full min-h-[150px] max-h-[300px] p-4 bg-secondary border border-border rounded-lg text-foreground overflow-y-auto whitespace-pre-wrap">
                      {transcript || 'Transcript will appear here...'}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Or type your answer (optional):
                  </label>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="You can also type your answer here..."
                    className="w-full min-h-[100px] p-4 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    disabled={isCallActive}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleSkip}
                    className="flex-1 gap-2"
                    disabled={isCallActive}
                  >
                    <SkipForward className="w-4 h-4" />
                    Skip
                  </Button>
                  <Button
                    onClick={handleNextQuestion}
                    disabled={!hasAnswer || isCallActive}
                    className="flex-1 gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {isLastQuestion ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Complete Interview
                      </>
                    ) : (
                      <>
                        Next Question
                        <SkipForward className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-500/10 border-blue-500/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-300">
                  <strong className="text-white">Voice Interview Tips:</strong>
                  <ul className="mt-2 space-y-1 list-disc list-inside">
                    <li>Speak clearly and at a natural pace</li>
                    <li>The AI will ask follow-up questions</li>
                    <li>Take your time to think before answering</li>
                    <li>Use the STAR method for behavioral questions</li>
                    <li>You can end the call when you're done answering</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {answers.length > 0 && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              You've answered {answers.length} question{answers.length !== 1 ? 's' : ''} so far
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
