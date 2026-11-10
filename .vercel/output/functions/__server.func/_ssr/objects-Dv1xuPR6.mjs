import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as TYPE_IDS } from "./merge-ntzy-eJJ.mjs";
import { a as cn, c as TypeIcon, d as useBodhi, f as visibleObjects, o as ICON_CHOICES, r as Route$3, s as TYPE_DOT, u as typeById } from "./router-Bg5G7pac.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/objects-Dv1xuPR6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COLORS = [
	"sage",
	"sea",
	"wine",
	"stone",
	"moss",
	"bark"
];
function ObjectsPage() {
	const { type: typeKey } = Route$3.useSearch();
	const library = useBodhi((state) => state.library);
	const createObject = useBodhi((state) => state.createObject);
	const createType = useBodhi((state) => state.createType);
	const [title, setTitle] = (0, import_react.useState)("");
	const [typeName, setTypeName] = (0, import_react.useState)("");
	const [icon, setIcon] = (0, import_react.useState)("box");
	const [color, setColor] = (0, import_react.useState)("sage");
	const [showType, setShowType] = (0, import_react.useState)(false);
	const [query, setQuery] = (0, import_react.useState)("all");
	const activeType = library.types.find((type) => type.key === typeKey);
	const queryProp = activeType?.properties.find((property) => property.kind === "checkbox" || property.kind === "select");
	(0, import_react.useEffect)(() => {
		setQuery(typeKey === "task" ? "open" : "all");
	}, [typeKey]);
	const objects = (0, import_react.useMemo)(() => {
		return visibleObjects(library).filter((object) => object.typeId !== TYPE_IDS.daily).filter((object) => {
			if (!typeKey) return true;
			if (typeKey === "inbox") return object.inbox;
			return activeType ? object.typeId === activeType.id : true;
		}).filter((object) => {
			if (!queryProp || query === "all") return true;
			if (queryProp.kind === "checkbox") {
				const done = object.props[queryProp.id] === true;
				return query === "done" ? done : !done;
			}
			return object.props[queryProp.id] === query;
		}).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
	}, [
		library,
		typeKey,
		activeType,
		query,
		queryProp
	]);
	const heading = typeKey === "inbox" ? "Inbox" : activeType?.plural ?? "Objects";
	const createTypeId = activeType?.id ?? TYPE_IDS.note;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rise mx-auto max-w-2xl px-5 py-6 md:py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-4xl tracking-tight",
					children: heading
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-ink-soft",
					children: [
						objects.length,
						" ",
						objects.length === 1 ? "object" : "objects"
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-sm text-ink-soft",
					onClick: () => setShowType((value) => !value),
					children: showType ? "Close" : "New type"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex gap-2 overflow-x-auto pb-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filter, {
						to: "/objects",
						search: {},
						label: "All",
						current: !typeKey
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filter, {
						to: "/objects",
						search: { type: "inbox" },
						label: "Inbox",
						current: typeKey === "inbox"
					}),
					library.types.filter((type) => type.id !== TYPE_IDS.daily).map((type) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filter, {
						to: "/objects",
						search: { type: type.key },
						label: type.plural,
						current: typeKey === type.key
					}, type.id))
				]
			}),
			queryProp && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-4 flex items-center gap-2 text-sm text-ink-soft",
				children: [queryProp.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: query,
					onChange: (event) => setQuery(event.target.value),
					className: "rounded-full border border-line bg-paper px-3 py-2 text-sm text-ink",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "all",
						children: "Any"
					}), queryProp.kind === "checkbox" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "open",
						children: "Open"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "done",
						children: "Done"
					})] }) : (queryProp.options ?? []).map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: option,
						children: option
					}, option))]
				})]
			}),
			showType && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-4 rounded-3xl border border-line bg-paper-2 p-4",
				onSubmit: (event) => {
					event.preventDefault();
					if (!typeName.trim()) return;
					createType({
						name: typeName.trim(),
						icon,
						color
					});
					setTypeName("");
					setShowType(false);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-xl",
						children: "New object type"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: typeName,
						onChange: (event) => setTypeName(event.target.value),
						placeholder: "Name, such as Place",
						className: "mt-3 w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm outline-none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: ICON_CHOICES.map((choice) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": choice.label,
							onClick: () => setIcon(choice.id),
							className: cn("grid size-10 place-items-center rounded-xl border", icon === choice.id ? "border-accent bg-paper" : "border-line"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TypeIcon, {
								name: choice.id,
								className: "size-4"
							})
						}, choice.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex gap-2",
						children: COLORS.map((swatch) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": swatch,
							onClick: () => setColor(swatch),
							className: cn("size-6 rounded-full", TYPE_DOT[swatch], color === swatch && "ring-2 ring-ink ring-offset-2 ring-offset-paper-2")
						}, swatch))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "mt-4 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-fg",
						children: "Create type"
					})
				]
			}),
			typeKey !== "inbox" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-5 flex gap-2",
				onSubmit: (event) => {
					event.preventDefault();
					if (!title.trim()) return;
					createObject({
						title: title.trim(),
						typeId: createTypeId,
						inbox: false
					});
					setTitle("");
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: title,
					onChange: (event) => setTitle(event.target.value),
					placeholder: `New ${activeType?.name.toLowerCase() ?? "note"}`,
					className: "min-w-0 flex-1 rounded-full border border-line bg-paper-2 px-4 py-3 text-sm outline-none"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					className: "rounded-full bg-ink px-4 py-3 text-sm text-paper",
					children: "Add"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-4 divide-y divide-line",
				children: [objects.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "py-8 text-sm text-ink-soft",
					children: "Nothing here yet. Capture something, or add it above."
				}), objects.map((object) => {
					const type = typeById(library, object.typeId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/o/$objectId",
						params: { objectId: object.id },
						className: "flex items-center gap-3 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-2 shrink-0 rounded-full", TYPE_DOT[type?.color ?? "stone"]) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate font-serif text-lg",
								children: object.title || "Untitled"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-ink-faint",
								children: type?.name
							})]
						})]
					}) }, object.id);
				})]
			})
		]
	});
}
function Filter({ to, search, label, current }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to,
		search,
		className: cn("shrink-0 rounded-full px-3 py-2 text-sm", current ? "bg-ink text-paper" : "border border-line text-ink-soft"),
		children: label
	});
}
//#endregion
export { ObjectsPage as component };
