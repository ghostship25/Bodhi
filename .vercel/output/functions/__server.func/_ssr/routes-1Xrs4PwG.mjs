import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as parseDay, l as shiftDay, n as TYPE_IDS, r as dayStamp } from "./merge-ntzy-eJJ.mjs";
import { g as ChevronLeft, h as ChevronRight } from "../_libs/lucide-react.mjs";
import { t as format } from "../_libs/date-fns.mjs";
import { d as useBodhi, f as visibleObjects, i as Route$7, l as liveLinks } from "./router-Bg5G7pac.mjs";
import { t as BodyEditor } from "./body-editor-BwJf0D95.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-1Xrs4PwG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useVisibleDay(explicit) {
	return (0, import_react.useSyncExternalStore)(() => () => {}, () => explicit ?? dayStamp(), () => explicit ?? "pending");
}
function TodayPage() {
	const { day } = Route$7.useSearch();
	const iso = useVisibleDay(day);
	const library = useBodhi((state) => state.library);
	const updateObject = useBodhi((state) => state.updateObject);
	const setProp = useBodhi((state) => state.setProp);
	const ensureDaily = useBodhi((state) => state.ensureDaily);
	const navigate = useNavigate();
	const dated = iso !== "pending";
	(0, import_react.useEffect)(() => {
		if (!dated) return;
		const hasToday = library.objects.some((object) => object.day === iso && !object.deletedAt);
		const hasPending = library.objects.some((object) => object.day === "pending" && !object.deletedAt);
		if (!hasToday && !hasPending) ensureDaily(iso);
	}, [
		dated,
		iso,
		library.objects,
		ensureDaily
	]);
	const daily = library.objects.find((object) => object.day === iso && !object.deletedAt) ?? library.objects.find((object) => object.day === "pending" && !object.deletedAt);
	const openTasks = visibleObjects(library).filter((object) => object.typeId === TYPE_IDS.task && object.props.done !== true);
	const pool = visibleObjects(library).filter((object) => !object.day && object.typeId !== TYPE_IDS.task);
	const revisit = dated && pool.length > 0 ? pool[hashDay(iso) % pool.length] : void 0;
	const connected = daily ? liveLinks(library).filter((link) => link.fromId === daily.id || link.toId === daily.id).map((link) => library.objects.find((object) => object.id === (link.fromId === daily.id ? link.toId : link.fromId))).filter((object) => object && !object.deletedAt) : [];
	const seen = /* @__PURE__ */ new Set();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rise mx-auto max-w-2xl px-5 py-6 md:py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Previous day",
						disabled: !dated,
						className: "grid size-11 place-items-center rounded-full border border-line disabled:opacity-40",
						onClick: () => dated && void navigate({
							to: "/",
							search: { day: shiftDay(iso, -1) }
						}),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-sm text-ink-soft",
						onClick: () => void navigate({
							to: "/",
							search: {}
						}),
						children: dated && iso === dayStamp() ? "Today" : "Jump to today"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Next day",
						disabled: !dated,
						className: "grid size-11 place-items-center rounded-full border border-line disabled:opacity-40",
						onClick: () => dated && void navigate({
							to: "/",
							search: { day: shiftDay(iso, 1) }
						}),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5" })
					})
				]
			}),
			dated ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-sm font-medium tracking-wide text-ink-soft",
				children: format(parseDay(iso), "EEEE")
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-sm font-medium tracking-wide text-ink-soft",
				children: "Daily note"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-serif text-4xl tracking-tight text-balance",
				children: dated ? format(parseDay(iso), "d MMMM yyyy") : "Today"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: daily ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BodyEditor, {
					label: "Daily note",
					value: daily.body,
					onChange: (body) => updateObject(daily.id, { body }),
					objects: visibleObjects(library).filter((object) => object.id !== daily.id)
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-ink-soft",
					children: "This day has no note yet."
				})
			}),
			openTasks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium text-ink-soft",
					children: "Open tasks"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 divide-y divide-line",
					children: openTasks.map((task) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							"aria-label": `Done: ${task.title}`,
							className: "size-4 accent-accent",
							onChange: () => setProp(task.id, "done", true)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/o/$objectId",
							params: { objectId: task.id },
							className: "font-serif text-lg",
							children: task.title
						})]
					}, task.id))
				})]
			}),
			revisit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 rounded-2xl border border-line px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium text-ink-soft",
						children: "Revisit"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/o/$objectId",
						params: { objectId: revisit.id },
						className: "mt-1 block font-serif text-lg",
						children: revisit.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-ink-faint",
						children: "A note from the rest of your library, different each day."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium text-ink-soft",
					children: "Connected"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-3 divide-y divide-line",
					children: [connected.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "py-3 text-sm text-ink-faint",
						children: "Link something with [[double brackets]]."
					}), connected.map((object) => {
						if (!object || seen.has(object.id)) return null;
						seen.add(object.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/o/$objectId",
								params: { objectId: object.id },
								className: "font-serif text-lg",
								children: object.title
							})
						}, object.id);
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/ask",
				className: "mt-8 inline-block text-sm text-ink",
				children: "Ask your notes"
			})
		]
	});
}
function hashDay(day) {
	let hash = 0;
	for (const char of day) hash = hash * 33 + char.charCodeAt(0) >>> 0;
	return hash;
}
//#endregion
export { TodayPage as component };
