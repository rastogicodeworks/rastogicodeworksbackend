/** Format installment rows into PDF / DB payment terms text. */

export function getQuotationPaymentTermRows(terms = []) {
  return (terms || [])
    .filter((t) => Number(t?.percentage) > 0)
    .map((term, i) => ({
      label: (term.label || '').trim() || `Installment ${i + 1}`,
      percentage: Number(term.percentage) || 0,
    }));
}

/** Parse saved payment terms text (re-download from DB). */
export function parsePaymentTermsFromText(text = '') {
  return String(text || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, i) => {
      const match = line.match(/^(.+?):\s*(\d+(?:\.\d+)?)\s*%?\s*[—–-]\s*Rs\.?\s*([\d,]+(?:\.\d+)?)/i);
      if (!match) return null;
      return {
        label: match[1].trim() || `Installment ${i + 1}`,
        percentage: Number(match[2]) || 0,
      };
    })
    .filter((row) => row && row.percentage > 0);
}

/** Prefer live installment rows; fall back to saved text. */
export function resolveQuotationPaymentTermRows(paymentTerms, paymentTermsInstallments) {
  if (Array.isArray(paymentTermsInstallments) && paymentTermsInstallments.length > 0) {
    return getQuotationPaymentTermRows(paymentTermsInstallments);
  }
  if (Array.isArray(paymentTerms) && paymentTerms.length > 0 && typeof paymentTerms[0] === 'object') {
    return getQuotationPaymentTermRows(paymentTerms);
  }
  if (typeof paymentTerms === 'string' && paymentTerms.trim()) {
    return parsePaymentTermsFromText(paymentTerms);
  }
  return [];
}

export function formatPaymentTermsForPdf(terms = [], total = 0) {
  const rows = getQuotationPaymentTermRows(terms);
  if (rows.length === 0) return '';

  const invoiceTotal = Number(total) || 0;
  return rows
    .map((term) => {
      const amt = invoiceTotal * term.percentage / 100;
      return `${term.label}: ${term.percentage}% — Rs. ${amt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    })
    .join('\n');
}
