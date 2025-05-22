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
      className="sticky bottom-0 z-10 bg-white dark:bg-slate-900 border-t dark:border-slate-700 p-4"
    >
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about any subject..."
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading || disabled}
          />
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
