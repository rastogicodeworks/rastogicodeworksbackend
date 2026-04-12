import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';

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
  { label: 'Website Development', id: 'website-development' },
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
  'text-sm text-primary-800/85 hover:text-[#065F46] transition-colors duration-200 block py-1';

function ColumnTitle({ children }) {
  return (
    <h3
      className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#065F46]/75"
      style={{ fontFeatureSettings: '"lnum" 1' }}
    >
      {children}
    </h3>
  );
}

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email.trim()) setEmail('');
  };

  return (
    <footer className="bg-[#F0FDF4] text-primary-900" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 md:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          {/* Brand + newsletter */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="group inline-flex max-w-full items-start gap-3">
              <img
                src="/transparent_logo.png"
                alt="Rastogi Codeworks"
                width={56}
                height={56}
                className="h-14 w-14 shrink-0 object-contain"
              />
              <span className="min-w-0 pt-0.5">
                <span className="font-brand block text-xl font-semibold italic leading-tight text-[#065F46] transition-colors group-hover:text-primary-600 sm:text-2xl">
                  Rastogi Codeworks
                </span>
                <span className="mt-1 block text-xs font-medium text-[#065F46]/75">Where Code Meets Experience</span>
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-primary-800/75">
              We partner with businesses to design, build, and scale reliable software – from internal tools to customer-facing platforms.
            </p>
            <a
              href="https://www.linkedin.com/company/rastogicodeworks/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary-200/80 bg-white/70 text-[#065F46] shadow-sm transition-all duration-200 hover:border-primary-300 hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:ring-offset-2 focus:ring-offset-[#F0FDF4]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden>
                <path d="M4.98 3.5C4.98 4.88 3.9 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.25 8.25H4.75V24H.25V8.25zM8.5 8.25H13v2.13h.07c.63-1.2 2.17-2.46 4.47-2.46 4.78 0 5.66 3.15 5.66 7.25V24h-4.5v-7.39c0-1.76-.03-4.02-2.45-4.02-2.45 0-2.83 1.91-2.83 3.89V24H8.5V8.25z" />
              </svg>
            </a>

            <form onSubmit={handleNewsletter} className="rounded-2xl border border-primary-200/70 bg-white/60 p-4 shadow-sm backdrop-blur-sm">
              <label htmlFor="footer-email" className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#065F46]/70">
                Stay in the loop
              </label>
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-2">
                <input
                  id="footer-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="min-h-[44px] min-w-0 flex-1 rounded-xl border border-primary-200/90 bg-white px-3.5 py-2.5 text-sm text-primary-900 placeholder:text-primary-500/55 shadow-inner focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/25"
                />
                <button
                  type="submit"
                  className="inline-flex h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#065F46] px-4 text-sm font-semibold text-white shadow-md shadow-[#065F46]/20 transition-all duration-200 hover:bg-[#054a38] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#065F46] focus:ring-offset-2 focus:ring-offset-white sm:px-5"
                >
                  Subscribe
                  <ArrowRight className="h-4 w-4 opacity-90" strokeWidth={2.25} aria-hidden />
                </button>
              </div>
            </form>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8 lg:gap-6">
            <nav aria-label="Quick links">
              <ColumnTitle>Quick links</ColumnTitle>
              <ul className="space-y-0.5">
                {quickLinks.map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className={footerLinkClass}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Services">
              <ColumnTitle>Services</ColumnTitle>
              <ul className="space-y-0.5">
                {services.map((item) => (
                  <li key={item.id}>
                    <Link to={`/services/${item.id}`} className={footerLinkClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Resources">
              <ColumnTitle>Resources</ColumnTitle>
              <ul className="space-y-0.5">
                {resources.map(({ to, label }) => (
                  <li key={label}>
                    <Link to={to} className={footerLinkClass}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Legal">
              <ColumnTitle>Legal & compliance</ColumnTitle>
              <ul className="space-y-0.5">
                {legalLinks.map(({ to, label }) => (
                  <li key={label}>
                    <Link to={to} className={footerLinkClass}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-12 md:mt-14">
          <div className="rounded-2xl border border-primary-200/70 bg-white/50 px-5 py-5 shadow-sm backdrop-blur-sm md:px-6 md:py-5">
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#065F46]/75">Contact</h3>
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-3">
              <a
                href={`mailto:rastogicodeworks@gmail.com?subject=${encodeURIComponent('Enquiry from your website')}&body=${encodeURIComponent('Hey,\n\nI am reaching out from your website. I would like to discuss how we can work together.\n\nBest regards')}`}
                className="inline-flex items-center gap-2.5 text-sm font-medium text-primary-900 transition-colors hover:text-[#065F46]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-100/80 text-[#065F46]">
                  <Mail className="h-4 w-4" strokeWidth={2} aria-hidden />
                </span>
                rastogicodeworks@gmail.com
              </a>
              <a
                href={`https://wa.me/918859985607?text=${encodeURIComponent('Hey, I am reaching out from your website. I would like to connect with Rastogi Codeworks. Could we schedule a call?')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-sm font-medium text-primary-900 transition-colors hover:text-[#065F46]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-100/80 text-[#065F46]">
                  <Phone className="h-4 w-4" strokeWidth={2} aria-hidden />
                </span>
                +91 88599- 85607
              </a>
              <span className="inline-flex items-start gap-2.5 text-sm text-primary-800/80 sm:items-center">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-100/80 text-[#065F46] sm:mt-0">
                  <MapPin className="h-4 w-4" strokeWidth={2} aria-hidden />
                </span>
                Netaji Subhash Place, New Delhi, India
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#065F46] text-primary-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 md:py-5">
          <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
              <p className="font-medium text-white/95">© {new Date().getFullYear()} Rastogi Codeworks. All rights reserved.</p>
              <p className="text-xs text-primary-200/85 sm:text-sm">Made with dedication in India.</p>
            </div>
            <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 text-primary-100/85" aria-label="Legal links">
              <Link to="/privacy-policy" className="transition-colors hover:text-white focus:outline-none focus-visible:underline">
                Privacy
              </Link>
              <span className="text-primary-300/50" aria-hidden>
                ·
              </span>
              <Link to="/terms-and-conditions" className="transition-colors hover:text-white focus:outline-none focus-visible:underline">
                Terms
              </Link>
              <span className="text-primary-300/50" aria-hidden>
                ·
              </span>
              <Link to="/sitemap" className="transition-colors hover:text-white focus:outline-none focus-visible:underline">
                Sitemap
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
