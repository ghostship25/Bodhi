import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as cn, d as useBodhi, f as visibleObjects, s as TYPE_DOT, u as typeById } from "./router-Bg5G7pac.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-DLPeMIpH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SearchPage() {
	const library = useBodhi((state) => state.library);
	const [query, setQuery] = (0, import_react.useState)("");
	const results = (0, import_react.useMemo)(() => {
		const needle = query.trim().toLowerCase();
		if (!needle) return [];
		return visibleObjects(library).filter((object) => object.title.toLowerCase().includes(needle) || object.body.toLowerCase().includes(needle)).slice(0, 30);
	}, [library, query]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rise mx-auto max-w-2xl px-5 py-6 md:py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-4xl tracking-tight",
				children: "Search"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				autoFocus: true,
				value: query,
				onChange: (event) => setQuery(event.target.value),
				placeholder: "Titles and writing",
				className: "mt-5 w-full rounded-2xl border border-line bg-paper-2 px-4 py-3 text-base outline-none"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-4 divide-y divide-line",
				children: [query.trim() && results.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "py-6 text-sm text-ink-soft",
					children: "No matches."
				}), results.map((object) => {
					const type = typeById(library, object.typeId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/o/$objectId",
						params: { objectId: object.id },
						className: "flex items-center gap-3 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-2 rounded-full", TYPE_DOT[type?.color ?? "stone"]) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-serif text-lg",
							children: object.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-ink-faint",
							children: type?.name
						})] })]
					}) }, object.id);
				})]
			})
		]
	});
}
//#endregion
export { SearchPage as component };
