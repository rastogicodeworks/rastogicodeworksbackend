import { Link } from 'react-router-dom';
import PageCTA from '../components/PageCTA';
import SEO from '../components/SEO';

export default function RefundPolicy() {
  return (
    <div className="overflow-x-hidden bg-white">
      <SEO
        title="Refund Policy"
        description="Rastogi Codeworks refund policy: our approach to client satisfaction, payments, and refunds for software development and digital services."
        path="/refund-policy"
        keywords="Rastogi Codeworks refund policy, refunds, payment policy"
      />
      <section className="relative pt-32 pb-12 md:pt-48 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.4] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-primary-950 mb-6">
            Refund Policy
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>
      <section className="py-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-slate-600 leading-relaxed mb-6">
          Rastogi Codeworks aims for complete client satisfaction. Our refund approach is outlined below.
        </p>
        <h2 className="text-xl font-semibold text-primary-950 mt-8 mb-3">Project-based work</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          Refunds for custom development and consulting are handled on a case-by-case basis as per the terms of your project agreement. We typically work in phases with clear deliverables; any refund request should be raised as early as possible and will be evaluated fairly.
        </p>
        <h2 className="text-xl font-semibold text-primary-950 mt-8 mb-3">Payments and disputes</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          Payment terms (e.g. milestones, retainers) are agreed before work begins. If you are unsatisfied with a deliverable, we encourage you to contact us so we can resolve the issue before considering any refund.
        </p>
        <h2 className="text-xl font-semibold text-primary-950 mt-8 mb-3">Contact</h2>
        <p className="text-slate-600 leading-relaxed mt-8">
          For refund requests or questions, contact us at{' '}
          <a href={`mailto:rastogicodeworks@gmail.com?subject=${encodeURIComponent('Refund Policy enquiry')}&body=${encodeURIComponent('Hey,\n\nI am reaching out from your website regarding your Refund Policy.\n\nBest regards')}`} className="text-primary-600 font-medium hover:underline">
            rastogicodeworks@gmail.com
          </a>
          {' '}with your project reference and reason. We will respond within a few business days.
        </p>
        <Link to="/" className="inline-block mt-8 text-primary-600 font-semibold hover:underline">
          ← Back to Home
        </Link>
      </section>
      <PageCTA badge="We're here" title="Questions about payments?" subtitle="Reach out and we'll work with you to find a solution." />
    </div>
  );
}
