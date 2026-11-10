import type { Library, Meta } from "@/lib/bodhi/types";
import { GUEST } from "@/lib/bodhi/types";

const DB_NAME = "bodhi";
const STORE = "kv";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function idbGet<T>(key: string): Promise<T | null> {
  const db = await openDb();
  const tx = db.transaction(STORE, "readonly");
  const value = await requestToPromise(tx.objectStore(STORE).get(key));
  return (value as T | undefined) ?? null;
}

async function idbSet(key: string, value: unknown): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(STORE, "readwrite");
  await requestToPromise(tx.objectStore(STORE).put(value, key));
}

const memory = new Map<string, unknown>();

function memoryMode(): boolean {
  return typeof indexedDB === "undefined";
}

export async function loadMeta(): Promise<Meta> {
  const fallback: Meta = { active: GUEST, syncUsers: [], initialized: false };
  try {
    const stored = memoryMode()
      ? (memory.get("meta") as Meta | undefined)
      : await idbGet<Meta>("meta");
    return stored ?? fallback;
  } catch {
    return (memory.get("meta") as Meta | undefined) ?? fallback;
  }
}

export async function saveMeta(meta: Meta): Promise<void> {
  memory.set("meta", meta);
  if (memoryMode()) return;
  try {
    await idbSet("meta", meta);
  } catch {
    /* private mode — memory copy remains */
  }
}

export async function loadLibrary(key: string): Promise<Library | null> {
  try {
    if (memoryMode()) return (memory.get(`lib:${key}`) as Library | undefined) ?? null;
    return await idbGet<Library>(`lib:${key}`);
  } catch {
    return (memory.get(`lib:${key}`) as Library | undefined) ?? null;
  }
}

export async function saveLibrary(key: string, library: Library): Promise<void> {
  memory.set(`lib:${key}`, library);
  if (memoryMode()) return;
  try {
    await idbSet(`lib:${key}`, library);
  } catch {
    /* keep the memory copy */
  }
}
