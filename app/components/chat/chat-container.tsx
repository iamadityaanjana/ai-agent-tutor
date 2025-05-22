import { useState, useRef, useEffect } from 'react';
import { Message } from '../../lib/agents/types';
import { ChatMessage } from './chat-message';
import { ChatInput } from './chat-input';
import { v4 as uuidv4 } from 'uuid';

interface ChatContainerProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
  disabled?: boolean;
}

export function ChatContainer({ 
  messages, 
  onSendMessage, 
  isProcessing, 
  disabled = false 
}: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center">
            <div className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 p-8 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-12 w-12 text-white"
              >
                <path d="M5.8 11.3a4 4 0 0 0 1.5 7.6 4.4 4.4 0 0 0 4-2.3c.2-.3.4-.8.4-1.6s-.9-1.3-1.3-1.3h-.3c-.9 0-1.5-.6-1.5-1.5a1.5 1.5 0 0 1 1.5-1.5h1.6a3 3 0 0 0 0-6h-.4a.9.9 0 0 0-.8.8.8.8 0 0 1-.8.8h-.3a.9.9 0 0 1-.9-.8 1 1 0 0 0-.9-.8h-.3a1 1 0 0 0-1 1v.1a1 1 0 0 1-1 .9h-.3a.9.9 0 0 1-.9-.9.9.9 0 0 0-.9-.9H4" />
                <path d="M3 15h.3a.9.9 0 0 1 .9.9.9.9 0 0 0 .9.9h.3a.9.9 0 0 0 .9-.9V15" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold tracking-tight">Ask me anything</h3>
            <p className="mt-2 text-center text-muted-foreground">
              Start a conversation with our intelligent tutoring system.
              <br />
              I can help you with math, physics, and more.
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <ChatMessage 
                key={message.id}
                message={message} 
                isLast={index === messages.length - 1} 
              />
            ))}
          </>
        )}
        {isProcessing && (
          <div className="flex w-full items-center justify-center py-6">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-primary"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput 
        onSubmit={onSendMessage} 
        isLoading={isProcessing} 
        disabled={disabled}
      />
    </div>
  );
}
