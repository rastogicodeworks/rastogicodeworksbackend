/** Scope-of-work types for quotation form + PDF. */

export const QUOTATION_SCOPE_TYPES = [
  { id: '', label: '-- Select scope type --', pdfTitle: '', defaultText: '' },
  {
    id: 'fixed',
    label: 'Fixed scope',
    pdfTitle: 'Scope of Work — Fixed',
    defaultText: [
      'Deliverables, timeline, and commercials are fixed as per this quotation.',
      'Work outside the listed items will be treated as a change request and quoted separately.',
      'Client provides timely feedback, content, and approvals within agreed turnaround.',
    ].join('\n'),
  },
  {
    id: 'phased',
    label: 'Phased delivery',
    pdfTitle: 'Scope of Work — Phased',
    defaultText: [
      'Engagement is split into phases with milestones, reviews, and sign-off at each stage.',
      'Subsequent phases begin after acceptance of the prior phase and any agreed payment.',
      'Scope refinements within a phase are accommodated; material additions are change requests.',
    ].join('\n'),
  },
  {
    id: 'discovery',
    label: 'Discovery & blueprint',
    pdfTitle: 'Scope of Work — Discovery',
    defaultText: [
      'Discovery workshops, constraints review, and a written blueprint / roadmap.',
      'Outputs: recommendations, tooling direction, and next-step plan — not full build delivery.',
      'Implementation beyond discovery requires a separate quotation or SOW.',
    ].join('\n'),
  },
  {
    id: 'retainer',
    label: 'Monthly retainer',
    pdfTitle: 'Scope of Work — Retainer',
    defaultText: [
      'Ongoing support / development capacity for a defined number of hours or story points per month.',
      'Unused capacity does not roll over unless agreed in writing.',
      'Priority support channel and response targets as per engagement letter.',
    ].join('\n'),
  },
  {
    id: 'maintenance',
    label: 'Maintenance & support',
    pdfTitle: 'Scope of Work — Maintenance',
    defaultText: [
      'Bug fixes, security patches, minor updates, and monitoring within agreed SLA.',
      'New features, redesigns, and third-party licence costs are excluded unless line-itemed.',
      'Access to staging/production and escalation contacts as documented.',
    ].join('\n'),
  },
  {
    id: 'custom',
    label: 'Custom (write your own)',
    pdfTitle: 'Scope of Work',
    defaultText: '',
  },
];

export function getQuotationScopeType(id) {
  return QUOTATION_SCOPE_TYPES.find((t) => t.id === id) || QUOTATION_SCOPE_TYPES[0];
}

export function getScopePdfTitle(scopeType) {
  const t = getQuotationScopeType(scopeType);
  return t.pdfTitle || 'Scope of Work';
}

export function getScopeDefaultText(scopeType) {
  return getQuotationScopeType(scopeType).defaultText || '';
}
