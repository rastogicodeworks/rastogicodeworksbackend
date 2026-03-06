import { Router } from 'express';
import { Invoice } from '../models/Invoice.js';
import { requireAuth, requireAdmin, requireClient } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { Project } from '../models/Project.js';
import { Announcement } from '../models/Announcement.js';

export const dashboardRouter = Router();

// Helper: relative time from date string or Date
function relativeTime(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '—';
  const now = new Date();
  const diffMs = now - d;
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week(s) ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

// GET /api/dashboard/client — client dashboard data (real: user, invoices; derived: projects, deliverables)
dashboardRouter.get('/client', requireAuth, requireClient, async (req, res) => {
  try {
    const userEmail = req.user.email;

    // Auto-mark overdue
    const today = new Date().toISOString().slice(0, 10);
    await Invoice.updateMany(
      { clientEmail: userEmail, status: 'unpaid', dueDate: { $lte: today, $exists: true, $ne: '' } },
      { $set: { status: 'overdue' } },
    ).catch(() => {});

    const invoices = await Invoice.find({ clientEmail: userEmail })
      .sort({ createdAt: -1 })
      .lean();

    const formattedInvoices = invoices.map((inv) => ({
      id: inv._id.toString(),
      invoiceId: `INV-${String(inv._id).slice(-6).toUpperCase()}`,
      amount: inv.total ?? 0,
      amountFormatted: `Rs. ${(inv.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      subtotal: inv.subtotal ?? inv.total ?? 0,
      dueDate: inv.dueDate || null,
      status: inv.status === 'paid' ? 'Paid' : inv.status === 'overdue' ? 'Overdue' : 'Unpaid',
      invoiceDate: inv.invoiceDate,
      notes: inv.notes || '',
      billingAddress: inv.billingAddress || '',
      gstNumber: inv.gstNumber || '',
      items: inv.items || [],
      paymentTerms: inv.paymentTerms || [],
      dispute: inv.dispute || { flagged: false, note: '' },
    }));

    // Real summary from invoices
    const paidInvoices = formattedInvoices.filter((i) => i.status === 'Paid');
    const unpaidInvoices = formattedInvoices.filter((i) => i.status === 'Unpaid' || i.status === 'Overdue');
    const overdueInvoices = formattedInvoices.filter((i) => i.status === 'Overdue');
    const totalPaid = paidInvoices.reduce((sum, i) => sum + (i.amount || 0), 0);
    const totalUnpaid = unpaidInvoices.reduce((sum, i) => sum + (i.amount || 0), 0);
    const totalBilled = formattedInvoices.reduce((sum, i) => sum + (i.amount || 0), 0);

    // Next upcoming due invoice
    const now = new Date();
    const nextDue = unpaidInvoices
      .filter((i) => i.dueDate && new Date(i.dueDate) >= now)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0] || null;

    // Real projects for this client
    const rawProjects = await Project.find({ clientEmail: userEmail }).sort({ createdAt: -1 }).lean();
    const projects = rawProjects.map((p) => ({
      id: p._id.toString(),
      name: p.title,
      description: p.description || '',
      status: p.status,
      progress: p.progress ?? 0,
      startDate: p.startDate || '',
      dueDate: p.dueDate || '',
      lastUpdate: relativeTime(p.updatedAt),
      milestones: p.milestones || [],
    }));

    // Deliverables derived from real invoice line items
    const deliverables = [];
    invoices.forEach((inv) => {
      const invIdShort = `INV-${String(inv._id).slice(-6).toUpperCase()}`;
      const items = inv.items || [];
      items.forEach((item, i) => {
        if (item.description || item.quantity || item.price) {
          deliverables.push({
            id: `${inv._id}-${i}`,
            title: item.description || 'Line item',
            project: invIdShort,
            date: inv.invoiceDate || new Date(inv.createdAt).toISOString().slice(0, 10),
            type: 'Item',
          });
        }
      });
    });

    // Announcements for this client
    const announcements = await Announcement.find({
      $or: [{ audience: 'all' }, { audience: userEmail }],
    }).sort({ pinned: -1, createdAt: -1 }).lean();

    const user = await User.findById(req.user.id).select('name email').lean();

    res.json({
      success: true,
      data: {
        user: {
          name: user?.name || user?.email?.split('@')[0] || 'Client',
          email: user?.email,
        },
        projects,
        deliverables,
        announcements,
        invoices: formattedInvoices,
        summary: {
          projectsCount: projects.length,
          deliverablesCount: deliverables.length,
          invoicesCount: formattedInvoices.length,
          paidInvoicesCount: paidInvoices.length,
          unpaidInvoicesCount: unpaidInvoices.length,
          overdueInvoicesCount: overdueInvoices.length,
          totalPaidFormatted: `Rs. ${totalPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
          totalUnpaidFormatted: `Rs. ${totalUnpaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
          totalBilledFormatted: `Rs. ${totalBilled.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
          totalPaid,
          totalUnpaid,
          totalBilled,
          collectionRate: totalBilled > 0 ? Math.round((totalPaid / totalBilled) * 100) : 0,
          nextDueInvoice: nextDue ? { invoiceId: nextDue.invoiceId, dueDate: nextDue.dueDate, amountFormatted: nextDue.amountFormatted } : null,
        },
      },
    });
  } catch (err) {
    console.error('[dashboard/client] error', err);
    res.status(500).json({ success: false, message: 'Failed to load dashboard.' });
  }
});

// GET /api/dashboard/admin — admin dashboard summary (real data from DB)
dashboardRouter.get('/admin', requireAuth, requireAdmin, async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 }).lean();

    const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
    const paidRevenue = invoices
      .filter((inv) => inv.status === 'paid')
      .reduce((sum, inv) => sum + (inv.total || 0), 0);
    const pendingRevenue = totalRevenue - paidRevenue;
    const unpaidCount = invoices.filter((inv) => inv.status !== 'paid').length;
    const paidCount = invoices.filter((inv) => inv.status === 'paid').length;
    const overdueCount = invoices.filter((inv) => inv.status === 'overdue').length;

    const pendingPercentage = totalRevenue > 0 ? Math.round((pendingRevenue / totalRevenue) * 100) : 0;
    const averageInvoice = invoices.length > 0 ? totalRevenue / invoices.length : 0;

    res.json({
      success: true,
      data: {
        totalInvoices: invoices.length,
        totalRevenue,
        paidRevenue,
        pendingRevenue,
        unpaidCount,
        paidCount,
        overdueCount,
        pendingPercentage,
        averageInvoice,
        recentInvoices: invoices.slice(0, 10),
      },
    });
  } catch (err) {
    console.error('[dashboard/admin] error', err);
    res.status(500).json({ success: false, message: 'Failed to load admin dashboard.' });
  }
});
