import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Briefcase, CheckCircle, Quote } from 'lucide-react';
import PageCTA from '../components/PageCTA';
import SEO from '../components/SEO';

const clientLogos = [
  'DataBot Labs',
  'YD Advisory',
  'Aniyah',
  'Nb Aurum',
  'Dhoondh',
  'Rastogi & Associates',
  'Vimaanna',
  'ONX STUDIO',
  'thenote.earth',
  'Rhine Advisory'
];

/** Featured work  -  same design as Home "Selected Work" (image cards with hover overlay) */
const featuredWork = [
  {
    clientName: 'Nb Aurum Solutions',
    title: 'Professional Finance Dashboard For Startup',
    url: 'https://nbaurum.com',
    domain: 'nbaurum.com',
    image: '/image.png',
    alt: 'Professional Finance Dashboard For Startup  -  Nb Aurum Solutions'
  },
  {
    clientName: 'YD Advisory',
    title: 'Revamped Website For Established Finance MNC',
    url: 'https://ydadvisory.ae',
    domain: 'ydadvisory.ae',
    image: '/image2.png',
    alt: 'Revamped Website For Established Finance MNC  -  YD Advisory'
  },
  {
    clientName: 'Rastogi & Associates',
    title: 'Professional Website For Established Taxation and Law Firm',
    url: 'https://rastogiassociates.com/',
    domain: 'rastogiassociates.com',
    image: '/image3.png',
    alt: 'Professional Website For Established Taxation and Law Firm  -  Rastogi & Associates'
  },
  {
    clientName: 'Dhoondh',
    title: 'Job Portal For Established Companies and New Industry Professional Leaders',
    url: 'https://dhoondh.in',
    domain: 'dhoondh.in',
    image: '/image4.png',
    alt: 'Job Portal For Established Companies and New Industry Professional Leaders  -  Dhoondh'
  },
  {
    clientName: 'thenote.earth',
    title: 'Sustainability and Impact Platform',
    url: 'https://thenote.earth',
    domain: 'thenote.earth',
    image: '/note.png',
    alt: 'World\'s First Zero Plastic Pen  -  thenote.earth'
  },
  {
    clientName: 'ONX STUDIO',
    title: 'Creative Studio and Brand Experience',
    url: 'https://onxstudio.com',
    domain: 'onxstudio.com',
    image: '/onx.png',
    alt: 'ONX STUDIO  -  Creative Studio and Brand Experience'
  },
  {
    clientName: 'DataBot Labs',
    title: 'Robotics & Automation E-Commerce Platform',
    url: 'https://databot-labs.com',
    domain: 'databot-labs.com',
    image: '/Image5.png',
    alt: 'DataBot Labs  -  Robotics & Automation E-Commerce Platform'
  },
  {
    clientName: 'Aniyah',
    title: 'Modern and Women Product Sell Focus Ecommerce Website',
    url: '#',
    domain: 'https://kurtis-ecommerce-2025.vercel.app/',
    image: '/Image6.png',
    alt: 'Aniyah  -  Modern and Women Product Sell Focus Ecommerce Website'
  }
];

const whyStay = [
  'Senior engineers who own work from design to deployment.',
  'Predictable delivery and clear communication, not just billable hours.',
  'Systems built so your team can understand, maintain, and extend them.',
  'Ongoing support and iterations so your product keeps evolving.'
];

const stats = [
  { value: '25+', label: 'Projects delivered' },
  { value: '10+', label: 'Industries served' },
  { value: '95%', label: 'Client satisfaction' }
];

export default function Clients() {
  return (
    <div className="overflow-x-hidden bg-white selection:bg-primary-100 selection:text-primary-900 font-sans">
      <SEO
        title="Clients & Work"
        description="Featured clients and projects by Rastogi Codeworks. Finance dashboards, revamped websites, job portals, and digital products we've built for startups and enterprises across India and globally."
        path="/clients"
        keywords="Rastogi Codeworks clients, software development portfolio, web development projects India, case studies, client work"
      />
      {/* Hero  -  refined, editorial */}
      <section className="relative min-h-[85vh] flex items-center pt-28 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] animate-grid-fade pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-50/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,197,94,0.08),transparent)] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-slate-200/80 text-slate-600 text-sm font-medium mb-6 shadow-sm shadow-slate-200/50 backdrop-blur-sm">
            <Building2 className="w-4 h-4 text-primary-600" />
            <span className="uppercase tracking-widest">Clients &amp; Case Studies</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-8 leading-[1.08] mt-0">
            Partners who{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-500 to-teal-500">
              ship with confidence
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-12 font-medium">
            We work with founders, product teams, and growing companies to build software that moves their business forward.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-primary-600 text-white font-bold text-base shadow-lg shadow-primary-500/25 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Start a project
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <a
              href="#projects"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white border-2 border-slate-200 text-slate-700 font-bold text-base hover:border-primary-200 hover:bg-primary-50/50 hover:text-primary-700 transition-all duration-300"
            >
              View our work
            </a>
          </div>
        </div>
      </section>

      {/* Stats  -  glass bar */}
      <section className="relative -mt-8 z-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/60 shadow-xl shadow-slate-200/50 p-8 md:p-10">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-10 sm:gap-16">
              {stats.map((stat, i) => (
                <div key={i} className="text-center group">
                  <p className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-500 tracking-tight group-hover:scale-105 transition-transform duration-300">
                    {stat.value}
                  </p>
                  <p className="text-sm font-semibold text-slate-500 mt-2 uppercase tracking-widest">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Who we work with */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-semibold text-primary-600 uppercase tracking-widest mb-4">Who we work with</p>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6 leading-tight">
              From early-stage startups to established brands
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Our clients care about quality, reliability, and a team that thinks with them - not just codes for them.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
            {clientLogos.map((name) => (
              <div
                key={name}
                className="group h-24 md:h-28 rounded-2xl border border-slate-100 bg-slate-50/80 flex items-center justify-center text-xs font-bold text-slate-400 uppercase tracking-wider hover:border-primary-200 hover:bg-primary-50/50 hover:text-primary-600 transition-all duration-300 hover:shadow-md"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects  -  same design as Home "Selected Work" */}
      <section id="projects" className="py-24 md:py-32 bg-primary-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 text-primary-700 text-sm font-semibold mb-6">
                <Briefcase className="w-4 h-4" />
                <span>Featured work</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-primary-950 mb-4">
                Projects we&apos;ve delivered
              </h2>
              <p className="text-lg text-slate-600 max-w-xl">
                A showcase of our recent projects where design meets engineering excellence.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 stagger-children">
            {featuredWork.map((project) => (
              <a
                key={project.clientName}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 block"
              >
                <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                  <img
                    src={project.image}
                    alt={project.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 p-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
                    <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-medium mb-3">
                      {project.clientName}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-white/80 text-sm">{project.domain}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Why clients stay + CTA */}
      <section className="py-24 md:py-32 bg-slate-50/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div>
              <p className="text-sm font-semibold text-primary-600 uppercase tracking-widest mb-4">Why clients stay</p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-6 leading-tight">
                Long-term partnerships, not one-off projects
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-10">
                Many projects turn into ongoing collaborations. We help teams iterate, improve performance, and keep shipping without burning out.
              </p>
              <ul className="space-y-5">
                {whyStay.map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-slate-700">
                    <CheckCircle className="w-6 h-6 text-primary-500 shrink-0 mt-0.5" />
                    <span className="text-base font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="rounded-3xl bg-gradient-to-br from-primary-700 to-primary-900 text-white p-10 md:p-12 shadow-2xl shadow-primary-900/20 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-500/20 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="relative z-10">
                  <Quote className="w-12 h-12 text-primary-200/80 mb-8" />
                  <h3 className="text-2xl md:text-3xl font-bold mb-5 tracking-tight">
                    Looking for a long-term partner?
                  </h3>
                  <p className="text-primary-100 text-lg leading-relaxed mb-6">
                    Planning your next release or need help stabilizing an existing product? We&apos;d love to hear what you&apos;re building.
                  </p>
                  <p className="text-sm text-primary-200 mb-10">
                    Share your company, your users, and your goals - we&apos;ll respond with concrete next steps.
                  </p>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center px-7 py-4 rounded-full bg-white text-primary-800 font-bold hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    Get in touch
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PageCTA
        badge="Ready to join them?"
        title="Tell us about your project"
        subtitle="We'll get back with a clear plan and next steps."
        buttonText="Start a conversation"
      />
    </div>
  );
}
