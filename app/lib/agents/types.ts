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
  sender: MessageSender;
  timestamp: Date;
  toolsUsed?: string[];
}
