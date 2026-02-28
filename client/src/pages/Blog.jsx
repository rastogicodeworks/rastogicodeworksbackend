import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import PageCTA from '../components/PageCTA';
import SEO from '../components/SEO';
import AnimateOnScroll from '../components/AnimateOnScroll';
import { blogPosts } from '../data/blogPosts';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function Blog() {
  const sorted = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="overflow-x-hidden bg-white">
      <SEO
        title="Blog"
        description="Rastogi Codeworks blog: insights on custom software development, agile delivery, security, legacy modernization, and building products that scale. Tips for startups and enterprises in India."
        path="/blog"
        keywords="software development blog, tech blog India, agile development, custom software insights, Rastogi Codeworks blog"
      />
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.4] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <p className="text-sm font-semibold text-primary-600 uppercase tracking-widest mb-4">Content & insights</p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-primary-950 mb-6">
            Blog
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Practical insights on software development, agile delivery, security, and building products that scale.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-10">
          {sorted.map((post, i) => (
            <AnimateOnScroll key={post.slug} variant="up" delay={i * 50}>
              <article className="group rounded-2xl border border-primary-100 bg-white p-6 md:p-8 shadow-sm hover:shadow-lg hover:border-primary-200 transition-all duration-300">
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-3">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {formatDate(post.date)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {post.readTime} min read
                  </span>
                  <span className="rounded-full bg-primary-100 text-primary-700 px-3 py-0.5 font-medium">
                    {post.category}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-primary-950 mb-3 group-hover:text-primary-700 transition-colors">
                  <Link to={`/blog/${post.slug}`} className="focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-slate-600 leading-relaxed mb-5">{post.excerpt}</p>
                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 group/link"
                >
                  Read more
                  <span className="group-hover/link:translate-x-1 transition-transform" aria-hidden>→</span>
                </Link>
              </article>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      <PageCTA
        badge="Stay updated"
        title="Want more insights?"
        subtitle="Subscribe to our updates or get in touch for a conversation about your project."
        buttonText="Get in touch"
        to="/contact"
      />
    </div>
  );
}
