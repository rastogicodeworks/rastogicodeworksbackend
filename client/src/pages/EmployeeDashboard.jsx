import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ListTodo,
  MessageSquare,
  User,
  LogOut,
  CheckCircle,
  Clock,
  AlertCircle,
  Lock,
  Pin,
} from 'lucide-react';
import DashboardNavbar from '../components/DashboardNavbar';
import API_BASE from '../config/api';
import { getAuthHeaders, clearAuthToken } from '../config/auth';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'tasks', label: 'My tasks', icon: ListTodo },
  { id: 'announcements', label: 'Announcements', icon: MessageSquare },
  { id: 'profile', label: 'Profile', icon: User },
];

function formatDate(value) {
  if (!value) return '—';
  const d = typeof value === 'string' ? new Date(value) : value;
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function EmployeeDashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const [user, setUser] = useState({
    name: localStorage.getItem('employeeName') || 'Team member',
    email: '',
  });
  const [tasks, setTasks] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [taskUpdatingId, setTaskUpdatingId] = useState(null);

  const [profileName, setProfileName] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [changePwForm, setChangePwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [changePwLoading, setChangePwLoading] = useState(false);
  const [changePwError, setChangePwError] = useState('');
  const [changePwSuccess, setChangePwSuccess] = useState('');

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const loadDashboard = async (silent = false) => {
    if (!API_BASE) {
      setLoading(false);
      return;
    }
    if (!silent) {
      setLoading(true);
      setError('');
    }
    try {
      const res = await fetch(`${API_BASE}/api/dashboard/employee`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        clearAuthToken();
        localStorage.removeItem('isEmployee');
        localStorage.removeItem('employeeName');
        window.location.href = '/login';
        return;
      }
      if (!res.ok) {
        setError(data.message || 'Failed to load workspace.');
        setLoading(false);
        return;
      }
      if (data.success && data.data) {
        const { user: u, tasks: t, announcements: a, summary: s } = data.data;
        if (u) {
          setUser({ name: u.name || 'Team member', email: u.email || '' });
          setProfileName(u.name || '');
          localStorage.setItem('employeeName', u.name || u.email?.split('@')[0] || 'Team member');
        }
        if (Array.isArray(t)) setTasks(t);
        if (Array.isArray(a)) setAnnouncements(a);
        if (s) setSummary(s);
      }
    } catch {
      if (!silent) setError('Network error. Please try again.');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const openTasks = useMemo(() => tasks.filter((t) => t.status !== 'done'), [tasks]);

  const patchTaskStatus = async (taskId, status) => {
    setTaskUpdatingId(taskId);
    try {
      const res = await fetch(`${API_BASE}/api/dashboard/employee/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Update failed');
      await loadDashboard(true);
    } catch {
      /* optional: brief error */
    } finally {
      setTaskUpdatingId(null);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
        body: JSON.stringify({ name: profileName }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to save');
      setUser((u) => ({ ...u, name: data.user.name }));
      localStorage.setItem('employeeName', data.user.name);
      setProfileMsg('Profile updated!');
      setTimeout(() => setProfileMsg(''), 3000);
    } catch (err) {
      setProfileMsg(err.message);
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setChangePwError('');
    setChangePwSuccess('');
    if (changePwForm.newPassword !== changePwForm.confirmPassword) {
      setChangePwError('Passwords do not match.');
      return;
    }
    if (changePwForm.newPassword.length < 8) {
      setChangePwError('New password must be at least 8 characters.');
      return;
    }
    setChangePwLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/change-password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: changePwForm.currentPassword,
          newPassword: changePwForm.newPassword,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed');
      setChangePwSuccess('Password changed successfully!');
      setChangePwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setChangePwError(err.message);
    } finally {
      setChangePwLoading(false);
    }
  };

  const handleLogout = () => {
    if (API_BASE) {
      fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
      }).catch(() => {});
    }
    clearAuthToken();
    localStorage.removeItem('isEmployee');
    localStorage.removeItem('employeeName');
    window.location.href = '/login';
  };

  const statusLabel = (s) =>
    ({ todo: 'To do', in_progress: 'In progress', done: 'Done' }[s] || s);

  return (
    <div className="admin-dashboard min-h-screen flex flex-col lg:flex-row lg:items-stretch font-sans text-primary-900 antialiased bg-gradient-to-br from-primary-50/40 via-white to-primary-50/20">
      <DashboardNavbar
        variant="employee"
        navItems={navItems}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogout={handleLogout}
      />

      <div className="flex flex-1 min-h-0 min-w-0 overflow-hidden flex-col">
        <main className="flex-1 min-w-0 overflow-y-auto admin-scroll">
          <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 md:py-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div className="min-w-0">
                <h1 className="section-heading text-primary-950 mb-2 text-2xl sm:text-3xl md:text-4xl">
                  {activeSection === 'overview' && 'Team workspace'}
                  {activeSection === 'tasks' && 'My tasks'}
                  {activeSection === 'announcements' && 'Announcements'}
                  {activeSection === 'profile' && 'My profile'}
                </h1>
                <p className="section-sub text-primary-700/90 max-w-2xl">
                  {activeSection === 'overview' &&
                    `Welcome, ${user.name}. Here is your internal workspace at Rastogi Codeworks.`}
                  {activeSection === 'tasks' && 'Work assigned to you by admin. Update status as you progress.'}
                  {activeSection === 'announcements' && 'Updates posted for the team.'}
                  {activeSection === 'profile' && 'Your name and sign-in security.'}
                </p>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700 flex items-center gap-3 mb-8">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="font-medium">{error}</p>
                <Link to="/login" className="ml-auto font-semibold hover:underline shrink-0">
                  Sign in
                </Link>
              </div>
            )}

            {activeSection === 'overview' && (
              <div className="space-y-6 animate-fade-in-up">
                {loading ? (
                  <p className="text-slate-500">Loading…</p>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="rounded-2xl border border-primary-200/60 bg-white/80 p-5 shadow-sm">
                        <div className="flex items-center gap-2 text-primary-600 text-sm font-semibold mb-2">
                          <ListTodo className="w-4 h-4" />
                          Open tasks
                        </div>
                        <p className="text-3xl font-bold text-primary-950">{summary?.openTasks ?? openTasks.length}</p>
                      </div>
                      <div className="rounded-2xl border border-primary-200/60 bg-white/80 p-5 shadow-sm">
                        <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold mb-2">
                          <CheckCircle className="w-4 h-4" />
                          Completed
                        </div>
                        <p className="text-3xl font-bold text-primary-950">{summary?.doneTasks ?? tasks.filter((t) => t.status === 'done').length}</p>
                      </div>
                      <div className="rounded-2xl border border-primary-200/60 bg-white/80 p-5 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 text-sm font-semibold mb-2">
                          <MessageSquare className="w-4 h-4" />
                          Announcements
                        </div>
                        <p className="text-3xl font-bold text-primary-950">{announcements.length}</p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-primary-200/60 bg-white/80 p-6 shadow-sm">
                      <h2 className="font-bold text-primary-950 mb-4">Up next</h2>
                      {openTasks.length === 0 ? (
                        <p className="text-slate-500 text-sm">No open tasks. You’re all caught up.</p>
                      ) : (
                        <ul className="space-y-3">
                          {openTasks.slice(0, 5).map((t) => (
                            <li key={t.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 last:border-0">
                              <div>
                                <p className="font-medium text-primary-950">{t.title}</p>
                                <p className="text-xs text-slate-500">
                                  Due {t.dueDate ? formatDate(t.dueDate) : '—'} · {t.priority}
                                </p>
                              </div>
                              <span className="text-xs font-semibold uppercase tracking-wide text-primary-600">
                                {statusLabel(t.status)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {openTasks.length > 5 && (
                        <button
                          type="button"
                          onClick={() => setActiveSection('tasks')}
                          className="mt-4 text-sm font-semibold text-primary-600 hover:underline"
                        >
                          View all tasks
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {activeSection === 'tasks' && (
              <div className="space-y-4 animate-fade-in-up">
                {tasks.length === 0 && !loading && (
                  <p className="text-slate-500 text-sm">No tasks assigned yet.</p>
                )}
                <ul className="space-y-3">
                  {tasks.map((t) => (
                    <li
                      key={t.id}
                      className="rounded-2xl border border-primary-200/50 bg-white/90 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-primary-950">{t.title}</p>
                        {t.description && <p className="text-sm text-slate-600 mt-1">{t.description}</p>}
                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            Due {t.dueDate ? formatDate(t.dueDate) : '—'}
                          </span>
                          <span className="capitalize">{t.priority} priority</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          value={t.status}
                          disabled={taskUpdatingId === t.id}
                          onChange={(e) => patchTaskStatus(t.id, e.target.value)}
                          className="text-sm rounded-xl border border-slate-200 px-3 py-2 bg-white font-medium text-primary-900"
                        >
                          <option value="todo">To do</option>
                          <option value="in_progress">In progress</option>
                          <option value="done">Done</option>
                        </select>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeSection === 'announcements' && (
              <div className="space-y-4 animate-fade-in-up">
                {announcements.length === 0 && !loading && (
                  <p className="text-slate-500 text-sm">No announcements for the team yet.</p>
                )}
                {announcements.map((a) => (
                  <article
                    key={a._id}
                    className={`rounded-2xl border p-5 shadow-sm ${
                      a.pinned ? 'border-primary-300 bg-primary-50/50' : 'border-primary-200/60 bg-white/80'
                    }`}
                  >
                    {a.pinned && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-primary-700 mb-2">
                        <Pin className="w-3 h-3" /> Pinned
                      </span>
                    )}
                    <h3 className="font-bold text-primary-950 text-lg">{a.title}</h3>
                    <p className="text-sm text-slate-600 mt-2 whitespace-pre-wrap">{a.content}</p>
                    <p className="text-xs text-slate-400 mt-3">{formatDate(a.createdAt)}</p>
                  </article>
                ))}
              </div>
            )}

            {activeSection === 'profile' && (
              <div className="space-y-6 animate-fade-in-up max-w-lg">
                <div className="admin-card-glass rounded-2xl p-5 sm:p-8">
                  <h2 className="text-base font-bold text-primary-950 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary-600" />
                    Display name
                  </h2>
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 outline-none"
                      placeholder="Your name"
                    />
                    <p className="text-xs text-slate-500">{user.email}</p>
                    {profileMsg && <p className="text-sm text-emerald-600">{profileMsg}</p>}
                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="w-full py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-50"
                    >
                      {profileSaving ? 'Saving…' : 'Save'}
                    </button>
                  </form>
                </div>

                <div className="admin-card-glass rounded-2xl p-5 sm:p-8">
                  <h2 className="text-base font-bold text-primary-950 mb-4 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-primary-600" />
                    Change password
                  </h2>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <input
                      type="password"
                      value={changePwForm.currentPassword}
                      onChange={(e) => setChangePwForm((p) => ({ ...p, currentPassword: e.target.value }))}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                      placeholder="Current password"
                    />
                    <input
                      type="password"
                      value={changePwForm.newPassword}
                      onChange={(e) => setChangePwForm((p) => ({ ...p, newPassword: e.target.value }))}
                      required
                      minLength={8}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                      placeholder="New password (min 8)"
                    />
                    <input
                      type="password"
                      value={changePwForm.confirmPassword}
                      onChange={(e) => setChangePwForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                      placeholder="Confirm new password"
                    />
                    {changePwError && <p className="text-sm text-red-600">{changePwError}</p>}
                    {changePwSuccess && <p className="text-sm text-emerald-600">{changePwSuccess}</p>}
                    <button
                      type="submit"
                      disabled={changePwLoading}
                      className="w-full py-3 rounded-xl bg-primary-600 text-white font-semibold disabled:opacity-50"
                    >
                      {changePwLoading ? 'Updating…' : 'Update password'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
