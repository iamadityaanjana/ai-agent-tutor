import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { Message } from '../../lib/agents/types';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`px-4 py-2 rounded-lg max-w-[80%] ${
          isUser ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800'
        }`}
      >
        {message.isLoading ? (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
          </div>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            className="prose dark:prose-invert max-w-none"
          >
            {message.content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};
