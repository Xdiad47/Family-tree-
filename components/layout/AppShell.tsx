"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AppHeader } from "@/components/layout/AppHeader";
import { FamilyInputSection } from "@/components/layout/FamilyInputSection";
import { ProviderSelector } from "@/components/provider/ProviderSelector";
import { ApiKeyInput } from "@/components/provider/ApiKeyInput";
import { TreeCanvas } from "@/components/tree/TreeCanvas";
import { ChatDrawer } from "@/components/chat/ChatDrawer";
import { useAppViewModel } from "@/viewmodels/useAppViewModel";
import { useProviderViewModel } from "@/viewmodels/useProviderViewModel";
import { useTreeViewModel } from "@/viewmodels/useTreeViewModel";
import { useChatViewModel } from "@/viewmodels/useChatViewModel";

export const AppShell = () => {
  const { state, actions } = useAppViewModel();

  const providerVM = useProviderViewModel({
    appState: state,
    setProvider: actions.setProvider,
    setApiKey: actions.setApiKey,
    setConnected: actions.setConnected,
    setUsingFreePlan: actions.setUsingFreePlan,
    setError: actions.setError
  });

  const treeVM = useTreeViewModel({
    appState: state,
    setFamilyNodes: actions.setFamilyNodes,
    setGenerating: actions.setGenerating,
    setError: actions.setError,
    setCredits: actions.setCredits,
    consumeFreeCredit: actions.consumeFreeCredit
  });
  const { hasTree } = treeVM;

  const chatVM = useChatViewModel({
    provider: state.provider,
    apiKey: state.apiKey,
    isConnected: state.isConnected,
    familyNodes: state.familyNodes,
    onTreeUpdate: treeVM.applyChatTreeUpdate
  });

  const remaining = state.credits.remaining;
  const canGenerateTree = state.isConnected && state.familyDescription.trim().length > 0;

  return (
    <>
      <main
        className={`mx-auto w-full max-w-[1440px] px-3 pt-3 sm:px-4 lg:px-6 ${
          hasTree ? "pb-40" : "pb-6 sm:pb-8"
        }`}
      >
        <div className="grid-shell">
          <section className="space-y-4">
            <AppHeader />

            <Card className="space-y-4">
              <div className="rounded-xl border border-black/10 bg-gradient-to-b from-white to-[#fcfcfa] p-4">
                <h2 className="text-sm font-bold text-text">🎉 Try for Free — 5 Generations Included</h2>
                <p className="mt-1 text-sm text-muted">
                  Powered by Groq AI (Llama 3.3). No key needed to get started.
                </p>

                <div className="mt-3 flex items-center gap-2">
                  {Array.from({ length: state.credits.total }).map((_, index) => (
                    <span
                      key={`credit-${index}`}
                      className={`h-3 w-3 rounded-full border border-black/10 ${index < state.credits.used ? "bg-slate-300" : "bg-primary"}`}
                    />
                  ))}
                </div>
                <p className="mt-2 text-xs font-semibold text-muted">
                  Remaining credits: {remaining} / {state.credits.total}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    onClick={providerVM.activateFreePlan}
                    disabled={remaining <= 0}
                    className="h-10"
                  >
                    {state.isUsingFreePlan ? "Free Plan Enabled (5 Credits)" : "Use Free Key (5 Credits)"}
                  </Button>

                  <span className="text-xs font-semibold text-muted">
                    {state.isUsingFreePlan
                      ? `✓ Free Plan Active — ${remaining} credits remaining`
                      : remaining <= 0
                        ? "Free credits used up. Enter your own key below."
                        : ""}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-black/10 bg-gradient-to-b from-white to-[#fcfcfa] p-4">
                <h3 className="text-sm font-bold text-text">Or Connect Your Own API Key</h3>
                <p className="mt-1 text-xs text-muted">Select provider, paste your key, and connect securely.</p>

                <div className="mt-3 space-y-3">
                  <ProviderSelector
                    providers={providerVM.providers}
                    activeProvider={state.provider}
                    onChange={providerVM.onProviderChange}
                  />
                  <ApiKeyInput
                    providerName={providerVM.activeProvider.name}
                    placeholder={providerVM.activeProvider.keyPlaceholder}
                    keyValue={providerVM.inputKey}
                    isVisible={providerVM.isKeyVisible}
                    isConnected={state.isConnected}
                    isUsingFreePlan={state.isUsingFreePlan}
                    creditsRemaining={state.credits.remaining}
                    onKeyChange={providerVM.setInputKey}
                    onToggleVisibility={providerVM.toggleVisibility}
                    onConnect={providerVM.connectOwnKey}
                    onDisconnect={providerVM.disconnect}
                  />
                </div>

                <p className="mt-3 text-xs text-muted">
                  Your key is stored only in this browser session and sent directly to the AI provider's official API.
                  We never store or log it.
                </p>
              </div>
            </Card>

            {!hasTree && (
              <FamilyInputSection
                value={state.familyDescription}
                isGenerating={state.isGenerating}
                canGenerate={canGenerateTree}
                errorMessage={state.errorMessage}
                onChange={actions.setFamilyDescription}
                onGenerate={() => treeVM.generateTree(state.familyDescription)}
              />
            )}
          </section>

          <section>
            <Card className="p-2">
              <TreeCanvas
                nodes={state.familyNodes}
                bounds={treeVM.treeBounds}
                isLoading={state.isGenerating}
                loadingStep={treeVM.loadingStep}
                nodeWidth={treeVM.nodeDimensions.width}
                nodeHeight={treeVM.nodeDimensions.height}
                legendCollapsed={treeVM.legendCollapsed}
                zoomSignal={treeVM.zoomSignal}
                onZoomIn={() => treeVM.requestZoom("in")}
                onZoomOut={() => treeVM.requestZoom("out")}
                onFitScreen={() => treeVM.requestZoom("fit")}
                onResetLayout={treeVM.resetLayout}
                onDownload={treeVM.downloadTreeAsPng}
                onLegendToggle={() => treeVM.setLegendCollapsed((prev) => !prev)}
                onNodeMove={treeVM.updateNodePosition}
                onNodeMoveEnd={treeVM.finalizeNodePosition}
              />
            </Card>
          </section>
        </div>
      </main>

      <ChatDrawer
        visible={hasTree}
        isOpen={chatVM.isOpen}
        messages={chatVM.messages}
        inputValue={chatVM.inputValue}
        isTyping={chatVM.isTyping}
        onToggle={chatVM.toggleOpen}
        onInputChange={chatVM.setInputValue}
        onSend={chatVM.sendMessage}
      />
    </>
  );
};
