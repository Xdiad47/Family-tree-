import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface FamilyInputSectionProps {
  value: string;
  isGenerating: boolean;
  canGenerate: boolean;
  errorMessage: string | null;
  onChange: (value: string) => void;
  onGenerate: () => void;
}

export const FamilyInputSection = ({
  value,
  isGenerating,
  canGenerate,
  errorMessage,
  onChange,
  onGenerate
}: FamilyInputSectionProps) => {
  return (
    <Card className="space-y-3">
      <h2 className="text-base font-bold text-text">Describe Your Family</h2>

      <div className="relative rounded-xl border border-black/10 bg-white p-3 pb-8">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={5}
          className="h-full min-h-[120px] w-full resize-y border-0 bg-transparent text-sm text-text outline-none"
          placeholder={"e.g. I am the son of John Doe (father) and Alda Doe (mother).\nMy wife is Alexa. My elder brother is Amenadiel Doe, his wife is Linda\nDoe, and their son is Charlie Doe. I have four uncles who\nare my father's younger brothers — my father is the eldest."}
        />
        <span className="absolute bottom-2 right-3 text-xs text-muted">{value.length} characters</span>
      </div>

      <Button onClick={onGenerate} disabled={isGenerating || !canGenerate} className="h-11 w-full sm:w-auto">
        {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
        {isGenerating ? "Generating..." : "✦ Generate Family Tree"}
      </Button>

      <p className="min-h-5 text-sm font-semibold text-error">{errorMessage ?? ""}</p>
    </Card>
  );
};
