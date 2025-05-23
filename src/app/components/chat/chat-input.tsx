"use client";

import { Button } from '../../components/ui/button';
import { useState, FormEvent } from 'react';
import { SendIcon } from 'lucide-react';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSubmit, isLoading, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const message = input.trim();
    if (message && !isLoading) {
      onSubmit(message);
      setInput('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="sticky bottom-0 z-10 bg-white dark:bg-slate-900 border-t dark:border-slate-700 p-4 w-full"
    >
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about any subject..."
            rows={input.split('\n').length > 3 ? Math.min(8, input.split('\n').length) : 1}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none overflow-y-auto"
            disabled={isLoading || disabled}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          {input && (
            <div className="absolute right-2 bottom-2 text-xs text-gray-400">
              {input.length} chars
            </div>
          )}
        </div>
        <Button 
          type="submit" 
          size="icon" 
          variant="gradient"
          disabled={isLoading || disabled || !input.trim()}
        >
          <SendIcon className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </form>
  );
}
