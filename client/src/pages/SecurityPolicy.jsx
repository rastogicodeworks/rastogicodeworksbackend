import { Link } from 'react-router-dom';
import PageCTA from '../components/PageCTA';
import SEO from '../components/SEO';

export default function SecurityPolicy() {
  return (
    <div className="overflow-x-hidden bg-white">
      <SEO
        title="Security Policy"
        description="Rastogi Codeworks security policy: how we protect your data, secure our website and client portal, and follow security best practices."
        path="/security-policy"
        keywords="Rastogi Codeworks security policy, data security, secure development"
      />
      <section className="relative pt-32 pb-12 md:pt-48 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.4] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-primary-950 mb-6">
            Security Policy
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            How we protect your data and our systems.
          </p>
        </div>
      </section>
      <section className="py-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-slate-600 leading-relaxed mb-6">
          Rastogi Codeworks takes security seriously. This page summarizes our approach to securing our website, services, and your information.
        </p>
        <h2 className="text-xl font-semibold text-primary-950 mt-8 mb-3">Data protection</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          We use industry-standard practices to protect data in transit and at rest. Access to your data is limited to personnel who need it to deliver and support our services.
        </p>
        <h2 className="text-xl font-semibold text-primary-950 mt-8 mb-3">Infrastructure and access</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          We rely on reputable hosting and tooling. Access to systems is controlled, logged, and reviewed. We apply updates and follow secure development practices where applicable.
        </p>
        <h2 className="text-xl font-semibold text-primary-950 mt-8 mb-3">Reporting vulnerabilities</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          If you believe you have found a security vulnerability in our website or systems, please report it responsibly to rastogicodeworks@gmail.com. We will acknowledge and address valid reports in a timely manner.
        </p>
        <h2 className="text-xl font-semibold text-primary-950 mt-8 mb-3">Compliance</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          We align our practices with common security and privacy expectations. For project-specific compliance (e.g. industry standards), we can discuss requirements in our engagement.
        </p>
        <p className="text-slate-600 leading-relaxed mt-8">
          For security-related questions, contact us at{' '}
          <a href={`mailto:rastogicodeworks@gmail.com?subject=${encodeURIComponent('Security Policy enquiry')}&body=${encodeURIComponent('Hey,\n\nI am reaching out from your website regarding your Security Policy.\n\nBest regards')}`} className="text-primary-600 font-medium hover:underline">
            rastogicodeworks@gmail.com
          </a>.
        </p>
        <Link to="/" className="inline-block mt-8 text-primary-600 font-semibold hover:underline">
          ← Back to Home
        </Link>
      </section>
      <PageCTA badge="Trust" title="Security matters to us" subtitle="Ask us about our security practices for your project." />
    </div>
  );
}
