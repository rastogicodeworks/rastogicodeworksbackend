import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { Invoice } from '../models/Invoice.js';
import { User } from '../models/User.js';

export const invoicesRouter = Router();

// Auto-overdue: mark unpaid/partial invoices with a past due date as overdue
async function autoMarkOverdue(filter = {}) {
  const today = new Date().toISOString().slice(0, 10);
  try {
    await Invoice.updateMany(
      { ...filter, status: { $in: ['unpaid', 'partially_paid'] }, dueDate: { $lte: today, $exists: true, $ne: '' } },
      { $set: { status: 'overdue' } },
    );
  } catch (_) {}
}

// All routes below require admin authentication
invoicesRouter.use(requireAdmin);

// GET /api/invoices?status=paid|unpaid|partially_paid|overdue
invoicesRouter.get('/', async (req, res) => {
  try {
    await autoMarkOverdue();
    const { status } = req.query;
    const query = {};
    if (status && ['paid', 'unpaid', 'partially_paid', 'overdue'].includes(status)) {
      query.status = status;
    }

    const invoices = await Invoice.find(query).sort({ createdAt: -1 }).lean();
    res.json({ success: true, invoices });
  } catch (err) {
    console.error('[invoices/get] error', err);
    res.status(500).json({ success: false, message: 'Failed to load invoices.' });
  }
});

// Helper to compute totals server-side (no tax applied)
function computeTotals(items, taxRate = 0) {
  const subtotal = (items || []).reduce(
    (sum, item) => sum + ((Number(item.quantity) || 0) * (Number(item.price) || 0)),
    0,
  );
  const tax = 0;
  const total = subtotal;
  return { subtotal, taxRate, tax, total };
}

function normalizePaymentTerms(paymentTerms = [], invoiceTotal = 0) {
  if (!Array.isArray(paymentTerms)) return [];
  return paymentTerms
    .filter((t) => t && Number(t.percentage) > 0)
    .map((t) => {
      const percentage = Number(t.percentage) || 0;
      const status = ['due', 'paid', 'partially_paid', 'overdue'].includes(t.status) ? t.status : 'due';
      const installmentAmount = (Number(invoiceTotal) || 0) * percentage / 100;
      let partialAmount = Number(t.partialAmount) || 0;
      if (status !== 'partially_paid') partialAmount = 0;
      if (partialAmount < 0) partialAmount = 0;
      if (installmentAmount > 0 && partialAmount > installmentAmount) partialAmount = installmentAmount;
      return {
        label: String(t.label || '').trim(),
        percentage,
        dueDate: String(t.dueDate || '').trim(),
        status,
        partialAmount,
      };
    });
}

function computeOutstandingFromTerms(paymentTerms = [], invoiceTotal = 0, invoiceStatus = 'unpaid') {
  const total = Number(invoiceTotal) || 0;
  if (String(invoiceStatus) === 'paid') return 0;
  if (total <= 0 || !Array.isArray(paymentTerms) || paymentTerms.length === 0) return total;
  const paid = paymentTerms.reduce((sum, term) => {
    const pct = Number(term?.percentage) || 0;
    if (pct <= 0) return sum;
    const termAmount = total * pct / 100;
    const st = String(term?.status || 'due');
    if (st === 'paid') return sum + termAmount;
    if (st === 'partially_paid') {
      const part = Math.max(0, Number(term?.partialAmount) || 0);
      return sum + Math.min(part, termAmount);
    }
    return sum;
  }, 0);
  return Math.max(0, total - paid);
}

// POST /api/invoices
invoicesRouter.post('/', async (req, res) => {
  try {
    const {
      clientName,
      clientEmail,
      billingAddress,
      gstNumber,
      invoiceDate,
      dueDate,
      items = [],
      notes,
      status: bodyStatus,
      paymentTerms,
      previousBalanceDue,
      balanceDue,
      linkedPartialInvoiceId,
    } = req.body || {};

    if (!clientName || !invoiceDate) {
      return res.status(400).json({
        success: false,
        message: 'Client name and invoice date are required.',
      });
    }

    const cleanedItems = (items || []).map((item) => ({
      description: item.description ?? '',
      quantity: Number(item.quantity) || 0,
      price: Number(item.price) || 0,
    }));

    const totals = computeTotals(cleanedItems);

    const status = bodyStatus && ['unpaid', 'paid', 'partially_paid', 'overdue'].includes(bodyStatus) ? bodyStatus : 'unpaid';

    const cleanedTerms = normalizePaymentTerms(paymentTerms, totals.total);
    const computedPreviousDue = Math.max(0, Number(previousBalanceDue) || 0);
    const currentOutstanding = computeOutstandingFromTerms(cleanedTerms, totals.total, status);
    const settledAmount = Math.max(0, totals.total - currentOutstanding);
    const computedBalanceDue = balanceDue !== undefined
      ? Math.max(0, Number(balanceDue) || 0)
      : (linkedPartialInvoiceId
        ? Math.max(0, computedPreviousDue - settledAmount)
        : Math.max(0, currentOutstanding + computedPreviousDue));

    const invoice = await Invoice.create({
      clientName: clientName.trim(),
      clientEmail: clientEmail ? String(clientEmail).trim().toLowerCase() : undefined,
      billingAddress: billingAddress ? String(billingAddress).trim() : undefined,
      gstNumber: gstNumber ? String(gstNumber).trim() : undefined,
      invoiceDate,
      dueDate,
      items: cleanedItems,
      notes,
      ...totals,
      previousBalanceDue: computedPreviousDue,
      balanceDue: computedBalanceDue,
      linkedPartialInvoiceId: linkedPartialInvoiceId || undefined,
      status,
      paymentTerms: cleanedTerms,
    });

    // Keep client profile billing/GST data synced for future invoice autofill.
    if (clientEmail) {
      const profileUpdate = {};
      if (billingAddress !== undefined) profileUpdate.billingAddress = billingAddress ? String(billingAddress).trim() : '';
      if (gstNumber !== undefined) profileUpdate.gstNumber = gstNumber ? String(gstNumber).trim() : '';
      if (Object.keys(profileUpdate).length > 0) {
        await User.updateOne(
          { role: 'client', email: String(clientEmail).trim().toLowerCase() },
          { $set: profileUpdate },
        );
      }
    }

    res.status(201).json({ success: true, invoice });
  } catch (err) {
    console.error('[invoices/post] error', err);
    res.status(500).json({ success: false, message: 'Failed to create invoice.' });
  }
});

// PATCH /api/invoices/:id
invoicesRouter.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      clientName,
      billingAddress,
      gstNumber,
      invoiceDate,
      dueDate,
      items,
      notes,
      paymentTerms,
      previousBalanceDue,
      balanceDue,
      linkedPartialInvoiceId,
    } = req.body || {};

    const update = {};

    if (status && ['paid', 'unpaid', 'partially_paid', 'overdue'].includes(status)) {
      update.status = status;
    }
    if (clientName !== undefined) update.clientName = clientName;
    if (billingAddress !== undefined) update.billingAddress = billingAddress ? String(billingAddress).trim() : undefined;
    if (gstNumber !== undefined) update.gstNumber = gstNumber ? String(gstNumber).trim() : undefined;
    if (invoiceDate !== undefined) update.invoiceDate = invoiceDate;
    if (dueDate !== undefined) update.dueDate = dueDate;
    if (notes !== undefined) update.notes = notes;
    if (previousBalanceDue !== undefined) update.previousBalanceDue = Math.max(0, Number(previousBalanceDue) || 0);
    if (balanceDue !== undefined) update.balanceDue = Math.max(0, Number(balanceDue) || 0);
    if (linkedPartialInvoiceId !== undefined) update.linkedPartialInvoiceId = linkedPartialInvoiceId || undefined;

    if (items) {
      const cleanedItems = items.map((item) => ({
        description: item.description ?? '',
        quantity: Number(item.quantity) || 0,
        price: Number(item.price) || 0,
      }));
      const totals = computeTotals(cleanedItems);
      update.items = cleanedItems;
      update.subtotal = totals.subtotal;
      update.taxRate = totals.taxRate;
      update.tax = totals.tax;
      update.total = totals.total;
    }

    if (Array.isArray(paymentTerms)) {
      const baseTotal = update.total !== undefined ? update.total : (await Invoice.findById(id).select('total').lean())?.total || 0;
      update.paymentTerms = normalizePaymentTerms(paymentTerms, baseTotal);
      if (balanceDue === undefined) {
        const currentStatus = update.status !== undefined
          ? update.status
          : (await Invoice.findById(id).select('status').lean())?.status || 'unpaid';
        const prevDue = update.previousBalanceDue !== undefined
          ? update.previousBalanceDue
          : (await Invoice.findById(id).select('previousBalanceDue').lean())?.previousBalanceDue || 0;
        const currentOutstanding = computeOutstandingFromTerms(update.paymentTerms, baseTotal, currentStatus);
        const settledAmount = Math.max(0, baseTotal - currentOutstanding);
        update.balanceDue = update.linkedPartialInvoiceId
          ? Math.max(0, (Number(prevDue) || 0) - settledAmount)
          : Math.max(0, currentOutstanding + (Number(prevDue) || 0));
      }
    }

    const invoice = await Invoice.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).lean();

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found.' });
    }

    res.json({ success: true, invoice });
  } catch (err) {
    console.error('[invoices/patch] error', err);
    res.status(500).json({ success: false, message: 'Failed to update invoice.' });
  }
});

// PATCH /api/invoices/:id/dispute — admin can clear disputes
invoicesRouter.patch('/:id/dispute', async (req, res) => {
  try {
    const { flagged, note } = req.body || {};
    const update = {
      'dispute.flagged': !!flagged,
      'dispute.note': note ? String(note).trim() : '',
      'dispute.flaggedAt': flagged ? new Date() : null,
    };
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, { $set: update }, { new: true }).lean();
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found.' });
    return res.json({ success: true, invoice });
  } catch (err) {
    console.error('[invoices/dispute]', err);
    return res.status(500).json({ success: false, message: 'Failed to update dispute.' });
  }
});

// DELETE /api/invoices/:id
invoicesRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findByIdAndDelete(id).lean();

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found.' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('[invoices/delete] error', err);
    res.status(500).json({ success: false, message: 'Failed to delete invoice.' });
  }
});

