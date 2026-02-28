import { Link } from 'react-router-dom';
import PageCTA from '../components/PageCTA';
import SEO from '../components/SEO';
import AnimateOnScroll from '../components/AnimateOnScroll';

export default function About() {
  return (
    <div className="overflow-x-hidden bg-white">
      <SEO
        title="About Us"
        description="Rastogi Codeworks is a software development company in India. We build custom web apps, mobile apps, and cloud solutions for startups and enterprises. Learn about our mission, team, and why we're trusted across Mumbai, Delhi, Bangalore, and pan-India."
        path="/about"
        keywords="about Rastogi Codeworks, software company India, web development company, custom software development, digital solutions India, tech team, Vasu Rastogi, software engineering"
      />
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.4] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse-soft" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-100/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-primary-200 text-primary-700 text-sm font-medium mb-8 shadow-sm backdrop-blur-sm animate-fade-in-down">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            Our Story
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary-950 mb-6 text-balance animate-fade-in-up">
            We Are <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">Architects</span> of the Digital Future.
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 text-pretty animate-fade-in-up animation-delay-200">
            Rastogi Codeworks isn't just a dev shop. We are a collective of thinkers, makers, and problem solvers dedicated to building software that matters.
          </p>
        </div>
      </section>

      {/* The Journey Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll variant="up">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-600 rounded-[2rem] rotate-3 group-hover:rotate-2 transition-transform duration-500 opacity-20 blur-sm" />
              <img 
                src="/about.png" 
                alt="Rastogi Codeworks team collaborating - Founded 2025, delivering excellence in software engineering" 
                className="relative rounded-[2rem] shadow-2xl w-full object-cover aspect-[4/3] transform transition-transform duration-500 group-hover:scale-[1.01]"
              />
            </div>
            
            <div className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold text-primary-950">
                Driven by <span className="text-primary-600">Passion</span>, <br />
                Defined by <span className="text-primary-600">Quality</span>.
              </h2>
              <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                <p>
                  Rastogi Codeworks builds custom software and digital solutions that scale with your business. From web and mobile apps to cloud infrastructure and automation, we turn complex requirements into clear, reliable products - so you ship faster and your users get experiences that convert.
                </p>
                <p>
                  We work as an extension of your team: we align on your goals, your users, and your timelines. That partnership - backed by modern tech, security best practices, and transparent communication - is how we deliver software that performs in the real world and supports long-term growth.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-8 pt-4">
                <div>
                  <div className="text-4xl font-bold text-primary-600 mb-1">25+</div>
                  <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Projects Delivered</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary-600 mb-1">95%</div>
                  <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Client Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* The Rastogi Difference */}
      <section className="py-24 bg-primary-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimateOnScroll variant="up">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Why We Are Different</h2>
            <p className="text-lg text-primary-200/80 max-w-2xl mx-auto">
              In a crowded market, we stand out by prioritizing what truly matters to your business.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Business-First Code',
                desc: "We don't just write code; we build for ROI. Every technical decision is aligned with your business goals to ensure maximum value.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                )
              },
              {
                title: 'Future-Proof Stack',
                desc: "We leverage modern, scalable technologies like Next.js and Node.js to ensure your product remains relevant and performant for years.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                )
              },
              {
                title: 'Transparent Comms',
                desc: "No black boxes. You get full visibility into our process, with regular updates and open channels of communication.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                )
              }
            ].map((item, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all duration-300 group">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-primary-200/80 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Our Culture */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold text-primary-950">
                A Culture of <br />
                <span className="text-primary-600">Continuous Growth.</span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Our team combines deep expertise in software development with a commitment to staying ahead of the curve. We invest in people and practices that deliver better outcomes for your projects - from modern frameworks and security standards to clear processes and on-time delivery.
              </p>
              <ul className="space-y-4">
                {[
                  'Agile delivery with clear milestones and regular updates',
                  'Secure, scalable code and deployment practices',
                  'Dedicated project ownership and transparent communication',
                  'Continuous learning on latest tech and best practices'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-primary-800 font-medium">
                    <span className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-xs">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 lg:order-2 relative">
              <div className="absolute -inset-4 bg-primary-100 rounded-[2rem] -rotate-2" />
              <img 
                src="/coding.png" 
                alt="Rastogi Codeworks - development and coding in action, modern software engineering workspace" 
                className="relative rounded-[2rem] shadow-xl w-full object-cover aspect-square rotate-2 hover:rotate-0 transition-transform duration-500 opacity-60 hover:opacity-85"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-primary-50/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission Card */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-primary-100 hover:shadow-xl hover:border-primary-200 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-primary-950 mb-4">Our Mission</h3>
              <p className="text-slate-600 leading-relaxed text-pretty">
                To empower businesses with scalable, high-performance digital solutions. We strive to demystify technology, making it an accessible and powerful asset for growth rather than a hurdle.
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-primary-100 hover:shadow-xl hover:border-primary-200 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-primary-950 mb-4">Our Vision</h3>
              <p className="text-slate-600 leading-relaxed text-pretty">
                To be the global standard for engineering excellence. We envision a future where every piece of software we build sets a new benchmark for reliability, user experience, and innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Footprint */}
      <section className="py-24 bg-primary-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Global Impact</h2>
          <p className="text-lg text-primary-200/80 max-w-2xl mx-auto mb-16">
            From local startups to international enterprises, our code powers businesses around the world.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '25+', label: 'Projects Completed' },
              { number: '98%', label: 'Retention Rate' },
              { number: '3+', label: 'Years Experience' },
              { number: '24/7', label: 'Support' }
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors">
                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-200 to-white mb-2">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-primary-200 font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Teaser */}
      <section className="py-24 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-primary-950 mb-4">Meet the Leader</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                The visionary leader driving our technical excellence and creative innovation.
              </p>
            </div>

            <div className="flex justify-center">
              {[
                {
                  name: 'Vasu Rastogi',
                  role: 'Founder & CEO',
                  image: '/Vasu.jpeg',
                  bio: 'As a Founder & CEO, Vasu Rastogi leads Rastogi Codeworks with a focus on building reliable software, transparent client relationships, and a team that ships with confidence. Passionate about turning ideas into products that move businesses forward.'
                }
              ].map((leader, i) => (
                <div key={i} className="group relative overflow-hidden rounded-3xl w-full max-w-sm">
                  <img 
                    src={leader.image} 
                    alt={leader.name} 
                    className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-950/90 via-primary-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                    <h3 className="text-2xl font-bold text-white mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{leader.name}</h3>
                    <p className="text-primary-300 font-medium mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{leader.role}</p>
                    <p className="text-slate-300 text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">{leader.bio}</p>
                  </div>
                </div>
              ))}
            </div>
         </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-primary-950 mb-4">Our Core Values</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              The principles that guide every line of code we write and every decision we make.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                title: 'Integrity', 
                desc: 'We believe in transparency. No hidden costs, no technical jargon - just honest partnership.',
                icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
              },
              { 
                title: 'Excellence', 
                desc: 'Good enough is not enough. We obsess over details to deliver pixel-perfect, bug-free software.',
                icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
              },
              { 
                title: 'Innovation', 
                desc: 'We stay ahead of the curve, constantly exploring new tech to give you a competitive edge.',
                icon: 'M13 10V3L4 14h7v7l9-11h-7z'
              },
              { 
                title: 'Collaboration', 
                desc: 'Your success is our success. We work with you, not just for you, as an extension of your team.',
                icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
              }
            ].map((value, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-white border border-primary-100 hover:border-primary-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={value.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-primary-950 mb-3">{value.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PageCTA
        badge="Let's build"
        title="Ready to build the future?"
        subtitle="Let's turn your ambitious ideas into reality with a team that cares about your success."
        buttonText="Start Your Project"
      />
    </div>
  );
}
