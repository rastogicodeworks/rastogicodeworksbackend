import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import PageCTA from '../components/PageCTA';
import SEO from '../components/SEO';
import AnimateOnScroll from '../components/AnimateOnScroll';
import { blogPosts, getLatestPosts } from '../data/blogPosts';

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
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] animate-grid-fade pointer-events-none" />
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

      <section className="border-b border-primary-100 bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll variant="up" className="mb-10 flex flex-col items-center justify-between gap-4 md:flex-row md:items-end">
            <div className="text-center md:text-left">
              <h2 className="mb-4 text-3xl font-bold text-primary-950 md:text-5xl">Latest from the blog</h2>
              <p className="max-w-xl text-lg text-slate-600">
                Insights on software strategy, agile delivery, and building products that scale.
              </p>
            </div>
            <a
              href="#blog-archive"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700 md:text-base"
            >
              View all posts
              <ArrowRight className="h-5 w-5" aria-hidden />
            </a>
          </AnimateOnScroll>
          <div className="grid gap-6 md:grid-cols-3">
            {getLatestPosts(3).map((post, i) => (
              <AnimateOnScroll key={post.slug} variant="up" delay={i * 80}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="group block rounded-2xl border border-primary-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-primary-200 hover:shadow-lg"
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">{post.category}</span>
                  <h3 className="mt-2 mb-2 line-clamp-2 text-xl font-bold text-primary-950 transition-colors group-hover:text-primary-700">
                    {post.title}
                  </h3>
                  <p className="line-clamp-2 text-sm text-slate-600">{post.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 transition-all group-hover:gap-2">
                    Read article <ArrowRight className="h-4 w-4" aria-hidden />
                  </span>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section id="blog-archive" className="scroll-mt-28 py-12 md:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
