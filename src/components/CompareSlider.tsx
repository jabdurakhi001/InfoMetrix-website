import { useRef, useState, useCallback } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import { X, Check, ChevronsLeftRight } from "lucide-react";

/* An interactive before/after comparison: drag the handle to wipe between
   "Traditional Firms" and "The InfoMetrix Way". Both layers render the
   same row structure so content stays aligned; the top (traditional)
   layer is clipped with clip-path so layout never reflows. Pointer- and
   keyboard-operable (role=slider, arrow keys). */

const ROWS = [
  { bad: "Reactive reporting", good: "Real-time visibility" },
  { bad: "Manual processes", good: "Automated workflows" },
  { bad: "Fragmented systems", good: "Integrated systems" },
  { bad: "Backward-looking books", good: "Forward forecasting" },
  { bad: "Month-old answers", good: "Decisions in minutes" },
];

export function CompareSlider() {
  const ref = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(50);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPct(Math.max(8, Math.min(92, next)));
  }, []);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) updateFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") setPct((p) => Math.max(8, p - 5));
    if (e.key === "ArrowRight") setPct((p) => Math.min(92, p + 5));
  };

  return (
    <div
      ref={ref}
      role="slider"
      aria-label="Compare traditional firms with InfoMetrix"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
      className="relative rounded-2xl overflow-hidden border border-border shadow-ambient select-none cursor-ew-resize focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
      style={{ touchAction: "pan-y" }}
    >
      {/* Base layer: InfoMetrix (revealed on the right) */}
      <div className="bg-primary text-white p-8">
        <p className="font-sans font-bold text-xs uppercase text-tertiary mb-6 tracking-wider text-right">
          The InfoMetrix Way
        </p>
        <ul className="space-y-4 text-sm font-medium">
          {ROWS.map((row) => (
            <li key={row.good} className="flex items-center justify-end gap-3 h-8">
              <span>{row.good}</span>
              <Check size={16} className="text-tertiary shrink-0" />
            </li>
          ))}
        </ul>
      </div>

      {/* Top layer: Traditional (clipped to the left of the handle) */}
      <div
        className="absolute inset-0 bg-surface-container-low text-text-muted p-8"
        style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
        aria-hidden
      >
        <p className="font-sans font-bold text-xs uppercase mb-6 tracking-wider">
          Traditional Firms
        </p>
        <ul className="space-y-4 text-sm font-medium">
          {ROWS.map((row) => (
            <li key={row.bad} className="flex items-center gap-3 h-8">
              <X size={16} className="opacity-60 shrink-0" />
              <span>{row.bad}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Handle */}
      <div
        className="absolute top-0 bottom-0 w-px bg-secondary"
        style={{ left: `${pct}%` }}
        aria-hidden
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-secondary text-white shadow-xl flex items-center justify-center">
          <ChevronsLeftRight size={18} />
        </div>
      </div>

      <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest text-text-muted/70 pointer-events-none">
        Drag to compare
      </p>
    </div>
  );
}
