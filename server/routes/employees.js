import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { requireAdmin } from '../middleware/auth.js';

export const employeesRouter = Router();
const SALT_ROUNDS = 12;

employeesRouter.use(requireAdmin);

employeesRouter.get('/', async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' })
      .select('email name createdAt')
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ success: true, employees });
  } catch (err) {
    console.error('[employees/get]', err);
    return res.status(500).json({ success: false, message: 'Failed to load employees.' });
  }
});

employeesRouter.post('/', async (req, res) => {
  try {
    const { email, password, name } = req.body || {};
    const trimmedEmail = email ? String(email).trim().toLowerCase() : '';

    if (!trimmedEmail || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
    }

    const existing = await User.findOne({ email: trimmedEmail });
    const nameTrim = name ? String(name).trim() : '';

    if (existing) {
      if (existing.role === 'client') {
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        existing.passwordHash = passwordHash;
        existing.role = 'employee';
        if (nameTrim) existing.name = nameTrim;
        await existing.save();
        return res.status(200).json({
          success: true,
          convertedFromClient: true,
          employee: {
            id: existing._id,
            email: existing.email,
            name: existing.name,
            createdAt: existing.createdAt,
          },
          temporaryPassword: password,
        });
      }
      if (existing.role === 'employee') {
        return res.status(409).json({
          success: false,
          message:
            'This email is already an employee. Use the password they set when the account was created, or remove the employee and add them again with a new password.',
        });
      }
      return res.status(409).json({
        success: false,
        message: 'This email is already used by an admin account. Use a different email for team members.',
      });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const created = await User.create({
      email: trimmedEmail,
      passwordHash,
      role: 'employee',
      name: nameTrim || undefined,
    });

    return res.status(201).json({
      success: true,
      employee: {
        id: created._id,
        email: created.email,
        name: created.name,
        createdAt: created.createdAt,
      },
      temporaryPassword: password,
    });
  } catch (err) {
    console.error('[employees/post]', err);
    return res.status(500).json({ success: false, message: 'Failed to create employee.' });
  }
});

employeesRouter.delete('/:id', async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, role: 'employee' });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }
    await User.deleteOne({ _id: req.params.id });
    return res.json({ success: true });
  } catch (err) {
    console.error('[employees/delete]', err);
    return res.status(500).json({ success: false, message: 'Failed to remove employee.' });
  }
});
