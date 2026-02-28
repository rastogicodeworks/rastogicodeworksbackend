/**
 * Blog posts for content marketing. Add or edit posts here.
 * slug: URL path (e.g. /blog/why-custom-software)
 * title, excerpt, date (YYYY-MM-DD), category, readTime (minutes), body (markdown-friendly text)
 */
export const blogPosts = [
  {
    slug: 'why-custom-software-beats-off-the-shelf',
    title: 'Why Custom Software Beats Off-the-Shelf for Growing Businesses',
    excerpt: 'When to invest in tailor-made solutions and how they pay off in efficiency, scalability, and long-term cost.',
    date: '2025-02-20',
    category: 'Strategy',
    readTime: 5,
    body: `Off-the-shelf software gets you started fast, but as your business grows, gaps appear. Custom software is built around your workflows, integrates with your existing tools, and scales with you.

**When custom makes sense**
- Your team is bending processes to fit the tool instead of the other way around.
- You need deep integrations (ERP, CRM, payments) that generic products don’t support well.
- You’re spending heavily on multiple subscriptions that still don’t cover key needs.

**What you gain**
- One system that does exactly what you need, with your terminology and rules.
- Fewer context switches and less manual work between tools.
- Control over data, security, and future changes.

We help businesses decide when to build vs. buy and deliver custom solutions that fit your roadmap. [Get in touch](/contact) for a no-obligation conversation.`,
  },
  {
    slug: 'agile-development-delivery-without-chaos',
    title: 'Agile Development: Delivery Without the Chaos',
    excerpt: 'How we use agile practices to ship on time, keep stakeholders in the loop, and avoid surprise scope creep.',
    date: '2025-02-15',
    category: 'Development',
    readTime: 6,
    body: `Agile isn’t about moving fast and breaking things—it’s about predictable delivery and continuous alignment. Here’s how we run projects.

**Sprints and demos**
We work in short sprints (usually 2 weeks) and demo at the end of each. You see progress regularly and can adjust priorities before too much is built.

**Clear scope, flexible order**
We lock scope at the start so everyone knows what “done” looks like. Within that, we reorder tasks based on what’s riskiest or most valuable to you first.

**No surprise launches**
We don’t disappear for months and come back with a big bang. You get early access, testing, and a phased rollout so go-live is smooth.

If you want a partner who ships in small, visible steps, [tell us about your project](/contact).`,
  },
  {
    slug: 'security-compliance-from-day-one',
    title: 'Security and Compliance From Day One',
    excerpt: 'Building security into your product from the start instead of bolting it on later—and why it matters for trust and audits.',
    date: '2025-02-10',
    category: 'Security',
    readTime: 5,
    body: `Security and compliance are easier when they’re part of the design, not an afterthought. We bake them in from the first sprint.

**What we do by default**
- Authentication and authorization designed up front (who can see and do what).
- Sensitive data encrypted at rest and in transit.
- Logging and audit trails so you can answer “who did what, when” for audits.

**Standards we work with**
We align with common frameworks (e.g. OWASP, GDPR-friendly practices) so your product is audit-ready. For regulated industries, we plan for the controls you need from the start.

**Your benefit**
Fewer last-minute security patches, smoother audits, and a product your customers and partners can trust. [Reach out](/contact) to discuss your compliance needs.`,
  },
  {
    slug: 'when-to-modernize-legacy-systems',
    title: 'When to Modernize Legacy Systems (And When Not To)',
    excerpt: 'Signs it’s time to replace or refactor old software—and how to do it without disrupting the business.',
    date: '2025-02-05',
    category: 'Strategy',
    readTime: 6,
    body: `Legacy systems keep the lights on, but they can also hold you back. Here’s a practical way to decide when to modernize.

**Signs it’s time**
- New features take too long or are too risky to add.
- Key people who understand the system are leaving.
- You’re paying more in support and workarounds than a rebuild would cost over a few years.

**When to wait**
- The system is stable, well-understood, and not blocking growth.
- A full rewrite would consume years and budget you don’t have—incremental improvement might be better.

**How we approach it**
We prefer incremental modernization: replace one module or integrate a new service at a time, so you keep running while you evolve. [Contact us](/contact) to discuss your legacy stack.`,
  },
];

/** Get post by slug; returns undefined if not found */
export function getPostBySlug(slug) {
  return blogPosts.find((p) => p.slug === slug);
}

/** Get latest N posts (by date desc) */
export function getLatestPosts(n = 3) {
  return [...blogPosts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, n);
}
