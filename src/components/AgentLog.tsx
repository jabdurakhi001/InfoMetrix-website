import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

/* A rolling activity log showing what InfoMetrix agents do around the
   clock. Entries are illustrative examples, labeled as such on the page. */

type Entry = { time: string; agent: string; action: string };

const FEED: Entry[] = [
  { time: "23:42", agent: "Bookkeeping", action: "Categorized 41 card transactions from today’s fuel stops" },
  { time: "01:15", agent: "Receivables", action: "Sent payment reminder on invoice #2187, 12 days past due" },
  { time: "02:30", agent: "Reconciliation", action: "Matched 128 bank lines to the ledger, 2 flagged for review" },
  { time: "04:05", agent: "Payables", action: "Queued 6 approved vendor bills for Friday’s payment run" },
  { time: "05:50", agent: "Watch", action: "Flagged truck 14: fuel cost per mile up 18% this week" },
  { time: "07:00", agent: "Reporting", action: "Morning cash summary delivered to the owner’s inbox" },
  { time: "11:20", agent: "Receivables", action: "Logged $14,600 payment from Lakeside Supply, invoice closed" },
  { time: "14:45", agent: "Bookkeeping", action: "Attached 9 shop receipts to work orders WO-552 to WO-560" },
  { time: "18:10", agent: "Watch", action: "Duplicate vendor charge detected and held for approval" },
  { time: "21:30", agent: "Reconciliation", action: "Credit card statement reconciled, zero variance" },
];

const VISIBLE = 6;

export function AgentLog() {
  const reduce = useReducedMotion();
  const [start, setStart] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setStart((s) => (s + 1) % FEED.length), 2400);
    return () => clearInterval(id);
  }, [reduce]);

  // Newest entry on top.
  const rows = Array.from({ length: VISIBLE }, (_, i) => {
    const idx = (start + VISIBLE - 1 - i) % FEED.length;
    return { ...FEED[idx], key: `${idx}-${Math.floor((start + VISIBLE - 1 - i) / FEED.length)}` };
  });

  return (
    <figure>
      <div className="bg-ink text-sheet border border-ink">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/15">
          <span className="label text-white/60">Agent activity log</span>
          <span className="label text-green-bright flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              {!reduce && <span className="absolute inline-flex h-full w-full rounded-full bg-green-bright opacity-70 animate-ping" />}
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-bright" />
            </span>
            Running
          </span>
        </div>
        <ul className="relative h-[372px] overflow-hidden" aria-live="off">
          <AnimatePresence initial={false}>
            {rows.map((r) => (
              <motion.li
                key={r.key}
                layout
                initial={{ opacity: 0, y: -24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-[3.5rem_1fr] gap-4 px-6 py-4 border-b border-white/10"
              >
                <span className="figures text-sm text-white/45 pt-0.5">{r.time}</span>
                <span>
                  <span className="label text-green-bright">{r.agent}</span>
                  <span className="block text-[15px] text-white/85 mt-1 leading-snug">{r.action}</span>
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
      <figcaption className="label text-muted mt-3 flex justify-between gap-4">
        <span>Fig. 2 — A day in the log</span>
        <span>Illustrative examples</span>
      </figcaption>
    </figure>
  );
}
