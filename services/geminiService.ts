import { GoogleGenAI, Type } from "@google/genai";
import { ComponentType } from "../types";

// Initialize the client
// NOTE: In a real app, ensure process.env.API_KEY is available or passed via context
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Define the schema for the UI Model
const uiSchema = {
  type: Type.OBJECT,
  properties: {
    type: {
      type: Type.STRING,
      enum: Object.values(ComponentType),
    },
    props: {
      type: Type.OBJECT,
      properties: {
        label: { type: Type.STRING },
        title: { type: Type.STRING },
        content: { type: Type.STRING },
        variant: { type: Type.STRING },
        direction: { type: Type.STRING },
        gap: { type: Type.NUMBER },
        data: { 
          type: Type.ARRAY,
          items: { type: Type.OBJECT } // Simplified for flexibility
        }
      },
      nullable: true
    },
    children: {
      type: Type.ARRAY,
      items: { 
        // Recursive schema definition is complex in simple JSON schema object, 
        // so we treat children as generic objects here for the API definition 
        // but the model usually understands the recursion intent.
        type: Type.OBJECT 
      },
      nullable: true
    }
  },
  required: ['type']
};

export const generateUIStream = async (prompt: string) => {
  const model = 'gemini-3-flash-preview';

  const systemInstruction = `
  You are an expert Frontend AI capable of generating React UI component trees.
  Your goal is to respond to the user's request by generating a valid JSON structure representing a UI.
  
  The JSON structure is a tree of nodes. Each node has:
  - type: One of [${Object.values(ComponentType).join(', ')}]
  - props: An object with attributes like label, title, content, variant (primary, secondary, danger, success, warning, info, bar, line, pie), direction (row, column), data (for charts).
  - children: An array of child nodes.

  Rules:
  1. If the user asks for a dashboard, stats, or complex view, use 'container' with direction 'column' or 'row' to organize layout.
  2. Use 'card' to group related information.
  3. Use 'chart' for data visualization. Prop 'data' should be an array of objects {name: string, value: number}. Prop 'variant' can be 'bar', 'line', or 'pie'.
  4. Use 'metric' for single stats (props: label, content).
  5. Use 'alert' for warnings or info banners.
  6. ALWAYS return a SINGLE JSON object at the root.
  7. Do not wrap the JSON in markdown code blocks. Return raw JSON.
  
  Example Response:
  {
    "type": "container",
    "props": { "direction": "column", "gap": 4 },
    "children": [
      { "type": "text", "props": { "content": "Dashboard", "variant": "primary" } },
      { "type": "metric", "props": { "label": "Sales", "content": "$12,000" } }
    ]
  }
  `;

  try {
    const responseStream = await ai.models.generateContentStream({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        // We use responseSchema to guide the model but allow flexibility since recursive schemas are tricky in strict mode
      }
    });

    return responseStream;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};