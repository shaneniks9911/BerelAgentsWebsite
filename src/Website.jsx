import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, 
  Wind, 
  Anchor, 
  Settings, 
  CheckCircle, 
  FileText, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  Clock, 
  BarChart, 
  Shield, 
  Users, 
  Mail, 
  Calendar, 
  CreditCard, 
  Lock, 
  Loader2,
  Sparkles,
  ArrowRight,
  Target,
  Briefcase,
  GraduationCap,
  Network
} from 'lucide-react';

// --- CONFIGURATION ---
const DFN_URL = "https://terminplaner.dfn.de/"; 

// --- Custom Hook for Scroll Animations ---
const useOnScreen = (options) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, options);

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref, options]);

  return [ref, isVisible];
};

// --- Fade-In Component ---
const FadeIn = ({ children, delay = 0, className = "" }) => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}s, transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

// --- Shared Components ---

const Button = ({ children, primary, className = '', onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      group relative overflow-hidden rounded-lg px-8 py-4 font-medium transition-all duration-300 ease-out
      disabled:opacity-50 disabled:cursor-not-allowed
      ${primary 
        ? 'text-white shadow-lg shadow-violet-900/40 hover:shadow-violet-900/60' 
        : 'text-slate-300 hover:text-white border border-slate-700/50 hover:border-slate-500 bg-slate-900/50 hover:bg-slate-800/80 backdrop-blur-sm'
      }
      ${className}
    `}
  >
    {primary && (
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 transition-transform duration-500 group-hover:scale-105" />
    )}
    <span className="relative z-10 flex items-center justify-center gap-2 tracking-wide">
      {children}
    </span>
  </button>
);

const Section = ({ id, className = '', children }) => (
  <section id={id} className={`py-24 md:py-32 px-6 md:px-12 relative ${className}`}>
    <div className="max-w-7xl mx-auto relative z-10">{children}</div>
  </section>
);

const GlassCard = ({ children, className = '' }) => (
  <div className={`
    bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 
    p-8 rounded-2xl transition-all duration-500 group
    hover:bg-slate-900/60 hover:border-violet-500/20 hover:shadow-2xl hover:shadow-violet-900/10 hover:-translate-y-1
    ${className}
  `}>
    {children}
  </div>
);

const AccordionItem = ({ question, answer, isOpen, onClick }) => (
  <div className="border-b border-slate-800/50">
    <button
      className="w-full py-6 flex justify-between items-center text-left focus:outline-none group"
      onClick={onClick}
    >
      <span className={`text-lg font-medium transition-colors duration-300 ${isOpen ? 'text-cyan-400' : 'text-slate-300 group-hover:text-white'}`}>
        {question}
      </span>
      <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
        {isOpen ? <ChevronUp className="w-5 h-5 text-cyan-400" /> : <ChevronDown className="w-5 h-5 text-slate-500 group-hover:text-white" />}
      </div>
    </button>
    <div 
      className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-8' : 'max-h-0 opacity-0'}`}
    >
      <div className="text-slate-400 leading-relaxed pr-8 text-base whitespace-pre-line">{answer}</div>
    </div>
  </div>
);

// --- MODALS ---

// 1. DFN Booking Modal
const BookingModal = ({ isOpen, onClose, title = "Schedule Your Session" }) => {
  if (!isOpen) return null;
  const handleEmailRequest = () => {
    const subject = encodeURIComponent(`Booking Request: ${title}`);
    const body = encodeURIComponent(`Hi Berel Team,\n\nI'd like to book: ${title}.\n\n--- Details ---\nName:\nCompany:\nTimezone:\n`);
    window.location.href = `mailto:info@berelagents.com?subject=${subject}&body=${body}`;
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-all duration-300" onClick={onClose}></div>
      <div className="relative bg-slate-900/90 border border-slate-700/50 w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl shadow-violet-900/30 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 backdrop-blur-xl">
        <div className="flex justify-between items-center p-6 border-b border-slate-800/50 bg-slate-950/50">
          <div className="flex items-center gap-4"><div className="p-2 bg-violet-500/10 rounded-lg border border-violet-500/20"><Calendar className="w-6 h-6 text-violet-400" /></div><div><h3 className="text-xl font-bold text-white tracking-wide" style={{ fontFamily: "'Outfit', sans-serif" }}>{title}</h3><p className="text-xs text-slate-400">Secure Booking via DFN</p></div></div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
        </div>
        <div className="flex-1 bg-white/5 relative"><iframe src={DFN_URL} className="absolute inset-0 w-full h-full" title="Booking" frameBorder="0" /></div>
        <div className="p-4 bg-slate-950/80 border-t border-slate-800/50 flex justify-between items-center text-sm backdrop-blur-md"><p className="text-slate-400">Issues? <a href={DFN_URL} target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors">Open in new tab</a></p><button onClick={handleEmailRequest} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"><Mail className="w-4 h-4" /> Request via Email</button></div>
      </div>
    </div>
  );
};

// 2. Payment Modal
const PaymentModal = ({ isOpen, onClose, plan, price, onPaymentSuccess }) => {
  const [step, setStep] = useState('form'); 
  useEffect(() => { if (isOpen) setStep('form'); }, [isOpen]);
  if (!isOpen) return null;
  const handleSubmit = (e) => { e.preventDefault(); setStep('processing'); setTimeout(() => { setStep('success'); }, 2000); };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={step !== 'processing' ? onClose : undefined}></div>
      <div className="relative bg-slate-900/90 border border-slate-700/50 w-full max-w-md rounded-2xl shadow-2xl shadow-cyan-900/20 overflow-hidden animate-in fade-in zoom-in-95 duration-300 backdrop-blur-xl">
        {step === 'form' && (
          <>
            <div className="p-6 border-b border-slate-800/50 bg-slate-950/50 flex justify-between items-center"><h3 className="text-lg font-bold text-white flex items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}><CreditCard className="w-5 h-5 text-cyan-400" /> Secure Checkout</h3><button onClick={onClose}><X className="w-5 h-5 text-slate-500 hover:text-white" /></button></div>
            <div className="p-8">
              <div className="mb-6 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50 flex justify-between items-center"><div><p className="text-slate-400 text-xs uppercase tracking-wider font-medium">Plan</p><p className="text-white font-bold">{plan}</p></div><div className="text-right"><p className="text-slate-400 text-xs uppercase tracking-wider font-medium">Total</p><p className="text-cyan-400 font-bold text-xl">{price}</p></div></div>
              <form onSubmit={handleSubmit} className="space-y-4"><div><label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Cardholder Name</label><input type="text" required className="w-full bg-slate-950/50 border border-slate-700 rounded-md p-3 text-white focus:border-cyan-500 outline-none transition-colors" placeholder="Name on card" /></div><div><label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Card Number</label><div className="relative"><input type="text" required className="w-full bg-slate-950/50 border border-slate-700 rounded-md p-3 text-white focus:border-cyan-500 outline-none transition-colors" placeholder="0000 0000 0000 0000" /><Lock className="w-4 h-4 text-slate-500 absolute right-3 top-3.5" /></div></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Expiry</label><input type="text" required className="w-full bg-slate-950/50 border border-slate-700 rounded-md p-3 text-white outline-none focus:border-cyan-500 transition-colors" placeholder="MM/YY" /></div><div><label className="block text-xs font-medium text-slate-400 mb-1 uppercase">CVC</label><input type="text" required className="w-full bg-slate-950/50 border border-slate-700 rounded-md p-3 text-white outline-none focus:border-cyan-500 transition-colors" placeholder="123" /></div></div><Button primary className="w-full mt-6 !py-3">Pay {price}</Button></form>
            </div>
          </>
        )}
        {step === 'processing' && <div className="p-12 flex flex-col items-center justify-center text-center min-h-[400px]"><Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" /><h3 className="text-xl font-bold text-white mb-2">Processing...</h3></div>}
        {step === 'success' && <div className="p-12 flex flex-col items-center justify-center text-center min-h-[400px]"><div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6 animate-in zoom-in"><CheckCircle className="w-8 h-8 text-green-500" /></div><h3 className="text-2xl font-bold text-white mb-2">You're In.</h3><p className="text-slate-400 mb-8">Subscription active. Let's set up your agents.</p><Button primary onClick={() => { onClose(); onPaymentSuccess(); }} className="w-full">Schedule Kickoff</Button></div>}
      </div>
    </div>
  );
};

// 3. ABOUT MODAL
const AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-slate-900 border border-slate-700/50 w-full max-w-2xl rounded-2xl shadow-2xl p-8 md:p-12 overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
        <div className="mb-8"><h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>About Berel Agents & Co.</h2><div className="h-1 w-20 bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full"></div></div>
        <div className="space-y-6 text-slate-300 leading-relaxed">
          <p className="text-lg font-light">We are the world's first <strong>Agentic Engineering Consultant</strong>.</p>
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700"><h3 className="text-white font-bold mb-2 flex items-center gap-2"><Users className="w-5 h-5 text-violet-400" /> The Founder Story</h3><p className="text-sm text-slate-400">Built by an aerospace engineer and PhD Candidate specializing in CFD and turbulence modeling in Hamburg, Germany. After years of analyzing XV-15 tiltrotors, Berel was born to encode expert engineering judgment into AI systems.</p></div>
          <p>Our mission is to solve the engineering capacity crisis. By combining specialized AI agent swarms with human verification, we deliver professional-grade analysis 20x faster than traditional firms.</p>
        </div>
      </div>
    </div>
  );
};

// 4. BLOG MODAL (Category Definition)
const BlogModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-slate-900 border border-slate-700/50 w-full max-w-3xl rounded-2xl shadow-2xl p-8 md:p-12 overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
        <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-2 block">Category Definition</span>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8" style={{ fontFamily: "'Outfit', sans-serif" }}>What Is an "Agentic Engineering Consultant"?</h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-slate-300 mb-6">An Agentic Engineering Consultant is a new category of service that sits between traditional human consultancies and generic AI tools. It combines <strong>autonomous agent teams</strong> with <strong>human engineering review</strong> to deliver professional analysis in 48-72 hours.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"><div className="p-4 bg-slate-800/30 border border-slate-700 rounded-lg"><h4 className="text-white font-bold mb-2">Traditional Consultants</h4><p className="text-sm text-slate-400">High expertise, but slow (3-6 months) and expensive (€200k+). Innovation is often bottlenecked by headcount.</p></div><div className="p-4 bg-slate-800/30 border border-slate-700 rounded-lg"><h4 className="text-white font-bold mb-2">Generic AI (ChatGPT)</h4><p className="text-sm text-slate-400">Fast and cheap, but lacks domain expertise, specific calculation methods, and reliability for engineering.</p></div></div>
          <h3 className="text-xl font-bold text-white mb-4">The Berel Difference</h3>
          <ul className="list-disc pl-5 space-y-2 text-slate-300"><li><strong>Speed:</strong> 20-40x faster than traditional firms.</li><li><strong>Cost:</strong> ~1/100th the price of a full consultancy engagement.</li><li><strong>Quality:</strong> 95%+ technical accuracy, verified by humans.</li></ul>
        </div>
      </div>
    </div>
  );
};

// 5. METHODOLOGY MODAL (Visuals)
const MethodologyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-slate-900 border border-slate-700/50 w-full max-w-4xl rounded-2xl shadow-2xl p-8 md:p-12 overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
        <h2 className="text-3xl font-bold text-white mb-10 text-center" style={{ fontFamily: "'Outfit', sans-serif" }}>Our Methodology</h2>
        <div className="mb-16"><h3 className="text-xl text-white font-bold mb-6 flex items-center gap-2"><Network className="text-cyan-400" /> The Agent Swarm Process</h3><div className="flex flex-col md:flex-row items-center justify-between gap-4 relative"><div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-slate-700 via-cyan-900 to-slate-700 -z-10"></div>{[ { title: "Discovery", icon: FileText }, { title: "Agent Swarm", icon: Users, active: true }, { title: "Synthesis", icon: Cpu }, { title: "Delivery", icon: CheckCircle } ].map((step, i) => (<div key={i} className="flex flex-col items-center bg-slate-900 p-4 rounded-xl border border-slate-700 z-10 w-40"><div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${step.active ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'bg-slate-800 text-slate-400'}`}><step.icon className="w-6 h-6" /></div><span className="text-sm font-bold text-slate-200">{step.title}</span></div>))}</div><p className="text-center text-slate-500 text-sm mt-6 max-w-xl mx-auto">Unlike linear human workflows, our agents work in parallel across domains (Aero, Structures, Mfg) to identify conflicts instantly.</p></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-950 p-8 rounded-2xl border border-slate-800"><div><h3 className="text-xl text-white font-bold mb-4">Why It Wins</h3><p className="text-slate-400 mb-4">We sit in the "Magic Quadrant" of high engineering rigor and high speed.</p><ul className="space-y-3 text-sm text-slate-300"><li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-red-400" /> <strong>Traditional:</strong> High Rigor, Low Speed</li><li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-slate-500" /> <strong>Generic AI:</strong> Low Rigor, High Speed</li><li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-cyan-400" /> <strong>Berel:</strong> High Rigor, High Speed</li></ul></div><div className="relative bg-slate-900 rounded-xl border border-slate-700 p-4 flex items-center justify-center"><div className="relative w-48 h-48 border-l border-b border-slate-600"><div className="absolute top-2 right-2 p-2 bg-cyan-500/20 border border-cyan-500/50 rounded text-xs text-cyan-400 font-bold">Berel</div><div className="absolute top-2 left-2 p-2 bg-slate-800 border border-slate-700 rounded text-xs text-slate-500">Traditional</div><div className="absolute bottom-2 right-2 p-2 bg-slate-800 border border-slate-700 rounded text-xs text-slate-500">Generic AI</div><span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase text-slate-500">Speed</span><span className="absolute -left-6 top-1/2 -translate-y-1/2 text-[10px] uppercase text-slate-500 -rotate-90">Rigor</span></div></div></div>
      </div>
    </div>
  );
};


// --- Header Component ---
const Header = ({ onBookClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth Scroll Function
  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Why Berel', href: 'value-prop' },
    { name: 'Who We Serve', href: 'who-we-serve' },
    { name: 'Use Cases', href: 'use-cases' },
    { name: 'Capabilities', href: 'capabilities' },
    { name: 'Process', href: 'how-it-works' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${isScrolled ? 'bg-slate-950/80 backdrop-blur-lg border-slate-800/50 py-4 shadow-lg shadow-black/20' : 'bg-transparent border-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* BRANDING: Text-only, Stacked, Left-Aligned, 1px Difference */}
        <a href="#" className="flex flex-col -space-y-1.5 group" onClick={(e) => scrollToSection(e, 'hero')}>
          <span className="text-[20px] font-bold text-slate-100 tracking-tight group-hover:text-white transition-colors" style={{ fontFamily: "'Outfit', sans-serif" }}>Berel Agents</span>
          <span className="text-[19px] font-bold text-slate-100 tracking-tight group-hover:text-white transition-colors" style={{ fontFamily: "'Outfit', sans-serif" }}>& Co.</span>
        </a>

        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={`#${link.href}`}
              onClick={(e) => scrollToSection(e, link.href)}
              className="text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-cyan-400 after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.name}
            </a>
          ))}
          <Button primary className="!py-2 !px-5 !text-sm" onClick={onBookClick}>Start Your Free Pilot</Button>
        </div>

        <button className="lg:hidden text-slate-300 hover:text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 p-6 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-5">
          {navLinks.map((link) => (
            <a key={link.name} href={`#${link.href}`} onClick={(e) => scrollToSection(e, link.href)} className="text-slate-300 hover:text-cyan-400 py-3 text-lg font-medium border-b border-slate-800/50">{link.name}</a>
          ))}
          <Button primary className="w-full mt-4" onClick={() => { setIsMobileMenuOpen(false); onBookClick(); }}>Start Your Free Pilot</Button>
        </div>
      )}
    </nav>
  );
};

const Footer = ({ onOpenAbout, onOpenMethod, onOpenBlog }) => (
  <footer className="bg-slate-950 pt-24 pb-12 border-t border-slate-900 text-slate-400 relative overflow-hidden">
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-violet-900/10 to-transparent blur-[120px] pointer-events-none"></div>
    <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          {/* BRANDING: Text-only, 1px Difference */}
          <div className="mb-6 flex flex-col -space-y-1.5">
            <h2 className="text-[24px] font-bold text-slate-100" style={{ fontFamily: "'Outfit', sans-serif" }}>Berel Agents</h2>
            <h2 className="text-[23px] font-bold text-slate-100" style={{ fontFamily: "'Outfit', sans-serif" }}>& Co.</h2>
          </div>
          <p className="mb-8 max-w-md text-slate-500 leading-relaxed">The world’s first Agentic Engineering Consultant – AI-powered specialist teams with human-reviewed quality for aerospace and mechanical engineering.</p>
          <div className="flex gap-4">
            {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
              <a key={social} href="#" className="p-2 bg-slate-900 rounded-lg hover:bg-slate-800 hover:text-cyan-400 transition-all">{social}</a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 tracking-wide" style={{ fontFamily: "'Outfit', sans-serif" }}>Company</h4>
          <ul className="space-y-3">
            <li><button onClick={onOpenAbout} className="hover:text-cyan-400 transition-colors">About</button></li>
            <li><button onClick={onOpenMethod} className="hover:text-cyan-400 transition-colors">Methodology</button></li>
            <li><a href="#pricing" className="hover:text-cyan-400 transition-colors">Pricing</a></li>
            <li><button onClick={onOpenBlog} className="hover:text-cyan-400 transition-colors">Blog</button></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 tracking-wide" style={{ fontFamily: "'Outfit', sans-serif" }}>Contact</h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-500" /> info@berelagents.com</li>
            <li className="flex items-center gap-2"><Settings className="w-4 h-4 text-slate-500" /> Hamburg, DE</li>
            <li className="pt-6 text-sm text-slate-600">© 2025 Berel Agents & Co.</li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
);

// --- Main App Component ---
export default function App() {
  const [openFaq, setOpenFaq] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingTitle, setBookingTitle] = useState("Schedule Your Audit");
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({ name: '', price: '' });
  
  // New Modal States
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isMethodOpen, setIsMethodOpen] = useState(false);
  const [isBlogOpen, setIsBlogOpen] = useState(false);

  const openBooking = (title) => { setBookingTitle(title); setIsBookingOpen(true); };
  const openPayment = (planName, planPrice) => { setSelectedPlan({ name: planName, price: planPrice }); setIsPaymentOpen(true); };
  const handlePaymentSuccess = () => { openBooking(`Schedule ${selectedPlan.name} Kickoff`); };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-300 font-sans selection:bg-violet-500/30 selection:text-violet-100 overflow-x-hidden">
      {/* Fonts Injection */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@500;700&family=Jost:wght@500;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>

      <Header onBookClick={() => openBooking("Start Your Free Pilot")} />
      
      {/* ALL MODALS */}
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} title={bookingTitle} />
      <PaymentModal isOpen={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} plan={selectedPlan.name} price={selectedPlan.price} onPaymentSuccess={handlePaymentSuccess} />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <MethodologyModal isOpen={isMethodOpen} onClose={() => setIsMethodOpen(false)} />
      <BlogModal isOpen={isBlogOpen} onClose={() => setIsBlogOpen(false)} />

      {/* Hero Section */}
      <Section id="hero" className="min-h-screen flex items-center relative overflow-hidden pt-32">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(139,92,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-violet-900/20 blur-[120px] rounded-full pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-900/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl pt-10">
          <FadeIn>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-8 tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Your Engineering Team <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 animate-gradient">
                Just Got 10x Faster
              </span>
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <p className="text-xl text-slate-400 mb-12 max-w-3xl leading-relaxed font-light">
              The world’s first Agentic Engineering Consultant – AI-powered specialist teams with human-reviewed quality for aerospace and mechanical engineering.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <Button primary onClick={() => openBooking("Start Your Free Pilot")}>Start Your Free Pilot</Button>
              <Button onClick={() => {
                const el = document.getElementById('pricing');
                if(el) el.scrollIntoView({ behavior: 'smooth' });
              }}>View Plans</Button>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-violet-500" /> 30-min Strategy Session</span>
              <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-violet-500" /> No Commitment</span>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* Problem Section */}
      <Section id="value-prop" className="bg-slate-900">
        <FadeIn className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>The Engineering Capacity Crisis</h2>
          <p className="text-lg text-slate-400 max-w-2xl">Senior engineers are spending 70% of their time on desk work, not design.</p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <FadeIn delay={0.1} className="space-y-8">
            {[
              { title: "Administrative Bottlenecks", desc: "Repetitive literature reviews, standards searches, and manual report writing consume valuable senior hours." },
              { title: "Integration Friction", desc: "Reformatting and reconciling conflicting analyses across aero, structures, and manufacturing teams." },
              { title: "The Real Cost", desc: "8-12 weeks per design iteration. €150K+ fully-loaded engineering costs per project. Innovation bottlenecked by analysis capacity." }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-5 group">
                <div className="p-3 bg-red-500/10 rounded-xl text-red-400 border border-red-500/20 group-hover:bg-red-500/20 transition-colors"><X className="w-6 h-6" /></div>
                <div>
                  <h3 className="text-xl font-bold text-slate-200 mb-2">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </FadeIn>

          <FadeIn delay={0.3}>
            <GlassCard className="relative overflow-hidden p-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/20 rounded-full blur-[80px] -z-10"></div>
              {/* Hero Visual: Large Standalone B Visual (CSS Generated) */}
               <div className="absolute top-0 right-0 w-full h-full opacity-10 flex items-center justify-center pointer-events-none">
                 <span style={{ fontSize: '200px', fontWeight: 'bold', fontFamily: "'Outfit', sans-serif", color: 'transparent', WebkitBackgroundClip: 'text', backgroundImage: 'linear-gradient(135deg, #22d3ee, #a78bfa)' }}>B</span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-6 relative z-10" style={{ fontFamily: "'Outfit', sans-serif" }}>The Alternative</h3>
              <p className="text-xl text-cyan-300 font-medium mb-10 relative z-10">What if a specialized team of AI engineering agents could handle 80% of this—in 48 hours?</p>
              <div className="space-y-8 relative z-10">
                <div>
                    <div className="flex justify-between text-sm text-slate-500 mb-2 font-medium"><span>Traditional (8-12 Weeks)</span></div>
                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50"><div className="h-full w-[15%] bg-red-500/50 rounded-full"></div></div>
                </div>
                <div>
                    <div className="flex justify-between text-sm text-cyan-400 font-medium mb-2"><span>Berel Agents (48 Hours)</span></div>
                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50 relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-400 w-[95%] rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
                    </div>
                </div>
              </div>
            </GlassCard>
          </FadeIn>
        </div>
      </Section>

      {/* Solution Section */}
      <Section id="how-it-works">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>Meet Your Agentic Engineering Desk</h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">A specialized AI team that functions as your in-house engineering consultancy. <span className="text-violet-400 font-medium">Not a chatbot. A coordinated expert system.</span></p>
        </div>

        <div className="relative mb-32">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent -z-10 transform -translate-y-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Discovery", icon: Settings, desc: "You share your project brief, requirements, constraints, and any reference documents. We configure your custom agent team based on your processes and standards." },
              { step: "02", title: "Deployment", icon: Users, desc: "Your specialized agents (Research, Aero, Structures, Manufacturing, QA) get to work, analyzing seamlessly in parallel with cross-domain context." },
              { step: "03", title: "Synthesize", icon: Zap, desc: "Receive a comprehensive 40-60 page consultation package: executive summary, technical analysis, risk register, cost estimates, and actionable next steps." },
              { step: "04", title: "Learning", icon: Cpu, desc: "Your agents learn from every project. Provide feedback, and they encode your company's expertise, preferences, and standards—getting smarter with each consultation." }
            ].map((item, idx) => (
              <FadeIn key={idx} delay={idx * 0.1} className="h-full">
                <GlassCard className="h-full p-6 !bg-slate-950/80 flex flex-col">
                  <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center mb-6 border border-slate-800 text-cyan-400 shadow-lg shadow-cyan-900/10">
                    <item.icon className="w-7 h-7" />
                  </div>
                  <div className="text-xs font-mono text-violet-400 mb-2 uppercase tracking-wider">Step {item.step}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </GlassCard>
              </FadeIn>
            ))}
          </div>
        </div>

        <div className="mt-24 text-center mb-12"><h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>Your Specialized Agent Team</h3></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Research Agent", icon: FileText, tagline: "Standards & Intelligence", desc: "Conducts targeted literature reviews & regulatory compliance checks (FAA/EASA)." },
              { name: "Aerodynamics Agent", icon: Wind, tagline: "Performance & CFD", desc: "Performs preliminary sizing (Raymer methods) and drag breakdown estimation." },
              { name: "Structural Agent", icon: Anchor, tagline: "Load Analysis", desc: "Identifies critical load cases and performs preliminary structural sizing & material selection." },
              { name: "Manufacturing Agent", icon: Settings, tagline: "DFM & Cost", desc: "Assesses manufacturability, recommends processes, and builds ROM cost models." },
              { name: "QA Agent", icon: Shield, tagline: "Certification", desc: "Maps certification pathways and develops quality control inspection plans." },
              { name: "Integration Agent", icon: Users, tagline: "Synthesis", desc: "Synthesizes all outputs into a single, cohesive voice with actionable executive summaries." }
            ].map((agent, idx) => (
              <FadeIn key={idx} delay={0.4 + (idx * 0.05)}>
                <div className="group bg-slate-900/40 border border-slate-800/60 rounded-xl p-6 hover:bg-slate-800/60 transition-all duration-300 h-full hover:border-violet-500/30 flex flex-col">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 group-hover:border-violet-500/40 transition-colors"><agent.icon className="w-5 h-5 text-cyan-400 group-hover:text-violet-400" /></div>
                    <div><h4 className="text-white font-bold">{agent.name}</h4><p className="text-[10px] uppercase tracking-wider text-violet-400 font-semibold">{agent.tagline}</p></div>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4 flex-1">{agent.desc}</p>
                </div>
              </FadeIn>
            ))}
        </div>
      </Section>

      {/* Use Cases */}
      <Section id="use-cases" className="bg-slate-900">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>Perfect for These Challenges</h2>
          <p className="text-lg text-slate-400">Real scenarios where Berel Agents accelerate capacity.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { title: "Rapid Design Iteration", icon: Zap, problem: "Testing multiple concepts burns months.", impact: "10x faster screening" },
            { title: "Certification Planning", icon: Shield, problem: "Compliance gaps discovered too late.", impact: "Avoid costly redesigns" },
            { title: "Supplier RFQ Eval", icon: BarChart, problem: "Slow technical feasibility assessment.", impact: "3-day turnaround" },
            { title: "Trade Studies", icon: FileText, problem: "Reports lacking engineering rigor.", impact: "Review-ready in 48h" }
          ].map((item, idx) => (
            <FadeIn key={idx} delay={idx * 0.1}>
              <GlassCard className="h-full flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-violet-500/10 rounded-xl"><item.icon className="w-6 h-6 text-violet-400" /></div>
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                </div>
                <div className="space-y-4 mb-6 flex-1">
                  <div><p className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-2">The Challenge</p><p className="text-sm text-slate-400 italic">"{item.problem}"</p></div>
                  <div><p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-2">Berel Solution</p><p className="text-sm text-slate-300">Full agentic analysis and reporting.</p></div>
                </div>
                <div className="pt-4 border-t border-slate-800 flex items-center gap-2 text-cyan-400 font-medium text-sm"><Sparkles className="w-4 h-4" /> <span>{item.impact}</span></div>
              </GlassCard>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Pricing */}
      <Section id="pricing">
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>Transparent Pricing</h2>
          <p className="text-slate-400">Simple monthly models. No hidden fees.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Starter */}
          <FadeIn className="h-full">
            <GlassCard className="h-full flex flex-col border-t-4 border-t-slate-700 pt-8">
              <div className="mb-6"><span className="text-slate-400 font-medium">Starter</span><div className="mt-2 flex items-baseline gap-1"><span className="text-4xl font-bold text-white">€1,500</span><span className="text-slate-500">/mo</span></div></div>
              <ul className="space-y-4 mb-8 flex-1 text-sm text-slate-300">{["20 Consultations/mo", "All 6 Agents", "48-72h Turnaround", "PDF Outputs"].map(f => <li key={f} className="flex gap-3"><CheckCircle className="w-5 h-5 text-slate-600" /> {f}</li>)}</ul>
              <Button className="w-full justify-center" onClick={() => openPayment('Starter Plan', '€1,500')}>Start Pilot</Button>
            </GlassCard>
          </FadeIn>
          
          {/* Professional */}
          <FadeIn delay={0.1} className="h-full">
            <GlassCard className="h-full flex flex-col relative border-violet-500/30 shadow-2xl shadow-violet-900/20 transform scale-105 z-10 pt-12 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-violet-500 to-cyan-500"></div>
              <div className="absolute top-4 right-4 px-3 py-1 bg-violet-500/20 border border-violet-500/30 rounded-full text-xs text-violet-300 font-bold uppercase tracking-wider">Most Popular</div>
              <div className="mb-6"><span className="text-violet-400 font-medium">Professional</span><div className="mt-2 flex items-baseline gap-1"><span className="text-4xl font-bold text-white">€2,500</span><span className="text-slate-500">/mo</span></div></div>
              <ul className="space-y-4 mb-8 flex-1 text-sm text-slate-300">{["Unlimited Consultations", "Priority (24h)", "Custom Config", "Slack Channel"].map(f => <li key={f} className="flex gap-3"><CheckCircle className="w-5 h-5 text-violet-400" /> {f}</li>)}</ul>
              <Button primary className="w-full justify-center" onClick={() => openPayment('Professional Plan', '€2,500')}>Get Started</Button>
            </GlassCard>
          </FadeIn>
          
          {/* Enterprise */}
          <FadeIn delay={0.2} className="h-full">
            <GlassCard className="h-full flex flex-col border-t-4 border-t-slate-700 pt-8">
              <div className="mb-6"><span className="text-slate-400 font-medium">Enterprise</span><div className="mt-2 flex items-baseline gap-1"><span className="text-4xl font-bold text-white">Custom</span></div></div>
              <ul className="space-y-4 mb-8 flex-1 text-sm text-slate-300">{["White-label", "Custom Agents", "API Access", "Multi-language"].map(f => <li key={f} className="flex gap-3"><CheckCircle className="w-5 h-5 text-slate-600" /> {f}</li>)}</ul>
              <Button className="w-full justify-center" onClick={() => openBooking("Contact Enterprise Sales")}>Contact Sales</Button>
            </GlassCard>
          </FadeIn>
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" className="bg-slate-900">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center" style={{ fontFamily: "'Outfit', sans-serif" }}>Frequently Asked Questions</h2>
          {[
            { q: "How is this different from ChatGPT?", a: "Generic LLMs are generalists. Berel Agents are specialists with encoded aerospace expertise (Raymer, Nicolai), working as a coordinated team (Aero → Structures → Mfg) to ensure cross-domain consistency." },
            { q: "Can agents replace senior engineers?", a: "No. We handle the 70% systematic work. Your seniors focus on novel design and judgment." },
            { q: "Data security?", a: "Encrypted transit/rest. SOC 2 Type II. On-premise options available." },
             { q: "What about technical errors?", a: "We use a three-layer safety system: Multi-agent validation, confidence scoring, and Human-in-the-loop training." }
          ].map((item, i) => <AccordionItem key={i} question={item.q} answer={item.a} isOpen={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? -1 : i)} />)}
        </div>
      </Section>

      {/* Final CTA */}
      <Section id="cta">
        <FadeIn>
          <div className="relative bg-slate-900/80 border border-slate-800 rounded-3xl p-16 text-center max-w-4xl mx-auto overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-violet-600/20 blur-[100px] rounded-full pointer-events-none"></div>
            
            <h2 className="relative z-10 text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>Start Your Transformation</h2>
            <p className="relative z-10 text-slate-300 mb-10 max-w-2xl mx-auto text-lg">Send us one real project brief. We'll deliver a full consultation package within 48-72 hours.</p>
            
            <div className="relative z-10 flex flex-col items-center gap-8">
                <Button primary className="px-12 py-5 text-lg shadow-[0_0_50px_rgba(139,92,246,0.4)] hover:shadow-[0_0_80px_rgba(139,92,246,0.6)]" onClick={() => openBooking("Claim Free Pilot Project")}>Claim Free Pilot Project</Button>
            </div>
            <p className="relative z-10 mt-10 text-sm text-slate-500 font-medium">Trusted by engineering teams in Germany, France, and India.</p>
          </div>
        </FadeIn>
      </Section>

      <Footer 
        onOpenAbout={() => setIsAboutOpen(true)} 
        onOpenMethod={() => setIsMethodOpen(true)}
        onOpenBlog={() => setIsBlogOpen(true)}
      />
    </div>
  );
}
