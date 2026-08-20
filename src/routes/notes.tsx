import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import { Loader2, NotebookPen, Sparkles } from "lucide-react";
import { summarizeNotes } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AiDisclaimer, CopyButton, EditableOutput, ErrorNotice } from "@/components/ToolOutput";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Turn messy meeting notes into a concise summary with action items, decisions and deadlines you can edit and copy.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer" },
      {
        property: "og:description",
        content: "Summarize meeting notes and extract action items, decisions and deadlines.",
      },
    ],
  }),
  component: NotesPage,
});

type Sections = {
  summary: string;
  actionItems: string;
  decisions: string;
  deadlines: string;
};

const emptySections: Sections = { summary: "", actionItems: "", decisions: "", deadlines: "" };

function toLines(items: string[]) {
  return items.length ? items.map((item) => `• ${item}`).join("\n") : "None recorded.";
}

function NotesPage() {
  const [notes, setNotes] = useState("");
  const [sections, setSections] = useState<Sections>(emptySections);

  const summarize = useServerFn(summarizeNotes);
  const mutation = useMutation({
    mutationFn: (data: { notes: string }) => summarize({ data }),
  });

  useEffect(() => {
    const result = mutation.data;
    if (!result) return;
    setSections({
      summary: result.summary,
      actionItems: toLines(result.actionItems),
      decisions: toLines(result.decisions),
      deadlines: toLines(result.deadlines),
    });
  }, [mutation.data]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    mutation.mutate({ notes });
  };

  const fullText = `SUMMARY\n${sections.summary}\n\nACTION ITEMS\n${sections.actionItems}\n\nDECISIONS\n${sections.decisions}\n\nDEADLINES\n${sections.deadlines}`;

  const blocks: { key: keyof Sections; label: string; rows: number }[] = [
    { key: "summary", label: "Summary", rows: 6 },
    { key: "actionItems", label: "Action items", rows: 5 },
    { key: "decisions", label: "Decisions", rows: 4 },
    { key: "deadlines", label: "Deadlines", rows: 4 },
  ];

  const hasOutput = Object.values(sections).some((value) => value.trim());

  return (
    <div className="space-y-6">
      <PageHeader
        icon={NotebookPen}
        title="Meeting Notes Summarizer"
        description="Paste raw notes and get a clean summary plus action items, decisions and deadlines."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="surface-card space-y-4 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Input
          </h2>
          <div className="space-y-2">
            <Label htmlFor="notes">Meeting notes</Label>
            <Textarea
              id="notes"
              required
              rows={18}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste your raw meeting notes, transcript or bullet points here…"
            />
          </div>
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Summarizing…
              </>
            ) : (
              <>
                <Sparkles className="size-4" /> Summarize notes
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
            <CopyButton value={hasOutput ? fullText : ""} label="Copy all" />
          </div>

          {mutation.isPending && !hasOutput ? (
            <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
              <Loader2 className="mr-2 size-4 animate-spin" /> Reading your notes…
            </div>
          ) : (
            <div className="space-y-5">
              {blocks.map(({ key, label, rows }) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={key}>{label}</Label>
                    <CopyButton value={sections[key]} />
                  </div>
                  <EditableOutput
                    id={key}
                    value={sections[key]}
                    rows={rows}
                    onChange={(value) => setSections((prev) => ({ ...prev, [key]: value }))}
                    placeholder={`${label} will appear here.`}
                  />
                </div>
              ))}
            </div>
          )}
          <AiDisclaimer />
        </div>
      </div>
    </div>
  );
}
