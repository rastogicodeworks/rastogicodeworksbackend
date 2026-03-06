import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { Invoice } from '../models/Invoice.js';

export const invoicesRouter = Router();

// Auto-overdue: mark unpaid invoices with a past due date as overdue
async function autoMarkOverdue(filter = {}) {
  const today = new Date().toISOString().slice(0, 10);
  try {
    await Invoice.updateMany(
      { ...filter, status: 'unpaid', dueDate: { $lte: today, $exists: true, $ne: '' } },
      { $set: { status: 'overdue' } },
    );
  } catch (_) {}
}

// All routes below require admin authentication
invoicesRouter.use(requireAdmin);

// GET /api/invoices?status=paid|unpaid|overdue
invoicesRouter.get('/', async (req, res) => {
  try {
    await autoMarkOverdue();
    const { status } = req.query;
    const query = {};
    if (status && ['paid', 'unpaid', 'overdue'].includes(status)) {
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

// POST /api/invoices
invoicesRouter.post('/', async (req, res) => {
  try {
    const { clientName, clientEmail, billingAddress, gstNumber, invoiceDate, dueDate, items = [], notes, status: bodyStatus, paymentTerms } = req.body || {};

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

    const status = bodyStatus && ['unpaid', 'paid', 'overdue'].includes(bodyStatus) ? bodyStatus : 'unpaid';

    const cleanedTerms = Array.isArray(paymentTerms)
      ? paymentTerms
          .filter((t) => t && Number(t.percentage) > 0)
          .map((t) => ({ label: String(t.label || '').trim(), percentage: Number(t.percentage), dueDate: String(t.dueDate || '').trim() }))
      : [];

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
      status,
      paymentTerms: cleanedTerms,
    });

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
    const { status, clientName, billingAddress, gstNumber, invoiceDate, dueDate, items, notes, paymentTerms } = req.body || {};

    const update = {};

    if (status && ['paid', 'unpaid', 'overdue'].includes(status)) {
      update.status = status;
    }
    if (clientName !== undefined) update.clientName = clientName;
    if (billingAddress !== undefined) update.billingAddress = billingAddress ? String(billingAddress).trim() : undefined;
    if (gstNumber !== undefined) update.gstNumber = gstNumber ? String(gstNumber).trim() : undefined;
    if (invoiceDate !== undefined) update.invoiceDate = invoiceDate;
    if (dueDate !== undefined) update.dueDate = dueDate;
    if (notes !== undefined) update.notes = notes;

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
      update.paymentTerms = paymentTerms
        .filter((t) => t && Number(t.percentage) > 0)
        .map((t) => ({ label: String(t.label || '').trim(), percentage: Number(t.percentage), dueDate: String(t.dueDate || '').trim() }));
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

