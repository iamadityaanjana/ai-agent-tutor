"use client";

import { ChatContainer } from '../components/chat/chat-container';
import { Container } from '../components/ui/container';
import { useState, useEffect } from 'react';
import { Message, ConversationContext } from '../lib/agents/types';
import { TutorAgent } from '../lib/agents/tutor-agent';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';
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
    
    // Add user message to chat
    const userMessage: Message = {
      id: uuidv4(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    
    try {
      // Create context from conversation history
      const context: ConversationContext = {
        history: [...messages, userMessage],
      };
      
      // Process the message with the tutor agent
      const response = await tutorAgent.process(content, context);
      
      // Add agent's response to chat
      const agentMessage: Message = {
        id: uuidv4(),
        content: response.content,
        sender: response.agentId as any, // Type casting here for simplicity
        timestamp: new Date(),
        toolsUsed: response.toolsUsed,
      };
      
      setMessages(prev => [...prev, agentMessage]);
    } catch (err) {
      console.error('Error processing message:', err);
      
      // Add error message
      const errorMessage: Message = {
        id: uuidv4(),
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        sender: 'system',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <Container>
          <div className="flex h-14 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600">
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
              <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
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
