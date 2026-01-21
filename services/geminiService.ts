import { GoogleGenAI, Type } from "@google/genai";
import { DayPlan, FinalAnalysis, DailyReport } from "../types";

const createClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is missing from environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const generate21DayPlan = async (goal: string): Promise<DayPlan[]> => {
  const ai = createClient();
  
  const prompt = `
    Create a structured 21-day plan to help the user achieve this goal: "${goal}".
    The plan is based on the "21 Days to form a habit" concept.
    
    For each day (1 through 21), provide:
    1. A short, motivating title (3-6 words).
    2. A guidance paragraph explaining the focus of the day (30-50 words).
    3. A list of 1 to 5 specific, actionable, small activities/tasks the user must do.
    
    Ensure the difficulty ramps up gradually or follows a logical progression.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.NUMBER },
            title: { type: Type.STRING },
            guidance: { type: Type.STRING },
            activities: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["day", "title", "guidance", "activities"]
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  try {
    return JSON.parse(text) as DayPlan[];
  } catch (e) {
    console.error("Failed to parse plan JSON", e);
    throw new Error("AI response was not valid JSON");
  }
};

export const generateFinalAnalysis = async (goal: string, reports: DailyReport[], plan: DayPlan[]): Promise<FinalAnalysis> => {
  const ai = createClient();

  const reportSummary = reports.map(r => ({
    day: r.day,
    notes: r.notes,
    mood: r.mood,
    completed_activities_count: r.activitiesCompleted.length,
    total_activities_count: plan.find(p => p.day === r.day)?.activities.length || 0
  }));

  const prompt = `
    The user has completed a 21-day challenge for the goal: "${goal}".
    Here is the data from their daily reports:
    ${JSON.stringify(reportSummary, null, 2)}

    Analyze their consistency, mood patterns, and note content.
    Provide a final status report containing:
    1. A summary paragraph of their journey.
    2. A consistency score (0-100) based on completion and mood.
    3. A list of 3 key strengths they exhibited.
    4. A list of 3 weaknesses or areas for improvement.
    5. Actionable next steps to maintain the habit.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          consistencyScore: { type: Type.NUMBER },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          nextSteps: { type: Type.STRING }
        },
        required: ["summary", "consistencyScore", "strengths", "weaknesses", "nextSteps"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");

  try {
    return JSON.parse(text) as FinalAnalysis;
  } catch (e) {
    console.error("Failed to parse analysis JSON", e);
    throw new Error("AI response was not valid JSON");
  }
};