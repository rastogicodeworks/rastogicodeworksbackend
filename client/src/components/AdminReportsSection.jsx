import { useCallback, useEffect, useState } from 'react';
import {
  RefreshCw,
  Download,
  FileSpreadsheet,
  CalendarRange,
  DollarSign,
  Users,
  Briefcase,
  ClipboardList,
  ListTodo,
  AlertCircle,
} from 'lucide-react';
import API_BASE from '../config/api';
import { getAuthHeaders, clearAuthToken } from '../config/auth';
import { downloadAdminReportPdf } from '../utils/adminReportPdf.js';
import { buildFullReportCsv, downloadCsv } from '../utils/adminReportCsv.js';

function ReportStat({ icon: Icon, label, value, sub }) {
  return (
    <div className="admin-card-glass rounded-2xl border border-primary-200/60 bg-white p-4 sm:p-5 min-w-0">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
          {Icon && <Icon className="w-5 h-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-primary-700/80 truncate">{label}</p>
          <p className="text-lg sm:text-xl font-bold text-primary-950 mt-0.5 break-words">{value}</p>
          {sub && <p className="text-xs text-primary-600/70 mt-1">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  let styles = 'bg-primary-100/60 text-primary-700 border-primary-200';
  let dot = 'bg-primary-500';
  if (status === 'paid') {
    styles = 'bg-primary-50 text-primary-700 border-primary-200';
    dot = 'bg-primary-500';
  } else if (status === 'overdue') {
    styles = 'bg-red-50 text-red-700 border-red-200';
    dot = 'bg-red-500';
  } else if (status === 'unpaid') {
    styles = 'bg-amber-50 text-amber-700 border-amber-200';
    dot = 'bg-amber-500';
  } else if (status === 'partially_paid') {
    styles = 'bg-blue-50 text-blue-700 border-blue-200';
    dot = 'bg-blue-500';
  }
  const label =
    status === 'paid'
      ? 'Paid'
      : status === 'partially_paid'
        ? 'Partially Paid'
        : status === 'overdue'
          ? 'Overdue'
          : status === 'unpaid'
            ? 'Unpaid'
            : status;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

export default function AdminReportsSection({ onError }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [appliedFrom, setAppliedFrom] = useState('');
  const [appliedTo, setAppliedTo] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfBusy, setPdfBusy] = useState(false);

  const load = useCallback(async () => {
    if (!API_BASE) {
      setLoading(false);
      setReport(null);
      return;
    }
    setLoading(true);
    onError?.('');
    try {
      const params = new URLSearchParams();
      if (appliedFrom) params.set('from', appliedFrom);
      if (appliedTo) params.set('to', appliedTo);
      const qs = params.toString();
      const res = await fetch(`${API_BASE}/api/dashboard/admin/report${qs ? `?${qs}` : ''}`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (res.status === 401) {
        clearAuthToken();
        localStorage.removeItem('isAdmin');
        window.location.href = '/login';
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!data.success) {
        onError?.(data.message || 'Could not load report.');
        setReport(null);
        return;
      }
      setReport(data);
    } catch {
      onError?.('Could not load report.');
      setReport(null);
    } finally {
      setLoading(false);
    }
  }, [appliedFrom, appliedTo, onError]);

  useEffect(() => {
    load();
  }, [load]);

  const applyRange = () => {
    setAppliedFrom(from.trim().slice(0, 10));
    setAppliedTo(to.trim().slice(0, 10));
  };

  const clearRange = () => {
    setFrom('');
    setTo('');
    setAppliedFrom('');
    setAppliedTo('');
  };

  const handlePdf = async () => {
    if (!report) return;
    setPdfBusy(true);
    onError?.('');
    try {
      await downloadAdminReportPdf(report);
    } catch {
      onError?.('PDF export failed.');
    } finally {
      setPdfBusy(false);
    }
  };

  const handleCsv = () => {
    if (!report) return;
    const { summary, filters, generatedAt, invoices } = report;
    const csv = buildFullReportCsv(summary, filters, generatedAt, invoices);
    const slug = new Date(generatedAt).toISOString().slice(0, 10);
    downloadCsv(`Rastogi-Codeworks-report-${slug}.csv`, csv);
  };

  const summary = report?.summary;
  const filters = report?.filters;
  const invoices = report?.invoices ?? [];

  const rangeLabel =
    filters?.from || filters?.to
      ? `${filters?.from || '…'} → ${filters?.to || '…'}`
      : 'All time (invoice records by created date)';

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in-up">
      <div className="admin-card-glass rounded-2xl border border-primary-200/70 bg-white/90 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-700 shrink-0">
              <CalendarRange className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-primary-950">Report scope</h2>
              <p className="text-sm text-primary-700/80 mt-0.5 max-w-xl">
                Filter invoices by when the record was created in the system (UTC). Hiring and directory counts are always overall.
              </p>
              <p className="text-xs text-primary-600/80 mt-2 font-medium">Active range: {rangeLabel}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2">
            <label className="flex flex-col gap-1 text-xs font-medium text-primary-800">
              From
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="rounded-xl border border-primary-200 bg-white px-3 py-2 text-sm text-primary-950 focus:ring-2 focus:ring-primary-400/40 focus:border-primary-400"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium text-primary-800">
              To
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="rounded-xl border border-primary-200 bg-white px-3 py-2 text-sm text-primary-950 focus:ring-2 focus:ring-primary-400/40 focus:border-primary-400"
              />
            </label>
            <div className="flex flex-wrap gap-2 sm:ml-1 sm:pt-5">
              <button
                type="button"
                onClick={applyRange}
                className="px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={clearRange}
                className="px-4 py-2 rounded-xl border border-primary-200 bg-white text-primary-800 text-sm font-semibold hover:bg-primary-50"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={load}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-primary-200 bg-white text-primary-800 text-sm font-semibold hover:bg-primary-50 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handlePdf}
          disabled={!report || pdfBusy || loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 shadow-md shadow-primary-500/15 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {pdfBusy ? 'Building PDF…' : 'Download PDF'}
        </button>
        <button
          type="button"
          onClick={handleCsv}
          disabled={!report || loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-primary-200 bg-white text-primary-800 text-sm font-semibold hover:bg-primary-50 disabled:opacity-50"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Download CSV
        </button>
      </div>

      {loading && (
        <div className="rounded-2xl border border-primary-200/60 bg-white/80 px-6 py-12 text-center text-primary-700">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-primary-500" />
          <p className="font-medium">Loading report…</p>
        </div>
      )}

      {!loading && !report && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 px-5 py-4 flex gap-3 text-amber-900 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>No report data. Check your connection or try again.</p>
        </div>
      )}

      {report && summary && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
            <ReportStat
              icon={DollarSign}
              label="Total revenue (in scope)"
              value={`Rs. ${Number(summary.totalRevenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
              sub={`${summary.invoicesCount} invoice${summary.invoicesCount !== 1 ? 's' : ''}`}
            />
            <ReportStat
              icon={DollarSign}
              label="Paid vs outstanding"
              value={`Rs. ${Number(summary.paidRevenue || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })} paid`}
              sub={`Rs. ${Number(summary.pendingRevenue || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })} outstanding`}
            />
            <ReportStat
              icon={AlertCircle}
              label="Attention"
              value={`${summary.overdueCount} overdue`}
              sub={`${summary.unpaidCount} not fully paid (in scope)`}
            />
            <ReportStat
              icon={Users}
              label="Clients & team"
              value={`${summary.clientsCount} clients`}
              sub={`${summary.employeesCount} employees · ${summary.projectsCount} projects`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="admin-card-glass rounded-2xl border border-primary-200/60 bg-white p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-5 h-5 text-primary-600" />
                <h3 className="font-bold text-primary-950">Hiring</h3>
              </div>
              <p className="text-sm text-primary-800">
                <span className="font-semibold">{summary.openJobPostings}</span> open postings ·{' '}
                <span className="font-semibold">{summary.jobPostingsTotal}</span> total ·{' '}
                <span className="font-semibold">{summary.applicationsTotal}</span> applications
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {Object.entries(summary.applicationsByStatus || {}).map(([k, v]) => (
                  <span
                    key={k}
                    className="text-xs font-medium px-2.5 py-1 rounded-lg bg-primary-50 text-primary-800 border border-primary-100"
                  >
                    {k}: {v}
                  </span>
                ))}
                {Object.keys(summary.applicationsByStatus || {}).length === 0 && (
                  <span className="text-xs text-primary-600">No application breakdown</span>
                )}
              </div>
            </div>
            <div className="admin-card-glass rounded-2xl border border-primary-200/60 bg-white p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <ListTodo className="w-5 h-5 text-primary-600" />
                <h3 className="font-bold text-primary-950">Internal tasks</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(summary.tasksByStatus || {}).map(([k, v]) => (
                  <span
                    key={k}
                    className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-50 text-slate-800 border border-slate-200"
                  >
                    {k}: {v}
                  </span>
                ))}
                {Object.keys(summary.tasksByStatus || {}).length === 0 && (
                  <span className="text-xs text-primary-600">No tasks yet</span>
                )}
              </div>
            </div>
          </div>

          <div className="admin-card-glass rounded-2xl border border-primary-200/60 bg-white overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-primary-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-primary-600" />
                <h3 className="font-bold text-primary-950">Invoices in this report</h3>
              </div>
              <p className="text-xs text-primary-600">{invoices.length} row(s)</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[720px]">
                <thead>
                  <tr className="bg-primary-50/80 text-primary-800 text-xs uppercase tracking-wide">
                    <th className="px-4 py-3 font-semibold">Ref</th>
                    <th className="px-4 py-3 font-semibold">Client</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Invoice date</th>
                    <th className="px-4 py-3 font-semibold">Due</th>
                    <th className="px-4 py-3 font-semibold text-right">Total</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary-100">
                  {invoices.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-primary-600">
                        No invoices match this range.
                      </td>
                    </tr>
                  )}
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-primary-50/40 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-primary-900">{inv.invoiceRef}</td>
                      <td className="px-4 py-3 text-primary-900">{inv.clientName || '—'}</td>
                      <td className="px-4 py-3 text-primary-700 text-xs break-all max-w-[200px]">{inv.clientEmail || '—'}</td>
                      <td className="px-4 py-3 text-primary-800 whitespace-nowrap">{inv.invoiceDate || '—'}</td>
                      <td className="px-4 py-3 text-primary-800 whitespace-nowrap">{inv.dueDate || '—'}</td>
                      <td className="px-4 py-3 text-right font-semibold text-primary-950 whitespace-nowrap">
                        Rs. {Number(inv.total || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill status={inv.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
