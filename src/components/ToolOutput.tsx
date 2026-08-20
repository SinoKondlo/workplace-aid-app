import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Couldn't copy to clipboard. Please copy manually.");
    }
  };

  return (
    <Button type="button" variant="outline" size="sm" onClick={copy} disabled={!value.trim()}>
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      {copied ? "Copied" : label}
    </Button>
  );
}

export function EditableOutput({
  id,
  value,
  onChange,
  rows = 12,
  placeholder,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <Textarea
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      rows={rows}
      placeholder={placeholder}
      className="resize-y bg-background font-normal leading-relaxed"
    />
  );
}

export function AiDisclaimer() {
  return (
    <p className="rounded-lg border border-border bg-accent/50 px-4 py-3 text-xs text-accent-foreground">
      <strong className="font-semibold">Responsible AI:</strong> This content is AI-generated and
      may contain errors or omissions. Review, edit and verify it before sending, sharing or acting
      on it.
    </p>
  );
}

export function ErrorNotice({ message }: { message: string }) {
  return (
    <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
      {message}
    </p>
  );
}
