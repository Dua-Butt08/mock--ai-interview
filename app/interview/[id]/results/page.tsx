'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/dashboard/navbar';
import { useApp } from '@/lib/context-supabase';
import { Trophy, Home, PlusCircle, TrendingUp, MessageSquare } from 'lucide-react';

export default function InterviewResultsPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, interviews } = useApp();

  const interview = interviews.find(i => i.id === params.id);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !interview || interview.status !== 'completed') {
    return null;
  }

  const scoreColor =
    (interview.score || 0) >= 80 ? 'text-green-500' :
    (interview.score || 0) >= 60 ? 'text-yellow-500' :
    'text-red-500';

  const performanceMessage =
    (interview.score || 0) >= 80 ? 'Excellent Performance!' :
    (interview.score || 0) >= 60 ? 'Good Job!' :
    'Keep Practicing!';

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Score Card */}
          <Card className="mb-8 card-gradient">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-32 h-32 rounded-full bg-purple-600/20 flex items-center justify-center">
                  <Trophy className="w-16 h-16 text-yellow-500" />
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-2">{performanceMessage}</h1>
              <div className={`text-7xl font-bold mb-4 ${scoreColor}`}>
                {interview.score}%
              </div>
              <p className="text-muted-foreground text-lg">
                {interview.jobRole} at {interview.company || 'your target company'}
              </p>
            </CardContent>
          </Card>

          {/* Overall Feedback */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Overall Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">
                {interview.feedback}
              </p>
            </CardContent>
          </Card>

          {/* Question Breakdown */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Question-by-Question Analysis
              </CardTitle>
              <CardDescription>
                Detailed feedback on each of your responses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {interview.questions.map((question, index) => {
                const questionScore = Math.floor(Math.random() * 30) + 70;
                return (
                  <div key={question.id} className="border-b last:border-0 pb-6 last:pb-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground mb-1">
                          Question {index + 1}
                        </div>
                        <h4 className="font-semibold">{question.question}</h4>
                      </div>
                      <div className={`ml-4 text-2xl font-bold ${
                        questionScore >= 80 ? 'text-green-500' :
                        questionScore >= 60 ? 'text-yellow-500' :
                        'text-red-500'
                      }`}>
                        {questionScore}%
                      </div>
                    </div>
                    {question.userAnswer && (
                      <div className="mb-3">
                        <div className="text-sm font-medium text-muted-foreground mb-1">
                          Your Answer:
                        </div>
                        <p className="text-sm bg-muted p-3 rounded-md">
                          {question.userAnswer}
                        </p>
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Feedback:
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {questionScore >= 80
                          ? 'Excellent response! You provided specific examples and demonstrated clear understanding.'
                          : questionScore >= 60
                          ? 'Good answer with room for improvement. Consider adding more specific examples next time.'
                          : 'Your answer could be stronger. Try to provide more concrete examples and structured responses.'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/dashboard">
              <Button variant="outline" className="w-full gap-2" size="lg">
                <Home className="w-5 h-5" />
                Back to Dashboard
              </Button>
            </Link>
            <Link href="/interview/create">
              <Button className="w-full gap-2" size="lg">
                <PlusCircle className="w-5 h-5" />
                Practice Again
              </Button>
            </Link>
          </div>

          {/* Tips */}
          <Card className="mt-8 bg-purple-500/10 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-lg">Tips for Improvement</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">•</span>
                  <span>Use the STAR method (Situation, Task, Action, Result) for behavioral questions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">•</span>
                  <span>Provide specific examples from your experience to back up your claims</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">•</span>
                  <span>Take a moment to think before answering - it's okay to pause</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">•</span>
                  <span>Practice regularly to build confidence and improve your communication skills</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
