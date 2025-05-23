import { Agent, AgentResponse, ConversationContext } from './types';
import { Calculator } from '../tools/calculator';
import { GeminiService } from '../utils/gemini-service';

export class MathAgent implements Agent {
  id: string = 'math';
  name: string = 'Math Agent';
  description: string = 'Specialist agent for mathematics questions';
  
  private geminiService: GeminiService;
  private calculator: Calculator;
  
  constructor(apiKey: string) {
    this.geminiService = GeminiService.getInstance(apiKey);
    this.calculator = new Calculator(apiKey);
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
      const toolResults: Record<string, any> = {};
      
      // If calculation is needed, use the calculator tool
      if (needsCalculation) {
        try {
          calculationResult = await this.calculator.calculate(input);
          if (calculationResult !== null) {
            toolsUsed.push('calculator');
            toolResults.calculator = { result: calculationResult };
          }
        } catch (calcError) {
          console.error("Calculator error:", calcError);
          // Continue without calculation result
        }
      }
      
      // Generate a detailed math explanation
      const response = await this.generateMathResponse(input, calculationResult, context);
      
      return {
        agentId: this.id,
        content: response,
        toolsUsed: toolsUsed.length > 0 ? toolsUsed : undefined,
        toolResults: Object.keys(toolResults).length > 0 ? toolResults : undefined,
        confidenceScore: 0.85
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
    
    const response = await this.geminiService.generateContent(prompt, "gemini-2.0-flash");
    return response.trim().toUpperCase() === 'YES';
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
    
    prompt += `\n\nProvide a clear explanation with a step-by-step solution.
    
    IMPORTANT: FORMAT YOUR RESPONSE CAREFULLY FOLLOWING THESE RULES:
    
    1. MATH NOTATION:
       - For all mathematical expressions, use LaTeX formatting
       - For inline math, use $expression$ format (example: $x^{2} + y^{2} = z^{2}$)
       - For block/display math, use double dollar signs with blank lines before and after:

         $$
         expression
         $$
         
       - CRITICAL: Always use proper LaTeX notation:
         * Use \\frac{numerator}{denominator} for fractions
         * Use ^{} for exponents: Write $x^{2}$ not $x^2$
         * Use \\sqrt{} for square roots
         * Use \\cdot or \\times for multiplication
    
    2. ORGANIZATION:
       - Start with a brief explanation of the approach
       - Number each step in the solution process
       - After the solution, add a brief explanation of the result
       - If relevant, mention alternative approaches
    
    3. FORMATTING:
       - Use markdown headings (## and ###) with spaces after the # (Example: "## Solution" not "##Solution")
       - Use bullet points for lists
       - Use bold for important concepts
       - Include appropriate whitespace between sections
       
    4. PROPER KATEX RENDERING:
       - Always include proper spacing in LaTeX expressions
       - Make sure all brackets are properly closed
       - Use \\times instead of * for multiplication
       - Use \\div instead of / for division in display mode
    
    Be educational and helpful, explaining concepts clearly and ensuring all mathematical expressions are properly formatted for rendering.`;
    
    // Use a retry mechanism for better responses
    try {
      const mathContent = await this.geminiService.generateContent(prompt, "gemini-2.0-flash");
      
      // Extra processing to ensure correct math formatting
      return this.fixMathFormatting(mathContent);
    } catch (error) {
      console.error("Error generating math content:", error);
      // Basic fallback response
      return `I'll solve this step by step:\n\n${question}\n\n${calculationResult !== null ? 
        `The calculation gives us: ${calculationResult}` : 
        "Let me work through this problem..."}`;
    }
  }
  
  /**
   * Fix common LaTeX formatting issues
   */
  private fixMathFormatting(content: string): string {
    if (!content) return "";
    
    let fixed = content;
    
    // Fix missing spaces after heading markers
    fixed = fixed.replace(/(^|\n)(#{1,6})([^\s#])/g, '$1$2 $3');
    
    // Fix hashtags in text that break markdown
    fixed = fixed.replace(/([a-zA-Z0-9])(#{1,6})([a-zA-Z0-9])/g, '$1\\#$3');
    
    // Fix common LaTeX issues
    
    // Ensure proper spacing in block math
    fixed = fixed.replace(/\$\$([\s\S]*?)\$\$/g, (match, formula) => {
      // Ensure proper spacing around the formula
      return `\n\n$$\n${formula.trim()}\n$$\n\n`;
    });
    
    // Fix inline math syntax
    fixed = fixed.replace(/\$([^$\n]+?)\$/g, (match, formula) => {
      const cleaned = formula
        // Fix exponents without braces
        .replace(/(\w+)\^(\w)(?!\{)/g, '$1^{$2}')
        // Fix subscripts without braces
        .replace(/(\w+)_(\w)(?!\{)/g, '$1_{$2}')
        // Fix spacing around operators
        .replace(/([a-zA-Z0-9])\\times([a-zA-Z0-9])/g, '$1 \\times $2')
        // Fix formatting artifacts from the LLM that might break KaTeX rendering
        .replace(/\\itimes/g, '\\times')
        .replace(/\\ltimes/g, '\\times');
      
      return `$${cleaned}$`;
    });
    
    // Fix incorrect LaTeX delimiters used in explanations
    fixed = fixed.replace(/\\\$(.*?)\\\$/g, '\\($1\\)');
    
    return fixed;
  }
}
