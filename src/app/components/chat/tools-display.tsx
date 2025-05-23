"use client";

import { Sparkles, Wrench, Calculator, BookOpen, Flask, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../lib/utils/cn';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';

interface ToolsDisplayProps {
  tools: string[];
  toolResults?: Record<string, any>;
  className?: string;
}

/**
 * This component displays the tools used by an agent
 */
export function ToolsDisplay({ tools, toolResults, className }: ToolsDisplayProps) {
  const [expandedTools, setExpandedTools] = useState<Record<string, boolean>>({});

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

  // Toggle the expanded state of a tool
  const toggleToolExpansion = (tool: string) => {
    setExpandedTools(prev => ({
      ...prev,
      [tool]: !prev[tool]
    }));
  };

  // Format tool results for display
  const renderToolResult = (tool: string) => {
    if (!toolResults || !toolResults[tool]) return null;
    
    const result = toolResults[tool];
    
    // Format based on tool type
    if (tool === 'formulaLookup' && result) {
      return (
        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md text-sm">
          <div className="font-medium mb-1">{result.name}</div>
          <div className="mb-2">
            <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{result.formula}</span>
          </div>
          
          {result.variables && Object.keys(result.variables).length > 0 && (
            <div className="mb-2">
              <div className="font-medium text-xs mb-1">Variables:</div>
              <div className="grid grid-cols-2 gap-1">
                {Object.entries(result.variables).map(([variable, description]) => (
                  <div key={variable} className="flex">
                    <span className="font-mono mr-1">{variable}:</span> 
                    <span className="text-gray-600 dark:text-gray-300">
                      {String(description)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {result.units && (
            <div className="text-xs text-gray-500">Units: {result.units}</div>
          )}
          
          {result.description && (
            <div className="mt-2 text-xs border-t border-gray-200 dark:border-gray-700 pt-2">
              <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex]}
              >
                {result.description}
              </ReactMarkdown>
            </div>
          )}
        </div>
      );
    }
    
    // Default JSON display for other tools
    return (
      <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md">
        <pre className="text-xs overflow-x-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className={cn("mt-3 border-t pt-2 border-gray-200 dark:border-gray-700", className)}>
      <div className="text-xs text-gray-500 mb-1.5 font-medium flex items-center">
        <Wrench className="h-3.5 w-3.5 mr-1 opacity-70" />
        Tools used:
      </div>
      <div className="flex flex-col gap-2">
        {tools.map((tool) => (
          <div key={tool} className="flex flex-col">
            <button 
              onClick={() => toggleToolExpansion(tool)}
              className="flex items-center justify-between rounded-md border px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 w-fit"
            >
              <span className="flex items-center">
                {getToolIcon(tool)}
                {tool}
              </span>
              {toolResults && toolResults[tool] && (
                <span className="ml-2">
                  {expandedTools[tool] ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </span>
              )}
            </button>
            
            {expandedTools[tool] && renderToolResult(tool)}
          </div>
        ))}
      </div>
    </div>
  );
}
