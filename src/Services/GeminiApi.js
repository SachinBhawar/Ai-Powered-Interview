import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

async function generateAiContent(userPrompt) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userPrompt,
    });
    return JSON.parse(cleanJsonString(response.text));
}

function cleanJsonString(rawString) {
    // Remove ```json at the start and ``` at the end
    return rawString.replace(/^```json\s*/, "").replace(/\s*```$/, "");
}

export default generateAiContent;
