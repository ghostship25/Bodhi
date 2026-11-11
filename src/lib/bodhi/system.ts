import type { Library, ObjectType } from "@/lib/bodhi/types";
import { TYPE_IDS } from "@/lib/bodhi/types";

const EPOCH = "1970-01-01T00:00:00.000Z";

export function systemTypes(): ObjectType[] {
  return [
    {
      id: TYPE_IDS.daily,
      key: "daily",
      name: "Daily note",
      plural: "Daily notes",
      icon: "calendar",
      color: "bark",
      isSystem: true,
      properties: [],
      updatedAt: EPOCH,
    },
    {
      id: TYPE_IDS.note,
      key: "note",
      name: "Note",
      plural: "Notes",
      icon: "file",
      color: "sage",
      isSystem: true,
      properties: [],
      updatedAt: EPOCH,
    },
    {
      id: TYPE_IDS.person,
      key: "person",
      name: "Person",
      plural: "People",
      icon: "user",
      color: "sea",
      isSystem: true,
      properties: [
        { id: "role", name: "Role", kind: "text" },
        { id: "email", name: "Email", kind: "text" },
      ],
      updatedAt: EPOCH,
    },
    {
      id: TYPE_IDS.project,
      key: "project",
      name: "Project",
      plural: "Projects",
      icon: "folder",
      color: "moss",
      isSystem: true,
      properties: [
        {
          id: "status",
          name: "Status",
          kind: "select",
          options: ["Active", "Paused", "Done"],
        },
      ],
      updatedAt: EPOCH,
    },
    {
      id: TYPE_IDS.book,
      key: "book",
      name: "Book",
      plural: "Books",
      icon: "book",
      color: "wine",
      isSystem: true,
      properties: [{ id: "author", name: "Author", kind: "text" }],
      updatedAt: EPOCH,
    },
    {
      id: TYPE_IDS.idea,
      key: "idea",
      name: "Idea",
      plural: "Ideas",
      icon: "bulb",
      color: "moss",
      isSystem: true,
      properties: [],
      updatedAt: EPOCH,
    },
    {
      id: TYPE_IDS.meeting,
      key: "meeting",
      name: "Meeting",
      plural: "Meetings",
      icon: "users",
      color: "sea",
      isSystem: true,
      properties: [{ id: "when", name: "When", kind: "date" }],
      updatedAt: EPOCH,
    },
    {
      id: TYPE_IDS.task,
      key: "task",
      name: "Task",
      plural: "Tasks",
      icon: "check",
      color: "bark",
      isSystem: true,
      properties: [
        { id: "done", name: "Done", kind: "checkbox" },
        { id: "due", name: "Due", kind: "date" },
      ],
      updatedAt: EPOCH,
    },
    {
      id: TYPE_IDS.tag,
      key: "tag",
      name: "Tag",
      plural: "Tags",
      icon: "hash",
      color: "stone",
      isSystem: true,
      properties: [],
      updatedAt: EPOCH,
    },
  ];
}

export function emptyLibrary(now = new Date().toISOString()): Library {
  return { types: systemTypes(), objects: [], links: [], updatedAt: now };
}

export function dayStamp(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDay(iso: string): Date {
  const [y, m, d] = iso.split("-").map((part) => Number(part));
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function shiftDay(iso: string, by: number): string {
  const date = parseDay(iso);
  date.setDate(date.getDate() + by);
  return dayStamp(date);
}

export function isDay(value: string | undefined): value is string {
  return !!value && /^\d{4}-\d{2}-\d{2}$/.test(value);
}
