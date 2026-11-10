//#region node_modules/.nitro/vite/services/ssr/assets/merge-ntzy-eJJ.js
var GUEST = "guest";
var TYPE_IDS = {
	daily: "type_daily",
	note: "type_note",
	person: "type_person",
	project: "type_project",
	book: "type_book",
	idea: "type_idea",
	meeting: "type_meeting",
	task: "type_task",
	tag: "type_tag"
};
var EPOCH = "1970-01-01T00:00:00.000Z";
function systemTypes() {
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
			updatedAt: EPOCH
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
			updatedAt: EPOCH
		},
		{
			id: TYPE_IDS.person,
			key: "person",
			name: "Person",
			plural: "People",
			icon: "user",
			color: "sea",
			isSystem: true,
			properties: [{
				id: "role",
				name: "Role",
				kind: "text"
			}, {
				id: "email",
				name: "Email",
				kind: "text"
			}],
			updatedAt: EPOCH
		},
		{
			id: TYPE_IDS.project,
			key: "project",
			name: "Project",
			plural: "Projects",
			icon: "folder",
			color: "moss",
			isSystem: true,
			properties: [{
				id: "status",
				name: "Status",
				kind: "select",
				options: [
					"Active",
					"Paused",
					"Done"
				]
			}],
			updatedAt: EPOCH
		},
		{
			id: TYPE_IDS.book,
			key: "book",
			name: "Book",
			plural: "Books",
			icon: "book",
			color: "wine",
			isSystem: true,
			properties: [{
				id: "author",
				name: "Author",
				kind: "text"
			}],
			updatedAt: EPOCH
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
			updatedAt: EPOCH
		},
		{
			id: TYPE_IDS.meeting,
			key: "meeting",
			name: "Meeting",
			plural: "Meetings",
			icon: "users",
			color: "sea",
			isSystem: true,
			properties: [{
				id: "when",
				name: "When",
				kind: "date"
			}],
			updatedAt: EPOCH
		},
		{
			id: TYPE_IDS.task,
			key: "task",
			name: "Task",
			plural: "Tasks",
			icon: "check",
			color: "bark",
			isSystem: true,
			properties: [{
				id: "done",
				name: "Done",
				kind: "checkbox"
			}],
			updatedAt: EPOCH
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
			updatedAt: EPOCH
		}
	];
}
function emptyLibrary(now = (/* @__PURE__ */ new Date()).toISOString()) {
	return {
		types: systemTypes(),
		objects: [],
		links: [],
		updatedAt: now
	};
}
function dayStamp(date = /* @__PURE__ */ new Date()) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function parseDay(iso) {
	const [y, m, d] = iso.split("-").map((part) => Number(part));
	return new Date(y, (m ?? 1) - 1, d ?? 1);
}
function shiftDay(iso, by) {
	const date = parseDay(iso);
	date.setDate(date.getDate() + by);
	return dayStamp(date);
}
function isDay(value) {
	return !!value && /^\d{4}-\d{2}-\d{2}$/.test(value);
}
function newer(a, b) {
	return a.updatedAt >= b.updatedAt ? a : b;
}
function mergeById(lists) {
	const map = /* @__PURE__ */ new Map();
	for (const list of lists) for (const item of list) {
		const prev = map.get(item.id);
		map.set(item.id, prev ? newer(prev, item) : item);
	}
	return [...map.values()];
}
function mergeLibraries(left, right) {
	const types = mergeById([
		systemTypes(),
		left.types,
		right.types
	]);
	for (const system of systemTypes()) if (!types.some((type) => type.id === system.id)) types.push(system);
	return {
		types,
		objects: mergeById([left.objects, right.objects]),
		links: mergeById([left.links, right.links]),
		updatedAt: left.updatedAt >= right.updatedAt ? left.updatedAt : right.updatedAt
	};
}
function normalizeLibrary(raw) {
	if (!raw || typeof raw !== "object") return null;
	const value = raw;
	if (!Array.isArray(value.objects) || !Array.isArray(value.links)) return null;
	const types = Array.isArray(value.types) ? value.types : [];
	return mergeLibraries({
		types: systemTypes(),
		objects: [],
		links: [],
		updatedAt: "1970-01-01T00:00:00.000Z"
	}, {
		types,
		objects: value.objects,
		links: value.links,
		updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : (/* @__PURE__ */ new Date()).toISOString()
	});
}
//#endregion
export { isDay as a, parseDay as c, emptyLibrary as i, shiftDay as l, TYPE_IDS as n, mergeLibraries as o, dayStamp as r, normalizeLibrary as s, GUEST as t, systemTypes as u };
