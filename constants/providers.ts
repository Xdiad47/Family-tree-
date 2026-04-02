import type { ProviderConfig } from "@/models/types";

export const FREE_CREDITS_TOTAL = 5;

export const PROVIDERS: ProviderConfig[] = [
  { id: "groq", name: "Groq", keyPlaceholder: "gsk_...", modelLabel: "llama-3.3-70b-versatile" },
  { id: "openai", name: "OpenAI", keyPlaceholder: "sk-...", modelLabel: "gpt-4o" },
  { id: "claude", name: "Claude", keyPlaceholder: "sk-ant-...", modelLabel: "claude-3-5-sonnet-20241022" },
  { id: "gemini", name: "Gemini", keyPlaceholder: "AIza...", modelLabel: "gemini-1.5-pro" }
];

export const AI_SYSTEM_PROMPT = `You are a family relationship parser. Parse the user's description and return
a JSON array of person objects. Each object must have:
  id: unique string (e.g. "person_1")
  name: string (full name)
  role: one of — Self, Father, Mother, Wife, Husband, Brother, Sister,
        Brother-in-law, Sister-in-law, Son, Daughter, Uncle, Aunt,
        Grandfather, Grandmother, Nephew, Niece, Cousin
  generation: integer (0=Self, -1=parents, -2=grandparents, +1=children)
  connections: array of { targetId: string, label: string }
Return ONLY a valid JSON array. No markdown, no code blocks, no explanation.`;

export const CREDITS_COOKIE_KEY = "ft_free_credits_used";
