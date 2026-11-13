import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { TYPE_IDS, type TypeColor } from "@/lib/bodhi/types";
import { typeById, useBodhi, visibleObjects } from "@/lib/bodhi/store";
import { ICON_CHOICES, TYPE_DOT, TypeIcon } from "@/components/bodhi/icons";
import { cn } from "@/lib/cn";

type ObjectsSearch = { type?: string };

export const Route = createFileRoute("/objects")({
  validateSearch: (search: Record<string, unknown>): ObjectsSearch => ({
    type: typeof search.type === "string" ? search.type : undefined,
  }),
  component: ObjectsPage,
});

const COLORS: TypeColor[] = ["sage", "sea", "wine", "stone", "moss", "bark"];

function ObjectsPage() {
  const { type: typeKey } = Route.useSearch();
  const library = useBodhi((state) => state.library);
  const createObject = useBodhi((state) => state.createObject);
  const createType = useBodhi((state) => state.createType);
  const fileInbox = useBodhi((state) => state.fileInbox);
  const [title, setTitle] = useState("");
  const [typeName, setTypeName] = useState("");
  const [icon, setIcon] = useState("box");
  const [color, setColor] = useState<TypeColor>("sage");
  const [showType, setShowType] = useState(false);
  const [query, setQuery] = useState("all");

  const activeType = library.types.find((type) => type.key === typeKey);
  const queryProp = activeType?.properties.find((property) => property.kind === "checkbox" || property.kind === "select");

  useEffect(() => {
    setQuery(typeKey === "task" ? "open" : "all");
  }, [typeKey]);

  const objects = useMemo(() => {
    return visibleObjects(library)
      .filter((object) => object.typeId !== TYPE_IDS.daily)
      .filter((object) => {
        if (!typeKey) return true;
        if (typeKey === "inbox") return object.inbox;
        return activeType ? object.typeId === activeType.id : true;
      })
      .filter((object) => {
        if (!queryProp || query === "all") return true;
        if (queryProp.kind === "checkbox") {
          const done = object.props[queryProp.id] === true;
          return query === "done" ? done : !done;
        }
        return object.props[queryProp.id] === query;
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [library, typeKey, activeType, query, queryProp]);

  const heading = typeKey === "inbox" ? "Inbox" : activeType?.plural ?? "Objects";
  const createTypeId = activeType?.id ?? TYPE_IDS.note;

  return (
    <div className="rise mx-auto max-w-2xl px-5 py-6 md:py-10">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-4xl tracking-tight">{heading}</h1>
        </div>
        <button type="button" className="text-sm text-ink-soft" onClick={() => setShowType((value) => !value)}>
          {showType ? "Close" : "New type"}
        </button>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 md:hidden">
        <Filter to="/objects" search={{}} label="All" current={!typeKey} />
        <Filter to="/objects" search={{ type: "inbox" }} label="Inbox" current={typeKey === "inbox"} />
        {library.types
          .filter((type) => type.id !== TYPE_IDS.daily)
          .map((type) => (
            <Filter key={type.id} to="/objects" search={{ type: type.key }} label={type.plural} current={typeKey === type.key} />
          ))}
      </div>

      {queryProp && (
        <label className="mt-4 flex items-center gap-2 text-sm text-ink-soft">
          {queryProp.name}
          <select
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="rounded-full border border-line bg-paper px-3 py-2 text-sm text-ink"
          >
            <option value="all">Any</option>
            {queryProp.kind === "checkbox" ? (
              <>
                <option value="open">Open</option>
                <option value="done">Done</option>
              </>
            ) : (
              (queryProp.options ?? []).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))
            )}
          </select>
        </label>
      )}

      {typeKey === "inbox" && objects.length > 0 && (
        <button type="button" className="mt-4 text-sm text-ink" onClick={() => fileInbox()}>
          File everything in the inbox
        </button>
      )}

      {showType && (
        <form
          className="mt-4 rounded-3xl border border-line bg-paper-2 p-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (!typeName.trim()) return;
            createType({ name: typeName.trim(), icon, color });
            setTypeName("");
            setShowType(false);
          }}
        >
          <h2 className="font-serif text-xl">New object type</h2>
          <input
            value={typeName}
            onChange={(event) => setTypeName(event.target.value)}
            placeholder="Name, such as Place"
            className="mt-3 w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm outline-none"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {ICON_CHOICES.map((choice) => (
              <button
                key={choice.id}
                type="button"
                aria-label={choice.label}
                onClick={() => setIcon(choice.id)}
                className={cn(
                  "grid size-10 place-items-center rounded-xl border",
                  icon === choice.id ? "border-accent bg-paper" : "border-line",
                )}
              >
                <TypeIcon name={choice.id} className="size-4" />
              </button>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            {COLORS.map((swatch) => (
              <button
                key={swatch}
                type="button"
                aria-label={swatch}
                onClick={() => setColor(swatch)}
                className={cn("size-6 rounded-full", TYPE_DOT[swatch], color === swatch && "ring-2 ring-ink ring-offset-2 ring-offset-paper-2")}
              />
            ))}
          </div>
          <button type="submit" className="mt-4 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-fg">
            Create type
          </button>
        </form>
      )}

      {typeKey !== "inbox" && (
        <form
          className="mt-5 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (!title.trim()) return;
            createObject({ title: title.trim(), typeId: createTypeId, inbox: false });
            setTitle("");
          }}
        >
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={`New ${activeType?.name.toLowerCase() ?? "note"}`}
            className="min-w-0 flex-1 rounded-full border border-line bg-paper-2 px-4 py-3 text-sm outline-none"
          />
          <button type="submit" className="rounded-full bg-ink px-4 py-3 text-sm text-paper">
            Add
          </button>
        </form>
      )}

      <ul className="mt-4 divide-y divide-line">
        {objects.length === 0 && (
          <li className="py-8 text-sm text-ink-soft">Nothing here yet. Capture something, or add it above.</li>
        )}
        {objects.map((object) => {
          const type = typeById(library, object.typeId);
          return (
            <li key={object.id}>
              <Link to="/o/$objectId" params={{ objectId: object.id }} className="flex items-center gap-3 py-3">
                <span className={cn("size-2 shrink-0 rounded-full", TYPE_DOT[type?.color ?? "stone"])} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-serif text-lg">{object.title || "Untitled"}</span>
                  <span className="text-xs text-ink-faint">{type?.name}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Filter({
  to,
  search,
  label,
  current,
}: {
  to: "/objects";
  search: { type?: string };
  label: string;
  current: boolean;
}) {
  return (
    <Link
      to={to}
      search={search}
      className={cn(
        "shrink-0 rounded-full px-3 py-2 text-sm",
        current ? "bg-ink text-paper" : "border border-line text-ink-soft",
      )}
    >
      {label}
    </Link>
  );
}
