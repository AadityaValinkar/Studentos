"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "YOUR_API_KEY");

export async function generateRoadmap(collegeTier: string, branch: string, destination: string) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Act as an expert career counselor for engineering students.
A student from a ${collegeTier} college, studying ${branch}, wants to achieve: ${destination}.
Create a highly specific, realistic, and actionable 4-step roadmap for them.
Format the output as a JSON array where each object has:
- "step": string (e.g., "Semester 3-4: Fundamentals")
- "title": string (e.g., "Master DSA & Core CS")
- "description": string (Detailed description of what to do)
- "resources": array of strings (e.g., ["LeetCode", "MIT OpenCourseWare"])

Respond with ONLY the JSON array, no markdown formatting or backticks.`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Parse the JSON 
        const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        return { success: true, data: JSON.parse(cleanedText) };
    } catch (error) {
        console.error("Gemini Error:", error);
        return { success: false, error: "Failed to generate roadmap. Please check API key and try again." };
    }
}
