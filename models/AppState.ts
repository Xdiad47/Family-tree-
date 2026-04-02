import type { FamilyNode } from "@/models/FamilyNode";

export interface CreditsState {
  total: number;
  used: number;
  remaining: number;
}

export interface AppState {
  provider: "groq" | "openai" | "claude" | "gemini";
  apiKey: string;
  isConnected: boolean;
  isUsingFreePlan: boolean;
  familyDescription: string;
  familyNodes: FamilyNode[];
  isGenerating: boolean;
  errorMessage: string | null;
  credits: CreditsState;
}
