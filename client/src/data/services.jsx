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
      headline: 'From ₹35,000',
      note: 'Three engagement levels below. Larger rollouts and embedded support are quoted after scope. All figures indicative, excl. taxes.',
      model: 'Project-based · phased milestones',
      summary:
        'Start with a focused discovery sprint, move to a deeper operating design, or engage us for an extended transformation programme—each tier has clear outputs; we confirm timelines and investment on a short call.',
      packages: [
        {
          id: 'org-discovery',
          name: 'Discovery & blueprint',
          headline: 'From ₹35,000',
          tagline: 'Compact sprint: stakeholders, constraints, tooling direction, and a written roadmap you can run with.',
          bullets: [
            'Facilitated sessions and constraints review for one business unit or initiative',
            'Technology and tooling recommendations sized to your current scale',
            'Process outline: roles, handoffs, and basics of governance',
            'Written roadmap, next-step checklist, and one Q&A handover',
          ],
        },
        {
          id: 'org-operating-model',
          name: 'Operating model design',
          headline: 'From ₹75,000',
          tagline: 'Deeper design across teams—workflows, tool shortlists, and rollout sequencing.',
          bullets: [
            'Multi-stakeholder workshops and artifact review',
            'Detailed workflow and tooling plan with adoption milestones',
            'RACI-style clarity on roles and decision rights where needed',
            'Executive-ready summary and phased implementation outline',
          ],
        },
        {
          id: 'org-transformation',
          name: 'Programme & transformation',
          headline: 'From ₹1,50,000',
          tagline: 'Larger change efforts—multi-department rollout, PM cadence, and hands-on support blocks (scoped with you).',
          bullets: [
            'Discovery-led programme charter and dependency map',
            'Phased rollout plan with success metrics and governance touchpoints',
            'Optional embedded working sessions beyond documentation—hours in proposal',
            'Final investment and duration agreed before kickoff',
          ],
        },
      ],
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
      headline: 'From ₹50,000',
      note: 'ERP-style systems below are common starting points. Other web and mobile products are scoped separately. All figures indicative, excl. taxes.',
      model: 'Fixed phases, milestone billing, or retainer',
      summary:
        'We deliver internal tools and ERP-style products in clear tiers: a basic-to-mid ERP entry from fifty thousand rupees, a mid-level ERP from one lakh, and custom ERP from two lakhs upward—with final scope, integrations, and milestones agreed after a short discovery call.',
      packages: [
        {
          id: 'erp-basic-mid',
          name: 'Basic to mid ERP',
          headline: 'From ₹50,000',
          tagline: 'Normal ERP coverage for small teams—core modules, straightforward workflows, limited integrations.',
          bullets: [
            'Scoped modules (e.g. masters, transactions, basic reports) agreed in the statement of work',
            'Single deployment target and standard roles/permissions for your team size',
            'Straightforward integrations only where listed in scope; heavier connectors quoted separately',
            'Milestone billing so you approve each phase before the next commitment',
          ],
        },
        {
          id: 'erp-mid',
          name: 'Mid-level ERP',
          headline: 'From ₹1,00,000',
          tagline: 'Broader operational coverage—more modules, reporting, and workflow depth than the entry tier.',
          bullets: [
            'Expanded modules, approvals, and reporting tailored to your operating model',
            'Room for more users, branches, or business rules within the agreed backlog',
            'API and integration points explicitly named in the proposal',
            'Hardening and UAT window as defined before go-live',
          ],
        },
        {
          id: 'erp-custom',
          name: 'Custom ERP',
          headline: 'From ₹2,00,000',
          tagline: 'Large or specialised builds—multi-entity, deep integrations, compliance, or heavy custom logic. Final investment is discussion-based.',
          bullets: [
            'Discovery-led scope: we map entities, integrations, and non-negotiable workflows before quoting',
            'Starting point typically from two lakh rupees; complex programmes priced in phases',
            'Optional retainers for rollout, training, and post-go-live evolution',
            'Everything in writing: deliverables, timelines, and change process before kickoff',
          ],
        },
      ],
      included: [
        'Requirements workshop and backlog for the agreed tier and scope',
        'UI implementation for screens in scope (design may be separate or bundled)',
        'APIs and integrations explicitly listed in the statement of work',
        'Tested build deployed to your hosting or ours for go-live',
        'Post-launch stabilization window as agreed in the proposal',
      ],
      extras: [
        'Second mobile codebase, rare compliance regimes, 24/7 operations, and open-ended change streams are scoped after technical discovery.',
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
      headline: 'From ₹15,000',
      note: 'Three packages below. Domain, hosting, and third-party fees are excluded unless your proposal says otherwise. Long-term help is available at minimal charges—ask us for a support pack.',
      model: 'Fixed-scope project · milestone billing',
      summary:
        'We scope each build after a short brief so pages, features, and integrations match your budget. Standard marketing sites start at fifteen thousand rupees; dynamic and advanced sites from twenty-five thousand; e‑commerce and high‑complexity sites from forty thousand—with exact deliverables confirmed before you pay milestones.',
      packages: [
        {
          id: 'website-standard',
          name: 'Normal full website',
          headline: 'From ₹15,000',
          tagline: 'Full website without domain & hosting in the base price—those are billed separately or as add-ons as per your needs.',
          bullets: [
            'Complete site build aligned to your requirements (pages, sections, and CTAs agreed up front)',
            'Domain registration and hosting not included; we guide purchase and connect everything at go-live',
            'Responsive, mobile-first layout and performance-conscious implementation for the agreed scope',
            'Long-term support for updates, fixes, and questions—minimal charges per request or small retainer',
          ],
        },
        {
          id: 'website-dynamic',
          name: 'Dynamic & advanced dynamic',
          headline: 'From ₹25,000',
          tagline: 'Interactive pages, CMS-friendly sections, and richer behaviour—features and integrations defined in your proposal.',
          bullets: [
            'Dynamic layouts, editable content areas, blogs, directories, or similar—scoped to your feature list',
            'Advanced dynamic builds (portals, dashboards, deeper integrations) priced after discovery',
            'Milestone billing so you approve scope before major build phases',
          ],
        },
        {
          id: 'website-ecommerce',
          name: 'E‑commerce & high‑level websites',
          headline: 'From ₹40,000',
          tagline: 'Online stores, booking engines, and complex marketing or catalogue sites—let’s discuss scope and timeline.',
          bullets: [
            'Product catalogues, checkout flows, payments, and operational workflows quoted to match your catalogue size',
            'High‑level corporate or campaign sites with heavy content, animation, or integrations',
            'Final pricing and milestones agreed with you on a call after we understand products, traffic, and ops',
          ],
        },
      ],
      included: [
        'Kickoff brief to lock pages, sections, and must-have features for your chosen tier',
        'Responsive implementation for everything in the signed scope',
        'Contact or lead capture (or equivalent CTA) when included in scope',
        'Deployment support to your hosting or our recommended stack',
        'Basic on-page SEO (titles, meta, semantic structure) for marketing pages in scope',
        'Handover walkthrough and revision rounds as stated in your proposal',
      ],
      extras: [
        'Copywriting, photography, large migrations, premium plugins, and ongoing retainers beyond light support are quoted separately.',
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
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'Vercel'],
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
      headline: 'From ₹30,000',
      note: 'Scoped cloud slices below; retainers and 24/7 ops quoted separately. All figures indicative, excl. taxes.',
      model: 'One-time projects + optional monthly retainer',
      summary:
        'Entry projects cover a single well-defined outcome; mid-tier adds automation depth; enterprise-grade footprints and multi-account setups are phased from a higher starting point—with everything confirmed after a short architecture review.',
      packages: [
        {
          id: 'cloud-foundation',
          name: 'Environment foundation',
          headline: 'From ₹30,000',
          tagline: 'One focused slice: baseline account setup, simple networking, or a small migration batch—as agreed in writing.',
          bullets: [
            'Target-state diagram for the agreed slice in your cloud account',
            'Implementation of baseline resources or one bounded migration path',
            'Runbook notes and one knowledge-transfer session',
            'Milestone billing aligned to agreed checkpoints',
          ],
        },
        {
          id: 'cloud-automation',
          name: 'CI/CD & automation',
          headline: 'From ₹65,000',
          tagline: 'Pipeline plus IaC starter for one application line; monitoring hooks as scoped.',
          bullets: [
            'CI/CD path for agreed repos and environments',
            'Foundational IaC for resources in scope (e.g. Terraform)',
            'Basic monitoring or alerting wiring where listed',
            'Handover documentation and operator walkthrough',
          ],
        },
        {
          id: 'cloud-platform',
          name: 'Platform & scale',
          headline: 'From ₹1,25,000',
          tagline: 'Multi-service footprints, landing-zone patterns, or production hardening—scoped after discovery.',
          bullets: [
            'Architecture and phased plan for larger or regulated workloads',
            'Implementation spread across agreed milestones',
            'Optional always-on or extended support via separate retainer',
            'Investment and timeline fixed before major build phases',
          ],
        },
      ],
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
      headline: 'From ₹40,000',
      note: 'Assessment-first tiers below; formal certification programmes and pen tests quoted separately. All figures indicative, excl. taxes.',
      model: 'Assessment sprint · remediation quoted separately',
      summary:
        'Start with a focused security assessment, deepen coverage for multiple systems, or engage for a broader compliance programme—remediation and audit support are always scoped as clear follow-on work.',
      packages: [
        {
          id: 'sec-assessment',
          name: 'Focused assessment',
          headline: 'From ₹40,000',
          tagline: 'Scoped review of agreed systems: interviews, config checks, and a prioritized findings report.',
          bullets: [
            'Assessment limited to named apps, cloud accounts, or product areas',
            'Risk and gap summary with severity and rough effort hints',
            'Prioritized remediation backlog for your team or ours',
            'Stakeholder walkthrough of results',
          ],
        },
        {
          id: 'sec-extended',
          name: 'Extended review',
          headline: 'From ₹85,000',
          tagline: 'Broader footprint—more systems, deeper evidence review, and richer remediation planning.',
          bullets: [
            'Wider scope across additional services or environments as listed',
            'Deeper configuration and access-control review where agreed',
            'Remediation plan with phased recommendations',
            'Optional workshop to align security and engineering on fixes',
          ],
        },
        {
          id: 'sec-programme',
          name: 'Compliance programme',
          headline: 'From ₹2,00,000',
          tagline: 'ISO/SOC2-style readiness, policy packs, and sustained evidence work—scoped after scoping call.',
          bullets: [
            'Programme charter, control mapping, and milestone plan',
            'Policy templates and evidence structure aligned to your target framework',
            'Remediation support blocks as agreed—pen tests billed separately if needed',
            'Final fee and timeline confirmed before programme kickoff',
          ],
        },
      ],
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
      headline: 'From ₹80,000',
      note: 'Automation tiers below; production LLM and custom ML scoped after discovery. All figures indicative, excl. taxes.',
      model: 'Fixed automation packs or time-and-materials',
      summary:
        'Start with one or two high-friction workflows, expand to a department-wide automation footprint, or invest in custom AI/LLM features—with safety, data, and hosting needs driving the final quote on the top tier.',
      packages: [
        {
          id: 'auto-workflow',
          name: 'Workflow automation pack',
          headline: 'From ₹80,000',
          tagline: 'One or two bounded automations or integrations (e.g. forms → CRM, billing sync).',
          bullets: [
            'Process mapping and design for agreed flows only',
            'Connectors, bots, or n8n/Power Automate flows in scope',
            'Basic monitoring and error handling for automated paths',
            'Documentation and operator handover',
          ],
        },
        {
          id: 'auto-platform',
          name: 'Multi-flow automation',
          headline: 'From ₹1,60,000',
          tagline: 'Several workflows, richer exception handling, and more system touchpoints.',
          bullets: [
            'Backlog of automations prioritized with your team',
            'Shared patterns for logging, retries, and alerts where applicable',
            'Staging and production rollout plan',
            'Training for owners who will operate day-to-day',
          ],
        },
        {
          id: 'auto-ai-custom',
          name: 'Custom AI & LLM',
          headline: 'From ₹2,75,000',
          tagline: 'Document AI, assistants, or custom models—data volume, safety, and hosting drive final pricing (discussion-based).',
          bullets: [
            'Discovery on data sources, prompts, evaluation, and risk',
            'Build of agreed MVP with human-in-the-loop where required',
            'Production hardening and cost controls as scoped',
            'Phased quote after technical assessment',
          ],
        },
      ],
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
      note: 'Monthly retainers below; ad-hoc hours available. SLAs and coverage vary by tier. All figures indicative, excl. taxes.',
      model: 'Monthly retainer (SLA-based) or prepaid hours',
      summary:
        'Choose a light coverage pack, a standard operating retainer, or a priority tier with faster targets and room for monitoring—exact hours and channels are fixed in your agreement.',
      packages: [
        {
          id: 'support-essential',
          name: 'Essential care',
          headline: 'From ₹18,000/mo',
          tagline: 'Light retainer for small stacks—business-hours coverage and agreed response targets.',
          bullets: [
            'Defined ticket/email channel and severity definitions',
            'Business-hours response targets per agreed SLA table',
            'Routine patching and minor fixes within included hours',
            'Monthly summary of work completed (tier-dependent)',
          ],
        },
        {
          id: 'support-professional',
          name: 'Professional',
          headline: 'From ₹38,000/mo',
          tagline: 'More hours, faster targets, and room for proactive checks on critical paths.',
          bullets: [
            'Higher monthly hour bank or broader system coverage as listed',
            'Improved severity-1/2 targets where agreed',
            'Health checks or monitoring hooks if scoped',
            'Quarterly review of incidents and recommendations',
          ],
        },
        {
          id: 'support-priority',
          name: 'Priority & after-hours',
          headline: 'From ₹65,000/mo',
          tagline: 'Mission-critical coverage, extended windows, or heavier change load—final SLA on discussion.',
          bullets: [
            'Custom SLA including extended or weekend coverage if required',
            'Dedicated severity handling and escalation path',
            'Optional on-call rotation or vendor coordination as scoped',
            'Pricing and hours confirmed before contract start',
          ],
        },
      ],
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
      note: 'Sprint-based tiers below; ongoing advisory retainers quoted separately. All figures indicative, excl. taxes.',
      model: 'Sprint workshop · optional advisory retainer',
      summary:
        'Pick a compact strategy sprint, a deeper options-and-roadmap engagement, or an extended advisory mandate—each tier ends with concrete artifacts you can execute internally or with us.',
      packages: [
        {
          id: 'consult-sprint',
          name: 'Strategy sprint',
          headline: 'From ₹35,000',
          tagline: 'Short engagement: goals, constraints, options, and a prioritized roadmap or decision memo.',
          bullets: [
            'Facilitated sessions with leadership or product owners',
            'Synthesis of goals, constraints, and realistic options',
            'Prioritized roadmap or decision memo',
            'One follow-up Q&A session',
          ],
        },
        {
          id: 'consult-deep-dive',
          name: 'Deep-dive & options',
          headline: 'From ₹72,000',
          tagline: 'More stakeholder coverage, richer artifacts, and vendor/build-vs-buy framing where needed.',
          bullets: [
            'Extended interviews and document/artifact review',
            'Scenario comparison with trade-offs and recommendation',
            'Roadmap with phases, risks, and dependency notes',
            'Workshop to align leadership on next steps',
          ],
        },
        {
          id: 'consult-advisory',
          name: 'Advisory programme',
          headline: 'From ₹1,40,000',
          tagline: 'Multi-month guidance, vendor diligence support, or transformation steering—scoped collaboratively.',
          bullets: [
            'Programme charter and cadence (e.g. monthly steering + async reviews)',
            'Support for RFPs, vendor shortlists, or diligence checkpoints as agreed',
            'Artifacts tailored to board or investor audiences if required',
            'Retainer length and fee agreed upfront',
          ],
        },
      ],
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
      note: 'Per-deck tiers below; rush, motion, and illustration add-ons quoted separately. All figures indicative, excl. taxes.',
      model: 'Per deliverable · fixed rounds of revision',
      summary:
        'Standard decks for internal or SMB use, richer investor or sales collateral, or large flagship documents—slide counts, brand complexity, and revision rounds are fixed in each proposal.',
      packages: [
        {
          id: 'deck-standard',
          name: 'Standard deck',
          headline: 'From ₹12,000',
          tagline: 'Compact deck—typically up to ~15 slides, polish-your-content or light narrative help.',
          bullets: [
            'Agreed slide count and master layout in proposal',
            'On-brand styling, charts, and icons as scoped',
            'Fixed revision rounds (stated in writing)',
            'Deliverables: PPT / Slides / PDF as agreed',
          ],
        },
        {
          id: 'deck-professional',
          name: 'Professional deck',
          headline: 'From ₹28,000',
          tagline: 'Larger or higher-stakes decks—investor, sales, or company profile—with more slides and structure.',
          bullets: [
            'Higher slide budget and deeper narrative or restructuring support',
            'Data visuals and section templates aligned to your brand',
            'Additional revision round vs standard tier where listed',
            'Source files and export pack per agreement',
          ],
        },
        {
          id: 'deck-flagship',
          name: 'Flagship & reports',
          headline: 'From ₹48,000',
          tagline: 'Large decks, print-ready reports, or multi-deliverable sets—scope and timeline confirmed with you.',
          bullets: [
            'Long-form slide programmes or formatted report/document packages',
            'Print or digital export requirements captured up front',
            'Optional data cleanup or content support as add-on',
            'Rush timelines quoted if you need a hard deadline',
          ],
        },
      ],
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
      note: 'Monthly retainers below; ad spend always separate. One-time audits from ₹45,000 on request. All figures indicative, excl. taxes.',
      model: 'Monthly growth retainer · one-time audits available',
      summary:
        'Grow from a lean SEO/content rhythm into a fuller growth retainer or a high-velocity programme—monthly hours, deliverables, and reporting depth scale with each tier.',
      packages: [
        {
          id: 'growth-essential',
          name: 'Growth essential',
          headline: 'From ₹28,000/mo',
          tagline: 'Focused monthly scope: technical fixes within hour budget, light content, and core reporting.',
          bullets: [
            'Monthly plan with prioritized SEO or growth tasks',
            'On-page and technical fixes within included hours',
            'Reporting on agreed KPIs (traffic, rankings, or campaign metrics)',
            'Quarterly roadmap refresh where applicable',
          ],
        },
        {
          id: 'growth-accelerate',
          name: 'Accelerate',
          headline: 'From ₹55,000/mo',
          tagline: 'More content, landing pages, and optimization cycles; room for light paid-media build support.',
          bullets: [
            'Higher monthly hour bank and broader channel coverage as listed',
            'Additional landing pages or content pieces per month',
            'Closer performance reviews and experiment backlog',
            'Paid media creative/build support—ad spend still separate',
          ],
        },
        {
          id: 'growth-scale',
          name: 'Scale & campaigns',
          headline: 'From ₹95,000/mo',
          tagline: 'Heavier production, multi-channel coordination, or faster iteration—scoped to your growth targets.',
          bullets: [
            'Expanded deliverables for SEO, content, and campaign ops as agreed',
            'More frequent reporting and strategic check-ins',
            'Coordination with your internal or agency partners if needed',
            'Custom scope and fee confirmed before start',
          ],
        },
      ],
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
      headline: 'From ₹26,000',
      note: 'Bounded data projects below; CDC, zero-downtime cutovers, and multi-year programmes after assessment. All figures indicative, excl. taxes.',
      model: 'Milestone project · schema / migration / API slices',
      summary:
        'Start with a single sharp outcome—schema, migration slice, or integration API—scale to multi-system migration, or engage for enterprise data programmes phased from a higher entry point.',
      packages: [
        {
          id: 'db-slice',
          name: 'Schema or integration slice',
          headline: 'From ₹26,000',
          tagline: 'One focused deliverable: v1 schema/ERD, a small API layer, or a bounded integration as written in scope.',
          bullets: [
            'Target design for the agreed database or integration surface',
            'Implementation with basic tests for scoped paths',
            'Handover notes for your engineers or ops',
            'Milestone billing tied to agreed checkpoints',
          ],
        },
        {
          id: 'db-migration',
          name: 'Migration batch',
          headline: 'From ₹58,000',
          tagline: 'Larger data move with validation, reconciliation plan, and cutover steps for one systems pair.',
          bullets: [
            'Extract/transform/load or sync approach for agreed entities',
            'Validation scripts or sampling plan as scoped',
            'Cutover playbook and rollback considerations',
            'Post-cutover smoke checks within agreed window',
          ],
        },
        {
          id: 'db-enterprise',
          name: 'Enterprise data programme',
          headline: 'From ₹1,15,000',
          tagline: 'Multi-system integration, ongoing sync, or complex legacy decomposition—phased after discovery.',
          bullets: [
            'Technical assessment and phased programme plan',
            'Implementation spread across agreed milestones',
            'Optional always-on sync or CDC quoted as follow-on phases',
            'Investment and timeline fixed before major execution',
          ],
        },
      ],
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
