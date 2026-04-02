"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PROVIDERS } from "@/constants/providers";
import type { AppState, ProviderId } from "@/models/types";
import { validateApiKey } from "@/utils/keyValidator";

const storageKey = (provider: ProviderId): string => `family-tree-key:${provider}`;

interface ProviderVMParams {
  appState: AppState;
  setProvider: (provider: ProviderId) => void;
  setApiKey: (key: string) => void;
  setConnected: (value: boolean) => void;
  setUsingFreePlan: (value: boolean) => void;
  setError: (message: string | null) => void;
}

export const useProviderViewModel = ({
  appState,
  setProvider,
  setApiKey,
  setConnected,
  setUsingFreePlan,
  setError
}: ProviderVMParams) => {
  const [inputKey, setInputKey] = useState("");
  const [isKeyVisible, setIsKeyVisible] = useState(false);

  const activeProvider = useMemo(
    () => PROVIDERS.find((provider) => provider.id === appState.provider) ?? PROVIDERS[0],
    [appState.provider]
  );

  useEffect(() => {
    const cached = sessionStorage.getItem(storageKey(appState.provider));
    setInputKey(cached ?? "");
    setIsKeyVisible(false);
  }, [appState.provider]);

  const onProviderChange = useCallback(
    (provider: ProviderId) => {
      setProvider(provider);
      setConnected(false);
      setUsingFreePlan(false);
      setApiKey("");
      setError(null);
    },
    [setApiKey, setConnected, setError, setProvider, setUsingFreePlan]
  );

  const connectOwnKey = useCallback(() => {
    const key = inputKey.trim();

    if (!validateApiKey(appState.provider, key)) {
      setConnected(false);
      setApiKey("");
      setError(`Please enter a valid ${activeProvider.name} API key format.`);
      return;
    }

    sessionStorage.setItem(storageKey(appState.provider), key);
    setApiKey(key);
    setConnected(true);
    setUsingFreePlan(false);
    setError(null);
  }, [activeProvider.name, appState.provider, inputKey, setApiKey, setConnected, setError, setUsingFreePlan]);

  const activateFreePlan = useCallback(() => {
    if (appState.credits.remaining <= 0) {
      setError("Your free credits are used up. Connect your own API key to continue.");
      return;
    }

    const freeKey = process.env.NEXT_PUBLIC_GROQ_FREE_KEY?.trim() ?? "";
    if (!freeKey) {
      setError("Free plan key is not configured. Please set NEXT_PUBLIC_GROQ_FREE_KEY.");
      return;
    }

    setProvider("groq");
    setApiKey(freeKey);
    setConnected(true);
    setUsingFreePlan(true);
    setError(null);
  }, [appState.credits.remaining, setApiKey, setConnected, setError, setProvider, setUsingFreePlan]);

  const disconnect = useCallback(() => {
    sessionStorage.removeItem(storageKey(appState.provider));
    setInputKey("");
    setApiKey("");
    setConnected(false);
    setUsingFreePlan(false);
    setError(null);
  }, [appState.provider, setApiKey, setConnected, setError, setUsingFreePlan]);

  return {
    providers: PROVIDERS,
    activeProvider,
    inputKey,
    isKeyVisible,
    setInputKey,
    toggleVisibility: () => setIsKeyVisible((prev) => !prev),
    onProviderChange,
    connectOwnKey,
    activateFreePlan,
    disconnect
  };
};
