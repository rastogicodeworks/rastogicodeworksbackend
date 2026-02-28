import { useParams, Link, Navigate } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import PageCTA from '../components/PageCTA';
import SEO from '../components/SEO';
import { getPostBySlug } from '../data/blogPosts';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Simple inline link + bold for markdown-like body */
function renderBody(text) {
  if (!text) return null;
  const parts = [];
  let remaining = text;
  const linkRegex = /\[([^\]]+)\]\((\/[^)]+)\)/g;
  let lastIndex = 0;
  let match;
  while ((match = linkRegex.exec(remaining)) !== null) {
    parts.push(remaining.slice(lastIndex, match.index));
    parts.push(
      <Link key={match.index} to={match[2]} className="text-primary-600 font-semibold hover:underline">
        {match[1]}
      </Link>
    );
    lastIndex = linkRegex.lastIndex;
  }
  parts.push(remaining.slice(lastIndex));
  return parts.map((p, i) => {
    if (typeof p === 'string') {
      return p.split(/\*\*([^*]+)\*\*/g).map((s, j) => (j % 2 === 1 ? <strong key={`${i}-${j}`}>{s}</strong> : s));
    }
    return <span key={i}>{p}</span>;
  });
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  if (!post) return <Navigate to="/blog" replace />;

  return (
    <div className="overflow-x-hidden bg-white">
      <SEO
        title={post.title}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        keywords={`${post.category}, software development, Rastogi Codeworks, ${post.title.split(' ').slice(0, 4).join(' ')}`}
      />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 md:pt-36 md:pb-24">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700 mb-8 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-4">
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
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-950 tracking-tight">
            {post.title}
          </h1>
          <p className="text-xl text-slate-600 mt-4">{post.excerpt}</p>
        </header>

        <div className="prose prose-lg prose-slate max-w-none prose-p:leading-relaxed prose-headings:font-bold prose-headings:text-primary-950">
          <div className="space-y-4 text-slate-700 leading-relaxed whitespace-pre-line">
            {post.body.split('\n\n').map((para, i) => {
              if (para.startsWith('**') && para.endsWith('**')) {
                return (
                  <h2 key={i} className="text-xl font-bold text-primary-950 mt-8 mb-2">
                    {para.replace(/\*\*/g, '')}
                  </h2>
                );
              }
              return (
                <p key={i} className="mb-4">
                  {renderBody(para)}
                </p>
              );
            })}
          </div>
        </div>
      </article>

      <PageCTA
        badge="Next steps"
        title="Ready to build or modernize?"
        subtitle="Tell us about your project and we'll outline how we can help."
        buttonText="Get in touch"
        to="/contact"
      />
    </div>
  );
}
