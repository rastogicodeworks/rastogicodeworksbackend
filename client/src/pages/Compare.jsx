import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle,
  XCircle,
  Scale,
  MessageSquare,
  Code,
  Clock,
  Shield,
  Users,
  FileText,
} from 'lucide-react';
import PageCTA from '../components/PageCTA';
import SEO from '../components/SEO';

const comparisonRows = [
  {
    label: 'Project communication',
    rastogi: 'Direct access to the engineering lead, weekly updates, and transparent decisions.',
    others: 'Account managers, long response times, or unclear ownership.',
  },
  {
    label: 'Code quality',
    rastogi: 'Structured, documented, and written to be maintainable by any future team.',
    others: 'Quick fixes, little documentation, and hard-to-change code.',
  },
  {
    label: 'Tech stack',
    rastogi: 'Modern, battle-tested tools (React, Node.js, cloud) chosen for your use case.',
    others: 'Outdated stacks or one-size-fits-all tools that limit your product.',
  },
  {
    label: 'Engagement model',
    rastogi: 'Clear scope, milestones, and visibility into what is happening each sprint.',
    others: 'Unclear timelines, shifting priorities, and surprises at delivery time.',
  },
  {
    label: 'Handover & ownership',
    rastogi: 'Clean documentation, readable code, and full handover - you’re never locked in.',
    others: 'Vendor lock-in, opaque codebases, or costly transitions.',
  },
  {
    label: 'Partnership approach',
    rastogi: 'We work for the long term - ongoing support, iterations, and a mindset that your product evolves with you.',
    others: 'Short-term projects, one-off deliveries, or handoff-and-forget - no ongoing partnership.',
  },
  {
    label: 'E-commerce & platforms (e.g. Shopify)',
    rastogi: 'We only do custom - Shopify when it fits your use case, or bespoke builds when you need full control. Our mindset is tailored to each client.',
    others: 'One-size-fits-all setups, generic templates, or off-the-shelf solutions - not built around your specific needs.',
  },
];

const whyChooseUs = [
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Built for founders & product teams',
    desc: 'We focus on clarity and velocity so early-stage teams and product leaders can move quickly without losing control.',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'No lock-in mindset',
    desc: 'We document architecture, write readable code, and hand over cleanly - so you’re never stuck with one vendor.',
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: 'Long-term thinking',
    desc: 'We make technical decisions with your next 12–24 months in mind, not just the next deadline.',
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: 'Transparent pricing & scope',
    desc: 'Clear proposals, defined milestones, and no surprise invoices. You know what you’re paying for.',
  },
];

const whatYouCanDependOn = [
  { label: 'On-time delivery', icon: <Clock className="w-5 h-5" /> },
  { label: 'Direct communication', icon: <MessageSquare className="w-5 h-5" /> },
  { label: 'Maintainable code', icon: <Code className="w-5 h-5" /> },
  { label: 'Clear documentation', icon: <FileText className="w-5 h-5" /> },
];

const AUTO_SCROLL_DURATION_MS = 9000;
const AUTO_SCROLL_PAUSE_MS = 2000;
const MANUAL_SCROLL_PAUSE_MS = 6000;

// Smooth ease-in-out cubic for buttery auto-scroll
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function Compare() {
  const tableScrollRef = useRef(null);
  const [isTableInView, setIsTableInView] = useState(false);
  const pauseUntilRef = useRef(0);

  useEffect(() => {
    const el = tableScrollRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setIsTableInView(entry.isIntersecting));
      },
      { threshold: 0.2, rootMargin: '0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = tableScrollRef.current;
    if (!el || !isTableInView) return;

    const media = window.matchMedia('(max-width: 767px)');
    if (!media.matches) return;

    let animationId = null;
    let startTime = null;
    let fromScroll = 0;
    let toScroll = Math.max(0, el.scrollWidth - el.clientWidth);

    function run(timestamp) {
      const now = Date.now();
      if (now < pauseUntilRef.current) {
        animationId = requestAnimationFrame(run);
        return;
      }
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) {
        animationId = requestAnimationFrame(run);
        return;
      }
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const duration = AUTO_SCROLL_DURATION_MS;
      const progress = Math.min(elapsed / duration, 1);
      const smoothProgress = easeInOutCubic(progress);
      el.scrollLeft = fromScroll + (toScroll - fromScroll) * smoothProgress;

      if (progress >= 1) {
        startTime = null;
        const nextFrom = toScroll;
        const nextTo = toScroll === maxScroll ? 0 : maxScroll;
        fromScroll = nextFrom;
        toScroll = nextTo;
        setTimeout(() => {
          animationId = requestAnimationFrame(run);
        }, AUTO_SCROLL_PAUSE_MS);
        return;
      }
      animationId = requestAnimationFrame(run);
    }

    if (toScroll > 0) animationId = requestAnimationFrame(run);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isTableInView]);

  const handleTableUserInteraction = () => {
    pauseUntilRef.current = Date.now() + MANUAL_SCROLL_PAUSE_MS;
  };

  return (
    <div className="overflow-x-hidden bg-white selection:bg-primary-100 selection:text-primary-900 font-sans">
      <SEO
        title="Compare"
        description="Why choose Rastogi Codeworks? Compare our software development approach: senior engineers, agile delivery, modern tech stack, transparent pricing, and on-time delivery. Best for startups and enterprises across India."
        path="/compare"
        keywords="Rastogi Codeworks vs, software development company comparison, best dev agency India, agile development, transparent pricing"
      />
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] animate-grid-fade pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-50/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-slate-200/80 text-slate-600 text-sm font-medium mb-10 shadow-sm shadow-slate-200/50 backdrop-blur-sm">
            <Scale className="w-4 h-4 text-primary-600" />
            <span className="uppercase tracking-widest">How we compare</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-8 leading-[1.08]">
            Choose a partner that{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-500 to-teal-500">
              puts you first
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-12 font-medium">
            Picking a development partner is a big decision. Here’s how our way of working compares to typical alternatives - so you can decide with clarity.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-primary-600 text-white font-bold text-base shadow-lg shadow-primary-500/25 hover:bg-primary-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            Talk to us
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* Understanding the comparison  -  client understanding */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-sm font-semibold text-primary-600 uppercase tracking-widest mb-4">What to look for</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-6 leading-tight">
              Understanding the comparison
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              When you hire a development partner, communication, code quality, and engagement model directly affect your product&apos;s success. The table below highlights how we approach these areas versus what you might see elsewhere.
            </p>
          </div>

          {/* Table: same tabular layout on all devices; horizontal scroll + auto-scroll on mobile when in view */}
          <div
            ref={tableScrollRef}
            className="overflow-x-auto overflow-y-hidden -mx-4 sm:mx-0 px-4 sm:px-0 rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/30 scroll-smooth touch-pan-x overscroll-x-contain"
            style={{ WebkitOverflowScrolling: 'touch' }}
            onTouchStart={handleTableUserInteraction}
            onTouchMove={handleTableUserInteraction}
            onWheel={handleTableUserInteraction}
          >
            <div className="min-w-[600px]">
              <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200">
                <div className="px-4 py-4 sm:px-6 sm:py-5 font-semibold text-slate-900 text-sm sm:text-base">What matters</div>
                <div className="px-4 py-4 sm:px-6 sm:py-5 bg-primary-50/80 border-l border-slate-200 font-brand font-semibold italic text-primary-800 flex items-center gap-2 text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 shrink-0" />
                  Rastogi Codeworks
                </div>
                <div className="px-4 py-4 sm:px-6 sm:py-5 border-l border-slate-200 font-semibold text-slate-500 flex items-center gap-2 text-sm sm:text-base">
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" />
                  Typical alternative
                </div>
              </div>
              {comparisonRows.map((row, i) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-3 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors ${
                    i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                  }`}
                >
                  <div className="px-4 py-4 sm:px-6 sm:py-5 font-medium text-slate-900 border-r border-slate-100 text-sm sm:text-base">
                    {row.label}
                  </div>
                  <div className="px-4 py-4 sm:px-6 sm:py-5 bg-primary-50/30 md:bg-primary-50/20 border-r border-slate-100 text-slate-700 leading-relaxed text-sm sm:text-base">
                    {row.rastogi}
                  </div>
                  <div className="px-4 py-4 sm:px-6 sm:py-5 text-slate-500 leading-relaxed text-sm sm:text-base">
                    {row.others}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="md:hidden text-center text-sm text-slate-500 mt-3 px-4">
            Swipe to explore • Auto-scrolls when idle
          </p>
        </div>
      </section>

      {/* Why you can depend on us */}
      <section className="py-20 bg-slate-50/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-primary-600 uppercase tracking-widest mb-4">Dependency & reliability</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-6 leading-tight">
              What you can depend on
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              We build trust through consistency. Here’s what every engagement includes.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {whatYouCanDependOn.map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-primary-100 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 mb-4">
                  {item.icon}
                </div>
                <span className="font-semibold text-slate-900">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary-600 uppercase tracking-widest mb-4">Why choose us</p>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6 leading-tight">
              More than a vendor - A Partner
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              We’re built for teams that care about quality, clarity, and long-term success.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, i) => (
              <div
                key={i}
                className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary-100 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 mb-6 group-hover:scale-105 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PageCTA
        badge="Ready to work with us?"
        title="Let's build something great together"
        subtitle="Share your project and we'll get back with a clear plan and next steps."
        buttonText="Get in touch"
      />
    </div>
  );
}
