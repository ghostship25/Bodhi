import type { BodhiObject } from "@/lib/bodhi/types";

export type CheckItem = {
  objectId: string;
  line: number;
  text: string;
};

const OPEN = /^- \[ \] (.+)$/;

export function openChecks(objects: BodhiObject[]): CheckItem[] {
  const found: CheckItem[] = [];
  for (const object of objects) {
    if (object.deletedAt || object.archived) continue;
    const lines = object.body.split("\n");
    for (let line = 0; line < lines.length; line += 1) {
      const match = OPEN.exec(lines[line] ?? "");
      if (!match) continue;
      found.push({ objectId: object.id, line, text: match[1] ?? "" });
      if (found.length >= 24) return found;
    }
  }
  return found;
}
