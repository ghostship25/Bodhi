import type { BodhiLink, BodhiObject, Library, ObjectType } from "@/lib/bodhi/types";
import { systemTypes } from "@/lib/bodhi/system";

function newer<T extends { updatedAt: string }>(a: T, b: T): T {
  return a.updatedAt >= b.updatedAt ? a : b;
}

function mergeById<T extends { id: string; updatedAt: string }>(lists: T[][]): T[] {
  const map = new Map<string, T>();
  for (const list of lists) {
    for (const item of list) {
      const prev = map.get(item.id);
      map.set(item.id, prev ? newer(prev, item) : item);
    }
  }
  return [...map.values()];
}

export function mergeLibraries(left: Library, right: Library): Library {
  const types = mergeById<ObjectType>([systemTypes(), left.types, right.types]);
  for (const system of systemTypes()) {
    if (!types.some((type) => type.id === system.id)) types.push(system);
  }
  const objects = mergeById<BodhiObject>([left.objects, right.objects]);
  const links = mergeById<BodhiLink>([left.links, right.links]);
  const updatedAt = left.updatedAt >= right.updatedAt ? left.updatedAt : right.updatedAt;
  return { types, objects, links, updatedAt };
}

/** Keep user-edited types, but add any new built-in properties they don't have yet. */
export function adoptSystem(library: Library): Library {
  const systems = systemTypes();
  const extras = library.types.filter((type) => !systems.some((system) => system.id === type.id));
  let changed = systems.length + extras.length !== library.types.length;
  const types = systems.map((system) => {
    const current = library.types.find((type) => type.id === system.id);
    if (!current) {
      changed = true;
      return system;
    }
    const missing = system.properties.filter(
      (property) => !current.properties.some((existing) => existing.id === property.id),
    );
    if (missing.length === 0) return current;
    changed = true;
    return { ...current, properties: [...current.properties, ...missing] };
  });
  if (!changed) return library;
  return { ...library, types: [...types, ...extras] };
}

export function normalizeLibrary(raw: unknown): Library | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Partial<Library>;
  if (!Array.isArray(value.objects) || !Array.isArray(value.links)) return null;
  const types = Array.isArray(value.types) ? value.types : [];
  return adoptSystem(
    mergeLibraries(
      { types: systemTypes(), objects: [], links: [], updatedAt: "1970-01-01T00:00:00.000Z" },
      {
        types,
        objects: value.objects,
        links: value.links,
        updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : new Date().toISOString(),
      },
    ),
  );
}
