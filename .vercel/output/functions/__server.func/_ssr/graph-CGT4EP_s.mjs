import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as TYPE_IDS } from "./merge-ntzy-eJJ.mjs";
import { a as cn, d as useBodhi, f as visibleObjects, l as liveLinks, u as typeById } from "./router-Bg5G7pac.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/graph-CGT4EP_s.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COLORS = {
	sage: "#3f6b56",
	sea: "#3d5e73",
	wine: "#7a4552",
	stone: "#6b645c",
	moss: "#4e6840",
	bark: "#6a5344"
};
function GraphView() {
	const library = useBodhi((state) => state.library);
	const navigate = useNavigate();
	const canvasRef = (0, import_react.useRef)(null);
	const wrapRef = (0, import_react.useRef)(null);
	const [hidden, setHidden] = (0, import_react.useState)({});
	const nodesRef = (0, import_react.useRef)([]);
	const dragRef = (0, import_react.useRef)(null);
	const movedRef = (0, import_react.useRef)(false);
	const types = library.types.filter((type) => type.id !== TYPE_IDS.daily);
	const hiddenKey = JSON.stringify(hidden);
	const model = (0, import_react.useMemo)(() => {
		const objects = visibleObjects(library).filter((object) => {
			const type = typeById(library, object.typeId);
			if (!type || type.id === TYPE_IDS.daily) return false;
			return !hidden[type.id];
		});
		const ids = new Set(objects.map((object) => object.id));
		return {
			objects,
			edges: liveLinks(library).filter((link) => ids.has(link.fromId) && ids.has(link.toId))
		};
	}, [
		library,
		hiddenKey,
		hidden
	]);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		const wrap = wrapRef.current;
		if (!canvas || !wrap) return;
		const context = canvas.getContext("2d");
		if (!context) return;
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const previous = new Map(nodesRef.current.map((node) => [node.id, node]));
		nodesRef.current = model.objects.map((object, index) => {
			const old = previous.get(object.id);
			const angle = index / Math.max(model.objects.length, 1) * Math.PI * 2;
			const type = typeById(library, object.typeId);
			return {
				id: object.id,
				title: object.title,
				color: COLORS[type?.color ?? "stone"] ?? COLORS.stone,
				x: old?.x ?? Math.cos(angle),
				y: old?.y ?? Math.sin(angle),
				vx: old?.vx ?? 0,
				vy: old?.vy ?? 0
			};
		});
		let frame = 0;
		let running = true;
		function resize() {
			const rect = wrap.getBoundingClientRect();
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = Math.max(1, Math.floor(rect.width * dpr));
			canvas.height = Math.max(1, Math.floor(rect.height * dpr));
			canvas.style.width = `${rect.width}px`;
			canvas.style.height = `${rect.height}px`;
		}
		resize();
		const observer = new ResizeObserver(resize);
		observer.observe(wrap);
		function step() {
			if (!running) return;
			const rect = wrap.getBoundingClientRect();
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			const width = rect.width;
			const height = rect.height;
			const nodes = nodesRef.current;
			const cx = width / 2;
			const cy = height / 2;
			const scale = Math.min(width, height) * .34;
			if (!dragRef.current && !reduced) {
				for (let i = 0; i < nodes.length; i += 1) for (let j = i + 1; j < nodes.length; j += 1) {
					const a = nodes[i];
					const b = nodes[j];
					let dx = a.x - b.x;
					let dy = a.y - b.y;
					let dist = Math.hypot(dx, dy) || .001;
					const force = .012 / dist;
					dx /= dist;
					dy /= dist;
					a.vx += dx * force;
					a.vy += dy * force;
					b.vx -= dx * force;
					b.vy -= dy * force;
				}
				for (const edge of model.edges) {
					const a = nodes.find((node) => node.id === edge.fromId);
					const b = nodes.find((node) => node.id === edge.toId);
					if (!a || !b) continue;
					const dx = b.x - a.x;
					const dy = b.y - a.y;
					a.vx += dx * .012;
					a.vy += dy * .012;
					b.vx -= dx * .012;
					b.vy -= dy * .012;
				}
				for (const node of nodes) {
					if (dragRef.current === node.id) continue;
					node.vx += -node.x * .01;
					node.vy += -node.y * .01;
					node.vx *= .86;
					node.vy *= .86;
					node.x += node.vx;
					node.y += node.vy;
				}
			}
			context.setTransform(dpr, 0, 0, dpr, 0, 0);
			context.clearRect(0, 0, width, height);
			const ink = getComputedStyle(document.documentElement).getPropertyValue("--ink").trim() || "#1c1916";
			context.strokeStyle = ink;
			context.globalAlpha = .18;
			context.lineWidth = 1;
			for (const edge of model.edges) {
				const a = nodes.find((node) => node.id === edge.fromId);
				const b = nodes.find((node) => node.id === edge.toId);
				if (!a || !b) continue;
				context.beginPath();
				context.moveTo(cx + a.x * scale, cy + a.y * scale);
				context.lineTo(cx + b.x * scale, cy + b.y * scale);
				context.stroke();
			}
			context.globalAlpha = 1;
			context.font = "13px Outfit, sans-serif";
			context.textAlign = "center";
			context.fillStyle = ink;
			for (const node of nodes) {
				const x = cx + node.x * scale;
				const y = cy + node.y * scale;
				context.beginPath();
				context.fillStyle = node.color;
				context.arc(x, y, 7, 0, Math.PI * 2);
				context.fill();
				context.fillStyle = ink;
				const label = node.title.length > 22 ? `${node.title.slice(0, 21)}…` : node.title;
				context.fillText(label, x, y + 20);
			}
			frame = requestAnimationFrame(step);
		}
		frame = requestAnimationFrame(step);
		function pointOf(event) {
			const rect = canvas.getBoundingClientRect();
			const width = rect.width;
			const height = rect.height;
			const scale = Math.min(width, height) * .34;
			return {
				x: (event.clientX - rect.left - width / 2) / scale,
				y: (event.clientY - rect.top - height / 2) / scale
			};
		}
		function onPointerDown(event) {
			const point = pointOf(event);
			const hit = nodesRef.current.find((node) => Math.hypot(node.x - point.x, node.y - point.y) < .16);
			if (!hit) return;
			dragRef.current = hit.id;
			movedRef.current = false;
			canvas.setPointerCapture(event.pointerId);
		}
		function onPointerMove(event) {
			if (!dragRef.current) return;
			const point = pointOf(event);
			const node = nodesRef.current.find((item) => item.id === dragRef.current);
			if (!node) return;
			if (Math.hypot(node.x - point.x, node.y - point.y) > .03) movedRef.current = true;
			node.x = point.x;
			node.y = point.y;
			node.vx = 0;
			node.vy = 0;
		}
		function onPointerUp() {
			if (!dragRef.current) return;
			const id = dragRef.current;
			const moved = movedRef.current;
			dragRef.current = null;
			if (!moved) navigate({
				to: "/o/$objectId",
				params: { objectId: id }
			});
		}
		canvas.addEventListener("pointerdown", onPointerDown);
		canvas.addEventListener("pointermove", onPointerMove);
		canvas.addEventListener("pointerup", onPointerUp);
		return () => {
			running = false;
			cancelAnimationFrame(frame);
			observer.disconnect();
			canvas.removeEventListener("pointerdown", onPointerDown);
			canvas.removeEventListener("pointermove", onPointerMove);
			canvas.removeEventListener("pointerup", onPointerUp);
		};
	}, [
		model,
		library,
		navigate
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "graph-page flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-end justify-between gap-3 px-5 py-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-3xl tracking-tight",
					children: "Graph"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-ink-soft",
					children: "Drag a dot. Click it to open."
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2 overflow-x-auto px-5 pb-3",
				children: types.map((type) => {
					const off = hidden[type.id];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setHidden((current) => ({
							...current,
							[type.id]: !current[type.id]
						})),
						className: cn("shrink-0 rounded-full border px-3 py-2 text-sm", off ? "border-line text-ink-faint" : "border-line bg-paper-2 text-ink"),
						children: type.plural
					}, type.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: wrapRef,
				className: "graph-stage relative min-h-80 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
					ref: canvasRef,
					className: "absolute inset-0 touch-none"
				}), model.objects.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "absolute inset-0 grid place-items-center px-6 text-center text-sm text-ink-soft",
					children: "Nothing to draw yet. Capture an object, then link it with [[brackets]]."
				})]
			})
		]
	});
}
function GraphPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraphView, {});
}
//#endregion
export { GraphPage as component };
