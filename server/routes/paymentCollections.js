import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { PaymentCollection } from '../models/PaymentCollection.js';

export const paymentCollectionsRouter = Router();
paymentCollectionsRouter.use(requireAdmin);

function normalizeAmounts(amount, collectedAmount) {
  const amt = Math.max(0, Number(amount) || 0);
  let col = Math.max(0, Number(collectedAmount) || 0);
  if (col > amt && amt > 0) col = amt;
  return { amount: amt, collectedAmount: col };
}

function deriveStatus(amount, collectedAmount, requestedStatus) {
  if (requestedStatus === 'cancelled') return 'cancelled';
  const { amount: amt, collectedAmount: col } = normalizeAmounts(amount, collectedAmount);
  if (amt <= 0 && col <= 0) return 'pending';
  if (col >= amt && amt > 0) return 'collected';
  if (col > 0) return 'partial';
  return 'pending';
}

async function applyOverdueStatus() {
  const today = new Date().toISOString().slice(0, 10);
  try {
    await PaymentCollection.updateMany(
      {
        status: { $in: ['pending', 'partial'] },
        dueDate: { $lte: today, $exists: true, $ne: '' },
      },
      { $set: { status: 'overdue' } },
    );
  } catch (_) {}
}

function withRemaining(doc) {
  const amount = Number(doc.amount) || 0;
  const collectedAmount = Number(doc.collectedAmount) || 0;
  const remaining = Math.max(0, amount - collectedAmount);
  return { ...doc, remaining };
}

// GET /api/payment-collections?status=pending|partial|collected|overdue|cancelled
paymentCollectionsRouter.get('/', async (req, res) => {
  try {
    await applyOverdueStatus();
    const { status } = req.query;
    const query = {};
    if (status && ['pending', 'partial', 'collected', 'overdue', 'cancelled'].includes(status)) {
      query.status = status;
    }
    const rows = await PaymentCollection.find(query).sort({ dueDate: 1, createdAt: -1 }).lean();
    const collections = rows.map(withRemaining);
    const summary = collections.reduce(
      (acc, row) => {
        if (row.status === 'cancelled') return acc;
        acc.totalExpected += row.amount || 0;
        acc.totalCollected += row.collectedAmount || 0;
        acc.totalRemaining += row.remaining || 0;
        return acc;
      },
      { totalExpected: 0, totalCollected: 0, totalRemaining: 0 },
    );
    return res.json({ success: true, collections, summary });
  } catch (err) {
    console.error('[payment-collections/get]', err);
    return res.status(500).json({ success: false, message: 'Failed to load payment collections.' });
  }
});

// POST /api/payment-collections
paymentCollectionsRouter.post('/', async (req, res) => {
  try {
    const {
      clientName,
      clientEmail,
      description,
      amount,
      collectedAmount,
      dueDate,
      notes,
      status,
      linkedInvoiceId,
    } = req.body || {};

    if (!clientName?.trim()) {
      return res.status(400).json({ success: false, message: 'Client name is required.' });
    }

    const { amount: amt, collectedAmount: col } = normalizeAmounts(amount, collectedAmount);
    if (amt <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be greater than zero.' });
    }

    const finalStatus = deriveStatus(amt, col, status);

    const row = await PaymentCollection.create({
      clientName: String(clientName).trim(),
      clientEmail: clientEmail ? String(clientEmail).trim().toLowerCase() : '',
      description: description ? String(description).trim() : '',
      amount: amt,
      collectedAmount: col,
      dueDate: dueDate ? String(dueDate).trim() : '',
      notes: notes ? String(notes).trim() : '',
      status: finalStatus,
      linkedInvoiceId: linkedInvoiceId || undefined,
    });

    return res.status(201).json({ success: true, collection: withRemaining(row.toObject()) });
  } catch (err) {
    console.error('[payment-collections/post]', err);
    return res.status(500).json({ success: false, message: 'Failed to create payment entry.' });
  }
});

// PATCH /api/payment-collections/:id
paymentCollectionsRouter.patch('/:id', async (req, res) => {
  try {
    const existing = await PaymentCollection.findById(req.params.id).lean();
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Payment entry not found.' });
    }

    const {
      clientName,
      clientEmail,
      description,
      amount,
      collectedAmount,
      dueDate,
      notes,
      status,
      linkedInvoiceId,
    } = req.body || {};

    const update = {};
    if (clientName !== undefined) update.clientName = String(clientName).trim();
    if (clientEmail !== undefined) update.clientEmail = String(clientEmail).trim().toLowerCase();
    if (description !== undefined) update.description = String(description).trim();
    if (dueDate !== undefined) update.dueDate = String(dueDate).trim();
    if (notes !== undefined) update.notes = String(notes).trim();
    if (linkedInvoiceId !== undefined) update.linkedInvoiceId = linkedInvoiceId || null;

    const nextAmount = amount !== undefined ? amount : existing.amount;
    const nextCollected = collectedAmount !== undefined ? collectedAmount : existing.collectedAmount;
    const { amount: amt, collectedAmount: col } = normalizeAmounts(nextAmount, nextCollected);
    update.amount = amt;
    update.collectedAmount = col;

    const requestedStatus = status !== undefined ? status : existing.status;
    update.status = deriveStatus(amt, col, requestedStatus);

    const row = await PaymentCollection.findByIdAndUpdate(req.params.id, update, { new: true }).lean();
    return res.json({ success: true, collection: withRemaining(row) });
  } catch (err) {
    console.error('[payment-collections/patch]', err);
    return res.status(500).json({ success: false, message: 'Failed to update payment entry.' });
  }
});

// DELETE /api/payment-collections/:id
paymentCollectionsRouter.delete('/:id', async (req, res) => {
  try {
    const deleted = await PaymentCollection.findByIdAndDelete(req.params.id).lean();
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Payment entry not found.' });
    }
    return res.json({ success: true });
  } catch (err) {
    console.error('[payment-collections/delete]', err);
    return res.status(500).json({ success: false, message: 'Failed to delete payment entry.' });
  }
});
