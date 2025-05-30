import { GeminiService } from '../utils/gemini-service';

/**
 * Formula data structure
 */
interface Formula {
  name: string;
  formula: string;
  variables: Record<string, string>;
  units?: string;
  field?: string;
  description?: string;
}

/**
 * A tool that looks up physics formulas based on descriptions or questions
 */
export class FormulaLookup {
  private formulaDatabase: Formula[];
  private geminiService: GeminiService | null = null;
  
  constructor(apiKey?: string) {
    if (apiKey) {
      this.geminiService = GeminiService.getInstance(apiKey);
    }
    // Initialize with some common physics formulas
    this.formulaDatabase = [
      {
        name: "Newton's Second Law",
        formula: "F = ma",
        variables: {
          "F": "Force",
          "m": "Mass",
          "a": "Acceleration"
        },
        units: "Newtons (N)",
        field: "Classical Mechanics",
        description: "The rate of change of momentum of a body is directly proportional to the force applied."
      },
      {
        name: "Gravitational Potential Energy",
        formula: "U = mgh",
        variables: {
          "U": "Potential Energy",
          "m": "Mass",
          "g": "Gravitational Acceleration",
          "h": "Height"
        },
        units: "Joules (J)",
        field: "Classical Mechanics",
        description: "Energy possessed by an object due to its position in a gravitational field."
      },
      {
        name: "Kinetic Energy",
        formula: "KE = (1/2)mv²",
        variables: {
          "KE": "Kinetic Energy",
          "m": "Mass",
          "v": "Velocity"
        },
        units: "Joules (J)",
        field: "Classical Mechanics",
        description: "Energy possessed by an object due to its motion."
      },
      {
        name: "Einstein's Mass-Energy Equivalence",
        formula: "E = mc²",
        variables: {
          "E": "Energy",
          "m": "Mass",
          "c": "Speed of Light"
        },
        units: "Joules (J)",
        field: "Relativistic Mechanics",
        description: "Mass and energy are equivalent and can be converted into each other."
      },
      {
        name: "Coulomb's Law",
        formula: "F = k(q₁q₂)/r²",
        variables: {
          "F": "Electrostatic Force",
          "k": "Coulomb's Constant",
          "q₁": "First Charge",
          "q₂": "Second Charge",
          "r": "Distance between Charges"
        },
        units: "Newtons (N)",
        field: "Electrostatics",
        description: "The magnitude of the electric force between two charges is proportional to the product of the charges and inversely proportional to the square of the distance between them."
      }
    ];
  }
  
  /**
   * Look up a formula based on a description or question
   */
  async lookupFormula(query: string): Promise<Formula | null> {
    try {
      // Extract the physics concept from the query
      const concept = await this.extractPhysicsConcept(query);
      if (!concept) return null;
      
      // First try an exact match in our database
      const exactMatch = this.formulaDatabase.find(formula => 
        formula.name.toLowerCase() === concept.toLowerCase() ||
        formula.description?.toLowerCase().includes(concept.toLowerCase())
      );
      
      if (exactMatch) {
        return exactMatch;
      }
      
      // If no exact match, try a fuzzy match
      for (const formula of this.formulaDatabase) {
        if (
          this.calculateSimilarity(concept, formula.name) > 0.7 ||
          (formula.description && this.calculateSimilarity(concept, formula.description) > 0.6)
        ) {
          return formula;
        }
      }
      
      // If still no match, use Gemini to generate a formula entry
      return await this.generateFormulaWithAI(concept);
    } catch (error) {
      console.error("Error in formula lookup:", error);
      return null;
    }
  }
  
  /**
   * Extract the physics concept from a natural language query
   */
  private async extractPhysicsConcept(query: string): Promise<string | null> {
    try {
      if (!this.geminiService) {
        console.error("GeminiService not initialized in FormulaLookup");
        return null;
      }
      
      const prompt = `
        Extract the main physics concept, law, or formula that's being asked about in this question.
        Return ONLY the name of the concept/law/formula, with no explanation or additional text.
        For example, "What is Newton's Second Law and how is it applied?" should return "Newton's Second Law".
        If there's no specific physics concept, return "NONE".
        
        Question: ${query}
      `;
      
      const response = await this.geminiService.generateContent(prompt, "gemini-2.0-flash");
      
      if (response.trim() === 'NONE' || !response) {
        return null;
      }
      
      return response.trim();
    } catch (error) {
      console.error("Error extracting physics concept:", error);
      return null;
    }
  }
  
  /**
   * Calculate similarity between two strings (simple implementation)
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    
    // Count matching words
    const words1 = s1.split(/\\s+/);
    const words2 = s2.split(/\\s+/);
    
    let matchCount = 0;
    for (const word of words1) {
      if (word.length > 3 && words2.includes(word)) {
        matchCount++;
      }
    }
    
    // Calculate similarity score
    const totalWords = Math.max(words1.length, words2.length);
    return totalWords > 0 ? matchCount / totalWords : 0;
  }
  
  /**
   * Generate a formula entry using AI when database lookup fails
   */
  private async generateFormulaWithAI(concept: string): Promise<Formula | null> {
    try {
      if (!this.geminiService) {
        console.error("GeminiService not initialized in FormulaLookup");
        return null;
      }
      
      const prompt = `
        Generate a valid JSON structure for the physics formula related to "${concept}".
        
        CRITICAL: Your response MUST be a single valid JSON object WITHOUT any markdown formatting.
        DO NOT use code blocks, backticks, or any markdown syntax. ONLY return the raw JSON.
        
        The JSON should strictly follow this structure:
        {
          "name": "The name of the formula or concept",
          "formula": "The mathematical expression as a string",
          "variables": {
            "variable1": "description of variable1",
            "variable2": "description of variable2"
          },
          "units": "The units of measurement (if applicable)",
          "field": "The branch of physics this formula belongs to",
          "description": "A brief explanation of what the formula describes"
        }
        
        If this isn't a recognizable physics concept, return { "error": "Not a recognized physics concept" }.
      `;
      
      try {
        // Specify to retry once if parsing fails
        const result = await this.geminiService.generateStructuredOutput<Formula | {error: string}>(prompt, "gemini-2.0-flash", 1);
        return result && 'error' in result ? null : result as Formula;
      } catch (e) {
        console.error("Error parsing formula JSON:", e);
        
        // Enhanced fallback: attempt direct content generation as a last resort
        try {
          const fallbackPrompt = `
            I need information about the physics formula related to "${concept}".
            Please provide the following information in plain text format (NOT JSON):
            
            1. The name of the formula
            2. The formula itself (mathematical expression)
            3. A brief description of what it's used for
          `;
          
          const textResponse = await this.geminiService.generateContent(fallbackPrompt);
          
          // Create a simple formula object from the text response
          return {
            name: concept,
            formula: textResponse.includes('\n') ? textResponse.split('\n')[1]?.trim() || "N/A" : "N/A",
            variables: {},
            description: textResponse
          };
        } catch (fallbackError) {
          // Last resort fallback
          return {
            name: concept,
            formula: "N/A",
            variables: {},
            description: `Could not generate formula data for "${concept}". Please try a different physics concept.`
          };
        }
      }
    } catch (error) {
      console.error("Error generating formula with AI:", error);
      return null;
    }
  }
}
