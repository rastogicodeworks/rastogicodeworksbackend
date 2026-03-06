import { Router } from 'express';
import { Project } from '../models/Project.js';
import { requireAdmin, requireAuth, requireClient } from '../middleware/auth.js';

export const projectsRouter = Router();

// GET /api/projects — admin: all projects; client: own projects
projectsRouter.get('/', requireAuth, async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { clientEmail: req.user.email };
    const projects = await Project.find(query).sort({ createdAt: -1 }).lean();
    return res.json({ success: true, projects });
  } catch (err) {
    console.error('[projects/get]', err);
    return res.status(500).json({ success: false, message: 'Failed to load projects.' });
  }
});

// POST /api/projects — admin only
projectsRouter.post('/', requireAdmin, async (req, res) => {
  try {
    const { title, description, clientEmail, clientName, status, progress, startDate, dueDate, milestones } = req.body || {};
    if (!title?.trim()) return res.status(400).json({ success: false, message: 'Title is required.' });

    const project = await Project.create({
      title: title.trim(),
      description: description ? String(description).trim() : '',
      clientEmail: clientEmail ? String(clientEmail).trim().toLowerCase() : '',
      clientName: clientName ? String(clientName).trim() : '',
      status: status || 'planning',
      progress: Number(progress) || 0,
      startDate: startDate || '',
      dueDate: dueDate || '',
      milestones: Array.isArray(milestones) ? milestones.map((m) => ({ title: String(m.title || '').trim(), completed: !!m.completed, dueDate: m.dueDate || '' })) : [],
    });

    return res.status(201).json({ success: true, project });
  } catch (err) {
    console.error('[projects/post]', err);
    return res.status(500).json({ success: false, message: 'Failed to create project.' });
  }
});

// PATCH /api/projects/:id — admin only
projectsRouter.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, clientEmail, clientName, status, progress, startDate, dueDate, milestones } = req.body || {};

    const update = {};
    if (title !== undefined) update.title = String(title).trim();
    if (description !== undefined) update.description = String(description).trim();
    if (clientEmail !== undefined) update.clientEmail = String(clientEmail).trim().toLowerCase();
    if (clientName !== undefined) update.clientName = String(clientName).trim();
    if (status !== undefined) update.status = status;
    if (progress !== undefined) update.progress = Math.min(100, Math.max(0, Number(progress)));
    if (startDate !== undefined) update.startDate = startDate;
    if (dueDate !== undefined) update.dueDate = dueDate;
    if (Array.isArray(milestones)) {
      update.milestones = milestones.map((m) => ({ title: String(m.title || '').trim(), completed: !!m.completed, dueDate: m.dueDate || '' }));
    }

    const project = await Project.findByIdAndUpdate(id, update, { new: true, runValidators: true }).lean();
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    return res.json({ success: true, project });
  } catch (err) {
    console.error('[projects/patch]', err);
    return res.status(500).json({ success: false, message: 'Failed to update project.' });
  }
});

// DELETE /api/projects/:id — admin only
projectsRouter.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id).lean();
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    return res.json({ success: true });
  } catch (err) {
    console.error('[projects/delete]', err);
    return res.status(500).json({ success: false, message: 'Failed to delete project.' });
  }
});
