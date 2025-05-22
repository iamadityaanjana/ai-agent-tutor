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
  public getModel(modelName: string = "gemini-1.5-pro"): GenerativeModel {
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
    modelName: string = "gemini-1.5-pro"
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
    modelName: string = "gemini-1.5-pro"
  ): Promise<T> {
    try {
      const model = this.getModel(modelName);
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return JSON.parse(text) as T;
    } catch (error) {
      console.error('Error generating structured output:', error);
      throw error;
    }
  }

  /**
   * Check if text contains sensitive content
   */
  public async moderateContent(text: string): Promise<boolean> {
    try {
      const model = this.getModel("gemini-1.5-flash");
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
