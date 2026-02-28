import { Link } from 'react-router-dom';
import PageCTA from '../components/PageCTA';
import SEO from '../components/SEO';

export default function TermsConditions() {
  return (
    <div className="overflow-x-hidden bg-white">
      <SEO
        title="Terms & Conditions"
        description="Terms and conditions for using the Rastogi Codeworks website and services. Legal terms, user agreement, and acceptable use policy."
        path="/terms-and-conditions"
        keywords="Rastogi Codeworks terms and conditions, terms of service, legal"
      />
      <section className="relative pt-32 pb-12 md:pt-48 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.4] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-primary-950 mb-6">
            Terms &amp; Conditions
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>
      <section className="py-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-slate-600 leading-relaxed mb-6">
          By using the Rastogi Codeworks website and services, you agree to these terms. Please read them carefully.
        </p>
        <h2 className="text-xl font-semibold text-primary-950 mt-8 mb-3">Use of website</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          You may use this website for lawful purposes only. You must not misuse the site, attempt unauthorized access, or use it in any way that could harm us or third parties.
        </p>
        <h2 className="text-xl font-semibold text-primary-950 mt-8 mb-3">Services and agreements</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          Specific projects are governed by separate agreements (e.g. statements of work). These general terms apply to website use; project terms apply to delivered work.
        </p>
        <h2 className="text-xl font-semibold text-primary-950 mt-8 mb-3">Intellectual property</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          Content on this site (text, logos, design) is owned by Rastogi Codeworks unless otherwise stated. You may not copy or use it without our written permission.
        </p>
        <h2 className="text-xl font-semibold text-primary-950 mt-8 mb-3">Limitation of liability</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          We provide the website &quot;as is&quot;. We are not liable for indirect, incidental, or consequential damages arising from your use of the site or our services, to the extent permitted by law.
        </p>
        <p className="text-slate-600 leading-relaxed mt-8">
          For questions, contact us at{' '}
          <a href={`mailto:rastogicodeworks@gmail.com?subject=${encodeURIComponent('Terms & Conditions enquiry')}&body=${encodeURIComponent('Hey,\n\nI am reaching out from your website regarding your Terms & Conditions.\n\nBest regards')}`} className="text-primary-600 font-medium hover:underline">
            rastogicodeworks@gmail.com
          </a>.
        </p>
        <Link to="/" className="inline-block mt-8 text-primary-600 font-semibold hover:underline">
          ← Back to Home
        </Link>
      </section>
      <PageCTA badge="Contact" title="Need clarification?" subtitle="We're happy to explain our terms." />
    </div>
  );
}
