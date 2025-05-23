"use client";

import { Message } from '../../lib/agents/types';
import { cn } from '../../lib/utils/cn';
import { CalculatorIcon, BookOpenIcon, BrainIcon } from 'lucide-react';
import Image from 'next/image';
import 'katex/dist/katex.min.css';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';

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
        <div className="message-content prose dark:prose-invert max-w-none">
          {message.isLoading ? (
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-150"></div>
            </div>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkMath, remarkGfm]}
              rehypePlugins={[rehypeKatex]}
              components={{
                h1: (props) => <h1 className="text-xl font-bold mt-3 mb-2" {...props} />,
                h2: (props) => <h2 className="text-lg font-bold mt-3 mb-2" {...props} />,
                h3: (props) => <h3 className="text-base font-bold mt-2 mb-1" {...props} />,
                p: (props) => <p className="mb-3" {...props} />,
                ul: (props) => <ul className="list-disc pl-5 mb-3" {...props} />,
                ol: (props) => <ol className="list-decimal pl-5 mb-3" {...props} />,
                li: (props) => <li className="mb-1" {...props} />,
                a: (props) => <a className="text-blue-600 hover:underline" {...props} />,
                blockquote: (props) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2" {...props} />,
                table: (props) => <div className="overflow-x-auto mb-3"><table className="border-collapse border border-gray-300 w-full" {...props} /></div>,
                thead: (props) => <thead className="bg-gray-100 dark:bg-gray-800" {...props} />,
                th: (props) => <th className="border border-gray-300 px-4 py-2 text-left" {...props} />,
                td: (props) => <td className="border border-gray-300 px-4 py-2" {...props} />,
                pre: (props) => <pre className="bg-gray-900 text-gray-100 rounded-md p-4 overflow-x-auto mb-3" {...props} />,
                code: ({inline, className, children, ...props}) => {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline ? (
                    <div className="bg-gray-900 rounded-md p-0 overflow-hidden mb-3">
                      <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-700">
                        {match && match[1] ? match[1] : "code"}
                      </div>
                      <pre className="p-4 overflow-x-auto">
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                    </div>
                  ) : (
                    <code className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
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
