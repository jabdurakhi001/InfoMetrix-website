import { useState } from "react";
import { motion } from "motion/react";

/* Shop counterpart to the cost-per-mile calculator: owners enter rough
   monthly shop numbers and see effective labor rate, technician
   efficiency, and parts margin. Arithmetic on their own inputs only. */

type Field = { key: string; label: string; min: number; max: number; step: number; value: number; fmt: (n: number) => string };

const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
const hrs = (n: number) => `${n.toLocaleString("en-US")} h`;

const DEFAULTS: Field[] = [
  { key: "rate", label: "Posted labor rate", min: 80, max: 250, step: 5, value: 165, fmt: (n) => `$${n}/h` },
  { key: "billed", label: "Hours billed to customers", min: 50, max: 2000, step: 10, value: 620, fmt: hrs },
  { key: "clocked", label: "Hours techs were paid for", min: 50, max: 2000, step: 10, value: 760, fmt: hrs },
  { key: "partsSold", label: "Parts sold", min: 0, max: 400000, step: 1000, value: 98000, fmt: money },
  { key: "partsCost", label: "What those parts cost you", min: 0, max: 400000, step: 1000, value: 71000, fmt: money },
];

export function ShopMath() {
  const [fields, setFields] = useState(DEFAULTS);
  const v = Object.fromEntries(fields.map((f) => [f.key, f.value])) as Record<string, number>;

  const laborRevenue = v.billed * v.rate;
  const effectiveRate = v.clocked > 0 ? laborRevenue / v.clocked : 0;
  const efficiency = v.clocked > 0 ? v.billed / v.clocked : 0;
  const partsMargin = v.partsSold > 0 ? (v.partsSold - v.partsCost) / v.partsSold : 0;
  const unbilled = Math.max(0, v.clocked - v.billed);
  const leakage = unbilled * v.rate;

  const update = (key: string, value: number) =>
    setFields((fs) => fs.map((f) => (f.key === key ? { ...f, value } : f)));

  const meters = [
    { label: "Tech efficiency", value: `${Math.round(efficiency * 100)}%`, bar: Math.min(1, efficiency), note: "billed ÷ paid hours" },
    { label: "Parts margin", value: `${(partsMargin * 100).toFixed(1)}%`, bar: Math.max(0, Math.min(1, partsMargin)), note: "on parts sold" },
  ];

  return (
    <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20">
      <div>
        <p className="label text-muted mb-6">Your monthly shop numbers</p>
        <div className="space-y-6">
          {fields.map((f) => (
            <div key={f.key}>
              <div className="flex justify-between items-baseline mb-3">
                <label htmlFor={`shop-${f.key}`} className="text-[15px]">{f.label}</label>
                <span className="figures text-[15px]">{f.fmt(f.value)}</span>
              </div>
              <input
                id={`shop-${f.key}`}
                type="range"
                className="ledger-range"
                min={f.min}
                max={f.max}
                step={f.step}
                value={f.value}
                onChange={(e) => update(f.key, Number(e.target.value))}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-sheet border border-rule p-8 sm:p-10 self-start">
        <p className="label text-muted">What an hour actually earns you</p>
        <p className="font-display text-6xl sm:text-7xl mt-4 tracking-tight" aria-live="polite">
          <span className="figures">${effectiveRate.toFixed(0)}</span>
        </p>
        <p className="text-muted mt-2">
          effective labor rate, against a posted <span className="figures">${v.rate}</span>
        </p>

        <div className="mt-8 space-y-5">
          {meters.map((m) => (
            <div key={m.label}>
              <div className="flex justify-between items-baseline text-[14px] mb-2">
                <span>
                  {m.label} <span className="text-muted text-xs">· {m.note}</span>
                </span>
                <span className="figures">{m.value}</span>
              </div>
              <div className="h-2 bg-paper-deep">
                <motion.div
                  className="h-full bg-green"
                  animate={{ width: `${m.bar * 100}%` }}
                  transition={{ type: "spring", stiffness: 260, damping: 30 }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-rule flex justify-between items-baseline gap-4">
          <span className="text-[14px]">
            Paid hours not billed
            <span className="block text-xs text-muted mt-1">{hrs(unbilled)} at your posted rate</span>
          </span>
          <span className="figures text-xl">{money(leakage)}</span>
        </div>

        <p className="text-xs text-muted mt-6 leading-relaxed">
          A quick estimate from the numbers you enter. We track this per tech and per repair order from your
          shop system and your books.
        </p>
      </div>
    </div>
  );
}
