/** Helpers for invoice / quotation notes with month-aware templates. */

export function formatPeriodFromIso(isoDate) {
  if (!isoDate || !/^\d{4}-\d{2}-\d{2}$/.test(String(isoDate))) {
    return new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  }
  const [y, m, d] = String(isoDate).split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  if (isNaN(dt.getTime())) {
    return new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  }
  return dt.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

export function formatShortDateFromIso(isoDate) {
  if (!isoDate || !/^\d{4}-\d{2}-\d{2}$/.test(String(isoDate))) return 'the date above';
  const [y, m, d] = String(isoDate).split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  if (isNaN(dt.getTime())) return 'the date above';
  return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Default body copy for invoices — updates when invoice month/year changes. */
export function getMonthlyDefaultRemarks(isoDate) {
  const period = formatPeriodFromIso(isoDate);
  return [
    'Thank you for your business.',
    `This invoice covers services / deliverables for ${period}.`,
    'Please remit payment by the due date shown above. For any clarification, contact us at your earliest convenience.',
  ].join('\n');
}

/** Default for quotations — tied to quote date. */
export function getQuotationMonthlyRemarks(isoDate) {
  const period = formatPeriodFromIso(isoDate);
  return [
    'Thank you for considering Rastogi Codeworks.',
    `This quotation is framed for engagement aligned with ${period} unless otherwise agreed.`,
    'Scope, timeline, and commercials stand until the validity date on this quote. We look forward to partnering with you.',
  ].join('\n');
}

/**
 * @param {string} presetId
 * @param {{ invoiceDate?: string, dueDate?: string, clientName?: string }} ctx
 */
export function buildInvoiceRemarkPreset(presetId, ctx) {
  const invoiceDate = ctx.invoiceDate || '';
  const dueDate = ctx.dueDate || '';
  const clientName = (ctx.clientName || '').trim();
  const invShort = formatShortDateFromIso(invoiceDate);
  const dueShort = dueDate && /^\d{4}-\d{2}-\d{2}$/.test(dueDate)
    ? formatShortDateFromIso(dueDate)
    : 'the due date above';

  switch (presetId) {
    case 'monthly':
      return getMonthlyDefaultRemarks(invoiceDate);
    case 'thank_you_period':
      return [
        `Dear ${clientName || 'Valued client'},`,
        '',
        getMonthlyDefaultRemarks(invoiceDate),
      ].join('\n');
    case 'net_7':
      return [
        `Payment is due within 7 days of the invoice date (${invShort}).`,
        'Please reference the invoice number on your transfer / NEFT / UTR.',
      ].join('\n');
    case 'net_15':
      return [
        'Payment terms: Net 15 days from invoice date.',
        `We appreciate settlement by ${dueShort}.`,
        'Delays beyond agreed terms may affect scheduling of ongoing work.',
      ].join('\n');
    case 'gst_standard':
      return [
        'GST is charged as applicable under current regulations. Please retain this tax invoice for your records.',
        'If reverse charge or exemption applies, notify us in writing before payment.',
      ].join('\n');
    case 'milestone':
      return [
        'This invoice represents an agreed milestone / phase as per your Statement of Work or engagement letter.',
        'Continued delivery is subject to clearance as per the payment schedule.',
        'Thank you for your prompt settlement.',
      ].join('\n');
    default:
      return '';
  }
}

/**
 * @param {string} presetId
 * @param {{ quoteDate?: string, clientName?: string }} ctx
 */
export function buildQuotationRemarkPreset(presetId, ctx) {
  const quoteDate = ctx.quoteDate || '';
  const clientName = (ctx.clientName || '').trim();
  const qShort = formatShortDateFromIso(quoteDate);

  switch (presetId) {
    case 'monthly_q':
      return getQuotationMonthlyRemarks(quoteDate);
    case 'thank_you_quote':
      return [
        `Dear ${clientName || 'Valued client'},`,
        '',
        getQuotationMonthlyRemarks(quoteDate),
      ].join('\n');
    case 'acceptance':
      return [
        'This proposal remains open for acceptance until the validity date stated on this quotation.',
        'Work is scheduled to begin after written acceptance and any agreed advance.',
      ].join('\n');
    case 'assumptions':
      return [
        'Assumptions: client provides timely content, feedback, and approvals.',
        'Third-party licences, stock assets, or vendor fees are excluded unless line-itemed above.',
      ].join('\n');
    case 'revision_scope':
      return [
        `Pricing is based on the scope described as of ${qShort}.`,
        'Material scope changes may be quoted as a change request.',
      ].join('\n');
    default:
      return '';
  }
}

export const INVOICE_REMARK_CHIPS = [
  { id: 'monthly', label: 'Monthly default' },
  { id: 'thank_you_period', label: 'Thank you + period' },
  { id: 'net_7', label: 'Net 7' },
  { id: 'net_15', label: 'Net 15' },
  { id: 'gst_standard', label: 'GST note' },
  { id: 'milestone', label: 'Milestone' },
];

export const QUOTATION_REMARK_CHIPS = [
  { id: 'monthly_q', label: 'Monthly default' },
  { id: 'thank_you_quote', label: 'Thank you + period' },
  { id: 'acceptance', label: 'Acceptance' },
  { id: 'assumptions', label: 'Assumptions' },
  { id: 'revision_scope', label: 'Scope / revisions' },
];
