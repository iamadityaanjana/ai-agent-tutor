import { Heading } from '../app/components/ui/heading';
import { Container } from '../app/components/ui/container';
import { Button } from '../app/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Zap, Brain, BookOpen, Users, MessageSquarePlus } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-900 text-slate-50">
      <header className="sticky top-0 z-50 w-full border-b border-slate-700 bg-slate-900/80 backdrop-blur">
        <Container>
          <div className="flex h-20 items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="/images/logo.svg" 
                alt="AI Tutor Logo" 
                width={48} 
                height={48}
                className="rounded-lg"
              />
              <span className="text-2xl font-bold tracking-tight text-white">
                AI Tutor Pro
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium text-slate-300 transition-colors hover:text-purple-400">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm font-medium text-slate-300 transition-colors hover:text-purple-400">
                How it Works
              </Link>
              <Link href="/about" className="text-sm font-medium text-slate-300 transition-colors hover:text-purple-400">
                About
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <Button asChild variant="primary" size="lg" className="shadow-lg transition-shadow duration-300">
                <Link href="/chat">Start Learning</Link>
              </Button>
            </div>
          </div>
        </Container>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 lg:py-48 xl:py-60 overflow-hidden">
          <Container>
            <div className="flex flex-col items-center justify-center space-y-8 text-center">
              <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-white">
                Unlock Your Potential with AI Tutors
              </h1>
              <p className="max-w-2xl text-lg text-slate-300 md:text-xl lg:text-2xl">
                Our intelligent multi-agent system provides personalized tutoring in mathematics, physics, and more, powered by cutting-edge AI.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-6 justify-center">
                <Button asChild size="lg" variant="primary" className="w-full sm:w-auto text-lg px-8 py-4 shadow-lg transition-all duration-300">
                  <Link href="/chat">Get Started Free</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-4 border-slate-600 hover:bg-slate-700 transition-all duration-300">
                  <Link href="#features">Explore Features</Link>
                </Button>
              </div>
            </div>
          </Container>
        </section>

        {/* Features Section - Redesigned */}
        <section id="features" className="py-16 md:py-24 lg:py-32 bg-slate-800">
          <Container>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-white">
                Why Choose AI Tutor Pro?
              </h2>
              <p className="mt-4 text-lg text-slate-400 max-w-xl mx-auto">
                Discover the powerful features that make learning effective and engaging.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature Card 1: Specialized Agents */}
              <div className="bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700 flex flex-col items-center text-center transition-transform duration-300">
                <div className="p-4 rounded-full bg-blue-600 mb-6">
                  <Brain size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-slate-100">Specialized AI Agents</h3>
                <p className="text-slate-400 leading-relaxed">
                  Learn from AI tutors expert in specific subjects like Math and Physics, providing tailored guidance.
                </p>
              </div>
              
              {/* Feature Card 2: Interactive Tools */}
              <div className="bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700 flex flex-col items-center text-center transition-transform duration-300">
                <div className="p-4 rounded-full bg-blue-600 mb-6">
                  <Zap size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-slate-100">Interactive Tools</h3>
                <p className="text-slate-400 leading-relaxed">
                  Utilize integrated tools like calculators and formula lookups for a hands-on learning experience.
                </p>
              </div>

              {/* Feature Card 3: Personalized Learning */}
              <div className="bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700 flex flex-col items-center text-center transition-transform duration-300">
                <div className="p-4 rounded-full bg-blue-600 mb-6">
                  <Users size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-slate-100">Personalized Learning Paths</h3>
                <p className="text-slate-400 leading-relaxed">
                  AI adapts to your learning style and pace, ensuring concepts are understood thoroughly.
                </p>
              </div>
            </div>
          </Container>
        </section>
        
        {/* How It Works Section - New */}
        <section id="how-it-works" className="py-16 md:py-24 lg:py-32">
          <Container>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-white">
                Simple Steps to Mastery
              </h2>
              <p className="mt-4 text-lg text-slate-400 max-w-xl mx-auto">
                Our multi-agent system makes complex learning intuitive and accessible.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center p-6">
                <div className="p-5 rounded-full bg-blue-600 mb-5 text-white text-3xl font-bold">1</div>
                <h3 className="text-xl font-semibold mb-2 text-slate-100">Choose Your Subject</h3>
                <p className="text-slate-400">Select from a growing list of subjects like Math, Physics, and more.</p>
              </div>
              <div className="flex flex-col items-center p-6">
                <div className="p-5 rounded-full bg-blue-600 mb-5 text-white text-3xl font-bold">2</div>
                <h3 className="text-xl font-semibold mb-2 text-slate-100">Interact with AI Tutors</h3>
                <p className="text-slate-400">Engage in conversations, ask questions, and get detailed explanations.</p>
              </div>
              <div className="flex flex-col items-center p-6">
                <div className="p-5 rounded-full bg-blue-600 mb-5 text-white text-3xl font-bold">3</div>
                <h3 className="text-xl font-semibold mb-2 text-slate-100">Utilize Smart Tools</h3>
                <p className="text-slate-400">Access calculators, formula sheets, and other resources on-demand.</p>
              </div>
            </div>
          </Container>
        </section>

        {/* Call to Action Section - New */}
        <section className="py-16 md:py-24 lg:py-32 bg-slate-800">
          <Container>
            <div className="bg-blue-600 p-12 rounded-xl shadow-lg text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Elevate Your Learning?</h2>
              <p className="text-lg text-white mb-8 max-w-lg mx-auto">
                Join thousands of students transforming their education with AI Tutor Pro. Start your journey today!
              </p>
              <Button asChild size="lg" variant="outline" className="bg-white text-blue-700 border-transparent text-lg px-10 py-4 transition-all duration-300">
                <Link href="/chat">Start Learning Now</Link>
              </Button>
            </div>
          </Container>
        </section>

        {/* Placeholder for Testimonials - New */}
        <section className="py-16 md:py-24 lg:py-32">
          <Container>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-white">
                Loved by Learners
              </h2>
              <p className="mt-4 text-lg text-slate-400">This section will feature testimonials from users.</p>
            </div>
            {/* Testimonial cards will go here */}
          </Container>
        </section>
      </main>

      <footer className="py-8 border-t border-slate-700 bg-slate-900">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Image src="/images/logo.svg" alt="AI Tutor Logo" width={28} height={28} className="rounded-sm" />
              <span className="text-sm text-slate-400">&copy; {new Date().getFullYear()} AI Tutor Pro. All rights reserved.</span>
            </div>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-slate-400 hover:text-purple-400">Privacy Policy</Link>
              <Link href="/terms" className="text-sm text-slate-400 hover:text-purple-400">Terms of Service</Link>
            </div>
          </div>
        </Container>
      </footer>
      {/* <TestComponent /> */} {/* Ensure TestComponent is removed or commented out if not needed */}
    </div>
  );
}

/* 
  We've removed gradient animations for a minimal design.
  If you want to add them back in the future, you can uncomment the code below:

@keyframes gradient-xy {
  0%, 100% {
    background-size: 400% 400%;
    background-position: left center;
  }
  50% {
    background-size: 200% 200%;
    background-position: right center;
  }
}

.animate-gradient-xy {
  animation: gradient-xy 15s ease infinite;
}
*/
