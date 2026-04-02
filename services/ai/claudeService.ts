import { AI_SYSTEM_PROMPT } from "@/constants/providers";
import type { AIServiceResponse } from "@/models/types";

export const callClaude = async (description: string, apiKey: string): Promise<AIServiceResponse> => {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2048,
      system: AI_SYSTEM_PROMPT,
      messages: [{ role: "user", content: description }]
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP_${response.status}`);
  }

  const data = (await response.json()) as { content?: Array<{ text?: string }> };
  return { rawText: data.content?.[0]?.text ?? "" };
};
