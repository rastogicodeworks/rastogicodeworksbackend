import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FilePlus,
  FileText,
  Users,
  Settings,
  LogOut,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Plus,
  Trash2,
  Search,
  ChevronDown,
  ArrowRight,
  Briefcase,
  Calendar,
  Download,
  UserPlus,
  Copy,
  KeyRound,
  Percent,
  ChevronUp,
  CreditCard,
  BarChart2,
  Target,
  Zap,
  TrendingDown,
  ShieldCheck,
  RefreshCw,
  Eye,
  EyeOff,
  FolderKanban,
  Megaphone,
  Pin,
  Edit3,
  User,
  Lock,
  CheckSquare,
  Square,
  Flag,
  XCircle,
  MessageSquare,
} from 'lucide-react';
import { downloadInvoicePdf } from '../utils/invoicePdf.js';
import DashboardNavbar from '../components/DashboardNavbar';
import API_BASE from '../config/api';
import { getAuthHeaders, clearAuthToken } from '../config/auth';

const emptyItem = { description: '', quantity: 1, price: 0 };
const emptyTerm = { label: '', percentage: '', dueDate: '' };

const PAYMENT_PRESETS = [
  { label: '100%', terms: [{ label: 'Full Payment', percentage: 100, dueDate: '' }] },
  { label: '50/50', terms: [{ label: 'Advance', percentage: 50, dueDate: '' }, { label: 'Final', percentage: 50, dueDate: '' }] },
  { label: '30/30/40', terms: [{ label: 'Advance', percentage: 30, dueDate: '' }, { label: 'Milestone', percentage: 30, dueDate: '' }, { label: 'Final', percentage: 40, dueDate: '' }] },
  { label: '25/25/50', terms: [{ label: 'Advance', percentage: 25, dueDate: '' }, { label: 'Milestone', percentage: 25, dueDate: '' }, { label: 'Final', percentage: 50, dueDate: '' }] },
  { label: '10/20/30/40', terms: [{ label: 'Booking', percentage: 10, dueDate: '' }, { label: 'Design', percentage: 20, dueDate: '' }, { label: 'Development', percentage: 30, dueDate: '' }, { label: 'Final', percentage: 40, dueDate: '' }] },
];

function calculateInvoiceTotals(items) {
  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.price) || 0),
    0,
  );
  return { subtotal, total: subtotal };
}

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('overview'); // overview | invoices | clients | settings

  // Invoice creation form state
  const [clientName, setClientName] = useState('');
  const [clientGst, setClientGst] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState('');
  const [invoiceStatus, setInvoiceStatus] = useState('unpaid');
  const [items, setItems] = useState([{ ...emptyItem }]);
  const [notes, setNotes] = useState('');

  // Invoice management state
  const [invoices, setInvoices] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [downloadingInvId, setDownloadingInvId] = useState(null);
  const [error, setError] = useState('');

  // Clients (onboarding) state
  const [clients, setClients] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [clientForm, setClientForm] = useState({ name: '', email: '', password: '' });
  const [clientCreateLoading, setClientCreateLoading] = useState(false);
  const [clientCreateError, setClientCreateError] = useState('');
  const [createdCredentials, setCreatedCredentials] = useState(null); // { email, temporaryPassword } after create
  const [sessionPasswords, setSessionPasswords] = useState({}); // email -> password for all clients created this session
  const [visiblePasswords, setVisiblePasswords] = useState(new Set()); // emails whose passwords are currently revealed
  const [clientDeletingId, setClientDeletingId] = useState(null);

  // Projects state
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectForm, setProjectForm] = useState({ title: '', description: '', clientEmail: '', clientName: '', status: 'planning', progress: 0, startDate: '', dueDate: '', milestones: [] });
  const [projectSaving, setProjectSaving] = useState(false);
  const [editingProject, setEditingProject] = useState(null); // null = create mode, project obj = edit mode
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectError, setProjectError] = useState('');

  // Announcements state
  const [announcements, setAnnouncements] = useState([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(false);
  const [annForm, setAnnForm] = useState({ title: '', content: '', pinned: false, audience: 'all' });
  const [annSaving, setAnnSaving] = useState(false);
  const [annError, setAnnError] = useState('');

  // Change password (in Settings section)
  const [changePwForm, setChangePwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [changePwLoading, setChangePwLoading] = useState(false);
  const [changePwError, setChangePwError] = useState('');
  const [changePwSuccess, setChangePwSuccess] = useState('');

  const totals = useMemo(() => calculateInvoiceTotals(items), [items]);

  const handleItemChange = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]:
                field === 'quantity' || field === 'price'
                  ? value === ''
                    ? ''
                    : Number(value)
                  : value,
            }
          : item,
      ),
    );
  };

  const addItem = () => {
    setItems((prev) => [...prev, { ...emptyItem }]);
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const [invoiceClientEmail, setInvoiceClientEmail] = useState(''); // link invoice to portal client (for Clients table)
  const [paymentTerms, setPaymentTerms] = useState([]);
  const [showPaymentTerms, setShowPaymentTerms] = useState(false);

  const addPaymentTerm = () => setPaymentTerms((prev) => [...prev, { ...emptyTerm }]);
  const removePaymentTerm = (i) => setPaymentTerms((prev) => prev.filter((_, idx) => idx !== i));
  const handleTermChange = (i, field, value) => {
    setPaymentTerms((prev) => prev.map((t, idx) => idx === i ? { ...t, [field]: value } : t));
  };
  const applyPreset = (preset) => {
    setPaymentTerms(preset.terms.map((t) => ({ ...t })));
    setShowPaymentTerms(true);
  };
  const termsTotalPct = paymentTerms.reduce((s, t) => s + (Number(t.percentage) || 0), 0);

  const resetForm = () => {
    setClientName('');
    setClientGst('');
    setBillingAddress('');
    setInvoiceDate(new Date().toISOString().slice(0, 10));
    setDueDate('');
    setInvoiceStatus('unpaid');
    setItems([{ ...emptyItem }]);
    setNotes('');
    setInvoiceClientEmail('');
    setPaymentTerms([]);
    setShowPaymentTerms(false);
  };

  const handleCreateInvoice = (e) => {
    e?.preventDefault?.();
    if (!clientName.trim()) return;

    const payload = {
      clientName: clientName.trim(),
      clientEmail: invoiceClientEmail.trim() || undefined,
      billingAddress: billingAddress.trim() || undefined,
      gstNumber: clientGst.trim() || undefined,
      invoiceDate,
      dueDate,
      status: invoiceStatus,
      items: items.filter((i) => i.description || i.quantity || i.price),
      notes,
      paymentTerms: paymentTerms.filter((t) => Number(t.percentage) > 0),
    };

    setLoading(true);
    setError('');

    fetch(`${API_BASE}/api/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      credentials: 'include',
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (res.status === 401) {
          clearAuthToken();
          localStorage.removeItem('isAdmin');
          window.location.href = '/login';
          return;
        }
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || 'Failed to create invoice');
        }
        return res.json();
      })
      .then((data) => {
        if (data?.invoice) {
          setInvoices((prev) => [data.invoice, ...prev]);
          resetForm();
          setActiveSection('invoices');
        }
      })
      .catch((err) => {
        setError(err.message || 'Something went wrong while creating the invoice.');
      })
      .finally(() => setLoading(false));
  };

  const updateInvoiceStatus = (id, status) => {
    setInvoices((prev) => prev.map((inv) => (inv._id === id ? { ...inv, status } : inv)));

    fetch(`${API_BASE}/api/invoices/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      credentials: 'include',
      body: JSON.stringify({ status }),
    }).then((res) => {
      if (res.status === 401) {
        clearAuthToken();
        localStorage.removeItem('isAdmin');
        window.location.href = '/login';
      }
    }).catch(() => {
      // If request fails, revert status change optimistically
      setInvoices((prev) => prev.map((inv) => (inv._id === id ? { ...inv, status: inv.status } : inv)));
    });
  };

  const deleteInvoice = (id) => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Delete this invoice? This cannot be undone.')) {
      setInvoices((prev) => prev.filter((inv) => inv._id !== id));

      fetch(`${API_BASE}/api/invoices/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
      }).then((res) => {
        if (res.status === 401) {
          clearAuthToken();
          localStorage.removeItem('isAdmin');
          window.location.href = '/login';
        }
      }).catch(() => {
        // If delete fails, this invoice will just be re-fetched on next load
      });
    }
  };

  const filteredInvoices = useMemo(
    () =>
      statusFilter === 'all'
        ? invoices
        : invoices.filter((inv) => inv.status === statusFilter),
    [invoices, statusFilter],
  );

  const overviewStats = useMemo(() => {
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
    const collectionRate = totalRevenue > 0 ? Math.round((paidRevenue / totalRevenue) * 100) : 0;

    // This month
    const now = new Date();
    const thisMonthInvoices = invoices.filter((inv) => {
      const d = new Date(inv.invoiceDate);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    });
    const thisMonthRevenue = thisMonthInvoices.reduce((s, inv) => s + (inv.total || 0), 0);
    const thisMonthCount = thisMonthInvoices.length;

    // Last month for comparison
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthRevenue = invoices
      .filter((inv) => {
        const d = new Date(inv.invoiceDate);
        return d.getFullYear() === lastMonthDate.getFullYear() && d.getMonth() === lastMonthDate.getMonth();
      })
      .reduce((s, inv) => s + (inv.total || 0), 0);
    const monthGrowth = lastMonthRevenue > 0
      ? Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
      : null;

    // Top clients by total billed
    const clientMap = new Map();
    invoices.forEach((inv) => {
      const key = inv.clientName || 'Unknown';
      const cur = clientMap.get(key) || { name: key, total: 0, paid: 0, count: 0 };
      cur.total += inv.total || 0;
      if (inv.status === 'paid') cur.paid += inv.total || 0;
      cur.count += 1;
      clientMap.set(key, cur);
    });
    const topClients = Array.from(clientMap.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    // Monthly revenue for last 6 months
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
      const rev = invoices
        .filter((inv) => {
          const id = new Date(inv.invoiceDate);
          return id.getFullYear() === d.getFullYear() && id.getMonth() === d.getMonth();
        })
        .reduce((s, inv) => s + (inv.total || 0), 0);
      monthlyData.push({ label, revenue: rev });
    }
    const maxMonthlyRevenue = Math.max(...monthlyData.map((m) => m.revenue), 1);

    // Overdue revenue
    const overdueRevenue = invoices
      .filter((inv) => inv.status === 'overdue')
      .reduce((s, inv) => s + (inv.total || 0), 0);

    return {
      totalInvoices: invoices.length,
      totalRevenue,
      paidRevenue,
      pendingRevenue,
      unpaidCount,
      paidCount,
      overdueCount,
      overdueRevenue,
      pendingPercentage,
      averageInvoice,
      collectionRate,
      thisMonthRevenue,
      thisMonthCount,
      lastMonthRevenue,
      monthGrowth,
      topClients,
      monthlyData,
      maxMonthlyRevenue,
      // Invoice aging: 0-30, 31-60, 61-90, 90+ days overdue
      agingBuckets: (() => {
        const today = new Date();
        const buckets = { '0–30d': 0, '31–60d': 0, '61–90d': 0, '90d+': 0 };
        const amts = { '0–30d': 0, '31–60d': 0, '61–90d': 0, '90d+': 0 };
        invoices.filter((inv) => inv.status !== 'paid' && inv.dueDate).forEach((inv) => {
          const days = Math.floor((today - new Date(inv.dueDate)) / 86400000);
          const key = days <= 30 ? '0–30d' : days <= 60 ? '31–60d' : days <= 90 ? '61–90d' : '90d+';
          buckets[key]++;
          amts[key] += inv.total || 0;
        });
        return Object.entries(buckets).map(([range, count]) => ({ range, count, amount: amts[range] }));
      })(),
      disputedCount: invoices.filter((inv) => inv.dispute?.flagged).length,
    };
  }, [invoices]);

  const handleLogout = () => {
    clearAuthToken();
    localStorage.removeItem('isAdmin');
    window.location.href = '/login';
  };

  const handleDownloadPdf = async () => {
    setPdfLoading(true);
    try {
      await downloadInvoicePdf({
        clientName: clientName || 'Client Name',
        billingAddress: billingAddress.trim() || undefined,
        gstNumber: clientGst.trim() || undefined,
        invoiceDate,
        dueDate,
        items,
        notes,
        totals,
        paymentTerms: paymentTerms.filter((t) => Number(t.percentage) > 0),
        invoiceId: `INV-${Date.now().toString().slice(-6)}`,
      });
    } catch (err) {
      setError(err?.message || 'Failed to generate PDF.');
    } finally {
      setPdfLoading(false);
    }
  };

  const handleDownloadInvoicePdf = async (inv) => {
    setDownloadingInvId(inv._id);
    try {
      await downloadInvoicePdf({
        clientName: inv.clientName,
        billingAddress: inv.billingAddress || '',
        gstNumber: inv.gstNumber || '',
        invoiceDate: inv.invoiceDate,
        dueDate: inv.dueDate || '',
        items: inv.items || [],
        notes: inv.notes || '',
        totals: { subtotal: inv.subtotal ?? inv.total ?? 0, total: inv.total ?? 0 },
        paymentTerms: inv.paymentTerms || [],
        invoiceId: String(inv._id).slice(-6).toUpperCase(),
      });
    } catch (err) {
      setError(err?.message || 'Failed to generate PDF.');
    } finally {
      setDownloadingInvId(null);
    }
  };

  useEffect(() => {
    setLoading(true);
    setError('');

    fetch(`${API_BASE}/api/invoices`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    })
      .then(async (res) => {
        if (res.status === 401) {
          clearAuthToken();
          localStorage.removeItem('isAdmin');
          window.location.href = '/login';
          return;
        }
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || 'Failed to load invoices');
        }
        return res.json();
      })
      .then((data) => {
        setInvoices(data.invoices || []);
      })
      .catch((err) => {
        setError(err.message || 'Something went wrong while loading invoices.');
      })
      .finally(() => setLoading(false));
  }, []);

  // Fetch clients when opening Clients section, Create Invoice, Projects, or Announcements (for dropdowns)
  useEffect(() => {
    if (activeSection !== 'clients' && activeSection !== 'create' && activeSection !== 'projects' && activeSection !== 'announcements') return;
    setClientsLoading(true);
    fetch(`${API_BASE}/api/clients`, { headers: getAuthHeaders(), credentials: 'include' })
      .then(async (res) => {
        if (res.status === 401) {
          clearAuthToken();
          localStorage.removeItem('isAdmin');
          window.location.href = '/login';
          return;
        }
        if (!res.ok) throw new Error('Failed to load clients');
        return res.json();
      })
      .then((data) => setClients(data.clients || []))
      .catch(() => setClients([]))
      .finally(() => setClientsLoading(false));
  }, [activeSection]);

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let s = '';
    for (let i = 0; i < 12; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
    setClientForm((prev) => ({ ...prev, password: s }));
  };

  const handleCreateClient = (e) => {
    e.preventDefault();
    setClientCreateError('');
    setCreatedCredentials(null);
    const { name, email, password } = clientForm;
    if (!email.trim()) {
      setClientCreateError('Email is required.');
      return;
    }
    if (!password || password.length < 8) {
      setClientCreateError('Password must be at least 8 characters.');
      return;
    }
    setClientCreateLoading(true);
    fetch(`${API_BASE}/api/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      credentials: 'include',
      body: JSON.stringify({ name: name.trim() || undefined, email: email.trim().toLowerCase(), password }),
    })
      .then(async (res) => {
        if (res.status === 401) {
          clearAuthToken();
          localStorage.removeItem('isAdmin');
          window.location.href = '/login';
          return;
        }
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || 'Failed to create client');
        return data;
      })
      .then((data) => {
        setCreatedCredentials({ email: data.client.email, temporaryPassword: data.temporaryPassword });
        setSessionPasswords((prev) => ({ ...prev, [data.client.email]: data.temporaryPassword }));
        setClientForm({ name: '', email: '', password: '' });
        setClients((prev) => [{ ...data.client, createdAt: data.client.createdAt }, ...prev]);
      })
      .catch((err) => setClientCreateError(err.message || 'Failed to create client'))
      .finally(() => setClientCreateLoading(false));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text).then(() => {});
  };

  // ── Projects ──
  useEffect(() => {
    if (activeSection !== 'projects') return;
    setProjectsLoading(true);
    fetch(`${API_BASE}/api/projects`, { headers: getAuthHeaders(), credentials: 'include' })
      .then((r) => r.json().catch(() => ({})))
      .then((d) => setProjects(d.projects || []))
      .catch(() => setProjects([]))
      .finally(() => setProjectsLoading(false));
  }, [activeSection]);

  const openNewProject = () => {
    setEditingProject(null);
    setProjectForm({ title: '', description: '', clientEmail: '', clientName: '', status: 'planning', progress: 0, startDate: '', dueDate: '', milestones: [] });
    setProjectError('');
    setShowProjectForm(true);
  };

  const openEditProject = (p) => {
    setEditingProject(p);
    setProjectForm({ title: p.title, description: p.description || '', clientEmail: p.clientEmail || '', clientName: p.clientName || '', status: p.status, progress: p.progress ?? 0, startDate: p.startDate || '', dueDate: p.dueDate || '', milestones: (p.milestones || []).map((m) => ({ ...m })) });
    setProjectError('');
    setShowProjectForm(true);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!projectForm.title.trim()) { setProjectError('Title is required.'); return; }
    setProjectSaving(true);
    setProjectError('');
    try {
      const url = editingProject ? `${API_BASE}/api/projects/${editingProject._id}` : `${API_BASE}/api/projects`;
      const method = editingProject ? 'PATCH' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }, credentials: 'include', body: JSON.stringify(projectForm) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to save project');
      if (editingProject) setProjects((prev) => prev.map((p) => p._id === data.project._id ? data.project : p));
      else setProjects((prev) => [data.project, ...prev]);
      setShowProjectForm(false);
      setEditingProject(null);
    } catch (err) { setProjectError(err.message); }
    finally { setProjectSaving(false); }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    await fetch(`${API_BASE}/api/projects/${id}`, { method: 'DELETE', headers: getAuthHeaders(), credentials: 'include' });
    setProjects((prev) => prev.filter((p) => p._id !== id));
  };

  const toggleMilestone = (i) => {
    setProjectForm((prev) => ({ ...prev, milestones: prev.milestones.map((m, idx) => idx === i ? { ...m, completed: !m.completed } : m) }));
  };

  // ── Announcements ──
  useEffect(() => {
    if (activeSection !== 'announcements') return;
    setAnnouncementsLoading(true);
    fetch(`${API_BASE}/api/announcements`, { headers: getAuthHeaders(), credentials: 'include' })
      .then((r) => r.json().catch(() => ({})))
      .then((d) => setAnnouncements(d.announcements || []))
      .catch(() => setAnnouncements([]))
      .finally(() => setAnnouncementsLoading(false));
  }, [activeSection]);

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!annForm.title.trim() || !annForm.content.trim()) { setAnnError('Title and content are required.'); return; }
    setAnnSaving(true);
    setAnnError('');
    try {
      const res = await fetch(`${API_BASE}/api/announcements`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }, credentials: 'include', body: JSON.stringify(annForm) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to post');
      setAnnouncements((prev) => [data.announcement, ...prev]);
      setAnnForm({ title: '', content: '', pinned: false, audience: 'all' });
    } catch (err) { setAnnError(err.message); }
    finally { setAnnSaving(false); }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    await fetch(`${API_BASE}/api/announcements/${id}`, { method: 'DELETE', headers: getAuthHeaders(), credentials: 'include' });
    setAnnouncements((prev) => prev.filter((a) => a._id !== id));
  };

  // ── Change password ──
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setChangePwError('');
    setChangePwSuccess('');
    if (changePwForm.newPassword !== changePwForm.confirmPassword) { setChangePwError('New passwords do not match.'); return; }
    if (changePwForm.newPassword.length < 8) { setChangePwError('New password must be at least 8 characters.'); return; }
    setChangePwLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/change-password`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }, credentials: 'include', body: JSON.stringify({ currentPassword: changePwForm.currentPassword, newPassword: changePwForm.newPassword }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to change password');
      setChangePwSuccess('Password changed successfully!');
      setChangePwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setChangePwSuccess(''), 3000);
    } catch (err) { setChangePwError(err.message); }
    finally { setChangePwLoading(false); }
  };

  const handleDeleteClient = async (client) => {
    const id = client._id || client.id;
    if (!id) return;
    if (!window.confirm(`Remove client "${client.name || client.email}"? They will no longer be able to sign in to the portal.`)) return;
    setClientDeletingId(id);
    try {
      const res = await fetch(`${API_BASE}/api/clients/${id}`, { method: 'DELETE', headers: getAuthHeaders(), credentials: 'include' });
      if (res.status === 401) {
        clearAuthToken();
        localStorage.removeItem('isAdmin');
        window.location.href = '/login';
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to delete');
      setClients((prev) => prev.filter((c) => (c._id || c.id) !== id));
    } catch (err) {
      setClientCreateError(err.message || 'Failed to delete client.');
    } finally {
      setClientDeletingId(null);
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'create', label: 'Create Invoice', icon: FilePlus },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="admin-dashboard min-h-screen flex flex-col font-sans text-primary-900 antialiased bg-gradient-to-br from-primary-50/40 via-white to-primary-50/20">
      <DashboardNavbar
        variant="admin"
        navItems={navItems}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogout={handleLogout}
        onNewInvoice={() => setActiveSection('create')}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <main className="flex-1 min-w-0 overflow-y-auto admin-scroll">
          <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 md:py-10">
            
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 mb-6 sm:mb-10">
              <div className="min-w-0">
                <h1 className="section-heading text-primary-950 mb-2 text-2xl sm:text-3xl md:text-4xl">
                  {activeSection === 'overview' && 'Dashboard'}
                  {activeSection === 'create' && 'New Invoice'}
                  {activeSection === 'invoices' && 'Invoices & Payments'}
                  {activeSection === 'projects' && 'Projects'}
                  {activeSection === 'announcements' && 'Announcements'}
                  {activeSection === 'clients' && 'Clients'}
                  {activeSection === 'settings' && 'Settings'}
                </h1>
                <p className="section-sub text-primary-700/90 max-w-2xl">
                  {activeSection === 'overview' && 'Welcome back. Here is what’s happening with your business today.'}
                  {activeSection === 'create' && 'Create and send professional invoices to your clients in seconds.'}
                  {activeSection === 'invoices' && 'Manage your billing history, track payments, and handle overdue accounts.'}
                  {activeSection === 'projects' && 'Create and manage projects assigned to your clients.'}
                  {activeSection === 'announcements' && 'Post updates and notices visible to your clients in their portal.'}
                  {activeSection === 'clients' && 'Manage your client relationships and project details.'}
                  {activeSection === 'settings' && 'Configure your workspace preferences and billing details.'}
                </p>
              </div>

              {activeSection === 'projects' && (
                <button type="button" onClick={openNewProject} className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors shadow-md shadow-primary-500/20 shrink-0">
                  <Plus className="w-4 h-4" /> New Project
                </button>
              )}

              {activeSection === 'invoices' && (
                 <div className="flex flex-wrap items-center gap-1 p-1.5 rounded-full bg-white/80 border border-primary-200/60 shadow-sm w-full sm:w-auto">
                    {['all', 'unpaid', 'paid', 'overdue'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setStatusFilter(filter)}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all capitalize ${
                          statusFilter === filter
                            ? 'bg-primary-600 text-white shadow-md'
                            : 'text-primary-700/80 hover:bg-primary-50'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                 </div>
              )}
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700 flex items-center gap-3 mb-8 animate-fade-in">
                <div className="p-2 bg-red-100 rounded-full shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <p className="font-medium">{error}</p>
              </div>
            )}

            {/* Overview Section  -  real data, modern layout */}
            {activeSection === 'overview' && (
              <div className="space-y-6 animate-fade-in-up">

                {/* ── Row 1: 4 primary stat cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
                  <StatCard
                    icon={DollarSign}
                    label="Total Revenue"
                    value={loading ? '-' : `Rs. ${overviewStats.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    helper={loading ? 'Loading…' : `${overviewStats.totalInvoices} invoice${overviewStats.totalInvoices !== 1 ? 's' : ''} generated`}
                  />
                  <StatCard
                    icon={CheckCircle}
                    label="Paid Revenue"
                    value={loading ? '-' : `Rs. ${overviewStats.paidRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    helper={loading ? 'Loading…' : `${overviewStats.paidCount} cleared`}
                    tone="success"
                  />
                  <StatCard
                    icon={Clock}
                    label="Pending Amount"
                    value={loading ? '-' : `Rs. ${overviewStats.pendingRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    helper={loading ? 'Loading…' : `${overviewStats.unpaidCount} awaiting payment`}
                    tone="warning"
                  />
                  <StatCard
                    icon={TrendingUp}
                    label="Average Invoice"
                    value={loading ? '-' : overviewStats.totalInvoices ? `Rs. ${overviewStats.averageInvoice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Rs. 0.00'}
                    helper="Per invoice"
                  />
                </div>

                {/* ── Row 2: secondary stat strip ── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
                  {/* Collection Rate */}
                  <div className="admin-card-glass rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-50 border border-primary-200/60 flex items-center justify-center shrink-0">
                      <Target className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-primary-500 mb-0.5">Collection Rate</p>
                      {loading ? (
                        <div className="h-6 w-16 bg-primary-100 rounded animate-pulse" />
                      ) : (
                        <>
                          <p className="text-2xl font-extrabold text-primary-950 tabular-nums">{overviewStats.collectionRate}%</p>
                          <div className="mt-1.5 h-1.5 bg-primary-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${overviewStats.collectionRate >= 80 ? 'bg-emerald-500' : overviewStats.collectionRate >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                              style={{ width: `${overviewStats.collectionRate}%` }}
                            />
                          </div>
                          <p className="text-[10px] text-primary-500 mt-1">{overviewStats.collectionRate >= 80 ? 'Excellent' : overviewStats.collectionRate >= 50 ? 'Moderate' : 'Needs attention'}</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Overdue Alert */}
                  <div className={`rounded-2xl p-5 flex items-center gap-4 border ${overviewStats.overdueCount > 0 ? 'bg-red-50 border-red-200' : 'admin-card-glass border-primary-200/60'}`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${overviewStats.overdueCount > 0 ? 'bg-red-100 border border-red-200' : 'bg-primary-50 border border-primary-200/60'}`}>
                      <AlertCircle className={`w-5 h-5 ${overviewStats.overdueCount > 0 ? 'text-red-600' : 'text-primary-400'}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${overviewStats.overdueCount > 0 ? 'text-red-500' : 'text-primary-500'}`}>Overdue</p>
                      {loading ? (
                        <div className="h-6 w-16 bg-primary-100 rounded animate-pulse" />
                      ) : (
                        <>
                          <p className={`text-2xl font-extrabold tabular-nums ${overviewStats.overdueCount > 0 ? 'text-red-700' : 'text-primary-950'}`}>
                            {overviewStats.overdueCount}
                          </p>
                          <p className={`text-[10px] mt-0.5 ${overviewStats.overdueCount > 0 ? 'text-red-600 font-semibold' : 'text-primary-500'}`}>
                            {overviewStats.overdueCount > 0
                              ? `Rs. ${overviewStats.overdueRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })} at risk`
                              : 'No overdue invoices'}
                          </p>
                          {overviewStats.overdueCount > 0 && (
                            <button
                              type="button"
                              onClick={() => { setStatusFilter('overdue'); setActiveSection('invoices'); }}
                              className="mt-1.5 text-[10px] font-bold text-red-600 hover:text-red-700 underline underline-offset-2"
                            >
                              View overdue →
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* This Month */}
                  <div className="admin-card-glass rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-50 border border-primary-200/60 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-primary-500 mb-0.5">This Month</p>
                      {loading ? (
                        <div className="h-6 w-24 bg-primary-100 rounded animate-pulse" />
                      ) : (
                        <>
                          <p className="text-2xl font-extrabold text-primary-950 tabular-nums truncate">
                            Rs. {overviewStats.thisMonthRevenue.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <p className="text-[10px] text-primary-500">{overviewStats.thisMonthCount} invoice{overviewStats.thisMonthCount !== 1 ? 's' : ''}</p>
                            {overviewStats.monthGrowth !== null && (
                              <span className={`text-[10px] font-bold flex items-center gap-0.5 ${overviewStats.monthGrowth >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                {overviewStats.monthGrowth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {Math.abs(overviewStats.monthGrowth)}% vs last month
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── Row 3: Recent Activity | Billing Health ── */}
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Recent Activity */}
                  <div className="lg:col-span-2 admin-card-glass rounded-2xl overflow-hidden flex flex-col min-h-[280px] sm:min-h-[320px]">
                    <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-primary-100 flex items-center justify-between gap-2 flex-wrap">
                      <h2 className="text-base font-bold text-primary-950 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary-500" />
                        Recent Activity
                      </h2>
                      <button
                        type="button"
                        onClick={() => setActiveSection('invoices')}
                        className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors py-2 px-3 -my-2 -mx-3 rounded-lg touch-manipulation active:bg-primary-50"
                      >
                        View all <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex-1 flex flex-col min-h-0">
                      {loading ? (
                        <div className="flex-1 flex items-center justify-center py-12">
                          <div className="w-10 h-10 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                        </div>
                      ) : invoices.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                          <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mb-4">
                            <FilePlus className="w-7 h-7 text-primary-500" />
                          </div>
                          <p className="font-semibold text-primary-950 text-lg">No invoices yet</p>
                          <p className="text-primary-600/80 text-sm max-w-xs mt-1 mb-5">Create your first invoice to see real data here.</p>
                          <button
                            type="button"
                            onClick={() => setActiveSection('create')}
                            className="inline-flex items-center gap-2 rounded-full bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-5 py-2.5 shadow-md shadow-primary-500/20 transition-all"
                          >
                            <Plus className="w-4 h-4" /> Create Invoice
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="md:hidden overflow-y-auto admin-scroll px-4 pb-4">
                            <ul className="space-y-3">
                              {invoices.slice(0, 5).map((inv) => (
                                <li key={inv._id} className="rounded-xl border border-primary-100 bg-white p-4 shadow-sm">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                      <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm shrink-0">
                                        {inv.clientName.charAt(0).toUpperCase()}
                                      </div>
                                      <div className="min-w-0">
                                        <p className="font-semibold text-primary-950 truncate">{inv.clientName}</p>
                                        <p className="text-xs text-primary-500">#{String(inv._id).slice(-6)}</p>
                                      </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <p className="font-semibold text-primary-950 text-sm">Rs. {(inv.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                                      <StatusPill status={inv.status} />
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="hidden md:block overflow-x-auto admin-scroll">
                            <table className="w-full min-w-[400px] text-left text-sm">
                              <thead className="bg-primary-50/50 border-b border-primary-100">
                                <tr>
                                  <th className="px-4 sm:px-6 py-2 sm:py-3 font-semibold text-primary-700 text-xs uppercase tracking-wider">Client</th>
                                  <th className="px-4 sm:px-6 py-2 sm:py-3 font-semibold text-primary-700 text-xs uppercase tracking-wider">Date</th>
                                  <th className="px-4 sm:px-6 py-2 sm:py-3 font-semibold text-primary-700 text-xs uppercase tracking-wider text-right">Amount</th>
                                  <th className="px-4 sm:px-6 py-2 sm:py-3 font-semibold text-primary-700 text-xs uppercase tracking-wider text-center">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-primary-100/50">
                                {invoices.slice(0, 5).map((inv) => (
                                  <tr key={inv._id} className="hover:bg-primary-50/30 transition-colors">
                                    <td className="px-4 sm:px-6 py-2 sm:py-3">
                                      <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs">
                                          {inv.clientName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                          <p className="font-semibold text-primary-950">{inv.clientName}</p>
                                          <p className="text-xs text-primary-500">#{String(inv._id).slice(-6)}</p>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-2 sm:py-3 text-primary-600 whitespace-nowrap">
                                      {new Date(inv.invoiceDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                                    </td>
                                    <td className="px-4 sm:px-6 py-2 sm:py-3 text-right font-semibold text-primary-950 whitespace-nowrap">
                                      Rs. {(inv.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-4 sm:px-6 py-2 sm:py-3 text-center">
                                      <StatusPill status={inv.status} />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Billing Health — fully data-driven */}
                  <div className="bg-primary-900 text-white rounded-2xl p-6 shadow-xl shadow-primary-900/20 relative overflow-hidden flex flex-col min-h-[320px] border border-primary-800/50">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                    <div className="relative z-10 flex flex-col flex-1">
                      <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center mb-4 border border-white/10">
                        <ShieldCheck className="w-5 h-5 text-primary-300" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">Billing Health</h3>
                      {loading ? (
                        <p className="text-primary-200 text-sm">Loading…</p>
                      ) : overviewStats.totalRevenue === 0 ? (
                        <p className="text-primary-300 text-sm">No revenue yet. Create invoices to see your billing health score here.</p>
                      ) : (
                        <>
                          {/* Score badge */}
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`text-3xl font-black tabular-nums ${overviewStats.collectionRate >= 80 ? 'text-emerald-400' : overviewStats.collectionRate >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                              {overviewStats.collectionRate}%
                            </div>
                            <div>
                              <p className={`text-xs font-bold uppercase tracking-wider ${overviewStats.collectionRate >= 80 ? 'text-emerald-400' : overviewStats.collectionRate >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                                {overviewStats.collectionRate >= 80 ? 'Excellent' : overviewStats.collectionRate >= 50 ? 'Moderate' : 'Poor'}
                              </p>
                              <p className="text-primary-300 text-xs">Collection rate</p>
                            </div>
                          </div>

                          {/* Pending bar */}
                          <div className="mb-4">
                            <div className="flex justify-between text-xs text-primary-300 mb-1.5">
                              <span>Pending share</span>
                              <span className={`font-bold ${overviewStats.pendingPercentage <= 20 ? 'text-emerald-400' : overviewStats.pendingPercentage <= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                                {overviewStats.pendingPercentage}%
                              </span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ${overviewStats.pendingPercentage <= 20 ? 'bg-emerald-400' : overviewStats.pendingPercentage <= 50 ? 'bg-amber-400' : 'bg-red-400'}`}
                                style={{ width: `${Math.min(overviewStats.pendingPercentage, 100)}%` }}
                              />
                            </div>
                          </div>

                          {/* Dynamic action tips */}
                          <ul className="space-y-2 text-sm flex-1">
                            {overviewStats.overdueCount > 0 && (
                              <li className="flex items-start gap-2 text-red-300">
                                <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                <span>{overviewStats.overdueCount} overdue invoice{overviewStats.overdueCount > 1 ? 's' : ''} — follow up now</span>
                              </li>
                            )}
                            {overviewStats.pendingPercentage > 20 && (
                              <li className="flex items-start gap-2 text-amber-300">
                                <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                <span>Pending is {overviewStats.pendingPercentage}% — aim for under 20%</span>
                              </li>
                            )}
                            {overviewStats.collectionRate < 80 && (
                              <li className="flex items-start gap-2 text-primary-300">
                                <Zap className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                <span>Offer early payment discounts to improve collection</span>
                              </li>
                            )}
                            {overviewStats.collectionRate >= 80 && overviewStats.overdueCount === 0 && (
                              <li className="flex items-start gap-2 text-emerald-300">
                                <CheckCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                <span>Cash flow is healthy — keep it up!</span>
                              </li>
                            )}
                            <li className="flex items-start gap-2 text-primary-300">
                              <RefreshCw className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                              <span>Reconcile accounts weekly</span>
                            </li>
                          </ul>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── Row 4: Monthly Revenue Chart | Top Clients | Quick Actions ── */}
                <div className="grid lg:grid-cols-3 gap-6">

                  {/* Monthly Revenue Bar Chart */}
                  <div className="lg:col-span-2 admin-card-glass rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-primary-100 flex items-center gap-2">
                      <BarChart2 className="w-5 h-5 text-primary-500" />
                      <h2 className="text-base font-bold text-primary-950">Revenue — Last 6 Months</h2>
                    </div>
                    <div className="px-5 py-5">
                      {loading ? (
                        <div className="flex items-end gap-3 h-32">
                          {[60, 80, 45, 90, 70, 55].map((h, i) => (
                            <div key={i} className="flex-1 bg-primary-100 rounded-t-lg animate-pulse" style={{ height: `${h}%` }} />
                          ))}
                        </div>
                      ) : overviewStats.maxMonthlyRevenue === 1 ? (
                        <div className="flex items-center justify-center h-32 text-primary-400 text-sm">No invoice data yet</div>
                      ) : (
                        <div className="flex items-end gap-2 sm:gap-3 h-36">
                          {overviewStats.monthlyData.map((m, i) => {
                            const heightPct = overviewStats.maxMonthlyRevenue > 0 ? (m.revenue / overviewStats.maxMonthlyRevenue) * 100 : 0;
                            const isCurrentMonth = i === overviewStats.monthlyData.length - 1;
                            return (
                              <div key={m.label} className="flex-1 flex flex-col items-center gap-1 group">
                                <div className="w-full flex flex-col justify-end" style={{ height: '120px' }}>
                                  <div
                                    className={`w-full rounded-t-lg transition-all duration-700 ${isCurrentMonth ? 'bg-primary-600' : 'bg-primary-200 group-hover:bg-primary-300'}`}
                                    style={{ height: `${Math.max(heightPct, m.revenue > 0 ? 4 : 0)}%` }}
                                    title={`Rs. ${m.revenue.toLocaleString('en-IN')}`}
                                  />
                                </div>
                                <span className={`text-[10px] font-semibold whitespace-nowrap ${isCurrentMonth ? 'text-primary-700' : 'text-primary-400'}`}>{m.label}</span>
                                {m.revenue > 0 && (
                                  <span className="text-[9px] text-primary-500 tabular-nums hidden sm:block">
                                    {m.revenue >= 100000
                                      ? `${(m.revenue / 100000).toFixed(1)}L`
                                      : m.revenue >= 1000
                                        ? `${(m.revenue / 1000).toFixed(1)}K`
                                        : m.revenue.toString()}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Top Clients */}
                  <div className="admin-card-glass rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-primary-100 flex items-center justify-between gap-2">
                      <h2 className="text-base font-bold text-primary-950 flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary-500" />
                        Top Clients
                      </h2>
                      <button
                        type="button"
                        onClick={() => setActiveSection('clients')}
                        className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                      >
                        All <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="px-5 py-4">
                      {loading ? (
                        <div className="space-y-3">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-primary-100 animate-pulse shrink-0" />
                              <div className="flex-1 space-y-1.5">
                                <div className="h-3 bg-primary-100 rounded animate-pulse w-3/4" />
                                <div className="h-2 bg-primary-100 rounded animate-pulse w-1/2" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : overviewStats.topClients.length === 0 ? (
                        <p className="text-sm text-primary-400 text-center py-6">No clients yet</p>
                      ) : (
                        <ul className="space-y-3">
                          {overviewStats.topClients.map((client, i) => {
                            const shareWidth = overviewStats.totalRevenue > 0 ? (client.total / overviewStats.totalRevenue) * 100 : 0;
                            return (
                              <li key={client.name} className="flex items-center gap-3 group">
                                <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs shrink-0">
                                  {i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1 mb-1">
                                    <p className="font-semibold text-primary-950 text-sm truncate">{client.name}</p>
                                    <p className="text-xs font-bold text-primary-700 tabular-nums shrink-0">
                                      Rs. {client.total >= 100000 ? `${(client.total / 100000).toFixed(1)}L` : client.total >= 1000 ? `${(client.total / 1000).toFixed(1)}K` : client.total.toFixed(0)}
                                    </p>
                                  </div>
                                  <div className="h-1 bg-primary-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary-500 rounded-full" style={{ width: `${shareWidth}%` }} />
                                  </div>
                                  <p className="text-[10px] text-primary-400 mt-0.5">{client.count} invoice{client.count !== 1 ? 's' : ''} · {Math.round(shareWidth)}% of total</p>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── Row 5: Invoice Aging + Quick Actions ── */}
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Invoice Aging Report */}
                  <div className="lg:col-span-2 admin-card-glass rounded-2xl p-5 sm:p-6">
                    <h2 className="text-base font-bold text-primary-950 flex items-center gap-2 mb-4">
                      <Clock className="w-5 h-5 text-primary-500" />
                      Invoice Aging (Unpaid / Overdue)
                      {overviewStats.disputedCount > 0 && (
                        <span className="ml-auto text-xs font-bold px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                          <Flag className="w-3 h-3" />{overviewStats.disputedCount} Dispute{overviewStats.disputedCount > 1 ? 's' : ''}
                        </span>
                      )}
                    </h2>
                    <div className="space-y-3">
                      {overviewStats.agingBuckets.map(({ range, count, amount }) => {
                        const maxCount = Math.max(...overviewStats.agingBuckets.map((b) => b.count), 1);
                        const tone = range === '0–30d' ? 'bg-amber-400' : range === '31–60d' ? 'bg-orange-500' : 'bg-red-500';
                        return (
                          <div key={range} className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-500 w-16 shrink-0">{range}</span>
                            <div className="flex-1 h-6 bg-slate-100 rounded-lg overflow-hidden">
                              <div className={`h-full ${tone} rounded-lg transition-all duration-700`} style={{ width: `${count > 0 ? Math.max((count / maxCount) * 100, 6) : 0}%` }} />
                            </div>
                            <span className="text-xs font-bold text-slate-700 w-6 text-right">{count}</span>
                            <span className="text-xs text-slate-500 w-28 text-right tabular-nums">Rs. {amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                          </div>
                        );
                      })}
                      {overviewStats.agingBuckets.every((b) => b.count === 0) && (
                        <p className="text-sm text-emerald-600 font-semibold flex items-center gap-2"><CheckCircle className="w-4 h-4" />No aging receivables — great job!</p>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="admin-card-glass rounded-2xl p-5 sm:p-6">
                  <h2 className="text-base font-bold text-primary-950 flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-primary-500" />
                    Quick Actions
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveSection('create')}
                      className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-primary-200 bg-primary-50 hover:bg-primary-100 hover:border-primary-300 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center group-hover:bg-primary-700 transition-colors">
                        <FilePlus className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-semibold text-primary-800">New Invoice</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSection('clients')}
                      className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-primary-200 bg-primary-50 hover:bg-primary-100 hover:border-primary-300 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white border border-primary-200 text-primary-600 flex items-center justify-center group-hover:border-primary-300 transition-colors">
                        <UserPlus className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-semibold text-primary-800">Add Client</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setStatusFilter('overdue'); setActiveSection('invoices'); }}
                      className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-primary-200 bg-primary-50 hover:bg-primary-100 hover:border-primary-300 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white border border-primary-200 text-primary-600 flex items-center justify-center group-hover:border-primary-300 transition-colors">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-semibold text-primary-800">Overdue</span>
                      {overviewStats.overdueCount > 0 && (
                        <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full -mt-1">
                          {overviewStats.overdueCount}
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setStatusFilter('unpaid'); setActiveSection('invoices'); }}
                      className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-primary-200 bg-primary-50 hover:bg-primary-100 hover:border-primary-300 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white border border-primary-200 text-primary-600 flex items-center justify-center group-hover:border-primary-300 transition-colors">
                        <Clock className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-semibold text-primary-800">Unpaid</span>
                      {overviewStats.unpaidCount > 0 && (
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full -mt-1">
                          {overviewStats.unpaidCount}
                        </span>
                      )}
                    </button>
                  </div>
                  </div>
                </div>

              </div>
            )}

            {/* Create Invoice Section - mobile: form full width, preview below */}
            {activeSection === 'create' && (
              <div className="flex flex-col lg:grid lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 animate-fade-in-up">
                {/* Form Side - full width on mobile */}
                <div className="w-full lg:col-span-7 min-w-0 order-1">
                  <form onSubmit={handleCreateInvoice} className="admin-card-glass rounded-2xl p-4 sm:p-5 lg:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-primary-100">
                      <div className="flex items-center gap-4">
                        <img
                          src="/transparent_logo.png"
                          alt="Rastogi Codeworks"
                          className="h-12 w-12 object-contain shrink-0"
                        />
                        <div>
                          <h2 className="text-xl font-bold text-primary-950">Invoice Details</h2>
                          <p className="text-xs font-medium text-primary-600 mt-0.5">Rastogi Codeworks</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary-600 bg-primary-50 px-3 py-1.5 rounded-full border border-primary-200">Draft</span>
                    </div>

                    <div className="space-y-5 sm:space-y-6">
                      {/* Client details - GST in first row so always visible */}
                      <div className="space-y-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Client details</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Client Name</label>
                            <div className="relative">
                              <Briefcase className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                              <input
                                type="text"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                placeholder="e.g. Acme Corp"
                                className="w-full pl-10 sm:pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none font-medium text-slate-900 placeholder:text-slate-400 text-base"
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">GST Number (optional)</label>
                            <input
                              type="text"
                              value={clientGst}
                              onChange={(e) => setClientGst(e.target.value)}
                              placeholder="e.g. 27AABCU9603R1ZM"
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none font-medium text-slate-900 placeholder:text-slate-400 text-base"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Link to portal client (optional)</label>
                          <div className="relative">
                            <select
                              value={invoiceClientEmail}
                              onChange={(e) => {
                                setInvoiceClientEmail(e.target.value);
                                const c = clients.find((x) => x.email === e.target.value);
                                if (c && c.name && !clientName) setClientName(c.name);
                              }}
                              className="w-full appearance-none px-4 py-3 pr-10 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none font-medium text-slate-900 text-base cursor-pointer"
                            >
                              <option value="">— None —</option>
                              {clients.map((c) => (
                                <option key={c._id || c.id} value={c.email}>{c.name || c.email}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          </div>
                          <p className="text-[10px] text-slate-500 ml-1">Shows this invoice under that client in Clients.</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Billing Address</label>
                          <textarea
                            value={billingAddress}
                            onChange={(e) => setBillingAddress(e.target.value)}
                            placeholder="Street, City, State, PIN, Country"
                            rows={2}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none font-medium text-slate-900 placeholder:text-slate-400 resize-none text-base"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Status</label>
                          <div className="relative">
                            <select
                              value={invoiceStatus}
                              onChange={(e) => setInvoiceStatus(e.target.value)}
                              className="w-full appearance-none px-4 py-3 pr-10 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none font-medium text-slate-900 text-base cursor-pointer"
                            >
                              <option value="unpaid">Unpaid</option>
                              <option value="paid">Paid</option>
                              <option value="overdue">Overdue</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          </div>
                          <p className="text-[10px] text-slate-500 ml-1">Payment status for this invoice.</p>
                        </div>

                        {/* Payment Terms */}
                        <div className="space-y-3">
                          <button
                            type="button"
                            onClick={() => setShowPaymentTerms((p) => !p)}
                            className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-primary-50 hover:border-primary-300 transition-all"
                          >
                            <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                              <CreditCard className="w-4 h-4 text-primary-500" />
                              Payment Terms
                              {paymentTerms.length > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 text-xs font-bold">{paymentTerms.length} installment{paymentTerms.length > 1 ? 's' : ''}</span>
                              )}
                            </span>
                            <ChevronUp className={`w-4 h-4 text-slate-400 transition-transform ${showPaymentTerms ? '' : 'rotate-180'}`} />
                          </button>

                          {showPaymentTerms && (
                            <div className="space-y-4 px-1">
                              {/* Preset buttons */}
                              <div className="space-y-1.5">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Quick Presets</p>
                                <div className="flex flex-wrap gap-2">
                                  {PAYMENT_PRESETS.map((preset) => (
                                    <button
                                      key={preset.label}
                                      type="button"
                                      onClick={() => applyPreset(preset)}
                                      className="px-3 py-1.5 rounded-lg bg-primary-50 border border-primary-200 text-primary-700 text-xs font-bold hover:bg-primary-100 hover:border-primary-300 transition-colors"
                                    >
                                      {preset.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Term rows */}
                              {paymentTerms.length > 0 && (
                                <div className="space-y-2">
                                  {/* Header */}
                                  <div className="hidden sm:grid grid-cols-12 gap-2 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    <div className="col-span-4">Label</div>
                                    <div className="col-span-3 text-center">%</div>
                                    <div className="col-span-4">Due Date</div>
                                    <div className="col-span-1" />
                                  </div>
                                  {paymentTerms.map((term, i) => {
                                    const amt = totals.total * (Number(term.percentage) || 0) / 100;
                                    return (
                                      <div key={i} className="grid grid-cols-12 gap-2 items-center p-3 rounded-xl bg-slate-50 border border-slate-200">
                                        <div className="col-span-12 sm:col-span-4">
                                          <input
                                            type="text"
                                            value={term.label}
                                            onChange={(e) => handleTermChange(i, 'label', e.target.value)}
                                            placeholder={`Installment ${i + 1}`}
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none text-sm font-medium"
                                          />
                                        </div>
                                        <div className="col-span-5 sm:col-span-3">
                                          <div className="relative">
                                            <input
                                              type="number"
                                              min="0"
                                              max="100"
                                              value={term.percentage}
                                              onChange={(e) => handleTermChange(i, 'percentage', e.target.value)}
                                              placeholder="0"
                                              className="w-full px-3 py-2 pr-8 bg-white border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none text-sm font-medium text-center tabular-nums"
                                            />
                                            <Percent className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                                          </div>
                                          {totals.total > 0 && (
                                            <p className="text-[10px] text-primary-600 font-semibold mt-1 text-center tabular-nums">
                                              Rs. {amt.toFixed(2)}
                                            </p>
                                          )}
                                        </div>
                                        <div className="col-span-5 sm:col-span-4">
                                          <input
                                            type="date"
                                            value={term.dueDate}
                                            onChange={(e) => handleTermChange(i, 'dueDate', e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none text-sm font-medium"
                                          />
                                        </div>
                                        <div className="col-span-2 sm:col-span-1 flex justify-end">
                                          <button
                                            type="button"
                                            onClick={() => removePaymentTerm(i)}
                                            className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}

                                  {/* Total percentage indicator */}
                                  <div className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold ${termsTotalPct === 100 ? 'bg-green-50 text-green-700 border border-green-200' : termsTotalPct > 100 ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                                    <span>Total: {termsTotalPct}%</span>
                                    {termsTotalPct === 100 ? <span>✓ Balanced</span> : termsTotalPct > 100 ? <span>Over by {termsTotalPct - 100}%</span> : <span>{100 - termsTotalPct}% remaining</span>}
                                  </div>
                                </div>
                              )}

                              <button
                                type="button"
                                onClick={addPaymentTerm}
                                className="flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700 bg-primary-50 px-3 py-2 rounded-lg border border-primary-200/60 transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" /> Add Installment
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Issued</label>
                            <input
                              type="date"
                              value={invoiceDate}
                              onChange={(e) => setInvoiceDate(e.target.value)}
                              className="w-full min-w-0 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none font-medium text-slate-900 text-base"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Due</label>
                            <input
                              type="date"
                              value={dueDate}
                              onChange={(e) => setDueDate(e.target.value)}
                              className="w-full min-w-0 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none font-medium text-slate-900 text-base"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Line Items  -  table-style alignment */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Line Items</label>
                          <button
                            type="button"
                            onClick={addItem}
                            className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1.5 bg-primary-50 px-3 py-2 rounded-lg border border-primary-200/60 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Item
                          </button>
                        </div>

                        {/* Table header  -  hidden on small, visible md+ */}
                        <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-2 rounded-t-xl bg-primary-50/60 border border-primary-200/60 border-b-0 text-[10px] font-bold uppercase tracking-wider text-primary-700">
                          <div className="col-span-6">Description</div>
                          <div className="col-span-2 text-center">Qty</div>
                          <div className="col-span-2 text-right">Unit Price</div>
                          <div className="col-span-2 text-right">Amount</div>
                        </div>
                        
                        <div className="space-y-3">
                          {items.map((item, index) => (
                            <div key={index} className="group relative grid grid-cols-12 gap-3 items-center p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 hover:border-slate-300 hover:shadow-sm transition-all">
                              <div className="col-span-12 md:col-span-6 space-y-1">
                                <label className="md:hidden text-[10px] font-bold uppercase text-slate-400 ml-1">Description</label>
                                <input
                                  type="text"
                                  value={item.description}
                                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                  placeholder="Item details"
                                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none text-sm font-medium"
                                />
                              </div>
                              <div className="col-span-4 md:col-span-2 space-y-1">
                                <label className="md:hidden text-[10px] font-bold uppercase text-slate-400 ml-1">Qty</label>
                                <input
                                  type="number"
                                  min="0"
                                  value={item.quantity}
                                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none text-sm font-medium text-center tabular-nums"
                                />
                              </div>
                              <div className="col-span-4 md:col-span-2 space-y-1">
                                <label className="md:hidden text-[10px] font-bold uppercase text-slate-400 ml-1">Unit Price</label>
                                <input
                                  type="number"
                                  min="0"
                                  value={item.price}
                                  onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none text-sm font-medium text-right tabular-nums"
                                />
                              </div>
                              <div className="col-span-4 md:col-span-2 flex items-center justify-end min-h-[42px]">
                                <span className="text-sm font-bold text-slate-900 tabular-nums">
                                  Rs. {((Number(item.quantity) || 0) * (Number(item.price) || 0)).toFixed(2)}
                                </span>
                              </div>
                              
                              {items.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeItem(index)}
                                  className="absolute -top-2 -right-2 p-1.5 bg-white border border-red-100 text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Notes & Terms</label>
                        <textarea
                          rows={3}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="e.g. Thank you for your business. Payment is due within 7 days."
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none font-medium text-slate-900 placeholder:text-slate-400 resize-none"
                        />
                      </div>
                    </div>

                    {/* Actions - mobile: stacked, good touch targets */}
                    <div className="mt-5 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="w-full sm:w-auto px-6 py-3.5 sm:py-3 rounded-xl sm:rounded-full text-sm font-semibold text-primary-700/80 hover:text-primary-800 hover:bg-primary-50 transition-all order-2 sm:order-1 touch-manipulation"
                      >
                        Clear
                      </button>
                      <div className="flex flex-col min-[400px]:flex-row items-stretch min-[400px]:items-center gap-2 sm:gap-3 flex-wrap order-1 sm:order-2">
                        <button
                          type="button"
                          onClick={handleDownloadPdf}
                          disabled={pdfLoading}
                          className="w-full min-[400px]:w-auto px-6 py-3.5 sm:py-3 rounded-xl sm:rounded-full border border-primary-200 text-primary-700 text-sm font-semibold hover:bg-primary-50 hover:border-primary-300 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed touch-manipulation"
                        >
                          {pdfLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                              Generating PDF…
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4" /> Download PDF
                            </>
                          )}
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full min-[400px]:w-auto px-8 py-3.5 sm:py-3 rounded-xl sm:rounded-full bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed touch-manipulation"
                        >
                          {loading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Save Invoice
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Preview Side - below form on mobile, sticky on desktop */}
                <div className="w-full lg:col-span-5 min-w-0 order-2">
                  <div className="lg:sticky lg:top-24">
                    <div className="admin-card-glass rounded-2xl overflow-hidden border border-primary-200/60">
                      <div className="bg-primary-900 p-5 sm:p-6 lg:p-8 text-white relative overflow-hidden border-b border-primary-800/50">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                        <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                          <div className="min-w-0">
                            <p className="text-xs font-bold uppercase tracking-widest text-primary-300 mb-2">Invoice For</p>
                            <h3 className="text-xl sm:text-2xl font-bold text-white truncate">{clientName || 'Client Name'}</h3>
                            {clientGst.trim() && (
                              <p className="text-primary-200 text-sm mt-1">GST: {clientGst.trim()}</p>
                            )}
                            {billingAddress.trim() && (
                              <p className="text-primary-200 text-sm mt-1 whitespace-pre-line">{billingAddress.trim()}</p>
                            )}
                            <p className="text-primary-200 text-sm mt-1">ID: #INV-{new Date().getTime().toString().slice(-6)}</p>
                          </div>
                          <div className="text-left sm:text-right shrink-0">
                            <p className="text-xs font-bold uppercase tracking-widest text-primary-300 mb-1">Amount Due</p>
                            <p className="text-2xl sm:text-3xl font-bold text-primary-300 tabular-nums">Rs. {totals.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-5 sm:p-6 lg:p-8">
                        {clientGst.trim() && (
                          <div className="mb-6">
                            <p className="text-xs font-bold uppercase tracking-wider text-primary-600/80 mb-1">GST Number</p>
                            <p className="text-sm text-primary-800/80">{clientGst.trim()}</p>
                          </div>
                        )}
                        {billingAddress.trim() && (
                          <div className="mb-6">
                            <p className="text-xs font-bold uppercase tracking-wider text-primary-600/80 mb-1">Billing Address</p>
                            <p className="text-sm text-primary-800/80 whitespace-pre-line">{billingAddress.trim()}</p>
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-8">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-primary-600/80 mb-1">Issued Date</p>
                            <p className="font-semibold text-primary-950">{invoiceDate ? new Date(invoiceDate).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : '-'}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-primary-600/80 mb-1">Due Date</p>
                            <p className="font-semibold text-primary-950">{dueDate ? new Date(dueDate).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : '-'}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-xs font-bold uppercase tracking-wider text-primary-600/80 mb-1">Status</p>
                            <p className="font-semibold text-primary-950 capitalize">{invoiceStatus === 'paid' ? 'Paid' : invoiceStatus === 'overdue' ? 'Overdue' : 'Unpaid'}</p>
                          </div>
                        </div>

                        <div className="space-y-0 mb-8">
                          <p className="text-xs font-bold uppercase tracking-wider text-primary-600/80 border-b border-primary-100 pb-2 mb-3">Summary</p>
                          <div className="flex items-center justify-between py-2.5 text-sm">
                            <span className="text-primary-700/80">Subtotal</span>
                            <span className="font-semibold text-primary-950 tabular-nums">Rs. {totals.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex items-center justify-between py-3 mt-1 border-t-2 border-primary-200 text-base">
                            <span className="font-bold text-primary-950">Total</span>
                            <span className="font-bold text-primary-600 tabular-nums">Rs. {totals.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                        </div>

                        {notes && (
                          <div className="bg-primary-50/50 rounded-xl p-4 border border-primary-100">
                            <p className="text-xs font-bold uppercase tracking-wider text-primary-600/80 mb-1">Notes</p>
                            <p className="text-sm text-primary-800/80 italic">{notes}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="bg-primary-50/30 p-4 text-center border-t border-primary-100">
                        <p className="text-xs text-primary-600/80">This is a preview of how the invoice will appear to the client.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Invoices List Section */}
            {activeSection === 'invoices' && (
              <div className="admin-card-glass rounded-2xl overflow-hidden animate-fade-in-up">
                {filteredInvoices.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                    <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-6">
                      <Search className="w-10 h-10 text-primary-400" />
                    </div>
                    <h3 className="text-xl font-bold text-primary-950 mb-2">No invoices found</h3>
                    <p className="text-primary-700/80 max-w-md mx-auto mb-8">
                      We couldn't find any invoices matching your current filters. Try changing the status filter or create a new invoice.
                    </p>
                    <button
                      onClick={() => setActiveSection('create')}
                      className="px-6 py-3 rounded-full bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/25"
                    >
                      Create First Invoice
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto admin-scroll -mx-3 sm:mx-0">
                    <table className="w-full min-w-[640px] text-left border-collapse">
                      <thead>
                        <tr className="bg-primary-50/80 border-b border-primary-200/60 text-xs font-bold uppercase tracking-wider text-primary-700">
                          <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-5">Client Details</th>
                          <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap">Invoice Date</th>
                          <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap">Due Date</th>
                          <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-5 text-right whitespace-nowrap">Amount</th>
                          <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-5 text-center">Status</th>
                          <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-primary-100/50">
                        {filteredInvoices.map((inv) => (
                          <tr key={inv._id} className="group hover:bg-primary-50/30 transition-colors">
                            <td className="px-4 sm:px-6 md:px-8 py-3 sm:py-5">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm border border-primary-200/50">
                                  {inv.clientName.charAt(0).toUpperCase()}
                                </div>
                                <div>
<p className="font-bold text-primary-950 text-sm">{inv.clientName}</p>
                                <p className="text-xs text-primary-600/70 font-mono mt-0.5">#{String(inv._id).slice(-6)}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap">
                              <span className="text-sm font-medium text-primary-700/80">
                                {new Date(inv.invoiceDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap">
                              <span className="text-sm font-medium text-primary-700/80">
                                {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : '-'}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 md:px-8 py-3 sm:py-5 text-right whitespace-nowrap">
                              <span className="text-sm font-bold text-primary-950">
                                Rs. {(inv.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 md:px-8 py-3 sm:py-5 text-center">
                              <div className="inline-flex flex-col items-center gap-1">
                                <StatusPill status={inv.status} />
                                {inv.dispute?.flagged && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                                    <Flag className="w-2.5 h-2.5" />Dispute
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 md:px-8 py-3 sm:py-5 text-right">
                              <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleDownloadInvoicePdf(inv)}
                                  disabled={downloadingInvId === inv._id}
                                  className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Download PDF"
                                >
                                  {downloadingInvId === inv._id ? (
                                    <div className="w-4 h-4 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                                  ) : (
                                    <Download className="w-4 h-4" />
                                  )}
                                </button>
                                <div className="relative group/dropdown">
                                  <select
                                    value={inv.status}
                                    onChange={(e) => updateInvoiceStatus(inv._id, e.target.value)}
                                    className="appearance-none bg-white border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:border-primary-500 cursor-pointer hover:bg-slate-50"
                                  >
                                    <option value="unpaid">Mark Unpaid</option>
                                    <option value="paid">Mark Paid</option>
                                    <option value="overdue">Mark Overdue</option>
                                  </select>
                                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                                </div>
                                <button
                                  onClick={() => deleteInvoice(inv._id)}
                                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete Invoice"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Clients — create credentials + list */}
            {activeSection === 'clients' && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="admin-card-glass rounded-2xl border border-primary-200/60 p-6 sm:p-8">
                  <h2 className="text-lg font-bold text-primary-950 mb-1 flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-primary-500" />
                    Create client credentials (onboarding)
                  </h2>
                  <p className="text-sm text-primary-700/80 mb-6">
                    Add a new client so they can sign in to the client portal. Share the credentials with them securely.
                  </p>
                  {createdCredentials && (
                    <div className="mb-6 p-4 rounded-xl bg-primary-50 border border-primary-200">
                      <p className="text-sm font-semibold text-primary-800 mb-2">Credentials created — share with the client (password is shown only once):</p>
                      <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-primary-600 font-medium">Email:</span>
                          <code className="px-2 py-1 rounded bg-white border border-primary-200 text-sm font-mono">{createdCredentials.email}</code>
                          <button type="button" onClick={() => copyToClipboard(createdCredentials.email)} className="p-1.5 rounded-lg hover:bg-primary-100 text-primary-600" title="Copy">
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-primary-600 font-medium">Password:</span>
                          <code className="px-2 py-1 rounded bg-white border border-primary-200 text-sm font-mono">{createdCredentials.temporaryPassword}</code>
                          <button type="button" onClick={() => copyToClipboard(createdCredentials.temporaryPassword)} className="p-1.5 rounded-lg hover:bg-primary-100 text-primary-600" title="Copy">
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <button type="button" onClick={() => setCreatedCredentials(null)} className="mt-3 text-xs font-semibold text-primary-600 hover:text-primary-700">
                        Dismiss
                      </button>
                    </div>
                  )}
                  <form onSubmit={handleCreateClient} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div>
                      <label className="block text-xs font-semibold text-primary-700 mb-1.5">Name (optional)</label>
                      <input
                        type="text"
                        value={clientForm.name}
                        onChange={(e) => setClientForm((p) => ({ ...p, name: e.target.value }))}
                        placeholder="Client name"
                        className="w-full px-4 py-2.5 rounded-xl border border-primary-200 bg-white text-primary-900 placeholder:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-primary-700 mb-1.5">Email *</label>
                      <input
                        type="email"
                        value={clientForm.email}
                        onChange={(e) => setClientForm((p) => ({ ...p, email: e.target.value }))}
                        placeholder="client@example.com"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-primary-200 bg-white text-primary-900 placeholder:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-primary-700 mb-1.5">Password (min 8 chars)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={clientForm.password}
                          onChange={(e) => setClientForm((p) => ({ ...p, password: e.target.value }))}
                          placeholder="Set a password"
                          minLength={8}
                          className="flex-1 min-w-0 px-4 py-2.5 rounded-xl border border-primary-200 bg-white text-primary-900 placeholder:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 font-mono text-sm"
                        />
                        <button type="button" onClick={generatePassword} className="p-2.5 rounded-xl border border-primary-200 bg-primary-50 text-primary-700 hover:bg-primary-100 shrink-0" title="Generate password">
                          <KeyRound className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <button type="submit" disabled={clientCreateLoading} className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                        {clientCreateLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <UserPlus className="w-4 h-4" />}
                        Create client
                      </button>
                    </div>
                  </form>
                  {clientCreateError && (
                    <p className="mt-3 text-sm text-red-600 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {clientCreateError}
                    </p>
                  )}
                </div>

                <div className="admin-card-glass rounded-2xl border border-primary-200/60 overflow-hidden">
                  <div className="px-4 sm:px-6 py-4 border-b border-primary-100">
                    <h2 className="text-lg font-bold text-primary-950 flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary-500" />
                      Client portal users
                    </h2>
                    <p className="text-sm text-primary-700/80 mt-0.5">All clients who can sign in to the portal.</p>
                  </div>
                  {clientsLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <div className="w-10 h-10 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                    </div>
                  ) : clients.length === 0 ? (
                    <div className="py-12 text-center text-primary-600">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="font-medium">No clients yet</p>
                      <p className="text-sm mt-1">Create credentials above to onboard a client.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[400px] text-left text-sm">
                        <thead className="bg-primary-50/50 border-b border-primary-100">
                          <tr>
                            <th className="px-4 sm:px-6 py-3 font-semibold text-primary-700 text-xs uppercase tracking-wider">Name</th>
                            <th className="px-4 sm:px-6 py-3 font-semibold text-primary-700 text-xs uppercase tracking-wider">Email</th>
                            <th className="px-4 sm:px-6 py-3 font-semibold text-primary-700 text-xs uppercase tracking-wider">Projects / Invoices</th>
                            <th className="px-4 sm:px-6 py-3 font-semibold text-primary-700 text-xs uppercase tracking-wider">Created</th>
                            <th className="px-4 sm:px-6 py-3 font-semibold text-primary-700 text-xs uppercase tracking-wider text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-primary-100/50">
                          {clients.map((c) => {
                            const clientInvoices = c.invoices || [];
                            return (
                            <tr key={c._id || c.id} className="hover:bg-primary-50/30 transition-colors">
                              <td className="px-4 sm:px-6 py-3 font-medium text-primary-900">{c.name || '-'}</td>
                              <td className="px-4 sm:px-6 py-3 text-primary-700">{c.email}</td>
                              <td className="px-4 sm:px-6 py-3 text-primary-700 max-w-[220px]">
                                {clientInvoices.length === 0 ? (
                                  <span className="text-primary-500 italic">No invoices yet</span>
                                ) : (
                                  <div className="flex flex-col gap-1">
                                    {clientInvoices.slice(0, 3).map((inv) => (
                                      <span key={inv._id} className="text-sm">
                                        {inv.clientName || 'Invoice'}
                                        <span className="text-primary-500 text-xs ml-1">
                                          (Rs. {Number(inv.total || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })} · {inv.status})
                                        </span>
                                      </span>
                                    ))}
                                    {clientInvoices.length > 3 && (
                                      <span className="text-xs text-primary-500">+{clientInvoices.length - 3} more</span>
                                    )}
                                  </div>
                                )}
                              </td>
                              <td className="px-4 sm:px-6 py-3 text-primary-600">
                                {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                              </td>
                              <td className="px-4 sm:px-6 py-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteClient(c)}
                                  disabled={clientDeletingId === (c._id || c.id)}
                                  className="p-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50 transition-colors"
                                  title="Delete client"
                                >
                                  {clientDeletingId === (c._id || c.id) ? (
                                    <div className="w-5 h-5 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                                  ) : (
                                    <Trash2 className="w-5 h-5" />
                                  )}
                                </button>
                              </td>
                            </tr>
                          ); })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Client credentials reference table */}
                <div className="admin-card-glass rounded-2xl border border-primary-200/60 overflow-hidden">
                  <div className="px-4 sm:px-6 py-4 border-b border-primary-100">
                    <h2 className="text-lg font-bold text-primary-950 flex items-center gap-2">
                      <KeyRound className="w-5 h-5 text-primary-500" />
                      Client credentials reference
                    </h2>
                    <p className="text-sm text-primary-700/80 mt-0.5">Login (email) and suggested username format. Passwords are set at creation and shared securely — not stored.</p>
                  </div>
                  {clientsLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="w-10 h-10 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                    </div>
                  ) : clients.length === 0 ? (
                    <div className="py-12 text-center text-primary-600">
                      <KeyRound className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="font-medium">No clients yet</p>
                      <p className="text-sm mt-1">Create a client above to see credentials reference here.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[400px] text-left text-sm">
                        <thead className="bg-primary-50/50 border-b border-primary-100">
                          <tr>
                            <th className="px-4 sm:px-6 py-3 font-semibold text-primary-700 text-xs uppercase tracking-wider">Client</th>
                            <th className="px-4 sm:px-6 py-3 font-semibold text-primary-700 text-xs uppercase tracking-wider">Login (Email)</th>
                            <th className="px-4 sm:px-6 py-3 font-semibold text-primary-700 text-xs uppercase tracking-wider">Password</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-primary-100/50">
                          {clients.map((c) => {
                            const isNewlyCreated = createdCredentials && createdCredentials.email === c.email;
                            const sessionPwd = sessionPasswords[c.email];
                            return (
                              <tr key={c._id || c.id} className={`transition-colors ${isNewlyCreated ? 'bg-primary-50/50' : 'hover:bg-primary-50/30'}`}>
                                <td className="px-4 sm:px-6 py-3 font-medium text-primary-900">{c.name || '-'}</td>
                                <td className="px-4 sm:px-6 py-3">
                                  <code className="px-2 py-1 rounded bg-white border border-primary-200 text-primary-800 text-xs font-mono">{c.email}</code>
                                </td>
                                <td className="px-4 sm:px-6 py-3">
                                  {sessionPwd ? (
                                    <span className="flex items-center gap-2">
                                      <code className="px-2 py-1 rounded bg-white border border-primary-300 text-primary-800 text-xs font-mono tracking-wider">
                                        {visiblePasswords.has(c.email) ? sessionPwd : '••••••••'}
                                      </code>
                                      <button
                                        type="button"
                                        onClick={() => setVisiblePasswords((prev) => {
                                          const next = new Set(prev);
                                          next.has(c.email) ? next.delete(c.email) : next.add(c.email);
                                          return next;
                                        })}
                                        className="p-1.5 rounded-lg hover:bg-primary-100 text-primary-500 hover:text-primary-700 transition-colors"
                                        title={visiblePasswords.has(c.email) ? 'Hide password' : 'Show password'}
                                      >
                                        {visiblePasswords.has(c.email) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                      </button>
                                      <button type="button" onClick={() => copyToClipboard(sessionPwd)} className="p-1.5 rounded-lg hover:bg-primary-100 text-primary-600 transition-colors" title="Copy password">
                                        <Copy className="w-4 h-4" />
                                      </button>
                                    </span>
                                  ) : (
                                    <span className="text-primary-500 italic text-xs">Set at creation</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Projects ── */}
            {activeSection === 'projects' && (
              <div className="space-y-6 animate-fade-in-up">
                {showProjectForm && (
                  <div className="admin-card-glass rounded-2xl p-5 sm:p-6 border border-primary-200/60">
                    <h2 className="text-base font-bold text-primary-950 mb-5 flex items-center gap-2">
                      <FolderKanban className="w-5 h-5 text-primary-500" />
                      {editingProject ? 'Edit Project' : 'New Project'}
                    </h2>
                    <form onSubmit={handleSaveProject} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2 space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Title *</label>
                          <input value={projectForm.title} onChange={(e) => setProjectForm((p) => ({ ...p, title: e.target.value }))} placeholder="Project title" required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none font-medium text-slate-900" />
                        </div>
                        <div className="sm:col-span-2 space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Description</label>
                          <textarea value={projectForm.description} onChange={(e) => setProjectForm((p) => ({ ...p, description: e.target.value }))} rows={2} placeholder="Brief description…" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none font-medium text-slate-900 resize-none" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Client Email</label>
                          <div className="relative">
                            <select value={projectForm.clientEmail} onChange={(e) => { const c = clients.find((x) => x.email === e.target.value); setProjectForm((p) => ({ ...p, clientEmail: e.target.value, clientName: c?.name || p.clientName })); }} className="w-full appearance-none px-4 py-2.5 pr-10 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 outline-none font-medium text-slate-900">
                              <option value="">— Unassigned —</option>
                              {clients.map((c) => <option key={c._id} value={c.email}>{c.name || c.email}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</label>
                          <div className="relative">
                            <select value={projectForm.status} onChange={(e) => setProjectForm((p) => ({ ...p, status: e.target.value }))} className="w-full appearance-none px-4 py-2.5 pr-10 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 outline-none font-medium text-slate-900">
                              {['planning', 'in-progress', 'review', 'completed', 'on-hold'].map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Progress ({projectForm.progress}%)</label>
                          <input type="range" min={0} max={100} value={projectForm.progress} onChange={(e) => setProjectForm((p) => ({ ...p, progress: Number(e.target.value) }))} className="w-full accent-primary-600" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Start Date</label>
                            <input type="date" value={projectForm.startDate} onChange={(e) => setProjectForm((p) => ({ ...p, startDate: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 outline-none text-slate-900 font-medium" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Due Date</label>
                            <input type="date" value={projectForm.dueDate} onChange={(e) => setProjectForm((p) => ({ ...p, dueDate: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 outline-none text-slate-900 font-medium" />
                          </div>
                        </div>
                        {/* Milestones */}
                        <div className="sm:col-span-2 space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Milestones</label>
                            <button type="button" onClick={() => setProjectForm((p) => ({ ...p, milestones: [...p.milestones, { title: '', completed: false, dueDate: '' }] }))} className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                              <Plus className="w-3 h-3" /> Add
                            </button>
                          </div>
                          {projectForm.milestones.map((m, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <button type="button" onClick={() => toggleMilestone(i)} className="shrink-0 text-primary-500">{m.completed ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}</button>
                              <input value={m.title} onChange={(e) => setProjectForm((p) => ({ ...p, milestones: p.milestones.map((x, j) => j === i ? { ...x, title: e.target.value } : x) }))} placeholder="Milestone title" className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium outline-none focus:border-primary-400" />
                              <input type="date" value={m.dueDate} onChange={(e) => setProjectForm((p) => ({ ...p, milestones: p.milestones.map((x, j) => j === i ? { ...x, dueDate: e.target.value } : x) }))} className="w-32 px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:border-primary-400" />
                              <button type="button" onClick={() => setProjectForm((p) => ({ ...p, milestones: p.milestones.filter((_, j) => j !== i) }))} className="text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          ))}
                        </div>
                      </div>
                      {projectError && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{projectError}</p>}
                      <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={projectSaving} className="px-5 py-2.5 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-50 text-sm flex items-center gap-2">
                          {projectSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                          {editingProject ? 'Save Changes' : 'Create Project'}
                        </button>
                        <button type="button" onClick={() => { setShowProjectForm(false); setEditingProject(null); }} className="px-5 py-2.5 rounded-xl border border-primary-200 text-primary-700 font-semibold hover:bg-primary-50 text-sm">Cancel</button>
                      </div>
                    </form>
                  </div>
                )}

                {projectsLoading ? (
                  <div className="admin-card-glass rounded-2xl flex items-center justify-center py-16"><div className="w-10 h-10 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" /></div>
                ) : projects.length === 0 && !showProjectForm ? (
                  <div className="admin-card-glass rounded-2xl flex flex-col items-center justify-center py-20 text-center px-4">
                    <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-6"><FolderKanban className="w-10 h-10 text-primary-400" /></div>
                    <h3 className="text-xl font-bold text-primary-950 mb-2">No projects yet</h3>
                    <p className="text-primary-700/80 max-w-sm mb-6">Create your first project and assign it to a client.</p>
                    <button type="button" onClick={openNewProject} className="px-6 py-3 rounded-full bg-primary-600 text-white font-semibold hover:bg-primary-700 shadow-lg shadow-primary-500/25">Create Project</button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {projects.map((p) => {
                      const statusColors = { planning: 'bg-slate-100 text-slate-700 border-slate-200', 'in-progress': 'bg-blue-50 text-blue-700 border-blue-200', review: 'bg-amber-50 text-amber-700 border-amber-200', completed: 'bg-emerald-50 text-emerald-700 border-emerald-200', 'on-hold': 'bg-red-50 text-red-700 border-red-200' };
                      const completedMilestones = (p.milestones || []).filter((m) => m.completed).length;
                      return (
                        <div key={p._id} className="admin-card-glass rounded-2xl p-5 sm:p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 flex-wrap mb-1">
                                <h3 className="font-bold text-primary-950 text-base">{p.title}</h3>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${statusColors[p.status] || statusColors.planning}`}>{p.status}</span>
                              </div>
                              {p.description && <p className="text-sm text-primary-600/80 mb-2">{p.description}</p>}
                              <div className="flex items-center gap-4 flex-wrap text-xs text-primary-500">
                                {p.clientEmail && <span className="flex items-center gap-1"><User className="w-3 h-3" />{p.clientName || p.clientEmail}</span>}
                                {p.dueDate && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Due {new Date(p.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}</span>}
                                {p.milestones?.length > 0 && <span>{completedMilestones}/{p.milestones.length} milestones</span>}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button type="button" onClick={() => openEditProject(p)} className="p-2 rounded-lg text-primary-500 hover:bg-primary-50 transition-colors"><Edit3 className="w-4 h-4" /></button>
                              <button type="button" onClick={() => handleDeleteProject(p._id)} className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </div>
                          <div className="mt-4">
                            <div className="flex justify-between text-xs text-primary-500 mb-1.5">
                              <span>Progress</span><span className="font-bold text-primary-700">{p.progress}%</span>
                            </div>
                            <div className="h-2 bg-primary-100 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full transition-all duration-700 ${p.progress === 100 ? 'bg-emerald-500' : 'bg-primary-500'}`} style={{ width: `${p.progress}%` }} />
                            </div>
                          </div>
                          {p.milestones?.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {p.milestones.map((m, i) => (
                                <span key={i} className={`text-xs px-2.5 py-1 rounded-full border flex items-center gap-1 ${m.completed ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                                  {m.completed ? <CheckSquare className="w-3 h-3" /> : <Square className="w-3 h-3" />} {m.title}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── Announcements ── */}
            {activeSection === 'announcements' && (
              <div className="space-y-6 animate-fade-in-up">
                {/* Create form */}
                <div className="admin-card-glass rounded-2xl p-5 sm:p-6 border border-primary-200/60">
                  <h2 className="text-base font-bold text-primary-950 mb-5 flex items-center gap-2"><Megaphone className="w-5 h-5 text-primary-500" />Post Announcement</h2>
                  <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Title *</label>
                      <input value={annForm.title} onChange={(e) => setAnnForm((p) => ({ ...p, title: e.target.value }))} placeholder="Announcement title" required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none font-medium text-slate-900" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Content *</label>
                      <textarea value={annForm.content} onChange={(e) => setAnnForm((p) => ({ ...p, content: e.target.value }))} rows={3} placeholder="Write your announcement…" required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none font-medium text-slate-900 resize-none" />
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <label className="flex items-center gap-2 text-sm font-medium text-primary-700 cursor-pointer">
                        <input type="checkbox" checked={annForm.pinned} onChange={(e) => setAnnForm((p) => ({ ...p, pinned: e.target.checked }))} className="w-4 h-4 accent-primary-600" />
                        Pin to top
                      </label>
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Audience:</label>
                        <div className="relative">
                          <select value={annForm.audience} onChange={(e) => setAnnForm((p) => ({ ...p, audience: e.target.value }))} className="appearance-none px-3 py-1.5 pr-8 rounded-lg border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 outline-none focus:border-primary-500">
                            <option value="all">All Clients</option>
                            {clients.map((c) => <option key={c._id} value={c.email}>{c.name || c.email}</option>)}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                    {annError && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{annError}</p>}
                    <button type="submit" disabled={annSaving} className="px-5 py-2.5 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-50 text-sm flex items-center gap-2">
                      {annSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Megaphone className="w-4 h-4" />}
                      Post Announcement
                    </button>
                  </form>
                </div>

                {/* List */}
                {announcementsLoading ? (
                  <div className="admin-card-glass rounded-2xl flex items-center justify-center py-12"><div className="w-10 h-10 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" /></div>
                ) : announcements.length === 0 ? (
                  <div className="admin-card-glass rounded-2xl flex flex-col items-center justify-center py-16 text-center px-4">
                    <Megaphone className="w-12 h-12 text-primary-300 mb-4" />
                    <p className="font-semibold text-primary-950 text-lg">No announcements yet</p>
                    <p className="text-primary-600/70 text-sm mt-1">Post your first announcement above.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {announcements.map((a) => (
                      <div key={a._id} className={`admin-card-glass rounded-2xl p-5 border ${a.pinned ? 'border-primary-300 bg-primary-50/30' : 'border-primary-100'}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              {a.pinned && <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 bg-primary-100 px-2 py-0.5 rounded-full flex items-center gap-1"><Pin className="w-2.5 h-2.5" />Pinned</span>}
                              {a.audience !== 'all' && <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">Private: {a.audience}</span>}
                              <h3 className="font-bold text-primary-950">{a.title}</h3>
                            </div>
                            <p className="text-sm text-primary-700/80 mt-1 whitespace-pre-wrap">{a.content}</p>
                            <p className="text-xs text-primary-400 mt-2">{new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                          <button type="button" onClick={() => handleDeleteAnnouncement(a._id)} className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors shrink-0"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Section */}
            {activeSection === 'settings' && (
              <div className="space-y-6 animate-fade-in-up max-w-lg">
                {/* Change Password */}
                <div className="admin-card-glass rounded-2xl p-5 sm:p-8">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-primary-100">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-primary-950">Change Password</h2>
                      <p className="text-xs text-primary-500 mt-0.5">Update your admin account password</p>
                    </div>
                  </div>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Current Password</label>
                      <input type="password" value={changePwForm.currentPassword} onChange={(e) => setChangePwForm((p) => ({ ...p, currentPassword: e.target.value }))} required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none font-medium text-slate-900" placeholder="Enter current password" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">New Password</label>
                      <input type="password" value={changePwForm.newPassword} onChange={(e) => setChangePwForm((p) => ({ ...p, newPassword: e.target.value }))} required minLength={8} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none font-medium text-slate-900" placeholder="Min 8 characters" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Confirm New Password</label>
                      <input type="password" value={changePwForm.confirmPassword} onChange={(e) => setChangePwForm((p) => ({ ...p, confirmPassword: e.target.value }))} required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none font-medium text-slate-900" placeholder="Repeat new password" />
                    </div>
                    {changePwError && <p className="text-sm text-red-600 flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" />{changePwError}</p>}
                    {changePwSuccess && <p className="text-sm text-emerald-600 flex items-center gap-2"><CheckCircle className="w-4 h-4 shrink-0" />{changePwSuccess}</p>}
                    <button type="submit" disabled={changePwLoading} className="w-full py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors">
                      {changePwLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Lock className="w-4 h-4" />}
                      Change Password
                    </button>
                  </form>
                </div>

                {/* Account Info card */}
                <div className="admin-card-glass rounded-2xl p-5 sm:p-8">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-primary-100">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-primary-950">Account Info</h2>
                      <p className="text-xs text-primary-500 mt-0.5">Your admin account details</p>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between py-2 border-b border-primary-50">
                      <span className="text-slate-500 font-medium">Role</span>
                      <span className="font-bold text-primary-700 bg-primary-50 px-3 py-1 rounded-full text-xs uppercase tracking-wider">Admin</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-slate-500 font-medium">Total Invoices</span>
                      <span className="font-bold text-primary-950">{invoices.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}


          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, helper, trend, trendUp, tone = 'default' }) {
  const toneStyles =
    tone === 'success'
      ? { bg: 'bg-primary-50/60', border: 'border-primary-200', iconBg: 'bg-primary-100', iconColor: 'text-primary-600' }
      : tone === 'warning'
      ? { bg: 'bg-amber-50/50', border: 'border-amber-200', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' }
      : { bg: 'bg-white', border: 'border-primary-200/60', iconBg: 'bg-primary-50', iconColor: 'text-primary-600' };

  return (
    <div className={`admin-card-glass rounded-2xl border ${toneStyles.border} ${toneStyles.bg} p-4 sm:p-6 group min-w-0`}>
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${toneStyles.iconBg} flex items-center justify-center ${toneStyles.iconColor} transition-transform group-hover:scale-105 duration-300 shrink-0`}>
          {Icon && <Icon className="w-5 h-5 sm:w-6 sm:h-6" />}
        </div>
        {trend && (
          <div className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shrink-0 ${trendUp ? 'bg-primary-100 text-primary-700' : 'bg-red-100 text-red-700'}`}>
            {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
            {trend}
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-xs sm:text-sm font-medium text-primary-700/80 mb-1 truncate">{label}</p>
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary-950 tracking-tight mb-2 break-words">{value}</h3>
        {helper && <p className="text-xs text-primary-600/70 font-medium truncate">{helper}</p>}
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  let styles = 'bg-primary-100/60 text-primary-700 border-primary-200';
  let dotColor = 'bg-primary-500';
  if (status === 'paid') {
    styles = 'bg-primary-50 text-primary-700 border-primary-200';
    dotColor = 'bg-primary-500';
  }
  if (status === 'overdue') {
    styles = 'bg-red-50 text-red-700 border-red-200';
    dotColor = 'bg-red-500';
  }
  if (status === 'unpaid') {
    styles = 'bg-amber-50 text-amber-700 border-amber-200';
    dotColor = 'bg-amber-500';
  }
  const label = status === 'paid' ? 'Paid' : status === 'overdue' ? 'Overdue' : status === 'unpaid' ? 'Unpaid' : status;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${styles}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {label}
    </span>
  );
}
