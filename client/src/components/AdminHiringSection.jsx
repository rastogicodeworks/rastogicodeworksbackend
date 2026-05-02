import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  UserPlus,
  ClipboardList,
  Plus,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Copy,
  ListTodo,
  ExternalLink,
} from 'lucide-react';
import API_BASE from '../config/api';
import { getAuthHeaders, clearAuthToken } from '../config/auth';

const EMP_TYPES = [
  { value: 'full_time', label: 'Full-time' },
  { value: 'part_time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'intern', label: 'Intern' },
];

const JOB_STATUS = [
  { value: 'open', label: 'Open' },
  { value: 'draft', label: 'Draft' },
  { value: 'closed', label: 'Closed' },
];

const APP_STATUS = [
  { value: 'new', label: 'New' },
  { value: 'reviewing', label: 'Reviewing' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'hired', label: 'Hired' },
  { value: 'rejected', label: 'Rejected' },
];

export default function AdminHiringSection({ onError }) {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('roles');
  const [pipelineJobFilter, setPipelineJobFilter] = useState('');

  const [jobForm, setJobForm] = useState({
    title: '',
    department: '',
    location: '',
    employmentType: 'full_time',
    salaryRange: '',
    description: '',
    requirements: '',
    status: 'open',
  });
  const [jobSaving, setJobSaving] = useState(false);

  const [appForm, setAppForm] = useState({
    jobPosting: '',
    applicantName: '',
    email: '',
    phone: '',
    coverLetter: '',
    portfolioUrl: '',
  });
  const [appSaving, setAppSaving] = useState(false);

  const [empForm, setEmpForm] = useState({ name: '', email: '', password: '' });
  const [empSaving, setEmpSaving] = useState(false);
  const [empCreds, setEmpCreds] = useState(null);

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assigneeEmail: '',
    dueDate: '',
    priority: 'normal',
  });
  const [taskSaving, setTaskSaving] = useState(false);

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
      const [jr, ar, er, tr] = await Promise.all([
        authFetch('/api/hiring/jobs'),
        authFetch('/api/hiring/applications'),
        authFetch('/api/employees'),
        authFetch('/api/employee-tasks'),
      ]);
      const [jd, ad, ed, td] = await Promise.all([
        jr.json().catch(() => ({})),
        ar.json().catch(() => ({})),
        er.json().catch(() => ({})),
        tr.json().catch(() => ({})),
      ]);
      if (jd.success) setJobs(jd.jobs || []);
      if (ad.success) setApplications(ad.applications || []);
      if (ed.success) setEmployees(ed.employees || []);
      if (td.success) setTasks(td.tasks || []);
    } catch (e) {
      onError?.(e.message || 'Failed to load hiring data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleCreateJob = async (e) => {
    e.preventDefault();
    if (!jobForm.title.trim()) return;
    setJobSaving(true);
    try {
      const res = await authFetch('/api/hiring/jobs', { method: 'POST', body: JSON.stringify(jobForm) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to create job');
      setJobForm({
        title: '',
        department: '',
        location: '',
        employmentType: 'full_time',
        salaryRange: '',
        description: '',
        requirements: '',
        status: 'open',
      });
      loadAll();
    } catch (err) {
      onError?.(err.message);
    } finally {
      setJobSaving(false);
    }
  };

  const patchJob = async (id, body) => {
    try {
      const res = await authFetch(`/api/hiring/jobs/${id}`, { method: 'PATCH', body: JSON.stringify(body) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message);
      loadAll();
    } catch (err) {
      onError?.(err.message);
    }
  };

  const deleteJob = async (id) => {
    if (!window.confirm('Delete this role and all its applications?')) return;
    try {
      const res = await authFetch(`/api/hiring/jobs/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message);
      }
      loadAll();
    } catch (err) {
      onError?.(err.message);
    }
  };

  const handleAddApplication = async (e) => {
    e.preventDefault();
    if (!appForm.jobPosting || !appForm.applicantName.trim() || !appForm.email.trim()) return;
    setAppSaving(true);
    try {
      const res = await authFetch('/api/hiring/applications', { method: 'POST', body: JSON.stringify(appForm) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed');
      setAppForm({
        jobPosting: '',
        applicantName: '',
        email: '',
        phone: '',
        coverLetter: '',
        portfolioUrl: '',
      });
      loadAll();
    } catch (err) {
      onError?.(err.message);
    } finally {
      setAppSaving(false);
    }
  };

  const patchApplication = async (id, body) => {
    try {
      const res = await authFetch(`/api/hiring/applications/${id}`, { method: 'PATCH', body: JSON.stringify(body) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message);
      loadAll();
    } catch (err) {
      onError?.(err.message);
    }
  };

  const deleteApplication = async (id) => {
    if (!window.confirm('Remove this candidate from the pipeline?')) return;
    try {
      const res = await authFetch(`/api/hiring/applications/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      loadAll();
    } catch (err) {
      onError?.(err.message);
    }
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    setEmpCreds(null);
    if (!empForm.email.trim() || !empForm.password || empForm.password.length < 8) return;
    setEmpSaving(true);
    try {
      const res = await authFetch('/api/employees', {
        method: 'POST',
        body: JSON.stringify({
          email: empForm.email.trim(),
          password: empForm.password,
          name: empForm.name.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed');
      setEmpCreds({
        email: data.employee.email,
        password: data.temporaryPassword,
        convertedFromClient: !!data.convertedFromClient,
      });
      setEmpForm({ name: '', email: '', password: '' });
      loadAll();
    } catch (err) {
      onError?.(err.message);
    } finally {
      setEmpSaving(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskForm.title.trim() || !taskForm.assigneeEmail.trim()) return;
    setTaskSaving(true);
    try {
      const res = await authFetch('/api/employee-tasks', { method: 'POST', body: JSON.stringify(taskForm) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed');
      setTaskForm({ title: '', description: '', assigneeEmail: '', dueDate: '', priority: 'normal' });
      loadAll();
    } catch (err) {
      onError?.(err.message);
    } finally {
      setTaskSaving(false);
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await authFetch(`/api/employee-tasks/${id}`, { method: 'DELETE' });
      loadAll();
    } catch (err) {
      onError?.(err.message);
    }
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm('Remove this employee account? Their tasks remain until reassigned.')) return;
    try {
      await authFetch(`/api/employees/${id}`, { method: 'DELETE' });
      loadAll();
    } catch (err) {
      onError?.(err.message);
    }
  };

  const filteredApplications = useMemo(() => {
    if (!pipelineJobFilter) return applications;
    return applications.filter((a) => {
      const jid = a.jobPosting?._id ? String(a.jobPosting._id) : String(a.jobPosting || '');
      return jid === pipelineJobFilter;
    });
  }, [applications, pipelineJobFilter]);

  const newApplicantCount = useMemo(
    () => applications.filter((a) => a.status === 'new').length,
    [applications],
  );

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
        <p className="font-semibold text-primary-950 mb-1">Where roles are published</p>
        <p className="text-primary-800/90 leading-relaxed">
          <strong>Publish role</strong> saves the job to your database. Roles with status <strong>Open</strong> appear on the public{' '}
          <Link to="/careers" className="font-bold underline underline-offset-2 hover:text-primary-950 inline-flex items-center gap-0.5">
            Careers page <ExternalLink className="w-3.5 h-3.5" />
          </Link>{' '}
          so candidates can apply online. Use <strong>Candidates</strong> to review applications and move people through your pipeline (New → Interview → Hired, etc.).
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'roles', label: 'Open roles', icon: Briefcase, badge: jobs.filter((j) => j.status === 'open').length },
          { id: 'pipeline', label: 'Candidates', icon: UserPlus, badge: newApplicantCount },
          { id: 'team', label: 'Team & tasks', icon: ListTodo, badge: employees.length },
        ].map(({ id, label, icon: Icon, badge }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              tab === id ? 'bg-primary-600 text-white shadow-md' : 'bg-white/80 border border-primary-200/60 text-primary-800 hover:bg-primary-50'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
            {typeof badge === 'number' && badge > 0 && (
              <span
                className={`min-w-[1.25rem] h-5 px-1 rounded-full text-xs font-bold flex items-center justify-center ${
                  tab === id ? 'bg-white/25 text-white' : 'bg-primary-100 text-primary-800'
                }`}
              >
                {badge > 99 ? '99+' : badge}
              </span>
            )}
          </button>
        ))}
        <button
          type="button"
          onClick={loadAll}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-100 ml-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {tab === 'roles' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="admin-card-glass rounded-2xl p-5 sm:p-6">
            <h2 className="text-lg font-bold text-primary-950 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary-600" />
              New job posting
            </h2>
            <p className="text-xs text-slate-600 mb-4 -mt-2">
              Set status to <strong>Open</strong> to list this role on <Link to="/careers" className="text-primary-700 font-semibold hover:underline">/careers</Link>. Draft roles stay internal only.
            </p>
            <form onSubmit={handleCreateJob} className="space-y-3">
              <input
                required
                placeholder="Job title *"
                value={jobForm.title}
                onChange={(e) => setJobForm((p) => ({ ...p, title: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
              />
              <div className="grid sm:grid-cols-2 gap-2">
                <input
                  placeholder="Department"
                  value={jobForm.department}
                  onChange={(e) => setJobForm((p) => ({ ...p, department: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
                <input
                  placeholder="Location"
                  value={jobForm.location}
                  onChange={(e) => setJobForm((p) => ({ ...p, location: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                <select
                  value={jobForm.employmentType}
                  onChange={(e) => setJobForm((p) => ({ ...p, employmentType: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                >
                  {EMP_TYPES.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <select
                  value={jobForm.status}
                  onChange={(e) => setJobForm((p) => ({ ...p, status: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                >
                  {JOB_STATUS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <input
                placeholder="Salary range (optional)"
                value={jobForm.salaryRange}
                onChange={(e) => setJobForm((p) => ({ ...p, salaryRange: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
              />
              <textarea
                placeholder="Role description"
                rows={3}
                value={jobForm.description}
                onChange={(e) => setJobForm((p) => ({ ...p, description: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm resize-none"
              />
              <textarea
                placeholder="Requirements"
                rows={2}
                value={jobForm.requirements}
                onChange={(e) => setJobForm((p) => ({ ...p, requirements: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm resize-none"
              />
              <button
                type="submit"
                disabled={jobSaving}
                className="w-full py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 disabled:opacity-50"
              >
                {jobSaving ? 'Saving…' : 'Save & publish (if Open)'}
              </button>
              <p className="text-[11px] text-slate-500 leading-snug">
                Saved roles appear under Active listings. Open roles are visible on the public careers page; use the <strong>Candidates</strong> tab to add people manually or review applications from the site.
              </p>
            </form>
          </div>

          <div className="admin-card-glass rounded-2xl p-5 sm:p-6">
            <h2 className="text-lg font-bold text-primary-950 mb-4 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary-600" />
              Active listings ({jobs.length})
            </h2>
            <div className="space-y-3 max-h-[520px] overflow-y-auto admin-scroll">
              {jobs.length === 0 && <p className="text-sm text-slate-500">No roles yet.</p>}
              {jobs.map((j) => (
                <div key={j._id} className="rounded-xl border border-slate-200/80 bg-white/60 p-4">
                  <div className="flex justify-between gap-2 items-start">
                    <div className="min-w-0">
                      <p className="font-semibold text-primary-950">{j.title}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {[j.department, j.location].filter(Boolean).join(' · ') || '—'} ·{' '}
                        {EMP_TYPES.find((t) => t.value === j.employmentType)?.label || j.employmentType}
                      </p>
                      <p className="text-xs text-primary-600 mt-1">{j.applicationCount || 0} applications</p>
                      {j.status === 'open' && (
                        <Link
                          to="/careers"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 hover:underline mt-2"
                        >
                          View on careers page <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 shrink-0 items-end">
                      <select
                        value={j.status}
                        onChange={(e) => patchJob(j._id, { status: e.target.value })}
                        className="text-xs rounded-lg border border-slate-200 px-2 py-1"
                      >
                        {JOB_STATUS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          setAppForm((p) => ({ ...p, jobPosting: j._id }));
                          setPipelineJobFilter(String(j._id));
                          setTab('pipeline');
                        }}
                        className="text-xs font-semibold text-primary-700 hover:underline flex items-center gap-1"
                      >
                        <UserPlus className="w-3 h-3" /> Candidates
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteJob(j._id)}
                        className="text-xs text-red-600 hover:underline flex items-center gap-1 justify-end"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'pipeline' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="admin-card-glass rounded-2xl p-5 sm:p-6">
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              <strong>Select candidates:</strong> add people manually below, or review applicants who applied from{' '}
              <Link to="/careers" className="text-primary-700 font-semibold hover:underline">/careers</Link>. Use the status dropdown on each card to move them through screening, interview, offer, hired, or rejected.
            </p>
            <h2 className="text-lg font-bold text-primary-950 mb-4">Add candidate</h2>
            <form onSubmit={handleAddApplication} className="space-y-3">
              <select
                required
                value={appForm.jobPosting}
                onChange={(e) => setAppForm((p) => ({ ...p, jobPosting: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
              >
                <option value="">Select role *</option>
                {jobs.map((j) => (
                  <option key={j._id} value={j._id}>
                    {j.title}
                  </option>
                ))}
              </select>
              <input
                required
                placeholder="Full name *"
                value={appForm.applicantName}
                onChange={(e) => setAppForm((p) => ({ ...p, applicantName: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
              />
              <input
                required
                type="email"
                placeholder="Email *"
                value={appForm.email}
                onChange={(e) => setAppForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
              />
              <input
                placeholder="Phone"
                value={appForm.phone}
                onChange={(e) => setAppForm((p) => ({ ...p, phone: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
              />
              <input
                placeholder="Portfolio URL"
                value={appForm.portfolioUrl}
                onChange={(e) => setAppForm((p) => ({ ...p, portfolioUrl: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
              />
              <textarea
                placeholder="Cover note"
                rows={3}
                value={appForm.coverLetter}
                onChange={(e) => setAppForm((p) => ({ ...p, coverLetter: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm resize-none"
              />
              <button
                type="submit"
                disabled={appSaving}
                className="w-full py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold disabled:opacity-50"
              >
                {appSaving ? 'Saving…' : 'Add to pipeline'}
              </button>
            </form>
          </div>

          <div className="admin-card-glass rounded-2xl p-5 sm:p-6 lg:col-span-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h2 className="text-lg font-bold text-primary-950">Pipeline ({filteredApplications.length})</h2>
              <select
                value={pipelineJobFilter}
                onChange={(e) => setPipelineJobFilter(e.target.value)}
                className="text-sm rounded-xl border border-slate-200 px-3 py-2 bg-white max-w-full"
              >
                <option value="">All roles</option>
                {jobs.map((j) => (
                  <option key={j._id} value={String(j._id)}>
                    {j.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-3 max-h-[600px] overflow-y-auto admin-scroll">
              {filteredApplications.length === 0 && (
                <p className="text-sm text-slate-500">No candidates for this filter.</p>
              )}
              {filteredApplications.map((a) => (
                <div key={a._id} className="rounded-xl border border-slate-200/80 bg-white/60 p-4 text-sm">
                  <div className="flex flex-wrap justify-between gap-2">
                    <div>
                      <p className="font-semibold text-primary-950">{a.applicantName}</p>
                      <p className="text-slate-600 text-xs mt-0.5">{a.email}</p>
                      <p className="text-slate-500 text-xs mt-1">
                        Role: {a.jobPosting?.title || '—'}
                      </p>
                    </div>
                    <select
                      value={a.status}
                      onChange={(e) => patchApplication(a._id, { status: e.target.value })}
                      className="text-xs rounded-lg border border-slate-200 px-2 py-1 h-fit"
                    >
                      {APP_STATUS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {a.coverLetter && (
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3">{a.coverLetter}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteApplication(a._id)}
                    className="text-xs text-red-600 mt-2 hover:underline inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'team' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="admin-card-glass rounded-2xl p-5 sm:p-6">
              <h2 className="text-lg font-bold text-primary-950 mb-4">Invite employee</h2>
              {empCreds && (
                <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900 flex flex-col gap-2">
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle className="w-4 h-4" /> Account ready
                  </div>
                  {empCreds.convertedFromClient && (
                    <p className="text-xs text-emerald-800/90">
                      This email was a <strong>client</strong> account; it is now a <strong>team</strong> account. Use the new password below to sign in (the old client password no longer works).
                    </p>
                  )}
                  <p className="text-xs break-all">Email: {empCreds.email}</p>
                  <p className="text-xs font-mono">Password: {empCreds.password}</p>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`${empCreds.email} / ${empCreds.password}`);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:underline"
                  >
                    <Copy className="w-3 h-3" /> Copy credentials
                  </button>
                </div>
              )}
              <form onSubmit={handleCreateEmployee} className="space-y-3">
                <input
                  placeholder="Name"
                  value={empForm.name}
                  onChange={(e) => setEmpForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
                <input
                  required
                  type="email"
                  placeholder="Work email *"
                  value={empForm.email}
                  onChange={(e) => setEmpForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
                <input
                  required
                  type="password"
                  minLength={8}
                  placeholder="Temporary password (min 8 chars) *"
                  value={empForm.password}
                  onChange={(e) => setEmpForm((p) => ({ ...p, password: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
                <button
                  type="submit"
                  disabled={empSaving}
                  className="w-full py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold disabled:opacity-50"
                >
                  {empSaving ? 'Creating…' : 'Create employee login'}
                </button>
              </form>
              <p className="text-xs text-slate-500 mt-3">
                Employees sign in at the same login page; they are routed to the team workspace.
              </p>
            </div>

            <div className="admin-card-glass rounded-2xl p-5 sm:p-6">
              <h2 className="text-lg font-bold text-primary-950 mb-4">Team ({employees.length})</h2>
              <ul className="space-y-2 text-sm max-h-48 overflow-y-auto admin-scroll">
                {employees.map((em) => (
                  <li
                    key={em._id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 px-3 py-2"
                  >
                    <span className="truncate">
                      <span className="font-medium text-primary-950">{em.name || em.email}</span>
                      <span className="text-slate-500 text-xs block">{em.email}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteEmployee(em._id)}
                      className="text-red-600 p-1 hover:bg-red-50 rounded-lg shrink-0"
                      aria-label="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
                {employees.length === 0 && <li className="text-slate-500">No employees yet.</li>}
              </ul>
            </div>
          </div>

          <div className="admin-card-glass rounded-2xl p-5 sm:p-6">
            <h2 className="text-lg font-bold text-primary-950 mb-4">Assign task</h2>
            <form onSubmit={handleCreateTask} className="space-y-3 mb-6">
              <input
                required
                placeholder="Task title *"
                value={taskForm.title}
                onChange={(e) => setTaskForm((p) => ({ ...p, title: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
              />
              <textarea
                placeholder="Details"
                rows={2}
                value={taskForm.description}
                onChange={(e) => setTaskForm((p) => ({ ...p, description: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm resize-none"
              />
              <select
                required
                value={taskForm.assigneeEmail}
                onChange={(e) => setTaskForm((p) => ({ ...p, assigneeEmail: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
              >
                <option value="">Assign to *</option>
                {employees.map((em) => (
                  <option key={em._id} value={em.email}>
                    {em.name ? `${em.name} (${em.email})` : em.email}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm((p) => ({ ...p, dueDate: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
              />
              <select
                value={taskForm.priority}
                onChange={(e) => setTaskForm((p) => ({ ...p, priority: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
              >
                <option value="low">Low priority</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
              <button
                type="submit"
                disabled={taskSaving || employees.length === 0}
                className="w-full py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold disabled:opacity-50"
              >
                {taskSaving ? 'Saving…' : 'Create task'}
              </button>
              {employees.length === 0 && (
                <p className="text-xs text-amber-700 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" /> Add an employee first to assign work.
                </p>
              )}
            </form>

            <h3 className="font-bold text-primary-950 text-sm mb-2">All tasks ({tasks.length})</h3>
            <div className="space-y-2 max-h-[280px] overflow-y-auto admin-scroll text-sm">
              {tasks.map((t) => (
                <div key={t._id} className="rounded-lg border border-slate-100 px-3 py-2 flex justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-primary-950 truncate">{t.title}</p>
                    <p className="text-xs text-slate-500">{t.assigneeEmail}</p>
                    <span className="text-[10px] uppercase tracking-wide text-slate-400">
                      {t.status.replace('_', ' ')} · {t.priority}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteTask(t._id)}
                    className="text-red-600 p-1 shrink-0"
                    aria-label="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {tasks.length === 0 && <p className="text-slate-500 text-xs">No tasks.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
