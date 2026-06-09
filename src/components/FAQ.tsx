import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";

/* FAQ accordion with smooth height animation. Content mirrors the
   FAQPage JSON-LD in index.html — keep the two in sync. */

export const FAQ_ITEMS = [
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

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto divide-y divide-border border border-border rounded-2xl bg-surface-container-lowest shadow-ambient overflow-hidden">
      {FAQ_ITEMS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 text-left px-6 sm:px-8 py-5 hover:bg-surface-container-low/60 transition-colors cursor-pointer"
            >
              <span className="font-display font-bold text-text-main">{item.q}</span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                className="shrink-0 text-secondary"
              >
                <ChevronDown size={20} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-6 sm:px-8 pb-6 text-text-muted leading-relaxed text-sm">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
