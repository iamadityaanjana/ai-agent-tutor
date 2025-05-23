import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

// Cache for models to avoid recreating them
const modelCache = new Map<string, GenerativeModel>();

/**
 * Gemini API service for consistent model access across the application
 */
export class GeminiService {
  private static instance: GeminiService;
  private apiKey: string;
  private genAI: GoogleGenerativeAI;

  private constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  /**
   * Get singleton instance of GeminiService
   */
  public static getInstance(apiKey?: string): GeminiService {
    if (!GeminiService.instance) {
      if (!apiKey) {
        throw new Error('API key is required to initialize GeminiService');
      }
      GeminiService.instance = new GeminiService(apiKey);
    }
    return GeminiService.instance;
  }

  /**
   * Get a Gemini model with caching to improve performance
   */
  public getModel(modelName: string = "gemini-2.0-flash"): GenerativeModel {
    const cacheKey = `${this.apiKey}-${modelName}`;
    
    if (!modelCache.has(cacheKey)) {
      const model = this.genAI.getGenerativeModel({ model: modelName });
      modelCache.set(cacheKey, model);
    }
    
    return modelCache.get(cacheKey)!;
  }

  /**
   * Generate content with the specified model
   */
  public async generateContent(
    prompt: string, 
    modelName: string = "gemini-2.0-flash"
  ): Promise<string> {
    try {
      const model = this.getModel(modelName);
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    }
  }

  /**
   * Generate structured JSON content and parse it
   */
  public async generateStructuredOutput<T>(
    prompt: string,
    modelName: string = "gemini-2.0-flash",
    retries: number = 1
  ): Promise<T> {
    try {
      const model = this.getModel(modelName);
      const result = await model.generateContent(prompt);
      let text = result.response.text();
      
      // Clean the response to handle markdown code blocks and other artifacts
      text = this.cleanJsonResponse(text);
      
      try {
        return JSON.parse(text) as T;
      } catch (parseError) {
        // If parsing fails and we have retries left, try again with a more explicit JSON request
        if (retries > 0) {
          const enhancedPrompt = `${prompt}
          
IMPORTANT: You MUST respond with a valid JSON object WITHOUT ANY markdown formatting or code blocks.
DO NOT include \`\`\` or any other text before or after the JSON object.
The response should be a plain JSON object that can be directly parsed.`;
          
          console.warn("JSON parsing failed, retrying with enhanced prompt:", parseError);
          return this.generateStructuredOutput<T>(enhancedPrompt, modelName, retries - 1);
        }
        throw parseError;
      }
    } catch (error) {
      console.error('Error generating structured output:', error);
      throw error;
    }
  }
  
  /**
   * Clean a JSON response string by removing markdown code blocks and other non-JSON artifacts
   */
  private cleanJsonResponse(text: string): string {
    // First try to find JSON object/array enclosed in markdown code blocks
    const markdownJsonMatch = text.match(/```(?:json|javascript)?\s*([\s\S]*?)\s*```/);
    if (markdownJsonMatch) {
      text = markdownJsonMatch[1].trim();
    } else {
      // If not in code blocks, remove any markdown code block syntax that might be partial
      text = text.replace(/```(?:json|javascript)?\s*/g, '');
      text = text.replace(/```\s*$/g, '');
    }
    
    // Remove any leading/trailing whitespace
    text = text.trim();
    
    // Handle any potential trailing commas in objects/arrays which are invalid in JSON
    text = text.replace(/,\s*([\]}])/g, '$1');
    
    // Check if text starts with { or [ to ensure it's a JSON object/array
    if (!text.startsWith('{') && !text.startsWith('[')) {
      // Try to find a JSON object/array in the text
      const jsonObjectMatch = text.match(/({[\s\S]*?})/);
      const jsonArrayMatch = text.match(/(\[[\s\S]*?\])/);
      
      if (jsonObjectMatch) {
        text = jsonObjectMatch[1];
      } else if (jsonArrayMatch) {
        text = jsonArrayMatch[1];
      }
    }
    
    return text;
  }

  /**
   * Check if text contains sensitive content
   */
  public async moderateContent(text: string): Promise<boolean> {
    try {
      const model = this.getModel("gemini-2.0-flash");
      const prompt = `
        Please analyze the following text and determine if it contains any harmful, 
        offensive, illegal, or inappropriate content. Return ONLY "true" if it contains 
        such content, or "false" if it is safe and appropriate.
        
        Text: ${text}
      `;
      
      const result = await model.generateContent(prompt);
      const response = result.response.text().trim().toLowerCase();
      return response === 'true';
    } catch (error) {
      console.error('Error moderating content:', error);
      // Default to safe if moderation fails
      return false;
    }
  }
}
