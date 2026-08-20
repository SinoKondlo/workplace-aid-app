import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarClock, Mail, NotebookPen, ShieldCheck } from "lucide-react";
import { AiDisclaimer } from "@/components/ToolOutput";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "A simple AI workspace with three tools: a smart email generator, a meeting notes summarizer and a task planner that builds a realistic schedule.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Write emails, summarize meeting notes and plan your day with AI.",
      },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    description:
      "Turn a purpose and a few key points into a polished email in a formal, friendly or persuasive tone.",
  },
  {
    to: "/notes",
    icon: NotebookPen,
    title: "Meeting Notes Summarizer",
    description:
      "Paste raw notes and get a concise summary plus action items, decisions and deadlines.",
  },
  {
    to: "/planner",
    icon: CalendarClock,
    title: "AI Task Planner",
    description:
      "Share tasks, priorities and available time to get a realistic daily or weekly schedule.",
  },
] as const;

function Dashboard() {
  return (
    <div className="space-y-8">
      <section className="hero-gradient overflow-hidden rounded-2xl px-6 py-10 text-sidebar-foreground sm:px-10 sm:py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sidebar-foreground/70">
          Workplace AI
        </p>
        <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
          AI Workplace Productivity Assistant
        </h1>
        <p className="mt-3 max-w-xl text-sm text-sidebar-foreground/80 sm:text-base">
          Three focused tools to help you write, summarize and plan faster — so you can spend your
          time on the work that matters.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {tools.map(({ to, icon: Icon, title, description }) => (
          <Link
            key={to}
            to={to}
            className="surface-card group flex flex-col gap-3 p-6 transition-transform hover:-translate-y-1"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Icon className="size-5" />
            </span>
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
            <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-primary">
              Open tool
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </section>

      <section className="surface-card space-y-3 p-6">
        <div className="flex items-center gap-2 text-foreground">
          <ShieldCheck className="size-5 text-primary" />
          <h2 className="text-base font-semibold">Responsible AI use</h2>
        </div>
        <AiDisclaimer />
      </section>
    </div>
  );
}
