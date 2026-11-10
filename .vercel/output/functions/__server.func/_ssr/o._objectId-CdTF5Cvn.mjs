import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as TYPE_IDS } from "./merge-ntzy-eJJ.mjs";
import { a as cn, c as TypeIcon, d as useBodhi, f as visibleObjects, l as liveLinks, m as unlinkedMentions, n as Route$1, s as TYPE_DOT, u as typeById } from "./router-Bg5G7pac.mjs";
import { t as BodyEditor } from "./body-editor-BwJf0D95.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/o._objectId-CdTF5Cvn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ObjectView({ objectId }) {
	const library = useBodhi((state) => state.library);
	const updateObject = useBodhi((state) => state.updateObject);
	const setProp = useBodhi((state) => state.setProp);
	const deleteObject = useBodhi((state) => state.deleteObject);
	const connect = useBodhi((state) => state.connect);
	const disconnect = useBodhi((state) => state.disconnect);
	const addProperty = useBodhi((state) => state.addProperty);
	const setTemplate = useBodhi((state) => state.setTemplate);
	const navigate = useNavigate();
	const [confirm, setConfirm] = (0, import_react.useState)(false);
	const [connectQuery, setConnectQuery] = (0, import_react.useState)("");
	const [showConnect, setShowConnect] = (0, import_react.useState)(false);
	const [propName, setPropName] = (0, import_react.useState)("");
	const [propKind, setPropKind] = (0, import_react.useState)("text");
	const object = library.objects.find((item) => item.id === objectId && !item.deletedAt);
	const type = object ? typeById(library, object.typeId) : void 0;
	const [copied, setCopied] = (0, import_react.useState)(false);
	const related = (0, import_react.useMemo)(() => {
		if (!object) return [];
		return liveLinks(library).filter((link) => link.fromId === object.id || link.toId === object.id);
	}, [library, object]);
	if (!object || !type) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl px-5 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-serif text-3xl",
			children: "That object is gone"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/objects",
			className: "mt-4 inline-block text-sm text-ink-soft",
			children: "Back to objects"
		})]
	});
	const linkedIds = new Set(related.map((link) => link.fromId === object.id ? link.toId : link.fromId));
	const unlinked = unlinkedMentions(object.body, visibleObjects(library), linkedIds, object.id);
	const suggestions = visibleObjects(library).filter((item) => item.id !== object.id && item.typeId !== TYPE_IDS.daily).filter((item) => item.title.toLowerCase().includes(connectQuery.trim().toLowerCase())).slice(0, 6);
	function onProp(key, value) {
		if (!object) return;
		setProp(object.id, key, value);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rise mx-auto max-w-2xl px-5 py-6 md:py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/objects",
				search: { type: type.key },
				className: "text-sm text-ink-soft",
				children: type.plural
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-center gap-2 text-sm text-ink-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-2 rounded-full", TYPE_DOT[type.color]) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TypeIcon, {
						name: type.icon,
						className: "size-4"
					}),
					type.name,
					object.inbox && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-paper-2 px-2 py-0.5 text-xs",
						children: "Inbox"
					}),
					object.pinned && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-paper-2 px-2 py-0.5 text-xs",
						children: "Pinned"
					})
				]
			}),
			type.id === TYPE_IDS.daily ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-serif text-4xl tracking-tight text-balance",
				children: object.title
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: object.title,
				onChange: (event) => updateObject(object.id, { title: event.target.value }),
				"aria-label": "Title",
				className: "mt-3 w-full bg-transparent font-serif text-4xl tracking-tight text-ink outline-none"
			}),
			type.properties.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "mt-6 divide-y divide-line rounded-2xl border border-line",
				children: type.properties.map((property) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2 px-3 py-3 sm:grid-cols-[8rem_1fr] sm:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-sm text-ink-soft",
						children: property.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PropertyField, {
						property,
						value: object.props[property.id] ?? null,
						onChange: (value) => onProp(property.id, value)
					}) })]
				}, property.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BodyEditor, {
					value: object.body,
					onChange: (body) => updateObject(object.id, { body }),
					objects: visibleObjects(library).filter((item) => item.id !== object.id)
				})
			}),
			unlinked.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium text-ink-soft",
					children: "Mentioned, not linked"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 flex flex-wrap gap-2",
					children: unlinked.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "rounded-full border border-line px-3 py-1 text-sm",
						onClick: () => connect(object.id, item.id),
						children: ["Link ", item.title]
					}) }, item.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium text-ink-soft",
							children: "Connections"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-sm text-ink",
							onClick: () => setShowConnect((value) => !value),
							children: showConnect ? "Close" : "Connect"
						})]
					}),
					showConnect && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 rounded-2xl border border-line p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: connectQuery,
							onChange: (event) => setConnectQuery(event.target.value),
							placeholder: "Find an object",
							className: "w-full rounded-xl border border-line bg-paper-2 px-3 py-2 text-sm outline-none"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2",
							children: suggestions.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "flex w-full items-center rounded-xl px-2 py-2 text-left text-sm hover:bg-paper-2",
								onClick: () => {
									connect(object.id, item.id);
									setConnectQuery("");
									setShowConnect(false);
								},
								children: item.title
							}) }, item.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-3 divide-y divide-line",
						children: [related.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "py-3 text-sm text-ink-soft",
							children: "No connections yet."
						}), related.map((link) => {
							const otherId = link.fromId === object.id ? link.toId : link.fromId;
							const other = library.objects.find((item) => item.id === otherId && !item.deletedAt);
							if (!other) return null;
							const incoming = link.toId === object.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-3 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/o/$objectId",
										params: { objectId: other.id },
										className: "font-serif text-lg",
										children: other.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-ink-faint",
										children: [
											incoming ? "Links here" : "Linked",
											" · ",
											link.kind
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-sm text-ink-soft",
									onClick: () => disconnect(link.id),
									children: "Remove"
								})]
							}, link.id);
						})]
					})
				]
			}),
			type.id !== TYPE_IDS.daily && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 rounded-2xl border border-line p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-sm font-medium text-ink-soft",
					children: ["Add a property to ", type.plural]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-col gap-2 sm:flex-row",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: propName,
							onChange: (event) => setPropName(event.target.value),
							placeholder: "Property name",
							className: "flex-1 rounded-xl border border-line bg-paper-2 px-3 py-2 text-sm outline-none"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: propKind,
							onChange: (event) => setPropKind(event.target.value),
							className: "rounded-xl border border-line bg-paper-2 px-3 py-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "text",
									children: "Text"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "number",
									children: "Number"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "date",
									children: "Date"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "checkbox",
									children: "Checkbox"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "select",
									children: "Select"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "rounded-full bg-ink px-4 py-2 text-sm text-paper",
							onClick: () => {
								addProperty(type.id, {
									name: propName,
									kind: propKind,
									options: propKind === "select" ? ["One", "Two"] : void 0
								});
								setPropName("");
							},
							children: "Add"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "rounded-full border border-line px-4 py-2 text-sm",
						onClick: () => updateObject(object.id, { pinned: !object.pinned }),
						children: object.pinned ? "Unpin" : "Pin"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "rounded-full border border-line px-4 py-2 text-sm",
						onClick: () => {
							const markdown = `# ${object.title}\n\n${object.body}`;
							navigator.clipboard.writeText(markdown).then(() => {
								setCopied(true);
								window.setTimeout(() => setCopied(false), 1600);
							});
						},
						children: copied ? "Copied" : "Copy Markdown"
					}),
					type.id !== TYPE_IDS.daily && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "rounded-full border border-line px-4 py-2 text-sm",
						onClick: () => setTemplate(type.id, object.body),
						children: "Use writing as template"
					}),
					object.inbox && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "rounded-full border border-line px-4 py-2 text-sm",
						onClick: () => updateObject(object.id, { inbox: false }),
						children: "File from inbox"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "rounded-full border border-line px-4 py-2 text-sm",
						onClick: () => updateObject(object.id, { archived: !object.archived }),
						children: object.archived ? "Unarchive" : "Archive"
					}),
					type.id !== TYPE_IDS.daily && (confirm ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "rounded-full bg-type-wine px-4 py-2 text-sm text-paper",
						onClick: () => {
							deleteObject(object.id);
							navigate({ to: "/objects" });
						},
						children: "Confirm delete"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "rounded-full border border-line px-4 py-2 text-sm",
						onClick: () => setConfirm(true),
						children: "Delete"
					}))
				]
			})
		]
	});
}
function PropertyField({ property, value, onChange }) {
	const className = "w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm outline-none";
	if (property.kind === "checkbox") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type: "checkbox",
		checked: value === true,
		onChange: (event) => onChange(event.target.checked),
		className: "size-4 accent-accent",
		"aria-label": property.name
	});
	if (property.kind === "select") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
		className,
		value: typeof value === "string" ? value : "",
		onChange: (event) => onChange(event.target.value),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
			value: "",
			children: "Choose"
		}), (property.options ?? []).map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
			value: option,
			children: option
		}, option))]
	});
	if (property.kind === "number") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type: "number",
		className,
		value: typeof value === "number" ? value : "",
		onChange: (event) => onChange(event.target.value === "" ? null : Number(event.target.value)),
		"aria-label": property.name
	});
	if (property.kind === "date") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type: "date",
		className,
		value: typeof value === "string" ? value : "",
		onChange: (event) => onChange(event.target.value),
		"aria-label": property.name
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className,
		value: typeof value === "string" ? value : "",
		onChange: (event) => onChange(event.target.value),
		"aria-label": property.name
	});
}
function ObjectRoute() {
	const { objectId } = Route$1.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ObjectView, { objectId });
}
//#endregion
export { ObjectRoute as component };
