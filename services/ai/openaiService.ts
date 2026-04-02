import { AI_SYSTEM_PROMPT } from "@/constants/providers";
import type { AIServiceResponse } from "@/models/types";

export const callOpenAI = async (description: string, apiKey: string): Promise<AIServiceResponse> => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: AI_SYSTEM_PROMPT },
        { role: "user", content: description }
      ],
      temperature: 0.3
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP_${response.status}`);
  }

  const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return { rawText: data.choices?.[0]?.message?.content ?? "" };
};
