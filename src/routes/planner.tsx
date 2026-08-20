import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { CalendarClock, Loader2, Sparkles } from "lucide-react";
import { planTasks } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AiDisclaimer, CopyButton, ErrorNotice } from "@/components/ToolOutput";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Turn a list of tasks, priorities and available hours into a realistic daily or weekly schedule you can follow.",
      },
      { property: "og:title", content: "AI Task Planner" },
      {
        property: "og:description",
        content: "Build a realistic prioritized daily or weekly schedule from your task list.",
      },
    ],
  }),
  component: PlannerPage,
});

type Horizon = "Daily" | "Weekly";

const priorityStyles: Record<string, string> = {
  High: "bg-destructive/10 text-destructive border-destructive/30",
  Medium: "bg-accent text-accent-foreground border-transparent",
  Low: "bg-muted text-muted-foreground border-transparent",
};

function PlannerPage() {
  const [tasks, setTasks] = useState("");
  const [priorities, setPriorities] = useState("");
  const [availableTime, setAvailableTime] = useState("");
  const [horizon, setHorizon] = useState<Horizon>("Daily");

  const plan = useServerFn(planTasks);
  const mutation = useMutation({
    mutationFn: (data: {
      tasks: string;
      priorities: string;
      availableTime: string;
      horizon: Horizon;
    }) => plan({ data }),
  });

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    mutation.mutate({ tasks, priorities, availableTime, horizon });
  };

  const result = mutation.data;
  const copyText = result
    ? [
        result.overview,
        "",
        ...result.blocks.map((b) => `${b.period} | ${b.time} | [${b.priority}] ${b.task} — ${b.note}`),
        "",
        ...result.tips.map((t) => `Tip: ${t}`),
      ].join("\n")
    : "";

  return (
    <div className="space-y-6">
      <PageHeader
        icon={CalendarClock}
        title="AI Task Planner"
        description="Share your tasks, priorities and available time to get a realistic, prioritized schedule."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <form onSubmit={onSubmit} className="surface-card space-y-4 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Input
          </h2>
          <div className="space-y-2">
            <Label htmlFor="tasks">Tasks</Label>
            <Textarea
              id="tasks"
              required
              rows={8}
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              placeholder={"One task per line, e.g.\n- Finish Q3 report\n- Review 4 CVs\n- Client call prep"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priorities">Priorities</Label>
            <Textarea
              id="priorities"
              rows={3}
              value={priorities}
              onChange={(e) => setPriorities(e.target.value)}
              placeholder="e.g. Q3 report is urgent, CV reviews can wait until Friday"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Available time</Label>
            <Input
              id="time"
              required
              value={availableTime}
              onChange={(e) => setAvailableTime(e.target.value)}
              placeholder="e.g. 6 hours, 09:00–16:00 with a 1h lunch"
            />
          </div>
          <div className="space-y-2">
            <Label>Plan for</Label>
            <div className="flex gap-2">
              {(["Daily", "Weekly"] as const).map((option) => (
                <Button
                  key={option}
                  type="button"
                  variant={horizon === option ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setHorizon(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Building schedule…
              </>
            ) : (
              <>
                <Sparkles className="size-4" /> Generate schedule
              </>
            )}
          </Button>
          {mutation.isError && <ErrorNotice message={(mutation.error as Error).message} />}
        </form>

        <div className="surface-card space-y-4 p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Schedule
            </h2>
            <CopyButton value={copyText} label="Copy schedule" />
          </div>

          {mutation.isPending ? (
            <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
              <Loader2 className="mr-2 size-4 animate-spin" /> Planning your time…
            </div>
          ) : result ? (
            <div className="space-y-4">
              <p className="rounded-lg bg-secondary px-4 py-3 text-sm text-secondary-foreground">
                {result.overview}
              </p>
              <ul className="space-y-3">
                {result.blocks.map((block, index) => (
                  <li
                    key={`${block.period}-${block.time}-${index}`}
                    className="rounded-lg border border-border p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="font-medium">
                        {block.period}
                      </Badge>
                      <span className="text-sm font-semibold text-foreground">{block.time}</span>
                      <Badge
                        variant="outline"
                        className={priorityStyles[block.priority] ?? priorityStyles["Low"]}
                      >
                        {block.priority}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm font-medium text-foreground">{block.task}</p>
                    {block.note && (
                      <p className="mt-1 text-sm text-muted-foreground">{block.note}</p>
                    )}
                  </li>
                ))}
              </ul>
              {result.tips.length > 0 && (
                <div className="rounded-lg border border-border bg-muted/40 p-4">
                  <p className="text-sm font-semibold text-foreground">Tips</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {result.tips.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border px-6 text-center text-sm text-muted-foreground">
              Your prioritized schedule will appear here.
            </div>
          )}
          <AiDisclaimer />
        </div>
      </div>
    </div>
  );
}
