import { GoogleGenerativeAI } from '@google/generative-ai';
import { Agent, AgentResponse, ConversationContext } from './types';
import { FormulaLookup } from '../tools/formula-lookup';

export class PhysicsAgent implements Agent {
  id: string = 'physics';
  name: string = 'Physics Agent';
  description: string = 'Specialist agent for physics questions and problems';
  
  private genAI: GoogleGenerativeAI;
  private model: any;
  private formulaLookup: FormulaLookup;
  
  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    this.formulaLookup = new FormulaLookup();
  }
  
  /**
   * Process a physics question and provide a detailed response
   */
  async process(input: string, context?: ConversationContext): Promise<AgentResponse> {
    try {
      // Check if the question is related to a physics formula
      const needsFormula = await this.needsFormula(input);
      let formulaResult = null;
      const toolsUsed = [];
      
      // If a formula is needed, use the formula lookup tool
      if (needsFormula) {
        formulaResult = await this.formulaLookup.lookupFormula(input);
        if (formulaResult) {
          toolsUsed.push('formulaLookup');
        }
      }
      
      // Generate a detailed physics explanation
      const response = await this.generatePhysicsResponse(input, formulaResult, context);
      
      return {
        agentId: this.id,
        content: response,
        toolsUsed: toolsUsed.length > 0 ? toolsUsed : undefined,
        confidenceScore: 0.9
      };
    } catch (error) {
      console.error("Error in Physics Agent:", error);
      return {
        agentId: this.id,
        content: "I apologize, but I encountered an error while solving this physics problem. Please try rephrasing your question."
      };
    }
  }
  
  /**
   * Determine if the question needs a physics formula lookup
   */
  private async needsFormula(question: string): Promise<boolean> {
    const prompt = `
      Does the following physics question require a physics formula or law? 
      Answer with only YES or NO.
      
      Question: ${question}
    `;
    
    const result = await this.model.generateContent(prompt);
    const response = result.response.text().trim().toUpperCase();
    return response === 'YES';
  }
  
  /**
   * Generate a detailed physics explanation, potentially using formula lookup results
   */
  private async generatePhysicsResponse(question: string, formula: any, context?: ConversationContext): Promise<string> {
    let prompt = `
      You are a physics tutor specializing in all areas of physics from mechanics to quantum physics.
      Please provide a clear explanation for the following physics question.
      
      Question: ${question}
    `;
    
    if (formula) {
      prompt += `\n\nRelevant formula information: ${JSON.stringify(formula)}`;
    }
    
    if (context && context.history.length > 0) {
      // Add conversation history for context
      const physicsHistory = context.history
        .filter(m => m.sender === 'user' || m.sender === 'physics')
        .slice(-5);
      
      if (physicsHistory.length > 0) {
        prompt += `\n\nConversation history: ${JSON.stringify(
          physicsHistory.map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.content
          }))
        )}`;
      }
    }
    
    prompt += `\n\nProvide a clear explanation. If appropriate, include the relevant formulas,
      explain the variables, and if possible, show how to approach solving this problem.
      Format any mathematical or physics expressions properly. Be educational and helpful.`;
    
    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }
}
