'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Navbar } from '@/components/dashboard/navbar';
import { useApp } from '@/lib/context-supabase';
import { Sparkles } from 'lucide-react';

export default function CreateInterviewPage() {
  const router = useRouter();
  const { isAuthenticated, addInterview } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const [formData, setFormData] = useState({
    jobRole: '',
    company: '',
    interviewType: 'mixed' as 'technical' | 'behavioral' | 'mixed',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    numberOfQuestions: 5,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setInfo('');

    try {
      // Call AI API to generate questions
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to generate questions');
      }

      const { questions, usedFallback, message } = await response.json();

      // Show info message if fallback was used
      if (usedFallback && message) {
        setInfo(message);
      }

      // Format questions with IDs
      const formattedQuestions = questions.map((q: any, i: number) => ({
        id: `q${i + 1}`,
        question: q.question,
        category: q.category,
      }));

      await addInterview({
        ...formData,
        questions: formattedQuestions,
        status: 'pending',
      });

      router.push('/dashboard');
    } catch (err: any) {
      console.error('Error creating interview:', err);
      setError(err.message || 'Failed to create interview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Create New Interview</h1>
            <p className="text-muted-foreground">
              Customize your mock interview with AI-generated questions
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Interview Details
              </CardTitle>
              <CardDescription>
                Tell us about the position you're preparing for
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                {info && (
                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <p className="text-sm text-blue-400">ℹ️ {info}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="jobRole">Job Role</Label>
                  <Input
                    id="jobRole"
                    placeholder="e.g. Senior Frontend Developer"
                    value={formData.jobRole}
                    onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company (Optional)</Label>
                  <Input
                    id="company"
                    placeholder="e.g. Google"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Interview Type</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {['technical', 'behavioral', 'mixed'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, interviewType: type as any })}
                        className={`p-4 rounded-lg border-2 transition-colors ${
                          formData.interviewType === type
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-border hover:border-purple-300'
                        }`}
                      >
                        <div className="font-medium capitalize">{type}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Difficulty Level</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {['easy', 'medium', 'hard'].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setFormData({ ...formData, difficulty: level as any })}
                        className={`p-4 rounded-lg border-2 transition-colors ${
                          formData.difficulty === level
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-border hover:border-purple-300'
                        }`}
                      >
                        <div className="font-medium capitalize">{level}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numberOfQuestions">Number of Questions</Label>
                  <Input
                    id="numberOfQuestions"
                    type="number"
                    min="3"
                    max="10"
                    value={formData.numberOfQuestions}
                    onChange={(e) => setFormData({ ...formData, numberOfQuestions: parseInt(e.target.value) })}
                    required
                  />
                  <p className="text-sm text-muted-foreground">Choose between 3-10 questions</p>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/dashboard')}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading} className="flex-1 gap-2">
                    {isLoading ? (
                      <>Generating Questions...</>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Create Interview
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
