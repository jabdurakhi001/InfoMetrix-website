import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "motion/react";

/* An interactive preview of an InfoMetrix voice agent taking a call.
   Visitors pick an industry; the call transcript plays line by line with a
   live waveform, then the outcome card lands. All calls are illustrative. */

type Line = { who: "caller" | "agent"; text: string };
type Scenario = {
  key: string;
  label: string;
  business: string;
  when: string;
  lines: Line[];
  outcome: { title: string; details: string[] };
};

const SCENARIOS: Scenario[] = [
  {
    key: "shop",
    label: "Repair shop",
    business: "Midstate Truck & Trailer",
    when: "Mon 7:42 PM · after hours",
    lines: [
      { who: "agent", text: "Midstate Truck & Trailer, this is the service desk. How can I help?" },
      { who: "caller", text: "My tractor’s losing air on the brakes. Can you get me in tomorrow?" },
      { who: "agent", text: "I can. Bay 2 is open at 8:00 AM. What’s the unit and the best number for updates?" },
      { who: "caller", text: "Unit 31, a 2020 Peterbilt. This number’s fine." },
      { who: "agent", text: "You’re booked for 8:00 AM. I’ll text a confirmation and flag the air leak for the tech." },
    ],
    outcome: {
      title: "Appointment booked",
      details: ["Tue 8:00 AM · Bay 2", "Added to the shop calendar", "Confirmation text sent", "Repair order started for Unit 31"],
    },
  },
  {
    key: "fleet",
    label: "Trucking & dispatch",
    business: "Ridgeline Freight",
    when: "Sat 5:15 AM · overflow",
    lines: [
      { who: "agent", text: "Ridgeline Freight dispatch line. What do you need?" },
      { who: "caller", text: "I’m at the Joliet yard to pick up load 4471, but the gate says it’s not released." },
      { who: "agent", text: "I see load 4471 scheduled for 6:00. I’m paging the on-call dispatcher now." },
      { who: "caller", text: "Okay. I can wait about thirty minutes." },
      { who: "agent", text: "Got it. Dispatch has your number and the details, and I’ve noted your 30-minute window." },
    ],
    outcome: {
      title: "Urgent call routed",
      details: ["On-call dispatcher paged", "Load 4471 details attached", "Driver’s wait window logged", "Summary sent to the dispatch channel"],
    },
  },
  {
    key: "clinic",
    label: "Clinics & dental",
    business: "Lakeview Family Dental",
    when: "Wed 12:08 PM · lunch hour",
    lines: [
      { who: "agent", text: "Thank you for calling Lakeview Family Dental. How can I help you today?" },
      { who: "caller", text: "I need to move my cleaning on Friday. Something came up." },
      { who: "agent", text: "No problem. I have Monday at 9:30 or Tuesday at 2:00. Which works better?" },
      { who: "caller", text: "Tuesday at two, please." },
      { who: "agent", text: "Done. You’re set for Tuesday at 2:00, and I’ve opened Friday’s slot for the waitlist." },
    ],
    outcome: {
      title: "Appointment rescheduled",
      details: ["Moved to Tue 2:00 PM", "Friday slot released to the waitlist", "Reminder text scheduled", "Front desk notified"],
    },
  },
  {
    key: "home",
    label: "Home services",
    business: "Summit Heating & Air",
    when: "Sun 9:51 PM · after hours",
    lines: [
      { who: "agent", text: "Summit Heating & Air. Is this about an existing appointment or a new issue?" },
      { who: "caller", text: "New. The furnace stopped working and it’s getting cold in the house." },
      { who: "agent", text: "I’m sorry about that. I can send a technician first thing at 7:00 AM. Address, please?" },
      { who: "caller", text: "418 Birch Lane. Seven is great." },
      { who: "agent", text: "You’re confirmed for 7:00 AM at 418 Birch Lane. I’ll text the technician’s name tonight." },
    ],
    outcome: {
      title: "Service call booked",
      details: ["Mon 7:00 AM · first slot", "Job created with address", "Marked no-heat priority", "Confirmation text sent"],
    },
  },
];

const STEP_MS = 2100;

function Waveform({ active, side }: { active: boolean; side: "caller" | "agent" }) {
  const reduce = useReducedMotion();
  const bars = Array.from({ length: 28 });
  return (
    <div className="flex items-center gap-[3px] h-10" aria-hidden>
      {bars.map((_, i) => {
        const base = 0.25 + 0.75 * Math.abs(Math.sin(i * 1.7 + (side === "agent" ? 0 : 1.3)));
        return (
          <motion.span
            key={i}
            className={`w-[3px] rounded-full ${side === "agent" ? "bg-green-bright" : "bg-sheet"}`}
            animate={
              active && !reduce
                ? { height: [`${base * 30}%`, `${Math.min(100, base * 100)}%`, `${base * 45}%`] }
                : { height: "12%" }
            }
            transition={
              active && !reduce
                ? { duration: 0.5 + (i % 5) * 0.08, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
                : { duration: 0.3 }
            }
          />
        );
      })}
    </div>
  );
}

export function VoiceDemo() {
  const reduce = useReducedMotion();
  const [pick, setPick] = useState(0);
  const [step, setStep] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  // Only run the call while it is on screen, and start it from the first line
  // each time it scrolls into view.
  const inView = useInView(rootRef, { amount: 0.35 });
  const sc = SCENARIOS[pick];
  const total = sc.lines.length;

  useEffect(() => {
    setStep(reduce ? total + 1 : 1);
  }, [pick, reduce, total, inView]);

  useEffect(() => {
    if (reduce || !inView) return;
    const id = setInterval(() => {
      // Play each line, show the outcome, hold, then replay.
      setStep((s) => (s >= total + 3 ? 1 : s + 1));
    }, STEP_MS);
    return () => clearInterval(id);
  }, [pick, reduce, total, inView]);

  const shown = sc.lines.slice(0, Math.min(step, total));
  const speaking = step >= 1 && step <= total ? sc.lines[step - 1].who : null;
  const done = step > total;

  return (
    <div ref={rootRef}>
      {/* Industry picker */}
      <div role="tablist" aria-label="Choose an industry" className="flex flex-wrap gap-2 mb-6">
        {SCENARIOS.map((s, i) => (
          <button
            key={s.key}
            role="tab"
            aria-selected={pick === i}
            onClick={() => setPick(i)}
            className={`relative px-4 py-2 text-[14px] border cursor-pointer transition-colors ${
              pick === i ? "border-ink text-sheet" : "border-rule text-ink hover:border-ink"
            }`}
          >
            {pick === i && (
              <motion.span layoutId="voice-pill" className="absolute inset-0 bg-ink" transition={{ type: "spring", stiffness: 420, damping: 36 }} />
            )}
            <span className="relative">{s.label}</span>
          </button>
        ))}
      </div>

      <figure>
        <div className="bg-ink text-sheet border border-ink">
          {/* Call header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 px-6 py-4 border-b border-white/15">
            <div>
              <p className="label text-white/55">Incoming call · {sc.when}</p>
              <p className="font-display text-xl mt-1">{sc.business}</p>
            </div>
            <span className="label text-green-bright flex items-center gap-2 shrink-0">
              <span className="relative flex h-2 w-2">
                {!done && !reduce && <span className="absolute inline-flex h-full w-full rounded-full bg-green-bright opacity-70 animate-ping" />}
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-bright" />
              </span>
              {done ? "Call ended" : "Voice agent live"}
            </span>
          </div>

          {/* Waveforms */}
          <div className="grid grid-cols-2 gap-6 px-6 pt-5">
            <div>
              <p className="label text-white/45 mb-1">Caller</p>
              <Waveform active={speaking === "caller"} side="caller" />
            </div>
            <div>
              <p className="label text-green-bright/80 mb-1"><span className="hidden sm:inline">InfoMetrix </span>agent</p>
              <Waveform active={speaking === "agent"} side="agent" />
            </div>
          </div>

          {/* Transcript */}
          <div className="px-6 py-5 h-[300px] sm:h-[290px] flex flex-col justify-end overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_18%)]">
            <AnimatePresence initial={false}>
              {shown.map((l, i) => (
                <motion.div
                  key={`${sc.key}-${i}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, transition: { duration: 0 } }}
                  transition={{ height: { duration: 0.35, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.3, delay: 0.1 } }}
                  className="shrink-0 overflow-hidden"
                >
                  <p className="grid grid-cols-[4.5rem_1fr] gap-3 pb-3 text-[14px] leading-snug">
                    <span className={`label pt-0.5 ${l.who === "agent" ? "text-green-bright" : "text-white/45"}`}>
                      {l.who === "agent" ? "Agent" : "Caller"}
                    </span>
                    <span className={l.who === "agent" ? "text-white/90" : "text-white/70"}>{l.text}</span>
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Outcome */}
          <div className="border-t border-white/15 px-6 py-5 min-h-[132px]">
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key={`${sc.key}-out`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0 } }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="font-display text-2xl text-green-bright">{sc.outcome.title}</p>
                  <ul className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-[14px] text-white/80">
                    {sc.outcome.details.map((d) => (
                      <li key={d} className="flex gap-2">
                        <span className="text-green-bright" aria-hidden>✓</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ) : (
                <motion.p key="wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="label text-white/40 pt-2">
                  Transcript and summary are saved when the call ends
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
        <figcaption className="label text-muted mt-3 flex justify-between gap-4">
          <span>Fig. 5 — A voice agent on the line</span>
          <span>Illustrative call</span>
        </figcaption>
      </figure>
    </div>
  );
}
