import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  Target,
  IndianRupee,
  ListChecks,
  Info,
  Package,
} from 'lucide-react';
import { services } from '../data/services';
import PageCTA from '../components/PageCTA';
import SEO from '../components/SEO';

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const service = services.find(s => s.id === id);
  const otherServices = services.filter(s => s.id !== id).slice(0, 3);

  useEffect(() => {
    if (!service) {
      navigate('/services');
    }
  }, [id, service, navigate]);

  if (!service) return null;

  const baseUrl = 'https://rastogicodeworks.com';
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${baseUrl}/services` },
      { '@type': 'ListItem', position: 3, name: service.title, item: `${baseUrl}/services/${service.id}` },
    ],
  };

  return (
    <div className="min-h-screen bg-white selection:bg-primary-100 selection:text-primary-900">
      <SEO
        title={service.title}
        description={`${service.shortDesc} Rastogi Codeworks delivers ${service.title.toLowerCase()} across India. Get a custom quote for your project.`}
        path={`/services/${service.id}`}
        keywords={`${service.title}, software development India, ${service.technologies?.join(', ')}`}
        jsonLd={breadcrumbSchema}
      />
      {/* Hero  -  marketing-led, bold */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] opacity-50" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-32 pb-24 md:pt-40 md:pb-32">
          <div className="max-w-3xl w-full space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08]">
              {service.title}
            </h1>
            <p className="text-xl md:text-2xl text-primary-200/90 leading-relaxed max-w-2xl">
              {service.shortDesc}
            </p>
            {service.pricing?.headline && (
              <p className="text-primary-100/95 text-base md:text-lg font-medium flex flex-wrap items-center gap-2">
                <IndianRupee className="w-5 h-5 opacity-90 shrink-0" aria-hidden />
                <span>
                  Starting from{' '}
                  <span className="text-white font-bold">{service.pricing.headline.replace(/^From\s+/i, '')}</span>
                  <span className="text-primary-200/90 font-normal"> · indicative, excl. tax</span>
                </span>
              </p>
            )}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-4 pt-4 sm:pt-6">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-primary-900 font-bold hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 min-h-[56px]"
              >
                Get a Quote
                <ArrowRight className="w-5 h-5 shrink-0" />
              </Link>
              <a
                href="#packages"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-300 min-h-[56px]"
              >
                Packages
              </a>
              <a
                href="#process"
                className="inline-flex items-center justify-center px-6 py-4 rounded-xl text-primary-200 font-semibold hover:text-white underline-offset-4 hover:underline min-h-[56px]"
              >
                Our process
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Value props  -  3 marketing pillars */}
      <section className="relative z-20 pt-8 sm:pt-10 md:pt-12 pb-16 sm:pb-20 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {[
              { icon: <Zap className="w-6 h-6" />, title: 'Delivery on time', desc: 'Clear timelines and milestones so you know what to expect.' },
              { icon: <Shield className="w-6 h-6" />, title: 'Built to scale', desc: 'Solutions that grow with your business and load.' },
              { icon: <Target className="w-6 h-6" />, title: 'Outcome-focused', desc: 'We measure success by your business results.' },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/30 p-5 sm:p-6 md:p-8 flex flex-col items-start hover:shadow-2xl hover:border-primary-100 transition-all duration-300 min-w-0"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4 shrink-0">
                  {item.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Overview  -  full description */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-4">
              <p className="text-sm font-semibold text-primary-600 uppercase tracking-widest mb-2">Overview</p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                What we deliver
              </h2>
            </div>
            <div className="lg:col-span-8">
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed text-pretty max-w-3xl">
                {service.fullDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing  -  detailed */}
      {service.pricing && (
        <section
          id="pricing"
          className="py-20 md:py-28 bg-gradient-to-b from-primary-50/50 via-white to-white border-y border-primary-100/60"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12 md:mb-16">
              <p className="text-sm font-semibold text-primary-600 uppercase tracking-widest mb-2">Pricing</p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
                Investment &amp; how we bill
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                All amounts are <strong className="font-semibold text-slate-800">indicative in INR, excluding taxes</strong>.
                Your final proposal lists deliverables, milestones, and payment terms after we align on scope.
              </p>
              {Array.isArray(service.pricing.packages) && service.pricing.packages.length > 0 && (
                <p className="mt-6">
                  <a
                    href="#packages"
                    className="inline-flex items-center gap-2 text-sm font-bold text-primary-700 hover:text-primary-800 underline-offset-4 hover:underline"
                  >
                    View fixed packages for this service
                    <ArrowRight className="w-4 h-4" aria-hidden />
                  </a>
                  <span className="text-slate-500 font-normal"> — listed after the tech stack below.</span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
              <div className="lg:col-span-5 space-y-6">
                <div className="rounded-3xl border border-primary-200/80 bg-white shadow-xl shadow-primary-900/5 p-8 md:p-10">
                  {service.pricing.model && (
                    <p className="text-xs font-bold uppercase tracking-wider text-primary-600 mb-3">
                      {service.pricing.model}
                    </p>
                  )}
                  {Array.isArray(service.pricing.packages) && service.pricing.packages.length > 0 ? (
                    <>
                      <p className="text-sm font-semibold text-slate-500 mb-1">Entry tier from</p>
                      <p className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
                        {service.pricing.headline}
                      </p>
                      <p className="text-sm text-slate-500 leading-relaxed mb-6">
                        Fixed tiers for this service are in the <strong className="font-semibold text-slate-700">Packages</strong> section after our tech stack—or{' '}
                        <a href="#packages" className="font-semibold text-primary-700 hover:underline underline-offset-2">
                          jump there
                        </a>
                        . Your proposal may combine add-ons across tiers.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-slate-500 mb-1">Starting at</p>
                      <p className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
                        {service.pricing.headline}
                      </p>
                    </>
                  )}
                  <p className="text-slate-600 leading-relaxed mb-6">{service.pricing.note}</p>
                  {service.pricing.summary && (
                    <p className="text-slate-700 text-base leading-relaxed border-t border-slate-100 pt-6">
                      {service.pricing.summary}
                    </p>
                  )}
                  <div className="flex flex-col sm:flex-row gap-3 mt-8">
                    <Link
                      to="/contact"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors shadow-md"
                    >
                      Request exact quote
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/services"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-2 border-slate-200 text-slate-800 font-semibold hover:border-primary-200 hover:bg-primary-50/50 transition-colors"
                    >
                      All services
                    </Link>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-10">
                {Array.isArray(service.pricing.included) && service.pricing.included.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center">
                        <ListChecks className="w-5 h-5" aria-hidden />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">Typically included at this entry range</h3>
                    </div>
                    <ul className="space-y-3">
                      {service.pricing.included.map((line, i) => (
                        <li key={i} className="flex gap-3 text-slate-700 leading-relaxed">
                          <CheckCircle2 className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" aria-hidden />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {Array.isArray(service.pricing.extras) && service.pricing.extras.length > 0 && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 md:p-8">
                    <div className="flex items-start gap-3 mb-3">
                      <Info className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" aria-hidden />
                      <h3 className="text-lg font-bold text-slate-900">Often quoted separately</h3>
                    </div>
                    <ul className="space-y-2 text-slate-600 text-sm md:text-base leading-relaxed">
                      {service.pricing.extras.map((line, i) => (
                        <li key={i} className="pl-1 border-l-2 border-slate-200 pl-4">
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Key Features  -  card grid */}
      <section className="py-20 md:py-28 bg-slate-50/80 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-semibold text-primary-600 uppercase tracking-widest mb-2">Capabilities</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Key features included
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {service.features.map((feature, idx) => (
              <div
                key={idx}
                className="group flex items-start gap-4 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:border-primary-100 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="text-slate-800 font-semibold pt-1.5">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies + CTA side by side */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2">
              <p className="text-sm font-semibold text-primary-600 uppercase tracking-widest mb-2">Tech stack</p>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Technologies we use</h2>
              <p className="text-slate-600 mb-8 max-w-xl">
                We rely on proven tools and platforms to deliver reliable, maintainable solutions for your business.
              </p>
              <div className="flex flex-wrap gap-3">
                {service.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm hover:border-primary-200 hover:bg-primary-50 hover:text-primary-800 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-primary-800 to-primary-950 p-8 md:p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary-600/30 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-3">Ready to get started?</h3>
                <p className="text-primary-200 mb-6 text-sm leading-relaxed">
                  Tell us about your project. We'll respond with a clear plan and next steps.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center w-full py-4 rounded-xl bg-white text-primary-900 font-bold hover:bg-primary-50 transition-colors"
                >
                  Get a Quote
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fixed packages — modern tier cards (only when service defines pricing.packages) */}
      {Array.isArray(service.pricing?.packages) && service.pricing.packages.length > 0 && (
        <section
          id="packages"
          className="relative scroll-mt-28 py-20 md:py-28 overflow-hidden border-y border-slate-200/70 bg-gradient-to-b from-slate-100/50 via-white to-primary-50/35"
        >
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="absolute -top-24 right-0 h-[420px] w-[420px] rounded-full bg-primary-400/15 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-[360px] w-[360px] rounded-full bg-teal-400/10 blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12 md:mb-16">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary-200/80 bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary-700 shadow-sm shadow-primary-900/5 mb-5">
                  <Package className="h-4 w-4" aria-hidden />
                  Packages
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight mb-4">
                  If you want tiers like these—we&apos;ve defined them clearly
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Three ready-made entry points. Pick the closest fit; we refine features and integrations on a short call so your quote matches reality.{' '}
                  <span className="font-medium text-slate-800">All figures indicative, excl. taxes.</span>
                </p>
              </div>
              <Link
                to="/contact"
                className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 shadow-sm transition-all hover:border-primary-200 hover:bg-primary-50/50 lg:self-auto"
              >
                Custom scope instead
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-5 xl:gap-8 md:items-stretch">
              {service.pricing.packages.map((pkg, index) => {
                const featured = index === 1;
                return (
                  <div
                    key={pkg.id}
                    className={`relative flex flex-col h-full min-h-0 rounded-3xl border bg-white transition-all duration-300 ${
                      featured
                        ? 'border-primary-300 shadow-2xl shadow-primary-900/10 ring-2 ring-primary-500/25 md:scale-[1.03] md:z-10 md:-my-1'
                        : 'border-slate-200/90 shadow-lg shadow-slate-900/5 hover:border-primary-200/80 hover:shadow-xl'
                    }`}
                  >
                    {featured && (
                      <div className="absolute -top-3 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-primary-600 via-primary-500 to-teal-600 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white shadow-lg shadow-primary-600/30">
                        Most popular
                      </div>
                    )}

                    <div
                      className={`rounded-t-3xl px-8 pt-10 pb-6 ${featured ? 'bg-gradient-to-br from-primary-600 to-primary-800 text-white' : 'bg-slate-50/90 border-b border-slate-100'}`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <span
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${
                            featured ? 'bg-white/20 text-white' : 'bg-white text-primary-700 shadow-sm ring-1 ring-slate-200/80'
                          }`}
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        {featured ? (
                          <IndianRupee className="h-6 w-6 text-primary-200 opacity-90" aria-hidden />
                        ) : (
                          <IndianRupee className="h-6 w-6 text-primary-500/80" aria-hidden />
                        )}
                      </div>
                      <p
                        className={`text-[11px] font-bold uppercase tracking-[0.2em] mb-2 ${featured ? 'text-primary-100' : 'text-primary-600'}`}
                      >
                        {pkg.name}
                      </p>
                      <p className={`text-3xl md:text-4xl font-bold tracking-tight ${featured ? 'text-white' : 'text-slate-900'}`}>
                        {pkg.headline}
                      </p>
                    </div>

                    <div className="flex flex-1 flex-col px-8 pb-8 pt-6">
                      {pkg.tagline && (
                        <p className="text-sm leading-relaxed text-slate-600 mb-6 rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3">
                          {pkg.tagline}
                        </p>
                      )}

                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">What you get</p>
                      <ul className="space-y-3 flex-1">
                        {pkg.bullets.map((line, i) => (
                          <li key={i} className="flex gap-3 text-sm leading-relaxed text-slate-700">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                            </span>
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-8 pt-6 border-t border-slate-100">
                        <Link
                          to={`/contact?serviceId=${encodeURIComponent(service.id)}&packageId=${encodeURIComponent(pkg.id)}#contact-form`}
                          className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all ${
                            featured
                              ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25 hover:bg-primary-700'
                              : 'bg-slate-900 text-white hover:bg-slate-800'
                          }`}
                        >
                          Request this package
                          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Process  -  timeline / steps */}
      <section id="process" className="py-20 md:py-28 bg-slate-50/80 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-semibold text-primary-600 uppercase tracking-widest mb-2">How we work</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Our process
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {service.process.map((step, idx) => (
              <div key={idx} className="relative">
                {idx < service.process.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gradient-to-r from-primary-200 to-slate-200" />
                )}
                <div className="relative bg-white rounded-2xl border border-slate-100 p-8 shadow-sm hover:shadow-lg hover:border-primary-100 transition-all duration-300 h-full">
                  <div className="w-14 h-14 rounded-2xl bg-primary-500 text-white flex items-center justify-center text-xl font-bold mb-5">
                    {idx + 1}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related services */}
      {otherServices.length > 0 && (
        <section className="py-20 md:py-28 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold text-primary-600 uppercase tracking-widest mb-2">Explore more</p>
            <h2 className="text-3xl font-bold text-slate-900 mb-10">Other services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherServices.map((s) => (
                <Link
                  key={s.id}
                  to={`/services/${s.id}`}
                  className="group block p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-primary-200 hover:bg-primary-50/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-primary-600 mb-4 group-hover:border-primary-200 group-hover:bg-primary-50 transition-colors">
                    {s.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary-700">{s.title}</h3>
                  {s.pricing?.headline && (
                    <p className="text-primary-700 font-bold text-sm mb-2">{s.pricing.headline}</p>
                  )}
                  <p className="text-slate-600 text-sm line-clamp-2">{s.shortDesc}</p>
                  <span className="inline-flex items-center gap-1 text-primary-600 font-semibold text-sm mt-3 group-hover:gap-2 transition-all">
                    Learn more
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <PageCTA
        title="Need this for your project?"
        subtitle="Let's discuss how we can implement this solution for your business."
        buttonText="Get a quote"
      />
    </div>
  );
}
