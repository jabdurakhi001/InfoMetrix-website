import { useState } from "react";
import { motion } from "motion/react";
import { Clock, DollarSign, TrendingUp } from "lucide-react";

/* Live ROI estimator: drag two sliders and watch the annual numbers
   recompute instantly. A conversion tool, not decoration — it makes the
   value proposition tangible before the strategy call. The 65% factor is
   a deliberately conservative automation share, labelled as illustrative. */

const AUTOMATION_SHARE = 0.65;

export function ROICalculator() {
  const [hours, setHours] = useState(20);
  const [rate, setRate] = useState(65);

  const hoursSaved = Math.round(hours * AUTOMATION_SHARE * 52);
  const annualSavings = Math.round(hours * 52 * rate * AUTOMATION_SHARE);

  return (
    <div className="grid lg:grid-cols-2 gap-10 items-center">
      {/* Inputs */}
      <div className="space-y-10">
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <label htmlFor="roi-hours" className="font-display font-bold text-text-main">
              Manual finance work per week
            </label>
            <span className="font-display font-extrabold text-2xl text-secondary tabular-nums">
              {hours} hrs
            </span>
          </div>
          <input
            id="roi-hours"
            type="range"
            min={5}
            max={80}
            step={1}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="roi-range w-full"
          />
          <div className="flex justify-between text-xs text-text-muted mt-2">
            <span>5 hrs</span>
            <span>80 hrs</span>
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-3">
            <label htmlFor="roi-rate" className="font-display font-bold text-text-main">
              Blended hourly cost of that work
            </label>
            <span className="font-display font-extrabold text-2xl text-secondary tabular-nums">
              ${rate}/hr
            </span>
          </div>
          <input
            id="roi-rate"
            type="range"
            min={25}
            max={200}
            step={5}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="roi-range w-full"
          />
          <div className="flex justify-between text-xs text-text-muted mt-2">
            <span>$25</span>
            <span>$200</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="bg-primary text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden glow-ring"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 blur-[100px] -mr-32 -mt-32" />
        <div className="relative z-10 space-y-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-tertiary mb-2">
              <DollarSign size={14} /> Estimated annual savings
            </div>
            <div className="text-5xl sm:text-6xl font-display font-black tracking-tight tabular-nums">
              ${annualSavings.toLocaleString("en-US")}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-70 mb-2">
                <Clock size={14} className="text-tertiary" /> Hours back / yr
              </div>
              <div className="text-3xl font-display font-extrabold tabular-nums">
                {hoursSaved.toLocaleString("en-US")}
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-70 mb-2">
                <TrendingUp size={14} className="text-tertiary" /> Workload automated
              </div>
              <div className="text-3xl font-display font-extrabold tabular-nums">
                {Math.round(AUTOMATION_SHARE * 100)}%
              </div>
            </div>
          </div>

          <p className="text-xs text-white/50 leading-relaxed">
            Illustrative estimate based on a conservative automation share of
            repetitive finance work. Your diagnostic will quantify the real number.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
