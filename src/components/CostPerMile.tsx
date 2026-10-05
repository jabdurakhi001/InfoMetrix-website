import { useState } from "react";
import { motion } from "motion/react";

/* A plain-language cost-per-mile calculator. Visitors enter rough monthly
   numbers and see what each mile actually costs them, broken down by line.
   Pure arithmetic on their own inputs; no claims about InfoMetrix results. */

type Line = { key: string; label: string; min: number; max: number; step: number; value: number };

const DEFAULTS: Line[] = [
  { key: "fuel", label: "Fuel", min: 0, max: 120000, step: 500, value: 42000 },
  { key: "driver", label: "Driver pay", min: 0, max: 150000, step: 500, value: 55000 },
  { key: "maint", label: "Maintenance & tires", min: 0, max: 50000, step: 250, value: 12000 },
  { key: "ins", label: "Insurance", min: 0, max: 30000, step: 250, value: 8500 },
  { key: "other", label: "Tolls, permits & other", min: 0, max: 20000, step: 250, value: 4000 },
];

const SHADES = ["#10261F", "#1F6B4F", "#3F8F6E", "#7FB39A", "#B9D3C4"];

const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

export function CostPerMile() {
  const [lines, setLines] = useState(DEFAULTS);
  const [miles, setMiles] = useState(70000);

  const total = lines.reduce((s, l) => s + l.value, 0);
  const cpm = miles > 0 ? total / miles : 0;

  const update = (key: string, value: number) =>
    setLines((ls) => ls.map((l) => (l.key === key ? { ...l, value } : l)));

  return (
    <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20">
      {/* Inputs */}
      <div>
        <p className="label text-muted mb-6">Your monthly numbers</p>
        <div className="space-y-6">
          {lines.map((l) => (
            <div key={l.key}>
              <div className="flex justify-between items-baseline mb-3">
                <label htmlFor={`cpm-${l.key}`} className="text-[15px]">{l.label}</label>
                <span className="figures text-[15px]">{money(l.value)}</span>
              </div>
              <input
                id={`cpm-${l.key}`}
                type="range"
                className="ledger-range"
                min={l.min}
                max={l.max}
                step={l.step}
                value={l.value}
                onChange={(e) => update(l.key, Number(e.target.value))}
              />
            </div>
          ))}
          <div className="pt-4 border-t border-rule">
            <div className="flex justify-between items-baseline mb-3">
              <label htmlFor="cpm-miles" className="text-[15px] font-medium">Miles driven this month</label>
              <span className="figures text-[15px]">{miles.toLocaleString("en-US")} mi</span>
            </div>
            <input
              id="cpm-miles"
              type="range"
              className="ledger-range"
              min={5000}
              max={200000}
              step={1000}
              value={miles}
              onChange={(e) => setMiles(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* Result, styled as a printed statement */}
      <div className="bg-sheet border border-rule p-8 sm:p-10 self-start">
        <p className="label text-muted">What each mile costs you</p>
        <p className="font-display text-6xl sm:text-7xl mt-4 tracking-tight" aria-live="polite">
          <span className="figures">${cpm.toFixed(2)}</span>
        </p>
        <p className="text-muted mt-2">per mile, on {money(total)} of monthly cost</p>

        <div className="flex h-3 mt-8 overflow-hidden" aria-hidden>
          {lines.map((l, i) => (
            <motion.div
              key={l.key}
              animate={{ width: total > 0 ? `${(l.value / total) * 100}%` : "0%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              style={{ background: SHADES[i] }}
            />
          ))}
        </div>

        <table className="w-full mt-6 text-[14px]">
          <tbody>
            {lines.map((l, i) => (
              <tr key={l.key} className="border-b border-rule last:border-0">
                <td className="py-2.5 flex items-center gap-2.5">
                  <span className="inline-block w-2.5 h-2.5" style={{ background: SHADES[i] }} aria-hidden />
                  {l.label}
                </td>
                <td className="py-2.5 text-right figures text-muted">
                  {miles > 0 ? `$${(l.value / miles).toFixed(3)}` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-xs text-muted mt-6 leading-relaxed">
          A quick estimate from the numbers you enter. We build this per truck and per job from your real books.
        </p>
      </div>
    </div>
  );
}
