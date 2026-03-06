import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { clearToken, issueToken, requireAuth } from '../middleware/auth.js';

export const authRouter = Router();

const SALT_ROUNDS = 12;

// POST /api/auth/login — admin or client (from MongoDB); env admin fallback if no user or wrong hash
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    const trimmedEmail = String(email).trim().toLowerCase();
    const adminEmail = process.env.ADMIN_EMAIL?.trim()?.toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD?.trim();

    let user = await User.findOne({ email: trimmedEmail }).lean();
    let valid = user ? await bcrypt.compare(password, user.passwordHash) : false;

    // If no user or wrong password, allow login with env admin credentials and sync DB
    if (!valid && adminEmail && adminPassword && trimmedEmail === adminEmail && password === adminPassword) {
      const hash = await bcrypt.hash(adminPassword, SALT_ROUNDS);
      if (!user) {
        const created = await User.create({
          email: trimmedEmail,
          passwordHash: hash,
          role: 'admin',
          name: process.env.ADMIN_NAME?.trim() || 'Admin',
        });
        user = { _id: created._id, email: created.email, role: created.role, name: created.name };
      } else {
        await User.updateOne({ email: trimmedEmail }, { $set: { passwordHash: hash, role: 'admin' } });
        user = { ...user, role: 'admin' };
      }
      valid = true;
    }

    if (!user || !valid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    const token = issueToken(res, payload);

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (err) {
    console.error('[auth/login] error', err);
    return res.status(500).json({
      success: false,
      message: 'Unable to log in.',
    });
  }
});

// POST /api/auth/logout
authRouter.post('/logout', (req, res) => {
  clearToken(res);
  return res.json({ success: true });
});

// GET /api/auth/me — current user (admin or client)
authRouter.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('name email role').lean();
    return res.json({
      success: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        name: user?.name || '',
      },
    });
  } catch {
    return res.json({ success: true, user: { id: req.user.id, email: req.user.email, role: req.user.role } });
  }
});

// PATCH /api/auth/profile — update name
authRouter.patch('/profile', requireAuth, async (req, res) => {
  try {
    const { name } = req.body || {};
    if (!name?.trim()) return res.status(400).json({ success: false, message: 'Name is required.' });
    const user = await User.findByIdAndUpdate(req.user.id, { name: name.trim() }, { new: true }).select('name email role').lean();
    return res.json({ success: true, user: { id: user._id, email: user.email, role: user.role, name: user.name } });
  } catch (err) {
    console.error('[auth/profile]', err);
    return res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
});

// PATCH /api/auth/change-password — change own password
authRouter.patch('/change-password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) return res.status(400).json({ success: false, message: 'Both current and new password are required.' });
    if (newPassword.length < 8) return res.status(400).json({ success: false, message: 'New password must be at least 8 characters.' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) return res.status(401).json({ success: false, message: 'Current password is incorrect.' });

    user.passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await user.save();
    return res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    console.error('[auth/change-password]', err);
    return res.status(500).json({ success: false, message: 'Failed to change password.' });
  }
});
