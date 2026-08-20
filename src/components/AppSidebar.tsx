import { Link } from "@tanstack/react-router";
import { LayoutDashboard, Mail, NotebookPen, CalendarClock, Sparkles, Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/notes", label: "Notes Summarizer", icon: NotebookPen },
  { to: "/planner", label: "Task Planner", icon: CalendarClock },
] as const;

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-3 px-5 py-6">
        <span className="flex size-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
          <Sparkles className="size-5" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold">AI Workplace</p>
          <p className="text-xs text-sidebar-foreground/60">Productivity Assistant</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {links.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            activeOptions={{ exact: to === "/" }}
            activeProps={{
              className: "bg-sidebar-accent text-sidebar-accent-foreground",
            }}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
          >
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
      </nav>
      <p className="border-t border-sidebar-border px-5 py-4 text-xs text-sidebar-foreground/60">
        AI-generated content may be inaccurate. Always review before sending or sharing.
      </p>
    </div>
  );
}

export function AppSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border md:block">
        <div className="sticky top-0 h-screen">
          <NavContent />
        </div>
      </aside>

      <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-card px-4 py-3 md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open navigation">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 border-sidebar-border p-0">
            <NavContent onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <span className="text-sm font-semibold">AI Workplace Assistant</span>
      </header>
    </>
  );
}
