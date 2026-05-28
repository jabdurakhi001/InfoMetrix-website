import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, TrendingUp, Activity } from "lucide-react";

/* A bespoke, self-animating "live" finance dashboard.
   Replaces a static stock image with motion that reinforces the
   product story: real-time visibility and automation. */
export function LiveDashboard() {
  const reduce = useReducedMotion();

  // Live-ticking headline metric (cash position).
  const [revenue, setRevenue] = useState(842150);
  // Animated bar chart heights (monthly).
  const [bars, setBars] = useState<number[]>([42, 58, 51, 70, 64, 82]);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setRevenue((r) => r + Math.round((Math.random() - 0.35) * 1800));
      setBars((prev) =>
        prev.map((b) => {
          const next = b + (Math.random() - 0.5) * 14;
          return Math.max(28, Math.min(96, next));
        }),
      );
    }, 2200);
    return () => clearInterval(id);
  }, [reduce]);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  // Sparkline path for an "efficiency" trend line.
  const spark = [22, 28, 25, 34, 40, 38, 48, 56, 60];
  const sparkW = 240;
  const sparkH = 60;
  const sparkPath = spark
    .map((v, i) => {
      const x = (i / (spark.length - 1)) * sparkW;
      const y = sparkH - (v / 70) * sparkH;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div className="relative rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden glow-ring">
      {/* Window chrome */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-surface-alt/60">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-400/80" />
          <span className="w-3 h-3 rounded-full bg-amber-400/80" />
          <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary" />
          </span>
          Live
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Headline metric */}
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs text-text-muted mb-1">Cash Position</div>
            <div className="text-3xl font-display font-bold tabular-nums tracking-tight">
              ${revenue.toLocaleString("en-US")}
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium text-emerald-500">
            <TrendingUp size={16} />
            +12.4%
          </div>
        </div>

        {/* Bar chart */}
        <div className="flex items-end justify-between gap-2 h-32 pt-2">
          {bars.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end h-full">
                <div
                  className="live-bar w-full rounded-t-md bg-gradient-to-t from-secondary to-tertiary"
                  style={{ height: `${h}%` }}
                />
              </div>
              <span className="text-[10px] text-text-muted">{months[i]}</span>
            </div>
          ))}
        </div>

        {/* Sparkline + KPI row */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="rounded-xl border border-border p-3">
            <div className="flex items-center gap-1.5 text-[11px] text-text-muted mb-2">
              <Activity size={13} className="text-tertiary" />
              Automation Efficiency
            </div>
            <svg viewBox={`0 0 ${sparkW} ${sparkH}`} className="w-full h-10">
              <defs>
                <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-tertiary)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="var(--color-tertiary)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.path
                d={`${sparkPath} L${sparkW},${sparkH} L0,${sparkH} Z`}
                fill="url(#sparkFill)"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              />
              <motion.path
                d={sparkPath}
                fill="none"
                stroke="var(--color-tertiary)"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
              />
            </svg>
          </div>
          <div className="rounded-xl border border-border p-3 flex flex-col justify-between">
            <div className="text-[11px] text-text-muted mb-1">Reconciled</div>
            <div className="text-2xl font-display font-bold text-secondary tabular-nums">
              100%
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-500">
              <ArrowUpRight size={12} /> Audit-ready
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
