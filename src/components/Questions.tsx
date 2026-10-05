import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

/* FAQ. Wording mirrors the FAQPage JSON-LD in index.html; keep them in sync. */
export const QUESTIONS = [
  {
    q: "What does an engagement with InfoMetrix look like?",
    a: "We start with a diagnostic of your financial operations, then design and implement the systems: clean books, reporting structure, automation, and dashboards. Most clients continue with an ongoing fractional engagement where we operate and optimize what we built.",
  },
  {
    q: "Do you replace our bookkeeper or CPA?",
    a: "No — we build and operate the infrastructure around them. Day-to-day bookkeeping can be absorbed into our systems, but tax preparation and filings stay with your CPA. We make their job easier by handing them audit-ready books.",
  },
  {
    q: "Which tools and platforms do you work with?",
    a: "QuickBooks Online, NetSuite, and Xero on the accounting side; Ramp, Brex, Bill.com, and Stripe for spend and payments; Power BI and Tableau for dashboards — plus custom automation that connects them all.",
  },
  {
    q: "How long until we see results?",
    a: "The first systems are typically live within weeks. Full automation of your core workflows usually lands in one to three months, depending on the state of your books and the number of systems involved.",
  },
  {
    q: "How is pricing structured?",
    a: "Fixed monthly engagements, scoped after the diagnostic — no hourly billing surprises. The strategy call is where we figure out what scope actually fits your business.",
  },
  {
    q: "Do you provide tax or legal advice?",
    a: "No. InfoMetrix provides consulting and financial-systems services only. We coordinate closely with your CPA and counsel, but tax and legal advice stay with them.",
  },
];

export function Questions() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="border-t border-ink">
      {QUESTIONS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className="border-b border-rule">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="w-full grid grid-cols-[3rem_1fr_1.5rem] items-baseline text-left py-6 cursor-pointer group"
            >
              <span className="figures text-sm text-muted">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-display text-xl sm:text-2xl group-hover:text-green transition-colors">{item.q}</span>
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.25 }}
                className="text-2xl leading-none text-muted justify-self-end"
                aria-hidden
              >
                +
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pl-12 pr-6 pb-7 max-w-3xl text-muted leading-relaxed">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
