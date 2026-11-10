import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { typeById, useBodhi, visibleObjects } from "@/lib/bodhi/store";
import { TYPE_DOT } from "@/components/bodhi/icons";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/search")({
  component: SearchPage,
});

function SearchPage() {
  const library = useBodhi((state) => state.library);
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    return visibleObjects(library)
      .filter((object) => object.title.toLowerCase().includes(needle) || object.body.toLowerCase().includes(needle))
      .slice(0, 30);
  }, [library, query]);

  return (
    <div className="rise mx-auto max-w-2xl px-5 py-6 md:py-10">
      <h1 className="font-serif text-4xl tracking-tight">Search</h1>
      <input
        autoFocus
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Titles and writing"
        className="mt-5 w-full rounded-2xl border border-line bg-paper-2 px-4 py-3 text-base outline-none"
      />
      <ul className="mt-4 divide-y divide-line">
        {query.trim() && results.length === 0 && <li className="py-6 text-sm text-ink-soft">No matches.</li>}
        {results.map((object) => {
          const type = typeById(library, object.typeId);
          return (
            <li key={object.id}>
              <Link to="/o/$objectId" params={{ objectId: object.id }} className="flex items-center gap-3 py-3">
                <span className={cn("size-2 rounded-full", TYPE_DOT[type?.color ?? "stone"])} />
                <span>
                  <span className="block font-serif text-lg">{object.title}</span>
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
