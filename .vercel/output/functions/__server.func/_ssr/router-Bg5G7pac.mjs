import { o as __toESM } from "../_runtime.mjs";
import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { r as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as useRouter, _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, p as useRouterState, v as createFileRoute, x as useNavigate, y as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogPortal, i as DialogOverlay, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CcVgDxJ4.mjs";
import { L as string, N as number, P as object$1, R as union, j as literal } from "../_libs/@better-auth/core+[...].mjs";
import { t as authClient } from "./client-IWHfIGH2.mjs";
import { n as auth } from "./server-C62RRNwO.mjs";
import { a as isDay, c as parseDay, i as emptyLibrary, n as TYPE_IDS, o as mergeLibraries, r as dayStamp, s as normalizeLibrary, t as GUEST, u as systemTypes } from "./merge-ntzy-eJJ.mjs";
import { _ as CalendarDays, a as Sun, c as Moon, d as Hash, f as FolderKanban, i as TriangleAlert, l as MessageSquare, m as CircleCheck, n as Users, o as Search, p as FileText, r as UserRound, s as Plus, t as Waypoints, u as Lightbulb, v as Box, y as BookOpen } from "../_libs/lucide-react.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { t as format } from "../_libs/date-fns.mjs";
import { t as _e } from "../_libs/cmdk.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Bg5G7pac.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* Path-based preview hosts serve the dev server under `/{port_id}/` and strip
* that prefix before forwarding, so SSR sees `/` while the browser URL keeps the
* prefix. TanStack Start resets `basepath` on hydration, so a `rewrite` keeps
* client routing and generated links aligned with the public URL.
*/
var PATH_BASED_PREVIEW_HOSTS = /* @__PURE__ */ new Set([
	"preview.grok.genai.mil",
	"preview.grok.mil",
	"preview.grokgsac.com"
]);
var PORT_ID_PREFIX = /^\/hds-[a-z0-9]+-\d+-[a-z0-9]+(?=\/|$)/i;
function previewPathPrefix(hostname, pathname) {
	if (!PATH_BASED_PREVIEW_HOSTS.has(hostname.toLowerCase())) return void 0;
	return PORT_ID_PREFIX.exec(pathname)?.[0];
}
function prefixRewrite(prefix) {
	return {
		input: ({ url }) => {
			if (url.pathname === prefix) url.pathname = "/";
			else if (url.pathname.startsWith(`${prefix}/`)) url.pathname = url.pathname.slice(prefix.length);
			return url;
		},
		output: ({ url }) => {
			url.pathname = `${prefix}${url.pathname}`;
			return url;
		}
	};
}
function previewPathRewrite() {
	if (typeof window === "undefined") return void 0;
	const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
	return prefix ? prefixRewrite(prefix) : void 0;
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object$1({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	return useSessionUserState();
}
function useSessionUserState() {
	const { data, isPending } = authClient.useSession();
	const id = data?.user.id;
	const displayName = data?.user.name ?? null;
	const primaryEmail = data?.user.email ?? null;
	const profileImageUrl = data?.user.image ?? null;
	const user = (0, import_react.useMemo)(() => id ? {
		id,
		displayName,
		primaryEmail,
		profileImageUrl,
		isDevFallback: false
	} : null, [
		id,
		displayName,
		primaryEmail,
		profileImageUrl
	]);
	return (0, import_react.useMemo)(() => ({
		user,
		isPending
	}), [user, isPending]);
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
var MENTION = /\[\[([^\]\n]+)\]\]/g;
function mentionTitles(body) {
	const found = [];
	for (const match of body.matchAll(MENTION)) {
		const title = match[1]?.trim();
		if (title) found.push(title);
	}
	return found;
}
function escapeRegExp(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function snippetAround(body, title) {
	const index = body.toLowerCase().indexOf(`[[${title.toLowerCase()}]]`);
	if (index < 0) return title;
	const start = Math.max(0, index - 36);
	const end = Math.min(body.length, index + title.length + 40);
	const slice = body.slice(start, end).replace(/\s+/g, " ").trim();
	return `${start > 0 ? "…" : ""}${slice}${end < body.length ? "…" : ""}`;
}
function reconcileMentions(objects, links, objectId, body, now) {
	if (!objects.find((object) => object.id === objectId)) return links;
	const wanted = /* @__PURE__ */ new Set();
	for (const title of mentionTitles(body)) {
		const target = objects.find((object) => object.id !== objectId && !object.deletedAt && object.title.toLowerCase() === title.toLowerCase());
		if (target) wanted.add(target.id);
	}
	const next = links.map((link) => ({ ...link }));
	for (const targetId of wanted) {
		const id = `mention:${objectId}:${targetId}`;
		const existing = next.find((link) => link.id === id);
		const context = snippetAround(body, objects.find((object) => object.id === targetId)?.title ?? "");
		if (existing) {
			existing.deletedAt = null;
			existing.context = context;
			existing.updatedAt = now;
			existing.kind = "mention";
		} else next.push({
			id,
			fromId: objectId,
			toId: targetId,
			kind: "mention",
			context,
			createdAt: now,
			updatedAt: now,
			deletedAt: null
		});
	}
	for (const link of next) {
		if (link.kind !== "mention" || link.fromId !== objectId) continue;
		if (!wanted.has(link.toId) && !link.deletedAt) {
			link.deletedAt = now;
			link.updatedAt = now;
		}
	}
	return next;
}
function unlinkedMentions(body, objects, linkedIds, selfId) {
	const plain = body.replace(MENTION, " ");
	const found = [];
	for (const object of objects) {
		if (object.id === selfId || object.deletedAt || linkedIds.has(object.id)) continue;
		const title = object.title.trim();
		if (title.length < 3) continue;
		if (new RegExp(`(^|[^A-Za-z0-9])${escapeRegExp(title)}([^A-Za-z0-9]|$)`, "i").test(plain)) found.push(object);
		if (found.length >= 6) break;
	}
	return found;
}
function rewriteTitle(body, from, to) {
	if (!from || from === to) return body;
	return body.replace(new RegExp(`\\[\\[${escapeRegExp(from)}\\]\\]`, "gi"), `[[${to}]]`);
}
var DB_NAME = "bodhi";
var STORE = "kv";
function openDb() {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, 1);
		request.onupgradeneeded = () => {
			const db = request.result;
			if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
		};
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}
function requestToPromise(request) {
	return new Promise((resolve, reject) => {
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}
async function idbGet(key) {
	return await requestToPromise((await openDb()).transaction(STORE, "readonly").objectStore(STORE).get(key)) ?? null;
}
async function idbSet(key, value) {
	await requestToPromise((await openDb()).transaction(STORE, "readwrite").objectStore(STORE).put(value, key));
}
var memory = /* @__PURE__ */ new Map();
function memoryMode() {
	return typeof indexedDB === "undefined";
}
async function loadMeta() {
	const fallback = {
		active: GUEST,
		syncUsers: [],
		initialized: false
	};
	try {
		return (memoryMode() ? memory.get("meta") : await idbGet("meta")) ?? fallback;
	} catch {
		return memory.get("meta") ?? fallback;
	}
}
async function saveMeta(meta) {
	memory.set("meta", meta);
	if (memoryMode()) return;
	try {
		await idbSet("meta", meta);
	} catch {}
}
async function loadLibrary(key) {
	try {
		if (memoryMode()) return memory.get(`lib:${key}`) ?? null;
		return await idbGet(`lib:${key}`);
	} catch {
		return memory.get(`lib:${key}`) ?? null;
	}
}
async function saveLibrary(key, library) {
	memory.set(`lib:${key}`, library);
	if (memoryMode()) return;
	try {
		await idbSet(`lib:${key}`, library);
	} catch {}
}
function object(id, typeId, title, body, now, extra = {}) {
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
		...extra
	};
}
function seedLibrary(now = "2026-01-01T00:00:00.000Z", day = "pending") {
	const today = day;
	const dailyTitle = day === "pending" ? "Today" : format(parseDay(day), "d MMMM yyyy");
	const objects = [
		object("obj_daily_today", TYPE_IDS.daily, dailyTitle, `This page is today. Write what you want to remember, and connect it with double brackets.

[[How Bodhi works]]
[[Quick capture]]`, now, { day: today }),
		object("obj_how", TYPE_IDS.note, "How Bodhi works", `Everything in Bodhi is an object: a note, a person, a project, a book, a meeting.

Properties describe an object. [[Links]] relate it to others. A link typed in double brackets points both ways — open [[The graph]] to see them.

Today is the front door. [[Quick capture]] is how things arrive before you file them.

An account is optional. Without one, this library stays on this device. With one, the same notes can follow you to any browser or desktop install that signs in to this Bodhi.

When you are done reading, File the starter notes.`, now, { pinned: true }),
		object("obj_capture", TYPE_IDS.note, "Quick capture", `Press the plus button, or press C when you are not typing. On a keyboard, Ctrl or Command J also opens capture.

Give it a title, pick a type, and leave "Also on today" on if it belongs to the day. It lands in your inbox until you file it.

Try capturing a thought about [[The graph]].`, now, { inbox: true }),
		object("obj_graph", TYPE_IDS.idea, "The graph", `The graph is not a hairball for its own sake. It is the neighborhood of what you have linked.

[[How Bodhi works]] and [[Quick capture]] are already tied to today. Click any dot to open the object. Drag to rearrange. Hide a type if you want a quieter view.`, now),
		object("obj_links", TYPE_IDS.note, "Links", `Write [[How Bodhi works]] inside any object and Bodhi keeps the connection, even if you rename the title later.

Backlinks collect on the object you pointed at. A relation you add with Connect is the same idea, without writing it into the text.`, now),
		object("obj_bodhi", TYPE_IDS.project, "Make Bodhi yours", `Archive the starter notes when they get in the way. Add a person, a book, or your own type from the Objects tab.

Status lives on this project as a property. The writing can mention [[Links]] or [[The graph]].`, now, { props: { status: "Active" } }),
		object("obj_task_file", TYPE_IDS.task, "File the starter notes", "Check this off after you have archived the notes you do not need.", now, { props: { done: false } })
	];
	let links = emptyLibrary(now).links;
	for (const item of objects) links = reconcileMentions(objects, links, item.id, item.body, now);
	return {
		types: emptyLibrary(now).types,
		objects,
		links,
		updatedAt: now
	};
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var pullLibrary = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("aeafc1383127146681f84199e213d0068836988391a3d5ffdfec1358046b32e6"));
var pushLibrary = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const library = normalizeLibrary(input?.library);
	if (!library) throw new Error("Invalid library");
	if (library.objects.length > 5e3) throw new Error("Library is too large");
	const encoded = JSON.stringify(library);
	if (encoded.length > 4e6) throw new Error("Library is too large");
	return {
		library,
		baseUpdatedAt: input.baseUpdatedAt,
		encoded
	};
}).handler(createSsrRpc("34a963e0844e7631682d39c2e1e3db7bd884e31ec1bdfe173d81ec8ff6134120"));
var STARTER = seedLibrary();
var bootPromise = null;
var pushTimer;
function claimToday(library, today) {
	const stamp = nowIso();
	const pending = library.objects.find((object) => object.day === "pending" && !object.deletedAt);
	if (!pending) return library;
	const todayNote = library.objects.find((object) => object.day === today && !object.deletedAt);
	const objects = library.objects.map((object) => {
		if (!todayNote && object.id === pending.id) return {
			...object,
			day: today,
			title: prettyDay(today),
			updatedAt: stamp
		};
		if (todayNote && !todayNote.body.trim() && pending.body.trim()) {
			if (object.id === todayNote.id) return {
				...object,
				body: pending.body,
				updatedAt: stamp
			};
			if (object.id === pending.id) return {
				...object,
				day: null,
				deletedAt: stamp,
				updatedAt: stamp
			};
		}
		if (todayNote && object.id === pending.id) return {
			...object,
			day: null,
			deletedAt: stamp,
			updatedAt: stamp
		};
		return object;
	});
	return {
		...library,
		objects,
		updatedAt: stamp
	};
}
var pushing = false;
function nowIso() {
	return (/* @__PURE__ */ new Date()).toISOString();
}
function uid() {
	return crypto.randomUUID();
}
function prettyDay(day) {
	return format(parseDay(day), "d MMMM yyyy");
}
var useBodhi = create((set, get) => {
	async function persist(library, active = get().active) {
		await saveLibrary(active, library);
	}
	function commit(recipe, touch = true) {
		const current = get().library;
		let next = recipe(current);
		if (touch) next = {
			...next,
			updatedAt: nowIso()
		};
		set({ library: next });
		persist(next);
		if (get().syncUsers.includes(get().active)) schedulePush();
	}
	function schedulePush() {
		if (pushTimer) window.clearTimeout(pushTimer);
		pushTimer = window.setTimeout(() => {
			flushPush();
		}, 700);
	}
	async function flushPush(attempt = 0) {
		const active = get().active;
		if (!get().syncUsers.includes(active) || pushing) return;
		pushing = true;
		set({
			syncStatus: "syncing",
			syncError: null
		});
		try {
			const library = get().library;
			const result = await pushLibrary({ data: {
				library,
				baseUpdatedAt: get().baseUpdatedAt
			} });
			if (result.conflict) {
				const merged = mergeLibraries(get().library, result.snapshot);
				set({
					library: merged,
					baseUpdatedAt: result.snapshot.updatedAt
				});
				await persist(merged, active);
				pushing = false;
				if (attempt < 2) await flushPush(attempt + 1);
				return;
			}
			set({
				baseUpdatedAt: library.updatedAt,
				syncStatus: "synced",
				syncError: null
			});
		} catch (error) {
			set({
				syncStatus: "error",
				syncError: (error instanceof Error ? error.message : "Sync failed") === "Unauthorized" ? "Sign in again to keep syncing." : "Sync paused. Notes are still on this device."
			});
		} finally {
			pushing = false;
		}
	}
	async function pullAndMerge(userId) {
		set({
			syncStatus: "syncing",
			syncError: null
		});
		try {
			const remote = await pullLibrary();
			if (!remote || get().active !== userId) {
				set({ syncStatus: "synced" });
				return;
			}
			const merged = mergeLibraries(get().library, remote);
			const changed = JSON.stringify(merged) !== JSON.stringify(get().library);
			set({
				library: merged,
				baseUpdatedAt: remote.updatedAt,
				syncStatus: changed ? "syncing" : "synced"
			});
			await persist(merged, userId);
			if (changed) schedulePush();
			else set({ syncStatus: "synced" });
		} catch {
			set({
				syncStatus: "error",
				syncError: "Couldn't reach your account. Showing this device's copy."
			});
		}
	}
	return {
		ready: true,
		active: GUEST,
		syncUsers: [],
		syncStatus: "local",
		syncError: null,
		baseUpdatedAt: STARTER.updatedAt,
		library: STARTER,
		captureOpen: false,
		paletteOpen: false,
		setCaptureOpen: (captureOpen) => set({ captureOpen }),
		setPaletteOpen: (paletteOpen) => set({ paletteOpen }),
		init: () => {
			if (bootPromise) return bootPromise;
			bootPromise = (async () => {
				const meta = await loadMeta();
				const saved = await loadLibrary(meta.active);
				if (saved) {
					const current = get().library;
					const library = current.updatedAt === STARTER.updatedAt ? saved : mergeLibraries(saved, current);
					if (!meta.initialized) {
						meta.initialized = true;
						await saveMeta(meta);
					}
					set({
						ready: true,
						active: meta.active,
						syncUsers: meta.syncUsers,
						library,
						syncStatus: meta.syncUsers.includes(meta.active) ? "synced" : "local",
						baseUpdatedAt: library.updatedAt
					});
					await saveLibrary(meta.active, library);
					return;
				}
				const library = claimToday(get().library, dayStamp());
				meta.initialized = true;
				meta.active = meta.active || "guest";
				await saveMeta(meta);
				await saveLibrary(meta.active, library);
				set({
					ready: true,
					active: meta.active,
					syncUsers: meta.syncUsers,
					library,
					syncStatus: "local",
					baseUpdatedAt: library.updatedAt
				});
			})();
			return bootPromise;
		},
		onSession: async (userId) => {
			await get().init();
			if (!userId) {
				if (get().active === "guest") return;
				const guest = await loadLibrary("guest") ?? seedLibrary();
				const meta = await loadMeta();
				meta.active = GUEST;
				await saveMeta(meta);
				set({
					active: GUEST,
					library: guest,
					syncStatus: "local",
					syncError: null,
					baseUpdatedAt: guest.updatedAt,
					syncUsers: meta.syncUsers
				});
				return;
			}
			const meta = await loadMeta();
			if (!meta.syncUsers.includes(userId)) return;
			if (get().active !== userId) {
				const cached = await loadLibrary(userId) ?? get().library;
				meta.active = userId;
				await saveMeta(meta);
				set({
					active: userId,
					syncUsers: meta.syncUsers,
					library: cached,
					baseUpdatedAt: cached.updatedAt
				});
			}
			await pullAndMerge(userId);
		},
		enableSync: async (userId) => {
			if (!get().ready) await get().init();
			set({
				syncStatus: "syncing",
				syncError: null
			});
			try {
				const remote = await pullLibrary();
				const local = get().library;
				const stamped = {
					...remote ? mergeLibraries(local, remote) : local,
					updatedAt: nowIso()
				};
				const meta = await loadMeta();
				meta.syncUsers = Array.from(/* @__PURE__ */ new Set([...meta.syncUsers, userId]));
				meta.active = userId;
				await saveMeta(meta);
				await saveLibrary(userId, stamped);
				set({
					library: stamped,
					active: userId,
					syncUsers: meta.syncUsers,
					baseUpdatedAt: remote?.updatedAt ?? null,
					syncStatus: "syncing"
				});
				await flushPush();
			} catch {
				set({
					syncStatus: "error",
					syncError: "Couldn't turn on sync. Your notes are still on this device."
				});
			}
		},
		disableSync: async (userId) => {
			const meta = await loadMeta();
			meta.syncUsers = meta.syncUsers.filter((id) => id !== userId);
			meta.active = GUEST;
			await saveMeta(meta);
			await saveLibrary(userId, get().library);
			const guest = await loadLibrary("guest") ?? emptyLibrary();
			set({
				active: GUEST,
				syncUsers: meta.syncUsers,
				library: guest,
				syncStatus: "local",
				syncError: null,
				baseUpdatedAt: guest.updatedAt
			});
		},
		createObject: (input) => {
			const id = uid();
			const stamp = nowIso();
			const title = input.title.trim() || "Untitled";
			commit((library) => {
				const type = library.types.find((item) => item.id === input.typeId);
				const body = input.body ?? type?.template ?? "";
				const objects = [...library.objects, {
					id,
					typeId: input.typeId,
					title,
					body,
					day: null,
					inbox: input.inbox ?? false,
					archived: false,
					pinned: false,
					deletedAt: null,
					props: {},
					createdAt: stamp,
					updatedAt: stamp
				}];
				let links = reconcileMentions(objects, library.links, id, body, stamp);
				let nextObjects = objects;
				if (input.linkToday) {
					const day = dayStamp();
					const line = `[[${title}]]`;
					const existing = nextObjects.find((object) => object.day === day && !object.deletedAt);
					if (existing) {
						const body = existing.body.trim() ? `${existing.body.trim()}\n${line}` : line;
						nextObjects = nextObjects.map((object) => object.id === existing.id ? {
							...object,
							body,
							updatedAt: stamp
						} : object);
						links = reconcileMentions(nextObjects, links, existing.id, body, stamp);
					} else {
						const dailyId = uid();
						const body = line;
						nextObjects = [...nextObjects, {
							id: dailyId,
							typeId: "type_daily",
							title: prettyDay(day),
							body,
							day,
							inbox: false,
							archived: false,
							deletedAt: null,
							props: {},
							createdAt: stamp,
							updatedAt: stamp
						}];
						links = reconcileMentions(nextObjects, links, dailyId, body, stamp);
					}
				}
				return {
					...library,
					objects: nextObjects,
					links
				};
			});
			return id;
		},
		updateObject: (id, patch) => {
			commit((library) => {
				const current = library.objects.find((object) => object.id === id);
				if (!current || current.deletedAt) return library;
				const stamp = nowIso();
				let objects = library.objects.map((object) => object.id === id ? {
					...object,
					...patch,
					updatedAt: stamp
				} : object);
				let links = library.links;
				if (patch.title && patch.title !== current.title) {
					if (!library.objects.some((object) => object.id !== id && !object.deletedAt && object.title.toLowerCase() === current.title.toLowerCase())) {
						objects = objects.map((object) => object.id === id ? object : {
							...object,
							body: rewriteTitle(object.body, current.title, patch.title ?? current.title)
						});
						objects = objects.map((object) => {
							if (object.body === library.objects.find((item) => item.id === object.id)?.body) return object;
							return {
								...object,
								updatedAt: stamp
							};
						});
						for (const object of objects) {
							if (object.deletedAt) continue;
							const previous = library.objects.find((item) => item.id === object.id);
							if (previous && previous.body !== object.body) links = reconcileMentions(objects, links, object.id, object.body, stamp);
						}
					}
				}
				if (typeof patch.body === "string") links = reconcileMentions(objects, links, id, patch.body, stamp);
				return {
					...library,
					objects,
					links
				};
			});
		},
		setProp: (id, key, value) => {
			commit((library) => ({
				...library,
				objects: library.objects.map((object) => object.id === id ? {
					...object,
					props: {
						...object.props,
						[key]: value
					},
					updatedAt: nowIso()
				} : object)
			}));
		},
		deleteObject: (id) => {
			const stamp = nowIso();
			commit((library) => ({
				...library,
				objects: library.objects.map((object) => object.id === id ? {
					...object,
					deletedAt: stamp,
					updatedAt: stamp
				} : object),
				links: library.links.map((link) => link.fromId === id || link.toId === id ? {
					...link,
					deletedAt: stamp,
					updatedAt: stamp
				} : link)
			}));
		},
		connect: (fromId, toId) => {
			if (fromId === toId) return;
			const stamp = nowIso();
			const id = `relation:${fromId}:${toId}`;
			commit((library) => {
				const links = library.links.find((link) => link.id === id) ? library.links.map((link) => link.id === id ? {
					...link,
					deletedAt: null,
					updatedAt: stamp,
					kind: "relation"
				} : link) : [...library.links, {
					id,
					fromId,
					toId,
					kind: "relation",
					context: null,
					createdAt: stamp,
					updatedAt: stamp,
					deletedAt: null
				}];
				return {
					...library,
					links
				};
			});
		},
		disconnect: (linkId) => {
			const stamp = nowIso();
			commit((library) => ({
				...library,
				links: library.links.map((link) => link.id === linkId ? {
					...link,
					deletedAt: stamp,
					updatedAt: stamp
				} : link)
			}));
		},
		ensureDaily: (day) => {
			const existing = get().library.objects.find((object) => object.day === day && !object.deletedAt);
			if (existing) return existing.id;
			const id = uid();
			const stamp = nowIso();
			commit((library) => {
				if (library.objects.some((object) => object.day === day && !object.deletedAt)) return library;
				return {
					...library,
					objects: [...library.objects, {
						id,
						typeId: "type_daily",
						title: prettyDay(day),
						body: "",
						day,
						inbox: false,
						archived: false,
						deletedAt: null,
						props: {},
						createdAt: stamp,
						updatedAt: stamp
					}]
				};
			});
			return get().library.objects.find((object) => object.day === day && !object.deletedAt)?.id ?? id;
		},
		createType: (input) => {
			const id = uid();
			const stamp = nowIso();
			const name = input.name.trim();
			const type = {
				id,
				key: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "type",
				name,
				plural: name.endsWith("s") ? name : `${name}s`,
				icon: input.icon,
				color: input.color,
				isSystem: false,
				properties: [],
				updatedAt: stamp
			};
			commit((library) => ({
				...library,
				types: [...library.types, type]
			}));
			return id;
		},
		addProperty: (typeId, property) => {
			const prop = {
				id: uid(),
				name: property.name.trim(),
				kind: property.kind,
				options: property.options?.map((option) => option.trim()).filter(Boolean)
			};
			if (!prop.name) return;
			const stamp = nowIso();
			commit((library) => ({
				...library,
				types: library.types.map((type) => type.id === typeId ? {
					...type,
					properties: [...type.properties, prop],
					updatedAt: stamp
				} : type)
			}));
		},
		setTemplate: (typeId, template) => {
			const stamp = nowIso();
			commit((library) => ({
				...library,
				types: library.types.map((type) => type.id === typeId ? {
					...type,
					template,
					updatedAt: stamp
				} : type)
			}));
		},
		importLibrary: (raw, mode) => {
			const incoming = normalizeLibrary(raw);
			if (!incoming) return;
			commit((library) => mode === "replace" ? mergeLibraries(emptyLibrary(), incoming) : mergeLibraries(library, incoming));
		}
	};
});
function visibleObjects(library) {
	return library.objects.filter((object) => !object.deletedAt && !object.archived);
}
function typeById(library, id) {
	return library.types.find((type) => type.id === id) ?? systemTypes().find((type) => type.id === id);
}
function liveLinks(library) {
	return library.links.filter((link) => !link.deletedAt);
}
function CommandPalette() {
	const open = useBodhi((state) => state.paletteOpen);
	const setOpen = useBodhi((state) => state.setPaletteOpen);
	const library = useBodhi((state) => state.library);
	const setCapture = useBodhi((state) => state.setCaptureOpen);
	const navigate = useNavigate();
	const [query, setQuery] = (0, import_react.useState)("");
	const objects = (0, import_react.useMemo)(() => {
		const needle = query.trim().toLowerCase();
		return visibleObjects(library).filter((object) => object.typeId !== "type_daily").filter((object) => !needle || object.title.toLowerCase().includes(needle) || object.body.toLowerCase().includes(needle)).slice(0, 12);
	}, [library, query]);
	function go(to) {
		setOpen(false);
		navigate({ to });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (next) => {
			setOpen(next);
			if (!next) setQuery("");
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-40 bg-ink/30" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "capture-panel z-50 overflow-hidden rounded-3xl border border-line bg-paper p-2 shadow-panel outline-none",
			"aria-describedby": void 0,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "sr-only",
					children: "Search Bodhi"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "sr-only",
					children: "Jump to a page or an object."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e, {
					label: "Search",
					shouldFilter: false,
					className: "flex flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Input, {
						autoFocus: true,
						value: query,
						onValueChange: setQuery,
						placeholder: "Search objects, or jump",
						className: "w-full bg-transparent px-3 py-3 text-base text-ink outline-none placeholder:text-ink-faint"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.List, {
						className: "max-h-80 overflow-y-auto border-t border-line",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Group, {
							heading: "Go",
							className: "px-2 py-2 text-xs text-ink-soft",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaletteItem, {
									onSelect: () => go("/"),
									children: "Today"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaletteItem, {
									onSelect: () => go("/graph"),
									children: "Graph"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaletteItem, {
									onSelect: () => go("/ask"),
									children: "Ask notes"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaletteItem, {
									onSelect: () => go("/objects"),
									children: "All objects"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaletteItem, {
									onSelect: () => go("/login"),
									children: "Account"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaletteItem, {
									onSelect: () => {
										setOpen(false);
										setCapture(true);
									},
									children: "Quick capture"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Group, {
							heading: "Objects",
							className: "px-2 py-2 text-xs text-ink-soft",
							children: [objects.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "px-2 py-3 text-sm text-ink-soft",
								children: "No objects match."
							}), objects.map((object) => {
								const type = typeById(library, object.typeId);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PaletteItem, {
									onSelect: () => {
										setOpen(false);
										navigate({
											to: "/o/$objectId",
											params: { objectId: object.id }
										});
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: object.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-ink-faint",
										children: type?.name
									})]
								}, object.id);
							})]
						})]
					})]
				})
			]
		})] })
	});
}
function PaletteItem({ children, onSelect }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Item, {
		onSelect,
		className: "flex cursor-pointer items-center justify-between gap-3 rounded-xl px-2 py-2 text-sm text-ink data-[selected=true]:bg-paper-2",
		children
	});
}
var ICONS = {
	calendar: CalendarDays,
	file: FileText,
	user: UserRound,
	folder: FolderKanban,
	book: BookOpen,
	bulb: Lightbulb,
	users: Users,
	check: CircleCheck,
	hash: Hash,
	box: Box
};
function TypeIcon({ name, className }) {
	const Icon = ICONS[name] ?? Box;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
		className,
		strokeWidth: 1.75,
		"aria-hidden": "true"
	});
}
var TYPE_DOT = {
	sage: "bg-type-sage",
	sea: "bg-type-sea",
	wine: "bg-type-wine",
	stone: "bg-type-stone",
	moss: "bg-type-moss",
	bark: "bg-type-bark"
};
var ICON_CHOICES = [
	{
		id: "file",
		label: "Note"
	},
	{
		id: "user",
		label: "Person"
	},
	{
		id: "folder",
		label: "Project"
	},
	{
		id: "book",
		label: "Book"
	},
	{
		id: "bulb",
		label: "Idea"
	},
	{
		id: "calendar",
		label: "Date"
	},
	{
		id: "check",
		label: "Task"
	},
	{
		id: "hash",
		label: "Tag"
	},
	{
		id: "box",
		label: "Object"
	}
];
var CHOICES = [
	TYPE_IDS.note,
	TYPE_IDS.idea,
	TYPE_IDS.task,
	TYPE_IDS.person,
	TYPE_IDS.project,
	TYPE_IDS.meeting,
	TYPE_IDS.book
];
function QuickCapture() {
	const open = useBodhi((state) => state.captureOpen);
	const setOpen = useBodhi((state) => state.setCaptureOpen);
	const types = useBodhi((state) => state.library.types);
	const createObject = useBodhi((state) => state.createObject);
	const navigate = useNavigate();
	const [title, setTitle] = (0, import_react.useState)("");
	const [typeId, setTypeId] = (0, import_react.useState)(TYPE_IDS.note);
	const [onToday, setOnToday] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setTitle("");
		setTypeId(TYPE_IDS.note);
		setOnToday(true);
	}, [open]);
	function save(stay = false) {
		const trimmed = title.trim();
		if (!trimmed) return;
		const id = createObject({
			title: trimmed,
			typeId,
			inbox: typeId === TYPE_IDS.note,
			linkToday: onToday
		});
		if (stay) {
			setTitle("");
			return;
		}
		setOpen(false);
		navigate({
			to: "/o/$objectId",
			params: { objectId: id }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-40 bg-ink/30" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "capture-panel z-50 rounded-3xl border border-line bg-paper p-4 shadow-panel outline-none",
			"aria-describedby": void 0,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "font-serif text-xl text-ink",
					children: "Quick capture"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "mt-1 text-sm text-ink-soft",
					children: "A title is enough. You can file it later."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					autoFocus: true,
					value: title,
					onChange: (event) => setTitle(event.target.value),
					onKeyDown: (event) => {
						if (event.key === "Enter") {
							event.preventDefault();
							save(event.shiftKey);
						}
					},
					placeholder: "What's on your mind?",
					className: "mt-4 w-full rounded-xl border border-line bg-paper-2 px-3 py-3 text-base text-ink outline-none placeholder:text-ink-faint focus-visible:border-accent"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex gap-2 overflow-x-auto pb-1",
					children: CHOICES.map((id) => {
						const type = types.find((item) => item.id === id);
						if (!type) return null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setTypeId(id),
							className: typeId === id ? "inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-3 py-2 text-sm text-accent-fg" : "inline-flex shrink-0 items-center gap-2 rounded-full border border-line px-3 py-2 text-sm text-ink",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TypeIcon, {
								name: type.icon,
								className: "size-4"
							}), type.name]
						}, id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-3 flex items-center gap-2 text-sm text-ink-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: onToday,
						onChange: (event) => setOnToday(event.target.checked),
						className: "size-4 accent-accent"
					}), "Also on today"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-sm text-ink-soft",
						onClick: () => setOpen(false),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: !title.trim(),
						onClick: () => save(false),
						className: "rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-fg disabled:opacity-40",
						children: "Save"
					})]
				})
			]
		})] })
	});
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var THEME_KEY = "bodhi-theme";
function applyTheme(mode) {
	document.documentElement.classList.toggle("dark", mode === "dark");
	localStorage.setItem(THEME_KEY, mode);
}
function currentTheme() {
	if (typeof document === "undefined") return "light";
	return document.documentElement.classList.contains("dark") ? "dark" : "light";
}
function AppShell() {
	const init = useBodhi((state) => state.init);
	const onSession = useBodhi((state) => state.onSession);
	const ready = useBodhi((state) => state.ready);
	const library = useBodhi((state) => state.library);
	const setCapture = useBodhi((state) => state.setCaptureOpen);
	const setPalette = useBodhi((state) => state.setPaletteOpen);
	const syncStatus = useBodhi((state) => state.syncStatus);
	const active = useBodhi((state) => state.active);
	const { user, isPending } = useCurrentUserState();
	const [mounted, setMounted] = (0, import_react.useState)(false);
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	(0, import_react.useEffect)(() => {
		setMounted(true);
	}, []);
	(0, import_react.useEffect)(() => {
		init();
	}, [init]);
	(0, import_react.useEffect)(() => {
		if (!ready || isPending) return;
		onSession(user?.id ?? null);
	}, [
		ready,
		isPending,
		user?.id,
		onSession
	]);
	(0, import_react.useEffect)(() => {
		if (!ready || !user?.id) return;
		const tick = () => {
			const state = useBodhi.getState();
			if (state.syncUsers.includes(user.id)) state.onSession(user.id);
		};
		window.addEventListener("focus", tick);
		const id = window.setInterval(tick, 3e4);
		return () => {
			window.removeEventListener("focus", tick);
			window.clearInterval(id);
		};
	}, [ready, user?.id]);
	(0, import_react.useEffect)(() => {
		function onKey(event) {
			const meta = event.metaKey || event.ctrlKey;
			const target = event.target;
			const typing = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.tagName === "SELECT" || !!target?.isContentEditable;
			if (meta && event.key.toLowerCase() === "k") {
				event.preventDefault();
				setPalette(true);
			} else if (meta && event.key.toLowerCase() === "j") {
				event.preventDefault();
				setCapture(true);
			} else if (!typing && !meta && event.key.toLowerCase() === "c") {
				event.preventDefault();
				setCapture(true);
			}
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [setCapture, setPalette]);
	const inbox = visibleObjects(library).filter((object) => object.inbox).length;
	const pins = visibleObjects(library).filter((object) => object.pinned).slice(0, 6);
	const types = library.types.filter((type) => type.id !== TYPE_IDS.daily);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh bg-paper text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "hidden w-60 shrink-0 flex-col border-r border-line bg-paper-2 md:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-4 py-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "font-serif text-2xl tracking-tight",
							children: "Bodhi"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-ink-soft",
							children: "A calm home for everything you know."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "flex flex-1 flex-col gap-1 overflow-y-auto px-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NavLink, {
								to: "/",
								active: pathname === "/",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TypeIcon, {
									name: "calendar",
									className: "size-4"
								}), "Today"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NavLink, {
								to: "/objects",
								search: { type: "inbox" },
								active: false,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TypeIcon, {
										name: "box",
										className: "size-4"
									}),
									"Inbox",
									inbox > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-auto text-xs tabular-nums text-ink-soft",
										children: inbox
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NavLink, {
								to: "/objects",
								search: { type: "task" },
								active: false,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TypeIcon, {
									name: "check",
									className: "size-4"
								}), "Open tasks"]
							}),
							pins.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 px-2 text-xs font-medium tracking-wide text-ink-faint",
								children: "Pinned"
							}),
							pins.map((object) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/o/$objectId",
								params: { objectId: object.id },
								className: "truncate rounded-xl px-2 py-2 text-sm text-ink-soft hover:bg-paper hover:text-ink",
								children: object.title
							}, object.id)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 px-2 text-xs font-medium tracking-wide text-ink-faint",
								children: "Types"
							}),
							types.map((type) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NavLink, {
								to: "/objects",
								search: { type: type.key },
								active: false,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-2 rounded-full", TYPE_DOT[type.color]) }), type.plural]
							}, type.id)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NavLink, {
								to: "/graph",
								active: pathname === "/graph",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Waypoints, { className: "size-4" }), "Graph"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NavLink, {
								to: "/ask",
								active: pathname === "/ask",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-4" }), "Ask notes"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 border-t border-line p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setCapture(true),
							className: "flex w-full items-center justify-center gap-2 rounded-full bg-accent px-3 py-2 text-sm font-medium text-accent-fg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Capture"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2 px-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								className: "min-w-0 truncate text-sm text-ink-soft",
								children: !mounted || isPending ? "Account" : user ? syncStatus === "local" || active === "guest" ? "On this device" : "Synced" : "Use without account"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"aria-label": "Toggle color theme",
								onClick: () => applyTheme(currentTheme() === "dark" ? "light" : "dark"),
								className: "grid size-9 place-items-center rounded-full text-ink-soft hover:bg-paper",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-4 dark:hidden" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "hidden size-4 dark:block" })]
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-center justify-between gap-3 border-b border-line px-4 py-3 md:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "font-serif text-xl",
						children: "Bodhi"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "Search",
							onClick: () => setPalette(true),
							className: "grid size-11 place-items-center rounded-full text-ink",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"aria-label": "Toggle color theme",
							onClick: () => applyTheme(currentTheme() === "dark" ? "light" : "dark"),
							className: "grid size-11 place-items-center rounded-full text-ink",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-5 dark:hidden" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "hidden size-5 dark:block" })]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "pb-nav flex-1 overflow-y-auto md:pb-20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper md:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pb-safe grid grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tab, {
							to: "/",
							label: "Today",
							active: pathname === "/",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TypeIcon, {
								name: "calendar",
								className: "size-5"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tab, {
							to: "/objects",
							label: "Objects",
							active: pathname.startsWith("/objects") || pathname.startsWith("/o/"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TypeIcon, {
								name: "box",
								className: "size-5"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tab, {
							to: "/graph",
							label: "Graph",
							active: pathname === "/graph",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Waypoints, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tab, {
							to: "/search",
							label: "Search",
							active: pathname === "/search",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-5" })
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Quick capture",
				onClick: () => setCapture(true),
				className: "fixed right-4 z-30 grid size-14 place-items-center rounded-full bg-accent text-accent-fg shadow-panel md:hidden bottom-fab",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-6" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickCapture, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandPalette, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setPalette(true),
				className: "fixed bottom-5 right-5 hidden items-center gap-2 rounded-full border border-line bg-paper-2 px-3 py-2 text-sm text-ink-soft shadow-panel md:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4" }),
					"Search",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-md bg-paper px-1.5 py-0.5 text-xs text-ink-faint",
						children: "Ctrl K"
					})
				]
			})
		]
	});
}
function NavLink({ to, search, active, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to,
		search,
		className: cn("flex items-center gap-2 rounded-xl px-2 py-2 text-sm", active ? "bg-paper text-ink" : "text-ink-soft hover:bg-paper hover:text-ink"),
		children
	});
}
function Tab({ to, label, active, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: cn("flex min-h-14 flex-col items-center justify-center gap-1 text-xs", active ? "text-ink" : "text-ink-soft"),
		children: [children, label]
	});
}
var styles_default = "/assets/styles-D5zXMIMV.css";
var themeScript = `try{var t=localStorage.getItem("bodhi-theme");var d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);if(d)document.documentElement.classList.add("dark")}catch(e){}`;
var Route$8 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Bodhi" },
			{
				name: "description",
				content: "A calm home for everything you know."
			},
			{
				name: "theme-color",
				content: "#f4f1ea"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Outfit:wght@400;500;600&display=swap"
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: themeScript } }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$6 = () => import("./routes-1Xrs4PwG.mjs");
var Route$7 = createFileRoute("/")({
	validateSearch: (search) => {
		const day = typeof search.day === "string" ? search.day : void 0;
		return { day: isDay(day) ? day : void 0 };
	},
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./ask-BrQVo3Jd.mjs");
var Route$6 = createFileRoute("/ask")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./graph-CGT4EP_s.mjs");
var Route$5 = createFileRoute("/graph")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./login-hikbsRmT.mjs");
var Route$4 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./objects-Dv1xuPR6.mjs");
var Route$3 = createFileRoute("/objects")({
	validateSearch: (search) => ({ type: typeof search.type === "string" ? search.type : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./search-DLPeMIpH.mjs");
var Route$2 = createFileRoute("/search")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./o._objectId-CdTF5Cvn.mjs");
var Route$1 = createFileRoute("/o/$objectId")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var Route = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var rootRouteChildren = {
	IndexRoute: Route$7.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$8
	}),
	AskRoute: Route$6.update({
		id: "/ask",
		path: "/ask",
		getParentRoute: () => Route$8
	}),
	GraphRoute: Route$5.update({
		id: "/graph",
		path: "/graph",
		getParentRoute: () => Route$8
	}),
	LoginRoute: Route$4.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => Route$8
	}),
	ObjectsRoute: Route$3.update({
		id: "/objects",
		path: "/objects",
		getParentRoute: () => Route$8
	}),
	SearchRoute: Route$2.update({
		id: "/search",
		path: "/search",
		getParentRoute: () => Route$8
	}),
	OObjectIdRoute: Route$1.update({
		id: "/o/$objectId",
		path: "/o/$objectId",
		getParentRoute: () => Route$8
	}),
	ApiAuthSplatRoute: Route.update({
		id: "/api/auth/$",
		path: "/api/auth/$",
		getParentRoute: () => Route$8
	})
};
var routeTree = Route$8._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		rewrite: previewPathRewrite(),
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { cn as a, TypeIcon as c, useBodhi as d, visibleObjects as f, useCurrentUserState as g, useCurrentUser as h, Route$7 as i, liveLinks as l, unlinkedMentions as m, Route$1 as n, ICON_CHOICES as o, createSsrRpc as p, Route$3 as r, TYPE_DOT as s, router_exports as t, typeById as u };
