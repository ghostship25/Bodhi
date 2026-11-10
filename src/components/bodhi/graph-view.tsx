import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { liveLinks, typeById, useBodhi, visibleObjects } from "@/lib/bodhi/store";
import { TYPE_IDS } from "@/lib/bodhi/types";
import { cn } from "@/lib/cn";

type Node = { id: string; title: string; color: string; x: number; y: number; vx: number; vy: number };

const COLORS: Record<string, string> = {
  sage: "#3f6b56",
  sea: "#3d5e73",
  wine: "#7a4552",
  stone: "#6b645c",
  moss: "#4e6840",
  bark: "#6a5344",
};

export function GraphView() {
  const library = useBodhi((state) => state.library);
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [hidden, setHidden] = useState<Record<string, boolean>>({});
  const nodesRef = useRef<Node[]>([]);
  const dragRef = useRef<string | null>(null);
  const movedRef = useRef(false);

  const types = library.types.filter((type) => type.id !== TYPE_IDS.daily);
  const hiddenKey = JSON.stringify(hidden);

  const model = useMemo(() => {
    const objects = visibleObjects(library).filter((object) => {
      const type = typeById(library, object.typeId);
      if (!type || type.id === TYPE_IDS.daily) return false;
      return !hidden[type.id];
    });
    const ids = new Set(objects.map((object) => object.id));
    const edges = liveLinks(library).filter((link) => ids.has(link.fromId) && ids.has(link.toId));
    return { objects, edges };
  }, [library, hiddenKey, hidden]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const previous = new Map(nodesRef.current.map((node) => [node.id, node]));
    nodesRef.current = model.objects.map((object, index) => {
      const old = previous.get(object.id);
      const angle = (index / Math.max(model.objects.length, 1)) * Math.PI * 2;
      const type = typeById(library, object.typeId);
      return {
        id: object.id,
        title: object.title,
        color: COLORS[type?.color ?? "stone"] ?? COLORS.stone,
        x: old?.x ?? Math.cos(angle),
        y: old?.y ?? Math.sin(angle),
        vx: old?.vx ?? 0,
        vy: old?.vy ?? 0,
      };
    });

    let frame = 0;
    let running = true;

    function resize() {
      const rect = wrap!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas!.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas!.style.width = `${rect.width}px`;
      canvas!.style.height = `${rect.height}px`;
    }
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);

    function step() {
      if (!running) return;
      const rect = wrap!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = rect.width;
      const height = rect.height;
      const nodes = nodesRef.current;
      const cx = width / 2;
      const cy = height / 2;
      const scale = Math.min(width, height) * 0.34;

      if (!dragRef.current && !reduced) {
        for (let i = 0; i < nodes.length; i += 1) {
          for (let j = i + 1; j < nodes.length; j += 1) {
            const a = nodes[i]!;
            const b = nodes[j]!;
            let dx = a.x - b.x;
            let dy = a.y - b.y;
            let dist = Math.hypot(dx, dy) || 0.001;
            const force = 0.012 / dist;
            dx /= dist;
            dy /= dist;
            a.vx += dx * force;
            a.vy += dy * force;
            b.vx -= dx * force;
            b.vy -= dy * force;
          }
        }
        for (const edge of model.edges) {
          const a = nodes.find((node) => node.id === edge.fromId);
          const b = nodes.find((node) => node.id === edge.toId);
          if (!a || !b) continue;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          a.vx += dx * 0.012;
          a.vy += dy * 0.012;
          b.vx -= dx * 0.012;
          b.vy -= dy * 0.012;
        }
        for (const node of nodes) {
          if (dragRef.current === node.id) continue;
          node.vx += -node.x * 0.01;
          node.vy += -node.y * 0.01;
          node.vx *= 0.86;
          node.vy *= 0.86;
          node.x += node.vx;
          node.y += node.vy;
        }
      }

      context!.setTransform(dpr, 0, 0, dpr, 0, 0);
      context!.clearRect(0, 0, width, height);
      const ink = getComputedStyle(document.documentElement).getPropertyValue("--ink").trim() || "#1c1916";
      context!.strokeStyle = ink;
      context!.globalAlpha = 0.18;
      context!.lineWidth = 1;
      for (const edge of model.edges) {
        const a = nodes.find((node) => node.id === edge.fromId);
        const b = nodes.find((node) => node.id === edge.toId);
        if (!a || !b) continue;
        context!.beginPath();
        context!.moveTo(cx + a.x * scale, cy + a.y * scale);
        context!.lineTo(cx + b.x * scale, cy + b.y * scale);
        context!.stroke();
      }
      context!.globalAlpha = 1;
      context!.font = "13px Outfit, sans-serif";
      context!.textAlign = "center";
      context!.fillStyle = ink;
      for (const node of nodes) {
        const x = cx + node.x * scale;
        const y = cy + node.y * scale;
        context!.beginPath();
        context!.fillStyle = node.color;
        context!.arc(x, y, 7, 0, Math.PI * 2);
        context!.fill();
        context!.fillStyle = ink;
        const label = node.title.length > 22 ? `${node.title.slice(0, 21)}…` : node.title;
        context!.fillText(label, x, y + 20);
      }
      frame = requestAnimationFrame(step);
    }
    frame = requestAnimationFrame(step);

    function pointOf(event: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const scale = Math.min(width, height) * 0.34;
      return {
        x: (event.clientX - rect.left - width / 2) / scale,
        y: (event.clientY - rect.top - height / 2) / scale,
      };
    }

    function onPointerDown(event: PointerEvent) {
      const point = pointOf(event);
      const hit = nodesRef.current.find((node) => Math.hypot(node.x - point.x, node.y - point.y) < 0.16);
      if (!hit) return;
      dragRef.current = hit.id;
      movedRef.current = false;
      canvas!.setPointerCapture(event.pointerId);
    }
    function onPointerMove(event: PointerEvent) {
      if (!dragRef.current) return;
      const point = pointOf(event);
      const node = nodesRef.current.find((item) => item.id === dragRef.current);
      if (!node) return;
      if (Math.hypot(node.x - point.x, node.y - point.y) > 0.03) movedRef.current = true;
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
      if (!moved) void navigate({ to: "/o/$objectId", params: { objectId: id } });
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
  }, [model, library, navigate]);

  return (
    <div className="graph-page flex flex-col">
      <div className="flex items-end justify-between gap-3 px-5 py-4">
        <div>
          <h1 className="font-serif text-3xl tracking-tight">Graph</h1>
          <p className="mt-1 text-sm text-ink-soft">Drag a dot. Click it to open.</p>
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto px-5 pb-3">
        {types.map((type) => {
          const off = hidden[type.id];
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => setHidden((current) => ({ ...current, [type.id]: !current[type.id] }))}
              className={cn(
                "shrink-0 rounded-full border px-3 py-2 text-sm",
                off ? "border-line text-ink-faint" : "border-line bg-paper-2 text-ink",
              )}
            >
              {type.plural}
            </button>
          );
        })}
      </div>
      <div ref={wrapRef} className="graph-stage relative min-h-80 flex-1">
        <canvas ref={canvasRef} className="absolute inset-0 touch-none" />
        {model.objects.length === 0 && (
          <p className="absolute inset-0 grid place-items-center px-6 text-center text-sm text-ink-soft">
            Nothing to draw yet. Capture an object, then link it with [[brackets]].
          </p>
        )}
      </div>
    </div>
  );
}
