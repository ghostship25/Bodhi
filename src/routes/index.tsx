import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { dayStamp, isDay, parseDay, shiftDay } from "@/lib/bodhi/system";
import { liveLinks, useBodhi, visibleObjects } from "@/lib/bodhi/store";
import { TYPE_IDS } from "@/lib/bodhi/types";
import { openChecks } from "@/lib/bodhi/checks";
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
  const toggleCheck = useBodhi((state) => state.toggleCheck);
  const navigate = useNavigate();
  const dated = iso !== "pending";
  const [calendarOpen, setCalendarOpen] = useState(false);

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
    (object) => object.typeId === TYPE_IDS.task && object.props.done !== true && object.props.due !== iso,
  );
  const dueToday = dated
    ? visibleObjects(library).filter(
        (object) => object.typeId === TYPE_IDS.task && object.props.done !== true && object.props.due === iso,
      )
    : [];
  const meetings = dated
    ? visibleObjects(library).filter((object) => object.typeId === TYPE_IDS.meeting && object.props.when === iso)
    : [];
  const checks = useMemo(() => openChecks(visibleObjects(library)), [library]);
  const notedDays = useMemo(() => {
    const days = new Set<string>();
    for (const object of library.objects) {
      if (object.day && object.day !== "pending" && !object.deletedAt && object.body.trim()) days.add(object.day);
    }
    return days;
  }, [library.objects]);
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
    <div className="rise mx-auto max-w-2xl px-5 py-6 md:py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-ink-soft">{dated ? format(parseDay(iso), "EEEE") : "Daily note"}</p>
          <h1 className="mt-1 font-serif text-4xl tracking-tight text-balance">
            {dated ? format(parseDay(iso), "d MMMM") : "Today"}
          </h1>
        </div>
        <div className="flex items-center">
          <button
            type="button"
            aria-label="Previous day"
            disabled={!dated}
            className="grid size-11 place-items-center rounded-full text-ink-soft disabled:opacity-40"
            onClick={() => dated && void navigate({ to: "/", search: { day: shiftDay(iso, -1) } })}
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Next day"
            disabled={!dated}
            className="grid size-11 place-items-center rounded-full text-ink-soft disabled:opacity-40"
            onClick={() => dated && void navigate({ to: "/", search: { day: shiftDay(iso, 1) } })}
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
      {dated && (
        <WeekStrip iso={iso} marks={notedDays} onPick={(day) => void navigate({ to: "/", search: { day } })} />
      )}
      {dated && (
        <div className="mt-2 flex gap-4 text-sm text-ink-soft">
          {iso !== dayStamp() && (
            <button type="button" onClick={() => void navigate({ to: "/", search: {} })}>
              Today
            </button>
          )}
          <button type="button" onClick={() => setCalendarOpen((open) => !open)}>
            {calendarOpen ? "Hide month" : "Month"}
          </button>
        </div>
      )}
      {dated && calendarOpen && (
        <MonthGrid
          iso={iso}
          marks={notedDays}
          onPick={(day) => {
            setCalendarOpen(false);
            void navigate({ to: "/", search: { day } });
          }}
        />
      )}
      <div className="mt-8">
        {daily ? (
          <BodyEditor
            bare
            label="Daily note"
            value={daily.body}
            onChange={(body) => updateObject(daily.id, { body })}
            objects={visibleObjects(library).filter((object) => object.id !== daily.id)}
          />
        ) : (
          <p className="text-sm text-ink-soft">Nothing written for this day.</p>
        )}
      </div>
      {dueToday.length + meetings.length + checks.length + openTasks.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm text-ink-faint">
            Open · {dueToday.length + meetings.length + checks.length + openTasks.length}
          </h2>
          <ul className="mt-2">
            {dueToday.map((task) => (
              <li key={task.id} className="flex items-center gap-3 py-2">
                <input
                  type="checkbox"
                  aria-label={`Done: ${task.title}`}
                  className="size-4 accent-accent"
                  onChange={() => setProp(task.id, "done", true)}
                />
                <Link to="/o/$objectId" params={{ objectId: task.id }} className="min-w-0 truncate">
                  {task.title}
                </Link>
                <span className="ml-auto text-xs text-ink-faint">Due</span>
              </li>
            ))}
            {meetings.map((meeting) => (
              <li key={meeting.id} className="flex items-center gap-3 py-2">
                <span className="size-4" />
                <Link to="/o/$objectId" params={{ objectId: meeting.id }} className="min-w-0 truncate">
                  {meeting.title}
                </Link>
                <span className="ml-auto text-xs text-ink-faint">Meeting</span>
              </li>
            ))}
            {checks.map((check) => {
              const source = library.objects.find((object) => object.id === check.objectId);
              return (
                <li key={`${check.objectId}:${check.line}`} className="flex items-center gap-3 py-2">
                  <input
                    type="checkbox"
                    aria-label={`Done: ${check.text}`}
                    className="size-4 accent-accent"
                    onChange={() => toggleCheck(check.objectId, check.line)}
                  />
                  <span className="min-w-0 truncate">{check.text}</span>
                  {source && (
                    <Link to="/o/$objectId" params={{ objectId: source.id }} className="ml-auto shrink-0 text-xs text-ink-faint">
                      {source.title}
                    </Link>
                  )}
                </li>
              );
            })}
            {openTasks.map((task) => (
              <li key={task.id} className="flex items-center gap-3 py-2">
                <input
                  type="checkbox"
                  aria-label={`Done: ${task.title}`}
                  className="size-4 accent-accent"
                  onChange={() => setProp(task.id, "done", true)}
                />
                <Link to="/o/$objectId" params={{ objectId: task.id }} className="min-w-0 truncate">
                  {task.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      {revisit && (
        <p className="mt-8 text-sm text-ink-soft">
          Revisit{" "}
          <Link to="/o/$objectId" params={{ objectId: revisit.id }} className="text-ink">
            {revisit.title}
          </Link>
        </p>
      )}
      {connected.some(Boolean) && (
        <section className="mt-8">
          <h2 className="text-sm text-ink-faint">Linked</h2>
          <ul className="mt-2">
            {connected.map((object) => {
              if (!object || seen.has(object.id)) return null;
              seen.add(object.id);
              return (
                <li key={object.id} className="py-1.5">
                  <Link to="/o/$objectId" params={{ objectId: object.id }}>
                    {object.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}

function hashDay(day: string): number {
  let hash = 0;
  for (const char of day) hash = (hash * 33 + char.charCodeAt(0)) >>> 0;
  return hash;
}

function WeekStrip({
  iso,
  marks,
  onPick,
}: {
  iso: string;
  marks: Set<string>;
  onPick: (day: string) => void;
}) {
  const days = Array.from({ length: 7 }, (_, index) => shiftDay(iso, index - 3));
  return (
    <div className="mt-5 grid grid-cols-7 gap-1">
      {days.map((day) => {
        const date = parseDay(day);
        const selected = day === iso;
        return (
          <button
            key={day}
            type="button"
            onClick={() => onPick(day)}
            className={`flex min-h-11 flex-col items-center justify-center rounded-xl py-1 text-xs ${selected ? "bg-ink text-paper" : "text-ink-soft"}`}
          >
            <span>{format(date, "EEEEE")}</span>
            <span className="mt-1 text-sm">{format(date, "d")}</span>
            <span className={`mt-1 size-1 rounded-full ${marks.has(day) ? (selected ? "bg-paper" : "bg-accent") : "bg-transparent"}`} />
          </button>
        );
      })}
    </div>
  );
}

function MonthGrid({
  iso,
  marks,
  onPick,
}: {
  iso: string;
  marks: Set<string>;
  onPick: (day: string) => void;
}) {
  const [cursor, setCursor] = useState(iso.slice(0, 7));
  const [year, month] = cursor.split("-").map((part) => Number(part));
  const first = new Date(year ?? 2026, (month ?? 1) - 1, 1);
  const count = new Date(year ?? 2026, month ?? 1, 0).getDate();
  const pad = first.getDay();
  const cells = [...Array(pad).fill(null), ...Array.from({ length: count }, (_, index) => index + 1)];
  return (
    <div className="mt-4 rounded-2xl border border-line p-3">
      <div className="mb-2 flex items-center justify-between">
        <button type="button" aria-label="Previous month" className="grid size-9 place-items-center" onClick={() => setCursor(shiftMonth(cursor, -1))}>
          <ChevronLeft className="size-4" />
        </button>
        <p className="text-sm">{format(first, "MMMM yyyy")}</p>
        <button type="button" aria-label="Next month" className="grid size-9 place-items-center" onClick={() => setCursor(shiftMonth(cursor, 1))}>
          <ChevronRight className="size-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-ink-faint">
        {["S", "M", "T", "W", "T", "F", "S"].map((label, index) => (
          <span key={`${label}${index}`}>{label}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((day, index) => {
          if (!day) return <span key={`pad-${index}`} />;
          const value = `${cursor}-${String(day).padStart(2, "0")}`;
          const selected = value === iso;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onPick(value)}
              className={`relative grid h-9 place-items-center rounded-lg text-sm ${selected ? "bg-ink text-paper" : "text-ink"}`}
            >
              {day}
              {marks.has(value) && (
                <span className={`absolute bottom-1 size-1 rounded-full ${selected ? "bg-paper" : "bg-accent"}`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function shiftMonth(cursor: string, by: number): string {
  const [year, month] = cursor.split("-").map((part) => Number(part));
  const date = new Date(year ?? 2026, (month ?? 1) - 1 + by, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}
