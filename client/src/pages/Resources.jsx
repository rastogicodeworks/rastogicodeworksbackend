import { Link } from 'react-router-dom';
import PageCTA from '../components/PageCTA';
import SEO from '../components/SEO';

const resourceLinks = [
  { to: '/resources', label: 'Resources' },
  { to: '/blog', label: 'Blog' },
  { to: '/case-studies', label: 'Case Studies' },
  { to: '/documentation', label: 'Documentation' },
  { to: '/support', label: 'Support' },
  { to: '/faq', label: 'FAQ' },
];

const linkClass =
  'block text-primary-800 font-medium py-3 hover:text-primary-600 transition-colors duration-200';

export default function Resources() {
  return (
    <div className="overflow-x-hidden min-h-screen bg-[#F0FDF4]">
      <SEO
        title="Resources"
        description="Rastogi Codeworks resources: blog, case studies, documentation, support, and FAQ. Guides and insights for software development, web development, and digital strategy."
        path="/resources"
        keywords="Rastogi Codeworks resources, software development guides, blog, case studies, documentation, support, FAQ"
      />
      <section className="pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="rounded-2xl bg-white/60 backdrop-blur-sm border border-primary-100/80 shadow-sm p-8 md:p-10" aria-label="Resources">
            <ul className="space-y-1">
              {resourceLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className={linkClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
      <PageCTA
        badge="Need more?"
        title="Can't find what you need?"
        subtitle="Get in touch and we'll point you in the right direction."
        buttonText="Contact us"
        to="/contact"
      />
    </div>
  );
}
