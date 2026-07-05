import { motion } from "motion/react";

/* A bespoke animated systems diagram: data sources flow into the
   InfoMetrix engine and out to decision-ready outputs, with pulses
   travelling along the connectors (SMIL animateMotion). Designed for the
   dark Visualization section, so the palette is fixed dark. Pulses are
   hidden under prefers-reduced-motion via the .flow-pulse CSS rule. */

const SOURCES = ["QuickBooks", "Bank Feeds", "Payroll", "CRM / Ops"];
const OUTPUTS = ["Live Dashboards", "Cash Forecasts", "Board Reports", "Smart Alerts"];

const W = 800;
const H = 440;
const NODE_W = 168;
const NODE_H = 54;
const ROW_GAP = 96;
const ROWS_TOP = (H - (NODE_H + ROW_GAP * 3)) / 2;

const CENTER = { x: W / 2 - 95, y: H / 2 - 60, w: 190, h: 120 };

function rowY(i: number) {
  return ROWS_TOP + i * ROW_GAP + NODE_H / 2;
}

function pathFrom(i: number): string {
  const x1 = 16 + NODE_W;
  const y1 = rowY(i);
  const x2 = CENTER.x;
  const y2 = H / 2;
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
}

function pathTo(i: number): string {
  const x1 = CENTER.x + CENTER.w;
  const y1 = H / 2;
  const x2 = W - 16 - NODE_W;
  const y2 = rowY(i);
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
}

export function FlowDiagram() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      role="img"
      aria-label="Diagram: data from QuickBooks, bank feeds, payroll and CRM flows into the InfoMetrix engine and out to live dashboards, cash forecasts, board reports and smart alerts"
      className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-4 sm:p-6 shadow-2xl"
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none" aria-hidden>
        <defs>
          <linearGradient id="engineFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#292524" />
            <stop offset="100%" stopColor="#0C0A09" />
          </linearGradient>
          <filter id="engineGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="0" stdDeviation="14" floodColor="#FBBF24" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Connectors */}
        {SOURCES.map((_, i) => (
          <path key={`in-${i}`} d={pathFrom(i)} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />
        ))}
        {OUTPUTS.map((_, i) => (
          <path key={`out-${i}`} d={pathTo(i)} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />
        ))}

        {/* Travelling pulses */}
        {SOURCES.map((_, i) => (
          <circle key={`pin-${i}`} className="flow-pulse" r="4" fill="#FBBF24">
            <animateMotion dur="2.6s" begin={`${i * 0.65}s`} repeatCount="indefinite" path={pathFrom(i)} />
          </circle>
        ))}
        {OUTPUTS.map((_, i) => (
          <circle key={`pout-${i}`} className="flow-pulse" r="4" fill="#F59E0B">
            <animateMotion dur="2.6s" begin={`${1.3 + i * 0.65}s`} repeatCount="indefinite" path={pathTo(i)} />
          </circle>
        ))}

        {/* Source nodes */}
        {SOURCES.map((label, i) => (
          <g key={label}>
            <rect x="16" y={rowY(i) - NODE_H / 2} width={NODE_W} height={NODE_H} rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" />
            <text x={16 + NODE_W / 2} y={rowY(i) + 5} textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="15" fontWeight="600">
              {label}
            </text>
          </g>
        ))}

        {/* Engine */}
        <g filter="url(#engineGlow)">
          <rect x={CENTER.x} y={CENTER.y} width={CENTER.w} height={CENTER.h} rx="18" fill="url(#engineFill)" stroke="#FBBF24" strokeOpacity="0.55" strokeWidth="1.5" />
        </g>
        <text x={W / 2} y={H / 2 - 16} textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="800">
          InfoMetrix Engine
        </text>
        <text x={W / 2} y={H / 2 + 10} textAnchor="middle" fill="#FBBF24" fontSize="12" fontWeight="600" letterSpacing="2">
          AUTOMATE · RECONCILE
        </text>
        <text x={W / 2} y={H / 2 + 30} textAnchor="middle" fill="#FBBF24" fontSize="12" fontWeight="600" letterSpacing="2">
          MODEL · ALERT
        </text>

        {/* Output nodes */}
        {OUTPUTS.map((label, i) => (
          <g key={label}>
            <rect x={W - 16 - NODE_W} y={rowY(i) - NODE_H / 2} width={NODE_W} height={NODE_H} rx="12" fill="rgba(245,158,11,0.10)" stroke="rgba(245,158,11,0.45)" />
            <text x={W - 16 - NODE_W / 2} y={rowY(i) + 5} textAnchor="middle" fill="rgba(255,255,255,0.92)" fontSize="15" fontWeight="600">
              {label}
            </text>
          </g>
        ))}
      </svg>
    </motion.div>
  );
}
