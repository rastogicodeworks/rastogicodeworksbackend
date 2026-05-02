import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { EmployeeTask } from '../models/EmployeeTask.js';

export const employeeTasksRouter = Router();
employeeTasksRouter.use(requireAdmin);

employeeTasksRouter.get('/', async (req, res) => {
  try {
    const tasks = await EmployeeTask.find().sort({ createdAt: -1 }).lean();
    return res.json({ success: true, tasks });
  } catch (err) {
    console.error('[employeeTasks/get]', err);
    return res.status(500).json({ success: false, message: 'Failed to load tasks.' });
  }
});

employeeTasksRouter.post('/', async (req, res) => {
  try {
    const { title, description, assigneeEmail, dueDate, priority, status } = req.body || {};
    if (!title?.trim() || !assigneeEmail?.trim()) {
      return res.status(400).json({ success: false, message: 'Title and assignee email are required.' });
    }
    const task = await EmployeeTask.create({
      title: title.trim(),
      description: description ? String(description).trim() : '',
      assigneeEmail: String(assigneeEmail).trim().toLowerCase(),
      dueDate: dueDate ? String(dueDate).trim() : '',
      priority: ['low', 'normal', 'high'].includes(priority) ? priority : 'normal',
      status: ['todo', 'in_progress', 'done'].includes(status) ? status : 'todo',
    });
    return res.status(201).json({ success: true, task });
  } catch (err) {
    console.error('[employeeTasks/post]', err);
    return res.status(500).json({ success: false, message: 'Failed to create task.' });
  }
});

employeeTasksRouter.patch('/:id', async (req, res) => {
  try {
    const { title, description, assigneeEmail, dueDate, priority, status } = req.body || {};
    const update = {};
    if (title !== undefined) update.title = String(title).trim();
    if (description !== undefined) update.description = String(description).trim();
    if (assigneeEmail !== undefined) update.assigneeEmail = String(assigneeEmail).trim().toLowerCase();
    if (dueDate !== undefined) update.dueDate = String(dueDate).trim();
    if (priority !== undefined && ['low', 'normal', 'high'].includes(priority)) update.priority = priority;
    if (status !== undefined && ['todo', 'in_progress', 'done'].includes(status)) update.status = status;

    const task = await EmployeeTask.findByIdAndUpdate(req.params.id, update, { new: true }).lean();
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });
    return res.json({ success: true, task });
  } catch (err) {
    console.error('[employeeTasks/patch]', err);
    return res.status(500).json({ success: false, message: 'Failed to update task.' });
  }
});

employeeTasksRouter.delete('/:id', async (req, res) => {
  try {
    const deleted = await EmployeeTask.findByIdAndDelete(req.params.id).lean();
    if (!deleted) return res.status(404).json({ success: false, message: 'Task not found.' });
    return res.json({ success: true });
  } catch (err) {
    console.error('[employeeTasks/delete]', err);
    return res.status(500).json({ success: false, message: 'Failed to delete task.' });
  }
});
