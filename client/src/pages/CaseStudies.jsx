import { Link } from 'react-router-dom';
import { Target, Zap, TrendingUp, ArrowRight } from 'lucide-react';
import PageCTA from '../components/PageCTA';
import SEO from '../components/SEO';
import AnimateOnScroll from '../components/AnimateOnScroll';

const caseStudies = [
  {
    id: 'nb-aurum',
    client: 'Nb Aurum',
    tagline: 'Finance & Solar Solutions',
    challenge: 'Outdated platform and manual processes were slowing growth and increasing operational risk.',
    solution: 'We built a modern finance dashboard and streamlined workflows with custom software and integrations.',
    result: 'Faster reporting, better visibility, and a scalable foundation for new products.',
    link: 'https://nbaurum.com',
    linkLabel: 'nbaurum.com',
  },
  {
    id: 'yd-advisory',
    client: 'YD Advisory',
    tagline: 'Finance & Advisory (MNC)',
    challenge: 'The existing website no longer reflected the brand or supported lead generation effectively.',
    solution: 'A full revamp with clear service pages, trust signals, and a responsive experience for global clients.',
    result: 'A professional online presence that supports business development and client acquisition.',
    link: 'https://ydadvisory.ae',
    linkLabel: 'ydadvisory.ae',
  },
  {
    id: 'rastogi-associates',
    client: 'Rastogi & Associates',
    tagline: 'Taxation & Law Firm',
    challenge: 'The firm needed a credible, easy-to-update web presence that matched their professional standing.',
    solution: 'We designed and built a clean, content-focused site with clear navigation and contact paths.',
    result: 'A site that builds trust and makes it easy for clients to find the right expertise.',
    link: 'https://rastogiassociates.com',
    linkLabel: 'rastogiassociates.com',
  },
  {
    id: 'dhoondh',
    client: 'Dhoondh',
    tagline: 'Job Portal',
    challenge: 'Connecting companies with talent required a reliable, scalable job and candidate management platform.',
    solution: 'We delivered a custom job portal with search, applications, and admin tools tailored to their workflow.',
    result: 'A platform that serves both employers and job seekers with a smooth experience.',
    link: 'https://dhoondh.in',
    linkLabel: 'dhoondh.in',
  },
];

export default function CaseStudies() {
  return (
    <div className="overflow-x-hidden bg-white">
      <SEO
        title="Case Studies"
        description="Case studies: how Rastogi Codeworks built finance dashboards, revamped websites, and job portals for Nb Aurum, YD Advisory, Rastogi & Associates, Dhoondh. Real results for startups and enterprises."
        path="/case-studies"
        keywords="software development case studies, web development projects, Rastogi Codeworks portfolio, client success stories, India"
      />
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.4] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <p className="text-sm font-semibold text-primary-600 uppercase tracking-widest mb-4">Real projects</p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-primary-950 mb-6">
            Case Studies
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            How we help businesses ship and scale with custom software and digital solutions.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {caseStudies.map((cs, i) => (
              <AnimateOnScroll key={cs.id} variant="up" delay={i * 80}>
                <article className="rounded-2xl border border-primary-100 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6 md:p-8 lg:p-10">
                    <div className="flex flex-wrap items-baseline gap-3 mb-6">
                      <h2 className="text-2xl md:text-3xl font-bold text-primary-950">{cs.client}</h2>
                      <span className="text-slate-500 font-medium">{cs.tagline}</span>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                          <Target className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-primary-950 mb-1">Challenge</h3>
                          <p className="text-slate-600 text-sm leading-relaxed">{cs.challenge}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                          <Zap className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-primary-950 mb-1">Solution</h3>
                          <p className="text-slate-600 text-sm leading-relaxed">{cs.solution}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-primary-950 mb-1">Result</h3>
                          <p className="text-slate-600 text-sm leading-relaxed">{cs.result}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-primary-100">
                      <a
                        href={cs.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700"
                      >
                        {cs.linkLabel}
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </article>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      <PageCTA
        badge="Your project"
        title="Want similar results?"
        subtitle="Tell us about your goals and we'll outline how we can help."
        buttonText="Get in touch"
        to="/contact"
      />
    </div>
  );
}
