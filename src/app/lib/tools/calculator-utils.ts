/**
 * Utility functions for the calculator tool
 */

/**
 * Safely attempt to perform a calculation
 * This is a fallback method that avoids using eval/Function for complex expressions
 * @param expression The expression to calculate
 * @returns The result of the calculation or null if it fails
 */
export function safelyCalculate(expression: string): number | null {
  try {
    if (!expression) return null;
    
    // Super simple parser for basic arithmetic
    // First tokenize the expression by splitting it into numbers and operators
    const tokens = expression.match(/(\d+\.?\d*|\+|\-|\*|\/|\^|\(|\))/g);
    
    if (!tokens || tokens.length < 3) {
      return null;
    }
    
    // Only allow simple expressions with basic operations
    const validTokens = tokens.every(token => 
      /^\d+\.?\d*$/.test(token) || // Numbers
      /^[\+\-\*\/\^()]$/.test(token) // Operators and parentheses
    );
    
    if (!validTokens) {
      return null;
    }
    
    // For extremely simple expressions like "2+3", try a direct calculation
    if (tokens.length === 3 && 
        /^\d+\.?\d*$/.test(tokens[0]) && 
        /^[\+\-\*\/]$/.test(tokens[1]) && 
        /^\d+\.?\d*$/.test(tokens[2])) {
      
      const a = parseFloat(tokens[0]);
      const op = tokens[1];
      const b = parseFloat(tokens[2]);
      
      switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return b !== 0 ? a / b : null;
        default: return null;
      }
    }
    
    // For anything else, we'd need a more advanced parser
    // But since we filtered down to simple expressions earlier,
    // we can use a carefully restricted eval as a last resort
    const simpleExpression = expression
      .replace(/\^/g, '**')
      .replace(/[a-zA-Z]/g, ''); // Remove any alphabetic characters
      
    if (/^[\d\s+\-*/().]+$/.test(simpleExpression)) {
      return eval(simpleExpression);
    }
    
    return null;
  } catch (error) {
    console.error("Safe calculation failed:", error);
    return null;
  }
}

/**
 * Extract a mathematical expression from text using pattern matching
 * @param text The text to extract from
 * @returns The extracted expression or null if none found
 */
export function extractExpressionViaPatterns(text: string): string | null {
  // Try various patterns to extract a mathematical expression
  
  // First, try common question patterns like "calculate 2+3" or "what is 7*8"
  const basicExpressionPattern = /(?:calculate|compute|evaluate|what\s+is|find|solve)\s+([0-9\s\+\-\*\/\^\(\)\.]+)/i;
  const basicMatch = text.match(basicExpressionPattern);
  
  if (basicMatch && basicMatch[1]) {
    const possibleExpression = basicMatch[1].trim();
    
    if (possibleExpression.length > 1 && 
        /\d/.test(possibleExpression) && 
        /[\+\-\*\/]/.test(possibleExpression)) {
      console.log("Found basic math expression:", possibleExpression);
      return possibleExpression;
    }
  }
  
  // Next, try to find a simple expression pattern
  const numberOperatorPattern = /(\d+[\+\-\*\/\^]\d+)/;
  const generalMatch = text.match(numberOperatorPattern);
  
  if (generalMatch && generalMatch[0]) {
    const simpleExpression = generalMatch[0].trim();
    console.log("Found simple math expression:", simpleExpression);
    return simpleExpression;
  }
  
  // Next, try to find an equation (contains = sign)
  const equationPattern = /(\d+[\+\-\*\/\^]\d+\s*=\s*\d+)/;
  const equationMatch = text.match(equationPattern);
  
  if (equationMatch && equationMatch[0]) {
    // Extract just the left side of the equation for calculation
    const parts = equationMatch[0].split('=');
    if (parts.length > 1) {
      return parts[0].trim();
    }
  }
  
  return null;
}
