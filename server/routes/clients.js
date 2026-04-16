import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Invoice } from '../models/Invoice.js';
import { requireAdmin } from '../middleware/auth.js';

export const clientsRouter = Router();
const SALT_ROUNDS = 12;

// All routes require admin
clientsRouter.use(requireAdmin);

// GET /api/clients — list all client users with their invoices (projects)
clientsRouter.get('/', async (req, res) => {
  try {
    const clientUsers = await User.find({ role: 'client' })
      .select('email name gstNumber billingAddress createdAt')
      .sort({ createdAt: -1 })
      .lean();

    const clientEmails = clientUsers.map((c) => c.email);
    const invoicesByEmail = await Invoice.find({ clientEmail: { $in: clientEmails } })
      .select('clientEmail clientName invoiceDate status total createdAt')
      .sort({ createdAt: -1 })
      .lean();

    const invoicesMap = new Map();
    for (const inv of invoicesByEmail) {
      const key = (inv.clientEmail || '').toLowerCase();
      if (!invoicesMap.has(key)) invoicesMap.set(key, []);
      invoicesMap.get(key).push({
        _id: inv._id,
        clientName: inv.clientName,
        invoiceDate: inv.invoiceDate,
        status: inv.status,
        total: inv.total,
      });
    }

    const clients = clientUsers.map((c) => ({
      ...c,
      invoices: invoicesMap.get(c.email?.toLowerCase() || '') || [],
    }));

    return res.json({ success: true, clients });
  } catch (err) {
    console.error('[clients/get] error', err);
    return res.status(500).json({ success: false, message: 'Failed to load clients.' });
  }
});

// POST /api/clients — create a new client (onboarding credentials)
clientsRouter.post('/', async (req, res) => {
  try {
    const { email, password, name } = req.body || {};
    const trimmedEmail = email ? String(email).trim().toLowerCase() : '';

    if (!trimmedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters.',
      });
    }

    const existing = await User.findOne({ email: trimmedEmail }).lean();
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists.',
      });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const created = await User.create({
      email: trimmedEmail,
      passwordHash,
      role: 'client',
      name: name ? String(name).trim() : undefined,
    });

    return res.status(201).json({
      success: true,
      client: {
        id: created._id,
        email: created.email,
        name: created.name,
        createdAt: created.createdAt,
      },
      // Return temporary password once so admin can share it with the client
      temporaryPassword: password,
    });
  } catch (err) {
    console.error('[clients/post] error', err);
    return res.status(500).json({ success: false, message: 'Failed to create client.' });
  }
});

// DELETE /api/clients/:id — remove a client user (admin only)
clientsRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id, role: 'client' });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Client not found.' });
    }
    await User.deleteOne({ _id: id });
    return res.json({ success: true, message: 'Client removed.' });
  } catch (err) {
    console.error('[clients/delete] error', err);
    return res.status(500).json({ success: false, message: 'Failed to delete client.' });
  }
});
