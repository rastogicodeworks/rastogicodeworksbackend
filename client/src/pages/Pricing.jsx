import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import PageCTA from '../components/PageCTA';
import SEO from '../components/SEO';
import { services } from '../data/services';

export default function Pricing() {
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
            All projects are scoped to your needs. Get a tailored quote for any service below.
          </p>
        </div>
      </section>

      {/* Pricing cards  -  one per service */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="group relative flex flex-col rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/20 hover:shadow-xl hover:shadow-primary-500/10 hover:border-primary-200 transition-all duration-500 overflow-hidden hover:-translate-y-2"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100/80 to-transparent rounded-bl-full opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative p-8 flex flex-col flex-1">
                  <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                    {service.icon}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">
                    {service.title}
                  </h2>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
                    {service.shortDesc}
                  </p>
                  <div className="mb-6">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-50 text-primary-700 font-semibold text-sm">
                      Custom quote
                    </span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-slate-600 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex flex-col sm:flex-row gap-3">
                    <Link
                      to="/contact"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                      Get a quote
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/services/${service.id}`}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold text-sm hover:border-primary-200 hover:bg-primary-50/50 hover:text-primary-700 transition-all duration-300"
                    >
                      Learn more
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Note  -  transparent pricing */}
      <section className="py-16 md:py-20 bg-primary-50/40 border-y border-primary-100/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-700 text-lg leading-relaxed">
            We don’t believe in one-size-fits-all pricing. Every project is different - we’ll scope your requirements and share a clear, fixed or time-based quote before you commit.
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
