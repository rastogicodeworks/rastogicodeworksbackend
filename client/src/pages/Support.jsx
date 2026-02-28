import { Link } from 'react-router-dom';
import PageCTA from '../components/PageCTA';
import SEO from '../components/SEO';

export default function Support() {
  return (
    <div className="overflow-x-hidden bg-white">
      <SEO
        title="Support"
        description="Rastogi Codeworks support: get help with your project, client portal, invoices, or technical issues. Contact our team for quick assistance. Available across India."
        path="/support"
        keywords="Rastogi Codeworks support, technical support, client support, help desk, software development support"
      />
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.4] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-primary-950 mb-6">
            Support
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Get help with your project, account, or technical issues.
          </p>
        </div>
      </section>
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-slate-600 leading-relaxed mb-8">
          For support, email us at{' '}
          <a href={`mailto:rastogicodeworks@gmail.com?subject=${encodeURIComponent('Support request from website')}&body=${encodeURIComponent('Hey,\n\nI am reaching out from your website for support.\n\nBest regards')}`} className="text-primary-600 font-medium hover:underline">
            rastogicodeworks@gmail.com
          </a>
          {' '}or use the contact form. We aim to respond within one business day.
        </p>
        <Link to="/contact" className="text-primary-600 font-semibold hover:underline">
          Contact us →
        </Link>
      </section>
      <PageCTA badge="We're here" title="Need support?" subtitle="Reach out and we'll get back to you quickly." />
    </div>
  );
}
