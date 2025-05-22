import { Heading } from '../app/components/ui/heading';
import { Container } from '../app/components/ui/container';
import { Button } from '../app/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Image 
                src="/images/logo.svg" 
                alt="AI Tutor Logo" 
                width={40} 
                height={40}
                className="rounded-md"
              />
              <span className="text-xl font-bold">AI Tutor</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                Home
              </Link>
              <Link href="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                About
              </Link>
              <Link href="/features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Features
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <Button asChild variant="gradient">
                <Link href="/chat">Start Learning</Link>
              </Button>
            </div>
          </div>
        </Container>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-24 lg:py-32 xl:py-48">
          <Container>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <Heading 
                title="Learn Any Subject With AI Tutors"
                subtitle="Our intelligent multi-agent system provides personalized tutoring in mathematics, physics, and more with specialized AI agents and tools."
                gradient={true}
              />
              <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="gradient" className="w-full sm:w-auto">
                  <Link href="/chat">Start Learning Now</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                  <Link href="/features">Explore Features</Link>
                </Button>
              </div>
            </div>
          </Container>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-24 lg:py-32 bg-slate-50 dark:bg-slate-900">
          <Container>
            <Heading 
              title="Specialized AI Tutors"
              subtitle="Our multi-agent system connects you with subject matter experts"
              className="mb-12"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Math Agent Card */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                    <path d="M19 6v12c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V6" />
                    <path d="M3 6h18" />
                    <path d="M10 10v8" />
                    <path d="M14 10v8" />
                    <path d="M12 6V3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Math Agent</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Expert in mathematics from algebra to calculus with step-by-step solutions
                </p>
              </div>
              
              {/* Physics Agent Card */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600 dark:text-indigo-400">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m16 8-4 4-4-4" />
                    <path d="M12 16V8" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Physics Agent</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Specializes in physics concepts, formulas, and problem-solving techniques
                </p>
              </div>
              
              {/* Tools Card */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600 dark:text-purple-400">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Specialized Tools</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Interactive calculators, formula lookups, and visualizations to enhance learning
                </p>
              </div>
            </div>
          </Container>
        </section>
        
        {/* How It Works Section */}
        <section className="py-12 md:py-24 lg:py-32">
          <Container>
            <Heading 
              title="How It Works"
              subtitle="Our multi-agent architecture provides specialized knowledge and tools"
              className="mb-12"
            />
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-1/2 order-2 md:order-1">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                      1
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Ask Your Question</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Type any question related to math, physics, or other subjects in the chat interface.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                      2
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Tutor Agent Analyzes</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        The main Tutor Agent analyzes your question and determines which specialist agent can best help.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                      3
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Specialist Agent Responds</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        The specialist agent (Math, Physics, etc.) processes your question and provides an expert response.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                      4
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Interactive Learning</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Continue the conversation, ask follow-up questions, and deepen your understanding.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 order-1 md:order-2">
                <div className="relative h-[400px] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3/4 space-y-4">
                      <div className="rounded-lg bg-white p-4 shadow-md dark:bg-slate-900">
                        <p className="text-sm">What is the quadratic formula and how do I use it?</p>
                      </div>
                      <div className="ml-auto w-4/5 rounded-lg bg-blue-500 p-4 text-white shadow-md">
                        <p className="text-sm font-medium">Math Agent:</p>
                        <p className="text-sm">The quadratic formula is used to solve quadratic equations of the form ax² + bx + c = 0. The formula is:</p>
                        <p className="my-2 text-center font-bold">x = (-b ± √(b² - 4ac)) / 2a</p>
                        <p className="text-sm">Would you like me to show you an example of how to use it?</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <Container>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <Heading 
                title="Ready to Learn with AI?"
                subtitle="Start your personalized learning journey with our AI Tutor system today."
                className="text-white"
                subtitleClassName="text-blue-100"
              />
              <Button asChild size="lg" className="mt-6 bg-white text-blue-600 hover:bg-blue-50">
                <Link href="/chat">Start Learning Now</Link>
              </Button>
            </div>
          </Container>
        </section>
      </main>
      <footer className="border-t bg-slate-50 dark:bg-slate-950">
        <Container>
          <div className="flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
            <div className="flex flex-col items-center gap-4 md:flex-row">
              <Image 
                src="/images/logo.svg" 
                alt="AI Tutor Logo" 
                width={30} 
                height={30}
                className="rounded-md"
              />
              <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                &copy; {new Date().getFullYear()} AI Tutor. All rights reserved.
              </p>
            </div>
            <div className="flex gap-4">
              <Link 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer" 
                className="text-muted-foreground hover:text-foreground"
              >
                Twitter
              </Link>
              <Link 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground" 
              >
                GitHub
              </Link>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}
