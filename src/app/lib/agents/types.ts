/**
 * Base interface for all agents in the system
 */
export interface Agent {
  id: string;
  name: string;
  description: string;
  process: (input: string, context?: ConversationContext) => Promise<AgentResponse>;
}

/**
 * Standard response format for all agents
 */
export interface AgentResponse {
  agentId: string;
  content: string;
  toolsUsed?: string[];
  toolResults?: Record<string, any>; // Results from tools to be displayed in UI
  confidenceScore?: number;
}

/**
 * Context maintained throughout a conversation
 */
export interface ConversationContext {
  history: Message[];
  metadata?: Record<string, any>;
}

/**
 * Types of message senders
 */
export type MessageSender = 'user' | 'system' | 'tutor' | 'math' | 'physics' | 'history' | 'biology';

/**
 * Message structure for conversation history
 */
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'system' | string; // Allow for specific agent IDs
  timestamp: Date;
  toolsUsed?: string[];
  toolResults?: Record<string, any>; // Results from tools to display in UI
  isLoading?: boolean; // Added for loading state
}
