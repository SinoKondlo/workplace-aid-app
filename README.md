# AI Workplace Productivity Assistant

A modern, responsive SaaS-style dashboard that helps you write emails, summarize meetings, and plan your day with AI.

Built with **TanStack Start**, **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Lovable AI**.

![Built with Lovable](https://lovable.dev/badge)

---

## Features

- **Dashboard home** — quick navigation and overview of all productivity tools.
- **Smart Email Generator** — enter a purpose, recipient, key points, and tone (Formal, Friendly, Persuasive) to get a polished, professional email.
- **Meeting Notes Summarizer** — paste raw notes and extract a clean summary, action items, decisions, and deadlines.
- **AI Task Planner** — input tasks, priorities, and available time to generate a realistic, prioritized schedule.
- **Responsive design** — works on desktop, tablet, and mobile with a collapsible sidebar.
- **Loading states, error handling, editable output, and copy-to-clipboard** for a smooth user experience.
- **Responsible AI disclaimer** — visible throughout the app to remind users that AI output should be reviewed before use.

---

## Tech Stack

- [TanStack Start](https://tanstack.com/start/) — full-stack React framework with server functions.
- [TanStack Router](https://tanstack.com/router/) — file-based routing.
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) — accessible UI components.
- [AI SDK](https://sdk.vercel.ai/) — typed AI model integration.
- [Lovable AI Gateway](https://docs.lovable.dev/features/ai) — powers the AI features.
- [Zod](https://zod.dev/) — schema validation.

---

## Getting Started

### Prerequisites

- Node.js (v20 or newer)
- [bun](https://bun.sh/) or npm

### Install

```bash
git clone <repository-url>
cd <repository-name>
bun install
# or npm install
```

### Development

```bash
bun dev
# or npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

### Build

```bash
bun run build
# or npm run build
```

---

## Project Structure

```
src/
  components/        # Shared UI components (sidebar, page header, tool output)
  lib/               # Server functions and AI gateway provider
  routes/            # TanStack Start routes
    index.tsx        # Dashboard home
    email.tsx        # Smart Email Generator
    notes.tsx        # Meeting Notes Summarizer
    planner.tsx      # AI Task Planner
    __root.tsx       # Root layout with sidebar and Toaster
  styles.css         # Tailwind v4 theme tokens and design system
```

---

## AI Features

AI calls are handled by server functions in `src/lib/ai.functions.ts` and powered by **Lovable AI Gateway** through the AI SDK.

- **Email generation** uses streaming text generation for a fast, natural drafting experience.
- **Meeting notes summarization** and **task planning** use structured output (Zod schemas) to return consistent, actionable results.

All AI features are gated with loading states and clear error handling.

---

## Responsible AI

This app includes a visible **Responsible AI** disclaimer. AI-generated content is meant to assist, not replace, human judgment. Always review generated emails, summaries, and schedules before sharing or acting on them.

---

## License

This project is built and owned by you. Feel free to modify, deploy, and share it.

Built with [Lovable](https://lovable.dev).
