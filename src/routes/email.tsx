import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import { Loader2, Mail, Sparkles } from "lucide-react";
import { generateEmail } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AiDisclaimer, CopyButton, EditableOutput, ErrorNotice } from "@/components/ToolOutput";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Draft clear, professional work emails in seconds. Choose a formal, friendly or persuasive tone, then edit and copy the result.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "Generate professional workplace emails with a formal, friendly or persuasive tone.",
      },
    ],
  }),
  component: EmailPage,
});

type Tone = "Formal" | "Friendly" | "Persuasive";

function EmailPage() {
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [draft, setDraft] = useState("");

  const generate = useServerFn(generateEmail);
  const mutation = useMutation({
    mutationFn: (data: { purpose: string; recipient: string; keyPoints: string; tone: Tone }) =>
      generate({ data }),
  });

  useEffect(() => {
    if (mutation.data?.email) setDraft(mutation.data.email);
  }, [mutation.data]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    mutation.mutate({ purpose, recipient, keyPoints, tone });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Describe the situation and let AI write a polished, ready-to-send email."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="surface-card space-y-4 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Input
          </h2>
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              required
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g. Thandi, Head of Operations"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Input
              id="purpose"
              required
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Request a deadline extension"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="keyPoints">Key points</Label>
            <Textarea
              id="keyPoints"
              required
              rows={6}
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
              placeholder={"One point per line, e.g.\n- Client feedback arrived late\n- Need 3 extra days\n- Quality will improve"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Select value={tone} onValueChange={(value) => setTone(value as Tone)}>
              <SelectTrigger id="tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Formal">Formal</SelectItem>
                <SelectItem value="Friendly">Friendly</SelectItem>
                <SelectItem value="Persuasive">Persuasive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Generating email…
              </>
            ) : (
              <>
                <Sparkles className="size-4" /> Generate email
              </>
            )}
          </Button>
          {mutation.isError && <ErrorNotice message={(mutation.error as Error).message} />}
        </form>

        <div className="surface-card space-y-4 p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Output
            </h2>
            <CopyButton value={draft} label="Copy email" />
          </div>
          {mutation.isPending && !draft ? (
            <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
              <Loader2 className="mr-2 size-4 animate-spin" /> Writing your email…
            </div>
          ) : (
            <EditableOutput
              value={draft}
              onChange={setDraft}
              rows={18}
              placeholder="Your generated email will appear here and can be edited before copying."
            />
          )}
          <AiDisclaimer />
        </div>
      </div>
    </div>
  );
}
