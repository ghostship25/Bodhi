import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CcVgDxJ4.mjs";
import { d as useBodhi, f as visibleObjects, g as useCurrentUserState, p as createSsrRpc } from "./router-Bg5G7pac.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ask-BrQVo3Jd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var askNotes = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const question = String(input?.question ?? "").trim().slice(0, 500);
	if (question.length < 2) throw new Error("Ask a question first.");
	return {
		question,
		notes: (Array.isArray(input?.notes) ? input.notes : []).slice(0, 8).map((note) => ({
			title: String(note?.title ?? "").slice(0, 140),
			excerpt: String(note?.excerpt ?? "").slice(0, 500)
		}))
	};
}).handler(createSsrRpc("1ea5f5ba63369885dac7d2f66b11397e278c0e7667125a7bc8f34ef8e41bcd83"));
function AskPage() {
	const library = useBodhi((state) => state.library);
	const { user, isPending } = useCurrentUserState();
	const [question, setQuestion] = (0, import_react.useState)("");
	const [answer, setAnswer] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	const objects = (0, import_react.useMemo)(() => visibleObjects(library).filter((object) => !object.day), [library]);
	async function ask() {
		const words = question.toLowerCase().split(/\W+/).filter((word) => word.length > 2);
		const ranked = objects.map((object) => {
			const hay = `${object.title} ${object.body}`.toLowerCase();
			return {
				object,
				score: words.reduce((sum, word) => sum + (hay.includes(word) ? 1 : 0), 0)
			};
		}).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 6);
		if (ranked.length === 0) {
			setAnswer("");
			setError("Nothing in this library matches that yet.");
			return;
		}
		setPending(true);
		setError("");
		setAnswer("");
		try {
			const result = await askNotes({ data: {
				question,
				notes: ranked.map(({ object }) => ({
					title: object.title,
					excerpt: object.body.slice(0, 500)
				}))
			} });
			if (result.ok) setAnswer(result.text);
			else setError(result.error);
		} catch {
			setError("Sign in with email, then try again. Asking reads your account.");
		} finally {
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rise mx-auto max-w-2xl px-5 py-6 md:py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-4xl tracking-tight",
				children: "Ask your notes"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-relaxed text-ink-soft",
				children: "A question is matched against this library, then answered only from those notes. Nothing is sent until you ask. Local use does not require an account. Asking does, so the same library can be read from another device."
			}),
			!isPending && !user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/login",
				className: "mt-4 inline-block text-sm text-ink",
				children: "Create an account or sign in"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				value: question,
				onChange: (event) => setQuestion(event.target.value),
				placeholder: "What did I write about links?",
				className: "mt-5 min-h-24 w-full rounded-2xl border border-line bg-paper-2 px-4 py-3 text-base outline-none"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: pending || question.trim().length < 2 || !isPending && !user,
				onClick: () => void ask(),
				className: "mt-3 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-fg disabled:opacity-40",
				children: pending ? "Asking…" : "Ask"
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-type-wine",
				children: error
			}),
			answer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 whitespace-pre-wrap font-serif text-lg leading-relaxed",
				children: answer
			})
		]
	});
}
//#endregion
export { AskPage as component };
