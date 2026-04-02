import { AI_SYSTEM_PROMPT } from "@/constants/providers";
import type { AIServiceResponse } from "@/models/types";

export const callGemini = async (description: string, apiKey: string): Promise<AIServiceResponse> => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${encodeURIComponent(
    apiKey
  )}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `${AI_SYSTEM_PROMPT}\n\nUser description:\n${description}`
            }
          ]
        }
      ],
      generationConfig: { temperature: 0.3 }
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP_${response.status}`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  return { rawText: data.candidates?.[0]?.content?.parts?.[0]?.text ?? "" };
};
