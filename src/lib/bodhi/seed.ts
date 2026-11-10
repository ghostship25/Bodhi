import type { BodhiObject, Library } from "@/lib/bodhi/types";
import { TYPE_IDS } from "@/lib/bodhi/types";
import { emptyLibrary, parseDay } from "@/lib/bodhi/system";
import { reconcileMentions } from "@/lib/bodhi/mentions";
import { format } from "date-fns";

function object(
  id: string,
  typeId: string,
  title: string,
  body: string,
  now: string,
  extra: Partial<BodhiObject> = {},
): BodhiObject {
  return {
    id,
    typeId,
    title,
    body,
    day: null,
    inbox: false,
    archived: false,
    deletedAt: null,
    props: {},
    createdAt: now,
    updatedAt: now,
    ...extra,
  };
}

export function seedLibrary(now = "2026-01-01T00:00:00.000Z", day = "pending"): Library {
  const today = day;
  const dailyTitle = day === "pending" ? "Today" : format(parseDay(day), "d MMMM yyyy");
  const dailyBody = `This page is today. Write what you want to remember, and connect it with double brackets.

[[How Bodhi works]]
[[Quick capture]]`;

  const objects: BodhiObject[] = [
    object("obj_daily_today", TYPE_IDS.daily, dailyTitle, dailyBody, now, { day: today }),
    object(
      "obj_how",
      TYPE_IDS.note,
      "How Bodhi works",
      `Everything in Bodhi is an object: a note, a person, a project, a book, a meeting.

Properties describe an object. [[Links]] relate it to others. A link typed in double brackets points both ways — open [[The graph]] to see them.

Today is the front door. [[Quick capture]] is how things arrive before you file them.

An account is optional. Without one, this library stays on this device. With one, the same notes can follow you to any browser or desktop install that signs in to this Bodhi.

When you are done reading, File the starter notes.`,
      now,
      { pinned: true },
    ),
    object(
      "obj_capture",
      TYPE_IDS.note,
      "Quick capture",
      `Press the plus button, or press C when you are not typing. On a keyboard, Ctrl or Command J also opens capture.

Give it a title, pick a type, and leave "Also on today" on if it belongs to the day. It lands in your inbox until you file it.

Try capturing a thought about [[The graph]].`,
      now,
      { inbox: true },
    ),
    object(
      "obj_graph",
      TYPE_IDS.idea,
      "The graph",
      `The graph is not a hairball for its own sake. It is the neighborhood of what you have linked.

[[How Bodhi works]] and [[Quick capture]] are already tied to today. Click any dot to open the object. Drag to rearrange. Hide a type if you want a quieter view.`,
      now,
    ),
    object(
      "obj_links",
      TYPE_IDS.note,
      "Links",
      `Write [[How Bodhi works]] inside any object and Bodhi keeps the connection, even if you rename the title later.

Backlinks collect on the object you pointed at. A relation you add with Connect is the same idea, without writing it into the text.`,
      now,
    ),
    object(
      "obj_bodhi",
      TYPE_IDS.project,
      "Make Bodhi yours",
      `Archive the starter notes when they get in the way. Add a person, a book, or your own type from the Objects tab.

Status lives on this project as a property. The writing can mention [[Links]] or [[The graph]].`,
      now,
      { props: { status: "Active" } },
    ),
    object(
      "obj_task_file",
      TYPE_IDS.task,
      "File the starter notes",
      "Check this off after you have archived the notes you do not need.",
      now,
      { props: { done: false } },
    ),
  ];

  let links = emptyLibrary(now).links;
  for (const item of objects) {
    links = reconcileMentions(objects, links, item.id, item.body, now);
  }

  return {
    types: emptyLibrary(now).types,
    objects,
    links,
    updatedAt: now,
  };
}
