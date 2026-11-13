import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "@tanstack/react-router";
import { TYPE_IDS } from "@/lib/bodhi/types";
import { useBodhi } from "@/lib/bodhi/store";
import { TypeIcon } from "@/components/bodhi/icons";

const CHOICES = [
  TYPE_IDS.note,
  TYPE_IDS.idea,
  TYPE_IDS.task,
  TYPE_IDS.person,
  TYPE_IDS.project,
  TYPE_IDS.meeting,
  TYPE_IDS.book,
];

export function QuickCapture() {
  const open = useBodhi((state) => state.captureOpen);
  const setOpen = useBodhi((state) => state.setCaptureOpen);
  const types = useBodhi((state) => state.library.types);
  const createObject = useBodhi((state) => state.createObject);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [typeId, setTypeId] = useState<string>(TYPE_IDS.note);
  const [onToday, setOnToday] = useState(true);

  useEffect(() => {
    if (!open) return;
    setTitle("");
    setTypeId(TYPE_IDS.note);
    setOnToday(true);
  }, [open]);

  function save(stay = false) {
    const trimmed = title.trim();
    if (!trimmed) return;
    const id = createObject({
      title: trimmed,
      typeId,
      inbox: typeId === TYPE_IDS.note,
      linkToday: onToday,
    });
    if (stay) {
      setTitle("");
      return;
    }
    setOpen(false);
    void navigate({ to: "/o/$objectId", params: { objectId: id } });
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/30" />
        <Dialog.Content
          className="capture-panel z-50 rounded-3xl border border-line bg-paper p-4 shadow-panel outline-none"
          aria-describedby={undefined}
        >
          <Dialog.Title className="font-serif text-2xl text-ink">Capture</Dialog.Title>
          <Dialog.Description className="sr-only">A title is enough. You can file it later.</Dialog.Description>
          <input
            autoFocus
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                save(event.shiftKey);
              }
            }}
            placeholder="What's on your mind?"
            className="mt-4 w-full rounded-xl border border-line bg-paper-2 px-3 py-3 text-base text-ink outline-none placeholder:text-ink-faint focus-visible:border-accent"
          />
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {CHOICES.map((id) => {
              const type = types.find((item) => item.id === id);
              if (!type) return null;
              const selected = typeId === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTypeId(id)}
                  className={
                    selected
                      ? "inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-3 py-2 text-sm text-accent-fg"
                      : "inline-flex shrink-0 items-center gap-2 rounded-full border border-line px-3 py-2 text-sm text-ink"
                  }
                >
                  <TypeIcon name={type.icon} className="size-4" />
                  {type.name}
                </button>
              );
            })}
          </div>
          <label className="mt-3 flex items-center gap-2 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={onToday}
              onChange={(event) => setOnToday(event.target.checked)}
              className="size-4 accent-accent"
            />
            Also on today
          </label>
          <div className="mt-4 flex items-center justify-between gap-3">
            <button type="button" className="text-sm text-ink-soft" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button
              type="button"
              disabled={!title.trim()}
              onClick={() => save(false)}
              className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-fg disabled:opacity-40"
            >
              Save
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
