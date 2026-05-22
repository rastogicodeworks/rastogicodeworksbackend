/**
 * Collected / outstanding amounts for dashboard metrics.
 * Mirrors server invoice payment-term logic (paid + partially_paid milestones).
 */

export function getCollectedFromInvoice(inv) {
  const total = Number(inv?.total) || 0;
  if (total <= 0) return 0;
  if (String(inv?.status) === 'paid') return total;

  const terms = Array.isArray(inv?.paymentTerms) ? inv.paymentTerms : [];
  const hasTerms = terms.some((t) => Number(t?.percentage) > 0);
  if (hasTerms) {
    return terms.reduce((sum, term) => {
      const pct = Number(term?.percentage) || 0;
      if (pct <= 0) return sum;
      const termAmount = (total * pct) / 100;
      const st = String(term?.status || 'due');
      if (st === 'paid') return sum + termAmount;
      if (st === 'partially_paid') {
        const partial = Math.max(0, Number(term?.partialAmount) || 0);
        return sum + Math.min(partial, termAmount);
      }
      return sum;
    }, 0);
  }

  if (String(inv?.status) === 'partially_paid') {
    const balance = Number(inv?.balanceDue);
    if (!Number.isNaN(balance) && balance >= 0) return Math.max(0, total - balance);
  }

  return 0;
}

export function getOutstandingFromInvoice(inv) {
  const total = Number(inv?.total) || 0;
  if (total <= 0) return 0;
  if (String(inv?.status) === 'paid') return 0;

  const collected = getCollectedFromInvoice(inv);
  if (collected > 0) return Math.max(0, total - collected);

  const balance = Number(inv?.balanceDue);
  if (!Number.isNaN(balance) && balance >= 0) return balance;

  return total;
}

export function isInvoiceFullyCollected(inv) {
  const total = Number(inv?.total) || 0;
  if (total <= 0) return true;
  return getCollectedFromInvoice(inv) >= total - 0.01;
}
