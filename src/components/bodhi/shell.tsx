import { useEffect, useState, type ReactNode } from "react";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { MessageSquare, Moon, Plus, Search, Sun, Trash2, Waypoints } from "lucide-react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useBodhi } from "@/lib/bodhi/store";
import { TYPE_IDS } from "@/lib/bodhi/types";
import { CommandPalette } from "@/components/bodhi/command-palette";
import { TYPE_DOT, TypeIcon } from "@/components/bodhi/icons";
import { QuickCapture } from "@/components/bodhi/quick-capture";
import { cn } from "@/lib/cn";

const THEME_KEY = "bodhi-theme";

function applyTheme(mode: "light" | "dark") {
  document.documentElement.classList.toggle("dark", mode === "dark");
  localStorage.setItem(THEME_KEY, mode);
}

function currentTheme(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function AppShell() {
  const init = useBodhi((state) => state.init);
  const onSession = useBodhi((state) => state.onSession);
  const ready = useBodhi((state) => state.ready);
  const inbox = useBodhi(
    (state) => state.library.objects.reduce((count, object) => count + (!object.deletedAt && !object.archived && object.inbox ? 1 : 0), 0),
  );
  const trash = useBodhi((state) => state.library.objects.reduce((count, object) => count + (object.deletedAt ? 1 : 0), 0));
  const pinKey = useBodhi((state) =>
    JSON.stringify(
      state.library.objects
        .filter((object) => !object.deletedAt && !object.archived && object.pinned)
        .slice(0, 6)
        .map((object) => ({ id: object.id, title: object.title })),
    ),
  );
  const pins = JSON.parse(pinKey) as { id: string; title: string }[];
  const types = useBodhi((state) => state.library.types);
  const setCapture = useBodhi((state) => state.setCaptureOpen);
  const setPalette = useBodhi((state) => state.setPaletteOpen);
  const syncStatus = useBodhi((state) => state.syncStatus);
  const active = useBodhi((state) => state.active);
  const { user, isPending } = useCurrentUserState();
  const [mounted, setMounted] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    void init();
  }, [init]);

  useEffect(() => {
    if (!ready || isPending) return;
    void onSession(user?.id ?? null);
  }, [ready, isPending, user?.id, onSession]);

  useEffect(() => {
    if (!ready || !user?.id) return;
    const tick = () => {
      const state = useBodhi.getState();
      if (state.syncUsers.includes(user.id)) void state.onSession(user.id);
    };
    window.addEventListener("focus", tick);
    const id = window.setInterval(tick, 30000);
    return () => {
      window.removeEventListener("focus", tick);
      window.clearInterval(id);
    };
  }, [ready, user?.id]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const meta = event.metaKey || event.ctrlKey;
      const target = event.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT" ||
        !!target?.isContentEditable;
      if (meta && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPalette(true);
      } else if (meta && event.key.toLowerCase() === "j") {
        event.preventDefault();
        setCapture(true);
      } else if (!typing && !meta && event.key.toLowerCase() === "c") {
        event.preventDefault();
        setCapture(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setCapture, setPalette]);

  return (
    <div className="flex h-dvh bg-paper text-ink">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-paper-2 md:flex">
        <div className="flex items-center justify-between px-4 py-4">
          <Link to="/" className="font-serif text-2xl tracking-tight">
            Bodhi
          </Link>
          <button
            type="button"
            aria-label="Toggle color theme"
            onClick={() => applyTheme(currentTheme() === "dark" ? "light" : "dark")}
            className="grid size-9 place-items-center rounded-full text-ink-soft hover:bg-paper"
          >
            <Sun className="size-4 dark:hidden" />
            <Moon className="hidden size-4 dark:block" />
          </button>
        </div>
        <div className="px-3 pb-2">
          <button
            type="button"
            onClick={() => setPalette(true)}
            className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-sm text-ink-soft hover:bg-paper hover:text-ink"
          >
            <Search className="size-4" />
            Search
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3">
          <NavLink to="/" active={pathname === "/"}>
            <TypeIcon name="calendar" className="size-4" />
            Today
          </NavLink>
          <NavLink to="/objects" search={{ type: "inbox" }} active={false}>
            <TypeIcon name="box" className="size-4" />
            Inbox
            {inbox > 0 && <span className="ml-auto text-xs tabular-nums text-ink-faint">{inbox}</span>}
          </NavLink>
          {pins.length > 0 && <div className="mt-5 px-2 text-xs text-ink-faint">Pinned</div>}
          {pins.map((object) => (
            <Link
              key={object.id}
              to="/o/$objectId"
              params={{ objectId: object.id }}
              className="truncate rounded-xl px-2 py-2 text-sm text-ink-soft hover:bg-paper hover:text-ink"
            >
              {object.title}
            </Link>
          ))}
          <div className="mt-5 px-2 text-xs text-ink-faint">Library</div>
          {types
            .filter((type) => type.id !== TYPE_IDS.daily)
            .map((type) => (
              <NavLink key={type.id} to="/objects" search={{ type: type.key }} active={false}>
                <span className={cn("size-2 rounded-full", TYPE_DOT[type.color])} />
                {type.plural}
              </NavLink>
            ))}
          <div className="mt-auto" />
          <NavLink to="/graph" active={pathname === "/graph"}>
            <Waypoints className="size-4" />
            Graph
          </NavLink>
          <NavLink to="/ask" active={pathname === "/ask"}>
            <MessageSquare className="size-4" />
            Ask
          </NavLink>
          {trash > 0 && (
            <NavLink to="/trash" active={pathname === "/trash"}>
              <Trash2 className="size-4" />
              Trash
              <span className="ml-auto text-xs tabular-nums text-ink-faint">{trash}</span>
            </NavLink>
          )}
        </nav>
        <div className="space-y-2 border-t border-line p-3">
          <button
            type="button"
            onClick={() => setCapture(true)}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-3 py-2 text-sm font-medium text-accent-fg"
          >
            <Plus className="size-4" />
            Capture
          </button>
          <Link to="/login" className="block truncate px-1 text-sm text-ink-soft">
            {!mounted || isPending
              ? "Account"
              : user
                ? syncStatus === "local" || active === "guest"
                  ? "On this device"
                  : "Synced"
                : "No account"}
          </Link>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 md:hidden">
          <Link to="/" className="font-serif text-xl">
            Bodhi
          </Link>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Search"
              onClick={() => setPalette(true)}
              className="grid size-11 place-items-center rounded-full text-ink"
            >
              <Search className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Toggle color theme"
              onClick={() => applyTheme(currentTheme() === "dark" ? "light" : "dark")}
              className="grid size-11 place-items-center rounded-full text-ink"
            >
              <Sun className="size-5 dark:hidden" />
              <Moon className="hidden size-5 dark:block" />
            </button>
          </div>
        </header>
        <main className="pb-nav flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper md:hidden">
        <div className="pb-safe grid grid-cols-4">
          <Tab to="/" label="Today" active={pathname === "/"}>
            <TypeIcon name="calendar" className="size-5" />
          </Tab>
          <Tab to="/objects" label="Objects" active={pathname.startsWith("/objects") || pathname.startsWith("/o/")}>
            <TypeIcon name="box" className="size-5" />
          </Tab>
          <Tab to="/graph" label="Graph" active={pathname === "/graph"}>
            <Waypoints className="size-5" />
          </Tab>
          <Tab to="/search" label="Search" active={pathname === "/search"}>
            <Search className="size-5" />
          </Tab>
        </div>
      </nav>
      <button
        type="button"
        aria-label="Quick capture"
        onClick={() => setCapture(true)}
        className="fixed right-4 z-30 grid size-14 place-items-center rounded-full bg-accent text-accent-fg shadow-panel md:hidden bottom-fab"
      >
        <Plus className="size-6" />
      </button>
      <QuickCapture />
      <CommandPalette />
    </div>
  );
}

function NavLink({
  to,
  search,
  active,
  children,
}: {
  to: string;
  search?: { type: string };
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      search={search}
      className={cn(
        "flex items-center gap-2 rounded-xl px-2 py-2 text-sm",
        active ? "bg-paper text-ink" : "text-ink-soft hover:bg-paper hover:text-ink",
      )}
    >
      {children}
    </Link>
  );
}

function Tab({
  to,
  label,
  active,
  children,
}: {
  to: string;
  label: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "flex min-h-14 flex-col items-center justify-center gap-1 text-xs",
        active ? "text-ink" : "text-ink-soft",
      )}
    >
      {children}
      {label}
    </Link>
  );
}

