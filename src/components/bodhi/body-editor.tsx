import { useMemo, useState } from "react";
import type { BodhiObject } from "@/lib/bodhi/types";

type Props = {
  value: string;
  onChange: (value: string) => void;
  objects: BodhiObject[];
  label?: string;
};

export function BodyEditor({ value, onChange, objects, label = "Writing" }: Props) {
  const [query, setQuery] = useState<string | null>(null);
  const [caret, setCaret] = useState(0);

  const matches = useMemo(() => {
    if (query === null) return [];
    const needle = query.toLowerCase();
    return objects
      .filter((object) => !object.deletedAt && object.title.toLowerCase().includes(needle))
      .slice(0, 6);
  }, [objects, query]);

  function syncQuery(text: string, pos: number) {
    const before = text.slice(0, pos);
    const match = before.match(/\[\[([^\]\n]*)$/);
    setQuery(match ? (match[1] ?? "") : null);
    setCaret(pos);
  }

  function insert(title: string) {
    const before = value.slice(0, caret);
    const after = value.slice(caret);
    const replaced = before.replace(/\[\[([^\]\n]*)$/, `[[${title}]]`);
    const next = `${replaced}${after}`;
    onChange(next);
    setQuery(null);
  }

  return (
    <div className="relative">
      <label className="mb-2 block text-sm font-medium text-ink-soft" htmlFor="bodhi-body">
        {label}
      </label>
      <textarea
        id="bodhi-body"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          syncQuery(event.target.value, event.target.selectionStart ?? 0);
        }}
        onKeyUp={(event) => syncQuery(event.currentTarget.value, event.currentTarget.selectionStart ?? 0)}
        onClick={(event) => syncQuery(event.currentTarget.value, event.currentTarget.selectionStart ?? 0)}
        onBlur={() => {
          window.setTimeout(() => setQuery(null), 160);
        }}
        placeholder="Write here. Link anything with [[double brackets]]."
        className="min-h-64 w-full resize-y bg-transparent font-serif text-lg leading-relaxed text-ink outline-none placeholder:text-ink-faint"
      />
      {query !== null && matches.length > 0 && (
        <ul className="absolute left-0 top-full z-20 mt-1 w-full max-w-md overflow-hidden rounded-2xl border border-line bg-paper shadow-panel">
          {matches.map((object) => (
            <li key={object.id}>
              <button
                type="button"
                className="flex w-full items-center px-3 py-2 text-left text-sm hover:bg-paper-2"
                onMouseDown={(event) => {
                  event.preventDefault();
                  insert(object.title);
                }}
              >
                {object.title}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
