import {
  Building2, Code, Cloud, Shield, Bot, Headphones, Lightbulb, Presentation,
  TrendingUp, Database,
} from 'lucide-react';

export const services = [
  {
    id: 'organization-setup',
    title: 'Organization Setup',
    shortDesc: 'Structured setup of your technology and processes so your organization can scale with clarity and control.',
    fullDesc: 'We help you establish a solid technology foundation from day one. From tooling and workflows to governance and team structure, we design an organization setup that aligns with your goals and grows with you.',
    icon: <Building2 className="w-8 h-8" />,
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
    id: 'infrastructure-cloud',
    title: 'Infrastructure & Cloud',
    shortDesc: 'Reliable, scalable cloud infrastructure and DevOps practices so your systems stay secure and performant.',
    fullDesc: 'We design and manage cloud infrastructure that scales. Whether you are on AWS, Azure, or Google Cloud, we help you optimize costs, automate deployments, and maintain high availability.',
    icon: <Cloud className="w-8 h-8" />,
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
