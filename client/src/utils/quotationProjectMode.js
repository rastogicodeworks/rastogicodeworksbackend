import { getScopeDefaultText } from './quotationScope.js';

export const PROJECT_DELIVERY_MODES = [
  {
    id: '',
    label: '-- Select project type --',
    pdfLabel: '',
    deliveryUnit: 'days',
    deliveryPlaceholder: 'e.g. 30',
    defaultDeliveryDays: '',
    scopeType: '',
    detailsLabel: '',
    detailsPlaceholder: '',
    defaultDetails: '',
    showPhaseCount: false,
  },
  {
    id: 'complete',
    label: 'Complete project (single delivery)',
    pdfLabel: 'Complete project — single delivery',
    deliveryUnit: 'days',
    deliveryPlaceholder: 'e.g. 45',
    defaultDeliveryDays: '45',
    scopeType: 'fixed',
    detailsLabel: 'Delivery & handover notes',
    detailsPlaceholder: 'Final deliverables, UAT window, go-live, and handover checklist…',
    defaultDetails: [
      'End-to-end delivery with a single go-live / handover at project completion.',
      'Milestones may be used internally; commercials and timeline are for the full scope unless line-itemed.',
      'Client sign-off on UAT triggers final invoice as per payment terms.',
    ].join('\n'),
    showPhaseCount: false,
  },
  {
    id: 'phased',
    label: 'Phase-wise project',
    pdfLabel: 'Phase-wise project',
    deliveryUnit: 'months',
    deliveryPlaceholder: 'e.g. 4',
    defaultDeliveryDays: '4',
    scopeType: 'phased',
    detailsLabel: 'Phase breakdown',
    detailsPlaceholder: 'Phase 1: Discovery — 2 weeks\nPhase 2: Build — 6 weeks\nPhase 3: Launch — 2 weeks',
    defaultDetails: [
      'Phase 1 — Discovery & planning: requirements, wireframes, and signed blueprint.',
      'Phase 2 — Build & integration: core features, QA, and staging review.',
      'Phase 3 — Launch & handover: production deploy, training, and documentation.',
    ].join('\n'),
    showPhaseCount: true,
    defaultPhaseCount: '3',
  },
];

export function getProjectDeliveryMode(id) {
  return PROJECT_DELIVERY_MODES.find((m) => m.id === id) || PROJECT_DELIVERY_MODES[0];
}

/** Defaults applied when project type changes (respects user-edited flags). */
export function applyProjectModeToQuotation(prev, nextModeId, flags = {}) {
  const mode = getProjectDeliveryMode(nextModeId);
  const nextScopeDefault = mode.scopeType ? getScopeDefaultText(mode.scopeType) : '';
  const prevMode = getProjectDeliveryMode(prev.projectDeliveryMode);
  const prevScopeDefault = prevMode.scopeType ? getScopeDefaultText(prevMode.scopeType).trim() : '';
  const prevDetailsDefault = (prevMode.defaultDetails || '').trim();
  const trimmedScope = (prev.scopeDetails || '').trim();
  const trimmedDetails = (prev.projectModeDetails || '').trim();
  const scopeUserEdited = flags.scopeUserEdited ?? (trimmedScope && trimmedScope !== prevScopeDefault);
  const detailsUserEdited = flags.detailsUserEdited ?? (trimmedDetails && trimmedDetails !== prevDetailsDefault);

  if (!nextModeId) {
    return {
      ...prev,
      projectDeliveryMode: '',
      phaseCount: '',
      projectModeDetails: '',
    };
  }

  return {
    ...prev,
    projectDeliveryMode: nextModeId,
    deliveryUnit: mode.deliveryUnit,
    deliveryDays: flags.keepDeliveryDays ? prev.deliveryDays : (mode.defaultDeliveryDays || ''),
    scopeType: scopeUserEdited ? prev.scopeType : (mode.scopeType || prev.scopeType),
    scopeDetails: scopeUserEdited ? prev.scopeDetails : nextScopeDefault,
    phaseCount: mode.showPhaseCount ? (prev.phaseCount || mode.defaultPhaseCount || '') : '',
    projectModeDetails: detailsUserEdited ? prev.projectModeDetails : mode.defaultDetails,
  };
}

export function buildProjectModePdfBody({ projectDeliveryMode, phaseCount, projectModeDetails }) {
  const mode = getProjectDeliveryMode(projectDeliveryMode);
  if (!projectDeliveryMode) return '';
  const meta = [];
  if (mode.pdfLabel) meta.push(mode.pdfLabel);
  if (mode.showPhaseCount && String(phaseCount || '').trim()) {
    meta.push(`Phases: ${phaseCount}`);
  }
  const details = String(projectModeDetails || '').trim();
  const metaBlock = meta.join('\n');
  if (metaBlock && details) return `${metaBlock}\n\n${details}`;
  return metaBlock || details;
}
