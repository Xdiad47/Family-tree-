import type { ProviderId } from "@/models/types";

const validators: Record<ProviderId, RegExp> = {
  groq: /^gsk_[A-Za-z0-9_-]{10,}$/,
  openai: /^sk-[A-Za-z0-9_-]{10,}$/,
  claude: /^sk-ant-[A-Za-z0-9_-]{10,}$/,
  gemini: /^AIza[0-9A-Za-z_-]{20,}$/
};

export const validateApiKey = (provider: ProviderId, key: string): boolean => {
  const value = key.trim();
  return validators[provider].test(value);
};
