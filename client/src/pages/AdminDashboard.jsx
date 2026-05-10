import { useEffect, useMemo, useRef, useState } from 'react';
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
  ImagePlus,
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
  Edit3,
  User,
  Lock,
  CheckSquare,
  Square,
  Flag,
  XCircle,
  MessageSquare,
  Mail,
  Send,
  Sparkles,
  ExternalLink,
  BookOpen,
  Globe,
} from 'lucide-react';
import { downloadInvoicePdf } from '../utils/invoicePdf.js';
import { downloadQuotationPdf } from '../utils/quotationPdf.js';
import {
  getMonthlyDefaultRemarks,
  getQuotationMonthlyRemarks,
  buildInvoiceRemarkPreset,
  buildQuotationRemarkPreset,
  INVOICE_REMARK_CHIPS,
  QUOTATION_REMARK_CHIPS,
} from '../utils/documentRemarks.js';
import DashboardNavbar from '../components/DashboardNavbar';
import AdminDesktopTopBar from '../components/AdminDesktopTopBar';
import { useAdminNotifications } from '../hooks/useAdminNotifications';
import AdminHiringSection from '../components/AdminHiringSection';
import AdminReportsSection from '../components/AdminReportsSection';
import AdminRevenueChart from '../components/AdminRevenueChart';
import API_BASE from '../config/api';
import { getAuthHeaders, clearAuthToken } from '../config/auth';
import { services } from '../data/services';

const emptyItem = { description: '', quantity: 1, price: 0 };
const emptyTerm = { label: '', percentage: '', dueDate: '', status: 'due', partialAmount: '' };
const PAYMENT_TERM_STATUSES = [
  { value: 'due', label: 'Due' },
  { value: 'paid', label: 'Paid' },
  { value: 'partially_paid', label: 'Partially Paid' },
  { value: 'overdue', label: 'Overdue' },
];

const PAYMENT_PRESETS = [
  { label: '100%', terms: [{ label: 'Full Payment', percentage: 100, dueDate: '', status: 'due', partialAmount: '' }] },
  { label: '50/50', terms: [{ label: 'Advance', percentage: 50, dueDate: '', status: 'due', partialAmount: '' }, { label: 'Final', percentage: 50, dueDate: '', status: 'due', partialAmount: '' }] },
  { label: '30/30/40', terms: [{ label: 'Advance', percentage: 30, dueDate: '', status: 'due', partialAmount: '' }, { label: 'Milestone', percentage: 30, dueDate: '', status: 'due', partialAmount: '' }, { label: 'Final', percentage: 40, dueDate: '', status: 'due', partialAmount: '' }] },
  { label: '25/25/50', terms: [{ label: 'Advance', percentage: 25, dueDate: '', status: 'due', partialAmount: '' }, { label: 'Milestone', percentage: 25, dueDate: '', status: 'due', partialAmount: '' }, { label: 'Final', percentage: 50, dueDate: '', status: 'due', partialAmount: '' }] },
  { label: '10/20/30/40', terms: [{ label: 'Booking', percentage: 10, dueDate: '', status: 'due', partialAmount: '' }, { label: 'Design', percentage: 20, dueDate: '', status: 'due', partialAmount: '' }, { label: 'Development', percentage: 30, dueDate: '', status: 'due', partialAmount: '' }, { label: 'Final', percentage: 40, dueDate: '', status: 'due', partialAmount: '' }] },
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
  const [navSearch, setNavSearch] = useState('');
  const { notifications, notifLoading, lastPolled } = useAdminNotifications(!!API_BASE);

  const adminToolbar = useMemo(
    () => ({
      navSearch,
      setNavSearch,
      notifications,
      notifLoading,
      lastPolled,
    }),
    [navSearch, setNavSearch, notifications, notifLoading, lastPolled],
  );

  const navItems = useMemo(
    () => [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard },
      { id: 'create', label: 'Create Invoice', icon: FilePlus },
      { id: 'invoices', label: 'Invoices', icon: FileText },
      { id: 'projects', label: 'Projects', icon: FolderKanban },
      { id: 'quotations', label: 'Quotation Generator', icon: FileText },
      { id: 'clients', label: 'Clients', icon: Users },
      { id: 'website', label: 'Website', icon: Globe },
      { id: 'reports', label: 'Reports', icon: BarChart2 },
      { id: 'hiring', label: 'Hiring', icon: UserPlus },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
    [],
  );

  // Invoice creation form state
  const [clientName, setClientName] = useState('');
  const [clientGst, setClientGst] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState('');
  const [invoiceStatus, setInvoiceStatus] = useState('unpaid');
  const [items, setItems] = useState([{ ...emptyItem }]);
  const [notes, setNotes] = useState('');
  const [editingInvoiceId, setEditingInvoiceId] = useState(null);

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

  // Quotation generator state
  const [quotationForm, setQuotationForm] = useState({
    clientName: '',
    companyName: 'Rastogi Codeworks',
    companyLogoDataUrl: '',
    clientLogoDataUrl: '',
    serviceId: '',
    projectTitle: '',
    billingAddress: '',
    quoteDate: new Date().toISOString().slice(0, 10),
    validUntil: '',
    deliveryDays: '',
    requirements: '',
    notes: '',
    items: [{ ...emptyItem }],
  });

  // Change password (in Settings section)
  const [changePwForm, setChangePwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [changePwLoading, setChangePwLoading] = useState(false);
  const [changePwError, setChangePwError] = useState('');
  const [changePwSuccess, setChangePwSuccess] = useState('');
  const [draggingLogoField, setDraggingLogoField] = useState('');

  // Workspace / email settings (Settings section)
  const [appSettings, setAppSettings] = useState(null);
  const [mailTransportConfigured, setMailTransportConfigured] = useState(false);
  const [appSettingsLoading, setAppSettingsLoading] = useState(false);
  const [appSettingsSaving, setAppSettingsSaving] = useState(false);
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [appSettingsMsg, setAppSettingsMsg] = useState({ type: '', text: '' });
  const [websiteMsg, setWebsiteMsg] = useState({ type: '', text: '' });
  const [websiteSaving, setWebsiteSaving] = useState(false);
  const [websiteUploading, setWebsiteUploading] = useState(false);
  const [websiteDeletingId, setWebsiteDeletingId] = useState(null);
  const websiteFileInputRef = useRef(null);

  const totals = useMemo(() => calculateInvoiceTotals(items), [items]);
  const quotationTotals = useMemo(() => calculateInvoiceTotals(quotationForm.items || []), [quotationForm.items]);

  useEffect(() => {
    if (editingInvoiceId) return;
    setNotes((prev) => (prev.trim() === '' ? getMonthlyDefaultRemarks(invoiceDate) : prev));
  }, [invoiceDate, editingInvoiceId]);

  useEffect(() => {
    setQuotationForm((prev) => {
      if ((prev.notes || '').trim() !== '') return prev;
      return { ...prev, notes: getQuotationMonthlyRemarks(prev.quoteDate) };
    });
  }, [quotationForm.quoteDate]);

  const applyInvoiceRemarkPreset = (presetId) => {
    const text = buildInvoiceRemarkPreset(presetId, { invoiceDate, dueDate, clientName });
    if (text) setNotes(text);
  };

  const applyQuotationRemarkPreset = (presetId) => {
    setQuotationForm((p) => {
      const text = buildQuotationRemarkPreset(presetId, { quoteDate: p.quoteDate, clientName: p.clientName });
      return text ? { ...p, notes: text } : p;
    });
  };

  const quotationServices = useMemo(
    () => (services || []).map((s) => ({ id: s.id, title: s.title, fullDesc: s.fullDesc || '' })),
    [],
  );
  const getServiceDefaultContent = (serviceId) => {
    const selected = (services || []).find((s) => s.id === serviceId);
    if (!selected) return null;
    const requirementsList = Array.isArray(selected.pricing?.included) && selected.pricing.included.length > 0
      ? selected.pricing.included.map((line) => `- ${line}`).join('\n')
      : Array.isArray(selected.features) && selected.features.length > 0
        ? selected.features.map((line) => `- ${line}`).join('\n')
        : '';
    const assumptions = Array.isArray(selected.pricing?.extras) && selected.pricing.extras.length > 0
      ? selected.pricing.extras.map((line) => `- ${line}`).join('\n')
      : '';
    const requirements = [selected.fullDesc || '', requirementsList].filter(Boolean).join('\n\n');
    const notes = [
      selected.pricing?.summary || '',
      selected.pricing?.model ? `Engagement Model: ${selected.pricing.model}` : '',
      selected.pricing?.note ? `Commercial Note: ${selected.pricing.note}` : '',
      assumptions ? `Assumptions:\n${assumptions}` : '',
    ].filter(Boolean).join('\n\n');
    return {
      projectTitle: selected.title || '',
      requirements,
      notes,
    };
  };

  const handleQuotationItemChange = (index, field, value) => {
    setQuotationForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (
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
          : item
      )),
    }));
  };

  const addQuotationItem = () => {
    setQuotationForm((prev) => ({ ...prev, items: [...prev.items, { ...emptyItem }] }));
  };

  const removeQuotationItem = (index) => {
    setQuotationForm((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  };

  const handleDownloadQuotation = async (e) => {
    e?.preventDefault?.();
    const payloadItems = (quotationForm.items || []).filter((i) => i.description || i.quantity || i.price);
    if (!quotationForm.clientName.trim()) {
      setError('Quotation client name is required.');
      return;
    }
    if (payloadItems.length === 0) {
      setError('Add at least one quotation item.');
      return;
    }
    try {
      await downloadQuotationPdf({
        clientName: quotationForm.clientName.trim(),
        companyName: quotationForm.companyName.trim(),
        companyLogoDataUrl: quotationForm.companyLogoDataUrl || '',
        clientLogoDataUrl: quotationForm.clientLogoDataUrl || '',
        projectTitle: quotationForm.projectTitle.trim(),
        billingAddress: quotationForm.billingAddress.trim() || undefined,
        quoteDate: quotationForm.quoteDate,
        validUntil: quotationForm.validUntil,
        deliveryDays: quotationForm.deliveryDays,
        requirements: quotationForm.requirements,
        items: payloadItems,
        notes: quotationForm.notes,
        totals: quotationTotals,
      });
    } catch (err) {
      setError(err?.message || 'Failed to generate quotation PDF.');
    }
  };

  const handleQuotationLogoFile = (field, file) => {
    if (!file) return;
    if (!String(file.type || '').startsWith('image/')) {
      setError('Please upload an image file only.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setQuotationForm((prev) => ({ ...prev, [field]: String(reader.result || '') }));
    };
    reader.readAsDataURL(file);
  };
  const handleQuotationLogoUpload = (field) => (e) => {
    const file = e.target.files?.[0];
    handleQuotationLogoFile(field, file);
  };
  const handleQuotationLogoDragOver = (field) => (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDraggingLogoField(field);
  };
  const handleQuotationLogoDrop = (field) => (e) => {
    e.preventDefault();
    setDraggingLogoField('');
    const file = e.dataTransfer.files?.[0];
    handleQuotationLogoFile(field, file);
  };
  const handleQuotationLogoDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDraggingLogoField('');
    }
  };
  const clearQuotationLogo = (field) => {
    setQuotationForm((prev) => ({ ...prev, [field]: '' }));
  };

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
  const [linkedPartialInvoiceId, setLinkedPartialInvoiceId] = useState('');
  const [paymentTerms, setPaymentTerms] = useState([]);
  const [showPaymentTerms, setShowPaymentTerms] = useState(false);
  /** Stable draft invoice suffix for live preview (new invoice); regenerated on Clear. */
  const draftInvoiceNoRef = useRef(Date.now().toString().slice(-6));

  const addPaymentTerm = () => setPaymentTerms((prev) => [...prev, { ...emptyTerm }]);
  const removePaymentTerm = (i) => setPaymentTerms((prev) => prev.filter((_, idx) => idx !== i));
  const handleTermChange = (i, field, value) => {
    setPaymentTerms((prev) => prev.map((t, idx) => {
      if (idx !== i) return t;
      if (field === 'status') {
        return { ...t, status: value, partialAmount: value === 'partially_paid' ? t.partialAmount : '' };
      }
      return { ...t, [field]: value };
    }));
  };
  const applyPreset = (preset) => {
    setPaymentTerms(preset.terms.map((t) => ({ ...t })));
    setShowPaymentTerms(true);
  };
  const termsTotalPct = paymentTerms.reduce((s, t) => s + (Number(t.percentage) || 0), 0);
  const hasPaymentTerms = paymentTerms.some((t) => Number(t?.percentage) > 0);
  const paidAmountFromTerms = useMemo(() => {
    const invoiceTotal = Number(totals.total) || 0;
    if (invoiceTotal <= 0 || !hasPaymentTerms) return 0;
    return paymentTerms.reduce((sum, term) => {
      const pct = Number(term?.percentage) || 0;
      if (pct <= 0) return sum;
      const termAmount = invoiceTotal * pct / 100;
      const termStatus = String(term?.status || 'due');
      if (termStatus === 'paid') return sum + termAmount;
      if (termStatus === 'partially_paid') {
        const partial = Number(term?.partialAmount) || 0;
        return sum + Math.min(Math.max(partial, 0), termAmount);
      }
      return sum;
    }, 0);
  }, [hasPaymentTerms, paymentTerms, totals.total]);
  const autoInvoiceStatus = useMemo(() => {
    if (!hasPaymentTerms) return null;
    const invoiceTotal = Number(totals.total) || 0;
    if (invoiceTotal <= 0) return 'unpaid';
    if (paidAmountFromTerms <= 0) return 'unpaid';
    if (paidAmountFromTerms >= invoiceTotal - 0.01) return 'paid';
    return 'partially_paid';
  }, [hasPaymentTerms, paidAmountFromTerms, totals.total]);
  useEffect(() => {
    if (!autoInvoiceStatus) return;
    setInvoiceStatus(autoInvoiceStatus);
  }, [autoInvoiceStatus]);
  useEffect(() => {
    if (!(invoiceStatus === 'partially_paid' || invoiceStatus === 'paid') && linkedPartialInvoiceId) {
      setLinkedPartialInvoiceId('');
    }
  }, [invoiceStatus, linkedPartialInvoiceId]);
  const linkedClientPreviousDue = useMemo(() => {
    const selectedEmail = String(invoiceClientEmail || '').trim().toLowerCase();
    if (!selectedEmail) return 0;
    return invoices.reduce((sum, inv) => {
      if (editingInvoiceId && String(inv._id) === String(editingInvoiceId)) return sum;
      const invEmail = String(inv.clientEmail || '').trim().toLowerCase();
      if (invEmail !== selectedEmail) return sum;
      if (inv.status === 'paid') return sum;
      return sum + (Number(inv.balanceDue ?? inv.total) || 0);
    }, 0);
  }, [invoices, invoiceClientEmail, editingInvoiceId]);
  const linkableClientInvoices = useMemo(() => {
    const selectedEmail = String(invoiceClientEmail || '').trim().toLowerCase();
    if (!selectedEmail) return [];
    return invoices.filter((inv) => {
      if (editingInvoiceId && String(inv._id) === String(editingInvoiceId)) return false;
      const invEmail = String(inv.clientEmail || '').trim().toLowerCase();
      return invEmail === selectedEmail && inv.status !== 'paid';
    });
  }, [invoices, invoiceClientEmail, editingInvoiceId]);
  const invoiceTotal = Number(totals.total) || 0;
  const settledOnCurrentInvoice = hasPaymentTerms
    ? Math.min(invoiceTotal, paidAmountFromTerms)
    : (invoiceStatus === 'paid' ? invoiceTotal : 0);
  const currentInvoiceOutstanding = Math.max(0, invoiceTotal - settledOnCurrentInvoice);
  const totalBalanceDue = linkedPartialInvoiceId
    ? Math.max(0, linkedClientPreviousDue - settledOnCurrentInvoice)
    : linkedClientPreviousDue + currentInvoiceOutstanding;

  const previewInvoiceRefLabel = editingInvoiceId
    ? `INV-${String(editingInvoiceId).slice(-6).toUpperCase()}`
    : `INV-${draftInvoiceNoRef.current}`;

  const previewHasLineItems = items.some(
    (it) => (it.description || '').trim() || Number(it.quantity) || Number(it.price),
  );
  const previewPaidInFull = invoiceStatus === 'paid' && totalBalanceDue <= 0;

  const resetForm = () => {
    draftInvoiceNoRef.current = Date.now().toString().slice(-6);
    const todayIso = new Date().toISOString().slice(0, 10);
    setClientName('');
    setClientGst('');
    setBillingAddress('');
    setInvoiceDate(todayIso);
    setDueDate('');
    setInvoiceStatus('unpaid');
    setItems([{ ...emptyItem }]);
    setNotes(getMonthlyDefaultRemarks(todayIso));
    setInvoiceClientEmail('');
    setLinkedPartialInvoiceId('');
    setPaymentTerms([]);
    setShowPaymentTerms(false);
    setEditingInvoiceId(null);
  };

  const handleCreateInvoice = (e) => {
    e?.preventDefault?.();
    if (!clientName.trim()) return;

    const payload = {
      clientName: clientName.trim(),
      clientEmail: invoiceClientEmail.trim() || undefined,
      billingAddress: billingAddress.trim() || undefined,
      gstNumber: clientGst.trim() || undefined,
      previousBalanceDue: linkedClientPreviousDue,
      balanceDue: totalBalanceDue,
      linkedPartialInvoiceId: linkedPartialInvoiceId || undefined,
      invoiceDate,
      dueDate,
      status: invoiceStatus,
      items: items.filter((i) => i.description || i.quantity || i.price),
      notes,
      paymentTerms: paymentTerms.filter((t) => Number(t.percentage) > 0),
    };

    setLoading(true);
    setError('');

    const isEdit = !!editingInvoiceId;
    fetch(isEdit ? `${API_BASE}/api/invoices/${editingInvoiceId}` : `${API_BASE}/api/invoices`, {
      method: isEdit ? 'PATCH' : 'POST',
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
          throw new Error(data.message || (isEdit ? 'Failed to update invoice' : 'Failed to create invoice'));
        }
        return res.json();
      })
      .then((data) => {
        if (data?.invoice) {
          setInvoices((prev) => (
            isEdit
              ? prev.map((inv) => (inv._id === data.invoice._id ? data.invoice : inv))
              : [data.invoice, ...prev]
          ));
          resetForm();
          setActiveSection('invoices');
        }
      })
      .catch((err) => {
        setError(err.message || (isEdit ? 'Something went wrong while updating the invoice.' : 'Something went wrong while creating the invoice.'));
      })
      .finally(() => setLoading(false));
  };

  const openEditInvoice = (inv) => {
    setEditingInvoiceId(inv._id);
    setClientName(inv.clientName || '');
    setClientGst(inv.gstNumber || '');
    setBillingAddress(inv.billingAddress || '');
    setInvoiceDate(inv.invoiceDate || new Date().toISOString().slice(0, 10));
    setDueDate(inv.dueDate || '');
    setInvoiceStatus(inv.status || 'unpaid');
    setItems((inv.items && inv.items.length > 0)
      ? inv.items.map((item) => ({
        description: item.description || '',
        quantity: Number(item.quantity) || 0,
        price: Number(item.price) || 0,
      }))
      : [{ ...emptyItem }]);
    setNotes(inv.notes || '');
    setInvoiceClientEmail(inv.clientEmail || '');
    setLinkedPartialInvoiceId(inv.linkedPartialInvoiceId || '');
    const normalizedTerms = Array.isArray(inv.paymentTerms)
      ? inv.paymentTerms.map((t) => ({
        label: t.label || '',
        percentage: t.percentage ?? '',
        dueDate: t.dueDate || '',
        status: t.status || 'due',
        partialAmount: t.partialAmount ?? '',
      }))
      : [];
    setPaymentTerms(normalizedTerms);
    setShowPaymentTerms(normalizedTerms.length > 0);
    setActiveSection('create');
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
      // Invoice aging: open invoices only when due date is today or past — days past due
      agingBuckets: (() => {
        const today = new Date();
        const buckets = { '0-30d': 0, '31-60d': 0, '61-90d': 0, '90d+': 0 };
        const amts = { '0-30d': 0, '31-60d': 0, '61-90d': 0, '90d+': 0 };
        invoices.filter((inv) => inv.status !== 'paid' && inv.dueDate).forEach((inv) => {
          const daysPast = Math.floor((today - new Date(inv.dueDate)) / 86400000);
          if (daysPast < 0) return;
          const out = Number(inv.balanceDue ?? inv.total) || 0;
          if (out <= 0) return;
          const key = daysPast <= 30 ? '0-30d' : daysPast <= 60 ? '31-60d' : daysPast <= 90 ? '61-90d' : '90d+';
          buckets[key]++;
          amts[key] += out;
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
        status: invoiceStatus,
        totals: { ...totals, previousBalanceDue: linkedClientPreviousDue, balanceDue: totalBalanceDue },
        paymentTerms: paymentTerms.filter((t) => Number(t.percentage) > 0),
        invoiceId: `INV-${Date.now().toString().slice(-6)}`,
      });
    } catch (err) {
      setError(err?.message || 'Failed to generate PDF.');
    } finally {
      setPdfLoading(false);
    }
  };

  const handleDownloadInstallmentPdf = async (term, index) => {
    try {
      const invoiceTotal = Number(totals.total) || 0;
      const pct = Number(term?.percentage) || 0;
      const installmentAmount = invoiceTotal * pct / 100;
      const status = String(term?.status || 'due');
      const partialAmount = Math.max(0, Number(term?.partialAmount) || 0);
      const settled = status === 'paid'
        ? installmentAmount
        : status === 'partially_paid'
          ? Math.min(partialAmount, installmentAmount)
          : 0;
      const installmentOutstanding = Math.max(0, installmentAmount - settled);

      await downloadInvoicePdf({
        clientName: clientName || 'Client Name',
        billingAddress: billingAddress.trim() || undefined,
        gstNumber: clientGst.trim() || undefined,
        invoiceDate,
        dueDate: term?.dueDate || dueDate,
        items: [{
          description: term?.label || `Installment ${index + 1}`,
          quantity: 1,
          price: installmentAmount,
        }],
        notes: `${notes || ''}${notes ? '\n\n' : ''}Installment status: ${status.replace(/_/g, ' ')}`,
        totals: {
          subtotal: installmentAmount,
          total: installmentAmount,
          previousBalanceDue: 0,
          balanceDue: installmentOutstanding,
        },
        paymentTerms: [{
          label: term?.label || `Installment ${index + 1}`,
          // Installment invoice represents this single term as 100% of itself.
          percentage: 100,
          dueDate: term?.dueDate || '',
          status,
          partialAmount: settled,
        }],
        status: status === 'paid' ? 'paid' : status === 'partially_paid' ? 'partially_paid' : 'unpaid',
        invoiceId: `INST-${Date.now().toString().slice(-6)}`,
      });
    } catch (err) {
      setError(err?.message || 'Failed to download installment invoice.');
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
        status: inv.status,
        totals: {
          subtotal: inv.subtotal ?? inv.total ?? 0,
          total: inv.total ?? 0,
          previousBalanceDue: inv.previousBalanceDue ?? 0,
          balanceDue: inv.balanceDue ?? inv.total ?? 0,
        },
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

  // Fetch clients when opening Clients section, Create Invoice, Projects, or Quotations (for dropdowns)
  useEffect(() => {
    if (activeSection !== 'clients' && activeSection !== 'create' && activeSection !== 'projects' && activeSection !== 'quotations') return;
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

  useEffect(() => {
    if (!API_BASE || (activeSection !== 'settings' && activeSection !== 'website')) return;
    let cancelled = false;
    setAppSettingsLoading(true);
    setAppSettingsMsg({ type: '', text: '' });
    setWebsiteMsg({ type: '', text: '' });
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/settings/app`, {
          headers: getAuthHeaders(),
          credentials: 'include',
        });
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok) throw new Error(data.message || 'Failed to load settings');
        const sc = data.settings?.siteContent && typeof data.settings.siteContent === 'object'
          ? data.settings.siteContent
          : {};
        setAppSettings({
          ...data.settings,
          siteContent: {
            heroHeadline: '',
            heroSubtext: '',
            heroTrustLine: '',
            seoHomeDescription: '',
            heroBackgroundImage: '',
            ...sc,
          },
        });
        setMailTransportConfigured(!!data.mailTransportConfigured);
      } catch (err) {
        if (!cancelled) {
          setAppSettingsMsg({ type: 'error', text: err.message || 'Failed to load email settings.' });
          setWebsiteMsg({ type: 'error', text: err.message || 'Failed to load workspace settings.' });
        }
      } finally {
        if (!cancelled) setAppSettingsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeSection]);

  const updateAppSetting = (key, value) => {
    setAppSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSaveAppSettings = async (e) => {
    e.preventDefault();
    if (!API_BASE || !appSettings) return;
    setAppSettingsSaving(true);
    setAppSettingsMsg({ type: '', text: '' });
    try {
      const res = await fetch(`${API_BASE}/api/settings/app`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
        body: JSON.stringify(appSettings),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to save');
      setAppSettings(data.settings);
      setMailTransportConfigured(!!data.mailTransportConfigured);
      setAppSettingsMsg({ type: 'success', text: 'Email settings saved.' });
    } catch (err) {
      setAppSettingsMsg({ type: 'error', text: err.message || 'Save failed.' });
    } finally {
      setAppSettingsSaving(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!API_BASE) return;
    setTestEmailLoading(true);
    setAppSettingsMsg({ type: '', text: '' });
    try {
      const res = await fetch(`${API_BASE}/api/settings/app/test-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
        body: JSON.stringify({}),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Test send failed');
      setAppSettingsMsg({ type: 'success', text: data.message || 'Test email sent.' });
    } catch (err) {
      setAppSettingsMsg({ type: 'error', text: err.message || 'Test send failed.' });
    } finally {
      setTestEmailLoading(false);
    }
  };

  const updateSiteContentField = (key, value) => {
    setAppSettings((prev) => {
      if (!prev) return prev;
      const sc = prev.siteContent && typeof prev.siteContent === 'object' ? prev.siteContent : {};
      return { ...prev, siteContent: { ...sc, [key]: value } };
    });
  };

  const handleSaveWebsiteContent = async (e) => {
    e?.preventDefault?.();
    if (!API_BASE || !appSettings) return;
    setWebsiteSaving(true);
    setWebsiteMsg({ type: '', text: '' });
    try {
      const res = await fetch(`${API_BASE}/api/settings/app`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
        body: JSON.stringify({ siteContent: appSettings.siteContent || {} }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to save');
      const sc = data.settings?.siteContent && typeof data.settings.siteContent === 'object'
        ? data.settings.siteContent
        : {};
      setAppSettings({
        ...data.settings,
        siteContent: {
          heroHeadline: '',
          heroSubtext: '',
          heroTrustLine: '',
          seoHomeDescription: '',
          heroBackgroundImage: '',
          ...sc,
        },
      });
      setMailTransportConfigured(!!data.mailTransportConfigured);
      setWebsiteMsg({ type: 'success', text: 'Website content saved. The homepage will use these values when published.' });
    } catch (err) {
      setWebsiteMsg({ type: 'error', text: err.message || 'Save failed.' });
    } finally {
      setWebsiteSaving(false);
    }
  };

  const handleWebsiteFileSelected = async (e) => {
    const file = e.target?.files?.[0];
    e.target.value = '';
    if (!file || !API_BASE) return;
    setWebsiteUploading(true);
    setWebsiteMsg({ type: '', text: '' });
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${API_BASE}/api/settings/app/media`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      const sc = data.settings?.siteContent && typeof data.settings.siteContent === 'object'
        ? data.settings.siteContent
        : {};
      setAppSettings({
        ...data.settings,
        siteContent: {
          heroHeadline: '',
          heroSubtext: '',
          heroTrustLine: '',
          seoHomeDescription: '',
          heroBackgroundImage: '',
          ...sc,
        },
      });
      setMailTransportConfigured(!!data.mailTransportConfigured);
      setWebsiteMsg({ type: 'success', text: 'Image uploaded. Copy the URL or assign it as the hero background.' });
    } catch (err) {
      setWebsiteMsg({ type: 'error', text: err.message || 'Upload failed.' });
    } finally {
      setWebsiteUploading(false);
    }
  };

  const handleDeleteWebsiteImage = async (id) => {
    if (!API_BASE || !id) return;
    if (!window.confirm('Remove this image from the library? Links using it may break.')) return;
    setWebsiteDeletingId(id);
    setWebsiteMsg({ type: '', text: '' });
    try {
      const res = await fetch(`${API_BASE}/api/settings/app/media/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Delete failed');
      const sc = data.settings?.siteContent && typeof data.settings.siteContent === 'object'
        ? data.settings.siteContent
        : {};
      setAppSettings({
        ...data.settings,
        siteContent: {
          heroHeadline: '',
          heroSubtext: '',
          heroTrustLine: '',
          seoHomeDescription: '',
          heroBackgroundImage: '',
          ...sc,
        },
      });
      setMailTransportConfigured(!!data.mailTransportConfigured);
      setWebsiteMsg({ type: 'success', text: 'Image removed.' });
    } catch (err) {
      setWebsiteMsg({ type: 'error', text: err.message || 'Delete failed.' });
    } finally {
      setWebsiteDeletingId(null);
    }
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

  return (
    <div className="admin-dashboard min-h-screen flex flex-col lg:flex-row lg:items-stretch font-sans text-primary-900 antialiased bg-gradient-to-br from-primary-50/40 via-white to-primary-50/20">
      <DashboardNavbar
        variant="admin"
        navItems={navItems}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogout={handleLogout}
        onNewInvoice={() => setActiveSection('create')}
        adminToolbar={adminToolbar}
      />

      <div className="flex flex-1 min-h-0 min-w-0 overflow-hidden flex-col">
        <AdminDesktopTopBar
          navSearch={navSearch}
          setNavSearch={setNavSearch}
          notifications={notifications}
          notifLoading={notifLoading}
          lastPolled={lastPolled}
          setActiveSection={setActiveSection}
        />
        <main className="flex-1 min-w-0 overflow-y-auto admin-scroll">
          <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 md:py-10">
            
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6 mb-6 sm:mb-10">
              <div className="min-w-0 flex-1">
                <h1 className="section-heading text-primary-950 mb-2 text-2xl sm:text-3xl md:text-4xl">
                  {activeSection === 'overview' && 'Dashboard'}
                  {activeSection === 'create' && 'New Invoice'}
                  {activeSection === 'invoices' && 'Invoices & Payments'}
                  {activeSection === 'projects' && 'Projects'}
                  {activeSection === 'quotations' && 'Quotation Generator'}
                  {activeSection === 'clients' && 'Clients'}
                  {activeSection === 'website' && 'Website'}
                  {activeSection === 'reports' && 'Reports'}
                  {activeSection === 'hiring' && 'Hiring & team'}
                  {activeSection === 'settings' && 'Settings'}
                </h1>
                <p className="section-sub text-primary-700/90 max-w-2xl">
                  {activeSection === 'overview' && 'Welcome back. Here is what’s happening with your business today.'}
                  {activeSection === 'create' && 'Create and send professional invoices to your clients in seconds.'}
                  {activeSection === 'invoices' && 'Manage your billing history, track payments, and handle overdue accounts.'}
                  {activeSection === 'projects' && 'Create and manage projects assigned to your clients.'}
                  {activeSection === 'quotations' && 'Create and download client quotations with line items and terms.'}
                  {activeSection === 'clients' && 'Manage your client relationships and project details.'}
                  {activeSection === 'website' && 'Update homepage copy and manage images served from your API (live site reads public content).'}
                  {activeSection === 'reports' && 'Export a consolidated business snapshot: revenue, invoices, hiring, and tasks.'}
                  {activeSection === 'hiring' && 'Post roles, track candidates, invite employees, and assign internal tasks.'}
                  {activeSection === 'settings' && 'Configure your workspace preferences and billing details.'}
                </p>
              </div>

              {activeSection === 'overview' && (
                <div className="w-full sm:w-auto shrink-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:min-w-[16rem]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary-600 mb-3 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-primary-500" />
                    Quick links
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'invoices', label: 'Invoices', icon: FileText },
                      { id: 'reports', label: 'Reports', icon: BarChart2 },
                    ].map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setActiveSection(id)}
                        title={label}
                        className="group flex min-h-[3.75rem] w-full min-w-0 flex-col items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/90 px-3 py-2.5 text-center shadow-sm transition-colors hover:border-primary-400 hover:bg-primary-50 hover:shadow-md"
                      >
                        <Icon className="h-4 w-4 shrink-0 text-primary-600 transition-transform group-hover:scale-110" aria-hidden />
                        <span className="text-xs font-semibold leading-snug text-primary-900">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'projects' && (
                <button type="button" onClick={openNewProject} className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors shadow-md shadow-primary-500/20 shrink-0 lg:self-center">
                  <Plus className="w-4 h-4" /> New Project
                </button>
              )}

              {activeSection === 'invoices' && (
                 <div className="flex flex-wrap items-center gap-1 p-1.5 rounded-full bg-white/80 border border-primary-200/60 shadow-sm w-full sm:w-auto lg:self-center">
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

                  {/* Revenue trend (6-month area chart) */}
                  <div className="lg:col-span-2 admin-card-glass rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-primary-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <BarChart2 className="w-5 h-5 text-primary-500" />
                        <div>
                          <h2 className="text-base font-bold text-primary-950">Revenue trend</h2>
                          <p className="text-xs text-primary-600 mt-0.5">Billed amount by invoice date · last 6 months</p>
                        </div>
                      </div>
                      {!loading && overviewStats.maxMonthlyRevenue > 1 && (
                        <p className="text-xs font-semibold text-primary-700 tabular-nums">
                          Peak month: Rs.{' '}
                          {Math.max(...overviewStats.monthlyData.map((m) => m.revenue)).toLocaleString('en-IN', {
                            maximumFractionDigits: 0,
                          })}
                        </p>
                      )}
                    </div>
                    <div className="px-3 sm:px-5 py-4 sm:py-5">
                      {loading ? (
                        <AdminRevenueChart data={[]} loading={true} />
                      ) : overviewStats.maxMonthlyRevenue === 1 ? (
                        <div className="flex items-center justify-center h-40 text-primary-400 text-sm rounded-xl border border-dashed border-primary-200 bg-primary-50/30">
                          No invoice data yet — chart will appear once you record revenue.
                        </div>
                      ) : (
                        <AdminRevenueChart
                          data={overviewStats.monthlyData}
                          loading={false}
                          maxRevenue={overviewStats.maxMonthlyRevenue}
                        />
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
                  {/* Invoice Aging: open balance past due date, by days overdue */}
                  <div className="lg:col-span-2 rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mb-1">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                          <Clock className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <h2 className="text-base font-bold text-primary-950 leading-tight">
                            Invoice Aging (Unpaid / Overdue)
                          </h2>
                          <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
                            Each row is <span className="font-semibold text-slate-600">days past the due date</span> for open invoices
                            (unpaid or partial). Bars show share of total aging <span className="whitespace-nowrap">Rs. outstanding</span> in
                            that bucket. Invoices not yet due are not included.
                          </p>
                        </div>
                      </div>
                      {overviewStats.disputedCount > 0 && (
                        <span className="shrink-0 self-start text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 inline-flex items-center gap-1">
                          <Flag className="w-3 h-3 shrink-0" />
                          {overviewStats.disputedCount} Dispute{overviewStats.disputedCount > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <div className="space-y-3.5 mt-5">
                      {(() => {
                        const maxAmt = Math.max(...overviewStats.agingBuckets.map((b) => b.amount), 1);
                        return overviewStats.agingBuckets.map(({ range, count, amount }) => {
                          const tone =
                            range === '0-30d'
                              ? 'bg-amber-400'
                              : range === '31-60d'
                                ? 'bg-orange-500'
                                : range === '61-90d'
                                  ? 'bg-red-500'
                                  : 'bg-red-700';
                          const pct = amount > 0 ? Math.max((amount / maxAmt) * 100, 5) : 0;
                          return (
                            <div key={range} className="flex items-center gap-3 sm:gap-4">
                              <span className="text-xs font-bold text-slate-600 w-[3.25rem] sm:w-14 shrink-0 tabular-nums">
                                {range}
                              </span>
                              <div
                                className="flex-1 min-w-0 h-7 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80"
                                title={count > 0 ? `${count} invoice(s) · Rs. ${amount.toLocaleString('en-IN')}` : 'No receivables in this bucket'}
                              >
                                <div
                                  className={`h-full ${tone} rounded-full transition-all duration-700 ease-out`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="text-xs font-bold text-slate-800 w-7 sm:w-8 text-right tabular-nums shrink-0">
                                {count}
                              </span>
                              <span className="text-xs font-semibold text-slate-600 w-[5.5rem] sm:w-32 text-right tabular-nums shrink-0">
                                Rs. {amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                              </span>
                            </div>
                          );
                        });
                      })()}
                    </div>
                    {overviewStats.agingBuckets.every((b) => b.count === 0) ? (
                      <div className="mt-5 rounded-xl border border-emerald-200/80 bg-emerald-50/60 px-4 py-3">
                        <p className="text-sm text-emerald-800 font-semibold flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                          No aging receivables — great job!
                        </p>
                        <p className="text-xs text-emerald-700/90 mt-1.5 pl-6">
                          Nothing is past due with an open balance. Upcoming due dates won’t appear here until the due day.
                        </p>
                      </div>
                    ) : (
                      <p className="mt-4 text-[11px] text-slate-400">
                        Follow up on older buckets first; amounts use each invoice’s outstanding balance when set.
                      </p>
                    )}
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
                          <h2 className="text-xl font-bold text-primary-950">{editingInvoiceId ? 'Edit Invoice' : 'Invoice Details'}</h2>
                          <p className="text-xs font-medium text-primary-600 mt-0.5">Rastogi Codeworks</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary-600 bg-primary-50 px-3 py-1.5 rounded-full border border-primary-200">
                        {editingInvoiceId ? 'Editing' : 'Draft'}
                      </span>
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
                                const selectedEmail = e.target.value;
                                setInvoiceClientEmail(selectedEmail);
                                setLinkedPartialInvoiceId('');
                                const c = clients.find((x) => x.email === selectedEmail);
                                if (!selectedEmail || !c) return;
                                if (c.name) setClientName(c.name);
                                setClientGst(c.gstNumber || '');
                                setBillingAddress(c.billingAddress || '');
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
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Link partial payment to old invoice (optional)</label>
                          <div className="relative">
                            <select
                              value={linkedPartialInvoiceId}
                              onChange={(e) => setLinkedPartialInvoiceId(e.target.value)}
                              disabled={!(invoiceStatus === 'partially_paid' || invoiceStatus === 'paid') || !invoiceClientEmail || linkableClientInvoices.length === 0}
                              className="w-full appearance-none px-4 py-3 pr-10 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none font-medium text-slate-900 text-base cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              <option value="">— None —</option>
                              {linkableClientInvoices.map((inv) => (
                                <option key={inv._id} value={inv._id}>
                                  #{String(inv._id).slice(-6)} - Rs. {(inv.balanceDue ?? inv.total ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })} ({inv.status})
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          </div>
                          <p className="text-[10px] text-slate-500 ml-1">Enable by setting invoice status to Partially Paid or Paid. Visible on dashboard only.</p>
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
                              disabled={hasPaymentTerms}
                              className="w-full appearance-none px-4 py-3 pr-10 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none font-medium text-slate-900 text-base cursor-pointer"
                            >
                              <option value="unpaid">Unpaid</option>
                              <option value="partially_paid">Partially Paid</option>
                              <option value="paid">Paid</option>
                              <option value="overdue">Overdue</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          </div>
                          <p className="text-[10px] text-slate-500 ml-1">
                            {hasPaymentTerms
                              ? 'Status auto-calculated from installment payments.'
                              : 'Payment status for this invoice.'}
                          </p>
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
                                    <div className="col-span-3">Label</div>
                                    <div className="col-span-2 text-center">%</div>
                                    <div className="col-span-3">Due Date</div>
                                    <div className="col-span-3">Status</div>
                                    <div className="col-span-1" />
                                  </div>
                                  {paymentTerms.map((term, i) => {
                                    const amt = totals.total * (Number(term.percentage) || 0) / 100;
                                    const partialMax = amt > 0 ? amt : undefined;
                                    return (
                                      <div key={i} className="grid grid-cols-12 gap-2 items-center p-3 rounded-xl bg-slate-50 border border-slate-200">
                                        <div className="col-span-12 sm:col-span-3">
                                          <input
                                            type="text"
                                            value={term.label}
                                            onChange={(e) => handleTermChange(i, 'label', e.target.value)}
                                            placeholder={`Installment ${i + 1}`}
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none text-sm font-medium"
                                          />
                                        </div>
                                        <div className="col-span-4 sm:col-span-2">
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
                                        <div className="col-span-4 sm:col-span-3">
                                          <input
                                            type="date"
                                            value={term.dueDate}
                                            onChange={(e) => handleTermChange(i, 'dueDate', e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none text-sm font-medium"
                                          />
                                        </div>
                                        <div className="col-span-4 sm:col-span-3 space-y-1">
                                          <select
                                            value={term.status || 'due'}
                                            onChange={(e) => handleTermChange(i, 'status', e.target.value)}
                                            className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none text-xs font-semibold text-slate-700"
                                          >
                                            {PAYMENT_TERM_STATUSES.map((opt) => (
                                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                          </select>
                                          {(term.status || 'due') === 'partially_paid' && (
                                            <input
                                              type="number"
                                              min="0"
                                              max={partialMax}
                                              value={term.partialAmount ?? ''}
                                              onChange={(e) => handleTermChange(i, 'partialAmount', e.target.value)}
                                              placeholder="Paid amount"
                                              className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none text-xs font-medium text-slate-800"
                                            />
                                          )}
                                        </div>
                                        <div className="col-span-12 sm:col-span-1 flex justify-end gap-1">
                                          <button
                                            type="button"
                                            onClick={() => handleDownloadInstallmentPdf(term, i)}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                                            title="Download installment invoice"
                                          >
                                            <Download className="w-3.5 h-3.5" />
                                          </button>
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

                      {/* Notes & remark presets (month auto-fills when empty on new invoice) */}
                      <div className="space-y-2">
                        <div className="ml-1 space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Notes &amp; terms</label>
                          <p className="text-[11px] text-slate-500 leading-relaxed">
                            For new invoices, remarks <span className="font-semibold text-slate-600">auto-match the invoice month</span> when this
                            box is empty. Change the invoice date to refresh, or pick a preset below.
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {INVOICE_REMARK_CHIPS.map(({ id, label }) => (
                            <button
                              key={id}
                              type="button"
                              onClick={() => applyInvoiceRemarkPreset(id)}
                              className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-900 transition-colors"
                            >
                              {label}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => setNotes(getMonthlyDefaultRemarks(invoiceDate))}
                            className="px-3 py-1.5 rounded-full border border-primary-200 bg-primary-50 text-xs font-semibold text-primary-800 hover:bg-primary-100 transition-colors"
                          >
                            Refresh monthly
                          </button>
                          <button
                            type="button"
                            onClick={() => setNotes('')}
                            className="px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                          >
                            Clear
                          </button>
                        </div>
                        <textarea
                          rows={4}
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
                              {editingInvoiceId ? 'Update Invoice' : 'Save Invoice'}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Preview Side — live invoice layout (updates as you type) */}
                <div className="w-full lg:col-span-5 min-w-0 order-2">
                  <div className="lg:sticky lg:top-24 space-y-2">
                    <p className="text-[11px] font-semibold text-primary-600 px-1 lg:text-right">
                      Live preview · matches PDF layout
                    </p>
                    <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-md">
                      <div className="bg-primary-900 px-5 py-5 sm:px-6 sm:py-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-primary-500/25 blur-3xl translate-x-1/3 -translate-y-1/2 pointer-events-none" />
                        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0 flex items-start gap-3">
                            <img src="/transparent_logo.png" alt="" className="h-11 w-11 shrink-0 object-contain opacity-95" />
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-primary-300/90">Rastogi Codeworks</p>
                              <p className="text-xs text-primary-200/90 mt-0.5">Tax invoice · preview</p>
                              <p className="mt-2 font-mono text-[11px] text-primary-200/90">{previewInvoiceRefLabel}</p>
                            </div>
                          </div>
                          <div className="sm:text-right">
                            <p
                              className={`font-bold tracking-tight text-white mb-2 ${invoiceStatus === 'paid' ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'}`}
                            >
                              {invoiceStatus === 'paid' ? 'PAID INVOICE' : 'INVOICE'}
                            </p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-primary-300 mb-1">Bill to</p>
                            <h3 className="text-lg font-bold leading-snug text-white sm:text-xl break-words">
                              {clientName.trim() || 'Client name'}
                            </h3>
                            {clientGst.trim() && (
                              <p className="mt-1 text-sm text-primary-200">GST: {clientGst.trim()}</p>
                            )}
                            {billingAddress.trim() && (
                              <p className="mt-2 max-w-sm text-sm text-primary-200/90 whitespace-pre-line sm:ml-auto">
                                {billingAddress.trim()}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="relative z-10 mt-5 flex flex-wrap items-end justify-between gap-3 border-t border-white/10 pt-4">
                          {invoiceStatus !== 'paid' && (
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-primary-300">Balance due</p>
                              <p className="text-2xl font-bold tabular-nums text-white sm:text-3xl">
                                Rs. {totalBalanceDue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </p>
                            </div>
                          )}
                          <div
                            className={`flex flex-wrap gap-4 text-sm ${invoiceStatus === 'paid' ? 'w-full sm:justify-end' : ''}`}
                          >
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-primary-300/90">Issued</p>
                              <p className="font-semibold text-white">
                                {invoiceDate
                                  ? new Date(invoiceDate + 'T12:00:00').toLocaleDateString('en-IN', { dateStyle: 'medium' })
                                  : '—'}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-primary-300/90">Due</p>
                              <p className="font-semibold text-white">
                                {dueDate
                                  ? new Date(dueDate + 'T12:00:00').toLocaleDateString('en-IN', { dateStyle: 'medium' })
                                  : '—'}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-primary-300/90">Status</p>
                              <div className="mt-1 flex flex-col items-start gap-1">
                                <span
                                  className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                                    invoiceStatus === 'paid'
                                      ? 'border-emerald-400/70 bg-emerald-500/30 text-emerald-50'
                                      : invoiceStatus === 'partially_paid'
                                        ? 'border-sky-400/70 bg-sky-500/30 text-sky-50'
                                        : invoiceStatus === 'overdue'
                                          ? 'border-red-400/70 bg-red-500/30 text-red-50'
                                          : 'border-amber-400/70 bg-amber-500/30 text-amber-50'
                                  }`}
                                >
                                  {invoiceStatus === 'paid'
                                    ? 'Paid'
                                    : invoiceStatus === 'partially_paid'
                                      ? 'Partially paid'
                                      : invoiceStatus === 'overdue'
                                        ? 'Overdue'
                                        : 'Unpaid'}
                                </span>
                                {hasPaymentTerms && (
                                  <span className="text-[9px] font-medium text-primary-200/80 max-w-[10rem] leading-tight">
                                    Mirrors installment totals (dropdown locked)
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="px-4 py-5 sm:px-6 sm:py-6">
                        <div className="mb-5 overflow-x-auto rounded-xl border border-slate-200">
                          <table className="w-full min-w-[300px] border-collapse text-sm">
                            <thead>
                              <tr className="border-b border-slate-200 bg-slate-50 text-left text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                <th className="px-3 py-2.5">Description</th>
                                <th className="w-14 px-2 py-2.5 text-center">Qty</th>
                                <th className="w-24 px-2 py-2.5 text-right">Price</th>
                                <th className="w-28 px-3 py-2.5 text-right">Amount</th>
                              </tr>
                            </thead>
                            <tbody className="text-primary-950">
                              {items.map((item, idx) => {
                                const qty = Number(item.quantity) || 0;
                                const price = Number(item.price) || 0;
                                const line = qty * price;
                                const emptyRow = !(item.description || '').trim() && !qty && !price;
                                return (
                                  <tr
                                    key={idx}
                                    className={`border-b border-slate-100 last:border-0 ${emptyRow ? 'bg-slate-50/50' : ''}`}
                                  >
                                    <td className="px-3 py-2.5 text-slate-800">
                                      {(item.description || '').trim() || (
                                        <span className="italic text-slate-400">Item details</span>
                                      )}
                                    </td>
                                    <td className="px-2 py-2.5 text-center tabular-nums text-slate-700">{qty || '—'}</td>
                                    <td className="px-2 py-2.5 text-right tabular-nums text-slate-700">
                                      Rs. {price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-3 py-2.5 text-right font-semibold tabular-nums">
                                      Rs. {line.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                          {!previewHasLineItems && (
                            <p className="border-t border-slate-100 px-3 py-4 text-center text-xs text-slate-500">
                              Add descriptions and amounts on the left — they appear here instantly.
                            </p>
                          )}
                        </div>

                        {hasPaymentTerms && paymentTerms.some((t) => Number(t.percentage) > 0) && (
                          <div className="mb-5 rounded-xl border border-primary-100 bg-primary-50/60 px-4 py-3">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-primary-700 mb-2">
                              Payment schedule
                            </p>
                            <ul className="space-y-2 text-sm">
                              {paymentTerms
                                .filter((t) => Number(t.percentage) > 0)
                                .map((term, i) => {
                                  const pct = Number(term.percentage) || 0;
                                  const amt = (Number(totals.total) || 0) * (pct / 100);
                                  return (
                                    <li
                                      key={i}
                                      className="flex flex-wrap items-center justify-between gap-2 border-b border-primary-100/80 pb-2 last:border-0 last:pb-0"
                                    >
                                      <span className="text-primary-900">
                                        {term.label?.trim() || `Installment ${i + 1}`}{' '}
                                        <span className="text-primary-600">({pct}%)</span>
                                      </span>
                                      <span className="font-semibold tabular-nums text-primary-950">
                                        Rs. {amt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                      </span>
                                    </li>
                                  );
                                })}
                            </ul>
                          </div>
                        )}

                        <div className="space-y-0 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Summary</p>
                          <div className="flex items-center justify-between py-1.5 text-sm">
                            <span className="text-slate-600">Subtotal</span>
                            <span className="font-semibold tabular-nums text-slate-900">
                              Rs. {totals.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                          <div className="flex items-center justify-between py-1.5 text-sm">
                            <span className="text-slate-600">Previous balance</span>
                            <span className="font-semibold tabular-nums text-slate-900">
                              Rs. {linkedClientPreviousDue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                          {hasPaymentTerms && (
                            <div className="flex items-center justify-between py-1.5 text-sm">
                              <span className="text-slate-600">Settled (installments)</span>
                              <span className="font-semibold tabular-nums text-slate-900">
                                Rs. {paidAmountFromTerms.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center justify-between py-1.5 text-sm">
                            <span className="text-slate-600">This invoice outstanding</span>
                            <span className="font-semibold tabular-nums text-slate-900">
                              Rs. {currentInvoiceOutstanding.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                          {previewPaidInFull ? (
                            <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-2.5 text-base">
                              <span className="font-bold text-emerald-800">Amount paid</span>
                              <span className="font-bold tabular-nums text-emerald-700">
                                Rs. {invoiceTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </div>
                          ) : (
                            <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-2.5 text-base">
                              <span className="font-bold text-slate-900">Balance due</span>
                              <span className="font-bold tabular-nums text-primary-700">
                                Rs. {totalBalanceDue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </div>
                          )}
                        </div>

                        {notes.trim() && (
                          <div className="mt-5 rounded-xl border border-primary-100 bg-primary-50/40 p-4">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-primary-700 mb-1.5">Notes &amp; terms</p>
                            <p className="whitespace-pre-line text-sm leading-relaxed text-primary-900/90">{notes.trim()}</p>
                          </div>
                        )}
                      </div>

                      <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 text-center">
                        <p className="text-[11px] text-slate-600">
                          Client-facing preview · download PDF to see pagination and final typography
                        </p>
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
                                {inv.linkedPartialInvoiceId && (
                                  <p className="text-[10px] text-blue-700/80 font-semibold mt-0.5">
                                    Linked to #{String(inv.linkedPartialInvoiceId).slice(-6)}
                                  </p>
                                )}
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
                                  onClick={() => openEditInvoice(inv)}
                                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Edit Invoice"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
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
                                    <option value="partially_paid">Mark Partially Paid</option>
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

            {/* ── Quotation Generator ── */}
            {activeSection === 'quotations' && (
              <div className="admin-card-glass rounded-2xl p-5 sm:p-6 border border-primary-200/60 animate-fade-in-up">
                <h2 className="text-base font-bold text-primary-950 mb-5 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary-500" />
                  Quotation Generator
                </h2>
                <form onSubmit={handleDownloadQuotation} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Your Company Name</label>
                      <input
                        value={quotationForm.companyName}
                        onChange={(e) => setQuotationForm((p) => ({ ...p, companyName: e.target.value }))}
                        placeholder="e.g. Rastogi Codeworks"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none font-medium text-slate-900"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Client Name *</label>
                      <input
                        value={quotationForm.clientName}
                        onChange={(e) => setQuotationForm((p) => ({ ...p, clientName: e.target.value }))}
                        placeholder="Client name"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none font-medium text-slate-900"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Your Company Logo (quotation only)</label>
                      <input
                        id="quotation-company-logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleQuotationLogoUpload('companyLogoDataUrl')}
                        className="hidden"
                      />
                      <label
                        htmlFor="quotation-company-logo-upload"
                        onDragOver={handleQuotationLogoDragOver('companyLogoDataUrl')}
                        onDrop={handleQuotationLogoDrop('companyLogoDataUrl')}
                        onDragLeave={handleQuotationLogoDragLeave}
                        className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed px-3 py-3 transition ${
                          draggingLogoField === 'companyLogoDataUrl'
                            ? 'border-primary-500 bg-primary-50/70 ring-2 ring-primary-200'
                            : 'border-slate-300 bg-slate-50 hover:border-primary-400 hover:bg-primary-50/40'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 text-slate-600">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200 text-slate-600">
                            <ImagePlus className="h-4 w-4" />
                          </span>
                          <span className="text-sm font-medium">{quotationForm.companyLogoDataUrl ? 'Replace logo image' : 'Upload company logo'}</span>
                        </div>
                        <span className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                          Browse
                        </span>
                      </label>
                      {draggingLogoField === 'companyLogoDataUrl' && (
                        <p className="text-[11px] font-medium text-primary-600">Drop image here</p>
                      )}
                      {quotationForm.companyLogoDataUrl && (
                        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-2">
                          <img
                            src={quotationForm.companyLogoDataUrl}
                            alt="Company logo preview"
                            className="h-14 w-28 rounded-md border border-slate-200 object-contain bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => clearQuotationLogo('companyLogoDataUrl')}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                      <p className="text-[11px] text-slate-400">PNG or JPG, transparent background preferred.</p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Client Logo (quotation only)</label>
                      <input
                        id="quotation-client-logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleQuotationLogoUpload('clientLogoDataUrl')}
                        className="hidden"
                      />
                      <label
                        htmlFor="quotation-client-logo-upload"
                        onDragOver={handleQuotationLogoDragOver('clientLogoDataUrl')}
                        onDrop={handleQuotationLogoDrop('clientLogoDataUrl')}
                        onDragLeave={handleQuotationLogoDragLeave}
                        className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed px-3 py-3 transition ${
                          draggingLogoField === 'clientLogoDataUrl'
                            ? 'border-primary-500 bg-primary-50/70 ring-2 ring-primary-200'
                            : 'border-slate-300 bg-slate-50 hover:border-primary-400 hover:bg-primary-50/40'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 text-slate-600">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200 text-slate-600">
                            <ImagePlus className="h-4 w-4" />
                          </span>
                          <span className="text-sm font-medium">{quotationForm.clientLogoDataUrl ? 'Replace logo image' : 'Upload client logo'}</span>
                        </div>
                        <span className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                          Browse
                        </span>
                      </label>
                      {draggingLogoField === 'clientLogoDataUrl' && (
                        <p className="text-[11px] font-medium text-primary-600">Drop image here</p>
                      )}
                      {quotationForm.clientLogoDataUrl && (
                        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-2">
                          <img
                            src={quotationForm.clientLogoDataUrl}
                            alt="Client logo preview"
                            className="h-14 w-28 rounded-md border border-slate-200 object-contain bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => clearQuotationLogo('clientLogoDataUrl')}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                      <p className="text-[11px] text-slate-400">Optional: add client brand mark for the quotation.</p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Project / Service Title</label>
                      <input
                        value={quotationForm.projectTitle}
                        onChange={(e) => setQuotationForm((p) => ({ ...p, projectTitle: e.target.value }))}
                        placeholder="e.g. Website Revamp & SEO"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none font-medium text-slate-900"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Service Selected</label>
                      <div className="relative">
                        <select
                          value={quotationForm.serviceId}
                          onChange={(e) => {
                            const selected = quotationServices.find((s) => s.id === e.target.value);
                            const defaults = getServiceDefaultContent(e.target.value);
                            setQuotationForm((p) => ({
                              ...p,
                              serviceId: e.target.value,
                              projectTitle: selected?.title || p.projectTitle,
                              requirements: p.requirements || defaults?.requirements || '',
                              notes: p.notes || defaults?.notes || '',
                            }));
                          }}
                          className="w-full appearance-none px-4 py-2.5 pr-10 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none font-medium text-slate-900"
                        >
                          <option value="">-- Select service --</option>
                          {quotationServices.map((s) => (
                            <option key={s.id} value={s.id}>{s.title}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Quote Date</label>
                      <input
                        type="date"
                        value={quotationForm.quoteDate}
                        onChange={(e) => setQuotationForm((p) => ({ ...p, quoteDate: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none font-medium text-slate-900"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Valid Until</label>
                      <input
                        type="date"
                        value={quotationForm.validUntil}
                        onChange={(e) => setQuotationForm((p) => ({ ...p, validUntil: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none font-medium text-slate-900"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Estimated Delivery (Days)</label>
                      <input
                        type="number"
                        min="1"
                        value={quotationForm.deliveryDays}
                        onChange={(e) => setQuotationForm((p) => ({ ...p, deliveryDays: e.target.value }))}
                        placeholder="e.g. 30"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none font-medium text-slate-900"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Billing Address</label>
                      <textarea
                        value={quotationForm.billingAddress}
                        onChange={(e) => setQuotationForm((p) => ({ ...p, billingAddress: e.target.value }))}
                        rows={2}
                        placeholder="Street, City, State, PIN, Country"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none font-medium text-slate-900 resize-none"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Requirements For The Project (From Client)</label>
                      <textarea
                        value={quotationForm.requirements}
                        onChange={(e) => setQuotationForm((p) => ({ ...p, requirements: e.target.value }))}
                        rows={2}
                        placeholder="Client requirements and expectations..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none font-medium text-slate-900 resize-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Quotation Items</label>
                      <button
                        type="button"
                        onClick={addQuotationItem}
                        className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1.5 bg-primary-50 px-3 py-2 rounded-lg border border-primary-200/60 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Item
                      </button>
                    </div>
                    {quotationForm.items.map((item, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-2 items-center p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="col-span-12 sm:col-span-7">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleQuotationItemChange(idx, 'description', e.target.value)}
                            placeholder={`Item ${idx + 1} description`}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none text-sm font-medium"
                          />
                        </div>
                        <div className="col-span-4 sm:col-span-2">
                          <input
                            type="number"
                            min="0"
                            value={item.quantity}
                            onChange={(e) => handleQuotationItemChange(idx, 'quantity', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none text-sm font-medium text-center"
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-2">
                          <input
                            type="number"
                            min="0"
                            value={item.price}
                            onChange={(e) => handleQuotationItemChange(idx, 'price', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 outline-none text-sm font-medium text-right"
                          />
                        </div>
                        <div className="col-span-2 sm:col-span-1 flex justify-end">
                          <button type="button" onClick={() => removeQuotationItem(idx)} className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold bg-primary-50 border border-primary-200 text-primary-700">
                      <span>Total</span>
                      <span>Rs. {quotationTotals.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Notes &amp; remarks</label>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Auto-fills from the <span className="font-semibold text-slate-600">quote date month</span> when empty. Presets replace
                        the whole field — edit freely after applying.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {QUOTATION_REMARK_CHIPS.map(({ id, label }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => applyQuotationRemarkPreset(id)}
                          className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-900 transition-colors"
                        >
                          {label}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          setQuotationForm((p) => ({ ...p, notes: getQuotationMonthlyRemarks(p.quoteDate) }))
                        }
                        className="px-3 py-1.5 rounded-full border border-primary-200 bg-primary-50 text-xs font-semibold text-primary-800 hover:bg-primary-100 transition-colors"
                      >
                        Refresh monthly
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuotationForm((p) => ({ ...p, notes: '' }))}
                        className="px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                    <textarea
                      value={quotationForm.notes}
                      onChange={(e) => setQuotationForm((p) => ({ ...p, notes: e.target.value }))}
                      rows={4}
                      placeholder="Additional terms, assumptions, or timeline notes..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none font-medium text-slate-900 resize-none"
                    />
                  </div>

                  <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 text-sm flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Quotation PDF
                  </button>
                </form>
              </div>
            )}

            {activeSection === 'reports' && <AdminReportsSection onError={(msg) => setError(msg || '')} />}
            {activeSection === 'hiring' && <AdminHiringSection onError={(msg) => setError(msg || '')} />}

            {activeSection === 'website' && (
              <div className="animate-fade-in-up w-full max-w-7xl mx-auto space-y-6">
                {appSettingsLoading && (
                  <p className="text-sm text-slate-500 py-6">Loading website settings…</p>
                )}
                {!appSettingsLoading && appSettings && (
                  <>
                    {/* Content */}
                    <div className="admin-card-glass rounded-2xl p-5 sm:p-8 border border-primary-200/40">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-3 mb-6 pb-4 border-b border-primary-100">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h2 className="text-base font-bold text-primary-950">Homepage content</h2>
                            <p className="text-xs text-primary-500 mt-0.5">
                              Text shown on the public home page when filled. Leave fields blank to keep the built-in layout and copy.
                            </p>
                          </div>
                        </div>
                      </div>
                      <form onSubmit={handleSaveWebsiteContent} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">SEO — meta description (home)</label>
                          <textarea
                            value={appSettings.siteContent?.seoHomeDescription || ''}
                            onChange={(e) => updateSiteContentField('seoHomeDescription', e.target.value)}
                            rows={3}
                            placeholder="Shown in search results when set…"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none text-sm resize-y min-h-[5rem]"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Hero headline</label>
                          <textarea
                            value={appSettings.siteContent?.heroHeadline || ''}
                            onChange={(e) => updateSiteContentField('heroHeadline', e.target.value)}
                            rows={4}
                            placeholder="Plain text or multiple lines. When set, replaces the default animated headline."
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none text-sm resize-y min-h-[6rem]"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Hero supporting text</label>
                          <textarea
                            value={appSettings.siteContent?.heroSubtext || ''}
                            onChange={(e) => updateSiteContentField('heroSubtext', e.target.value)}
                            rows={3}
                            placeholder="Paragraph under the headline…"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none text-sm resize-y min-h-[5rem]"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Hero trust line</label>
                          <input
                            type="text"
                            value={appSettings.siteContent?.heroTrustLine || ''}
                            onChange={(e) => updateSiteContentField('heroTrustLine', e.target.value)}
                            placeholder="e.g. Starting from ₹10,999 | Delivered in 3–5 days"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none text-sm"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Hero background image</label>
                          <select
                            value={appSettings.siteContent?.heroBackgroundImage || ''}
                            onChange={(e) => updateSiteContentField('heroBackgroundImage', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none text-sm"
                          >
                            <option value="">Default (built-in site image)</option>
                            {(appSettings.mediaImages || []).map((img) => (
                              <option key={img.id} value={`/uploads/${img.storedName}`}>
                                {img.originalName || img.storedName}
                              </option>
                            ))}
                          </select>
                          <p className="text-[11px] text-slate-500">
                            Choose an uploaded image from the library below, or leave default.
                          </p>
                        </div>
                        {websiteMsg.text && (
                          <p
                            className={`text-sm flex items-center gap-2 ${
                              websiteMsg.type === 'success' ? 'text-emerald-700' : 'text-red-600'
                            }`}
                          >
                            {websiteMsg.type === 'success' ? (
                              <CheckCircle className="w-4 h-4 shrink-0" />
                            ) : (
                              <AlertCircle className="w-4 h-4 shrink-0" />
                            )}
                            {websiteMsg.text}
                          </p>
                        )}
                        <button
                          type="submit"
                          disabled={websiteSaving}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 disabled:opacity-50"
                        >
                          {websiteSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                          Save homepage content
                        </button>
                      </form>
                    </div>

                    {/* Media library */}
                    <div className="admin-card-glass rounded-2xl p-5 sm:p-8 border border-primary-200/40">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 pb-4 border-b border-primary-100">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                            <ImagePlus className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h2 className="text-base font-bold text-primary-950">Image library</h2>
                            <p className="text-xs text-primary-500 mt-0.5">
                              Upload PNG, JPG, WebP, GIF, or SVG (max 8&nbsp;MB). Files are stored on the API server and served from{' '}
                              <code className="text-[10px] bg-slate-100 px-1 rounded">/uploads/</code>.
                              On cloud hosts without persistent disk, re-upload after redeploys or use external CDN URLs in content later.
                            </p>
                          </div>
                        </div>
                        <div>
                          <input
                            ref={websiteFileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                            className="hidden"
                            onChange={handleWebsiteFileSelected}
                          />
                          <button
                            type="button"
                            disabled={websiteUploading}
                            onClick={() => websiteFileInputRef.current?.click()}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 disabled:opacity-50"
                          >
                            {websiteUploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
                            Upload image
                          </button>
                        </div>
                      </div>
                      {(!(appSettings.mediaImages || []).length) ? (
                        <p className="text-sm text-slate-500 py-4 border border-dashed border-slate-200 rounded-xl text-center">
                          No images yet. Upload one to get a public URL for the hero or marketing pages.
                        </p>
                      ) : (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {(appSettings.mediaImages || []).map((img) => {
                            const publicUrl = `${API_BASE}/uploads/${img.storedName}`;
                            return (
                              <li
                                key={img.id}
                                className="rounded-xl border border-slate-200 bg-white overflow-hidden flex flex-col"
                              >
                                <div className="aspect-video bg-slate-100 flex items-center justify-center overflow-hidden">
                                  <img
                                    src={publicUrl}
                                    alt=""
                                    className="max-h-full max-w-full object-contain"
                                  />
                                </div>
                                <div className="p-3 flex flex-col gap-2 flex-1 min-w-0">
                                  <p className="text-xs font-medium text-slate-800 truncate" title={img.originalName}>
                                    {img.originalName || img.storedName}
                                  </p>
                                  <p className="text-[10px] text-slate-500 font-mono break-all">{publicUrl}</p>
                                  <div className="flex flex-wrap gap-2 mt-auto pt-1">
                                    <button
                                      type="button"
                                      className="text-xs font-semibold text-primary-700 hover:text-primary-900 px-2 py-1 rounded-lg bg-primary-50"
                                      onClick={() => {
                                        navigator.clipboard?.writeText(publicUrl).then(() => {
                                          setWebsiteMsg({ type: 'success', text: 'URL copied to clipboard.' });
                                        }).catch(() => setWebsiteMsg({ type: 'error', text: 'Could not copy URL.' }));
                                      }}
                                    >
                                      Copy URL
                                    </button>
                                    <button
                                      type="button"
                                      disabled={websiteDeletingId === img.id}
                                      className="text-xs font-semibold text-red-700 hover:text-red-900 px-2 py-1 rounded-lg bg-red-50 disabled:opacity-50 inline-flex items-center gap-1"
                                      onClick={() => handleDeleteWebsiteImage(img.id)}
                                    >
                                      {websiteDeletingId === img.id ? (
                                        <RefreshCw className="w-3 h-3 animate-spin" />
                                      ) : (
                                        <Trash2 className="w-3 h-3" />
                                      )}
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Settings Section — main column + sticky sidebar on large screens */}
            {activeSection === 'settings' && (
              <div className="animate-fade-in-up w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(260px,340px)] gap-6 lg:gap-8 xl:gap-10 items-start">
                <div className="space-y-6 min-w-0">
                {/* Email & notifications */}
                <div className="admin-card-glass rounded-2xl p-5 sm:p-8 border border-primary-200/40">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 mb-6 pb-4 border-b border-primary-100">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-base font-bold text-primary-950">Email &amp; notifications</h2>
                        <p className="text-xs text-primary-500 mt-0.5">
                          Controls for transactional mail (forms, careers, invoices). API keys stay on the server.
                        </p>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 self-start sm:self-center text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        mailTransportConfigured
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-amber-50 text-amber-900 border-amber-200'
                      }`}
                    >
                      {mailTransportConfigured ? 'Resend ready' : 'Not configured'}
                    </span>
                  </div>

                  {!mailTransportConfigured && (
                    <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-950">
                      <p className="font-semibold mb-1">Add Resend to your server <code className="text-xs bg-white/60 px-1 rounded">.env</code></p>
                      <ul className="list-disc list-inside text-xs space-y-1 text-amber-900/90">
                        <li>
                          <code className="bg-white/60 px-1 rounded">RESEND_API_KEY</code> — from{' '}
                          <a href="https://resend.com" className="font-semibold underline" target="_blank" rel="noreferrer">
                            resend.com
                          </a>
                        </li>
                        <li>
                          <code className="bg-white/60 px-1 rounded">MAIL_FROM</code> — e.g.{' '}
                          <code className="bg-white/60 px-1 rounded">&quot;Rastogi Codeworks &lt;onboarding@yourdomain.com&gt;&quot;</code>
                        </li>
                      </ul>
                    </div>
                  )}

                  {appSettingsLoading && (
                    <p className="text-sm text-slate-500 py-4">Loading settings…</p>
                  )}
                  {!appSettingsLoading && appSettings && (
                    <form onSubmit={handleSaveAppSettings} className="space-y-5">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                          checked={!!appSettings.emailEnabled}
                          onChange={(e) => updateAppSetting('emailEnabled', e.target.checked)}
                        />
                        <span className="text-sm font-medium text-primary-950">Enable sending email from this app</span>
                      </label>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Founder / ops inbox
                          </label>
                          <input
                            type="email"
                            value={appSettings.founderNotifyEmail || ''}
                            onChange={(e) => updateAppSetting('founderNotifyEmail', e.target.value)}
                            placeholder="you@company.com"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none text-sm"
                          />
                          <p className="text-[11px] text-slate-500">Copies of leads, applications, and optional invoice CC.</p>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">From display name</label>
                          <input
                            type="text"
                            value={appSettings.emailFromName || ''}
                            onChange={(e) => updateAppSetting('emailFromName', e.target.value)}
                            placeholder="Rastogi Codeworks"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none text-sm"
                          />
                          <p className="text-[11px] text-slate-500">Must match a domain verified in Resend.</p>
                        </div>
                      </div>

                      <div className="grid lg:grid-cols-2 gap-4 lg:gap-5">
                        <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-3 min-h-0">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">When you wire forms to the API</p>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                              checked={!!appSettings.notifyFounderOnContact}
                              onChange={(e) => updateAppSetting('notifyFounderOnContact', e.target.checked)}
                            />
                            <span className="text-sm text-slate-800">Notify founder on contact / enquiry submissions</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                              checked={!!appSettings.sendContactConfirmToUser}
                              onChange={(e) => updateAppSetting('sendContactConfirmToUser', e.target.checked)}
                            />
                            <span className="text-sm text-slate-800">Send confirmation email to the person who submitted</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                              checked={!!appSettings.notifyFounderOnCareersApply}
                              onChange={(e) => updateAppSetting('notifyFounderOnCareersApply', e.target.checked)}
                            />
                            <span className="text-sm text-slate-800">Notify founder on careers applications</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                              checked={!!appSettings.sendCareersConfirmToApplicant}
                              onChange={(e) => updateAppSetting('sendCareersConfirmToApplicant', e.target.checked)}
                            />
                            <span className="text-sm text-slate-800">Send confirmation to job applicants</span>
                          </label>
                        </div>

                        <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-3 min-h-0">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">Invoices</p>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                              checked={!!appSettings.invoiceEmailDefaultOn}
                              onChange={(e) => updateAppSetting('invoiceEmailDefaultOn', e.target.checked)}
                            />
                            <span className="text-sm text-slate-800">Default “email client” to on when creating invoices (UI)</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                              checked={!!appSettings.invoiceCcFounder}
                              onChange={(e) => updateAppSetting('invoiceCcFounder', e.target.checked)}
                            />
                            <span className="text-sm text-slate-800">CC founder inbox when emailing invoices</span>
                          </label>
                          <div className="pt-2 mt-1 border-t border-slate-200/80">
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                              Invoice PDFs still send from the server; these options only control defaults and whether you are copied.
                            </p>
                          </div>
                        </div>
                      </div>

                      {appSettingsMsg.text && (
                        <p
                          className={`text-sm flex items-center gap-2 ${
                            appSettingsMsg.type === 'success' ? 'text-emerald-700' : 'text-red-600'
                          }`}
                        >
                          {appSettingsMsg.type === 'success' ? (
                            <CheckCircle className="w-4 h-4 shrink-0" />
                          ) : (
                            <AlertCircle className="w-4 h-4 shrink-0" />
                          )}
                          {appSettingsMsg.text}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-3">
                        <button
                          type="submit"
                          disabled={appSettingsSaving}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 disabled:opacity-50"
                        >
                          {appSettingsSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                          Save email settings
                        </button>
                        <button
                          type="button"
                          onClick={handleSendTestEmail}
                          disabled={testEmailLoading || !mailTransportConfigured}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50"
                        >
                          {testEmailLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                          Send test email
                        </button>
                      </div>
                    </form>
                  )}
                </div>

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

                <aside className="space-y-4 lg:sticky lg:top-24 xl:top-28 self-start">
                  <div className="rounded-2xl border border-primary-200/70 bg-gradient-to-b from-primary-50/90 to-white p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-primary-600 text-white flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-primary-950">On this page</h3>
                        <p className="text-[11px] text-primary-600">Quick map of your workspace settings</p>
                      </div>
                    </div>
                    <ul className="space-y-2.5 text-sm text-primary-800">
                      <li className="flex gap-2">
                        <Mail className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                        <span><span className="font-semibold text-primary-950">Email</span> — routing for forms, careers, and invoices</span>
                      </li>
                      <li className="flex gap-2">
                        <Lock className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                        <span><span className="font-semibold text-primary-950">Security</span> — change your admin password</span>
                      </li>
                      <li className="flex gap-2">
                        <User className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                        <span><span className="font-semibold text-primary-950">Account</span> — role and billing activity summary</span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Delivery readiness</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2.5 text-sm">
                        {mailTransportConfigured ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        )}
                        <span className="text-slate-700">
                          {mailTransportConfigured
                            ? 'Server mail transport is configured (Resend).'
                            : 'Configure Resend on the server to send real mail.'}
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5 text-sm">
                        {appSettings?.founderNotifyEmail?.includes('@') ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        )}
                        <span className="text-slate-700">
                          {appSettings?.founderNotifyEmail?.includes('@')
                            ? 'Founder inbox set for internal notifications.'
                            : 'Add a founder / ops inbox so you get lead and application alerts.'}
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5 text-sm">
                        {appSettings?.emailEnabled && mailTransportConfigured ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        )}
                        <span className="text-slate-700">
                          {appSettings?.emailEnabled && mailTransportConfigured
                            ? 'Sending is enabled and transport is ready.'
                            : 'Turn on “Enable sending email” after transport is ready.'}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-primary-600" />
                      <h3 className="text-sm font-bold text-primary-950">Resources</h3>
                    </div>
                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                      Verify your domain in Resend so <code className="text-[10px] bg-white px-1 rounded border">MAIL_FROM</code> matches a
                      verified sender.
                    </p>
                    <div className="flex flex-col gap-2">
                      <a
                        href="https://resend.com/docs"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-primary-700 hover:text-primary-900"
                      >
                        Resend documentation
                        <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-70" />
                      </a>
                      <a
                        href="https://resend.com/domains"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-primary-700 hover:text-primary-900"
                      >
                        Domain &amp; DNS setup
                        <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-70" />
                      </a>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-primary-100 bg-primary-900/95 text-primary-100 p-5 text-xs leading-relaxed">
                    <div className="flex items-center gap-2 text-white font-bold text-sm mb-2">
                      <ShieldCheck className="w-4 h-4 text-primary-300" />
                      Privacy
                    </div>
                    <p className="text-primary-200/90">
                      API keys and secrets are never exposed in the browser. Only toggles and addresses you save here are stored with your app
                      settings.
                    </p>
                  </div>
                </aside>
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
  if (status === 'partially_paid') {
    styles = 'bg-blue-50 text-blue-700 border-blue-200';
    dotColor = 'bg-blue-500';
  }
  const label = status === 'paid'
    ? 'Paid'
    : status === 'partially_paid'
      ? 'Partially Paid'
      : status === 'overdue'
        ? 'Overdue'
        : status === 'unpaid'
          ? 'Unpaid'
          : status;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${styles}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {label}
    </span>
  );
}
