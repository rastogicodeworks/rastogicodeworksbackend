import { Link, useLocation } from 'react-router-dom';
import PageCTA from '../components/PageCTA';
import SEO from '../components/SEO';
import { services } from '../data/services';

export default function Sitemap() {
  const location = useLocation();

  const mainPages = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
    { to: '/clients', label: 'Clients' },
    { to: '/compare', label: 'Compare' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/contact', label: 'Contact' },
    { to: '/login', label: 'Login' },
  ];

  const resourcePages = [
    { to: '/resources', label: 'Resources' },
    { to: '/blog', label: 'Blog' },
    { to: '/case-studies', label: 'Case Studies' },
    { to: '/documentation', label: 'Documentation' },
    { to: '/support', label: 'Support' },
    { to: '/faq', label: 'FAQ' },
  ];

  const legalPages = [
    { to: '/privacy-policy', label: 'Privacy Policy' },
    { to: '/terms-and-conditions', label: 'Terms & Conditions' },
    { to: '/refund-policy', label: 'Refund Policy' },
    { to: '/security-policy', label: 'Security Policy' },
  ];

  const linkClass = (to) =>
    `text-primary-600 hover:text-primary-700 hover:underline underline-offset-2 ${location.pathname === to ? 'font-semibold underline' : ''}`;

  return (
    <div className="overflow-x-hidden bg-white">
      <SEO
        title="Sitemap"
        description="Rastogi Codeworks sitemap: quick links to all pages including Home, About, Services, Pricing, Contact, Blog, Case Studies, FAQ, and legal policies."
        path="/sitemap"
        keywords="Rastogi Codeworks sitemap, site map, all pages"
      />
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.4] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-primary-950 mb-6">
            Sitemap
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Find your way around Rastogi Codeworks.
          </p>
        </div>
      </section>

      <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <div>
            <h2 className="text-lg font-bold text-primary-950 mb-4">Main</h2>
            <ul className="space-y-2">
              {mainPages.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className={linkClass(to)}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary-950 mb-4">Services</h2>
            <ul className="space-y-2">
              {services.map((s) => (
                <li key={s.id}>
                  <Link to={`/services/${s.id}`} className={linkClass(`/services/${s.id}`)}>
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary-950 mb-4">Resources</h2>
            <ul className="space-y-2">
              {resourcePages.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className={linkClass(to)}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <h2 className="text-lg font-bold text-primary-950 mb-4">Legal</h2>
            <ul className="space-y-2">
              {legalPages.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className={linkClass(to)}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-primary-100">
          <Link to="/" className="text-primary-600 font-semibold hover:underline">
            ← Back to Home
          </Link>
        </div>
      </section>

      <PageCTA badge="Get in touch" title="Ready to build?" subtitle="Tell us about your project and we'll take it from there." />
    </div>
  );
}
