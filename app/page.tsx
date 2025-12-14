import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Mic, Brain, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <Image
          src="/pattern.png"
          alt="Background Pattern"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <nav className="flex justify-between items-center mb-20">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="AI Mock Interview Logo"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <h1 className="text-2xl font-bold gradient-text">AI Mock Interview</h1>
          </Link>
          <div className="flex gap-4">
            <Link
              href="/auth/login"
              className="px-6 py-2 text-sm font-medium text-white hover:text-purple-400 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="px-6 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </nav>

        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="flex justify-center mb-8">
            <Image
              src="/robot.png"
              alt="AI Robot Assistant"
              width={200}
              height={200}
              className="w-48 h-48 object-contain"
              priority
            />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
            Master Your Interview Skills with AI
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Practice real-time interviews with AI voice agents. Get instant feedback
            and improve your confidence before the big day.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-lg font-medium"
          >
            Start Practicing Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-20">
          <div className="card-gradient rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mic className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Voice Interviews</h3>
            <p className="text-gray-300">
              Practice with AI voice agents that simulate real interview scenarios
              with natural conversations.
            </p>
          </div>

          <div className="card-gradient rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">AI-Powered Feedback</h3>
            <p className="text-gray-300">
              Receive instant, detailed feedback on your answers powered by Google
              Gemini AI.
            </p>
          </div>

          <div className="card-gradient rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Track Progress</h3>
            <p className="text-gray-300">
              Monitor your improvement over time with detailed analytics and
              interview history.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto mt-24">
          <h3 className="text-4xl font-bold text-center mb-12 gradient-text">
            How It Works
          </h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                1
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">
                  Create Your Interview
                </h4>
                <p className="text-gray-300">
                  Specify the job role, company, and interview type. Our AI generates
                  tailored questions for you.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                2
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">
                  Practice with AI Voice
                </h4>
                <p className="text-gray-300">
                  Have a real conversation with our AI interviewer using voice.
                  Answer questions naturally just like in a real interview.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                3
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">
                  Get Instant Feedback
                </h4>
                <p className="text-gray-300">
                  Receive detailed analysis of your performance with actionable tips
                  to improve for your next interview.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
