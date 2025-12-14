'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/dashboard/navbar';
import { useApp } from '@/lib/context-supabase';
import { PlusCircle, Clock, CheckCircle, TrendingUp, Calendar } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, interviews, isAuthenticated } = useApp();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const completedInterviews = interviews.filter(i => i.status === 'completed');
  const pendingInterviews = interviews.filter(i => i.status === 'pending');
  const averageScore = completedInterviews.length > 0
    ? Math.round(completedInterviews.reduce((sum, i) => sum + (i.score || 0), 0) / completedInterviews.length)
    : 0;

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground">Track your progress and continue practicing</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{interviews.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedInterviews.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingInterviews.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageScore}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Action */}
        <Card className="mb-8 card-gradient">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h3 className="text-xl font-bold mb-1">Ready for your next interview?</h3>
              <p className="text-muted-foreground">Create a new mock interview and start practicing</p>
            </div>
            <Link href="/interview/create">
              <Button size="lg" className="gap-2">
                <PlusCircle className="w-5 h-5" />
                Create Interview
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Interviews */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Interviews</h2>
          <div className="grid gap-4">
            {interviews.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">No interviews yet</p>
                  <Link href="/interview/create">
                    <Button>Create Your First Interview</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              interviews.map((interview) => (
                <Card key={interview.id} className="hover:border-purple-500 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{interview.jobRole}</CardTitle>
                        <CardDescription>{interview.company}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {interview.status === 'completed' && interview.score && (
                          <div className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm font-medium">
                            {interview.score}%
                          </div>
                        )}
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          interview.status === 'completed'
                            ? 'bg-green-500/20 text-green-500'
                            : interview.status === 'in-progress'
                            ? 'bg-blue-500/20 text-blue-500'
                            : 'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          {interview.status}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span className="capitalize">{interview.interviewType} Interview</span>
                        <span>•</span>
                        <span className="capitalize">{interview.difficulty} Level</span>
                        <span>•</span>
                        <span>{interview.questions.length} Questions</span>
                      </div>
                      <div className="flex gap-2">
                        {interview.status === 'pending' && (
                          <Link href={`/interview/${interview.id}/session`}>
                            <Button>Start Interview</Button>
                          </Link>
                        )}
                        {interview.status === 'completed' && (
                          <Link href={`/interview/${interview.id}/results`}>
                            <Button variant="outline">View Results</Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
