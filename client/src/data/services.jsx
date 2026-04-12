import {
  Building2, Code, Globe, Cloud, Shield, Bot, Headphones, Lightbulb, Presentation,
  TrendingUp, Database,
} from 'lucide-react';

export const services = [
  {
    id: 'organization-setup',
    title: 'Organization Setup',
    shortDesc: 'Structured setup of your technology and processes so your organization can scale with clarity and control.',
    fullDesc: 'We help you establish a solid technology foundation from day one. From tooling and workflows to governance and team structure, we design an organization setup that aligns with your goals and grows with you.',
    icon: <Building2 className="w-8 h-8" />,
    pricing: {
      headline: 'From ₹50,000',
      note: 'Discovery workshop, tooling plan, and rollout roadmap. Larger programs quoted after scope.',
      model: 'Project-based · phased milestones',
      summary:
        'Most engagements start with a compact discovery and design phase so leadership gets clarity before a wider rollout. We then quote implementation separately if you want hands-on execution across teams.',
      included: [
        'Stakeholder discovery sessions and constraints review',
        'Technology and tooling recommendations aligned to your scale',
        'Process and workflow outline (roles, handoffs, basics of governance)',
        'Written roadmap and next-step checklist you can execute internally',
        'One structured handover or Q&A workshop',
      ],
      extras: [
        'End-to-end rollout across departments, dedicated PM, and ongoing operating support are quoted after scope.',
      ],
    },
    features: [
      'Technology Stack Selection',
      'Process & Workflow Design',
      'Team Structure & Roles',
      'Governance & Policies',
      'Documentation & Knowledge Base'
    ],
    technologies: ['Notion', 'Slack', 'Jira', 'GitHub', 'Google Workspace'],
    process: [
      { title: 'Discovery', desc: 'Understanding your vision and constraints.' },
      { title: 'Design', desc: 'Proposing structure and tooling.' },
      { title: 'Implementation', desc: 'Rolling out processes and tools.' },
      { title: 'Handover', desc: 'Training and ongoing support.' }
    ]
  },
  {
    id: 'software-app-development',
    title: 'Software & App Development',
    shortDesc: 'Custom web and mobile applications built with modern stacks for performance, scale, and great user experience.',
    fullDesc: 'We build software that works. From responsive web apps to native and cross-platform mobile applications, we use proven technologies and agile practices to deliver on time and within budget.',
    icon: <Code className="w-8 h-8" />,
    pricing: {
      headline: 'From ₹1,50,000',
      note: 'Typical MVPs and focused product builds. Enterprise and multi-platform apps scoped separately.',
      model: 'Fixed phases, milestone billing, or retainer',
      summary:
        'Starting ranges usually cover a scoped web product or a single-platform app with a clear feature set. We break work into milestones (design, build, hardening, launch) so you see progress before each payment.',
      included: [
        'Requirements workshop and backlog for the agreed scope',
        'UI implementation for screens in scope (design may be separate or bundled)',
        'APIs and integrations explicitly listed in the statement of work',
        'Tested build deployed to your hosting or ours for go-live',
        'Post-launch stabilization window as agreed in the proposal',
      ],
      extras: [
        'Second mobile codebase, heavy third-party integrations, compliance-heavy sectors, and 24/7 operations are priced after technical discovery.',
      ],
    },
    features: [
      'Web Applications (SPA, PWA)',
      'Mobile Apps (iOS & Android)',
      'APIs & Integrations',
      'E-commerce & Portals',
      'Legacy Modernization'
    ],
    technologies: ['React', 'Next.js', 'Node.js', 'React Native', 'TypeScript'],
    process: [
      { title: 'Requirements', desc: 'Defining scope and priorities.' },
      { title: 'Design', desc: 'UX/UI and architecture.' },
      { title: 'Development', desc: 'Iterative, test-driven builds.' },
      { title: 'Launch', desc: 'Deploy and support.' }
    ]
  },
  {
    id: 'website-development',
    title: 'Website Development',
    shortDesc:
      'Business websites and landing pages—fast, responsive, and easy to manage—without the cost of a full custom product build.',
    fullDesc:
      'We design and build professional websites for brands, startups, and local businesses. From sharp one-page landings to small multi-page marketing sites, we focus on clarity, performance, mobile-first layout, and essentials like contact forms and basic SEO—so you can launch quickly and grow into larger builds when you are ready.',
    icon: <Globe className="w-8 h-8" />,
    pricing: {
      headline: 'From ₹10,999',
      note: 'Compact landing or small multi-page sites. E-commerce, member portals, and app-style products quoted separately.',
      model: 'Fixed-scope project · milestone billing',
      summary:
        'Starting pricing is aimed at a tightly scoped site: agreed page count, responsive layout, and go-live on your domain. Add-ons like custom illustrations, large content migration, or complex integrations are quoted after a short brief so the scope stays predictable.',
      included: [
        'Kickoff brief to lock pages, sections, and must-have features',
        'Responsive implementation for the agreed page set',
        'Contact or lead form (or equivalent CTA) as scoped',
        'Deployment to agreed hosting or our recommended setup',
        'Basic on-page SEO setup (titles, meta, semantic structure)',
        'Handover walkthrough and agreed revision round(s) in the proposal',
      ],
      extras: [
        'Online stores, bookings, dashboards, custom backends, and multilingual or large content programs are scoped as separate phases.',
      ],
    },
    features: [
      'Business & portfolio websites',
      'Landing pages & campaign pages',
      'Multi-page marketing sites',
      'CMS-friendly builds where needed',
      'Responsive, mobile-first design',
      'Performance & basic SEO setup',
    ],
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'Vercel', 'WordPress'],
    process: [
      { title: 'Brief', desc: 'Goals, audience, and page list.' },
      { title: 'Design', desc: 'Layout, content structure, brand fit.' },
      { title: 'Build', desc: 'Responsive pages and forms.' },
      { title: 'Launch', desc: 'Deploy, DNS, and handover.' },
    ],
  },
  {
    id: 'infrastructure-cloud',
    title: 'Infrastructure & Cloud',
    shortDesc: 'Reliable, scalable cloud infrastructure and DevOps practices so your systems stay secure and performant.',
    fullDesc: 'We design and manage cloud infrastructure that scales. Whether you are on AWS, Azure, or Google Cloud, we help you optimize costs, automate deployments, and maintain high availability.',
    icon: <Cloud className="w-8 h-8" />,
    pricing: {
      headline: 'From ₹45,000',
      note: 'One-time setup, migration, or pipeline work. Ongoing DevOps retainers from ₹25,000/mo.',
      model: 'One-time projects + optional monthly retainer',
      summary:
        'Entry pricing often covers a well-defined slice: a new environment baseline, a CI/CD path for one app, or a small migration batch. Larger footprints and always-on operations move to milestone billing or a retainer.',
      included: [
        'Architecture or target-state diagram for the agreed slice',
        'Implementation of agreed automation (e.g. pipeline, basic IaC) in your cloud account',
        'Runbook or handover notes for your team',
        'Knowledge transfer session on what was built',
      ],
      extras: [
        'Multi-account landing zones, Kubernetes production hardening, and 24/7 on-call are quoted separately.',
      ],
    },
    features: [
      'Cloud Migration & Setup',
      'CI/CD Pipelines',
      'Infrastructure as Code',
      'Monitoring & Alerting',
      'Cost Optimization'
    ],
    technologies: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform'],
    process: [
      { title: 'Assessment', desc: 'Current state and target architecture.' },
      { title: 'Design', desc: 'Infrastructure and automation plan.' },
      { title: 'Migration', desc: 'Phased rollout and cutover.' },
      { title: 'Operate', desc: 'Ongoing optimization and support.' }
    ]
  },
  {
    id: 'security-compliance',
    title: 'Security & Compliance',
    shortDesc: 'Protect your data and systems with security best practices and compliance frameworks tailored to your industry.',
    fullDesc: 'Security and compliance are built into our approach. We help you assess risks, implement controls, and prepare for audits so you can operate with confidence and meet regulatory requirements.',
    icon: <Shield className="w-8 h-8" />,
    pricing: {
      headline: 'From ₹65,000',
      note: 'Assessments and remediation sprints. Full compliance programs (ISO, SOC 2, etc.) on quote.',
      model: 'Assessment sprint · remediation quoted separately',
      summary:
        'Starting fees typically fund a focused assessment: interviews, configuration review, and a prioritized findings report. Remediation, policy packs, and audit support are scoped as follow-on work with clear deliverables.',
      included: [
        'Scoped assessment against agreed systems or product areas',
        'Risk and gap summary with severity and effort hints',
        'Prioritized remediation backlog you can execute with us or internally',
        'Walkthrough of results with your stakeholders',
      ],
      extras: [
        'Formal compliance programs (e.g. ISO 27001, SOC 2 readiness), pen tests, and recurring vCISO-style support are quoted as separate packages.',
      ],
    },
    features: [
      'Security Audits & Assessments',
      'Compliance (GDPR, SOC2, ISO)',
      'Access Control & IAM',
      'Incident Response',
      'Security Training'
    ],
    technologies: ['OWASP', 'Vault', 'SIEM', 'Pen Testing Tools'],
    process: [
      { title: 'Audit', desc: 'Identifying gaps and risks.' },
      { title: 'Remediation', desc: 'Implementing controls.' },
      { title: 'Documentation', desc: 'Policies and evidence.' },
      { title: 'Ongoing', desc: 'Monitoring and reviews.' }
    ]
  },
  {
    id: 'automation-ai',
    title: 'Automation & AI',
    shortDesc: 'Streamline operations and unlock insights with process automation and AI solutions tailored to your business.',
    fullDesc: 'We combine process automation and AI to reduce manual work and improve decisions. From RPA and workflow automation to custom ML models and integrations with LLMs, we deliver practical, measurable results.',
    icon: <Bot className="w-8 h-8" />,
    pricing: {
      headline: 'From ₹1,20,000',
      note: 'Workflow automation and integrations. Custom AI/ML and LLM features priced to your use case.',
      model: 'Fixed automation packs or time-and-materials',
      summary:
        'Early budgets usually target one or two high-friction workflows or a bounded integration (e.g. CRM ↔ billing). Broader RPA estates, custom models, and production LLM features scale with data, safety, and hosting needs.',
      included: [
        'Process mapping and automation design for agreed flows',
        'Build of connectors, bots, or workflows in the chosen stack',
        'Basic monitoring and error handling for automated paths',
        'Documentation and operator handover',
      ],
      extras: [
        'Fine-tuned models, high-volume document AI, human-in-the-loop review UIs, and enterprise SLAs are scoped after a short discovery.',
      ],
    },
    features: [
      'Process Automation (RPA)',
      'Workflow & Integration Automation',
      'AI/ML Models & Pipelines',
      'Chatbots & Virtual Assistants',
      'Data & Analytics Automation'
    ],
    technologies: ['Python', 'OpenAI', 'LangChain', 'n8n', 'Power Automate'],
    process: [
      { title: 'Discovery', desc: 'Identifying automation opportunities.' },
      { title: 'Design', desc: 'Solution and data flow design.' },
      { title: 'Build', desc: 'Development and testing.' },
      { title: 'Deploy', desc: 'Rollout and iteration.' }
    ]
  },
  {
    id: 'it-support-maintenance',
    title: 'IT Support & Maintenance',
    shortDesc: 'Proactive support and maintenance so your systems run smoothly and issues are resolved quickly.',
    fullDesc: 'We provide ongoing IT support and maintenance for the solutions we build and for existing systems. From helpdesk and monitoring to patches and upgrades, we keep your technology running reliably.',
    icon: <Headphones className="w-8 h-8" />,
    pricing: {
      headline: 'From ₹18,000/mo',
      note: 'Monthly retainers with defined SLAs. Ad-hoc support and hourly blocks also available.',
      model: 'Monthly retainer (SLA-based) or prepaid hours',
      summary:
        'Retainers bundle a predictable response window and agreed channels (e.g. ticket + email). Higher tiers add monitoring, change windows, and faster severity-1 targets. Smaller stacks can start with a limited-hour pack instead.',
      included: [
        'Defined coverage window and response targets per severity',
        'Ticketing or agreed channel for requests',
        'Routine patching and updates within agreed scope',
        'Monthly or quarterly health summary (tier-dependent)',
      ],
      extras: [
        '24/7 coverage, dedicated on-call, and major version upgrades may require a higher tier or add-on quote.',
      ],
    },
    features: [
      'Helpdesk & Ticketing',
      'Monitoring & Alerts',
      'Updates & Patching',
      'Backup & Recovery',
      'Performance Tuning'
    ],
    technologies: ['Jira', 'PagerDuty', 'Datadog', 'GitHub Actions'],
    process: [
      { title: 'Onboarding', desc: 'Defining SLAs and access.' },
      { title: 'Run', desc: 'Day-to-day support and monitoring.' },
      { title: 'Improve', desc: 'Root cause and preventive actions.' },
      { title: 'Report', desc: 'Regular reviews and recommendations.' }
    ]
  },
  {
    id: 'consulting-strategy',
    title: 'Consulting & Strategy',
    shortDesc: 'Technology and digital strategy advice to align your roadmap with business goals and market opportunities.',
    fullDesc: 'We work with leadership and teams to shape technology and digital strategy. From due diligence and vendor selection to roadmap planning and digital transformation, we provide clear, actionable guidance.',
    icon: <Lightbulb className="w-8 h-8" />,
    pricing: {
      headline: 'From ₹35,000',
      note: 'Strategy sprints and workshops. Ongoing advisory available on a monthly retainer.',
      model: 'Sprint workshop · optional advisory retainer',
      summary:
        'Starting engagements are usually a short sprint: interviews, artifact review, and a concrete recommendation deck or roadmap. Longer due diligence, vendor RFP support, or embedded advisory is quoted as a follow-on.',
      included: [
        'Facilitated sessions with your leadership or product owners',
        'Synthesis of goals, constraints, and options',
        'Prioritized roadmap or decision memo',
        'Optional follow-up Q&A session',
      ],
      extras: [
        'Vendor scoring matrices, full RFP management, and multi-month transformation programs are scoped separately.',
      ],
    },
    features: [
      'Digital & Technology Strategy',
      'Vendor Selection & Due Diligence',
      'Roadmap & Prioritization',
      'Digital Transformation',
      'Training & Workshops'
    ],
    technologies: ['Strategy Frameworks', 'OKRs', 'Roadmapping Tools'],
    process: [
      { title: 'Understand', desc: 'Goals, context, and constraints.' },
      { title: 'Analyze', desc: 'Options and trade-offs.' },
      { title: 'Recommend', desc: 'Clear strategy and roadmap.' },
      { title: 'Support', desc: 'Execution support as needed.' }
    ]
  },
  {
    id: 'presentation-document-services',
    title: 'Presentation & Document Services',
    shortDesc: 'Business presentation (PPT) design and document formatting that communicate your message clearly and professionally.',
    fullDesc: 'We create polished presentations and documents that win stakeholders and convey your brand. From investor pitch decks and company profiles to sales decks, training materials, and reports, we deliver professional design and clear structure.',
    icon: <Presentation className="w-8 h-8" />,
    pricing: {
      headline: 'From ₹12,000',
      note: 'Per deck or document package. Pitch decks, profiles, and reports with revision rounds included.',
      model: 'Per deliverable · fixed rounds of revision',
      summary:
        'Packages are sized by slide count, brand complexity, and whether we structure narrative from scratch or polish your draft. Larger decks, print-ready reports, and rush timelines are quoted upfront.',
      included: [
        'Agreed slide or page count and master layout system',
        'On-brand visuals, charts, and iconography as scoped',
        'Fixed number of revision rounds (stated in proposal)',
        'Source files in PowerPoint / Slides / PDF as agreed',
      ],
      extras: [
        'Custom illustration, motion/video, multilingual versions, and same-day turnaround are add-ons.',
      ],
    },
    features: [
      'Custom Proposal Creation',
      'Investor Pitch Deck Design',
      'Company Profile Design',
      'Sales Deck & Marketing Presentations',
      'Training & Educational PPTs',
      'Infographic Design',
      'Report & Documentation Formatting'
    ],
    technologies: ['PowerPoint', 'Google Slides', 'Keynote', 'Canva', 'Adobe InDesign'],
    process: [
      { title: 'Brief', desc: 'Understanding your content and audience.' },
      { title: 'Structure', desc: 'Outline, narrative, and key messages.' },
      { title: 'Design', desc: 'Layout, visuals, and brand alignment.' },
      { title: 'Deliver', desc: 'Final deck or document and revisions.' }
    ]
  },
  {
    id: 'marketing-seo-optimization',
    title: 'Marketing & SEO Optimization',
    shortDesc: 'Grow visibility and conversions with SEO, content marketing, performance campaigns, and marketing automation.',
    fullDesc: 'We help you rank higher, reach the right audience, and convert leads. From technical and on-page SEO to content strategy, social media, performance marketing, and automation, we deliver data-driven campaigns that align with your business goals.',
    icon: <TrendingUp className="w-8 h-8" />,
    pricing: {
      headline: 'From ₹28,000/mo',
      note: 'Retainers for SEO, content, and campaigns. One-time technical SEO audits from ₹45,000.',
      model: 'Monthly growth retainer · one-time audits available',
      summary:
        'Ongoing retainers cover a defined monthly scope: technical fixes within budget, content or landing pages, and reporting. Paid media spend is billed separately; our fee covers strategy, build, and optimization of campaigns you fund.',
      included: [
        'Monthly plan with prioritized SEO or growth tasks',
        'Reporting on rankings, traffic, or campaign KPIs as agreed',
        'On-page and technical fixes within the retainer hour budget',
        'Quarterly roadmap refresh where applicable',
      ],
      extras: [
        'Ad spend (Meta, Google, etc.), large-scale content production, and influencer or PR retainers are quoted separately.',
      ],
    },
    features: [
      'Search Engine Optimization (SEO)',
      'Website SEO Audit & Optimization',
      'Keyword Research & Strategy',
      'On-Page SEO Optimization',
      'Technical SEO Setup',
      'Local SEO (Google Business Profile Optimization)',
      'Content Marketing Strategy',
      'Social Media Marketing',
      'Performance Marketing Campaigns',
      'Lead Generation & Conversion Optimization',
      'Marketing Automation Setup'
    ],
    technologies: ['Google Analytics', 'Search Console', 'Ahrefs', 'SEMrush', 'Meta Ads', 'Google Ads'],
    process: [
      { title: 'Audit', desc: 'Current performance and opportunity analysis.' },
      { title: 'Strategy', desc: 'Goals, channels, and tactics.' },
      { title: 'Execute', desc: 'Campaigns, content, and optimization.' },
      { title: 'Optimize', desc: 'Tracking, reporting, and iteration.' }
    ]
  },
  {
    id: 'database-development-integration',
    title: 'Database Development & Integration Services',
    shortDesc: 'Robust database design, integration, and data migration so your applications and systems work on a solid data foundation.',
    fullDesc: 'We design and build databases that scale and integrate seamlessly with your apps and third-party systems. From architecture and migration to APIs, backend connectivity, and cloud databases, we deliver reliable data solutions.',
    icon: <Database className="w-8 h-8" />,
    pricing: {
      headline: 'From ₹55,000',
      note: 'Schema design, migration, APIs, and integrations. Complex multi-system work quoted after discovery.',
      model: 'Milestone project · schema / migration / API slices',
      summary:
        'Starting budgets usually map to one clear outcome: a v1 schema and ERD, a bounded migration with validation, or API layers for a specific integration. Multi-year legacy decompositions and real-time sync at scale are phased and priced accordingly.',
      included: [
        'Target schema or integration design for the agreed scope',
        'Implementation scripts or services with basic tests',
        'Cutover or rollout plan for the scoped data move',
        'Handover documentation for operations',
      ],
      extras: [
        'CDC pipelines, zero-downtime cutovers, and regulatory data residency reviews are quoted after technical assessment.',
      ],
    },
    features: [
      'Database Design & Development',
      'Database Architecture Planning',
      'Database Integration with Applications',
      'Data Migration (Old System to New System)',
      'API Development & Database Integration',
      'Backend & Database Connectivity Setup',
      'Cloud Database Integration',
      'Custom Data Management Solutions',
      'Third-Party System Integration'
    ],
    technologies: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'AWS RDS', 'REST/GraphQL'],
    process: [
      { title: 'Assess', desc: 'Requirements, existing systems, and constraints.' },
      { title: 'Design', desc: 'Schema, architecture, and integration approach.' },
      { title: 'Build', desc: 'Development, migration, and APIs.' },
      { title: 'Deploy', desc: 'Go-live, monitoring, and support.' }
    ]
  },
];
