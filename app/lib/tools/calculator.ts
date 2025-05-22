import { GeminiService } from '../utils/gemini-service';

/**
 * A tool that performs calculations based on mathematical expressions
 */
export class Calculator {
  private mathParser: Function;
  private apiKey: string;
  private geminiService: GeminiService | null = null;
  
  constructor(apiKey?: string) {
    this.apiKey = apiKey || '';
    if (apiKey) {
      this.geminiService = GeminiService.getInstance(apiKey);
    }
    
    // Simple math parser for basic calculations
    this.mathParser = new Function('expression', `
      try {
        // Add safety measures to prevent arbitrary code execution
        if (expression.includes('import') || 
            expression.includes('require') || 
            expression.includes('eval') ||
            expression.includes('Function')) {
          throw new Error('Security error: potentially unsafe code');
        }
        
        // Only allow specific math operations and functions
        const sanitizedExpression = expression
          .replace(/[^0-9+\\-*/().\\s^%\\w]/g, '')
          .replace(/\\w+/g, match => {
            const allowedFunctions = ['Math', 'sqrt', 'abs', 'sin', 'cos', 'tan', 
              'log', 'exp', 'pow', 'PI', 'E'];
            return allowedFunctions.includes(match) ? match : '';
          });
          
        return eval(sanitizedExpression);
      } catch (error) {
        throw new Error('Could not parse mathematical expression: ' + error.message);
      }
    `);
  }
  
  /**
   * Extract and calculate numerical expressions from natural language
   */
  async calculate(input: string): Promise<number | null> {
    try {
      // Extract mathematical expression
      const expression = await this.extractMathExpression(input);
      if (!expression) return null;
      
      // Perform calculation
      const result = this.mathParser(expression);
      return result;
    } catch (error) {
      console.error("Error in Calculator:", error);
      return null;
    }
  }
  
  /**
   * Extract mathematical expressions from natural language text
   * Using Gemini to extract calculation expressions
   */
  private async extractMathExpression(text: string): Promise<string | null> {
    try {
      if (!this.geminiService) {
        console.error("GeminiService not initialized in Calculator");
        return null;
      }
      
      const prompt = `
        Extract the mathematical expression from the following text for calculation.
        Return ONLY the expression, with no explanation or additional text.
        For example, "What is 5 + 3?" should return "5 + 3".
        If there's no calculable expression, return "NONE".
        
        Text: ${text}
      `;
      
      const response = await this.geminiService.generateContent(prompt, "gemini-1.5-flash");
      
      // Return null if no expression found
      if (response.trim() === 'NONE' || !response) {
        return null;
      }
      
      return response.trim();
    } catch (error) {
      console.error("Error extracting math expression:", error);
      return null;
    }
  }
}
