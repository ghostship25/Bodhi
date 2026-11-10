import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/body-editor-BwJf0D95.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BodyEditor({ value, onChange, objects, label = "Writing" }) {
	const [query, setQuery] = (0, import_react.useState)(null);
	const [caret, setCaret] = (0, import_react.useState)(0);
	const matches = (0, import_react.useMemo)(() => {
		if (query === null) return [];
		const needle = query.toLowerCase();
		return objects.filter((object) => !object.deletedAt && object.title.toLowerCase().includes(needle)).slice(0, 6);
	}, [objects, query]);
	function syncQuery(text, pos) {
		const match = text.slice(0, pos).match(/\[\[([^\]\n]*)$/);
		setQuery(match ? match[1] ?? "" : null);
		setCaret(pos);
	}
	function insert(title) {
		const before = value.slice(0, caret);
		const after = value.slice(caret);
		onChange(`${before.replace(/\[\[([^\]\n]*)$/, `[[${title}]]`)}${after}`);
		setQuery(null);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "mb-2 block text-sm font-medium text-ink-soft",
				htmlFor: "bodhi-body",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				id: "bodhi-body",
				value,
				onChange: (event) => {
					onChange(event.target.value);
					syncQuery(event.target.value, event.target.selectionStart ?? 0);
				},
				onKeyUp: (event) => syncQuery(event.currentTarget.value, event.currentTarget.selectionStart ?? 0),
				onClick: (event) => syncQuery(event.currentTarget.value, event.currentTarget.selectionStart ?? 0),
				onBlur: () => {
					window.setTimeout(() => setQuery(null), 160);
				},
				placeholder: "Write here. Link anything with [[double brackets]].",
				className: "min-h-64 w-full resize-y bg-transparent font-serif text-lg leading-relaxed text-ink outline-none placeholder:text-ink-faint"
			}),
			query !== null && matches.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "absolute left-0 top-full z-20 mt-1 w-full max-w-md overflow-hidden rounded-2xl border border-line bg-paper shadow-panel",
				children: matches.map((object) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "flex w-full items-center px-3 py-2 text-left text-sm hover:bg-paper-2",
					onMouseDown: (event) => {
						event.preventDefault();
						insert(object.title);
					},
					children: object.title
				}) }, object.id))
			})
		]
	});
}
//#endregion
export { BodyEditor as t };
