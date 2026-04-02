import { Card } from "@/components/ui/Card";

export const AppHeader = () => {
  return (
    <Card className="space-y-2 p-5">
      <h1 className="font-display text-4xl leading-none tracking-tight text-text sm:text-5xl">Family Tree AI</h1>
      <p className="text-sm text-muted sm:text-base">Describe your family in plain English — AI builds the tree</p>
    </Card>
  );
};
