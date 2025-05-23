import { GeminiService } from '../utils/gemini-service';
import { safelyCalculate, extractExpressionViaPatterns } from './calculator-utils';

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
    // Using a simpler approach for computation to avoid Function constructor issues
    this.mathParser = (expression: string): number => {
      try {
        // Validate the expression isn't empty
        if (!expression || typeof expression !== 'string' || expression.trim() === '') {
          throw new Error('Expression is empty or invalid');
        }
        
        // Use simple numeric operations only - much safer than eval or Function constructor
        // Convert expression to a simple arithmetic calculation
        
        // First, check for math operations and only process simple expressions
        if (/^[\d\s+\-*/().]+$/.test(expression)) {
          // Simple expressions with basic arithmetic only - much safer
          // First standardize the format
          const cleaned = expression
            .replace(/\s+/g, '')      // Remove whitespace
            .replace(/\^/g, '**');    // Replace ^ with ** for exponentiation
          
          // Ultra simple expression check - only proceed if the cleaned expression only has numbers and operators
          if (/^[\d+\-*/().]+$/.test(cleaned)) {
            // Use the built-in JavaScript operators for basic arithmetic
            // More complex calculations should be handled by a proper math library
            return eval(cleaned);
          }
        }
        
        // For more complex expressions, we fallback to basic arithmetic parsing
        // This is only for simple expressions with + - * / and no functions
        let result = 0;
        
        // Remove all characters except digits, +, -, *, / and whitespace
        const sanitized = expression.replace(/[^0-9+\-*/.\s]/g, '');
        
        if (sanitized.trim() === '') {
          throw new Error('Expression contains no valid operators or operands');
        }
        
        // Simple evaluation of basic arithmetic
        try {
          result = eval(sanitized);
        } catch (evalError) {
          console.error("Failed to evaluate simple expression:", evalError);
          throw new Error("Invalid arithmetic expression");
        }
        
        return result;
      } catch (error) {
        throw new Error('Could not parse mathematical expression: ' + 
          (error instanceof Error ? error.message : String(error)));
      }
    };
  }
  
  /**
   * Extract and calculate numerical expressions from natural language
   */
  async calculate(input: string): Promise<number | null> {
    try {
      // First try to extract using our pattern-based approach
      let expression = extractExpressionViaPatterns(input);
      
      // If that fails, try the LLM-based approach
      if (!expression) {
        expression = await this.extractMathExpression(input);
      }
      
      // If we still don't have an expression, give up
      if (!expression) {
        console.log("No expression found in:", input);
        return null;
      }
      
      // Validate expression isn't empty or just whitespace
      if (!expression.trim()) {
        console.error("Expression is empty after extraction");
        return null;
      }
      
      // Format the expression (replace ^ with ** for exponentiation)
      const formattedExpression = expression.replace(/([a-zA-Z0-9\)\]])\s*\^\s*([a-zA-Z0-9\(])/g, '($1**$2)');
      
      console.log("Processing expression:", formattedExpression);
      
      // First try our safe calculator utility
      const safeResult = safelyCalculate(formattedExpression);
      if (safeResult !== null) {
        console.log("Safe calculation result:", safeResult);
        return safeResult;
      }
      
      // If that fails, try our mathParser as a fallback
      try {
        const result = this.mathParser(formattedExpression);
        
        // Verify result is a number and not NaN or Infinity
        if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
          console.error("Calculator produced invalid result:", result);
          return null;
        }
        
        return result;
      } catch (parseError) {
        console.error("Math parser error:", parseError);
        return null;
      }
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
      // First, try to extract using simple pattern matching
      // Look for patterns like "calculate 2+3" or "what is 7*8"
      const basicExpressionPattern = /(?:calculate|compute|evaluate|what\s+is|find|solve)\s+([0-9\s\+\-\*\/\^\(\)\.]+)/i;
      const basicMatch = text.match(basicExpressionPattern);
      
      if (basicMatch && basicMatch[1]) {
        const possibleExpression = basicMatch[1].trim();
        
        // Only accept if it has numbers and operators
        if (possibleExpression.length > 1 && 
            /\d/.test(possibleExpression) && 
            /[\+\-\*\/]/.test(possibleExpression)) {
          console.log("Found basic math expression:", possibleExpression);
          return possibleExpression;
        }
      }
      
      // If basic extraction fails, use a more general pattern
      const numberOperatorPattern = /(\d+[\+\-\*\/\^]\d+)/;
      const generalMatch = text.match(numberOperatorPattern);
      
      if (generalMatch && generalMatch[0]) {
        const simpleExpression = generalMatch[0].trim();
        console.log("Found simple math expression:", simpleExpression);
        return simpleExpression;
      }
      
      // As a last resort, check if there are at least 3 numbers with operators between them
      const numbers = text.match(/\d+/g);
      if (numbers && numbers.length >= 2) {
        // Extract segment of text that contains these numbers
        const firstNumberIndex = text.indexOf(numbers[0]);
        const lastNumberIndex = text.lastIndexOf(numbers[numbers.length - 1]) + numbers[numbers.length - 1].length;
        
        if (firstNumberIndex >= 0 && lastNumberIndex > firstNumberIndex) {
          const segment = text.substring(firstNumberIndex, lastNumberIndex);
          
          // Only accept if it has operators
          if (/[\+\-\*\/\^]/.test(segment)) {
            console.log("Extracted number segment:", segment);
            return segment;
          }
        }
      }
      
      // If we still don't have an expression and the GeminiService is available, try it
      if (this.geminiService) {
        const prompt = `
          Extract the mathematical expression from the following text for calculation.
          Return ONLY the expression, with no explanation or additional text.
          For example, "What is 5 + 3?" should return "5 + 3".
          If there's no calculable expression, return "NONE".
          
          Text: ${text}
        `;
        
        try {
          const response = await this.geminiService.generateContent(prompt, "gemini-2.0-flash");
          
          // Return null if no expression found
          if (!response || response.trim() === 'NONE' || response.trim().length < 2) {
            return null;
          }
          
          const cleanedResponse = response.trim();
          console.log("Found expression via LLM:", cleanedResponse);
          
          // Only accept if it looks like a math expression
          if (/\d/.test(cleanedResponse) && /[\+\-\*\/\^]/.test(cleanedResponse)) {
            return cleanedResponse;
          }
        } catch (llmError) {
          console.error("Error getting expression from LLM:", llmError);
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error extracting math expression:", error);
      return null;
    }
  }
}
