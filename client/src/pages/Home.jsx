import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import PageCTA from '../components/PageCTA';
import SEO from '../components/SEO';
import AnimateOnScroll from '../components/AnimateOnScroll';
import { getLatestPosts } from '../data/blogPosts';

const logos = [
  'Nb Aurum',
  'Rastogi&Associates',
  'Yd Advisory',
  'Thenote.earth',
  'DataBot-Labs',
  'Dhoondh',
  'Rastogis Furnitures',
  'Rhine Advisory',
  'Sintora Ventures',
  'Onx Studio',
  'Many More Startups…',
];


const services = [
  {
    id: 'organization-setup',
    title: 'Organization Setup',
    desc: 'Structured setup of your technology and processes so your organization can scale with clarity and control.',
    span: 'md:col-span-2',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  },
  {
    id: 'software-app-development',
    title: 'Software & App Development',
    desc: 'Custom web and mobile applications built with modern stacks for performance, scale, and great user experience.',
    span: 'md:col-span-2',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    )
  },
  {
    id: 'infrastructure-cloud',
    title: 'Infrastructure & Cloud',
    desc: 'Reliable, scalable cloud infrastructure and DevOps practices so your systems stay secure and performant.',
    span: 'md:col-span-2',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    )
  },
  {
    id: 'security-compliance',
    title: 'Security & Compliance',
    desc: 'Protect your data and systems with security best practices and compliance frameworks tailored to your industry.',
    span: 'md:col-span-1',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    id: 'automation-ai',
    title: 'Automation & AI',
    desc: 'Streamline operations and unlock insights with process automation and AI solutions tailored to your business.',
    span: 'md:col-span-1',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    id: 'it-support-maintenance',
    title: 'IT Support & Maintenance',
    desc: 'Proactive support and maintenance so your systems run smoothly and issues are resolved quickly.',
    span: 'md:col-span-1',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  },
  {
    id: 'consulting-strategy',
    title: 'Consulting & Strategy',
    desc: 'Technology and digital strategy advice to align your roadmap with business goals and market opportunities.',
    span: 'md:col-span-1',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  }
];

const stats = [
  { value: '25+', label: 'Projects Completed 95%' },
  { value: '98%', label: 'Retention Rate' },
  { value: '3+', label: 'Years Experience' },
  { value: '24/7', label: 'Support' },
];

const testimonials = [
  {
    quote: "Rastogi Codeworks transformed our outdated platform into a modern, high-speed application. Their attention to detail is unmatched.",
    author: "Nb Aurum",
    role: "Finance & Solar Solutions"
  },
  {
    quote: "Professional, timely, and incredibly skilled. They didn't just build what we asked for; they improved upon our original vision.",
    author: "Rastogi & Associates",
    role: "Taxation & Law Firm"
  },
  {
    quote: "The best development partner we've worked with. The communication was clear, and the final product is flawless.",
    author: "YD Advisory",
    role: "Finance & Advisory"
  },
  {
    quote: "Their AI integration completely revolutionized our customer support workflow. Highly recommended!",
    author: "Thenote.earth",
    role: "Health Care"
  },
  {
    quote: "Scalable, secure, and stunning. The team understood our brand identity perfectly.",
    author: "DataBot-Labs",
    role: "Robotics Ecommerce & Selling"
  }
];

function CountUp({ value, duration = 1600 }) {
  const numMatch = value.match(/^(\d+)/);
  const num = numMatch ? parseInt(numMatch[1], 10) : null;
  const suffix = num !== null ? value.slice(String(num).length) : '';
  const [display, setDisplay] = useState('0');
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    if (!num) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let startTime = null;
          const animate = (ts) => {
            if (!startTime) startTime = ts;
            const progress = Math.min((ts - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(String(Math.round(eased * num)));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [num, duration]);

  if (!num) return <span>{value}</span>;
  return <span ref={ref}>{display}{suffix}</span>;
}

export default function Home() {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Rastogi Codeworks',
    url: 'https://rastogicodeworks.com',
    logo: 'https://rastogicodeworks.com/logo.png',
    description: 'Where Code Meets Experience. Professional software development and digital solutions across India.',
    areaServed: { '@type': 'Country', name: 'India' },
    sameAs: [],
  };

  return (
    <div className="overflow-x-hidden">
      <SEO
        title=""
        description="Rastogi Codeworks - Best software development & web development across India. Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Pune, Kolkata and all states & cities. Custom web apps, mobile apps, cloud & digital solutions. Where Code Meets Experience."
        path="/"
        keywords="software development India, web development company, custom software, mobile app development, Mumbai Delhi Bangalore, Rastogi Codeworks, digital solutions"
        jsonLd={organizationJsonLd}
      />
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center pt-28 md:pt-32 pb-20 overflow-hidden bg-white">
        {/* Background - white + soft green fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/70 via-white to-white pointer-events-none" />
        <div className="absolute top-0 right-0 w-[min(100%,420px)] h-[420px] bg-emerald-100/50 rounded-bl-[12rem] blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-50/60 rounded-tr-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-700 animate-fade-in-up">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse" />
            Where code meets experience
          </p>
          <h1 className="mt-8 text-4xl sm:text-5xl md:text-6xl lg:text-[3.5rem] font-bold tracking-tight text-slate-900 leading-[1.1] animate-fade-in-up delay-100">
            Custom software that{' '}
            <span className="text-primary-600">drives real growth.</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            We build web, mobile, and cloud solutions for startups and enterprises across India—delivered on time, built to scale.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4 animate-fade-in-up delay-300">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-2xl bg-primary-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-primary-600/30 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-600/25 hover:-translate-y-0.5 transition-all duration-300"
            >
              Start your project
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 hover:border-primary-300 hover:bg-primary-50/50 hover:text-primary-800 transition-all duration-300"
            >
              Our services
            </Link>
          </div>

          {/* Value pills */}
          <div className="mt-12 flex flex-wrap justify-center gap-3 animate-fade-in-up" style={{ animationDelay: '350ms' }}>
            {['On-time delivery', 'Scalable & secure', 'Pan-India support', 'Transparent pricing'].map((label, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary-100 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm"
              >
                <svg className="h-4 w-4 text-primary-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {label}
              </span>
            ))}
          </div>

        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-400">
          <svg className="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Logo Marquee */}
      <section className="py-10 border-y border-primary-100 bg-primary-50/30 overflow-hidden">
        <p className="text-center text-sm font-medium text-primary-600 uppercase tracking-widest mb-8">Trusted by innovative teams</p>
        <div className="relative flex overflow-x-hidden group">
          <div className="animate-marquee whitespace-nowrap flex gap-16 items-center">
            {[...logos, ...logos, ...logos].map((logo, i) => (
              <span key={i} className="text-2xl font-bold text-primary-300/80 hover:text-primary-400 transition-colors cursor-default">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid Services */}
      <section className="pt-24 pb-12 md:pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll variant="up" className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-primary-950 mb-4">Everything You Need</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We provide end-to-end software solutions tailored to your specific business needs.
            </p>
          </AnimateOnScroll>

          {/* Row 1: Software & App Development (big left) + Organization Setup (short right) */}
          <AnimateOnScroll variant="up" delay={0}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2 group relative p-8 rounded-3xl bg-white border border-primary-100 shadow-sm hover:shadow-xl hover:border-primary-200 transition-all duration-500 overflow-hidden hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-50 to-primary-100 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700 ease-out opacity-50" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                  {services[1].icon}
                </div>
                <h3 className="text-2xl font-bold text-primary-950 mb-3">{services[1].title}</h3>
                <p className="text-slate-600 leading-relaxed text-pretty mb-6">{services[1].desc}</p>
                <Link to={`/services/${services[1].id}`} className="inline-flex items-center gap-2 text-primary-600 font-semibold group-hover:gap-3 transition-all">
                  View More <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
            <div className="group relative p-6 rounded-3xl bg-white border border-primary-100 shadow-sm hover:shadow-xl hover:border-primary-200 transition-all duration-500 overflow-hidden hover:-translate-y-1 md:flex md:flex-col md:justify-center">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-50 to-primary-100 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-150 duration-700 ease-out opacity-50" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                  {services[0].icon}
                </div>
                <h3 className="text-xl font-bold text-primary-950 mb-2">{services[0].title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed text-pretty mb-4">{services[0].desc}</p>
                <Link to={`/services/${services[0].id}`} className="inline-flex items-center gap-2 text-primary-600 font-semibold text-sm group-hover:gap-3 transition-all">
                  View More <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
          </AnimateOnScroll>
          {/* Row 2: Security & Compliance (big left) + Infrastructure & Cloud (short right) */}
          <AnimateOnScroll variant="up" delay={80}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2 group relative p-8 rounded-3xl bg-white border border-primary-100 shadow-sm hover:shadow-xl hover:border-primary-200 transition-all duration-500 overflow-hidden hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-50 to-primary-100 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700 ease-out opacity-50" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                  {services[3].icon}
                </div>
                <h3 className="text-2xl font-bold text-primary-950 mb-3">{services[3].title}</h3>
                <p className="text-slate-600 leading-relaxed text-pretty mb-6">{services[3].desc}</p>
                <Link to={`/services/${services[3].id}`} className="inline-flex items-center gap-2 text-primary-600 font-semibold group-hover:gap-3 transition-all">
                  View More <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
            <div className="group relative p-6 rounded-3xl bg-white border border-primary-100 shadow-sm hover:shadow-xl hover:border-primary-200 transition-all duration-500 overflow-hidden hover:-translate-y-1 md:flex md:flex-col md:justify-center">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-50 to-primary-100 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-150 duration-700 ease-out opacity-50" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                  {services[2].icon}
                </div>
                <h3 className="text-xl font-bold text-primary-950 mb-2">{services[2].title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed text-pretty mb-4">{services[2].desc}</p>
                <Link to={`/services/${services[2].id}`} className="inline-flex items-center gap-2 text-primary-600 font-semibold text-sm group-hover:gap-3 transition-all">
                  View More <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
          </AnimateOnScroll>
          {/* Row 3: All three last services in one row */}
          <AnimateOnScroll variant="up" delay={160}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.slice(4).map((service, i) => (
              <div
                key={i + 4}
                className="group relative p-6 rounded-3xl bg-white border border-primary-100 shadow-sm hover:shadow-xl hover:border-primary-200 transition-all duration-500 overflow-hidden hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-50 to-primary-100 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-150 duration-700 ease-out opacity-50" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-primary-950 mb-2">{service.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed text-pretty mb-4">{service.desc}</p>
                  <Link to={`/services/${service.id}`} className="inline-flex items-center gap-2 text-primary-600 font-semibold text-sm group-hover:gap-3 transition-all">
                    View More <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Featured Work / Projects */}
      <section className="pt-12 pb-24 md:pt-16 md:pb-24 bg-primary-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll variant="up" className="flex flex-col md:flex-row justify-between items-center md:items-end gap-4 mb-8">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-primary-950 mb-4">Selected Work</h2>
              <p className="text-lg text-slate-600 max-w-xl">
                A showcase of our recent projects where design meets engineering excellence.
              </p>
            </div>
            <div className="flex justify-center md:justify-end w-full md:w-auto shrink-0">
              <Link to="/clients" className="group inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                View all projects
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll variant="scale" delay={100}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Project 1  -  Nb Aurum Solutions */}
            <a
              href="https://nbaurum.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 block"
            >
              <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                <img 
                  src="/image.png" 
                  alt="Professional Finance Dashboard For Startup  -  Nb Aurum Solutions" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 p-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-medium mb-3">
                    Nb Aurum Solutions
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-2">Professional Finance Dashboard For Startup</h3>
                  <p className="text-white/80 text-sm">nbaurum.com</p>
                </div>
              </div>
            </a>

            {/* Project 2  -  YD Advisory */}
            <a
              href="https://ydadvisory.ae"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 block"
            >
              <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                <img 
                  src="/image2.png" 
                  alt="Revamped Website For Established Finance MNC  -  YD Advisory" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 p-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-medium mb-3">
                    YD Advisory
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-2">Revamped Website For Established Finance MNC</h3>
                  <p className="text-white/80 text-sm">ydadvisory.ae</p>
                </div>
              </div>
            </a>

            {/* Project 3  -  Rastogi & Associates */}
            <a
              href="https://rastogiassociates.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 block"
            >
              <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                <img 
                  src="/image3.png" 
                  alt="Professional Website For Established Taxation and Law Firm  -  Rastogi & Associates" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 p-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-medium mb-3">
                    Rastogi & Associates
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-2">Professional Website For Established Taxation and Law Firm</h3>
                  <p className="text-white/80 text-sm">rastogiassociates.com</p>
                </div>
              </div>
            </a>

            {/* Project 4  -  Dhoondh */}
            <a
              href="https://dhoondh.in"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 block"
            >
              <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                <img 
                  src="/image4.png" 
                  alt="Job Portal For Established Companies and New Industry Professional Leaders  -  Dhoondh" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 p-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-medium mb-3">
                    Dhoondh
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-2">Job Portal For Established Companies and New Industry Professional Leaders</h3>
                  <p className="text-white/80 text-sm">dhoondh.in</p>
                </div>
              </div>
            </a>

            {/* Project 5  -  DataBot Labs */}
            <a
              href="https://databot-labs.com"
              className="group relative rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 block"
            >
              <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                <img 
                  src="/Image5.png" 
                  alt="DataBot Labs  -  Professional Ecommerce Website for Sale Robots" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 p-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-medium mb-3">
                    DataBot Labs
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-2">Professional Ecommerce Website for Sale Robots</h3>
                  <p className="text-white/80 text-sm">databotlabs.com</p>
                </div>
              </div>
            </a>

            {/* Project 6  -  Aniyah */}
            <a
              href="https://kurtis-ecommerce-2025.vercel.app/"
              className="group relative rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 block"
            >
              <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                <img 
                  src="/Image6.png" 
                  alt="Aniyah  -  Modern and Women Product Sell Focus Ecommerce Website" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 p-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-medium mb-3">
                    Aniyah
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-2">Modern and Women Product Sell Focus Ecommerce Website</h3>
                  <p className="text-white/80 text-sm">aniyah.com</p>
                </div>
              </div>
            </a>
            </div>
          </AnimateOnScroll>
        </div>
      </section>


      {/* Brochure - Download PDF */}
      <section className="py-24 bg-white relative overflow-hidden" aria-labelledby="brochure-heading">
        <div className="absolute left-0 bottom-0 w-[500px] h-[500px] bg-primary-100/30 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimateOnScroll variant="scale">
          <div className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-50/50 border border-primary-100/80 shadow-xl shadow-primary-900/5">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(34,197,94,0.08),transparent)] pointer-events-none" />
            <div className="relative z-10 p-8 sm:p-10 md:p-12 lg:p-16">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-12">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-600">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary-600 uppercase tracking-widest mb-2">Company overview</p>
                    <h2 id="brochure-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-950 tracking-tight mb-3">
                      Download our brochure
                    </h2>
                    <p className="text-slate-600 text-lg max-w-xl leading-relaxed">
                      Get our company brochure with services, approach, and how we work. One PDF to share with your team or keep for reference.
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <a
                    href="/Rastogicodeworks-Broucher.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    download="Rastogi-Codeworks-Brochure.pdf"
                    className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-primary-600 text-white font-semibold text-base shadow-lg shadow-primary-500/25 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Download brochure (PDF)
                  </a>
                </div>
              </div>
            </div>
          </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 to-primary-950/50 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, i) => (
              <AnimateOnScroll key={i} variant="up" delay={i * 100} className="text-center group hover:-translate-y-1 transition-transform duration-300">
                <div className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-primary-200 mb-2">
                  <CountUp value={stat.value} />
                </div>
                <div className="text-primary-200/80 font-medium tracking-wide uppercase text-sm">{stat.label}</div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute right-0 top-1/4 w-1/2 h-1/2 bg-gradient-to-b from-primary-50 to-transparent rounded-l-full opacity-50 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-primary-950 mb-4">How We Work</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A transparent, agile process designed to deliver value at every step.
            </p>
          </div>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary-200 to-transparent" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: '01', title: 'Understand & Plan', desc: 'We dive deep into your vision, market needs, and technical requirements to create a solid roadmap.' },
                { step: '02', title: 'Build Your Product', desc: 'Our expert engineers craft your solution using cutting-edge technologies for maximum performance.' },
                { step: '03', title: 'Seamless Deployment', desc: 'We handle the complex infrastructure setup to ensure your product launches smoothly and securely.' },
                { step: '04', title: 'Online Presence', desc: 'We help you establish a dominant digital footprint to attract users and grow your brand authority.' }
              ].map((item, i) => (
                <AnimateOnScroll key={i} variant="up" delay={i * 120} className="relative group text-center">
                  <div className="w-24 h-24 mx-auto bg-white border-4 border-primary-100 rounded-full flex items-center justify-center text-2xl font-bold text-primary-600 mb-6 relative z-10 group-hover:border-primary-500 group-hover:scale-110 transition-all duration-300 shadow-sm">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-primary-950 mb-3">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed px-4">{item.desc}</p>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Infinite Scroll */}
      <section className="py-24 bg-primary-950 overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Loved by Founders</h2>
          <p className="text-lg text-primary-200/60">Don't just take our word for it.</p>
        </div>

        <div className="relative w-full">
          {/* Gradient Masks */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-primary-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-primary-950 to-transparent z-10 pointer-events-none" />
          
          {/* Scrolling Track */}
          <div className="flex animate-marquee gap-8 w-max hover:[animation-play-state:paused]">
            {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
              <div 
                key={i} 
                className="w-[400px] bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex text-primary-400 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.603-.921 1.902 0 l 1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-primary-100/90 mb-6 italic text-lg leading-relaxed">"{t.quote}"</p>
                </div>
                
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center font-bold text-white text-xl shadow-lg shrink-0">
                    {t.author[0]}
                  </div>
                  <div>
                    <div className="font-bold text-white">{t.author}</div>
                    <div className="text-sm text-primary-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest from the blog - content marketing */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll variant="up" className="flex flex-col md:flex-row justify-between items-center md:items-end gap-4 mb-10">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-primary-950 mb-4">Latest from the blog</h2>
              <p className="text-lg text-slate-600 max-w-xl">
                Insights on software strategy, agile delivery, and building products that scale.
              </p>
            </div>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors shrink-0"
            >
              View all posts <ArrowRight className="w-5 h-5" />
            </Link>
          </AnimateOnScroll>
          <div className="grid md:grid-cols-3 gap-6">
            {getLatestPosts(3).map((post, i) => (
              <AnimateOnScroll key={post.slug} variant="up" delay={i * 80}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="block rounded-2xl border border-primary-100 bg-white p-6 shadow-sm hover:shadow-lg hover:border-primary-200 transition-all duration-300 group"
                >
                  <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">{post.category}</span>
                  <h3 className="text-xl font-bold text-primary-950 mt-2 mb-2 group-hover:text-primary-700 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 text-sm line-clamp-2">{post.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-primary-600 font-semibold text-sm mt-4 group-hover:gap-2 transition-all">
                    Read article <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Locations - modern, aesthetic, SEO-optimized */}
      <section className="relative py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/40 via-white to-primary-50/30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary-200/20 blur-3xl pointer-events-none" />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll variant="scale">
          <div className="rounded-3xl border border-primary-100/80 bg-white/80 backdrop-blur-sm shadow-lg shadow-primary-500/5 p-8 md:p-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-200/60 text-primary-700 text-sm font-medium mb-6">
              <MapPin className="w-4 h-4 text-primary-600" />
              <span>Pan-India</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary-950 mb-4 tracking-tight">
              Best Services in All Cities & States of India
            </h2>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
              We deliver software development and digital solutions across every state and union territory in India - from metros to tier‑2 cities.
            </p>
            <Link
              to="/services#services-grid"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-600 text-white font-semibold shadow-lg shadow-primary-500/25 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              View our services
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
          </AnimateOnScroll>
        </div>
      </section>

      <PageCTA
        title="Ready to build something extraordinary?"
        subtitle="Let's collaborate to turn your vision into a high-performing digital reality."
        buttonText="Get Started Now"
      />
    </div>
  );
}
