import { create } from "zustand";
import type { BodhiLink, BodhiObject, Library, ObjectType, PropDef, PropKind, PropValue } from "@/lib/bodhi/types";
import { GUEST } from "@/lib/bodhi/types";
import { dayStamp, emptyLibrary, parseDay, systemTypes } from "@/lib/bodhi/system";
import { reconcileMentions, rewriteTitle } from "@/lib/bodhi/mentions";
import { mergeLibraries, normalizeLibrary } from "@/lib/bodhi/merge";
import { loadLibrary, loadMeta, saveLibrary, saveMeta } from "@/lib/bodhi/persist";
import { seedLibrary } from "@/lib/bodhi/seed";
import { pullLibrary, pushLibrary } from "@/lib/bodhi/sync-fns";
import { format } from "date-fns";

export type SyncStatus = "local" | "syncing" | "synced" | "error";

type Store = {
  ready: boolean;
  active: string;
  syncUsers: string[];
  syncStatus: SyncStatus;
  syncError: string | null;
  baseUpdatedAt: string | null;
  library: Library;
  captureOpen: boolean;
  paletteOpen: boolean;
  init: () => Promise<void>;
  setCaptureOpen: (open: boolean) => void;
  setPaletteOpen: (open: boolean) => void;
  onSession: (userId: string | null) => Promise<void>;
  enableSync: (userId: string) => Promise<void>;
  disableSync: (userId: string) => Promise<void>;
  createObject: (input: {
    title: string;
    typeId: string;
    body?: string;
    inbox?: boolean;
    linkToday?: boolean;
  }) => string;
  updateObject: (id: string, patch: Partial<Pick<BodhiObject, "title" | "body" | "inbox" | "archived" | "pinned" | "props">>) => void;
  setProp: (id: string, key: string, value: PropValue) => void;
  deleteObject: (id: string) => void;
  connect: (fromId: string, toId: string) => void;
  disconnect: (linkId: string) => void;
  ensureDaily: (day: string) => string;
  createType: (input: { name: string; icon: string; color: ObjectType["color"] }) => string;
  addProperty: (typeId: string, property: { name: string; kind: PropKind; options?: string[] }) => void;
  setTemplate: (typeId: string, template: string) => void;
  importLibrary: (raw: unknown, mode: "merge" | "replace") => void;
};

const STARTER = seedLibrary();

let bootPromise: Promise<void> | null = null;
let pushTimer: number | undefined;

function claimToday(library: Library, today: string): Library {
  const stamp = nowIso();
  const pending = library.objects.find((object) => object.day === "pending" && !object.deletedAt);
  if (!pending) return library;
  const todayNote = library.objects.find((object) => object.day === today && !object.deletedAt);
  const objects = library.objects.map((object) => {
    if (!todayNote && object.id === pending.id) {
      return { ...object, day: today, title: prettyDay(today), updatedAt: stamp };
    }
    if (todayNote && !todayNote.body.trim() && pending.body.trim()) {
      if (object.id === todayNote.id) return { ...object, body: pending.body, updatedAt: stamp };
      if (object.id === pending.id) return { ...object, day: null, deletedAt: stamp, updatedAt: stamp };
    }
    if (todayNote && object.id === pending.id) {
      return { ...object, day: null, deletedAt: stamp, updatedAt: stamp };
    }
    return object;
  });
  return { ...library, objects, updatedAt: stamp };
}
let pushing = false;

function nowIso(): string {
  return new Date().toISOString();
}

function uid(): string {
  return crypto.randomUUID();
}

function prettyDay(day: string): string {
  return format(parseDay(day), "d MMMM yyyy");
}

export const useBodhi = create<Store>((set, get) => {
  async function persist(library: Library, active = get().active) {
    await saveLibrary(active, library);
  }

  function commit(recipe: (library: Library) => Library, touch = true) {
    const current = get().library;
    let next = recipe(current);
    if (touch) next = { ...next, updatedAt: nowIso() };
    set({ library: next });
    void persist(next);
    if (get().syncUsers.includes(get().active)) schedulePush();
  }

  function schedulePush() {
    if (pushTimer) window.clearTimeout(pushTimer);
    pushTimer = window.setTimeout(() => {
      void flushPush();
    }, 700);
  }

  async function flushPush(attempt = 0): Promise<void> {
    const active = get().active;
    if (!get().syncUsers.includes(active) || pushing) return;
    pushing = true;
    set({ syncStatus: "syncing", syncError: null });
    try {
      const library = get().library;
      const result = await pushLibrary({
        data: { library, baseUpdatedAt: get().baseUpdatedAt },
      });
      if (result.conflict) {
        const merged = mergeLibraries(get().library, result.snapshot);
        set({ library: merged, baseUpdatedAt: result.snapshot.updatedAt });
        await persist(merged, active);
        pushing = false;
        if (attempt < 2) await flushPush(attempt + 1);
        return;
      }
      set({ baseUpdatedAt: library.updatedAt, syncStatus: "synced", syncError: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Sync failed";
      set({
        syncStatus: "error",
        syncError: message === "Unauthorized" ? "Sign in again to keep syncing." : "Sync paused. Notes are still on this device.",
      });
    } finally {
      pushing = false;
    }
  }

  async function pullAndMerge(userId: string) {
    set({ syncStatus: "syncing", syncError: null });
    try {
      const remote = await pullLibrary();
      if (!remote || get().active !== userId) {
        set({ syncStatus: "synced" });
        return;
      }
      const merged = mergeLibraries(get().library, remote);
      const changed = JSON.stringify(merged) !== JSON.stringify(get().library);
      set({
        library: merged,
        baseUpdatedAt: remote.updatedAt,
        syncStatus: changed ? "syncing" : "synced",
      });
      await persist(merged, userId);
      if (changed) schedulePush();
      else set({ syncStatus: "synced" });
    } catch {
      set({
        syncStatus: "error",
        syncError: "Couldn't reach your account. Showing this device's copy.",
      });
    }
  }

  return {
    ready: true,
    active: GUEST,
    syncUsers: [],
    syncStatus: "local",
    syncError: null,
    baseUpdatedAt: STARTER.updatedAt,
    library: STARTER,
    captureOpen: false,
    paletteOpen: false,
    setCaptureOpen: (captureOpen) => set({ captureOpen }),
    setPaletteOpen: (paletteOpen) => set({ paletteOpen }),
    init: () => {
      if (bootPromise) return bootPromise;
      bootPromise = (async () => {
        const meta = await loadMeta();
        const saved = await loadLibrary(meta.active);
        if (saved) {
          const current = get().library;
          const library =
            current.updatedAt === STARTER.updatedAt ? saved : mergeLibraries(saved, current);
          if (!meta.initialized) {
            meta.initialized = true;
            await saveMeta(meta);
          }
          set({
            ready: true,
            active: meta.active,
            syncUsers: meta.syncUsers,
            library,
            syncStatus: meta.syncUsers.includes(meta.active) ? "synced" : "local",
            baseUpdatedAt: library.updatedAt,
          });
          await saveLibrary(meta.active, library);
          return;
        }
        const library = claimToday(get().library, dayStamp());
        meta.initialized = true;
        meta.active = meta.active || GUEST;
        await saveMeta(meta);
        await saveLibrary(meta.active, library);
        set({
          ready: true,
          active: meta.active,
          syncUsers: meta.syncUsers,
          library,
          syncStatus: "local",
          baseUpdatedAt: library.updatedAt,
        });
      })();
      return bootPromise;
    },
    onSession: async (userId) => {
      await get().init();
      if (!userId) {
        if (get().active === GUEST) return;
        const guest = (await loadLibrary(GUEST)) ?? seedLibrary();
        const meta = await loadMeta();
        meta.active = GUEST;
        await saveMeta(meta);
        set({
          active: GUEST,
          library: guest,
          syncStatus: "local",
          syncError: null,
          baseUpdatedAt: guest.updatedAt,
          syncUsers: meta.syncUsers,
        });
        return;
      }
      const meta = await loadMeta();
      if (!meta.syncUsers.includes(userId)) return;
      if (get().active !== userId) {
        const cached = (await loadLibrary(userId)) ?? get().library;
        meta.active = userId;
        await saveMeta(meta);
        set({
          active: userId,
          syncUsers: meta.syncUsers,
          library: cached,
          baseUpdatedAt: cached.updatedAt,
        });
      }
      await pullAndMerge(userId);
    },
    enableSync: async (userId) => {
      if (!get().ready) await get().init();
      set({ syncStatus: "syncing", syncError: null });
      try {
        const remote = await pullLibrary();
        const local = get().library;
        const merged = remote ? mergeLibraries(local, remote) : local;
        const stamped = { ...merged, updatedAt: nowIso() };
        const meta = await loadMeta();
        meta.syncUsers = Array.from(new Set([...meta.syncUsers, userId]));
        meta.active = userId;
        await saveMeta(meta);
        await saveLibrary(userId, stamped);
        set({
          library: stamped,
          active: userId,
          syncUsers: meta.syncUsers,
          baseUpdatedAt: remote?.updatedAt ?? null,
          syncStatus: "syncing",
        });
        await flushPush();
      } catch {
        set({
          syncStatus: "error",
          syncError: "Couldn't turn on sync. Your notes are still on this device.",
        });
      }
    },
    disableSync: async (userId) => {
      const meta = await loadMeta();
      meta.syncUsers = meta.syncUsers.filter((id) => id !== userId);
      meta.active = GUEST;
      await saveMeta(meta);
      await saveLibrary(userId, get().library);
      const guest = (await loadLibrary(GUEST)) ?? emptyLibrary();
      set({
        active: GUEST,
        syncUsers: meta.syncUsers,
        library: guest,
        syncStatus: "local",
        syncError: null,
        baseUpdatedAt: guest.updatedAt,
      });
    },
    createObject: (input) => {
      const id = uid();
      const stamp = nowIso();
      const title = input.title.trim() || "Untitled";
      commit((library) => {
        const type = library.types.find((item) => item.id === input.typeId);
        const body = input.body ?? type?.template ?? "";
        const objects = [
          ...library.objects,
          {
            id,
            typeId: input.typeId,
            title,
            body,
            day: null,
            inbox: input.inbox ?? false,
            archived: false,
            pinned: false,
            deletedAt: null,
            props: {},
            createdAt: stamp,
            updatedAt: stamp,
          } satisfies BodhiObject,
        ];
        let links = reconcileMentions(objects, library.links, id, body, stamp);
        let nextObjects = objects;
        if (input.linkToday) {
          const day = dayStamp();
          const line = `[[${title}]]`;
          const existing = nextObjects.find((object) => object.day === day && !object.deletedAt);
          if (existing) {
            const body = existing.body.trim() ? `${existing.body.trim()}\n${line}` : line;
            nextObjects = nextObjects.map((object) =>
              object.id === existing.id ? { ...object, body, updatedAt: stamp } : object,
            );
            links = reconcileMentions(nextObjects, links, existing.id, body, stamp);
          } else {
            const dailyId = uid();
            const body = line;
            nextObjects = [
              ...nextObjects,
              {
                id: dailyId,
                typeId: "type_daily",
                title: prettyDay(day),
                body,
                day,
                inbox: false,
                archived: false,
                deletedAt: null,
                props: {},
                createdAt: stamp,
                updatedAt: stamp,
              },
            ];
            links = reconcileMentions(nextObjects, links, dailyId, body, stamp);
          }
        }
        return { ...library, objects: nextObjects, links };
      });
      return id;
    },
    updateObject: (id, patch) => {
      commit((library) => {
        const current = library.objects.find((object) => object.id === id);
        if (!current || current.deletedAt) return library;
        const stamp = nowIso();
        let objects = library.objects.map((object) =>
          object.id === id ? { ...object, ...patch, updatedAt: stamp } : object,
        );
        let links = library.links;
        if (patch.title && patch.title !== current.title) {
          const clash = library.objects.some(
            (object) =>
              object.id !== id &&
              !object.deletedAt &&
              object.title.toLowerCase() === current.title.toLowerCase(),
          );
          if (!clash) {
            objects = objects.map((object) =>
              object.id === id
                ? object
                : {
                    ...object,
                    body: rewriteTitle(object.body, current.title, patch.title ?? current.title),
                  },
            );
            objects = objects.map((object) => {
              if (object.body === library.objects.find((item) => item.id === object.id)?.body) return object;
              return { ...object, updatedAt: stamp };
            });
            for (const object of objects) {
              if (object.deletedAt) continue;
              const previous = library.objects.find((item) => item.id === object.id);
              if (previous && previous.body !== object.body) {
                links = reconcileMentions(objects, links, object.id, object.body, stamp);
              }
            }
          }
        }
        if (typeof patch.body === "string") {
          links = reconcileMentions(objects, links, id, patch.body, stamp);
        }
        return { ...library, objects, links };
      });
    },
    setProp: (id, key, value) => {
      commit((library) => ({
        ...library,
        objects: library.objects.map((object) =>
          object.id === id
            ? { ...object, props: { ...object.props, [key]: value }, updatedAt: nowIso() }
            : object,
        ),
      }));
    },
    deleteObject: (id) => {
      const stamp = nowIso();
      commit((library) => ({
        ...library,
        objects: library.objects.map((object) =>
          object.id === id ? { ...object, deletedAt: stamp, updatedAt: stamp } : object,
        ),
        links: library.links.map((link) =>
          link.fromId === id || link.toId === id
            ? { ...link, deletedAt: stamp, updatedAt: stamp }
            : link,
        ),
      }));
    },
    connect: (fromId, toId) => {
      if (fromId === toId) return;
      const stamp = nowIso();
      const id = `relation:${fromId}:${toId}`;
      commit((library) => {
        const existing = library.links.find((link) => link.id === id);
        const links: BodhiLink[] = existing
          ? library.links.map((link) =>
              link.id === id ? { ...link, deletedAt: null, updatedAt: stamp, kind: "relation" } : link,
            )
          : [
              ...library.links,
              {
                id,
                fromId,
                toId,
                kind: "relation",
                context: null,
                createdAt: stamp,
                updatedAt: stamp,
                deletedAt: null,
              },
            ];
        return { ...library, links };
      });
    },
    disconnect: (linkId) => {
      const stamp = nowIso();
      commit((library) => ({
        ...library,
        links: library.links.map((link) =>
          link.id === linkId ? { ...link, deletedAt: stamp, updatedAt: stamp } : link,
        ),
      }));
    },
    ensureDaily: (day) => {
      const existing = get().library.objects.find((object) => object.day === day && !object.deletedAt);
      if (existing) return existing.id;
      const id = uid();
      const stamp = nowIso();
      commit((library) => {
        if (library.objects.some((object) => object.day === day && !object.deletedAt)) return library;
        return {
          ...library,
          objects: [
            ...library.objects,
            {
              id,
              typeId: "type_daily",
              title: prettyDay(day),
              body: "",
              day,
              inbox: false,
              archived: false,
              deletedAt: null,
              props: {},
              createdAt: stamp,
              updatedAt: stamp,
            },
          ],
        };
      });
      return get().library.objects.find((object) => object.day === day && !object.deletedAt)?.id ?? id;
    },
    createType: (input) => {
      const id = uid();
      const stamp = nowIso();
      const name = input.name.trim();
      const type: ObjectType = {
        id,
        key: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "type",
        name,
        plural: name.endsWith("s") ? name : `${name}s`,
        icon: input.icon,
        color: input.color,
        isSystem: false,
        properties: [],
        updatedAt: stamp,
      };
      commit((library) => ({ ...library, types: [...library.types, type] }));
      return id;
    },
    addProperty: (typeId, property) => {
      const prop: PropDef = {
        id: uid(),
        name: property.name.trim(),
        kind: property.kind,
        options: property.options?.map((option) => option.trim()).filter(Boolean),
      };
      if (!prop.name) return;
      const stamp = nowIso();
      commit((library) => ({
        ...library,
        types: library.types.map((type) =>
          type.id === typeId
            ? { ...type, properties: [...type.properties, prop], updatedAt: stamp }
            : type,
        ),
      }));
    },
    setTemplate: (typeId, template) => {
      const stamp = nowIso();
      commit((library) => ({
        ...library,
        types: library.types.map((type) =>
          type.id === typeId ? { ...type, template, updatedAt: stamp } : type,
        ),
      }));
    },
    importLibrary: (raw, mode) => {
      const incoming = normalizeLibrary(raw);
      if (!incoming) return;
      commit((library) =>
        mode === "replace" ? mergeLibraries(emptyLibrary(), incoming) : mergeLibraries(library, incoming),
      );
    },
  };
});

export function visibleObjects(library: Library): BodhiObject[] {
  return library.objects.filter((object) => !object.deletedAt && !object.archived);
}

export function typeById(library: Library, id: string): ObjectType | undefined {
  return library.types.find((type) => type.id === id) ?? systemTypes().find((type) => type.id === id);
}

export function liveLinks(library: Library): BodhiLink[] {
  return library.links.filter((link) => !link.deletedAt);
}
