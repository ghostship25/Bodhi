export type PropKind = "text" | "number" | "date" | "checkbox" | "select";

export type PropDef = {
  id: string;
  name: string;
  kind: PropKind;
  options?: string[];
};

export type TypeColor = "sage" | "sea" | "wine" | "stone" | "moss" | "bark";

export type ObjectType = {
  id: string;
  key: string;
  name: string;
  plural: string;
  icon: string;
  color: TypeColor;
  isSystem: boolean;
  properties: PropDef[];
  template?: string;
  updatedAt: string;
};

export type PropValue = string | number | boolean | null;

export type BodhiObject = {
  id: string;
  typeId: string;
  title: string;
  body: string;
  day: string | null;
  inbox: boolean;
  archived: boolean;
  pinned?: boolean;
  deletedAt: string | null;
  props: Record<string, PropValue>;
  createdAt: string;
  updatedAt: string;
};

export type LinkKind = "mention" | "relation";

export type BodhiLink = {
  id: string;
  fromId: string;
  toId: string;
  kind: LinkKind;
  context: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type Library = {
  types: ObjectType[];
  objects: BodhiObject[];
  links: BodhiLink[];
  updatedAt: string;
};

export type Meta = {
  active: string;
  syncUsers: string[];
  initialized: boolean;
};

export const GUEST = "guest";

export const TYPE_IDS = {
  daily: "type_daily",
  note: "type_note",
  person: "type_person",
  project: "type_project",
  book: "type_book",
  idea: "type_idea",
  meeting: "type_meeting",
  task: "type_task",
  tag: "type_tag",
} as const;
