"use client";

import { ChatContainer } from '../components/chat/chat-container';
import { Container } from '../components/ui/container';
import { useState, useEffect } from 'react';
import { Message, ConversationContext } from '../lib/agents/types';
import { TutorAgent } from '../lib/agents/tutor-agent'; // Use the agent
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tutorAgent, setTutorAgent] = useState<TutorAgent | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize tutor agent on component mount
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKey) {
      setError('API key not found. Please check your environment variables.');
      return;
    }
    
    try {
      const agent = new TutorAgent(apiKey);
      setTutorAgent(agent);
    } catch (err) {
      console.error('Error initializing tutor agent:', err);
      setError('Failed to initialize the tutor agent.');
    }
  }, []);

  const handleSendMessage = async (content: string) => {
    if (!tutorAgent) return;

    const userMessageId = uuidv4();
    const userMessage: Message = {
      id: userMessageId,
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    setError(null); // Clear previous errors

    // Add a loading message from the agent
    const loadingMessageId = uuidv4();
    const loadingMessage: Message = {
      id: loadingMessageId,
      content: 'Thinking...',
      sender: 'agent', // Or a specific agent ID if you have it
      timestamp: new Date(),
      isLoading: true,
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const context: ConversationContext = {
        // Send only the last few messages to save tokens and potentially improve relevance
        history: messages.slice(-5), 
      };

      const response = await tutorAgent.process(content, context);

      const agentMessage: Message = {
        id: uuidv4(),
        content: response.content,
        sender: response.agentId as any,
        timestamp: new Date(),
        toolsUsed: response.toolsUsed,
      };

      // Replace loading message with actual response
      setMessages(prev => prev.map(msg => msg.id === loadingMessageId ? agentMessage : msg));

    } catch (err: any) {
      console.error('Error processing message:', err);
      const displayError = err.message || 'Sorry, I encountered an error while processing your request. Please try again.';
      
      const errorMessage: Message = {
        id: uuidv4(),
        content: displayError,
        sender: 'system',
        timestamp: new Date(),
      };
      // Remove loading message and add error message
      setMessages(prev => [...prev.filter(msg => msg.id !== loadingMessageId), errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-gray-950">
        <Container>
          <div className="flex h-14 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md overflow-hidden bg-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white p-1">
                  <path d="M19 6v12c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V6" />
                  <path d="M3 6h18" />
                  <path d="M10 10v8" />
                  <path d="M14 10v8" />
                  <path d="M12 6V3" />
                </svg>
              </div>
              <span className="font-bold">AI Tutor</span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/" className="text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                Home
              </Link>
            </nav>
          </div>
        </Container>
      </header>
      <main className="flex-1">
        {error ? (
          <Container className="flex items-center justify-center h-full">
            <div className="text-center p-4">
              <h2 className="text-2xl font-bold text-red-500">Error</h2>
              <p className="mt-2">{error}</p>
              <p className="mt-4">
                Please check your API key configuration in the environment variables.
              </p>
            </div>
          </Container>
        ) : (
          <ChatContainer 
            messages={messages}
            onSendMessage={handleSendMessage}
            isProcessing={isProcessing}
            disabled={!tutorAgent}
          />
        )}
      </main>
    </div>
  );
}
