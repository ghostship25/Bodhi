import { useEffect, useSyncExternalStore } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { dayStamp, isDay, parseDay, shiftDay } from "@/lib/bodhi/system";
import { liveLinks, useBodhi, visibleObjects } from "@/lib/bodhi/store";
import { TYPE_IDS } from "@/lib/bodhi/types";
import { BodyEditor } from "@/components/bodhi/body-editor";

type DaySearch = { day?: string };

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): DaySearch => {
    const day = typeof search.day === "string" ? search.day : undefined;
    return { day: isDay(day) ? day : undefined };
  },
  component: TodayPage,
});

function useVisibleDay(explicit?: string): string {
  return useSyncExternalStore(
    () => () => {},
    () => explicit ?? dayStamp(),
    () => explicit ?? "pending",
  );
}

function TodayPage() {
  const { day } = Route.useSearch();
  const iso = useVisibleDay(day);
  const library = useBodhi((state) => state.library);
  const updateObject = useBodhi((state) => state.updateObject);
  const setProp = useBodhi((state) => state.setProp);
  const ensureDaily = useBodhi((state) => state.ensureDaily);
  const navigate = useNavigate();
  const dated = iso !== "pending";

  useEffect(() => {
    if (!dated) return;
    const hasToday = library.objects.some((object) => object.day === iso && !object.deletedAt);
    const hasPending = library.objects.some((object) => object.day === "pending" && !object.deletedAt);
    if (!hasToday && !hasPending) ensureDaily(iso);
  }, [dated, iso, library.objects, ensureDaily]);

  const daily =
    library.objects.find((object) => object.day === iso && !object.deletedAt) ??
    library.objects.find((object) => object.day === "pending" && !object.deletedAt);
  const openTasks = visibleObjects(library).filter(
    (object) => object.typeId === TYPE_IDS.task && object.props.done !== true,
  );
  const pool = visibleObjects(library).filter((object) => !object.day && object.typeId !== TYPE_IDS.task);
  const revisit = dated && pool.length > 0 ? pool[hashDay(iso) % pool.length] : undefined;
  const connected = daily
    ? liveLinks(library)
        .filter((link) => link.fromId === daily.id || link.toId === daily.id)
        .map((link) => library.objects.find((object) => object.id === (link.fromId === daily.id ? link.toId : link.fromId)))
        .filter((object) => object && !object.deletedAt)
    : [];
  const seen = new Set<string>();

  return (
    <div className="rise mx-auto max-w-2xl px-5 py-6 md:py-10">
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous day"
          disabled={!dated}
          className="grid size-11 place-items-center rounded-full border border-line disabled:opacity-40"
          onClick={() => dated && void navigate({ to: "/", search: { day: shiftDay(iso, -1) } })}
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          className="text-sm text-ink-soft"
          onClick={() => void navigate({ to: "/", search: {} })}
        >
          {dated && iso === dayStamp() ? "Today" : "Jump to today"}
        </button>
        <button
          type="button"
          aria-label="Next day"
          disabled={!dated}
          className="grid size-11 place-items-center rounded-full border border-line disabled:opacity-40"
          onClick={() => dated && void navigate({ to: "/", search: { day: shiftDay(iso, 1) } })}
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
      {dated ? (
        <p className="mt-8 text-sm font-medium tracking-wide text-ink-soft">{format(parseDay(iso), "EEEE")}</p>
      ) : (
        <p className="mt-8 text-sm font-medium tracking-wide text-ink-soft">Daily note</p>
      )}
      <h1 className="mt-1 font-serif text-4xl tracking-tight text-balance">
        {dated ? format(parseDay(iso), "d MMMM yyyy") : "Today"}
      </h1>
      <div className="mt-6">
        {daily ? (
          <BodyEditor
            label="Daily note"
            value={daily.body}
            onChange={(body) => updateObject(daily.id, { body })}
            objects={visibleObjects(library).filter((object) => object.id !== daily.id)}
          />
        ) : (
          <p className="text-sm text-ink-soft">This day has no note yet.</p>
        )}
      </div>
      {openTasks.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-medium text-ink-soft">Open tasks</h2>
          <ul className="mt-3 divide-y divide-line">
            {openTasks.map((task) => (
              <li key={task.id} className="flex items-center gap-3 py-3">
                <input
                  type="checkbox"
                  aria-label={`Done: ${task.title}`}
                  className="size-4 accent-accent"
                  onChange={() => setProp(task.id, "done", true)}
                />
                <Link to="/o/$objectId" params={{ objectId: task.id }} className="font-serif text-lg">
                  {task.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      {revisit && (
        <section className="mt-8 rounded-2xl border border-line px-4 py-3">
          <h2 className="text-sm font-medium text-ink-soft">Revisit</h2>
          <Link to="/o/$objectId" params={{ objectId: revisit.id }} className="mt-1 block font-serif text-lg">
            {revisit.title}
          </Link>
          <p className="text-sm text-ink-faint">A note from the rest of your library, different each day.</p>
        </section>
      )}
      <section className="mt-8">
        <h2 className="text-sm font-medium text-ink-soft">Connected</h2>
        <ul className="mt-3 divide-y divide-line">
          {connected.length === 0 && <li className="py-3 text-sm text-ink-faint">Link something with [[double brackets]].</li>}
          {connected.map((object) => {
            if (!object || seen.has(object.id)) return null;
            seen.add(object.id);
            return (
              <li key={object.id} className="py-3">
                <Link to="/o/$objectId" params={{ objectId: object.id }} className="font-serif text-lg">
                  {object.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
      <Link to="/ask" className="mt-8 inline-block text-sm text-ink">
        Ask your notes
      </Link>
    </div>
  );
}

function hashDay(day: string): number {
  let hash = 0;
  for (const char of day) hash = (hash * 33 + char.charCodeAt(0)) >>> 0;
  return hash;
}
