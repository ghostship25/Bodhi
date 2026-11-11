import { createFileRoute, Link } from "@tanstack/react-router";
import { useBodhi } from "@/lib/bodhi/store";

export const Route = createFileRoute("/trash")({
  component: TrashPage,
});

function TrashPage() {
  const library = useBodhi((state) => state.library);
  const restoreObject = useBodhi((state) => state.restoreObject);
  const purgeObject = useBodhi((state) => state.purgeObject);
  const deleted = library.objects
    .filter((object) => object.deletedAt)
    .sort((a, b) => (b.deletedAt ?? "").localeCompare(a.deletedAt ?? ""));

  return (
    <div className="rise mx-auto max-w-2xl px-5 py-6 md:py-10">
      <h1 className="font-serif text-4xl tracking-tight">Trash</h1>
      <p className="mt-2 text-sm text-ink-soft">Deleted objects stay here until you restore them or remove them for good.</p>
      <ul className="mt-6 divide-y divide-line">
        {deleted.length === 0 && <li className="py-8 text-sm text-ink-soft">Trash is empty.</li>}
        {deleted.map((object) => (
          <li key={object.id} className="flex items-center gap-3 py-3">
            <span className="min-w-0 flex-1 truncate font-serif text-lg">{object.title || "Untitled"}</span>
            <button type="button" className="text-sm text-ink" onClick={() => restoreObject(object.id)}>
              Restore
            </button>
            <button type="button" className="text-sm text-ink-soft" onClick={() => purgeObject(object.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <Link to="/objects" className="mt-6 inline-block text-sm text-ink-soft">
        Back to objects
      </Link>
    </div>
  );
}
