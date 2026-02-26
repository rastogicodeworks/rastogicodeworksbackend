import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import PageCTA from '../components/PageCTA';
import SEO from '../components/SEO';
import AnimateOnScroll from '../components/AnimateOnScroll';

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

const heroSlides = [
  {
    id: 1,
    badge: 'Available for new projects',
    title: (
      <>
        We Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400 relative">
          Digital Experiences
          <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
            <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
          </svg>
        </span> That Matter.
      </>
    ),
    subtitle: 'From intuitive user interfaces to powerful backend systems, we craft software that drives growth and efficiency for your business.',
    primaryCta: 'Start Your Project',
    secondaryCta: 'View Services'
  },
  {
    id: 2,
    badge: 'Innovation First',
    title: (
      <>
        Scalable <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">Solutions</span> for Modern Businesses.
      </>
    ),
    subtitle: 'Future-proof your technology stack with our expert full-stack development and cloud infrastructure services designed for scale.',
    primaryCta: 'Get a Quote',
    secondaryCta: 'Our Work'
  },
  {
    id: 3,
    badge: 'Expert Team',
    title: (
      <>
        Your Vision, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">Engineered</span> to Perfection.
      </>
    ),
    subtitle: 'Partner with a team that understands your goals and delivers reliable, high-performance software on time and within budget.',
    primaryCta: 'Contact Us',
    secondaryCta: 'View Pricing',
    secondaryCtaTo: '/pricing'
  },
  {
    id: 4,
    badge: 'Next-Gen Tech',
    title: (
      <>
        Empowering Growth with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">Artificial Intelligence</span>.
      </>
    ),
    subtitle: 'Harness the power of AI and Machine Learning to automate workflows and unlock new opportunities for your enterprise.',
    primaryCta: 'Explore AI',
    secondaryCta: 'Case Studies'
  },
  {
    id: 5,
    badge: 'Mobile First',
    title: (
      <>
        Seamless Experiences on <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">Every Device</span>.
      </>
    ),
    subtitle: 'We craft responsive, high-performance mobile applications that keep your users engaged anywhere, anytime.',
    primaryCta: 'Mobile Solutions',
    secondaryCta: 'View Portfolio'
  }
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

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        setIsTransitioning(false);
      }, 500); // Wait for exit animation
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const slide = heroSlides[currentSlide];
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
        title="Home"
        description="Rastogi Codeworks - Best software development & web development across India. Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Pune, Kolkata and all states & cities. Where Code Meets Experience."
        path="/"
        jsonLd={organizationJsonLd}
      />
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-start md:justify-center items-center pt-28 pb-24 md:pt-48 md:pb-32 overflow-hidden bg-white">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.6] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white pointer-events-none" />
        
        {/* Animated Blobs Background */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
        
        {/* Glow Effects - Dynamic based on slide */}
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 bg-primary-200/40 rounded-full blur-3xl -z-10 animate-pulse-soft mix-blend-multiply transition-all duration-1000 ${currentSlide % 2 === 0 ? 'translate-x-0' : 'translate-x-20'}`} />
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-300/30 rounded-full blur-3xl -z-10 animate-pulse-soft mix-blend-multiply transition-all duration-1000 ${currentSlide % 2 === 0 ? 'translate-x-0' : '-translate-x-20'}`} style={{ animationDelay: '1s' }} />
        
        {/* Floating Shapes */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl opacity-20 animate-float-slow rotate-12 blur-sm" />
        <div className="absolute bottom-40 right-10 w-24 h-24 bg-gradient-to-br from-primary-300 to-primary-500 rounded-full opacity-20 animate-float-medium -rotate-12 blur-sm" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className={`transition-all duration-500 transform ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-primary-200 text-primary-700 text-sm font-medium mb-8 shadow-sm backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              {slide.badge}
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary-950 mb-6 text-balance min-h-[1.2em]">
              {slide.title}
            </h1>

            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 text-pretty min-h-[3.5em]">
              {slide.subtitle}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="group relative px-8 py-4 rounded-full bg-primary-600 text-white font-semibold text-lg overflow-hidden shadow-lg hover:shadow-primary-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                <span className="relative">{slide.primaryCta}</span>
              </Link>
              <Link
                to={slide.secondaryCtaTo || '/services'}
                className="px-8 py-4 rounded-full bg-white text-primary-700 border border-primary-200 font-semibold text-lg hover:bg-primary-50 hover:border-primary-300 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md"
              >
                {slide.secondaryCta}
              </Link>
              <a
                href="/Rastogicodeworks-Broucher.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download="Rastogi-Codeworks-Brochure.pdf"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/90 text-primary-700 border border-primary-200 font-semibold text-lg hover:bg-primary-50 hover:border-primary-300 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md backdrop-blur-sm"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download brochure
              </a>
            </div>
          </div>


          {/* Slide Indicators */}
          <div className="flex justify-center gap-2 mt-12">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setCurrentSlide(index);
                    setIsTransitioning(false);
                  }, 300);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentSlide === index ? 'w-8 bg-primary-600' : 'w-2 bg-primary-200 hover:bg-primary-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
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

      {/* Global Impact Section - Dark Hero Style */}
      <section className="relative py-32 bg-primary-950 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950 via-primary-900/90 to-primary-950" />
        
        {/* Animated Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-900/50 border border-primary-700/50 text-primary-300 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
                Global Reach
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
                Building Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-200">International Presence.</span>
              </h2>
              <p className="text-lg text-primary-200/80 leading-relaxed max-w-xl">
                We build software that scales globally. Our distributed architecture ensures your application performs flawlessly for users in Netherlands, Africa, UAE and Many More.
              </p>
              <div className="flex flex-wrap gap-8 pt-4">
                {[
                  { label: 'Countries 4+ Served', value: '4+' },
                  { label: 'Attraction', value: '95%' }
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-primary-400 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-primary-500/30 via-primary-600/10 to-transparent rounded-3xl blur-xl opacity-60" />
              <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-2xl p-6 shadow-2xl transition-all duration-500 hover:border-white/20 hover:shadow-primary-500/10">
                {/* Mini chart card */}
                <div className="rounded-2xl bg-white/[0.06] border border-white/10 p-5 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white/90 text-sm font-medium">Analytics</span>
                    <div className="w-8 h-8 rounded-xl bg-primary-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                    </div>
                  </div>
                  <div className="flex items-end justify-between gap-1 h-16">
                    {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-primary-600/60 to-primary-400/40 min-h-[4px] transition-all duration-300 hover:from-primary-500/80" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
                {/* Status + Notifications row */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="rounded-xl bg-emerald-500/10 border border-emerald-400/20 px-4 py-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">All systems go</p>
                      <p className="text-white/60 text-xs">Deployment complete</p>
                    </div>
                  </div>
                  <div className="rounded-xl bg-white/[0.06] border border-white/10 px-4 py-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary-500/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Notifications</p>
                      <p className="text-white/60 text-xs">2 new updates</p>
                    </div>
                  </div>
                </div>
                {/* Live session hero */}
                <div className="relative rounded-2xl overflow-hidden border border-white/10 group mb-4">
                  <img src="/meetings.png" alt="Live session - team collaboration and meetings" className="w-full h-45 object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-950/90 via-primary-900/40 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/20">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-white text-sm font-medium">Live Session</span>
                    </div>
                  </div>
                </div>
                {/* Footer: quick links + sync */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10 flex-wrap gap-3">
                  <div className="flex items-center gap-4 text-sm">
                    <Link to="/services" className="text-white/80 hover:text-white transition-colors font-medium">Services</Link>
                    <span className="text-white/30">·</span>
                    <Link to="/contact" className="text-white/80 hover:text-white transition-colors font-medium">Contact</Link>
                    <span className="text-white/30">·</span>
                    <Link to="/about" className="text-white/80 hover:text-white transition-colors font-medium">About</Link>
                  </div>
                  <div className="flex items-center gap-2 text-primary-300/90 text-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Real-time Sync Active
                  </div>
                </div>
              </div>
            </div>
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
          {/* Row 2: Security & Compliance (big left) + Infrastructure & Cloud (short right) */}
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
          {/* Row 3: All three last services in one row */}
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
              href="#"
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
              href="#"
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

      {/* Innovation Spotlight - Split Hero (marketing + SEO) */}
      <section className="py-24 bg-white overflow-hidden" aria-labelledby="innovation-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll variant="up">
          <div className="bg-primary-50 rounded-[3rem] p-8 md:p-12 lg:p-16 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-primary-200/30 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-primary-200/30 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
              <div className="order-2 lg:order-1">
                <div className="relative group">
                  <div className="absolute inset-0 bg-primary-600 rounded-2xl rotate-2 group-hover:rotate-1 transition-transform duration-500 opacity-20" />
                  <img 
                    src="/used.png" 
                    alt="Rastogi Codeworks development team building software with velocity - custom web and app development" 
                    className="relative rounded-2xl shadow-xl w-full h-auto object-cover transform -rotate-2 group-hover:rotate-0 transition-transform duration-500"
                  />
                  {/* Floating Badge */}
                  <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg animate-float-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Velocity</p>
                        <p className="text-lg font-bold text-primary-950">2x Faster</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="order-1 lg:order-2 space-y-6">
                <p className="text-sm font-semibold text-primary-600 uppercase tracking-widest">How we build</p>
                <h2 id="innovation-heading" className="text-3xl md:text-5xl font-bold text-primary-950 leading-tight">
                  Ship Faster. <br />
                  <span className="text-primary-600">Scale Smarter.</span>
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Custom software development that delivers. We combine proven processes with modern tech - AI, automation, and secure cloud infrastructure - so you get scalable applications and APIs without the guesswork.
                </p>
                <ul className="space-y-4 pt-4" role="list">
                  {[
                    'Faster delivery with agile development and clear milestones',
                    'Enterprise-grade security and compliance built in',
                    'Scalable architecture so your product grows with you'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-primary-800 font-medium">
                      <span className="w-6 h-6 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 text-xs flex-shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="pt-6">
                  <Link to="/about" className="text-primary-600 font-bold hover:text-primary-800 inline-flex items-center gap-2 transition-colors">
                    See how we build
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
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
              <div key={i} className="text-center group hover:-translate-y-1 transition-transform duration-300">
                <div className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-primary-200 mb-2">{stat.value}</div>
                <div className="text-primary-200/80 font-medium tracking-wide uppercase text-sm">{stat.label}</div>
              </div>
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
                <div key={i} className="relative group text-center">
                  <div className="w-24 h-24 mx-auto bg-white border-4 border-primary-100 rounded-full flex items-center justify-center text-2xl font-bold text-primary-600 mb-6 relative z-10 group-hover:border-primary-500 group-hover:scale-110 transition-all duration-300 shadow-sm">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-primary-950 mb-3">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed px-4">{item.desc}</p>
                </div>
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
