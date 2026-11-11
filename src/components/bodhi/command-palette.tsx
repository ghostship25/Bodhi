import { useMemo, useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Command } from "cmdk";
import { useNavigate } from "@tanstack/react-router";
import { useBodhi, visibleObjects, typeById } from "@/lib/bodhi/store";

export function CommandPalette() {
  const open = useBodhi((state) => state.paletteOpen);
  const setOpen = useBodhi((state) => state.setPaletteOpen);
  const library = useBodhi((state) => state.library);
  const setCapture = useBodhi((state) => state.setCaptureOpen);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const objects = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return visibleObjects(library)
      .filter((object) => object.typeId !== "type_daily")
      .filter((object) => !needle || object.title.toLowerCase().includes(needle) || object.body.toLowerCase().includes(needle))
      .slice(0, 12);
  }, [library, query]);

  function go(to: string) {
    setOpen(false);
    void navigate({ to });
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery("");
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/30" />
        <Dialog.Content
          className="capture-panel z-50 overflow-hidden rounded-3xl border border-line bg-paper p-2 shadow-panel outline-none"
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">Search Bodhi</Dialog.Title>
          <Dialog.Description className="sr-only">Jump to a page or an object.</Dialog.Description>
          <Command label="Search" shouldFilter={false} className="flex flex-col">
            <Command.Input
              autoFocus
              value={query}
              onValueChange={setQuery}
              placeholder="Search objects, or jump"
              className="w-full bg-transparent px-3 py-3 text-base text-ink outline-none placeholder:text-ink-faint"
            />
            <Command.List className="max-h-80 overflow-y-auto border-t border-line">
              <Command.Group heading="Go" className="px-2 py-2 text-xs text-ink-soft">
                <PaletteItem
                  onSelect={() => go("/")}
                >
                  Today
                </PaletteItem>
                <PaletteItem onSelect={() => go("/graph")}>Graph</PaletteItem>
                <PaletteItem onSelect={() => go("/ask")}>Ask notes</PaletteItem>
                <PaletteItem onSelect={() => go("/trash")}>Trash</PaletteItem>
                <PaletteItem onSelect={() => go("/objects")}>All objects</PaletteItem>
                <PaletteItem onSelect={() => go("/login")}>Account</PaletteItem>
                <PaletteItem
                  onSelect={() => {
                    setOpen(false);
                    setCapture(true);
                  }}
                >
                  Quick capture
                </PaletteItem>
              </Command.Group>
              <Command.Group heading="Objects" className="px-2 py-2 text-xs text-ink-soft">
                {objects.length === 0 && <p className="px-2 py-3 text-sm text-ink-soft">No objects match.</p>}
                {objects.map((object) => {
                  const type = typeById(library, object.typeId);
                  return (
                    <PaletteItem
                      key={object.id}
                      onSelect={() => {
                        setOpen(false);
                        void navigate({ to: "/o/$objectId", params: { objectId: object.id } });
                      }}
                    >
                      <span>{object.title}</span>
                      <span className="text-ink-faint">{type?.name}</span>
                    </PaletteItem>
                  );
                })}
              </Command.Group>
            </Command.List>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function PaletteItem({ children, onSelect }: { children: ReactNode; onSelect: () => void }) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-2 py-2 text-sm text-ink data-[selected=true]:bg-paper-2"
    >
      {children}
    </Command.Item>
  );
}
