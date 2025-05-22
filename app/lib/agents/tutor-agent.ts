import { Agent, AgentResponse, ConversationContext } from './types';
import { MathAgent } from './math-agent';
import { PhysicsAgent } from './physics-agent';
import { GeminiService } from '../utils/gemini-service';

export class TutorAgent implements Agent {
  id: string = 'tutor';
  name: string = 'Tutor Agent';
  description: string = 'Main coordinator agent that analyzes queries and delegates to specialist agents';
  
  private geminiService: GeminiService;
  private specialistAgents: Map<string, Agent>;
  
  constructor(apiKey: string) {
    this.geminiService = GeminiService.getInstance(apiKey);
    
    // Initialize specialist agents
    this.specialistAgents = new Map<string, Agent>();
    this.specialistAgents.set('math', new MathAgent(apiKey));
    this.specialistAgents.set('physics', new PhysicsAgent(apiKey));
  }
  
  /**
   * Process the user input, determine which specialist agent to use, and return a response
   */
  async process(input: string, context?: ConversationContext): Promise<AgentResponse> {
    try {
      // First determine the type of question and which specialist agent to use
      const category = await this.categorizeQuestion(input);
      
      // If we have a specialist for this category, delegate to them
      const specialistAgent = this.specialistAgents.get(category);
      if (specialistAgent) {
        const response = await specialistAgent.process(input, context);
        return {
          agentId: this.id,
          content: response.content,
          toolsUsed: response.toolsUsed,
          confidenceScore: response.confidenceScore
        };
      }
      
      // If no specialist is found, handle it ourselves
      const generalResponse = await this.generateGeneralResponse(input, context);
      return {
        agentId: this.id,
        content: generalResponse,
        confidenceScore: 0.7
      };
    } catch (error) {
      console.error("Error in Tutor Agent:", error);
      return {
        agentId: this.id,
        content: "I apologize, but I encountered an error while processing your question. Please try again."
      };
    }
  }
  
  /**
   * Determine the category of a question to route it to the appropriate specialist agent
   */
  private async categorizeQuestion(question: string): Promise<string> {
    const prompt = `
      Analyze the following question and determine which subject category it belongs to.
      Return ONLY ONE of these categories: math, physics, general

      Question: ${question}
      
      Category:
    `;
    
    const category = await this.geminiService.generateContent(prompt);
    const processedCategory = category.trim().toLowerCase();
    
    if (processedCategory === 'math' || processedCategory === 'physics') {
      return processedCategory;
    }
    
    return 'general';
  }
  
  /**
   * Generate a general response for questions that don't need specialists
   */
  private async generateGeneralResponse(question: string, context?: ConversationContext): Promise<string> {
    let prompt = `
      You are a helpful tutor assistant. Please respond to the following question in a helpful, 
      educational way. If you don't know the answer, say so honestly.
      
      Question: ${question}
    `;
    
    if (context && context.history.length > 0) {
      // Add conversation history for context if available
      prompt += `\n\nConversation history: ${JSON.stringify(
        context.history.slice(-5).map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.content
        }))
      )}`;
    }
    
    return await this.geminiService.generateContent(prompt);
  }
}
