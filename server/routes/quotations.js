import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { Quotation } from '../models/Quotation.js';

export const quotationsRouter = Router();

quotationsRouter.use(requireAdmin);

function computeTotals(items = []) {
  const subtotal = (items || []).reduce(
    (sum, item) => sum + ((Number(item.quantity) || 0) * (Number(item.price) || 0)),
    0,
  );
  return { subtotal, total: subtotal };
}

async function nextQuoteNumber() {
  const count = await Quotation.countDocuments();
  const seq = String(count + 1).padStart(4, '0');
  const year = new Date().getFullYear();
  return `QUO-${year}-${seq}`;
}

// GET /api/quotations — list saved quotations + total count
quotationsRouter.get('/', async (req, res) => {
  try {
    const quotations = await Quotation.find({})
      .sort({ createdAt: -1 })
      .select('-__v')
      .lean();
    res.json({
      success: true,
      count: quotations.length,
      quotations,
    });
  } catch (err) {
    console.error('[quotations/get] error', err);
    res.status(500).json({ success: false, message: 'Failed to load quotations.' });
  }
});

// POST /api/quotations — save a generated quotation record
quotationsRouter.post('/', async (req, res) => {
  try {
    const body = req.body || {};
    const clientName = String(body.clientName || '').trim();
    if (!clientName) {
      return res.status(400).json({ success: false, message: 'Client name is required.' });
    }

    const items = Array.isArray(body.items) ? body.items : [];
    const { subtotal, total } = computeTotals(items);
    const quoteNumber = body.quoteNumber?.trim() || (await nextQuoteNumber());

    const doc = await Quotation.create({
      quoteNumber,
      clientName,
      companyName: String(body.companyName || 'Rastogi Codeworks').trim(),
      projectTitle: String(body.projectTitle || '').trim(),
      billingAddress: String(body.billingAddress || '').trim(),
      serviceId: String(body.serviceId || '').trim(),
      quoteDate: String(body.quoteDate || '').trim(),
      validUntil: String(body.validUntil || '').trim(),
      deliveryDays: body.deliveryDays != null ? String(body.deliveryDays) : '',
      deliveryUnit: body.deliveryUnit === 'months' ? 'months' : 'days',
      projectDeliveryMode: String(body.projectDeliveryMode || '').trim(),
      phaseCount: String(body.phaseCount || '').trim(),
      projectModeDetails: String(body.projectModeDetails || '').trim(),
      scopeType: String(body.scopeType || '').trim(),
      scopeDetails: String(body.scopeDetails || '').trim(),
      requirements: String(body.requirements || '').trim(),
      paymentTerms: String(body.paymentTerms || '').trim(),
      notes: String(body.notes || '').trim(),
      items: items.map((i) => ({
        description: String(i.description || '').trim(),
        quantity: Number(i.quantity) || 0,
        price: Number(i.price) || 0,
      })),
      subtotal,
      total,
      hasCompanyLogo: !!body.hasCompanyLogo,
      hasClientLogo: !!body.hasClientLogo,
      createdBy: req.user?.id || undefined,
    });

    const count = await Quotation.countDocuments();
    res.status(201).json({
      success: true,
      quotation: doc.toObject(),
      count,
    });
  } catch (err) {
    console.error('[quotations/post] error', err);
    res.status(500).json({ success: false, message: 'Failed to save quotation.' });
  }
});

// PUT /api/quotations/:id — update a saved quotation
quotationsRouter.put('/:id', async (req, res) => {
  try {
    const existing = await Quotation.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Quotation not found.' });
    }

    const body = req.body || {};
    const clientName = String(body.clientName || '').trim();
    if (!clientName) {
      return res.status(400).json({ success: false, message: 'Client name is required.' });
    }

    const items = Array.isArray(body.items) ? body.items : [];
    const { subtotal, total } = computeTotals(items);

    existing.quoteNumber = body.quoteNumber?.trim() || existing.quoteNumber;
    existing.clientName = clientName;
    existing.companyName = String(body.companyName || 'Rastogi Codeworks').trim();
    existing.projectTitle = String(body.projectTitle || '').trim();
    existing.billingAddress = String(body.billingAddress || '').trim();
    existing.serviceId = String(body.serviceId || '').trim();
    existing.quoteDate = String(body.quoteDate || '').trim();
    existing.validUntil = String(body.validUntil || '').trim();
    existing.deliveryDays = body.deliveryDays != null ? String(body.deliveryDays) : '';
    existing.deliveryUnit = body.deliveryUnit === 'months' ? 'months' : 'days';
    existing.projectDeliveryMode = String(body.projectDeliveryMode || '').trim();
    existing.phaseCount = String(body.phaseCount || '').trim();
    existing.projectModeDetails = String(body.projectModeDetails || '').trim();
    existing.scopeType = String(body.scopeType || '').trim();
    existing.scopeDetails = String(body.scopeDetails || '').trim();
    existing.requirements = String(body.requirements || '').trim();
    existing.paymentTerms = String(body.paymentTerms || '').trim();
    existing.notes = String(body.notes || '').trim();
    existing.items = items.map((i) => ({
      description: String(i.description || '').trim(),
      quantity: Number(i.quantity) || 0,
      price: Number(i.price) || 0,
    }));
    existing.subtotal = subtotal;
    existing.total = total;
    existing.hasCompanyLogo = !!body.hasCompanyLogo;
    existing.hasClientLogo = !!body.hasClientLogo;

    await existing.save();
    const count = await Quotation.countDocuments();
    res.json({
      success: true,
      quotation: existing.toObject(),
      count,
    });
  } catch (err) {
    console.error('[quotations/put] error', err);
    res.status(500).json({ success: false, message: 'Failed to update quotation.' });
  }
});

// DELETE /api/quotations/:id
quotationsRouter.delete('/:id', async (req, res) => {
  try {
    const deleted = await Quotation.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Quotation not found.' });
    }
    const count = await Quotation.countDocuments();
    res.json({ success: true, count });
  } catch (err) {
    console.error('[quotations/delete] error', err);
    res.status(500).json({ success: false, message: 'Failed to delete quotation.' });
  }
});
