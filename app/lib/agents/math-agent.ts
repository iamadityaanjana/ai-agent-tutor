import { GoogleGenerativeAI } from '@google/generative-ai';
import { Agent, AgentResponse, ConversationContext } from './types';
import { Calculator } from '../tools/calculator';

export class MathAgent implements Agent {
  id: string = 'math';
  name: string = 'Math Agent';
  description: string = 'Specialist agent for mathematics questions';
  
  private genAI: GoogleGenerativeAI;
  private model: any;
  private calculator: Calculator;
  
  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    this.calculator = new Calculator();
  }
  
  /**
   * Process a math question and provide a detailed response
   */
  async process(input: string, context?: ConversationContext): Promise<AgentResponse> {
    try {
      // Check if the question requires calculation
      const needsCalculation = await this.needsCalculation(input);
      let calculationResult = null;
      const toolsUsed = [];
      
      // If calculation is needed, use the calculator tool
      if (needsCalculation) {
        calculationResult = await this.calculator.calculate(input);
        toolsUsed.push('calculator');
      }
      
      // Generate a detailed math explanation
      const response = await this.generateMathResponse(input, calculationResult, context);
      
      return {
        agentId: this.id,
        content: response,
        toolsUsed: toolsUsed.length > 0 ? toolsUsed : undefined,
        confidenceScore: 0.9
      };
    } catch (error) {
      console.error("Error in Math Agent:", error);
      return {
        agentId: this.id,
        content: "I apologize, but I encountered an error while solving this math problem. Please try rephrasing your question."
      };
    }
  }
  
  /**
   * Determine if the question requires numerical calculation
   */
  private async needsCalculation(question: string): Promise<boolean> {
    const prompt = `
      Does the following math question require numerical calculation? 
      Answer with only YES or NO.
      
      Question: ${question}
    `;
    
    const result = await this.model.generateContent(prompt);
    const response = result.response.text().trim().toUpperCase();
    return response === 'YES';
  }
  
  /**
   * Generate a detailed math explanation, potentially using the calculation result
   */
  private async generateMathResponse(question: string, calculationResult: number | null, context?: ConversationContext): Promise<string> {
    let prompt = `
      You are a mathematics tutor specializing in all areas of mathematics from basic arithmetic to advanced calculus.
      Please provide a clear, step-by-step explanation for the following math question.
      
      Question: ${question}
    `;
    
    if (calculationResult !== null) {
      prompt += `\n\nThe numerical calculation result is: ${calculationResult}`;
    }
    
    if (context && context.history.length > 0) {
      // Add conversation history for context
      const mathHistory = context.history
        .filter(m => m.sender === 'user' || m.sender === 'math')
        .slice(-5);
      
      if (mathHistory.length > 0) {
        prompt += `\n\nConversation history: ${JSON.stringify(
          mathHistory.map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.content
          }))
        )}`;
      }
    }
    
    prompt += `\n\nProvide a clear explanation. If appropriate, include a step-by-step solution.
      Format any mathematical expressions properly. Be educational and helpful.`;
    
    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }
}
