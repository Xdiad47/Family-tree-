"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { callClaude } from "@/services/ai/claudeService";
import { callGemini } from "@/services/ai/geminiService";
import { callGroq } from "@/services/ai/groqService";
import { callOpenAI } from "@/services/ai/openaiService";
import { autoLayoutNodes, getNodeDimensions } from "@/services/treeLayoutService";
import { exportElementAsPng } from "@/services/exportService";
import { parseAIResponse } from "@/utils/parseAIResponse";
import type { AppState, CreditsState, FamilyNode, ProviderId, TreeBounds } from "@/models/types";

export interface ZoomSignal {
  command: "in" | "out" | "fit" | "reset";
  token: number;
}

interface TreeVMParams {
  appState: AppState;
  setFamilyNodes: (nodes: FamilyNode[]) => void;
  setGenerating: (flag: boolean) => void;
  setError: (message: string | null) => void;
  setCredits: (credits: CreditsState) => void;
  consumeFreeCredit: () => Promise<CreditsState>;
}

const mapHttpError = (statusCode: number): string => {
  if (statusCode === 401 || statusCode === 403) {
    return "Invalid API key. Please check and reconnect.";
  }
  if (statusCode === 429) {
    return "Rate limit reached. Please wait a moment and try again.";
  }
  return "Connection failed. Please check your internet.";
};

const callProvider = async (provider: ProviderId, description: string, apiKey: string): Promise<string> => {
  if (provider === "openai") {
    return (await callOpenAI(description, apiKey)).rawText;
  }
  if (provider === "claude") {
    return (await callClaude(description, apiKey)).rawText;
  }
  if (provider === "gemini") {
    return (await callGemini(description, apiKey)).rawText;
  }
  return (await callGroq(description, apiKey)).rawText;
};

export const useTreeViewModel = ({
  appState,
  setFamilyNodes,
  setGenerating,
  setError,
  setCredits,
  consumeFreeCredit
}: TreeVMParams) => {
  const hasTree = appState.familyNodes.length > 0;
  const [treeBounds, setTreeBounds] = useState<TreeBounds>({ width: 1400, height: 860 });
  const [legendCollapsed, setLegendCollapsed] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [zoomSignal, setZoomSignal] = useState<ZoomSignal | null>(null);
  const stepTimerRef = useRef<number | null>(null);

  const nodeDimensions = useMemo(() => getNodeDimensions(), []);

  const startLoadingSteps = useCallback(() => {
    setLoadingStep(0);
    if (stepTimerRef.current !== null) {
      window.clearInterval(stepTimerRef.current);
    }
    stepTimerRef.current = window.setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % 3);
    }, 800);
  }, []);

  const stopLoadingSteps = useCallback(() => {
    if (stepTimerRef.current !== null) {
      window.clearInterval(stepTimerRef.current);
      stepTimerRef.current = null;
    }
    setLoadingStep(0);
  }, []);

  const mapErrorMessage = useCallback((error: unknown): string => {
    if (error instanceof Error) {
      if (error.message === "PARSE_ERROR") {
        return "AI returned an unexpected response. Please try again.";
      }
      if (error.message.startsWith("HTTP_")) {
        const code = Number.parseInt(error.message.replace("HTTP_", ""), 10);
        return mapHttpError(code);
      }
      if (error.message === "NETWORK_ERROR") {
        return "Connection failed. Please check your internet.";
      }
    }
    return "Connection failed. Please check your internet.";
  }, []);

  const generateTree = useCallback(
    async (description: string) => {
      const text = description.trim();

      if (!text) {
        setError("Please describe your family first.");
        return;
      }

      if (!appState.isConnected && appState.credits.remaining <= 0) {
        setError("Your free credits are used up. Connect your own API key to continue.");
        return;
      }

      if (!appState.isConnected) {
        setError("Please activate the free plan or connect your API key above.");
        return;
      }

      if (appState.isUsingFreePlan && appState.credits.remaining <= 0) {
        setError("Your free credits are used up. Connect your own API key to continue.");
        return;
      }

      setError(null);
      setGenerating(true);
      startLoadingSteps();

      try {
        const rawText = await callProvider(appState.provider, text, appState.apiKey);
        const parsedNodes = parseAIResponse(rawText);
        const laidOut = autoLayoutNodes(parsedNodes);

        if (appState.isUsingFreePlan) {
          const credits = await consumeFreeCredit();
          setCredits(credits);
        }

        setFamilyNodes(laidOut.nodes);
        setTreeBounds(laidOut.bounds);
        setError(null);
        // Auto-fit the tree in the viewport after a short delay so the
        // container has been measured by ResizeObserver.
        setTimeout(() => setZoomSignal({ command: "fit", token: Date.now() }), 80);
      } catch (error) {
        setError(mapErrorMessage(error));
      } finally {
        stopLoadingSteps();
        setGenerating(false);
      }
    },
    [
      appState.apiKey,
      appState.credits.remaining,
      appState.isConnected,
      appState.isUsingFreePlan,
      appState.provider,
      consumeFreeCredit,
      mapErrorMessage,
      setCredits,
      setError,
      setFamilyNodes,
      setGenerating,
      startLoadingSteps,
      stopLoadingSteps
    ]
  );

  const updateNodePosition = useCallback(
    (nodeId: string, x: number, y: number) => {
      const updated = appState.familyNodes.map((node) =>
        node.id === nodeId ? { ...node, position: { x: Math.max(0, x), y: Math.max(0, y) } } : node
      );
      setFamilyNodes(updated);
    },
    [appState.familyNodes, setFamilyNodes]
  );

  const finalizeNodePosition = useCallback(
    (nodeId: string, x: number, y: number) => {
      const updated = appState.familyNodes.map((node) =>
        node.id === nodeId ? { ...node, position: { x: Math.max(0, x), y: Math.max(0, y) } } : node
      );
      setFamilyNodes(updated);
    },
    [appState.familyNodes, setFamilyNodes]
  );

  const resetLayout = useCallback(() => {
    if (appState.familyNodes.length === 0) return;
    const relaid = autoLayoutNodes(appState.familyNodes);
    setFamilyNodes(relaid.nodes);
    setTreeBounds(relaid.bounds);
  }, [appState.familyNodes, setFamilyNodes]);

  const downloadTreeAsPng = useCallback(async (element: HTMLElement | null) => {
    if (!element) return;
    await exportElementAsPng(element, `family-tree-${Date.now()}.png`);
  }, []);

  const requestZoom = useCallback((command: ZoomSignal["command"]) => {
    setZoomSignal({ command, token: Date.now() });
  }, []);

  const applyChatTreeUpdate = useCallback(
    (nodes: FamilyNode[]) => {
      const existingById = new Map(appState.familyNodes.map((node) => [node.id, node.position]));
      const nextNodes = nodes.map((node, index) => ({
        ...node,
        position:
          existingById.get(node.id) ?? {
            x: 120 + (index % 3) * (nodeDimensions.width + 24),
            y: 130 + Math.floor(index / 3) * (nodeDimensions.height + 24)
          }
      }));

      setFamilyNodes(nextNodes);
      const maxX = Math.max(...nextNodes.map((node) => node.position.x + nodeDimensions.width), 600);
      const maxY = Math.max(...nextNodes.map((node) => node.position.y + nodeDimensions.height), 420);
      setTreeBounds({ width: maxX + 120, height: maxY + 120 });
      // Auto-fit after chat-driven tree updates too.
      setTimeout(() => setZoomSignal({ command: "fit", token: Date.now() }), 80);
    },
    [appState.familyNodes, nodeDimensions.height, nodeDimensions.width, setFamilyNodes]
  );

  return {
    hasTree,
    treeBounds,
    loadingStep,
    nodeDimensions,
    legendCollapsed,
    zoomSignal,
    setLegendCollapsed,
    generateTree,
    updateNodePosition,
    finalizeNodePosition,
    resetLayout,
    downloadTreeAsPng,
    requestZoom,
    applyChatTreeUpdate
  };
};
