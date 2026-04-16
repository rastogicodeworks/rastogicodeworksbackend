import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  MessageSquare,
  Receipt,
  CheckCircle,
  Clock,
  ArrowRight,
  AlertCircle,
  Download,
  Mail,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Zap,
  Calendar,
  Target,
  ShieldCheck,
  Megaphone,
  User,
  Lock,
  Flag,
  XCircle,
  Pin,
  CheckSquare,
  Square,
  FolderKanban,
} from 'lucide-react';
import DashboardNavbar from '../components/DashboardNavbar';
import API_BASE from '../config/api';
import { getAuthHeaders, clearAuthToken } from '../config/auth';
import { downloadInvoicePdf } from '../utils/invoicePdf.js';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'invoices', label: 'Invoices', icon: Receipt },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'announcements', label: 'Announcements', icon: Megaphone },
  { id: 'profile', label: 'Profile', icon: User },
];

function formatDate(value) {
  if (!value) return '-';
  const d = typeof value === 'string' ? new Date(value) : value;
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  const diff = Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24));
  return diff;
}

export default function ClientDashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const [user, setUser] = useState({ name: localStorage.getItem('clientName') || 'Guest', email: '' });
  const [projects, setProjects] = useState([]);
  const [deliverables, setDeliverables] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [invoiceFilter, setInvoiceFilter] = useState('all');
  const [expandedInvoice, setExpandedInvoice] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [disputingId, setDisputingId] = useState(null);
  const [disputeNote, setDisputeNote] = useState('');
  const [disputeInvoiceId, setDisputeInvoiceId] = useState(null);
  const [profileName, setProfileName] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [changePwForm, setChangePwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [changePwLoading, setChangePwLoading] = useState(false);
  const [changePwError, setChangePwError] = useState('');
  const [changePwSuccess, setChangePwSuccess] = useState('');

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    let cancelled = false;
    async function fetchDashboard() {
      if (!API_BASE) { setLoading(false); return; }
      setError('');
      try {
        const res = await fetch(`${API_BASE}/api/dashboard/client`, { headers: getAuthHeaders(), credentials: 'include' });
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (res.status === 401) {
          clearAuthToken();
          localStorage.removeItem('isClient');
          localStorage.removeItem('clientName');
          window.location.href = '/login';
          return;
        }
        if (!res.ok) { setError(data.message || 'Failed to load dashboard.'); setLoading(false); return; }
        if (data.success && data.data) {
          const { user: u, projects: p, deliverables: d, invoices: i, summary: s, announcements: ann } = data.data;
          if (u) { setUser({ name: u.name || 'Guest', email: u.email || '' }); setProfileName(u.name || ''); }
          if (Array.isArray(p)) setProjects(p);
          if (Array.isArray(d)) setDeliverables(d);
          if (Array.isArray(i)) setInvoices(i);
          if (s) setSummary(s);
          if (Array.isArray(ann)) setAnnouncements(ann);
        }
      } catch {
        if (!cancelled) setError('Network error. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchDashboard();
    return () => { cancelled = true; };
  }, []);

  const filteredInvoices = useMemo(
    () => invoiceFilter === 'all' ? invoices : invoices.filter((inv) => inv.status === invoiceFilter),
    [invoices, invoiceFilter],
  );

  const handleDisputeSubmit = async () => {
    if (!disputeInvoiceId) return;
    setDisputingId(disputeInvoiceId);
    try {
      await fetch(`${API_BASE}/api/invoices/${disputeInvoiceId}/dispute`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
        body: JSON.stringify({ flagged: true, note: disputeNote }),
      });
      setInvoices((prev) => prev.map((inv) => inv.id === disputeInvoiceId ? { ...inv, dispute: { flagged: true, note: disputeNote } } : inv));
      setDisputeInvoiceId(null);
      setDisputeNote('');
    } catch { /* silently */ } finally { setDisputingId(null); }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/profile`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }, credentials: 'include', body: JSON.stringify({ name: profileName }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to save');
      setUser((u) => ({ ...u, name: data.user.name }));
      localStorage.setItem('clientName', data.user.name);
      setProfileMsg('Profile updated!');
      setTimeout(() => setProfileMsg(''), 3000);
    } catch (err) { setProfileMsg(err.message); }
    finally { setProfileSaving(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setChangePwError('');
    setChangePwSuccess('');
    if (changePwForm.newPassword !== changePwForm.confirmPassword) { setChangePwError('Passwords do not match.'); return; }
    if (changePwForm.newPassword.length < 8) { setChangePwError('New password must be at least 8 characters.'); return; }
    setChangePwLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/change-password`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }, credentials: 'include', body: JSON.stringify({ currentPassword: changePwForm.currentPassword, newPassword: changePwForm.newPassword }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed');
      setChangePwSuccess('Password changed successfully!');
      setChangePwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { setChangePwError(err.message); }
    finally { setChangePwLoading(false); }
  };

  const handleLogout = () => {
    if (API_BASE) fetch(`${API_BASE}/api/auth/logout`, { method: 'POST', headers: getAuthHeaders(), credentials: 'include' }).catch(() => {});
    clearAuthToken();
    localStorage.removeItem('isClient');
    localStorage.removeItem('clientName');
    window.location.href = '/login';
  };

  const handleDownloadPdf = async (inv) => {
    setDownloadingId(inv.id);
    try {
      await downloadInvoicePdf({
        clientName: user.name,
        billingAddress: inv.billingAddress || '',
        gstNumber: inv.gstNumber || '',
        invoiceDate: inv.invoiceDate,
        dueDate: inv.dueDate || '',
        items: inv.items || [],
        notes: inv.notes || '',
        totals: {
          subtotal: inv.subtotal ?? inv.amount ?? 0,
          total: inv.amount ?? 0,
          previousBalanceDue: inv.previousBalanceDue ?? 0,
          balanceDue: inv.balanceDue ?? inv.amount ?? 0,
        },
        paymentTerms: inv.paymentTerms || [],
        invoiceId: inv.invoiceId?.replace('INV-', '') || '',
      });
    } catch {
      // silently fail
    } finally {
      setDownloadingId(null);
    }
  };

  const paidPct = summary && summary.totalBilled > 0
    ? Math.round((summary.totalPaid / summary.totalBilled) * 100)
    : 0;

  return (
    <div className="admin-dashboard min-h-screen flex flex-col font-sans text-primary-900 antialiased bg-gradient-to-br from-primary-50/40 via-white to-primary-50/20">
      <DashboardNavbar
        variant="client"
        navItems={navItems}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogout={handleLogout}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <main className="flex-1 min-w-0 overflow-y-auto admin-scroll">
          <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 md:py-10">

            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 mb-6 sm:mb-10">
              <div className="min-w-0">
                <h1 className="section-heading text-primary-950 mb-2 text-2xl sm:text-3xl md:text-4xl">
                  {activeSection === 'overview' && 'Dashboard'}
                  {activeSection === 'invoices' && 'Invoices & Payments'}
                  {activeSection === 'projects' && 'Projects'}
                  {activeSection === 'announcements' && 'Announcements'}
                  {activeSection === 'profile' && 'My Profile'}
                </h1>
                <p className="section-sub text-primary-700/90 max-w-2xl">
                  {activeSection === 'overview' && `Welcome back${user.name !== 'Guest' ? `, ${user.name}` : ''}. Here's your account summary.`}
                  {activeSection === 'invoices' && 'View your invoices, payment schedules, and download PDFs.'}
                  {activeSection === 'projects' && 'Track progress and status of your active projects.'}
                  {activeSection === 'announcements' && 'Stay up to date with the latest news and updates from your team.'}
                  {activeSection === 'profile' && 'Manage your name and update your password.'}
                </p>
              </div>

              {activeSection === 'invoices' && (
                <div className="flex flex-wrap items-center gap-1 p-1.5 rounded-full bg-white/80 border border-primary-200/60 shadow-sm w-full sm:w-auto">
                  {['all', 'Unpaid', 'Partially Paid', 'Paid', 'Overdue'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setInvoiceFilter(f)}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all capitalize ${
                        invoiceFilter === f ? 'bg-primary-600 text-white shadow-md' : 'text-primary-700/80 hover:bg-primary-50'
                      }`}
                    >
                      {f === 'all' ? 'All' : f}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700 flex items-center gap-3 mb-8 animate-fade-in">
                <div className="p-2 bg-red-100 rounded-full shrink-0"><AlertCircle className="w-5 h-5 text-red-600" /></div>
                <p className="font-medium">{error}</p>
                <Link to="/login" className="ml-auto text-red-600 font-semibold hover:underline shrink-0">Sign in again</Link>
              </div>
            )}

            {/* ─── OVERVIEW ─── */}
            {activeSection === 'overview' && (
              <div className="space-y-6 animate-fade-in-up">

                {/* Stat cards row 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
                  <StatCard icon={Receipt} label="Total Invoices" value={loading ? '-' : (summary?.invoicesCount ?? invoices.length)} helper={loading ? 'Loading…' : `${summary?.paidInvoicesCount ?? 0} paid`} />
                  <StatCard icon={CheckCircle} label="Amount Paid" value={loading ? '-' : (summary?.totalPaidFormatted ?? 'Rs. 0.00')} helper={loading ? 'Loading…' : `${summary?.paidInvoicesCount ?? 0} invoice${(summary?.paidInvoicesCount ?? 0) !== 1 ? 's' : ''} cleared`} tone="success" />
                  <StatCard icon={Clock} label="Amount Due" value={loading ? '-' : (summary?.totalUnpaidFormatted ?? 'Rs. 0.00')} helper={loading ? 'Loading…' : summary?.unpaidInvoicesCount ? `${summary.unpaidInvoicesCount} unpaid` : 'All clear'} tone="warning" />
                  <StatCard icon={FolderOpen} label="Deliverables" value={loading ? '-' : (summary?.deliverablesCount ?? deliverables.length)} helper="Available to you" />
                </div>

                {/* Stat cards row 2 — secondary strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
                  {/* Payment progress */}
                  <div className="admin-card-glass rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-50 border border-primary-200/60 flex items-center justify-center shrink-0">
                      <Target className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wider text-primary-500 mb-0.5">Payment Rate</p>
                      {loading ? <div className="h-6 w-16 bg-primary-100 rounded animate-pulse" /> : (
                        <>
                          <p className="text-2xl font-extrabold text-primary-950 tabular-nums">{paidPct}%</p>
                          <div className="mt-1.5 h-1.5 bg-primary-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-700 ${paidPct >= 80 ? 'bg-emerald-500' : paidPct >= 50 ? 'bg-amber-500' : 'bg-red-400'}`} style={{ width: `${paidPct}%` }} />
                          </div>
                          <p className="text-[10px] text-primary-500 mt-1">{paidPct >= 80 ? 'Excellent' : paidPct >= 50 ? 'In progress' : 'Getting started'}</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Overdue alert */}
                  <div className={`rounded-2xl p-5 flex items-center gap-4 border ${(summary?.overdueInvoicesCount ?? 0) > 0 ? 'bg-red-50 border-red-200' : 'admin-card-glass border-primary-200/60'}`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${(summary?.overdueInvoicesCount ?? 0) > 0 ? 'bg-red-100 border border-red-200' : 'bg-primary-50 border border-primary-200/60'}`}>
                      <AlertCircle className={`w-5 h-5 ${(summary?.overdueInvoicesCount ?? 0) > 0 ? 'text-red-600' : 'text-primary-400'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${(summary?.overdueInvoicesCount ?? 0) > 0 ? 'text-red-500' : 'text-primary-500'}`}>Overdue</p>
                      {loading ? <div className="h-6 w-12 bg-primary-100 rounded animate-pulse" /> : (
                        <>
                          <p className={`text-2xl font-extrabold tabular-nums ${(summary?.overdueInvoicesCount ?? 0) > 0 ? 'text-red-700' : 'text-primary-950'}`}>{summary?.overdueInvoicesCount ?? 0}</p>
                          <p className={`text-[10px] mt-0.5 ${(summary?.overdueInvoicesCount ?? 0) > 0 ? 'text-red-600 font-semibold' : 'text-primary-500'}`}>
                            {(summary?.overdueInvoicesCount ?? 0) > 0 ? 'Please settle overdue invoices' : 'No overdue invoices'}
                          </p>
                          {(summary?.overdueInvoicesCount ?? 0) > 0 && (
                            <button type="button" onClick={() => { setInvoiceFilter('Overdue'); setActiveSection('invoices'); }} className="mt-1 text-[10px] font-bold text-red-600 hover:text-red-700 underline underline-offset-2">View overdue →</button>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Next due */}
                  <div className="admin-card-glass rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-50 border border-primary-200/60 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wider text-primary-500 mb-0.5">Next Due</p>
                      {loading ? <div className="h-6 w-24 bg-primary-100 rounded animate-pulse" /> : summary?.nextDueInvoice ? (
                        <>
                          <p className="text-base font-extrabold text-primary-950 truncate">{summary.nextDueInvoice.amountFormatted}</p>
                          <p className="text-[10px] text-primary-500 mt-0.5">{summary.nextDueInvoice.invoiceId} · {formatDate(summary.nextDueInvoice.dueDate)}</p>
                          {daysUntil(summary.nextDueInvoice.dueDate) !== null && (
                            <p className={`text-[10px] font-bold mt-0.5 ${daysUntil(summary.nextDueInvoice.dueDate) <= 7 ? 'text-amber-600' : 'text-primary-400'}`}>
                              {daysUntil(summary.nextDueInvoice.dueDate) === 0 ? 'Due today!' : `${daysUntil(summary.nextDueInvoice.dueDate)} day${daysUntil(summary.nextDueInvoice.dueDate) !== 1 ? 's' : ''} left`}
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-sm font-semibold text-primary-950">No upcoming due</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recent activity | Summary card */}
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 admin-card-glass rounded-2xl overflow-hidden flex flex-col min-h-[280px]">
                    <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-primary-100 flex items-center justify-between gap-2 flex-wrap">
                      <h2 className="text-base font-bold text-primary-950 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary-500" />
                        Recent Invoices
                      </h2>
                      <button type="button" onClick={() => setActiveSection('invoices')} className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors py-2 px-3 -my-2 -mx-3 rounded-lg">
                        View all <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex-1 flex flex-col min-h-0">
                      {loading ? (
                        <div className="flex-1 flex items-center justify-center py-12"><div className="w-10 h-10 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" /></div>
                      ) : invoices.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                          <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mb-4"><Receipt className="w-7 h-7 text-primary-500" /></div>
                          <p className="font-semibold text-primary-950 text-lg">No invoices yet</p>
                          <p className="text-primary-600/80 text-sm max-w-xs mt-1 mb-5">Invoices for your account will appear here.</p>
                          <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-5 py-2.5 shadow-md shadow-primary-500/20 transition-all">Contact us</Link>
                        </div>
                      ) : (
                        <div className="overflow-x-auto admin-scroll">
                          <table className="w-full min-w-[400px] text-left text-sm">
                            <thead className="bg-primary-50/50 border-b border-primary-100">
                              <tr>
                                <th className="px-4 sm:px-6 py-2 sm:py-3 font-semibold text-primary-700 text-xs uppercase tracking-wider">Invoice</th>
                                <th className="px-4 sm:px-6 py-2 sm:py-3 font-semibold text-primary-700 text-xs uppercase tracking-wider">Due</th>
                                <th className="px-4 sm:px-6 py-2 sm:py-3 font-semibold text-primary-700 text-xs uppercase tracking-wider text-right">Amount</th>
                                <th className="px-4 sm:px-6 py-2 sm:py-3 font-semibold text-primary-700 text-xs uppercase tracking-wider text-center">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-primary-100/50">
                              {invoices.slice(0, 5).map((inv) => (
                                <tr key={inv.id} className="hover:bg-primary-50/30 transition-colors">
                                  <td className="px-4 sm:px-6 py-2 sm:py-3">
                                    <p className="font-semibold text-primary-950">{inv.invoiceId}</p>
                                    <p className="text-xs text-primary-500">{formatDate(inv.invoiceDate)}</p>
                                  </td>
                                  <td className="px-4 sm:px-6 py-2 sm:py-3 text-primary-600 whitespace-nowrap">{formatDate(inv.dueDate)}</td>
                                  <td className="px-4 sm:px-6 py-2 sm:py-3 text-right font-semibold text-primary-950 whitespace-nowrap">{inv.amountFormatted}</td>
                                  <td className="px-4 sm:px-6 py-2 sm:py-3 text-center"><StatusPill status={inv.status} /></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Account Health card */}
                  <div className="bg-primary-900 text-white rounded-2xl p-6 shadow-xl shadow-primary-900/20 relative overflow-hidden flex flex-col min-h-[320px] border border-primary-800/50">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                    <div className="relative z-10 flex flex-col flex-1">
                      <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center mb-4 border border-white/10">
                        <ShieldCheck className="w-5 h-5 text-primary-300" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">Account Health</h3>
                      {loading ? <p className="text-primary-200 text-sm">Loading…</p> : (
                        <>
                          {/* Score */}
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`text-3xl font-black tabular-nums ${paidPct >= 80 ? 'text-emerald-400' : paidPct >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{paidPct}%</div>
                            <div>
                              <p className={`text-xs font-bold uppercase tracking-wider ${paidPct >= 80 ? 'text-emerald-400' : paidPct >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                                {paidPct >= 80 ? 'Excellent' : paidPct >= 50 ? 'Good' : 'Needs attention'}
                              </p>
                              <p className="text-primary-300 text-xs">Payment rate</p>
                            </div>
                          </div>

                          {/* Paid / Due breakdown */}
                          {invoices.length > 0 && (
                            <div className="mb-4 space-y-2">
                              <div className="flex justify-between text-xs">
                                <span className="text-primary-300">Total billed</span>
                                <span className="font-semibold text-white">{summary?.totalBilledFormatted ?? '-'}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-emerald-300">Paid</span>
                                <span className="font-semibold text-emerald-300">{summary?.totalPaidFormatted ?? '-'}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-amber-300">Outstanding</span>
                                <span className="font-semibold text-amber-300">{summary?.totalUnpaidFormatted ?? '-'}</span>
                              </div>
                              <div className="h-2 bg-white/10 rounded-full overflow-hidden mt-1">
                                <div className={`h-full rounded-full transition-all duration-700 ${paidPct >= 80 ? 'bg-emerald-400' : paidPct >= 50 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${paidPct}%` }} />
                              </div>
                            </div>
                          )}

                          {/* Dynamic tips */}
                          <ul className="space-y-2 text-sm flex-1">
                            {(summary?.overdueInvoicesCount ?? 0) > 0 && (
                              <li className="flex items-start gap-2 text-red-300">
                                <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                <span>{summary.overdueInvoicesCount} overdue invoice{summary.overdueInvoicesCount !== 1 ? 's' : ''} — please settle soon</span>
                              </li>
                            )}
                            {summary?.nextDueInvoice && (
                              <li className="flex items-start gap-2 text-amber-300">
                                <Calendar className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                <span>Next due: {summary.nextDueInvoice.amountFormatted} on {formatDate(summary.nextDueInvoice.dueDate)}</span>
                              </li>
                            )}
                            {paidPct === 100 && invoices.length > 0 && (
                              <li className="flex items-start gap-2 text-emerald-300">
                                <CheckCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                <span>All invoices cleared — thank you!</span>
                              </li>
                            )}
                            <li className="flex items-start gap-2 text-primary-300">
                              <Download className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                              <span>Download invoice PDFs from the Invoices tab</span>
                            </li>
                          </ul>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="admin-card-glass rounded-2xl p-5 sm:p-6">
                  <h2 className="text-base font-bold text-primary-950 flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-primary-500" />
                    Quick Actions
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'View Invoices', icon: Receipt, onClick: () => setActiveSection('invoices'), badge: summary?.unpaidInvoicesCount > 0 ? summary.unpaidInvoicesCount : null, badgeColor: 'amber' },
                      { label: 'My Projects', icon: FolderOpen, onClick: () => setActiveSection('projects') },
                      { label: 'Deliverables', icon: FileText, onClick: () => setActiveSection('deliverables') },
                      { label: 'Contact Us', icon: Mail, href: '/contact' },
                    ].map((action) => (
                      action.href ? (
                        <Link key={action.label} to={action.href} className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-primary-200 bg-primary-50 hover:bg-primary-100 hover:border-primary-300 transition-all group">
                          <div className="w-10 h-10 rounded-xl bg-white border border-primary-200 text-primary-600 flex items-center justify-center group-hover:border-primary-300 transition-colors">
                            <action.icon className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-semibold text-primary-800 text-center">{action.label}</span>
                        </Link>
                      ) : (
                        <button key={action.label} type="button" onClick={action.onClick} className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-primary-200 bg-primary-50 hover:bg-primary-100 hover:border-primary-300 transition-all group">
                          <div className="w-10 h-10 rounded-xl bg-white border border-primary-200 text-primary-600 flex items-center justify-center group-hover:border-primary-300 transition-colors relative">
                            <action.icon className="w-5 h-5" />
                            {action.badge && (
                              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">{action.badge}</span>
                            )}
                          </div>
                          <span className="text-sm font-semibold text-primary-800 text-center">{action.label}</span>
                        </button>
                      )
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ─── INVOICES ─── */}
            {activeSection === 'invoices' && (
              <div className="space-y-4 animate-fade-in-up">
                {loading ? (
                  <div className="admin-card-glass rounded-2xl flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                  </div>
                ) : filteredInvoices.length === 0 ? (
                  <div className="admin-card-glass rounded-2xl flex flex-col items-center justify-center py-20 px-4 text-center">
                    <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-6"><Receipt className="w-10 h-10 text-primary-400" /></div>
                    <h3 className="text-xl font-bold text-primary-950 mb-2">No invoices found</h3>
                    <p className="text-primary-700/80 max-w-md mx-auto mb-8">{invoiceFilter === 'all' ? 'No invoices yet.' : `No ${invoiceFilter.toLowerCase()} invoices.`}</p>
                    <Link to="/contact" className="px-6 py-3 rounded-full bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/25">Contact us</Link>
                  </div>
                ) : (
                  filteredInvoices.map((inv) => {
                    const isExpanded = expandedInvoice === inv.id;
                    const hasTerms = inv.paymentTerms && inv.paymentTerms.length > 0;
                    const days = daysUntil(inv.dueDate);
                    return (
                      <div key={inv.id} className="admin-card-glass rounded-2xl overflow-hidden border border-primary-100">
                        {/* Invoice row */}
                        <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
                          {/* ID + dates */}
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 font-bold text-xs flex items-center justify-center shrink-0">
                              <Receipt className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-bold text-primary-950">{inv.invoiceId}</p>
                                <StatusPill status={inv.status} />
                                {inv.status !== 'Paid' && days !== null && days <= 7 && days >= 0 && (
                                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                    {days === 0 ? 'Due today!' : `${days}d left`}
                                  </span>
                                )}
                                {inv.status !== 'Paid' && days !== null && days < 0 && (
                                  <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">{Math.abs(days)}d overdue</span>
                                )}
                              </div>
                              <p className="text-xs text-primary-500 mt-0.5">
                                Issued {formatDate(inv.invoiceDate)}{inv.dueDate ? ` · Due ${formatDate(inv.dueDate)}` : ''}
                              </p>
                            </div>
                          </div>

                          {/* Amount + actions */}
                          <div className="flex items-center gap-3 shrink-0">
                            <p className="text-lg font-extrabold text-primary-950 tabular-nums">{inv.amountFormatted}</p>
                            {hasTerms && (
                              <button
                                type="button"
                                onClick={() => setExpandedInvoice(isExpanded ? null : inv.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary-200 text-primary-700 text-xs font-semibold hover:bg-primary-50 transition-colors"
                                title="View payment schedule"
                              >
                                <CreditCard className="w-3.5 h-3.5" />
                                Schedule
                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDownloadPdf(inv)}
                              disabled={downloadingId === inv.id}
                              className="p-2 rounded-lg border border-primary-200 text-primary-600 hover:bg-primary-50 hover:border-primary-300 transition-colors disabled:opacity-50"
                              title="Download PDF"
                            >
                              {downloadingId === inv.id
                                ? <div className="w-4 h-4 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                                : <Download className="w-4 h-4" />}
                            </button>
                            {inv.status !== 'Paid' && (
                              <Link to="/contact" className="px-4 py-2 rounded-lg bg-primary-600 text-white text-xs font-semibold hover:bg-primary-700 transition-colors whitespace-nowrap">
                                Pay / Enquire
                              </Link>
                            )}
                            {inv.dispute?.flagged ? (
                              <span className="px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold flex items-center gap-1">
                                <Flag className="w-3 h-3" /> Disputed
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => { setDisputeInvoiceId(inv.id); setDisputeNote(''); }}
                                className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-600 transition-colors"
                                title="Raise a dispute"
                              >
                                <Flag className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Payment Terms accordion */}
                        {isExpanded && hasTerms && (
                          <div className="border-t border-primary-100 bg-primary-50/40 px-4 sm:px-6 py-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-primary-600 mb-3 flex items-center gap-1.5">
                              <CreditCard className="w-3.5 h-3.5" /> Payment Schedule
                            </p>
                            <div className="space-y-2">
                              {inv.paymentTerms.map((term, i) => {
                                const amt = (inv.amount || 0) * (Number(term.percentage) || 0) / 100;
                                return (
                                  <div key={i} className="flex items-center justify-between gap-4 p-3 rounded-xl bg-white border border-primary-100">
                                    <div className="flex items-center gap-3 min-w-0">
                                      <div className="w-7 h-7 rounded-lg bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</div>
                                      <div className="min-w-0">
                                        <p className="font-semibold text-primary-900 text-sm truncate">{term.label || `Installment ${i + 1}`}</p>
                                        {term.dueDate && <p className="text-xs text-primary-500">Due {formatDate(term.dueDate)}</p>}
                                      </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <p className="font-bold text-primary-950 text-sm tabular-nums">Rs. {amt.toFixed(2)}</p>
                                      <p className="text-xs text-primary-500">{term.percentage}%</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            {inv.notes && (
                              <div className="mt-3 p-3 rounded-xl bg-white border border-primary-100">
                                <p className="text-xs font-bold uppercase tracking-wider text-primary-500 mb-1">Notes</p>
                                <p className="text-sm text-primary-700">{inv.notes}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* ─── PROJECTS ─── */}
            {/* ─── PROJECTS ─── */}
            {activeSection === 'projects' && (
              <div className="space-y-4 animate-fade-in-up">
                {loading ? (
                  <div className="admin-card-glass rounded-2xl flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                  </div>
                ) : projects.length === 0 ? (
                  <div className="admin-card-glass rounded-2xl flex flex-col items-center justify-center py-20 px-4 text-center">
                    <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-6"><FolderKanban className="w-10 h-10 text-primary-400" /></div>
                    <h3 className="text-xl font-bold text-primary-950 mb-2">No projects yet</h3>
                    <p className="text-primary-700/80 max-w-md mx-auto mb-8">Your active projects will appear here once your team creates them.</p>
                    <Link to="/contact" className="px-6 py-3 rounded-full bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/25">Get in touch</Link>
                  </div>
                ) : projects.map((p) => {
                  const statusColors = { planning: 'bg-slate-100 text-slate-700 border-slate-200', 'in-progress': 'bg-blue-50 text-blue-700 border-blue-200', review: 'bg-amber-50 text-amber-700 border-amber-200', completed: 'bg-emerald-50 text-emerald-700 border-emerald-200', 'on-hold': 'bg-red-50 text-red-700 border-red-200' };
                  const completedMs = (p.milestones || []).filter((m) => m.completed).length;
                  return (
                    <div key={p.id} className="admin-card-glass rounded-2xl p-5 sm:p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center shrink-0 font-bold text-base">{(p.name || 'P').charAt(0).toUpperCase()}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-bold text-primary-950">{p.name}</h3>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${statusColors[p.status] || statusColors.planning}`}>{p.status}</span>
                          </div>
                          {p.description && <p className="text-sm text-primary-600/80 mb-2">{p.description}</p>}
                          <div className="flex flex-wrap gap-3 text-xs text-primary-500 mb-3">
                            {p.dueDate && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Due {new Date(p.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}</span>}
                            {p.milestones?.length > 0 && <span>{completedMs}/{p.milestones.length} milestones done</span>}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full transition-all duration-700 ${p.progress === 100 ? 'bg-emerald-500' : 'bg-primary-500'}`} style={{ width: `${p.progress ?? 0}%` }} />
                            </div>
                            <span className="text-sm font-bold text-primary-700 tabular-nums w-9">{p.progress ?? 0}%</span>
                          </div>
                          {p.milestones?.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {p.milestones.map((m, i) => (
                                <span key={i} className={`text-xs px-2.5 py-1 rounded-full border flex items-center gap-1 ${m.completed ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                                  {m.completed ? <CheckSquare className="w-3 h-3" /> : <Square className="w-3 h-3" />}{m.title}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ─── ANNOUNCEMENTS ─── */}
            {activeSection === 'announcements' && (
              <div className="space-y-4 animate-fade-in-up">
                {loading ? (
                  <div className="admin-card-glass rounded-2xl flex items-center justify-center py-20"><div className="w-10 h-10 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" /></div>
                ) : announcements.length === 0 ? (
                  <div className="admin-card-glass rounded-2xl flex flex-col items-center justify-center py-20 px-4 text-center">
                    <Megaphone className="w-14 h-14 text-primary-300 mb-5" />
                    <h3 className="text-xl font-bold text-primary-950 mb-2">No announcements yet</h3>
                    <p className="text-primary-700/80 max-w-sm">Team updates and announcements will appear here.</p>
                  </div>
                ) : (
                  announcements.map((a) => (
                    <div key={a._id} className={`admin-card-glass rounded-2xl p-5 sm:p-6 border ${a.pinned ? 'border-primary-300 bg-primary-50/30' : 'border-primary-100'}`}>
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-9 h-9 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center shrink-0"><Megaphone className="w-4 h-4" /></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            {a.pinned && <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 bg-primary-100 px-2 py-0.5 rounded-full flex items-center gap-1"><Pin className="w-2.5 h-2.5" />Pinned</span>}
                            <h3 className="font-bold text-primary-950">{a.title}</h3>
                          </div>
                          <p className="text-xs text-primary-400">{new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <p className="text-sm text-primary-700/90 leading-relaxed whitespace-pre-wrap pl-12">{a.content}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ─── PROFILE ─── */}
            {activeSection === 'profile' && (
              <div className="space-y-6 animate-fade-in-up max-w-lg">
                {/* Profile info */}
                <div className="admin-card-glass rounded-2xl p-5 sm:p-6">
                  <h2 className="text-base font-bold text-primary-950 mb-5 flex items-center gap-2"><User className="w-5 h-5 text-primary-500" />Personal Info</h2>
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Display Name</label>
                      <input value={profileName} onChange={(e) => setProfileName(e.target.value)} required placeholder="Your name" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none font-medium text-slate-900" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                      <input value={user.email} disabled className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 font-medium cursor-not-allowed" />
                    </div>
                    {profileMsg && <p className={`text-sm flex items-center gap-1 ${profileMsg.includes('updated') ? 'text-emerald-600' : 'text-red-600'}`}><CheckCircle className="w-4 h-4 shrink-0" />{profileMsg}</p>}
                    <button type="submit" disabled={profileSaving} className="px-5 py-2.5 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-50 text-sm flex items-center gap-2">
                      {profileSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <User className="w-4 h-4" />}
                      Save Changes
                    </button>
                  </form>
                </div>

                {/* Change password */}
                <div className="admin-card-glass rounded-2xl p-5 sm:p-6">
                  <h2 className="text-base font-bold text-primary-950 mb-5 flex items-center gap-2"><Lock className="w-5 h-5 text-primary-500" />Change Password</h2>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Current Password</label>
                      <input type="password" value={changePwForm.currentPassword} onChange={(e) => setChangePwForm((p) => ({ ...p, currentPassword: e.target.value }))} required placeholder="Enter current password" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none font-medium text-slate-900" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">New Password</label>
                      <input type="password" value={changePwForm.newPassword} onChange={(e) => setChangePwForm((p) => ({ ...p, newPassword: e.target.value }))} required minLength={8} placeholder="Min 8 characters" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none font-medium text-slate-900" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Confirm New Password</label>
                      <input type="password" value={changePwForm.confirmPassword} onChange={(e) => setChangePwForm((p) => ({ ...p, confirmPassword: e.target.value }))} required placeholder="Repeat new password" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none font-medium text-slate-900" />
                    </div>
                    {changePwError && <p className="text-sm text-red-600 flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" />{changePwError}</p>}
                    {changePwSuccess && <p className="text-sm text-emerald-600 flex items-center gap-2"><CheckCircle className="w-4 h-4 shrink-0" />{changePwSuccess}</p>}
                    <button type="submit" disabled={changePwLoading} className="px-5 py-2.5 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-50 text-sm flex items-center gap-2">
                      {changePwLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Lock className="w-4 h-4" />}
                      Change Password
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Invoice Dispute Modal */}
            {disputeInvoiceId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) { setDisputeInvoiceId(null); setDisputeNote(''); }}}>
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 animate-fade-in-up">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-primary-950 flex items-center gap-2"><Flag className="w-5 h-5 text-amber-500" />Raise Dispute</h2>
                    <button type="button" onClick={() => { setDisputeInvoiceId(null); setDisputeNote(''); }} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400"><XCircle className="w-5 h-5" /></button>
                  </div>
                  <p className="text-sm text-primary-600/80 mb-4">Briefly describe the issue with this invoice. Our team will review and get back to you.</p>
                  <textarea value={disputeNote} onChange={(e) => setDisputeNote(e.target.value)} rows={4} placeholder="Describe the issue…" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none font-medium text-slate-900 resize-none mb-4" />
                  <div className="flex gap-3">
                    <button type="button" onClick={handleDisputeSubmit} disabled={!disputeNote.trim() || !!disputingId} className="flex-1 py-3 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                      {disputingId ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Flag className="w-4 h-4" />}
                      Submit Dispute
                    </button>
                    <button type="button" onClick={() => { setDisputeInvoiceId(null); setDisputeNote(''); }} className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 text-sm">Cancel</button>
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

function StatCard({ icon: Icon, label, value, helper, tone = 'default' }) {
  const toneStyles =
    tone === 'success' ? { bg: 'bg-primary-50/60', border: 'border-primary-200', iconBg: 'bg-primary-100', iconColor: 'text-primary-600' }
    : tone === 'warning' ? { bg: 'bg-amber-50/50', border: 'border-amber-200', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' }
    : { bg: 'bg-white', border: 'border-primary-200/60', iconBg: 'bg-primary-50', iconColor: 'text-primary-600' };

  return (
    <div className={`admin-card-glass rounded-2xl border ${toneStyles.border} ${toneStyles.bg} p-4 sm:p-6 group min-w-0`}>
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${toneStyles.iconBg} flex items-center justify-center ${toneStyles.iconColor} transition-transform group-hover:scale-105 duration-300 shrink-0`}>
          {Icon && <Icon className="w-5 h-5 sm:w-6 sm:h-6" />}
        </div>
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
  const s = typeof status === 'string' ? status.toLowerCase() : '';
  let styles = 'bg-primary-100/60 text-primary-700 border-primary-200';
  let dot = 'bg-primary-500';
  let label = status;
  if (s === 'paid') { styles = 'bg-emerald-50 text-emerald-700 border-emerald-200'; dot = 'bg-emerald-500'; label = 'Paid'; }
  else if (s === 'unpaid') { styles = 'bg-amber-50 text-amber-700 border-amber-200'; dot = 'bg-amber-500'; label = 'Unpaid'; }
  else if (s === 'partially paid' || s === 'partially_paid') { styles = 'bg-blue-50 text-blue-700 border-blue-200'; dot = 'bg-blue-500'; label = 'Partially Paid'; }
  else if (s === 'overdue') { styles = 'bg-red-50 text-red-700 border-red-200'; dot = 'bg-red-500'; label = 'Overdue'; }
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${styles}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
