import { Fragment, Suspense, lazy, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence, MotionConfig, useScroll, useTransform } from 'motion/react';
import { CostPerMile } from './components/CostPerMile';
import { Questions } from './components/Questions';
import { AgentLog } from './components/AgentLog';

// Remotion is heavy; load the hero film after the page's text has painted.
const HeroFilm = lazy(() => import('./components/HeroFilm').then((m) => ({ default: m.HeroFilm })));

declare global {
  interface Window {
    Calendly?: { initPopupWidget: (opts: { url: string }) => void };
  }
}

const CALENDLY_URL = 'https://calendly.com/ajk-networking/30min';

const openCalendly = () => {
  if (window.Calendly) window.Calendly.initPopupWidget({ url: CALENDLY_URL });
  else window.open(CALENDLY_URL, '_blank', 'noopener');
};

const EASE = [0.22, 1, 0.36, 1] as const;

const NAV = [
  ['services', 'Services'],
  ['agents', 'Agents'],
  ['costs', 'Cost per mile'],
  ['process', 'Process'],
  ['questions', 'Questions'],
] as const;

const SERVICES = [
  {
    title: 'Books kept clean, every month',
    line: 'Month-end close, reconciliations, and records your CPA can file from.',
    points: ['Month-end close discipline', 'Bank and card reconciliations', 'Internal controls and compliance', 'U.S. GAAP analysis'],
  },
  {
    title: 'Reporting you can actually read',
    line: 'A short monthly packet in plain terms, not spreadsheets to decode.',
    points: ['Profit and loss with commentary', 'Cash position and outlook', 'Custom KPI dashboards', 'Owner-level summary'],
  },
  {
    title: 'Know what every truck and job costs',
    line: 'Cost per mile, job costing, and margin by customer from your real books.',
    points: ['Cost per mile and per truck', 'Job and work-order profitability', 'Margin by customer and lane', 'Expense structure drill-downs'],
  },
  {
    title: 'Plan the next twelve months',
    line: 'Cash flow forecasts and budgets before you buy the next truck or hire.',
    points: ['Cash flow modeling', 'Scenario and budget planning', 'Equipment and capital planning'],
  },
  {
    title: 'Less paperwork, fewer errors',
    line: 'Bills, invoices, and reconciliations that move on their own.',
    points: ['Automated AP, AR, and reconciliation', 'QuickBooks Online and system integrations', 'ERP and CRM connections'],
  },
  {
    title: 'A finance lead in your corner',
    line: 'Fractional CFO judgment and hands-on management support when decisions get big.',
    points: ['Fractional CFO services', 'Company management oversight', 'Lender and partner prep'],
  },
];

const AGENTS = [
  { name: 'Bookkeeping', does: 'Categorizes transactions and attaches receipts as they come in.' },
  { name: 'Reconciliation', does: 'Matches bank and card lines to the ledger every night.' },
  { name: 'Receivables', does: 'Tracks invoices, sends reminders, and logs payments.' },
  { name: 'Payables', does: 'Organizes vendor bills and queues approved payments.' },
  { name: 'Watch', does: 'Flags unusual costs, duplicate charges, and cash dips early.' },
  { name: 'Reporting', does: 'Delivers cash and cost summaries on your schedule.' },
];

const STEPS = [
  { title: 'Diagnose', body: 'We go through your books, bank accounts, and how money moves today. You get a plain list of what is working and what is not.' },
  { title: 'Clean up', body: 'We fix the history: categorize, reconcile, and close out the months that were left open, so the numbers can be trusted.' },
  { title: 'Set up reporting', body: 'We build the monthly packet around your business: per-truck and per-job costs, cash, and the few numbers you check every week.' },
  { title: 'Run it with you', body: 'Each month we close the books, send the packet, and walk you through it. You decide; we keep the system running.' },
];

const PACKET = [
  ['Profit & loss, with commentary', '02'],
  ['Cash position and 13-week outlook', '04'],
  ['Cost per mile, by truck', '06'],
  ['Job and work-order profitability', '08'],
  ['Receivables and collections', '10'],
  ['This month’s action list', '12'],
];

/* ---------- Shared pieces ---------- */

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionHead({ num, kicker, title, dark = false }: { num: string; kicker: string; title: ReactNode; dark?: boolean }) {
  return (
    <Reveal className="mb-14 lg:mb-20">
      <div className={`flex items-baseline gap-4 pb-4 border-b ${dark ? 'border-white/25' : 'border-ink'}`}>
        <span className={`label ${dark ? 'text-green-bright' : 'text-green'}`}>§ {num}</span>
        <span className={`label ${dark ? 'text-white/60' : 'text-muted'}`}>{kicker}</span>
      </div>
      <h2 className={`font-display font-normal tracking-tight text-4xl sm:text-5xl lg:text-6xl leading-[1.05] mt-8 max-w-4xl ${dark ? 'text-sheet' : 'text-ink'}`}>
        {title}
      </h2>
    </Reveal>
  );
}

function ServiceRow({ s, i }: { s: (typeof SERVICES)[number]; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: i * 0.05, ease: EASE }}
      className="border-b border-rule"
    >
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full grid grid-cols-[2.5rem_1fr_auto] sm:grid-cols-[4rem_1.1fr_1fr_auto] gap-x-4 items-baseline py-7 text-left cursor-pointer group"
      >
        <span className="figures text-sm text-muted">{String(i + 1).padStart(2, '0')}</span>
        <span className="font-display text-2xl sm:text-3xl group-hover:text-green transition-colors">{s.title}</span>
        <span className="hidden sm:block text-muted leading-relaxed">{s.line}</span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} className="text-2xl text-muted leading-none" aria-hidden>
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pl-[3.5rem] sm:pl-[5rem] pb-8 grid sm:grid-cols-[1.1fr_1fr] gap-x-4">
              <p className="sm:hidden text-muted mb-4">{s.line}</p>
              <ul className="sm:col-start-2 space-y-2">
                {s.points.map((p) => (
                  <li key={p} className="flex gap-3 text-[15px]">
                    <span className="text-green" aria-hidden>—</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

/* Process: the heading stays pinned while a scroll-linked rule fills beside
   the steps and each step brightens as it reaches the middle of the screen. */
function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 60%', 'end 60%'] });
  const fill = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-24">
      <div className="lg:sticky lg:top-32 self-start">
        <p className="text-lg text-muted leading-relaxed max-w-md">
          Four steps, in this order, with you in the room for each one. Most businesses see their first clean month within a few weeks.
        </p>
        <button onClick={openCalendly} className="mt-8 label text-ink draw-link cursor-pointer">
          Start with a diagnostic →
        </button>
      </div>

      <div ref={ref} className="relative pl-10">
        <div className="absolute left-0 top-2 bottom-2 w-px bg-rule" />
        <motion.div style={{ height: fill }} className="absolute left-0 top-2 w-px bg-green origin-top" />
        <ol className="space-y-20 lg:space-y-28">
          {STEPS.map((s, i) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0.25 }}
              whileInView={{ opacity: 1 }}
              viewport={{ amount: 0.8, margin: '-30% 0px -30% 0px' }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <span className="absolute -left-10 top-2.5 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-paper border-2 border-green" aria-hidden />
              <p className="label text-green">Step {i + 1}</p>
              <h3 className="font-display text-3xl sm:text-4xl mt-3">{s.title}</h3>
              <p className="text-muted leading-relaxed mt-4 max-w-lg">{s.body}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ---------- Page ---------- */

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const headline = ['Clear finances.', 'Better business', 'decisions.'];

  return (
    <MotionConfig reducedMotion="user">
      {/* ---------- Navigation ---------- */}
      <header className={`fixed top-0 inset-x-0 z-50 bg-paper/95 backdrop-blur-sm transition-[border-color] duration-300 border-b ${scrolled ? 'border-rule' : 'border-transparent'}`}>
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10 h-[72px] flex items-center justify-between">
          <a href="#top" className="font-display text-2xl tracking-tight">
            InfoMetrix<span className="text-green">.</span>
          </a>
          <nav className="hidden md:flex items-center gap-9 text-[15px]">
            {NAV.map(([id, label]) => (
              <a key={id} href={`#${id}`} className="draw-link">{label}</a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex">
              <button onClick={openCalendly} className="bg-ink text-sheet px-5 py-2.5 text-[15px] hover:bg-green transition-colors cursor-pointer">
                Book a call
              </button>
            </span>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden label py-2 cursor-pointer"
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
            >
              {menuOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="md:hidden overflow-hidden bg-paper border-b border-rule"
            >
              <div className="px-6 pb-6">
                {NAV.map(([id, label]) => (
                  <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)} className="block font-display text-2xl py-3 border-b border-rule">
                    {label}
                  </a>
                ))}
                <button onClick={() => { setMenuOpen(false); openCalendly(); }} className="mt-6 w-full bg-ink text-sheet py-3.5 cursor-pointer">
                  Book a strategy call
                </button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main id="top" className="pt-[72px]">
        {/* ---------- Hero ---------- */}
        <section className="max-w-[1280px] mx-auto px-6 sm:px-10 pt-14 sm:pt-20 pb-20 lg:pb-28">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="label text-green mb-8"
          >
            Financial operations for trucking &amp; shop businesses
          </motion.p>

          <div className="grid lg:grid-cols-[1.15fr_1fr] gap-14 lg:gap-16 items-end">
            <div>
              <h1 className="font-display font-normal tracking-tight leading-[0.98] text-[13vw] sm:text-7xl lg:text-[5.6rem]">
                {headline.map((line, i) => (
                  <span key={line} className="block overflow-hidden pb-1">
                    <motion.span
                      className={`block ${i === 2 ? 'italic text-green' : ''}`}
                      initial={{ y: '105%' }}
                      animate={{ y: '0%' }}
                      transition={{ duration: 0.9, delay: 0.1 + i * 0.12, ease: EASE }}
                    >
                      {line}
                    </motion.span>
                  </span>
                ))}
              </h1>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
              >
                <p className="mt-10 text-lg sm:text-xl leading-relaxed text-muted max-w-xl">
                  InfoMetrix manages the finances and back office of trucking and shop businesses: organized books,
                  dependable monthly reporting, and hands-on management support. Know where the money goes and what
                  your trucks and jobs actually cost, in plain terms.
                </p>
                <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                  <button onClick={openCalendly} className="bg-ink text-sheet px-7 py-4 text-base hover:bg-green transition-colors cursor-pointer">
                    Book a strategy call
                  </button>
                  <a href="#services" className="draw-link text-base">See what we do →</a>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
            >
              <Suspense fallback={<div className="aspect-[640/560] w-full" aria-hidden />}>
                <HeroFilm />
              </Suspense>
            </motion.div>
          </div>
        </section>

        {/* ---------- Masthead strip ---------- */}
        <div className="border-y border-ink">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-4 flex flex-wrap gap-x-10 gap-y-2 label text-muted">
            <span>Bookkeeping &amp; close</span>
            <span>Monthly reporting</span>
            <span>Truck &amp; job costing</span>
            <span>Cash planning</span>
            <span>Fractional CFO</span>
            <span>24/7 agents</span>
          </div>
        </div>

        {/* ---------- §01 Services ---------- */}
        <section id="services" className="max-w-[1280px] mx-auto px-6 sm:px-10 py-24 lg:py-36">
          <SectionHead num="01" kicker="What we take off your plate" title={<>The back office, handled. <span className="italic text-green">You run the business.</span></>} />
          <ul className="border-t border-ink">
            {SERVICES.map((s, i) => <Fragment key={s.title}><ServiceRow s={s} i={i} /></Fragment>)}
          </ul>
        </section>

        {/* ---------- §02 Cost per mile ---------- */}
        <section id="agents" className="border-t border-rule">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-24 lg:py-36">
            <SectionHead num="02" kicker="Always on" title={<>Our agents work 24/7, <span className="italic text-green">set up around your needs.</span></>} />
            <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-start">
              <div>
                <Reveal>
                  <p className="text-lg text-muted leading-relaxed max-w-lg">
                    While your trucks run and your shop closes for the night, InfoMetrix agents keep working: entering
                    transactions, matching statements, following up on invoices, and watching for anything unusual.
                    You choose which agents run and what they handle, and our team reviews their work every day.
                  </p>
                </Reveal>
                <ul className="mt-10 border-t border-ink">
                  {AGENTS.map((a, i) => (
                    <motion.li
                      key={a.name}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
                      className="grid grid-cols-[8.5rem_1fr] gap-4 py-4 border-b border-rule items-baseline"
                    >
                      <span className="font-display text-xl">{a.name}</span>
                      <span className="text-[15px] text-muted leading-snug">{a.does}</span>
                    </motion.li>
                  ))}
                </ul>
                <Reveal>
                  <p className="mt-8 text-[15px] leading-relaxed">
                    <span className="label text-green mr-2">Your call</span>
                    Run all six or just the two you need. Set their hours, limits, and who approves what.
                  </p>
                </Reveal>
              </div>
              <Reveal delay={0.1} className="lg:sticky lg:top-28">
                <AgentLog />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------- §03 Cost per mile ---------- */}
        <section id="costs" className="bg-paper-deep">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-24 lg:py-36">
            <SectionHead num="03" kicker="Try it with your numbers" title={<>What does a mile <span className="italic text-green">really</span> cost you?</>} />
            <Reveal>
              <CostPerMile />
            </Reveal>
          </div>
        </section>

        {/* ---------- §03 Process ---------- */}
        <section id="process" className="max-w-[1280px] mx-auto px-6 sm:px-10 py-24 lg:py-36">
          <SectionHead num="04" kicker="How it works" title={<>From a shoebox of receipts to a <span className="italic text-green">clean close.</span></>} />
          <Process />
        </section>

        {/* ---------- §04 Monthly packet ---------- */}
        <section className="bg-ink text-sheet">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-24 lg:py-36">
            <SectionHead num="05" kicker="What arrives every month" title={<>Your month, on <span className="italic text-green-bright">twelve pages.</span></>} dark />
            <div className="grid lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-24">
              <Reveal>
                <p className="text-lg text-white/70 leading-relaxed max-w-md">
                  A short packet after every close, the same shape each month so you learn where to look. We walk you
                  through it on a call and leave you with a list of what to do next.
                </p>
              </Reveal>
              <ol className="border-t border-white/25">
                {PACKET.map(([item, page], i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
                    className="flex items-baseline gap-4 py-5 border-b border-white/15"
                  >
                    <span className="figures text-sm text-white/40 w-8">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-display text-xl sm:text-2xl">{item}</span>
                    <span className="flex-1 border-b border-dotted border-white/25 translate-y-[-4px]" aria-hidden />
                    <span className="figures text-sm text-white/50">p.{page}</span>
                  </motion.li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ---------- §05 Questions ---------- */}
        <section id="questions" className="max-w-[1280px] mx-auto px-6 sm:px-10 py-24 lg:py-36">
          <SectionHead num="06" kicker="Questions" title="Things owners ask us first." />
          <Questions />
        </section>

        {/* ---------- Closing ---------- */}
        <section className="border-t border-ink">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-24 lg:py-36 grid lg:grid-cols-[1.5fr_1fr] gap-12 items-end">
            <Reveal>
              <h2 className="font-display font-normal tracking-tight text-5xl sm:text-6xl lg:text-7xl leading-[1.02]">
                Let’s look at your numbers <span className="italic text-green">together.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-muted leading-relaxed">
                A 30-minute call. Bring last month’s statements or just questions. You leave with a clear picture of
                where your books stand, whether or not we work together.
              </p>
              <button onClick={openCalendly} className="mt-8 bg-ink text-sheet px-7 py-4 hover:bg-green transition-colors cursor-pointer">
                Book a strategy call
              </button>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="bg-paper-deep border-t border-rule">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-14 grid gap-10 sm:grid-cols-[2fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl">InfoMetrix<span className="text-green">.</span></p>
            <p className="text-sm text-muted mt-3 max-w-sm leading-relaxed">
              Financial operations, reporting, and management support for trucking and shop businesses.
            </p>
          </div>
          <div>
            <p className="label text-muted mb-4">Sections</p>
            <ul className="space-y-2 text-[15px]">
              {NAV.map(([id, label]) => (
                <li key={id}><a href={`#${id}`} className="draw-link">{label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label text-muted mb-4">Contact</p>
            <ul className="space-y-2 text-[15px]">
              <li><button onClick={openCalendly} className="draw-link cursor-pointer">Book a call</button></li>
              <li><a href="mailto:info@infometrix.us" className="draw-link">info@infometrix.us</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-6 border-t border-rule flex flex-col sm:flex-row justify-between gap-2 label text-muted">
          <span>© {new Date().getFullYear()} InfoMetrix</span>
          <span>Consulting services only. No legal or tax advice.</span>
        </div>
      </footer>
    </MotionConfig>
  );
}
