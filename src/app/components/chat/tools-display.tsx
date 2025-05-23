"use client";

import { Sparkles, Wrench, Calculator, BookOpen, Flask } from 'lucide-react';
import { cn } from '../../lib/utils/cn';

interface ToolsDisplayProps {
  tools: string[];
  className?: string;
}

/**
 * This component displays the tools used by an agent
 */
export function ToolsDisplay({ tools, className }: ToolsDisplayProps) {
  if (!tools || tools.length === 0) {
    return null;
  }

  // Get appropriate icon for different tool types
  const getToolIcon = (tool: string) => {
    const toolLower = tool.toLowerCase();
    
    if (toolLower.includes('calculator') || toolLower.includes('math')) {
      return <Calculator className="h-3 w-3 mr-1" />;
    } else if (toolLower.includes('formula') || toolLower.includes('lookup')) {
      return <BookOpen className="h-3 w-3 mr-1" />;
    } else if (toolLower.includes('fallback')) {
      return <Sparkles className="h-3 w-3 mr-1" />;
    } else if (toolLower.includes('experiment')) {
      return <Flask className="h-3 w-3 mr-1" />;
    }
    
    return <Wrench className="h-3 w-3 mr-1" />; // default tool icon
  };

  return (
    <div className={cn("mt-3 border-t pt-2 border-gray-200 dark:border-gray-700", className)}>
      <div className="text-xs text-gray-500 mb-1.5 font-medium flex items-center">
        <Wrench className="h-3.5 w-3.5 mr-1 opacity-70" />
        Tools used:
      </div>
      <div className="flex flex-wrap gap-1.5">
        {tools.map((tool) => (
          <span 
            key={tool}
            className="inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
          >
            {getToolIcon(tool)}
            {tool}
          </span>
        ))}
      </div>
    </div>
  );
}
