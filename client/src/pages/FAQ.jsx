import { Link } from 'react-router-dom';
import PageCTA from '../components/PageCTA';
import SEO from '../components/SEO';

const faqs = [
  {
    q: 'What software development services does Rastogi Codeworks offer?',
    a: 'We offer organization setup, custom software & app development (web and mobile), infrastructure & cloud, security & compliance, automation & AI, IT support & maintenance, and consulting & strategy. All services are available across India including Mumbai, Delhi, Bangalore, Hyderabad, Chennai, and Pune.',
  },
  {
    q: 'How do I get started with a project?',
    a: 'Reach out via our Contact page, email (rastogicodeworks@gmail.com), or WhatsApp. We\'ll schedule a call to understand your goals, scope, and timeline, then provide a clear proposal and next steps.',
  },
  {
    q: 'Do you work with startups and small businesses?',
    a: 'Yes. We work with startups, SMBs, and enterprises across industries. We tailor our engagement and pricing to your stage and needs.',
  },
  {
    q: 'What is your typical project timeline?',
    a: 'Timelines depend on scope. A simple MVP or website might take 4–8 weeks; complex web or mobile apps can take 3–6 months or more. We provide a detailed project plan and milestones after our initial discussion.',
  },
  {
    q: 'What technologies do you use?',
    a: 'We use modern stacks including React, Next.js, Node.js, MongoDB, and cloud platforms (AWS, etc.). For mobile we use React Native and Flutter. We choose tech based on your requirements and long-term maintainability.',
  },
  {
    q: 'Do you provide post-launch support and maintenance?',
    a: 'Yes. We offer maintenance and support packages so your application stays secure, up to date, and performant after launch.',
  },
  {
    q: 'Are your services available outside Delhi NCR?',
    a: 'Yes. We serve clients across India and internationally. We work remotely with regular syncs and can travel for key milestones when needed.',
  },
];

export default function FAQ() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <div className="overflow-x-hidden bg-white">
      <SEO
        title="FAQ"
        description="Frequently asked questions about Rastogi Codeworks: software development services, pricing, timelines, technologies, and how to start a project. Get answers before you contact us."
        path="/faq"
        keywords="Rastogi Codeworks FAQ, software development FAQ, web development questions, hire developers India, project timeline, tech stack"
        jsonLd={faqSchema}
      />
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] animate-grid-fade pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-primary-950 mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Everything you need to know about working with Rastogi Codeworks—services, process, and how to get started.
          </p>
        </div>
      </section>
      <section className="py-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="space-y-8">
          {faqs.map(({ q, a }, i) => (
            <li key={i} className="border-b border-primary-100 pb-8 last:border-0">
              <h2 className="text-lg font-semibold text-primary-950 mb-2">{q}</h2>
              <p className="text-slate-600 leading-relaxed">{a}</p>
            </li>
          ))}
        </ul>
        <div className="mt-12">
          <Link to="/contact" className="text-primary-600 font-semibold hover:underline">
            Still have questions? Contact us →
          </Link>
        </div>
      </section>
      <PageCTA badge="Get started" title="Ready to move forward?" subtitle="Tell us about your project and we'll take it from there." />
    </div>
  );
}
