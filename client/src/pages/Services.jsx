import { Link } from 'react-router-dom';
import PageCTA from '../components/PageCTA';
import SEO from '../components/SEO';
import AnimateOnScroll from '../components/AnimateOnScroll';
import { 
  ArrowRight, Code, Zap, Globe, CheckCircle, HelpCircle, ChevronDown, ChevronUp
} from 'lucide-react';
import { useState } from 'react';
import { services } from '../data/services';
import { citiesForSEO } from '../data/locations';

const reasons = [
  {
    title: "Senior Engineering Talent",
    desc: "Our developers ship production-ready web and mobile apps using modern stacks - React, Node.js, Next.js, and cloud platforms. You get scalable, maintainable software built to last.",
    icon: <Code className="w-6 h-6" />
  },
  {
    title: "Agile & Iterative Delivery",
    desc: "We work in short sprints with clear milestones. You see progress every two weeks, give feedback early, and reduce risk - so we build exactly what your business needs.",
    icon: <Zap className="w-6 h-6" />
  },
  {
    title: "Transparent Communication",
    desc: "Weekly syncs, shared boards, and no surprise deadlines. You stay in the loop with live demos and direct access to the team so decisions stay fast and aligned.",
    icon: <Globe className="w-6 h-6" />
  },
  {
    title: "Quality & Security Built In",
    desc: "Every release is tested and code-reviewed. We follow security best practices and write clean, documented code so your product is reliable, secure, and easy to evolve.",
    icon: <CheckCircle className="w-6 h-6" />
  }
];

const faqs = [
  {
    question: "How do you estimate project costs?",
    answer: "We provide detailed proposals based on the scope of work, complexity, and timeline. We offer both fixed-price and time-and-materials models to suit your needs."
  },
  {
    question: "What technologies do you specialize in?",
    answer: "We are experts in the MERN stack (MongoDB, Express, React, Node.js), Next.js, Python, AWS, and mobile technologies like React Native and Flutter."
  },
  {
    question: "Do you provide post-launch support?",
    answer: "Absolutely. We offer various maintenance and support packages to ensure your application remains secure, up-to-date, and performs optimally."
  },
  {
    question: "How long does a typical project take?",
    answer: "Timelines vary depending on the project size. A simple MVP might take 4-8 weeks, while complex enterprise solutions can take 3-6 months or more."
  }
];

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-200 last:border-0">
      <button 
        className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-primary-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-primary-600 transition-colors" />
        )}
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-slate-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export default function Services() {
  return (
    <div className="overflow-x-hidden bg-white selection:bg-primary-100 selection:text-primary-900">
      <SEO
        title="Services"
        description={`Custom software development, web development, mobile apps, cloud, and IT services across India. Mumbai, Delhi, Bangalore, Pune, Hyderabad, Chennai, ${citiesForSEO}. Get a tailored quote from Rastogi Codeworks.`}
        path="/services"
        keywords="software development services India, web development company, custom app development, cloud services, mobile app development, IT consulting India, Rastogi Codeworks services"
      />
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.4] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse-soft" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-100/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-primary-200 text-primary-700 text-sm font-medium mb-8 shadow-sm backdrop-blur-sm animate-fade-in-down">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            Our Expertise
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary-950 mb-6 text-balance animate-fade-in-up">
            Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-teal-500">Digital Excellence</span> for Your Business.
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 text-pretty animate-fade-in-up animation-delay-200">
            We combine technical depth with creative strategy to build software that drives real growth. From startups to enterprises, we deliver results.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-300">
            <Link 
              to="/contact" 
              className="px-8 py-4 rounded-full bg-primary-600 text-white font-bold text-lg shadow-lg shadow-primary-500/30 hover:bg-primary-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Start a Project
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a 
              href="#services-grid" 
              className="px-8 py-4 rounded-full bg-white text-slate-700 font-bold text-lg border border-slate-200 hover:border-primary-200 hover:bg-primary-50 transition-all duration-300 flex items-center justify-center"
            >
              Explore Services
            </a>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services-grid" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Row 1: Software & App Development (big left) + Organization Setup (short right) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <Link to={`/services/${services[1].id}`} className="md:col-span-2 group relative flex flex-col p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:border-primary-100 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              <div className="absolute inset-0 rounded-[2rem] bg-transparent group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 p-0.5 mb-6 group-hover:scale-110 transition-transform duration-500">
                <div className="w-full h-full bg-white rounded-[0.9rem] flex items-center justify-center text-slate-700 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-br group-hover:from-primary-600 group-hover:to-primary-800">
                  {services[1].icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-primary-950 mb-3 group-hover:text-primary-700 transition-colors duration-300">{services[1].title}</h3>
              <p className="text-slate-600 mb-6 leading-relaxed text-pretty flex-grow">{services[1].shortDesc}</p>
              <div className="space-y-3 mb-6">
                {services[1].features.slice(0, 3).map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm font-medium text-slate-500 group-hover:text-slate-700 transition-colors duration-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary-500 to-primary-600" />
                    {feature}
                  </div>
                ))}
              </div>
              <span className="inline-flex items-center justify-center w-full py-3 rounded-xl bg-slate-50 text-slate-700 font-semibold group-hover:bg-primary-50 group-hover:text-primary-700 transition-all duration-300 mt-auto">
                View More
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link to={`/services/${services[0].id}`} className="group relative flex flex-col p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:border-primary-100 transition-all duration-500 hover:-translate-y-2 overflow-hidden md:justify-center">
              <div className="absolute inset-0 rounded-[2rem] bg-transparent group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 p-0.5 mb-4 group-hover:scale-110 transition-transform duration-500">
                <div className="w-full h-full bg-white rounded-[0.9rem] flex items-center justify-center text-slate-700 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-br group-hover:from-primary-600 group-hover:to-primary-800">
                  {services[0].icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-primary-950 mb-2 group-hover:text-primary-700 transition-colors duration-300">{services[0].title}</h3>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed text-pretty flex-grow">{services[0].shortDesc}</p>
              <span className="inline-flex items-center justify-center w-full py-2.5 rounded-xl bg-slate-50 text-slate-700 font-semibold text-sm group-hover:bg-primary-50 group-hover:text-primary-700 transition-all duration-300 mt-auto">
                View More
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
          {/* Row 2: Security & Compliance (big left) + Infrastructure & Cloud (short right) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <Link to={`/services/${services[3].id}`} className="md:col-span-2 group relative flex flex-col p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:border-primary-100 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              <div className="absolute inset-0 rounded-[2rem] bg-transparent group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 p-0.5 mb-6 group-hover:scale-110 transition-transform duration-500">
                <div className="w-full h-full bg-white rounded-[0.9rem] flex items-center justify-center text-slate-700 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-br group-hover:from-primary-600 group-hover:to-primary-800">
                  {services[3].icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-primary-950 mb-3 group-hover:text-primary-700 transition-colors duration-300">{services[3].title}</h3>
              <p className="text-slate-600 mb-6 leading-relaxed text-pretty flex-grow">{services[3].shortDesc}</p>
              <div className="space-y-3 mb-6">
                {services[3].features.slice(0, 3).map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm font-medium text-slate-500 group-hover:text-slate-700 transition-colors duration-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary-500 to-primary-600" />
                    {feature}
                  </div>
                ))}
              </div>
              <span className="inline-flex items-center justify-center w-full py-3 rounded-xl bg-slate-50 text-slate-700 font-semibold group-hover:bg-primary-50 group-hover:text-primary-700 transition-all duration-300 mt-auto">
                View More
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link to={`/services/${services[2].id}`} className="group relative flex flex-col p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:border-primary-100 transition-all duration-500 hover:-translate-y-2 overflow-hidden md:justify-center">
              <div className="absolute inset-0 rounded-[2rem] bg-transparent group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 p-0.5 mb-4 group-hover:scale-110 transition-transform duration-500">
                <div className="w-full h-full bg-white rounded-[0.9rem] flex items-center justify-center text-slate-700 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-br group-hover:from-primary-600 group-hover:to-primary-800">
                  {services[2].icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-primary-950 mb-2 group-hover:text-primary-700 transition-colors duration-300">{services[2].title}</h3>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed text-pretty flex-grow">{services[2].shortDesc}</p>
              <span className="inline-flex items-center justify-center w-full py-2.5 rounded-xl bg-slate-50 text-slate-700 font-semibold text-sm group-hover:bg-primary-50 group-hover:text-primary-700 transition-all duration-300 mt-auto">
                View More
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
          {/* Row 3: All three last services in one row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.slice(4).map((service) => (
              <Link
                key={service.id}
                to={`/services/${service.id}`}
                className="group relative flex flex-col p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:border-primary-100 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              >
                <div className="absolute inset-0 rounded-[2rem] bg-transparent group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 p-0.5 mb-4 group-hover:scale-110 transition-transform duration-500">
                  <div className="w-full h-full bg-white rounded-[0.9rem] flex items-center justify-center text-slate-700 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-br group-hover:from-primary-600 group-hover:to-primary-800">
                    {service.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-primary-950 mb-2 group-hover:text-primary-700 transition-colors duration-300">{service.title}</h3>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed text-pretty flex-grow">{service.shortDesc}</p>
                <span className="inline-flex items-center justify-center w-full py-2.5 rounded-xl bg-slate-50 text-slate-700 font-semibold text-sm group-hover:bg-primary-50 group-hover:text-primary-700 transition-all duration-300 mt-auto">
                  View More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Marquee (Simplified) */}
      <section className="py-12 bg-slate-50 border-y border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Powered by Modern Technologies</p>
        </div>
        <div className="relative flex overflow-x-hidden group">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-16 px-8">
            {['React', 'Node.js', 'Next.js', 'TypeScript', 'Python', 'AWS', 'Docker', 'GraphQL', 'Tailwind', 'MongoDB'].map((tech, i) => (
              <span key={i} className="text-2xl md:text-3xl font-bold text-slate-300 hover:text-primary-400 transition-colors duration-300 cursor-default">
                {tech}
              </span>
            ))}
             {['React', 'Node.js', 'Next.js', 'TypeScript', 'Python', 'AWS', 'Docker', 'GraphQL', 'Tailwind', 'MongoDB'].map((tech, i) => (
              <span key={`dup-${i}`} className="text-2xl md:text-3xl font-bold text-slate-300 hover:text-primary-400 transition-colors duration-300 cursor-default">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Why Partner With Us  -  modern & aesthetic */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-primary-50/30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-200/20 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-primary-100 text-primary-600 text-sm font-semibold uppercase tracking-wider shadow-sm backdrop-blur-sm mb-6">
              Why partner with us
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-5 tracking-tight">
              We build software that{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-500 to-teal-500">
                drives results.
              </span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              From custom web and mobile apps to cloud and automation - we deliver on time, with clear communication and quality built in.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 stagger-children">
            {reasons.map((reason, idx) => (
              <div
                key={idx}
                className="group relative bg-white rounded-2xl p-7 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-1 hover:border-primary-100 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center text-primary-600 mb-5 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary-500/20 transition-all duration-300">
                    {reason.icon}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2 text-lg">{reason.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{reason.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative rounded-2xl bg-white/80 backdrop-blur-md border border-white/60 shadow-lg shadow-slate-200/50 p-8 md:p-10">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/5 via-transparent to-teal-500/5 pointer-events-none" />
            <div className="relative flex flex-col sm:flex-row justify-center items-center gap-10 sm:gap-16">
              <div className="text-center group">
                <p className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-500 group-hover:scale-105 transition-transform duration-300">95%</p>
                <p className="text-sm font-medium text-slate-500 mt-2 uppercase tracking-wider">Client satisfaction</p>
              </div>
              <div className="hidden sm:block w-px h-14 bg-gradient-to-b from-transparent via-slate-200 to-transparent" />
              <div className="text-center group">
                <p className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-500 group-hover:scale-105 transition-transform duration-300">25+</p>
                <p className="text-sm font-medium text-slate-500 mt-2 uppercase tracking-wider">Projects delivered</p>
              </div>
              <div className="hidden sm:block w-px h-14 bg-gradient-to-b from-transparent via-slate-200 to-transparent" />
              <div className="text-center group">
                <p className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-500 group-hover:scale-105 transition-transform duration-300">24/7</p>
                <p className="text-sm font-medium text-slate-500 mt-2 uppercase tracking-wider">Support available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Locations - modern, aesthetic, SEO-optimized */}
      <section className="relative py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-primary-50/30" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-primary-200/25 blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4" />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll variant="scale">
          <div className="rounded-3xl border border-primary-100/80 bg-white/80 backdrop-blur-sm shadow-lg shadow-primary-500/5 p-8 md:p-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-200/60 text-primary-700 text-sm font-medium mb-6">
              <Globe className="w-4 h-4 text-primary-600" />
              <span>We Serve All of India</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary-950 mb-4 tracking-tight">
              Best Services Across Every State & City
            </h2>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
              Rastogi Codeworks delivers software development, web development, and digital solutions across India - in every state and union territory, from metros to tier‑2 cities.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-600 text-white font-semibold shadow-lg shadow-primary-500/25 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Get a free consultation
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 text-sm font-medium mb-6 shadow-sm">
              <HelpCircle className="w-4 h-4" />
              <span>Common Questions</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to know about working with us.
            </p>
          </div>
          
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      <PageCTA
        title="Ready to transform your business?"
        subtitle="Let's build something extraordinary together. Schedule a free consultation to discuss your vision."
        buttonText="Get a Free Consultation"
      />
    </div>
  );
}
