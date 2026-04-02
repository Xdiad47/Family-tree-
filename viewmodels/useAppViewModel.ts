"use client";

import { useCallback, useEffect, useMemo, useReducer } from "react";
import type { AppAction, AppState, CreditsApiResponse, CreditsState, FamilyNode, ProviderId } from "@/models/types";
import { FREE_CREDITS_TOTAL } from "@/constants/providers";

const initialCredits: CreditsState = {
  total: FREE_CREDITS_TOTAL,
  used: 0,
  remaining: FREE_CREDITS_TOTAL
};

const initialState: AppState = {
  provider: "groq",
  apiKey: "",
  isConnected: false,
  isUsingFreePlan: false,
  familyDescription: "",
  familyNodes: [],
  isGenerating: false,
  errorMessage: null,
  credits: initialCredits
};

const reducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "setProvider":
      return { ...state, provider: action.payload };
    case "setApiKey":
      return { ...state, apiKey: action.payload };
    case "setConnected":
      return { ...state, isConnected: action.payload };
    case "setUsingFreePlan":
      return { ...state, isUsingFreePlan: action.payload };
    case "setFamilyDescription":
      return { ...state, familyDescription: action.payload };
    case "setFamilyNodes":
      return { ...state, familyNodes: action.payload };
    case "setGenerating":
      return { ...state, isGenerating: action.payload };
    case "setError":
      return { ...state, errorMessage: action.payload };
    case "setCredits":
      return { ...state, credits: action.payload };
    case "resetTree":
      return { ...state, familyDescription: "", familyNodes: [], errorMessage: null };
    default:
      return state;
  }
};

export const useAppViewModel = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setProvider = useCallback((provider: ProviderId) => dispatch({ type: "setProvider", payload: provider }), []);
  const setApiKey = useCallback((apiKey: string) => dispatch({ type: "setApiKey", payload: apiKey }), []);
  const setConnected = useCallback((isConnected: boolean) => dispatch({ type: "setConnected", payload: isConnected }), []);
  const setUsingFreePlan = useCallback(
    (isUsingFreePlan: boolean) => dispatch({ type: "setUsingFreePlan", payload: isUsingFreePlan }),
    []
  );
  const setFamilyDescription = useCallback(
    (value: string) => dispatch({ type: "setFamilyDescription", payload: value }),
    []
  );
  const setFamilyNodes = useCallback((nodes: FamilyNode[]) => dispatch({ type: "setFamilyNodes", payload: nodes }), []);
  const setGenerating = useCallback((flag: boolean) => dispatch({ type: "setGenerating", payload: flag }), []);
  const setError = useCallback((error: string | null) => dispatch({ type: "setError", payload: error }), []);
  const setCredits = useCallback((credits: CreditsState) => dispatch({ type: "setCredits", payload: credits }), []);

  const syncCreditsFromServer = useCallback(async (): Promise<CreditsState> => {
    const response = await fetch("/api/credits", { method: "GET", cache: "no-store" });
    if (!response.ok) {
      throw new Error("CREDITS_FETCH_FAILED");
    }
    const data = (await response.json()) as CreditsApiResponse;
    const nextCredits: CreditsState = {
      total: data.total,
      used: data.used,
      remaining: data.remaining
    };
    setCredits(nextCredits);
    return nextCredits;
  }, [setCredits]);

  const consumeFreeCredit = useCallback(async (): Promise<CreditsState> => {
    const response = await fetch("/api/credits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "consume" })
    });

    if (!response.ok) {
      throw new Error("CREDITS_CONSUME_FAILED");
    }

    const data = (await response.json()) as CreditsApiResponse;
    const nextCredits: CreditsState = {
      total: data.total,
      used: data.used,
      remaining: data.remaining
    };
    setCredits(nextCredits);
    return nextCredits;
  }, [setCredits]);

  useEffect(() => {
    void syncCreditsFromServer().catch(() => {
      setCredits(initialCredits);
    });
  }, [setCredits, syncCreditsFromServer]);

  return useMemo(
    () => ({
      state,
      actions: {
        setProvider,
        setApiKey,
        setConnected,
        setUsingFreePlan,
        setFamilyDescription,
        setFamilyNodes,
        setGenerating,
        setError,
        setCredits,
        resetTree: () => dispatch({ type: "resetTree", payload: null }),
        syncCreditsFromServer,
        consumeFreeCredit
      }
    }),
    [
      consumeFreeCredit,
      setApiKey,
      setConnected,
      setCredits,
      setError,
      setFamilyDescription,
      setFamilyNodes,
      setGenerating,
      setProvider,
      setUsingFreePlan,
      state,
      syncCreditsFromServer
    ]
  );
};
