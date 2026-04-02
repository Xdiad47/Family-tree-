"use client";

import { useCallback, useMemo, useState } from "react";
import { callClaude } from "@/services/ai/claudeService";
import { callGemini } from "@/services/ai/geminiService";
import { callGroq } from "@/services/ai/groqService";
import { callOpenAI } from "@/services/ai/openaiService";
import { parseAIResponse } from "@/utils/parseAIResponse";
import type { ChatMessage, FamilyNode, ProviderId } from "@/models/types";

interface ChatVMParams {
  provider: ProviderId;
  apiKey: string;
  isConnected: boolean;
  familyNodes: FamilyNode[];
  onTreeUpdate: (nodes: FamilyNode[]) => void;
}

const callProvider = async (provider: ProviderId, prompt: string, key: string): Promise<string> => {
  if (provider === "openai") return (await callOpenAI(prompt, key)).rawText;
  if (provider === "claude") return (await callClaude(prompt, key)).rawText;
  if (provider === "gemini") return (await callGemini(prompt, key)).rawText;
  return (await callGroq(prompt, key)).rawText;
};

const createMessage = (role: "user" | "assistant", content: string): ChatMessage => ({
  id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  role,
  content,
  createdAt: Date.now()
});

export const useChatViewModel = ({ provider, apiKey, isConnected, familyNodes, onTreeUpdate }: ChatVMParams) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(async () => {
    const instruction = inputValue.trim();
    if (!instruction) return;

    setMessages((prev) => [...prev, createMessage("user", instruction)]);
    setInputValue("");

    if (!isConnected) {
      setMessages((prev) => [...prev, createMessage("assistant", "Connect a key or enable free plan first.")]);
      return;
    }

    if (familyNodes.length === 0) {
      setMessages((prev) => [...prev, createMessage("assistant", "Generate a family tree first, then I can adjust it.")]);
      return;
    }

    setIsTyping(true);

    try {
      const prompt = `You will receive an existing family tree JSON array and a user request.\nUpdate the tree according to the request.\nReturn ONLY the updated JSON array in the same schema.\n\nCurrent tree:\n${JSON.stringify(
        familyNodes
      )}\n\nUser request:\n${instruction}`;

      const raw = await callProvider(provider, prompt, apiKey);
      const updatedNodes = parseAIResponse(raw);

      onTreeUpdate(updatedNodes);
      setMessages((prev) => [...prev, createMessage("assistant", "Updated your tree successfully ✓")]);
    } catch {
      setMessages((prev) => [
        ...prev,
        createMessage("assistant", "I could not apply that update. Please try rephrasing your request.")
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [apiKey, familyNodes, inputValue, isConnected, onTreeUpdate, provider]);

  return useMemo(
    () => ({
      isOpen,
      messages,
      inputValue,
      isTyping,
      setInputValue,
      toggleOpen: () => setIsOpen((prev) => !prev),
      sendMessage
    }),
    [inputValue, isOpen, isTyping, messages, sendMessage]
  );
};
