import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

/* A phone-style preview of an owner talking to InfoMetrix agents in
   Telegram. Styled in the site's own palette (not Telegram's branding);
   the conversation is an illustrative example. */

type Msg =
  | { from: "owner"; text: string }
  | { from: "owner"; photo: string }
  | { from: "agent"; text: string; rows?: [string, string][]; actions?: string[] };

const SCRIPT: Msg[] = [
  { from: "owner", text: "What’s our cash looking like today?" },
  {
    from: "agent",
    text: "Cash on hand as of 7:00 AM:",
    rows: [["Operating account", "$84,310"], ["Due in next 7 days", "−$22,940"], ["Expected in", "+$31,200"]],
  },
  { from: "owner", photo: "Receipt · Love’s #482 · $612.40" },
  { from: "agent", text: "Got it. Logged as fuel for truck 14 and attached to this week’s trip." },
  {
    from: "agent",
    text: "Bill from Midwest Tire for $3,180 is ready to pay. Approve?",
    actions: ["Approve", "Hold"],
  },
  { from: "owner", text: "Approve" },
  { from: "agent", text: "Done. Scheduled for Friday’s payment run." },
];

export function TelegramChat() {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? SCRIPT.length : 1);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (reduce) {
      setShown(SCRIPT.length);
      return;
    }
    const id = setInterval(() => {
      // Pause two ticks on the full thread, then clear and replay.
      setShown((n) => {
        if (n >= SCRIPT.length + 2) {
          setCycle((c) => c + 1);
          return 1;
        }
        return n + 1;
      });
    }, 1700);
    return () => clearInterval(id);
  }, [reduce]);

  const visible = SCRIPT.slice(0, Math.min(shown, SCRIPT.length));
  const typing = !reduce && shown < SCRIPT.length && SCRIPT[shown]?.from === "agent";

  return (
    <figure className="mx-auto w-full max-w-[360px]">
      <div className="rounded-[2.2rem] bg-ink p-2.5 shadow-[0_40px_80px_-40px_rgba(16,38,31,0.6)]">
        <div className="rounded-[1.8rem] bg-sheet overflow-hidden">
          {/* Chat header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-rule bg-paper">
            <div className="w-9 h-9 rounded-full bg-ink text-sheet flex items-center justify-center font-display text-lg">I</div>
            <div>
              <p className="text-[15px] font-medium leading-tight">InfoMetrix Agents</p>
              <p className="text-xs text-green">{typing ? "typing…" : "online"}</p>
            </div>
            <span className="ml-auto label text-muted">Telegram</span>
          </div>

          {/* Thread */}
          <div className="h-[430px] px-4 pt-4 pb-1.5 flex flex-col justify-end overflow-hidden">
            <AnimatePresence initial={false}>
              {visible.map((m, i) => (
                <motion.div
                  key={`${cycle}-${i}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, transition: { duration: 0 } }}
                  transition={{ height: { duration: 0.35, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.3, delay: 0.1 } }}
                  className={`shrink-0 overflow-hidden pb-2.5 ${m.from === "owner" ? "self-end max-w-[82%]" : "self-start max-w-[88%]"}`}
                >
                  {"photo" in m ? (
                    <div className="bg-green text-sheet rounded-2xl rounded-br-md p-2">
                      <div className="h-20 w-44 rounded-xl bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.18)_0_2px,transparent_2px_9px)] bg-white/10" aria-hidden />
                      <p className="text-xs mt-1.5 px-1 opacity-90">{m.photo}</p>
                    </div>
                  ) : m.from === "owner" ? (
                    <p className="bg-green text-sheet rounded-2xl rounded-br-md px-3.5 py-2 text-[14px] leading-snug">{m.text}</p>
                  ) : (
                    <div className="bg-paper-deep text-ink rounded-2xl rounded-bl-md px-3.5 py-2.5 text-[14px] leading-snug">
                      <p>{m.text}</p>
                      {m.rows && (
                        <table className="w-full mt-2 text-[13px]">
                          <tbody>
                            {m.rows.map(([k, v]) => (
                              <tr key={k} className="border-t border-rule">
                                <td className="py-1 pr-3 text-muted">{k}</td>
                                <td className="py-1 text-right figures">{v}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                      {m.actions && (
                        <div className="flex gap-2 mt-2.5">
                          {m.actions.map((a) => (
                            <span key={a} className="flex-1 text-center text-[13px] border border-ink/30 rounded-lg py-1.5">{a}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Composer */}
          <div className="flex items-center gap-2 px-4 py-3 border-t border-rule bg-paper">
            <span className="flex-1 text-[13px] text-muted bg-sheet border border-rule rounded-full px-4 py-2">Message your agents…</span>
            <span className="w-8 h-8 rounded-full bg-ink text-sheet flex items-center justify-center text-sm" aria-hidden>↑</span>
          </div>
        </div>
      </div>
      <figcaption className="label text-muted mt-4 text-center">Fig. 3 — Illustrative conversation</figcaption>
    </figure>
  );
}
