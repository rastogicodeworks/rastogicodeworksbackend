import { Router } from 'express';
import { Announcement } from '../models/Announcement.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

export const announcementsRouter = Router();

// GET /api/announcements — admin sees all, client sees own + 'all'
announcementsRouter.get('/', requireAuth, async (req, res) => {
  try {
    const query = req.user.role === 'admin'
      ? {}
      : { $or: [{ audience: 'all' }, { audience: req.user.email }] };
    const announcements = await Announcement.find(query).sort({ pinned: -1, createdAt: -1 }).lean();
    return res.json({ success: true, announcements });
  } catch (err) {
    console.error('[announcements/get]', err);
    return res.status(500).json({ success: false, message: 'Failed to load announcements.' });
  }
});

// POST /api/announcements — admin only
announcementsRouter.post('/', requireAdmin, async (req, res) => {
  try {
    const { title, content, pinned, audience } = req.body || {};
    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ success: false, message: 'Title and content are required.' });
    }
    const announcement = await Announcement.create({
      title: title.trim(),
      content: content.trim(),
      pinned: !!pinned,
      audience: audience || 'all',
    });
    return res.status(201).json({ success: true, announcement });
  } catch (err) {
    console.error('[announcements/post]', err);
    return res.status(500).json({ success: false, message: 'Failed to create announcement.' });
  }
});

// PATCH /api/announcements/:id — admin only
announcementsRouter.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const { title, content, pinned, audience } = req.body || {};
    const update = {};
    if (title !== undefined) update.title = String(title).trim();
    if (content !== undefined) update.content = String(content).trim();
    if (pinned !== undefined) update.pinned = !!pinned;
    if (audience !== undefined) update.audience = audience;

    const announcement = await Announcement.findByIdAndUpdate(req.params.id, update, { new: true }).lean();
    if (!announcement) return res.status(404).json({ success: false, message: 'Announcement not found.' });
    return res.json({ success: true, announcement });
  } catch (err) {
    console.error('[announcements/patch]', err);
    return res.status(500).json({ success: false, message: 'Failed to update announcement.' });
  }
});

// DELETE /api/announcements/:id — admin only
announcementsRouter.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const a = await Announcement.findByIdAndDelete(req.params.id).lean();
    if (!a) return res.status(404).json({ success: false, message: 'Announcement not found.' });
    return res.json({ success: true });
  } catch (err) {
    console.error('[announcements/delete]', err);
    return res.status(500).json({ success: false, message: 'Failed to delete announcement.' });
  }
});
