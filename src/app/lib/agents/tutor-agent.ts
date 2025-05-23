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
          content: this.formatResponse(response.content),
          toolsUsed: response.toolsUsed,
          confidenceScore: response.confidenceScore
        };
      }
      
      // If no specialist is found, handle it ourselves
      const generalResponse = await this.generateGeneralResponse(input, context);
      return {
        agentId: this.id,
        content: this.formatResponse(generalResponse),
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
   * Format and sanitize the LLM response for proper Markdown rendering
   */
  private formatResponse(content: string | undefined): string {
    if (!content) return "";
    
    // Initial cleanup - trim and ensure all line breaks are normalized
    let formattedContent = content.trim().replace(/\r\n/g, '\n');
    
    // Process headings: ensure there's a space after the # characters
    formattedContent = formattedContent.replace(/(^|\n)(#{1,6})([^\s#])/g, '$1$2 $3');
    
    // Process math expressions: ensure proper LaTeX formatting
    formattedContent = this.processMathExpressions(formattedContent);
    
    // Process lists: ensure proper spacing
    formattedContent = formattedContent.replace(/(^|\n)(\s*[-*+]\s*)([^\s])/g, '$1$2 $3');
    formattedContent = formattedContent.replace(/(^|\n)(\s*\d+\.\s*)([^\s])/g, '$1$2 $3');
    
    // Ensure paragraphs are properly separated
    formattedContent = formattedContent.replace(/\n{3,}/g, '\n\n');
    
    // Fix additional spacing issues
    formattedContent = formattedContent.replace(/\n\s*\n/g, '\n\n'); // Normalize multiple whitespace lines
    formattedContent = formattedContent.replace(/^\s+|\s+$/gm, ''); // Trim whitespace at start and end of lines
    
    // Ensure proper whitespace around block elements
    formattedContent = formattedContent.replace(/([^\n])\n(#{1,6})/g, '$1\n\n$2'); // Add space before headings
    formattedContent = formattedContent.replace(/(#{1,6}[^\n]+)\n([^\n])/g, '$1\n\n$2'); // Add space after headings
    formattedContent = formattedContent.replace(/([^\n])\n(```)/g, '$1\n\n$2'); // Add space before code blocks
    formattedContent = formattedContent.replace(/(```)\n([^\n])/g, '$1\n\n$2'); // Add space after code blocks
    
    // Ensure code blocks are properly formatted
    formattedContent = this.processCodeBlocks(formattedContent);
    
    return formattedContent;
  }
  
  /**
   * Process math expressions to ensure they're properly formatted for LaTeX
   */
  private processMathExpressions(content: string): string {
    let result = content;
    
    // Look for obvious math expressions not in LaTeX delimiters
    const mathRegexes = [
      // Basic algebra with equals sign
      /([^$])([\w\d]+\s*[=]\s*[\w\d\+\-\*\/\^]+)([^$])/g,
      // Expressions with exponents
      /([^$])([\w\d]+\s*\^\s*[\w\d]+)([^$])/g,
      // Fractions
      /([^$])(\d+\s*\/\s*\d+)([^$])/g
    ];
    
    mathRegexes.forEach(regex => {
      result = result.replace(regex, '$1$$$2$$$3');
    });
    
    // Process LaTeX block patterns more safely
    // Handle block LaTeX delimiters
    const blockLaTexPattern = /\$\$([\s\S]*?)\$\$/g;
    result = result.replace(blockLaTexPattern, (match, formula) => {
      // Fix exponent notation
      let processed = formula.replace(/(\w+)\^(\w+)/g, '$1^{$2}');
      // Fix common LaTeX syntax issues
      processed = processed.replace(/\\frac\s*(\w+)\s*(\w+)/g, '\\frac{$1}{$2}');
      return `$$${processed}$$`;
    });
    
    // Handle inline LaTeX delimiters
    const inlineLaTexPattern = /\$([^$]+)\$/g;
    result = result.replace(inlineLaTexPattern, (match, formula) => {
      // Fix exponent notation
      let processed = formula.replace(/(\w+)\^(\w+)/g, '$1^{$2}');
      // Fix common LaTeX syntax issues
      processed = processed.replace(/\\frac\s*(\w+)\s*(\w+)/g, '\\frac{$1}{$2}');
      return `$${processed}$`;
    });
    
    return result;
  }
  
  /**
   * Ensure code blocks are properly formatted
   */
  private processCodeBlocks(content: string): string {
    let result = content;
    
    // Fix code blocks without language specification
    result = result.replace(/```\s*\n/g, '```text\n');
    
    // Find code blocks and ensure proper formatting
    const codeBlockPattern = /```([\w]*)([\s\S]*?)```/g;
    result = result.replace(codeBlockPattern, (match, language, code) => {
      // Ensure there's a line break after the opening ```
      if (!code.startsWith('\n')) {
        code = '\n' + code;
      }
      
      // Ensure there's a line break before the closing ```
      if (!code.endsWith('\n')) {
        code = code + '\n';
      }
      
      // Normalize indentation within code blocks
      code = code.replace(/^\s+/gm, match => {
        // Convert tabs to spaces and ensure consistent indentation
        return match.replace(/\t/g, '  ');
      });
      
      // Use a default language if none specified
      const langSpecifier = language.trim() || 'text';
      
      return '```' + langSpecifier + code + '```';
    });
    
    return result;
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
      You are a helpful tutor assistant. Please respond to the following question in a helpful, educational way.
      
      FORMAT YOUR RESPONSE CAREFULLY FOLLOWING THESE RULES:
      
      1. MARKDOWN FORMATTING:
         - Use ## for main section headings (with a space after ##)
         - Use ### for subsection headings (with a space after ###)
         - Leave a blank line before and after headings
         - Use bullet points with proper spacing: - Item (with a space after -)
         - Use numbered lists with proper spacing: 1. Step (with a space after the number)
         - Use **bold** for emphasis or important terms
         - Use *italics* for secondary emphasis
      
      2. MATH FORMATTING:
         - For inline math expressions, use single dollar signs: $x^2 + y^2 = z^2$
         - For block/display math, use double dollar signs with blank lines before and after:
           
           $$
           F = G \\frac{m_1 m_2}{r^2}
           $$
         
         - Always use proper LaTeX notation: \\frac{numerator}{denominator} instead of a/b
         - Always wrap exponents in curly braces: x^{2} not x^2
      
      3. CODE FORMATTING:
         - For code blocks, use triple backticks with the language name, like:
           \`\`\`python
           def hello_world():
               print("Hello, world!")
           \`\`\`
         - For inline code, use single backticks: \`variable_name\`
         - Include proper indentation in code blocks
      
      4. CONTENT ORGANIZATION:
         - Start with a brief introduction
         - Break down complex concepts into smaller, manageable sections
         - Provide clear examples
         - End with a concise summary or conclusion
      
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
