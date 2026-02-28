import { Link } from 'react-router-dom';
import PageCTA from '../components/PageCTA';
import SEO from '../components/SEO';

export default function PrivacyPolicy() {
  return (
    <div className="overflow-x-hidden bg-white">
      <SEO
        title="Privacy Policy"
        description="Rastogi Codeworks privacy policy: how we collect, use, and protect your data when you use our website, contact form, and client portal. Your privacy matters."
        path="/privacy-policy"
        keywords="Rastogi Codeworks privacy policy, data protection, GDPR, privacy"
      />
      <section className="relative pt-32 pb-12 md:pt-48 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.4] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-primary-950 mb-6">
            Privacy Policy
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>
      <section className="py-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-slate prose-headings:text-primary-950">
        <p className="text-slate-600 leading-relaxed mb-6">
          Rastogi Codeworks (&quot;we&quot;, &quot;us&quot;) respects your privacy. This policy describes how we collect, use, and protect your information when you use our website or services.
        </p>
        <h2 className="text-xl font-semibold text-primary-950 mt-8 mb-3">Information we collect</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          We may collect name, email, phone, company name, and message content when you contact us or subscribe to updates. We also collect usage data (e.g. IP, browser) for analytics and security.
        </p>
        <h2 className="text-xl font-semibold text-primary-950 mt-8 mb-3">How we use it</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          We use your information to respond to inquiries, deliver services, send relevant updates (with your consent), and improve our website and operations.
        </p>
        <h2 className="text-xl font-semibold text-primary-950 mt-8 mb-3">Sharing and security</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          We do not sell your data. We may share it with trusted service providers (e.g. hosting, email) only as needed. We take reasonable measures to protect your data.
        </p>
        <h2 className="text-xl font-semibold text-primary-950 mt-8 mb-3">Your rights</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          You may request access, correction, or deletion of your data by contacting us at rastogicodeworks@gmail.com.
        </p>
        <p className="text-slate-600 leading-relaxed mt-8">
          For questions about this policy, contact us at{' '}
          <a href={`mailto:rastogicodeworks@gmail.com?subject=${encodeURIComponent('Privacy Policy enquiry')}&body=${encodeURIComponent('Hey,\n\nI am reaching out from your website regarding your Privacy Policy.\n\nBest regards')}`} className="text-primary-600 font-medium hover:underline">
            rastogicodeworks@gmail.com
          </a>.
        </p>
        <Link to="/" className="inline-block mt-8 text-primary-600 font-semibold hover:underline">
          ← Back to Home
        </Link>
      </section>
      <PageCTA badge="Contact" title="Questions about privacy?" subtitle="Reach out and we'll be happy to clarify." />
    </div>
  );
}
