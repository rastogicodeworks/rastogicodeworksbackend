import { Link } from 'react-router-dom';
import { useState } from 'react';

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/clients', label: 'Clients' },
  { to: '/compare', label: 'Compare' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/contact', label: 'Contact' },
  { to: '/login', label: 'Login' },
];

const services = [
  { label: 'Organization Setup', id: 'organization-setup' },
  { label: 'Software & App Development', id: 'software-app-development' },
  { label: 'Infrastructure & Cloud', id: 'infrastructure-cloud' },
  { label: 'Security & Compliance', id: 'security-compliance' },
  { label: 'Automation & AI', id: 'automation-ai' },
  { label: 'IT Support & Maintenance', id: 'it-support-maintenance' },
  { label: 'Consulting & Strategy', id: 'consulting-strategy' },
];

const resources = [
  { to: '/resources', label: 'Resources' },
  { to: '/blog', label: 'Blog' },
  { to: '/case-studies', label: 'Case Studies' },
  { to: '/documentation', label: 'Documentation' },
  { to: '/support', label: 'Support' },
  { to: '/faq', label: 'FAQ' },
];

const legalLinks = [
  { to: '/privacy-policy', label: 'Privacy Policy' },
  { to: '/terms-and-conditions', label: 'Terms & Conditions' },
  { to: '/refund-policy', label: 'Refund Policy' },
  { to: '/security-policy', label: 'Security Policy' },
];

const footerLinkClass =
  'text-primary-800/90 hover:text-primary-600 transition-colors duration-200 inline-block py-1 hover:underline underline-offset-2 decoration-primary-500/60';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email.trim()) setEmail('');
  };

  return (
    <footer className="bg-[#F0FDF4] text-primary-900" role="contentinfo">
      {/* Main footer  -  60–80px vertical padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">
          {/* Column 1: Brand (spans 2 on lg) */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <img
                src="/transparent_logo.png"
                alt="Rastogi Codeworks"
                className="h-16 w-16 object-contain flex-shrink-0"
              />
              <span className="flex flex-col">
                <span className="font-brand font-semibold text-2xl md:text-3xl text-[#065F46] group-hover:text-primary-600 transition-colors italic">
                  Rastogi Codeworks
                </span>
                <span className="text-xs font-normal text-[#065F46]/90 mt-1">Where Code Meets Experience</span>
              </span>
            </Link>
            <p className="text-sm text-primary-800/80 leading-relaxed max-w-xs">
              We partner with businesses to design, build, and scale reliable software - from internal tools to customer-facing platforms.
            </p>
            <div className="flex gap-3 pt-2">
              <a
                href="https://www.linkedin.com/company/rastogicodeworks/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex items-center justify-center w-9 h-9 rounded-lg text-[#065F46] hover:text-primary-500 hover:bg-primary-100/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                  <path d="M4.98 3.5C4.98 4.88 3.9 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.25 8.25H4.75V24H.25V8.25zM8.5 8.25H13v2.13h.07c.63-1.2 2.17-2.46 4.47-2.46 4.78 0 5.66 3.15 5.66 7.25V24h-4.5v-7.39c0-1.76-.03-4.02-2.45-4.02-2.45 0-2.83 1.91-2.83 3.89V24H8.5V8.25z" />
                </svg>
              </a>
            </div>
            {/* Newsletter */}
            <form onSubmit={handleNewsletter} className="pt-4">
              <label htmlFor="footer-email" className="sr-only">
                Email for newsletter
              </label>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#065F46]/80 mb-3">
                Stay in the loop
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  id="footer-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 min-w-0 rounded-xl border border-primary-200 bg-white/90 px-4 py-3 text-sm text-primary-900 placeholder:text-primary-500/70 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:bg-white transition-all duration-200"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-xl bg-[#065F46] text-white px-5 py-3 text-sm font-semibold shadow-md hover:bg-primary-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-[#F0FDF4] inline-flex items-center justify-center gap-2"
                >
                  Subscribe
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-bold text-[#065F46] text-sm uppercase tracking-wider mb-5">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className={footerLinkClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="font-bold text-[#065F46] text-sm uppercase tracking-wider mb-5">Services</h3>
            <ul className="space-y-2.5">
              {services.map((item) => (
                <li key={item.id}>
                  <Link to={`/services/${item.id}`} className={footerLinkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Resources */}
          <div>
            <h3 className="font-bold text-[#065F46] text-sm uppercase tracking-wider mb-5">Resources</h3>
            <ul className="space-y-2.5">
              {resources.map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className={footerLinkClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Legal & Compliance */}
          <div>
            <h3 className="font-bold text-[#065F46] text-sm uppercase tracking-wider mb-5">Legal & Compliance</h3>
            <ul className="space-y-2.5">
              {legalLinks.map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className={footerLinkClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact info  -  below Resources & Legal, one line with gap */}
        <div className="mt-12 pt-10 border-t border-primary-200/60">
          <h3 className="font-bold text-[#065F46] text-sm uppercase tracking-wider mb-4">Contact</h3>
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-2 text-sm">
            <a
              href={`mailto:rastogicodeworks@gmail.com?subject=${encodeURIComponent('Enquiry from your website')}&body=${encodeURIComponent('Hey,\n\nI am reaching out from your website. I would like to discuss how we can work together.\n\nBest regards')}`}
              className={`${footerLinkClass} font-medium text-primary-800`}
            >
             rastogicodeworks@gmail.com
            </a>
            <span className="text-primary-400 shrink-0" aria-hidden>·</span>
            <a
              href={`https://wa.me/918859985607?text=${encodeURIComponent('Hey, I am reaching out from your website. I would like to connect with Rastogi Codeworks. Could we schedule a call?')}`}
              target="_blank"
              rel="noopener noreferrer"
              className={footerLinkClass}
            >
              +91 88599- 85607
            </a>
            <span className="text-primary-400 shrink-0" aria-hidden>·</span>
            <span className="text-primary-800/80">
              Netaji Subhash Place, New Delhi, India
            </span>
          </div>
        </div>
      </div>

      {/* Sub-footer  -  darker green */}
      <div className="bg-[#065F46] text-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <p>© {new Date().getFullYear()} Rastogi Codeworks. All rights reserved.</p>
              <p className="text-primary-200/90 text-xs sm:text-sm">Made with dedication in India.</p>
            </div>
            <nav className="flex flex-wrap items-center gap-3 text-primary-100/90" aria-label="Legal links">
              <Link to="/privacy-policy" className="hover:text-white transition-colors duration-200 focus:outline-none focus:underline">Privacy</Link>
              <span className="text-primary-300/70" aria-hidden>|</span>
              <Link to="/terms-and-conditions" className="hover:text-white transition-colors duration-200 focus:outline-none focus:underline">Terms</Link>
              <span className="text-primary-300/70" aria-hidden>|</span>
              <Link to="/sitemap" className="hover:text-white transition-colors duration-200 focus:outline-none focus:underline">Sitemap</Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
