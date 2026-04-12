import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, CheckCircle2, Sparkles } from 'lucide-react';
import PageCTA from '../components/PageCTA';
import SEO from '../components/SEO';
import { services } from '../data/services';

export default function Pricing() {
  const location = useLocation();

  useEffect(() => {
    const raw = location.hash?.replace(/^#/, '');
    if (!raw) return;
    const t = window.setTimeout(() => {
      document.getElementById(raw)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    return () => window.clearTimeout(t);
  }, [location.hash, location.pathname]);

  return (
    <div className="overflow-x-hidden bg-white selection:bg-primary-100 selection:text-primary-900 font-sans">
      <SEO
        title="Pricing"
        description="Transparent pricing for custom software development, web development, mobile apps, and cloud services. Get a tailored quote for your project. No hidden costs - Rastogi Codeworks delivers value across India."
        path="/pricing"
        keywords="software development pricing, web development cost India, custom app quote, software project pricing, development rates, Rastogi Codeworks pricing"
      />
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-primary-50/30" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] animate-grid-fade pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-50/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-primary-200/80 text-primary-700 text-sm font-medium mb-8 shadow-sm backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary-600" />
            <span className="uppercase tracking-widest">Pricing</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.08]">
            Transparent pricing for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-500 to-teal-500">
              every service
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            All projects are scoped to your needs. Scroll the catalog below or jump to a service from your proposal link.
          </p>
        </div>
      </section>

      {/* Pricing catalog — alternating horizontal bands (not a 3-column grid) */}
      <section className="relative py-16 md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,197,94,0.06),transparent)]" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 md:mb-16 md:flex md:items-end md:justify-between md:gap-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Service catalog</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Indicative starting points
              </h2>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-600 md:mt-0">
              Each row is one offering. Pricing panel swaps left ↔ right on desktop so the page feels less repetitive.
            </p>
          </div>

          <div className="flex flex-col gap-6 md:gap-8">
            {services.map((service, i) => {
              const reverse = i % 2 === 1;
              return (
                <article
                  key={service.id}
                  id={`pricing-${service.id}`}
                  className={`scroll-mt-28 group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/90 bg-white shadow-[0_1px_0_rgba(15,23,42,0.04),0_12px_40px_-12px_rgba(15,23,42,0.12)] transition-all duration-300 hover:border-primary-200/80 hover:shadow-[0_20px_50px_-20px_rgba(34,197,94,0.18)] md:rounded-[2rem] lg:flex-row lg:items-stretch ${reverse ? 'lg:flex-row-reverse' : ''}`}
                >
                  {/* Price strip */}
                  <div
                    className={`relative flex shrink-0 flex-col justify-between gap-8 p-8 text-white md:p-10 lg:w-[min(100%,320px)] lg:max-w-[38%] ${
                      reverse
                        ? 'bg-gradient-to-bl from-primary-800 via-primary-700 to-emerald-800'
                        : 'bg-gradient-to-br from-primary-700 via-primary-600 to-teal-700'
                    }`}
                  >
                    <div
                      className="pointer-events-none absolute inset-0 opacity-[0.12]"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      }}
                    />
                    <div className="relative flex items-start justify-between gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white shadow-inner ring-1 ring-white/25 backdrop-blur-sm [&_svg]:!h-7 [&_svg]:!w-7">
                        {service.icon}
                      </div>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-100 ring-1 ring-white/20">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="relative space-y-1">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">Starting at</p>
                      <p className="text-2xl font-bold tracking-tight sm:text-3xl">
                        {service.pricing?.headline ?? 'Custom quote'}
                      </p>
                      <p className="pt-2 text-sm leading-relaxed text-white/85">
                        {service.pricing?.note ??
                          'We scope every engagement individually and share a clear proposal before you commit.'}
                      </p>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="relative flex flex-1 flex-col p-8 md:p-10">
                    <div className="absolute right-6 top-6 hidden opacity-0 transition-opacity group-hover:opacity-100 lg:block">
                      <ArrowUpRight className="h-5 w-5 text-primary-400" aria-hidden />
                    </div>
                    <h2 className="pr-8 text-xl font-bold tracking-tight text-slate-900 md:text-2xl">{service.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">{service.shortDesc}</p>

                    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                      {service.features.slice(0, 4).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" aria-hidden />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-8 sm:flex-row sm:items-center">
                      <Link
                        to="/contact"
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition-all hover:bg-slate-800 hover:shadow-xl sm:flex-initial sm:min-w-[140px]"
                      >
                        Get a quote
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </Link>
                      <Link
                        to={`/services/${service.id}`}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-slate-50/80 px-5 py-3.5 text-sm font-semibold text-slate-800 transition-all hover:border-primary-300 hover:bg-primary-50 hover:text-primary-900 sm:flex-initial"
                      >
                        Service details
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Note  -  transparent pricing */}
      <section className="py-16 md:py-20 bg-primary-50/40 border-y border-primary-100/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-700 text-lg leading-relaxed">
            Figures above are <strong className="font-semibold text-slate-800">indicative starting points in INR</strong>{' '}
            (excluding tax). Every project is different—we’ll confirm scope and share a clear fixed or time-based quote
            before you commit.
          </p>
        </div>
      </section>

      <PageCTA
        badge="Ready to start?"
        title="Get a tailored quote"
        subtitle="Tell us which service you need and we’ll respond with a clear proposal and next steps."
        buttonText="Contact us"
      />
    </div>
  );
}
