import { Link } from 'react-router-dom';
import PageCTA from '../components/PageCTA';
import SEO from '../components/SEO';

export default function Documentation() {
  return (
    <div className="overflow-x-hidden bg-white">
      <SEO
        title="Documentation"
        description="Technical documentation, guides, and APIs for Rastogi Codeworks products and services. Get help with integration, setup, and best practices for software development."
        path="/documentation"
        keywords="Rastogi Codeworks documentation, technical guides, API docs, software development documentation"
      />
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.4] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-primary-950 mb-6">
            Documentation
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Guides, APIs, and technical documentation for our products and services.
          </p>
        </div>
      </section>
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-slate-600 leading-relaxed mb-8">
          Documentation is being prepared. For technical or integration questions, reach out via our contact page.
        </p>
        <Link to="/contact" className="text-primary-600 font-semibold hover:underline">
          Contact us →
        </Link>
      </section>
      <PageCTA badge="Need help?" title="Let's talk technical" subtitle="We're happy to walk you through integrations and best practices." />
    </div>
  );
}
