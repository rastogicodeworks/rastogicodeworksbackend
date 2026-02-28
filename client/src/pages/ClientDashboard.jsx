import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  MessageSquare,
  Receipt,
  LogOut,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Download,
  Mail,
} from 'lucide-react';
import DashboardNavbar from '../components/DashboardNavbar';
import API_BASE from '../config/api';
import { getAuthHeaders, clearAuthToken } from '../config/auth';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'deliverables', label: 'Deliverables', icon: FileText },
  { id: 'invoices', label: 'Invoices', icon: Receipt },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
];

function formatDate(value) {
  if (!value) return '-';
  const d = typeof value === 'string' ? new Date(value) : value;
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
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
  const [invoiceFilter, setInvoiceFilter] = useState('all'); // all | Unpaid | Paid

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function fetchDashboard() {
      if (!API_BASE) {
        setLoading(false);
        return;
      }
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
        if (!res.ok) {
          setError(data.message || 'Failed to load dashboard.');
          setLoading(false);
          return;
        }
        if (data.success && data.data) {
          const { user: u, projects: p, deliverables: d, invoices: i, summary: s } = data.data;
          if (u) setUser({ name: u.name || 'Guest', email: u.email || '' });
          if (Array.isArray(p)) setProjects(p);
          if (Array.isArray(d)) setDeliverables(d);
          if (Array.isArray(i)) setInvoices(i);
          if (s) setSummary(s);
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
    () =>
      invoiceFilter === 'all'
        ? invoices
        : invoices.filter((inv) => inv.status === invoiceFilter),
    [invoices, invoiceFilter],
  );

  const handleLogout = () => {
    if (API_BASE) {
      fetch(`${API_BASE}/api/auth/logout`, { method: 'POST', headers: getAuthHeaders(), credentials: 'include' }).catch(() => {});
    }
    clearAuthToken();
    localStorage.removeItem('isClient');
    localStorage.removeItem('clientName');
    window.location.href = '/login';
  };

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

            {/* Page header  -  same as Admin */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 mb-6 sm:mb-10">
              <div className="min-w-0">
                <h1 className="section-heading text-primary-950 mb-2 text-2xl sm:text-3xl md:text-4xl">
                  {activeSection === 'overview' && 'Dashboard'}
                  {activeSection === 'projects' && 'Projects'}
                  {activeSection === 'deliverables' && 'Deliverables'}
                  {activeSection === 'invoices' && 'Invoices & Payments'}
                  {activeSection === 'messages' && 'Messages'}
                </h1>
                <p className="section-sub text-primary-700/90 max-w-2xl">
                  {activeSection === 'overview' && `Welcome back${user.name !== 'Guest' ? `, ${user.name}` : ''}. Here’s what’s happening with your projects.`}
                  {activeSection === 'projects' && 'Track progress and status of your active projects.'}
                  {activeSection === 'deliverables' && 'View and download deliverables shared with you.'}
                  {activeSection === 'invoices' && 'View your invoices and payment status.'}
                  {activeSection === 'messages' && 'Communicate with your team and view updates.'}
                </p>
              </div>

              {activeSection === 'invoices' && (
                <div className="flex flex-wrap items-center gap-1 p-1.5 rounded-full bg-white/80 border border-primary-200/60 shadow-sm w-full sm:w-auto">
                  {['all', 'Unpaid', 'Paid'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setInvoiceFilter(filter)}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all capitalize ${
                        invoiceFilter === filter
                          ? 'bg-primary-600 text-white shadow-md'
                          : 'text-primary-700/80 hover:bg-primary-50'
                      }`}
                    >
                      {filter === 'all' ? 'All' : filter}
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
                <Link to="/login" className="ml-auto text-red-600 font-semibold hover:underline shrink-0">Sign in again</Link>
              </div>
            )}

            {/* Overview  -  same layout as Admin: stats + grid */}
            {activeSection === 'overview' && (
              <div className="space-y-8 animate-fade-in-up">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
                  <StatCard
                    icon={FolderOpen}
                    label="Active projects"
                    value={loading ? '-' : (summary?.projectsCount ?? projects.length)}
                    helper={loading ? 'Loading…' : `${projects.length} project${projects.length !== 1 ? 's' : ''}`}
                  />
                  <StatCard
                    icon={FileText}
                    label="Deliverables"
                    value={loading ? '-' : (summary?.deliverablesCount ?? deliverables.length)}
                    helper={loading ? 'Loading…' : 'Available to you'}
                  />
                  <StatCard
                    icon={CheckCircle}
                    label="Invoices paid"
                    value={loading ? '-' : (summary?.paidInvoicesCount ?? invoices.filter((i) => i.status === 'Paid').length)}
                    helper={loading ? 'Loading…' : summary?.totalPaidFormatted ? `Total ${summary.totalPaidFormatted}` : ''}
                    tone="success"
                  />
                  <StatCard
                    icon={Clock}
                    label="Amount due"
                    value={loading ? '-' : (summary?.totalUnpaidFormatted ?? 'Rs. 0.00')}
                    helper={loading ? 'Loading…' : summary?.unpaidInvoicesCount ? `${summary.unpaidInvoicesCount} unpaid` : 'All clear'}
                    tone="warning"
                  />
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Recent Activity  -  projects + invoices table like Admin */}
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
                        aria-label="View all invoices"
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
                            <Receipt className="w-7 h-7 text-primary-500" />
                          </div>
                          <p className="font-semibold text-primary-950 text-lg">No invoices yet</p>
                          <p className="text-primary-600/80 text-sm max-w-xs mt-1 mb-5">Invoices for your account will appear here.</p>
                          <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 rounded-full bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-5 py-2.5 shadow-md shadow-primary-500/20 transition-all"
                          >
                            Contact us
                          </Link>
                        </div>
                      ) : (
                        <>
                          {/* Mobile: card list */}
                          <div className="md:hidden overflow-y-auto admin-scroll px-4 pb-4">
                            <ul className="space-y-3">
                              {invoices.slice(0, 5).map((inv) => (
                                <li key={inv.id} className="rounded-xl border border-primary-100 bg-white p-4 shadow-sm active:bg-primary-50/30 transition-colors">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0 flex-1">
                                      <p className="font-semibold text-primary-950">{inv.invoiceId}</p>
                                      <p className="text-xs text-primary-500">Issued {formatDate(inv.invoiceDate)}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <p className="font-semibold text-primary-950 text-sm">{inv.amountFormatted ?? inv.amount}</p>
                                      <StatusPill status={inv.status === 'Paid' ? 'paid' : 'unpaid'} />
                                    </div>
                                  </div>
                                  <p className="text-xs text-primary-600 mt-2 pt-2 border-t border-primary-100">
                                    Due {formatDate(inv.dueDate)}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          </div>
                          {/* Desktop: table */}
                          <div className="hidden md:block overflow-x-auto -mx-4 sm:mx-0 admin-scroll">
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
                                      <div>
                                        <p className="font-semibold text-primary-950">{inv.invoiceId}</p>
                                        <p className="text-xs text-primary-500">Issued {formatDate(inv.invoiceDate)}</p>
                                      </div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-2 sm:py-3 text-primary-600 whitespace-nowrap">{formatDate(inv.dueDate)}</td>
                                    <td className="px-4 sm:px-6 py-2 sm:py-3 text-right font-semibold text-primary-950 whitespace-nowrap">{inv.amountFormatted ?? inv.amount}</td>
                                    <td className="px-4 sm:px-6 py-2 sm:py-3 text-center">
                                      <StatusPill status={inv.status === 'Paid' ? 'paid' : 'unpaid'} />
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

                  {/* Summary card  -  dark like Admin Billing Health */}
                  <div className="bg-primary-900 text-white rounded-2xl p-6 shadow-xl shadow-primary-900/20 relative overflow-hidden flex flex-col min-h-[320px] border border-primary-800/50">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                    <div className="relative z-10 flex flex-col flex-1">
                      <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center mb-4 border border-white/10">
                        <TrendingUp className="w-5 h-5 text-primary-300" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">Your Summary</h3>
                      {loading ? (
                        <p className="text-primary-200 text-sm mb-4">Loading…</p>
                      ) : (
                        <>
                          <p className="text-primary-200 text-sm mb-4">
                            {invoices.length === 0
                              ? 'No invoices yet. When we send you an invoice, it will appear here and in the Invoices section.'
                              : summary?.unpaidInvoicesCount
                                ? `You have ${summary.unpaidInvoicesCount} unpaid invoice${summary.unpaidInvoicesCount !== 1 ? 's' : ''}. Total due: ${summary.totalUnpaidFormatted}.`
                                : 'All your invoices are paid. Thank you!'}
                          </p>
                          {invoices.length > 0 && (
                            <div className="mb-5">
                              <div className="flex justify-between text-xs text-primary-300 mb-1">
                                <span>Paid</span>
                                <span className="font-semibold text-white">{summary?.totalPaidFormatted ?? 'Rs. 0.00'}</span>
                              </div>
                              <div className="flex justify-between text-xs text-primary-300 mb-1">
                                <span>Due</span>
                                <span className="font-semibold text-white">{summary?.totalUnpaidFormatted ?? 'Rs. 0.00'}</span>
                              </div>
                            </div>
                          )}
                          <ul className="space-y-2.5 text-sm text-primary-200 flex-1">
                            <li className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                              View invoices in the Invoices tab
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                              Contact us for payment options
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                              Download deliverables when shared
                            </li>
                          </ul>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Projects */}
            {activeSection === 'projects' && (
              <div className="admin-card-glass rounded-2xl overflow-hidden animate-fade-in-up">
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                  </div>
                ) : projects.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                    <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-6">
                      <FolderOpen className="w-10 h-10 text-primary-400" />
                    </div>
                    <h3 className="text-xl font-bold text-primary-950 mb-2">No projects yet</h3>
                    <p className="text-primary-700/80 max-w-md mx-auto mb-8">Your active projects will appear here.</p>
                    <Link to="/contact" className="px-6 py-3 rounded-full bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/25">
                      Get in touch
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-primary-100/50">
                    {projects.map((p) => (
                      <div key={p.id} className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 hover:bg-primary-50/30 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-primary-950">{p.name}</h3>
                          <p className="text-sm text-primary-600/80 mt-1">Last update: {p.lastUpdate}</p>
                        </div>
                        <div className="flex items-center gap-4 flex-wrap">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-primary-50 text-primary-700 border border-primary-200/60">
                            {p.status}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-primary-500 rounded-full transition-all duration-500" style={{ width: `${p.progress ?? 0}%` }} />
                            </div>
                            <span className="text-sm font-semibold text-primary-700 tabular-nums w-8">{p.progress ?? 0}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Deliverables */}
            {activeSection === 'deliverables' && (
              <div className="admin-card-glass rounded-2xl overflow-hidden animate-fade-in-up">
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                  </div>
                ) : deliverables.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                    <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-6">
                      <FileText className="w-10 h-10 text-primary-400" />
                    </div>
                    <h3 className="text-xl font-bold text-primary-950 mb-2">No deliverables yet</h3>
                    <p className="text-primary-700/80 max-w-md mx-auto mb-8">Deliverables will appear here when shared with you.</p>
                    <Link to="/contact" className="px-6 py-3 rounded-full bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/25">
                      Get in touch
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto admin-scroll -mx-3 sm:mx-0">
                    <table className="w-full min-w-[500px] text-left border-collapse">
                      <thead>
                        <tr className="bg-primary-50/80 border-b border-primary-200/60 text-xs font-bold uppercase tracking-wider text-primary-700">
                          <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-5">Deliverable</th>
                          <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-5">Project</th>
                          <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-5">Date</th>
                          <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-5">Type</th>
                          <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-primary-100/50">
                        {deliverables.map((d) => (
                          <tr key={d.id} className="hover:bg-primary-50/30 transition-colors">
                            <td className="px-4 sm:px-6 md:px-8 py-3 sm:py-5">
                              <p className="font-bold text-primary-950">{d.title}</p>
                            </td>
                            <td className="px-4 sm:px-6 md:px-8 py-3 sm:py-5 text-primary-700/80">{d.project}</td>
                            <td className="px-4 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap text-primary-700/80">{formatDate(d.date)}</td>
                            <td className="px-4 sm:px-6 md:px-8 py-3 sm:py-5">
                              <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-bold bg-primary-50 text-primary-700 border border-primary-200/60">{d.type}</span>
                            </td>
                            <td className="px-4 sm:px-6 md:px-8 py-3 sm:py-5 text-right">
                              <button type="button" className="p-2 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors" aria-label="Download">
                                <Download className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Invoices */}
            {activeSection === 'invoices' && (
              <div className="admin-card-glass rounded-2xl overflow-hidden animate-fade-in-up">
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                  </div>
                ) : filteredInvoices.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                    <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-6">
                      <Receipt className="w-10 h-10 text-primary-400" />
                    </div>
                    <h3 className="text-xl font-bold text-primary-950 mb-2">No invoices found</h3>
                    <p className="text-primary-700/80 max-w-md mx-auto mb-8">
                      {invoiceFilter === 'all' ? 'No invoices yet. Invoices for your account will appear here.' : `No ${invoiceFilter.toLowerCase()} invoices.`}
                    </p>
                    <Link to="/contact" className="px-6 py-3 rounded-full bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/25">
                      Contact us
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto admin-scroll -mx-3 sm:mx-0">
                    <table className="w-full min-w-[640px] text-left border-collapse">
                      <thead>
                        <tr className="bg-primary-50/80 border-b border-primary-200/60 text-xs font-bold uppercase tracking-wider text-primary-700">
                          <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-5">Invoice</th>
                          <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap">Issued</th>
                          <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap">Due</th>
                          <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-5 text-right whitespace-nowrap">Amount</th>
                          <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-5 text-center">Status</th>
                          <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-primary-100/50">
                        {filteredInvoices.map((inv) => (
                          <tr key={inv.id} className="group hover:bg-primary-50/30 transition-colors">
                            <td className="px-4 sm:px-6 md:px-8 py-3 sm:py-5">
                              <div>
                                <p className="font-bold text-primary-950 text-sm">{inv.invoiceId}</p>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap text-sm font-medium text-primary-700/80">{formatDate(inv.invoiceDate)}</td>
                            <td className="px-4 sm:px-6 md:px-8 py-3 sm:py-5 whitespace-nowrap text-sm font-medium text-primary-700/80">{formatDate(inv.dueDate)}</td>
                            <td className="px-4 sm:px-6 md:px-8 py-3 sm:py-5 text-right whitespace-nowrap text-sm font-bold text-primary-950">{inv.amountFormatted ?? inv.amount}</td>
                            <td className="px-4 sm:px-6 md:px-8 py-3 sm:py-5 text-center">
                              <StatusPill status={inv.status === 'Paid' ? 'paid' : 'unpaid'} />
                            </td>
                            <td className="px-4 sm:px-6 md:px-8 py-3 sm:py-5 text-right">
                              {inv.status === 'Unpaid' && (
                                <Link
                                  to="/contact"
                                  className="inline-flex px-4 py-2 rounded-full text-xs font-semibold bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                                >
                                  Pay / Enquire
                                </Link>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Messages  -  empty state like Admin Clients/Settings */}
            {activeSection === 'messages' && (
              <div className="flex flex-col items-center justify-center min-h-[50vh] admin-card-glass rounded-2xl animate-fade-in-up">
                <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-6">
                  <Mail className="w-10 h-10 text-primary-500" />
                </div>
                <h2 className="text-2xl font-bold text-primary-950 mb-2">No messages yet</h2>
                <p className="text-primary-700/80 max-w-md text-center mb-8">
                  When your team sends updates or messages, they’ll appear here. You can also start a conversation.
                </p>
                <Link
                  to="/contact"
                  className="px-6 py-2.5 rounded-full border border-primary-200 text-primary-700 font-semibold hover:bg-primary-50 transition-all"
                >
                  Contact us
                </Link>
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
  if (status === 'unpaid') {
    styles = 'bg-amber-50 text-amber-700 border-amber-200';
    dotColor = 'bg-amber-500';
  }
  const label = status === 'paid' ? 'Paid' : status === 'unpaid' ? 'Unpaid' : status;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${styles}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {label}
    </span>
  );
}
