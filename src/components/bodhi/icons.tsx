import {
  BookOpen,
  Box,
  CalendarDays,
  CircleCheck,
  FileText,
  FolderKanban,
  Hash,
  Lightbulb,
  Users,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import type { TypeColor } from "@/lib/bodhi/types";

const ICONS: Record<string, LucideIcon> = {
  calendar: CalendarDays,
  file: FileText,
  user: UserRound,
  folder: FolderKanban,
  book: BookOpen,
  bulb: Lightbulb,
  users: Users,
  check: CircleCheck,
  hash: Hash,
  box: Box,
};

export function TypeIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Box;
  return <Icon className={className} strokeWidth={1.75} aria-hidden="true" />;
}

export const TYPE_DOT: Record<TypeColor, string> = {
  sage: "bg-type-sage",
  sea: "bg-type-sea",
  wine: "bg-type-wine",
  stone: "bg-type-stone",
  moss: "bg-type-moss",
  bark: "bg-type-bark",
};

export const ICON_CHOICES = [
  { id: "file", label: "Note" },
  { id: "user", label: "Person" },
  { id: "folder", label: "Project" },
  { id: "book", label: "Book" },
  { id: "bulb", label: "Idea" },
  { id: "calendar", label: "Date" },
  { id: "check", label: "Task" },
  { id: "hash", label: "Tag" },
  { id: "box", label: "Object" },
] as const;

