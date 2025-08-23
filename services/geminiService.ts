
import { GoogleGenAI, Type } from "@google/genai";
import type { ProjectIdea } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: "A short, catchy title for the project idea."
      },
      description: {
        type: Type.STRING,
        description: "A concise, 2-3 sentence description of the project idea, explaining how it combines the user's passions and skills for a purposeful outcome."
      },
    },
    required: ["title", "description"],
  },
};

export const generateIdeas = async (passions: string, skills: string, language: 'pt' | 'en'): Promise<ProjectIdea[]> => {
  const languageName = language === 'pt' ? 'Portuguese' : 'English';
  
  try {
    const prompt = `
      You are an expert career and purpose coach. Your goal is to inspire users by connecting what they love with what they are good at.
      Based on the user's passions: "${passions}" and their skills: "${skills}", generate exactly 5 unique, actionable, and purposeful project ideas.

      A purposeful project is one that could create a positive impact, foster personal growth, or bring deep fulfillment to the user.
      Frame each idea as something they can start working on. Be creative and encouraging.

      For example, if passions are 'teaching' and 'biochemistry' and skills are 'video editing', an idea could be 'Start a YouTube channel explaining complex biochemistry topics in a simple, engaging way for students'.

      IMPORTANT: The final response must be in the ${languageName} language.

      Return the result as a JSON array of 5 objects, where each object has a "title" and a "description", according to the provided schema. Do not include any markdown formatting like \`\`\`json.
    `;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8,
        topP: 0.95,
      }
    });

    const jsonText = response.text.trim();
    const parsedIdeas = JSON.parse(jsonText) as ProjectIdea[];
    
    if (!Array.isArray(parsedIdeas) || parsedIdeas.length === 0) {
      throw new Error("API returned an invalid format.");
    }

    return parsedIdeas;

  } catch (error) {
    console.error("Error generating ideas from Gemini:", error);
    throw new Error("Failed to generate project ideas.");
  }
};