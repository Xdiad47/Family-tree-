import type { AppState, CreditsState } from "@/models/AppState";
import type { Connection, FamilyNode, FamilyRole, Position, TreeBounds } from "@/models/FamilyNode";

export type ProviderId = "groq" | "openai" | "claude" | "gemini";

export interface ProviderConfig {
  id: ProviderId;
  name: string;
  keyPlaceholder: string;
  modelLabel: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

export interface CreditsApiResponse {
  total: number;
  used: number;
  remaining: number;
}

export interface AIServiceResponse {
  rawText: string;
}

export interface ParsedNodesResult {
  nodes: FamilyNode[];
}

export interface TreeLayoutResult {
  nodes: FamilyNode[];
  bounds: TreeBounds;
}

export interface GenerateTreeContext {
  provider: ProviderId;
  apiKey: string;
  description: string;
}

export interface AppActionMap {
  setProvider: ProviderId;
  setApiKey: string;
  setConnected: boolean;
  setUsingFreePlan: boolean;
  setFamilyDescription: string;
  setFamilyNodes: FamilyNode[];
  setGenerating: boolean;
  setError: string | null;
  setCredits: CreditsState;
  resetTree: null;
}

export type AppAction = {
  [K in keyof AppActionMap]: { type: K; payload: AppActionMap[K] };
}[keyof AppActionMap];

export type {
  AppState,
  CreditsState,
  FamilyNode,
  Connection,
  Position,
  FamilyRole,
  TreeBounds
};
