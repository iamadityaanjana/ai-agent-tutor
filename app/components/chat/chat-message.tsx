import { Message } from '../../lib/agents/types';
import { cn } from '../../lib/utils/cn';
import { CalculatorIcon, BookOpenIcon, BrainIcon } from 'lucide-react';
import Image from 'next/image';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

interface ChatMessageProps {
  message: Message;
  isLast?: boolean;
}

export function ChatMessage({ message, isLast }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  
  // Get the appropriate avatar and background color based on sender
  const getSenderInfo = () => {
    switch (message.sender) {
      case 'user':
        return {
          avatar: (
            <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-r from-sky-400 to-blue-600">
              <span className="font-semibold text-sm text-white">You</span>
            </div>
          ),
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          textColor: 'text-blue-800 dark:text-blue-200'
        };
      case 'tutor':
        return {
          avatar: (
            <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600">
              <BrainIcon className="h-4 w-4 text-white" />
            </div>
          ),
          bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
          textColor: 'text-indigo-800 dark:text-indigo-200'
        };
      case 'math':
        return {
          avatar: (
            <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-600">
              <CalculatorIcon className="h-4 w-4 text-white" />
            </div>
          ),
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          textColor: 'text-green-800 dark:text-green-200'
        };
      case 'physics':
        return {
          avatar: (
            <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-600">
              <BookOpenIcon className="h-4 w-4 text-white" />
            </div>
          ),
          bgColor: 'bg-orange-50 dark:bg-orange-900/20',
          textColor: 'text-orange-800 dark:text-orange-200'
        };
      default:
        return {
          avatar: (
            <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-gray-500">
              <span className="font-semibold text-sm text-white">AI</span>
            </div>
          ),
          bgColor: 'bg-gray-50 dark:bg-gray-800',
          textColor: 'text-gray-800 dark:text-gray-200'
        };
    }
  };
  
  const { avatar, bgColor, textColor } = getSenderInfo();
  
  // Format message content to properly display LaTeX formulas
  const formatContent = (content: string) => {
    // Check if content has TeX-like patterns
    const hasTeXPatterns = /\$\$[\s\S]+?\$\$|\$[\s\S]+?\$|\\begin\{.+?\}[\s\S]+?\\end\{.+?\}/.test(content);
    
    if (hasTeXPatterns) {
      return <Latex>{content}</Latex>;
    }
    
    return content;
  };
  
  return (
    <div className={cn(
      'flex w-full items-start gap-4 p-4',
      isUser ? 'justify-end' : 'justify-start',
    )}>
      {!isUser && avatar}
      <div className={cn(
        'rounded-2xl px-4 py-2 max-w-[80%]',
        bgColor,
        textColor
      )}>
        {!isUser && (
          <div className="mb-1 font-medium">
            {message.sender.charAt(0).toUpperCase() + message.sender.slice(1)} Agent
          </div>
        )}
        <div className="message-content text-sm">
          {formatContent(message.content)}
        </div>
        
        {message.toolsUsed && message.toolsUsed.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {message.toolsUsed.map((tool) => (
              <span 
                key={tool}
                className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20"
              >
                {tool}
              </span>
            ))}
          </div>
        )}
      </div>
      {isUser && avatar}
    </div>
  );
}
