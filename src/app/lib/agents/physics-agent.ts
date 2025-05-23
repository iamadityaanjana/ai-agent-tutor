import { Agent, AgentResponse, ConversationContext } from './types';
import { FormulaLookup } from '../tools/formula-lookup';
import { GeminiService } from '../utils/gemini-service';

export class PhysicsAgent implements Agent {
  id: string = 'physics';
  name: string = 'Physics Agent';
  description: string = 'Specialist agent for physics questions and problems';
  
  private geminiService: GeminiService;
  private formulaLookup: FormulaLookup;
  
  constructor(apiKey: string) {
    this.geminiService = GeminiService.getInstance(apiKey);
    this.formulaLookup = new FormulaLookup(apiKey);
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
    
    const response = await this.geminiService.generateContent(prompt, "gemini-2.0-flash");
    return response.trim().toUpperCase() === 'YES';
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
    
    prompt += `\n\nProvide a clear explanation of the physics concepts involved and a step-by-step approach to solving this problem.
    
    FORMAT YOUR RESPONSE CAREFULLY FOLLOWING THESE RULES:
    
    1. ORGANIZATION:
       - Begin with a clear explanation of the relevant physics concepts
       - List and explain all relevant formulas with their variables
       - Outline a step-by-step approach to solving the problem
       - If calculable, show the numerical solution
       - End with the physical interpretation of the result
    
    2. MATH AND PHYSICS NOTATION:
       - For all mathematical expressions, use LaTeX formatting
       - Use $...$ for inline formulas (e.g., $F = ma$)
       - Use $$...$$ for display formulas, with blank lines before and after
       - For vectors, use \\vec{F} notation
       - For units, write them as: $\\text{m/s}^2$ or $\\text{kg} \\cdot \\text{m/s}^2$
       - Use proper subscripts and superscripts: $v_{initial}$ not $v_initial$
    
    3. FORMATTING:
       - Use ## for main section headings with a space after ##
       - Use ### for subsections with a space after ###
       - Use bullet points for lists of concepts
       - Use numbered steps for solution procedures
       - Use bold for important concepts and results
       - Include illustrative diagrams if appropriate (describe them textually)
    
    Be educational and helpful, ensuring the physics principles are clearly understood.`;
    
    return await this.geminiService.generateContent(prompt);
  }
}
