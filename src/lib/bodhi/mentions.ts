import type { BodhiLink, BodhiObject } from "@/lib/bodhi/types";

const MENTION = /\[\[([^\]\n]+)\]\]/g;

export function mentionTitles(body: string): string[] {
  const found: string[] = [];
  for (const match of body.matchAll(MENTION)) {
    const title = match[1]?.trim();
    if (title) found.push(title);
  }
  return found;
}

export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function snippetAround(body: string, title: string): string {
  const index = body.toLowerCase().indexOf(`[[${title.toLowerCase()}]]`);
  if (index < 0) return title;
  const start = Math.max(0, index - 36);
  const end = Math.min(body.length, index + title.length + 40);
  const slice = body.slice(start, end).replace(/\s+/g, " ").trim();
  return `${start > 0 ? "…" : ""}${slice}${end < body.length ? "…" : ""}`;
}

export function reconcileMentions(
  objects: BodhiObject[],
  links: BodhiLink[],
  objectId: string,
  body: string,
  now: string,
): BodhiLink[] {
  const source = objects.find((object) => object.id === objectId);
  if (!source) return links;
  const wanted = new Set<string>();
  for (const title of mentionTitles(body)) {
    const target = objects.find(
      (object) =>
        object.id !== objectId &&
        !object.deletedAt &&
        object.title.toLowerCase() === title.toLowerCase(),
    );
    if (target) wanted.add(target.id);
  }

  const next = links.map((link) => ({ ...link }));
  for (const targetId of wanted) {
    const id = `mention:${objectId}:${targetId}`;
    const existing = next.find((link) => link.id === id);
    const context = snippetAround(body, objects.find((object) => object.id === targetId)?.title ?? "");
    if (existing) {
      existing.deletedAt = null;
      existing.context = context;
      existing.updatedAt = now;
      existing.kind = "mention";
    } else {
      next.push({
        id,
        fromId: objectId,
        toId: targetId,
        kind: "mention",
        context,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      });
    }
  }

  for (const link of next) {
    if (link.kind !== "mention" || link.fromId !== objectId) continue;
    if (!wanted.has(link.toId) && !link.deletedAt) {
      link.deletedAt = now;
      link.updatedAt = now;
    }
  }
  return next;
}

export function unlinkedMentions(
  body: string,
  objects: BodhiObject[],
  linkedIds: Set<string>,
  selfId: string,
): BodhiObject[] {
  const plain = body.replace(MENTION, " ");
  const found: BodhiObject[] = [];
  for (const object of objects) {
    if (object.id === selfId || object.deletedAt || linkedIds.has(object.id)) continue;
    const title = object.title.trim();
    if (title.length < 3) continue;
    const pattern = new RegExp(`(^|[^A-Za-z0-9])${escapeRegExp(title)}([^A-Za-z0-9]|$)`, "i");
    if (pattern.test(plain)) found.push(object);
    if (found.length >= 6) break;
  }
  return found;
}

export function rewriteTitle(body: string, from: string, to: string): string {
  if (!from || from === to) return body;
  return body.replace(new RegExp(`\\[\\[${escapeRegExp(from)}\\]\\]`, "gi"), `[[${to}]]`);
}
