import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap, BadgeCheck, Ruler, Landmark, Network, LineChart,
  Settings, Link as LinkIcon, BarChart3, X, Check,
  Truck, Briefcase, TrendingUp, Moon, Sun, Menu
} from 'lucide-react';
import { useTheme } from './components/ThemeProvider';
import { AnimatedCounter } from './components/AnimatedCounter';

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (opts: { url: string }) => void;
    };
  }
}

const CALENDLY_URL = 'https://calendly.com/ajk-networking/30min';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openCalendly = () => {
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url: CALENDLY_URL });
    } else {
      window.open(CALENDLY_URL, '_blank', 'noopener');
    }
  };

  return (
    <div className="bg-surface text-text-main font-sans selection:bg-secondary/20 selection:text-secondary min-h-screen transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-nav border-b border-border transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex justify-between items-center h-16 sm:h-20">
          <div className="text-2xl font-black tracking-tighter text-text-main font-display">
            InfoMetrix
          </div>
          <div className="hidden md:flex items-center space-x-12 font-display font-medium tracking-tight">
            <a href="#services" className="text-text-muted hover:text-secondary transition-colors duration-300">Services</a>
            <a href="#process" className="text-text-muted hover:text-secondary transition-colors duration-300">Process</a>
            <a href="#why-us" className="text-text-muted hover:text-secondary transition-colors duration-300">Why Us</a>
          </div>
          <div className="flex items-center gap-3 sm:gap-6">
            <button onClick={toggleTheme} className="p-2 text-text-muted hover:text-text-main transition-colors" aria-label="Toggle Dark Mode">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={openCalendly} className="hidden md:block bg-primary text-white px-6 py-3 font-display font-semibold text-sm rounded-md active:scale-95 transition-transform hover:bg-primary/90 cursor-pointer">
              Book a Strategy Call
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-text-muted hover:text-text-main transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-border"
            >
              <div className="px-6 py-6 space-y-4">
                <a href="#services" onClick={() => setMobileMenuOpen(false)} className="block text-text-muted hover:text-secondary transition-colors font-display font-medium text-lg">Services</a>
                <a href="#process" onClick={() => setMobileMenuOpen(false)} className="block text-text-muted hover:text-secondary transition-colors font-display font-medium text-lg">Process</a>
                <a href="#why-us" onClick={() => setMobileMenuOpen(false)} className="block text-text-muted hover:text-secondary transition-colors font-display font-medium text-lg">Why Us</a>
                <button
                  onClick={() => { openCalendly(); setMobileMenuOpen(false); }}
                  className="md:hidden w-full bg-primary text-white px-6 py-3 font-display font-semibold text-sm rounded-md active:scale-95 transition-transform cursor-pointer mt-2"
                >
                  Book a Strategy Call
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="pt-16 sm:pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden dot-matrix">
          <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center py-20">
            <motion.div 
              className="z-10"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              <motion.span variants={fadeIn} className="inline-block px-4 py-1.5 rounded-full bg-tertiary/10 text-tertiary font-sans text-xs font-bold uppercase tracking-widest mb-8">
                System-Driven Finance
              </motion.span>
              <motion.h1 variants={fadeIn} className="text-5xl lg:text-7xl font-display font-extrabold text-text-main leading-[1.1] tracking-tight mb-8">
                Outsourced CFO, Financial Systems & Workflow Automation
              </motion.h1>
              <motion.p variants={fadeIn} className="text-xl text-text-muted leading-relaxed mb-6 max-w-xl">
                We design and operate financial systems that give you control, visibility, and scalability — without the overhead of building an internal team.
              </motion.p>
              <motion.p variants={fadeIn} className="text-lg text-text-muted mb-10 border-l-2 border-secondary pl-6 italic">
                From accounting infrastructure to workflow automation, we turn fragmented operations into structured, decision-ready systems.
              </motion.p>
              <motion.div variants={fadeIn} className="flex flex-wrap gap-4">
                <button onClick={openCalendly} className="bg-primary text-white px-8 py-4 rounded-md font-display font-bold text-lg hover:shadow-lg transition-all active:scale-95 cursor-pointer">
                  Book a Strategy Call
                </button>
                <a href="#services" className="border border-border text-text-main px-8 py-4 rounded-md font-display font-bold text-lg hover:bg-surface-container-low transition-all inline-block text-center">
                  View Capabilities
                </a>
              </motion.div>
            </motion.div>

            <motion.div 
              className="relative hidden lg:block"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="absolute inset-0 bg-secondary/5 rounded-[40px] rotate-3 -z-10"></div>
              <div className="bg-surface-container-lowest p-8 rounded-[40px] shadow-ambient border border-border">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" 
                  alt="Financial Systems Dashboard" 
                  className="rounded-2xl w-full h-auto object-cover aspect-[4/3]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-surface-container-lowest p-6 rounded-2xl shadow-ambient border border-border flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
                  <Zap size={24} className="fill-current" />
                </div>
                <div>
                  <p className="text-xs font-sans text-text-muted font-bold uppercase tracking-wider">Operational Status</p>
                  <p className="text-sm font-display font-bold text-text-main">Automation: 94% Efficiency</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trust / Authority Strip */}
        <section className="bg-primary py-12">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
              <div className="text-white text-center md:text-left">
                <h3 className="font-display font-bold text-lg opacity-60 uppercase tracking-[0.2em] mb-2">Built for operators who need precision — not guesswork</h3>
                <p className="text-2xl md:text-3xl font-display font-light italic">"We don’t just manage numbers — we engineer the systems behind them."</p>
              </div>
              <div className="flex flex-wrap justify-center gap-8 text-white/80 font-display font-bold text-sm tracking-tight md:border-l border-white/10 md:pl-8">
                <div className="flex items-center gap-3">
                  <BadgeCheck className="text-tertiary" size={24} />
                  <span>Growth-Stage Focus</span>
                </div>
                <div className="flex items-center gap-3">
                  <Ruler className="text-tertiary" size={24} />
                  <span>Audit-Ready Systems</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Capabilities */}
        <section className="py-32 bg-surface transition-colors duration-300" id="services">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <div className="max-w-2xl">
                <span className="text-secondary font-sans font-bold uppercase tracking-widest text-sm mb-4 block">Our Expertise</span>
                <h2 className="text-4xl md:text-6xl font-display font-extrabold text-text-main leading-tight tracking-tight">
                  Financial Operations. System Architecture. Automation.
                </h2>
              </div>
              <div className="text-text-muted text-lg font-medium">
                Structured logic for complex business environments.
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Card 1 */}
              <motion.div 
                whileHover={{ y: -8 }}
                className="bg-surface-container-lowest p-10 rounded-2xl shadow-ambient group transition-colors duration-300"
              >
                <div className="flex justify-between items-start mb-6">
                  <Landmark className="text-secondary" size={40} strokeWidth={1.5} />
                  <div className="text-right">
                    <div className="text-3xl font-display font-black text-tertiary">
                      <AnimatedCounter value={5} suffix="x" />
                    </div>
                    <div className="text-[10px] font-sans font-bold text-text-muted uppercase tracking-wider">Faster Close</div>
                  </div>
                </div>
                <h3 className="text-xl font-display font-bold mb-4 text-text-main group-hover:text-secondary transition-colors">Financial Operations Management</h3>
                <ul className="space-y-3 text-text-muted font-medium text-sm">
                  <li className="flex items-start gap-3"><Check size={18} className="text-tertiary shrink-0 mt-0.5" /> Month-end close discipline</li>
                  <li className="flex items-start gap-3"><Check size={18} className="text-tertiary shrink-0 mt-0.5" /> Financial reporting structure</li>
                  <li className="flex items-start gap-3"><Check size={18} className="text-tertiary shrink-0 mt-0.5" /> Internal controls & compliance</li>
                  <li className="flex items-start gap-3"><Check size={18} className="text-tertiary shrink-0 mt-0.5" /> Fractional CFO services</li>
                  <li className="flex items-start gap-3"><Check size={18} className="text-tertiary shrink-0 mt-0.5" /> Company management oversight</li>
                </ul>
              </motion.div>

              {/* Card 2 */}
              <motion.div 
                whileHover={{ y: -8 }}
                className="bg-surface-container-lowest p-10 rounded-2xl shadow-ambient group lg:col-span-1 transition-colors duration-300"
              >
                <div className="flex justify-between items-start mb-6">
                  <Network className="text-secondary" size={40} strokeWidth={1.5} />
                  <div className="text-right">
                    <div className="text-3xl font-display font-black text-tertiary">
                      <AnimatedCounter value={100} suffix="%" />
                    </div>
                    <div className="text-[10px] font-sans font-bold text-text-muted uppercase tracking-wider">Audit Ready</div>
                  </div>
                </div>
                <h3 className="text-xl font-display font-bold mb-4 text-text-main group-hover:text-secondary transition-colors">Accounting & Infrastructure</h3>
                <ul className="space-y-3 text-text-muted font-medium text-sm">
                  <li className="flex items-start gap-3"><Check size={18} className="text-tertiary shrink-0 mt-0.5" /> Real-time reporting frameworks</li>
                  <li className="flex items-start gap-3"><Check size={18} className="text-tertiary shrink-0 mt-0.5" /> QBO & System Integrations</li>
                  <li className="flex items-start gap-3"><Check size={18} className="text-tertiary shrink-0 mt-0.5" /> Audit-ready architecture</li>
                  <li className="flex items-start gap-3"><Check size={18} className="text-tertiary shrink-0 mt-0.5" /> U.S. GAAP analysis & compliance</li>
                </ul>
              </motion.div>

              {/* Card 3 */}
              <motion.div 
                whileHover={{ y: -8 }}
                className="bg-surface-container-lowest p-10 rounded-2xl shadow-ambient group transition-colors duration-300"
              >
                <div className="flex justify-between items-start mb-6">
                  <LineChart className="text-secondary" size={40} strokeWidth={1.5} />
                  <div className="text-right">
                    <div className="text-3xl font-display font-black text-tertiary">
                      <AnimatedCounter value={98} suffix="%" />
                    </div>
                    <div className="text-[10px] font-sans font-bold text-text-muted uppercase tracking-wider">Accuracy</div>
                  </div>
                </div>
                <h3 className="text-xl font-display font-bold mb-4 text-text-main group-hover:text-secondary transition-colors">Forecasting & Planning</h3>
                <ul className="space-y-3 text-text-muted font-medium text-sm">
                  <li className="flex items-start gap-3"><Check size={18} className="text-tertiary shrink-0 mt-0.5" /> Cash flow modeling</li>
                  <li className="flex items-start gap-3"><Check size={18} className="text-tertiary shrink-0 mt-0.5" /> Scenario & budget planning</li>
                  <li className="flex items-start gap-3"><Check size={18} className="text-tertiary shrink-0 mt-0.5" /> Capital planning support</li>
                </ul>
              </motion.div>

              {/* Card 4 - Large/Impact */}
              <div className="bg-primary text-white p-10 rounded-2xl md:col-span-2 group relative overflow-hidden shadow-ambient">
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 blur-[100px] -mr-32 -mt-32"></div>
                <div className="relative z-10">
                  <Zap className="text-tertiary mb-6 fill-tertiary/20" size={48} strokeWidth={1.5} />
                  <h3 className="text-3xl font-display font-bold mb-6 tracking-tight">Workflow Automation & Process Optimization</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <ul className="space-y-4 font-medium opacity-90 text-sm">
                      <li className="flex items-start gap-3">
                        <Settings className="text-tertiary shrink-0" size={20} />
                        Automated AP, AR, & reconciliation
                      </li>
                      <li className="flex items-start gap-3">
                        <LinkIcon className="text-tertiary shrink-0" size={20} />
                        ERP/CRM system integration
                      </li>
                    </ul>
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
                      <p className="font-sans font-bold text-tertiary mb-2 uppercase tracking-widest text-xs">The Outcome</p>
                      <p className="text-lg leading-relaxed italic font-display">Less manual work. Fewer errors. Faster decisions.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 5 */}
              <motion.div 
                whileHover={{ y: -8 }}
                className="bg-surface-container-lowest p-10 rounded-2xl shadow-ambient group transition-colors duration-300"
              >
                <div className="flex justify-between items-start mb-6">
                  <BarChart3 className="text-secondary" size={40} strokeWidth={1.5} />
                  <div className="text-right">
                    <div className="text-3xl font-display font-black text-tertiary">
                      <AnimatedCounter value={360} suffix="°" />
                    </div>
                    <div className="text-[10px] font-sans font-bold text-text-muted uppercase tracking-wider">Visibility</div>
                  </div>
                </div>
                <h3 className="text-xl font-display font-bold mb-4 text-text-main group-hover:text-secondary transition-colors">Business Intelligence</h3>
                <ul className="space-y-3 text-text-muted font-medium text-sm">
                  <li className="flex items-start gap-3"><Check size={18} className="text-tertiary shrink-0 mt-0.5" /> Custom KPI dashboards</li>
                  <li className="flex items-start gap-3"><Check size={18} className="text-tertiary shrink-0 mt-0.5" /> Operational data integration</li>
                  <li className="flex items-start gap-3"><Check size={18} className="text-tertiary shrink-0 mt-0.5" /> Decision-support analytics</li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-32 bg-surface-container-low transition-colors duration-300" id="process">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-5xl font-display font-extrabold text-text-main mb-6 tracking-tight">A structured approach to control and scale</h2>
              <div className="w-24 h-1.5 bg-secondary mx-auto rounded-full"></div>
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4">
              {/* Connector Line (Hidden on mobile) */}
              <div className="hidden md:block absolute top-8 left-0 w-full h-px bg-border -z-0 transition-colors duration-300"></div>

              {[
                { step: 1, title: 'Diagnose', desc: 'Full operational & financial health audit.' },
                { step: 2, title: 'Design', desc: 'Architect your custom system blueprint.' },
                { step: 3, title: 'Implement', desc: 'Deploy infrastructure and clean books.' },
                { step: 4, title: 'Automate', desc: 'Eliminate manual bottlenecks with logic.' },
                { step: 5, title: 'Optimize', desc: 'Continuous scaling & performance tuning.' },
              ].map((item) => (
                <div key={item.step} className="relative z-10 text-center space-y-6 group">
                  <div className="w-16 h-16 rounded-full bg-surface-container-lowest shadow-ambient mx-auto flex items-center justify-center font-display font-black text-xl text-text-main border-4 border-surface-container-low group-hover:border-secondary transition-colors duration-300">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-lg mb-2 text-text-main">{item.title}</h4>
                    <p className="text-sm text-text-muted px-4 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why InfoMetrix (Comparison) */}
        <section className="py-32 overflow-hidden bg-surface transition-colors duration-300" id="why-us">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-display font-extrabold text-text-main mb-8 tracking-tight leading-tight">
                  We are not accountants.<br/>
                  <span className="text-secondary">We are operators.</span>
                </h2>
                <p className="text-xl text-text-muted mb-12 leading-relaxed">
                  Traditional accounting looks backward. We build forward-leaning infrastructure that runs your business while you execute.
                </p>
                <div className="space-y-6">
                  <div className="p-8 bg-surface-container-lowest rounded-2xl border-l-4 border-secondary shadow-ambient transition-colors duration-300">
                    <p className="text-lg font-display font-bold italic leading-relaxed text-text-main">
                      "We don’t just clean up your books. We build the infrastructure your business runs on."
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-8 bg-surface-container-low rounded-2xl h-full transition-colors duration-300">
                    <p className="font-sans font-bold text-xs uppercase mb-6 text-text-muted tracking-wider">Traditional Firms</p>
                    <ul className="space-y-4 text-sm font-medium text-text-muted">
                      <li className="flex items-center gap-3"><X size={16} className="text-text-muted opacity-60" /> Reactive Reporting</li>
                      <li className="flex items-center gap-3"><X size={16} className="text-text-muted opacity-60" /> Manual Processes</li>
                      <li className="flex items-center gap-3"><X size={16} className="text-text-muted opacity-60" /> Fragmented Systems</li>
                      <li className="flex items-center gap-3"><X size={16} className="text-text-muted opacity-60" /> Limited Visibility</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-8 bg-primary text-white rounded-2xl shadow-ambient h-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-slate-800"></div>
                    <div className="relative z-10">
                      <p className="font-sans font-bold text-xs uppercase text-tertiary mb-6 tracking-wider">InfoMetrix</p>
                      <ul className="space-y-4 text-sm font-medium">
                        <li className="flex items-center gap-3"><Check size={16} className="text-tertiary" /> System-Driven Ops</li>
                        <li className="flex items-center gap-3"><Check size={16} className="text-tertiary" /> Automated Workflows</li>
                        <li className="flex items-center gap-3"><Check size={16} className="text-tertiary" /> Integrated Systems</li>
                        <li className="flex items-center gap-3"><Check size={16} className="text-tertiary" /> Real-time Visibility</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Visualization Section */}
        <section className="py-32 bg-primary overflow-hidden relative">
          <div className="absolute inset-0 dot-matrix-dark opacity-20"></div>
          <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-20 items-center relative z-10">
            <div className="order-2 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
                alt="Business Analytics Dashboard"
                className="rounded-3xl shadow-2xl border border-white/10 opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-white order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl font-display font-extrabold mb-8 tracking-tight leading-tight">Clarity at every level of your business</h2>
              <p className="text-xl opacity-80 mb-12 leading-relaxed font-light">We build dashboards that give you immediate insight. No more waiting. No more guessing.</p>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <p className="text-3xl font-display font-black text-tertiary mb-2">Live</p>
                  <p className="text-xs font-sans font-bold opacity-70 uppercase tracking-wider">Cash Flow Position</p>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <p className="text-3xl font-display font-black text-tertiary mb-2">Direct</p>
                  <p className="text-xs font-sans font-bold opacity-70 uppercase tracking-wider">Revenue Performance</p>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <p className="text-3xl font-display font-black text-tertiary mb-2">Drill</p>
                  <p className="text-xs font-sans font-bold opacity-70 uppercase tracking-wider">Expense Structure</p>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <p className="text-3xl font-display font-black text-tertiary mb-2">Key</p>
                  <p className="text-xs font-sans font-bold opacity-70 uppercase tracking-wider">Operational Efficiency</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Industries */}
        <section className="py-32 bg-surface transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-display font-extrabold text-text-main mb-6 tracking-tight">Built for operational businesses</h2>
            <p className="text-lg text-text-muted mb-16 max-w-2xl mx-auto">If your business has moving parts, we bring structure to it.</p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div whileHover={{ y: -5 }} className="p-12 bg-surface-container-lowest rounded-3xl shadow-ambient transition-colors duration-300">
                <Truck className="text-secondary mx-auto mb-6" size={48} strokeWidth={1.5} />
                <h4 className="text-xl font-display font-bold text-text-main">Logistics & Transportation</h4>
              </motion.div>
              <motion.div whileHover={{ y: -5 }} className="p-12 bg-surface-container-lowest rounded-3xl shadow-ambient transition-colors duration-300">
                <Briefcase className="text-secondary mx-auto mb-6" size={48} strokeWidth={1.5} />
                <h4 className="text-xl font-display font-bold text-text-main">Service-Based Companies</h4>
              </motion.div>
              <motion.div whileHover={{ y: -5 }} className="p-12 bg-surface-container-lowest rounded-3xl shadow-ambient transition-colors duration-300">
                <TrendingUp className="text-secondary mx-auto mb-6" size={48} strokeWidth={1.5} />
                <h4 className="text-xl font-display font-bold text-text-main">Growth-Stage Businesses</h4>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section id="strategy-call" className="py-32 relative overflow-hidden bg-surface transition-colors duration-300">
          <div className="max-w-5xl mx-auto px-8 text-center relative z-10">
            <div className="bg-primary text-white p-8 sm:p-16 md:p-24 rounded-[40px] shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 dot-matrix-dark opacity-10"></div>
              <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-display font-black mb-6 tracking-tight">Stop operating in the dark</h2>
                <p className="text-xl opacity-80 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                  Get clarity, control, and systems that scale with your business. Let's engineer your financial future.
                </p>
                <button
                  onClick={openCalendly}
                  className="block bg-secondary text-white px-10 py-5 rounded-md font-display font-bold text-lg hover:bg-blue-700 hover:shadow-xl transition-all active:scale-95 cursor-pointer mx-auto w-full sm:w-auto sm:min-w-[280px]"
                >
                  Schedule a Strategy Call
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest w-full py-16 px-8 border-t border-border transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="text-2xl font-black text-text-main font-display mb-6 tracking-tighter">InfoMetrix</div>
              <p className="font-sans text-sm leading-relaxed text-text-muted max-w-sm mb-6">
                InfoMetrix provides outsourced CFO services, financial operations management, and workflow automation for growing businesses.
              </p>
              <p className="font-sans text-sm leading-relaxed text-text-muted max-w-sm">
                We design systems that improve visibility, control, and scalability.
              </p>
            </div>
            
            <div>
              <h5 className="font-display font-bold text-text-main mb-6">Quick Links</h5>
              <ul className="space-y-4 text-sm text-text-muted font-medium">
                <li><a href="#services" className="hover:text-secondary transition-colors">Services</a></li>
                <li><a href="#process" className="hover:text-secondary transition-colors">Process</a></li>
                <li><a href="#why-us" className="hover:text-secondary transition-colors">Why Us</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-display font-bold text-text-main mb-6">Contact</h5>
              <ul className="space-y-4 text-sm text-text-muted font-medium">
                <li><button onClick={openCalendly} className="hover:text-secondary transition-colors cursor-pointer">Book a Call</button></li>
                <li><a href="mailto:info@infometrix.us" className="hover:text-secondary transition-colors">info@infometrix.us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-muted font-medium">
            <p>&copy; {new Date().getFullYear()} InfoMetrix. Precision Engineered Financial Systems.</p>
            <p>Consulting services only. No legal or tax advice.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
