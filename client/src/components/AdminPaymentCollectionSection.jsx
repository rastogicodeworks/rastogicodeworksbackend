import { useEffect, useMemo, useState } from 'react';
import {
  Wallet,
  Plus,
  Trash2,
  RefreshCw,
  Edit3,
  IndianRupee,
  Calendar,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import API_BASE from '../config/api';
import { getAuthHeaders, clearAuthToken } from '../config/auth';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'partial', label: 'Partial' },
  { value: 'collected', label: 'Collected' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'cancelled', label: 'Cancelled' },
];

const FILTER_OPTIONS = [{ value: 'all', label: 'All' }, ...STATUS_OPTIONS];

const emptyForm = {
  clientName: '',
  clientEmail: '',
  description: '',
  amount: '',
  collectedAmount: '',
  dueDate: '',
  notes: '',
  status: 'pending',
};

function formatInr(n) {
  const v = Number(n) || 0;
  return `₹${v.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

function findClientInvoices(invoices, row) {
  const email = (row.clientEmail || '').trim().toLowerCase();
  const name = (row.clientName || '').trim().toLowerCase();
  return invoices.filter((inv) => {
    if (email && inv.clientEmail?.toLowerCase() === email) return true;
    return (inv.clientName || '').trim().toLowerCase() === name;
  });
}

/** Match a payment-collection row to an invoice installment by amount (₹). */
function matchTermForRow(row, inv) {
  const invoiceTotal = Number(inv.total) || 0;
  const rowAmount = Number(row.amount) || 0;
  if (invoiceTotal <= 0 || rowAmount <= 0) return null;
  const terms = (inv.paymentTerms || []).filter((t) => Number(t.percentage) > 0);
  const exact = terms.find((t) => Math.abs((invoiceTotal * Number(t.percentage)) / 100 - rowAmount) < 1);
  if (exact) return exact;
  if (terms.length === 1) return terms[0];
  return null;
}

function enrichCollectionRow(row, invoices) {
  const savedDesc = (row.description || '').trim();
  const savedDue = (row.dueDate || '').trim();
  if (savedDesc && savedDue) {
    return { ...row, displayDescription: savedDesc, displayDueDate: savedDue, invoiceHint: false };
  }
  for (const inv of findClientInvoices(invoices, row)) {
    const term = matchTermForRow(row, inv);
    if (term) {
      return {
        ...row,
        displayDescription: savedDesc || (term.label || '').trim() || '—',
        displayDueDate: savedDue || (term.dueDate || '').trim(),
        invoiceHint: !savedDesc || !savedDue,
      };
    }
  }
  return {
    ...row,
    displayDescription: savedDesc || '—',
    displayDueDate: savedDue,
    invoiceHint: false,
  };
}

function statusBadgeClass(status) {
  switch (status) {
    case 'collected':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'partial':
      return 'bg-amber-100 text-amber-900 border-amber-200';
    case 'overdue':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'cancelled':
      return 'bg-slate-100 text-slate-600 border-slate-200';
    default:
      return 'bg-primary-100 text-primary-800 border-primary-200';
  }
}

export default function AdminPaymentCollectionSection({ onError }) {
  const [collections, setCollections] = useState([]);
  const [summary, setSummary] = useState({ totalExpected: 0, totalCollected: 0, totalRemaining: 0 });
  const [clients, setClients] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const authFetch = async (path, options = {}) => {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders(), ...options.headers },
      credentials: 'include',
    });
    if (res.status === 401) {
      clearAuthToken();
      localStorage.removeItem('isAdmin');
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    return res;
  };

  const loadAll = async () => {
    if (!API_BASE) return;
    setLoading(true);
    try {
      const q = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const [cr, clr, ir] = await Promise.all([
        authFetch(`/api/payment-collections${q}`),
        authFetch('/api/clients'),
        authFetch('/api/invoices'),
      ]);
      const [cd, cld, id] = await Promise.all([
        cr.json().catch(() => ({})),
        clr.json().catch(() => ({})),
        ir.json().catch(() => ({})),
      ]);
      if (cd.success) {
        setCollections(cd.collections || []);
        setSummary(cd.summary || { totalExpected: 0, totalCollected: 0, totalRemaining: 0 });
      }
      if (cld.success) setClients(cld.clients || []);
      if (id.success) setInvoices(id.invoices || []);
    } catch (e) {
      onError?.(e.message || 'Failed to load payment collections.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [statusFilter]);

  const displayRows = useMemo(
    () => collections.map((row) => enrichCollectionRow(row, invoices)),
    [collections, invoices],
  );

  const filteredBySearch = useMemo(() => displayRows, [displayRows]);

  const syncFromInvoices = async () => {
    setSyncing(true);
    try {
      let updated = 0;
      for (const row of collections) {
        const invs = findClientInvoices(invoices, row);
        let label = '';
        let dueDate = '';
        for (const inv of invs) {
          const term = matchTermForRow(row, inv);
          if (term) {
            label = (term.label || '').trim();
            dueDate = (term.dueDate || '').trim();
            break;
          }
        }
        if (!label && !dueDate) continue;
        const body = {};
        if (label && !(row.description || '').trim()) body.description = label;
        if (dueDate && !(row.dueDate || '').trim()) body.dueDate = dueDate;
        if (Object.keys(body).length === 0) continue;
        const res = await authFetch(`/api/payment-collections/${row._id}`, {
          method: 'PATCH',
          body: JSON.stringify(body),
        });
        if (res.ok) updated += 1;
      }
      await loadAll();
      if (updated === 0) {
        onError?.('No matching invoice milestones found, or fields are already filled.');
      }
    } catch (err) {
      onError?.(err.message || 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (row) => {
    setEditingId(row._id);
    setShowForm(true);
    setForm({
      clientName: row.clientName || '',
      clientEmail: row.clientEmail || '',
      description: row.description || '',
      amount: String(row.amount ?? ''),
      collectedAmount: String(row.collectedAmount ?? ''),
      dueDate: row.dueDate || '',
      notes: row.notes || '',
      status: row.status || 'pending',
    });
  };

  const handleClientPick = (email) => {
    const c = clients.find((x) => x.email === email);
    if (!c) return;
    setForm((f) => ({
      ...f,
      clientEmail: c.email,
      clientName: c.name || c.email,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.clientName.trim()) {
      onError?.('Client name is required.');
      return;
    }
    const amount = Number(form.amount);
    if (!amount || amount <= 0) {
      onError?.('Enter a valid amount to collect.');
      return;
    }
    setSaving(true);
    try {
      const body = {
        clientName: form.clientName.trim(),
        clientEmail: form.clientEmail.trim(),
        description: form.description.trim(),
        amount,
        collectedAmount: Number(form.collectedAmount) || 0,
        dueDate: form.dueDate,
        notes: form.notes.trim(),
        status: form.status,
      };
      const res = await authFetch(
        editingId ? `/api/payment-collections/${editingId}` : '/api/payment-collections',
        { method: editingId ? 'PATCH' : 'POST', body: JSON.stringify(body) },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Save failed');
      resetForm();
      loadAll();
    } catch (err) {
      onError?.(err.message);
    } finally {
      setSaving(false);
    }
  };

  const recordPayment = async (row, addAmount) => {
    const add = Number(addAmount);
    if (!add || add <= 0) return;
    const nextCollected = (Number(row.collectedAmount) || 0) + add;
    try {
      const res = await authFetch(`/api/payment-collections/${row._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ collectedAmount: nextCollected }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Update failed');
      loadAll();
    } catch (err) {
      onError?.(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this payment collection entry?')) return;
    try {
      const res = await authFetch(`/api/payment-collections/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Delete failed');
      }
      if (editingId === id) resetForm();
      loadAll();
    } catch (err) {
      onError?.(err.message);
    }
  };

  if (!API_BASE) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        API not configured.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="rounded-2xl border border-primary-200/80 bg-primary-50/50 px-4 py-3 text-sm text-primary-900">
        <p className="font-semibold text-primary-950 mb-1">Track upcoming & remaining payments</p>
        <p className="text-primary-800/90 leading-relaxed">
          Log expected amounts per client. <strong>Description</strong> and <strong>Due</strong> come from the form, or
          auto-fill from invoice payment milestones (use <strong>Sync from invoices</strong>).
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { label: 'Total to collect', value: summary.totalExpected, icon: IndianRupee, tone: 'text-red-700' },
          { label: 'Collected so far', value: summary.totalCollected, icon: CheckCircle, tone: 'text-emerald-700' },
        ].map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="admin-card-glass rounded-2xl p-5 border border-primary-200/40">
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-5 h-5 ${tone}`} />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span>
            </div>
            <p className={`text-2xl font-bold ${tone}`}>{formatInr(value)}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1 p-1 rounded-full bg-white/80 border border-primary-200/60">
          {FILTER_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setStatusFilter(value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
                statusFilter === value
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-primary-800 hover:bg-primary-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 shadow-md shadow-primary-500/20"
        >
          <Plus className="w-4 h-4" />
          Add collection
        </button>
        <button
          type="button"
          onClick={syncFromInvoices}
          disabled={syncing || collections.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary-200 bg-white text-sm font-semibold text-primary-800 hover:bg-primary-50 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          Sync from invoices
        </button>
        <button
          type="button"
          onClick={loadAll}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-100 ml-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-card-glass rounded-2xl p-5 sm:p-6 border border-primary-200/40 space-y-4">
          <h2 className="text-lg font-bold text-primary-950 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary-600" />
            {editingId ? 'Edit payment entry' : 'New payment to collect'}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Client (from portal)</label>
              <select
                value={form.clientEmail}
                onChange={(e) => handleClientPick(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
              >
                <option value="">— Select or type below —</option>
                {clients.map((c) => (
                  <option key={c._id} value={c.email}>
                    {c.name || c.email} ({c.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Client name *</label>
              <input
                required
                value={form.clientName}
                onChange={(e) => setForm((f) => ({ ...f, clientName: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                placeholder="Company or contact name"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Client email</label>
              <input
                type="email"
                value={form.clientEmail}
                onChange={(e) => setForm((f) => ({ ...f, clientEmail: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Amount to collect (₹) *</label>
              <input
                required
                type="number"
                min="0"
                step="1"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Already collected (₹)</label>
              <input
                type="number"
                min="0"
                step="1"
                value={form.collectedAmount}
                onChange={(e) => setForm((f) => ({ ...f, collectedAmount: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Due / expected date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Description (milestone / invoice note)</label>
              <input
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                placeholder="e.g. Phase 2 delivery, maintenance retainer"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Internal notes</label>
              <textarea
                rows={2}
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm resize-y"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 disabled:opacity-60"
            >
              {saving ? 'Saving…' : editingId ? 'Update entry' : 'Add entry'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="admin-card-glass rounded-2xl border border-primary-200/40 overflow-hidden">
        {loading ? (
          <p className="p-8 text-center text-sm text-slate-500">Loading payment collections…</p>
        ) : filteredBySearch.length === 0 ? (
          <div className="p-10 text-center">
            <Wallet className="w-12 h-12 text-primary-300 mx-auto mb-3" />
            <p className="font-semibold text-primary-950">No entries yet</p>
            <p className="text-sm text-slate-500 mt-1">Add expected payments per client to track what is still due.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-primary-100 bg-primary-50/60 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Due</th>
                  <th className="px-4 py-3 text-right">Expected</th>
                  <th className="px-4 py-3 text-right">Collected</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBySearch.map((row) => (
                  <tr key={row._id} className="border-b border-slate-100 hover:bg-primary-50/30">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-primary-950">{row.clientName}</p>
                      {row.clientEmail && (
                        <p className="text-xs text-slate-500 truncate max-w-[10rem]">{row.clientEmail}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-700 max-w-[12rem] truncate" title={row.displayDescription}>
                      <span className={row.invoiceHint ? 'text-primary-800' : ''}>{row.displayDescription}</span>
                      {row.invoiceHint && row.displayDescription !== '—' && (
                        <span className="block text-[10px] text-primary-500 font-medium">from invoice</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {row.displayDueDate ? (
                        <span className="inline-flex items-center gap-1 text-slate-700">
                          <Calendar className="w-3.5 h-3.5 text-primary-500" />
                          {row.displayDueDate}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{formatInr(row.amount)}</td>
                    <td className="px-4 py-3 text-right text-emerald-700">{formatInr(row.collectedAmount)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border capitalize ${statusBadgeClass(row.status)}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 flex-wrap">
                        {row.status !== 'collected' && row.status !== 'cancelled' && row.remaining > 0 && (
                          <button
                            type="button"
                            title="Mark full remaining as collected"
                            onClick={() => recordPayment(row, row.remaining)}
                            className="p-2 rounded-lg text-emerald-700 hover:bg-emerald-50"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => startEdit(row)}
                          className="p-2 rounded-lg text-primary-700 hover:bg-primary-50"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(row._id)}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50"
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

      {!loading && collections.some((r) => r.status === 'overdue') && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>Some payments are past their due date. Use the check icon to record collection or edit the entry.</p>
        </div>
      )}
    </div>
  );
}
