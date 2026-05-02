import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  MessageSquare,
  Receipt,
  FilePlus,
  Users,
  Settings,
  LogOut,
  Plus,
  Megaphone,
  FolderKanban,
  User,
  ListTodo,
  Search,
  Bell,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
} from 'lucide-react';
import API_BASE from '../config/api';
import { getAuthHeaders, clearAuthToken } from '../config/auth';
import { formatNotifTime } from '../utils/formatNotifTime';

const ICON_MAP = {
  LayoutDashboard,
  FolderOpen,
  FileText,
  MessageSquare,
  Receipt,
  FilePlus,
  Users,
  Settings,
  Megaphone,
  FolderKanban,
  User,
  ListTodo,
};

const NOTIF_POLL_MS = 28_000; // kept for non-lifted admin toolbar fallback

/**
 * Shared dashboard navigation: vertical sidebar on lg+ desktop, horizontal top bar on mobile.
 * variant: 'client' | 'admin' | 'employee'
 */
export default function DashboardNavbar({
  variant = 'client',
  navItems = [],
  activeSection,
  setActiveSection,
  onLogout,
  onNewInvoice,
  /** When set (admin only), search + notifications come from parent; desktop sidebar hides those controls. */
  adminToolbar = null,
}) {
  const [open, setOpen] = useState(false);
  const [navSearchInternal, setNavSearchInternal] = useState('');

  const [me, setMe] = useState(null);
  const [notificationsInternal, setNotificationsInternal] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifLoadingInternal, setNotifLoadingInternal] = useState(false);
  const [lastPolledInternal, setLastPolledInternal] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifWrapRef = useRef(null);
  const profileWrapRef = useRef(null);

  const label = variant === 'admin' ? 'Admin' : variant === 'employee' ? 'Team' : 'Client';
  const showContactCta = variant === 'client' || variant === 'employee';
  const isAdmin = variant === 'admin';
  const useLiftedAdmin = isAdmin && adminToolbar != null;

  const navSearch = useLiftedAdmin ? adminToolbar.navSearch : navSearchInternal;
  const setNavSearch = useLiftedAdmin ? adminToolbar.setNavSearch : setNavSearchInternal;
  const notifications = useLiftedAdmin ? adminToolbar.notifications : notificationsInternal;
  const notifLoading = useLiftedAdmin ? adminToolbar.notifLoading : notifLoadingInternal;
  const lastPolled = useLiftedAdmin ? adminToolbar.lastPolled : lastPolledInternal;

  const filteredNavItems = useMemo(() => {
    const q = navSearch.trim().toLowerCase();
    if (!q) return navItems;
    return navItems.filter((item) => item.label.toLowerCase().includes(q));
  }, [navItems, navSearch]);

  /** Split admin nav so Hiring / below sit below a divider (matches dashboard IA). */
  const adminNavSections = useMemo(() => {
    const items = filteredNavItems;
    const idx = items.findIndex((i) => i.id === 'hiring');
    if (idx <= 0) return { primary: items, secondary: [] };
    return { primary: items.slice(0, idx), secondary: items.slice(idx) };
  }, [filteredNavItems]);

  const handleNavClick = (id) => {
    setActiveSection(id);
    setOpen(false);
  };

  const navButtonClass = (id) =>
    `flex items-center gap-3 w-full py-3 px-4 rounded-xl text-left font-medium transition-colors duration-200 ${
      activeSection === id
        ? 'bg-primary-50 text-primary-700 shadow-sm border border-primary-100/80'
        : 'text-slate-600 hover:bg-slate-50 hover:text-primary-800 border border-transparent'
    }`;

  const fetchNotifications = async () => {
    if (!API_BASE || !isAdmin || useLiftedAdmin) return;
    setNotifLoadingInternal(true);
    try {
      const res = await fetch(`${API_BASE}/api/dashboard/admin/notifications`, {
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
      if (data.success && Array.isArray(data.notifications)) {
        setNotificationsInternal(data.notifications);
        setLastPolledInternal(data.polledAt || new Date().toISOString());
      }
    } catch {
      /* ignore */
    } finally {
      setNotifLoadingInternal(false);
    }
  };

  const fetchMe = async () => {
    if (!API_BASE || !isAdmin) return;
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (res.status === 401) return;
      const data = await res.json().catch(() => ({}));
      if (data.success && data.user) setMe(data.user);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    if (!isAdmin || !API_BASE) return;
    fetchMe();
    if (useLiftedAdmin) return;
    fetchNotifications();
    const t = setInterval(fetchNotifications, NOTIF_POLL_MS);
    return () => clearInterval(t);
  }, [isAdmin, useLiftedAdmin]);

  useEffect(() => {
    if (!notifOpen) return;
    const onDoc = (e) => {
      if (notifWrapRef.current && !notifWrapRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [notifOpen]);

  useEffect(() => {
    if (!profileOpen) return;
    const onDoc = (e) => {
      if (profileWrapRef.current && !profileWrapRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [profileOpen]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const close = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener('change', close);
    return () => mq.removeEventListener('change', close);
  }, []);

  const onNotificationPick = (n) => {
    if (n.section) setActiveSection(n.section);
    setNotifOpen(false);
    setOpen(false);
  };

  const displayName = me?.name?.trim() || me?.email?.split('@')[0] || 'Admin';
  const emailShort = me?.email || '';
  const initial = (displayName[0] || 'A').toUpperCase();

  const notifCount = notifications.length;

  const mobileNavBtn = (active) =>
    `flex items-center gap-3 w-full min-h-[48px] py-3 px-4 rounded-xl text-left text-[15px] font-semibold transition-colors ${
      active
        ? 'bg-primary-50 text-primary-800 shadow-sm border border-primary-200/80'
        : 'text-slate-700 hover:bg-slate-50 border border-transparent active:bg-slate-100'
    }`;

  return (
    <>
      {/* ─── Mobile / tablet: sticky bar + bottom sheet menu ─── */}
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-[200] cursor-default border-0 p-0 animate-dashboard-backdrop-in bg-slate-900/45 backdrop-blur-[2px] lg:hidden"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}

      {open && (
        <div
          className="fixed left-0 right-0 bottom-0 z-[205] flex max-h-[min(88dvh,calc(100dvh-env(safe-area-inset-bottom,0px)))] flex-col rounded-t-[1.375rem] border-t border-slate-200/90 bg-white shadow-[0_-12px_40px_rgba(15,23,42,0.12)] animate-dashboard-sheet-up pb-[env(safe-area-inset-bottom,0px)] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dashboard-mobile-menu-title"
        >
          <div className="flex shrink-0 items-center justify-center pt-2 pb-1">
            <div className="h-1 w-10 rounded-full bg-slate-200" aria-hidden />
          </div>
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 px-4 pb-3 pt-1">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary-600">{label} portal</p>
              <h2 id="dashboard-mobile-menu-title" className="text-lg font-bold tracking-tight text-primary-950">
                Menu
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 hover:text-primary-800"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" strokeWidth={2} />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
            <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/95 px-4 py-3 backdrop-blur-sm">
              <label className="sr-only">Search menu</label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={navSearch}
                  onChange={(e) => setNavSearch(e.target.value)}
                  placeholder="Search menu…"
                  autoComplete="off"
                  className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-500/15"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1 px-3 py-3">
              {isAdmin ? (
                <>
                  {adminNavSections.primary.map(({ id, label: itemLabel, icon: iconKey }) => {
                    const Icon = typeof iconKey === 'string' ? ICON_MAP[iconKey] : iconKey;
                    if (!Icon) return null;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => handleNavClick(id)}
                        className={mobileNavBtn(activeSection === id)}
                      >
                        <Icon className="h-5 w-5 shrink-0 text-primary-600" />
                        <span className="truncate">{itemLabel}</span>
                      </button>
                    );
                  })}
                  {adminNavSections.secondary.length > 0 && (
                    <div className="my-2 border-t border-slate-200/90" role="presentation" aria-hidden />
                  )}
                  {adminNavSections.secondary.map(({ id, label: itemLabel, icon: iconKey }) => {
                    const Icon = typeof iconKey === 'string' ? ICON_MAP[iconKey] : iconKey;
                    if (!Icon) return null;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => handleNavClick(id)}
                        className={mobileNavBtn(activeSection === id)}
                      >
                        <Icon className="h-5 w-5 shrink-0 text-primary-600" />
                        <span className="truncate">{itemLabel}</span>
                      </button>
                    );
                  })}
                </>
              ) : (
                filteredNavItems.map(({ id, label: itemLabel, icon: iconKey }) => {
                  const Icon = typeof iconKey === 'string' ? ICON_MAP[iconKey] : iconKey;
                  if (!Icon) return null;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleNavClick(id)}
                      className={mobileNavBtn(activeSection === id)}
                    >
                      <Icon className="h-5 w-5 shrink-0 text-primary-600" />
                      <span className="truncate">{itemLabel}</span>
                    </button>
                  );
                })
              )}
              {filteredNavItems.length === 0 && (
                <p className="px-2 py-6 text-center text-sm text-slate-500">No items match &quot;{navSearch}&quot;</p>
              )}
            </div>
          </div>

          <div className="shrink-0 space-y-2 border-t border-slate-200 bg-slate-50/90 px-4 py-4">
            {showContactCta ? (
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-primary-600 py-3 text-center text-sm font-bold text-white shadow-md shadow-primary-600/20 transition-colors hover:bg-primary-700 active:scale-[0.99]"
              >
                Get in touch
              </Link>
            ) : (
              onNewInvoice && (
                <button
                  type="button"
                  onClick={() => {
                    onNewInvoice();
                    setActiveSection('create');
                    setOpen(false);
                  }}
                  className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-3 text-sm font-bold text-white shadow-md shadow-primary-600/20 transition-colors hover:bg-primary-700 active:scale-[0.99]"
                >
                  <Plus className="h-5 w-5" />
                  New Invoice
                </button>
              )
            )}
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  setActiveSection('settings');
                  setOpen(false);
                }}
                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50"
              >
                <Settings className="h-5 w-5" />
                Account &amp; settings
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-200/60"
            >
              <LogOut className="h-5 w-5" />
              Sign out
            </button>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-[210] shrink-0 border-b border-primary-200/80 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/92 lg:hidden pt-[max(8px,env(safe-area-inset-top,0px))]">
        <nav className="flex min-h-[3.25rem] items-center justify-between gap-2 px-3 sm:px-4 py-2">
          <Link
            to="/"
            aria-label="Go to home"
            className="group flex min-w-0 max-w-[62%] items-center gap-2 sm:gap-2.5"
          >
            <img
              src="/transparent_logo.png"
              alt=""
              className="h-9 w-9 shrink-0 object-contain transition-transform duration-300 group-active:scale-95 sm:h-10 sm:w-10"
            />
            <span className="min-w-0">
              <span className="font-brand block truncate text-sm font-semibold italic tracking-tight text-primary-950 sm:text-base">
                Rastogi Codeworks
              </span>
              <span className="mt-0.5 block truncate text-[10px] font-bold uppercase tracking-widest text-primary-600">
                {label}
              </span>
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-1">
            {isAdmin && API_BASE && (
              <>
                <div
                  className="mr-0.5 hidden min-[360px]:inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2 py-1.5 text-emerald-900"
                  title={lastPolled ? `Updated ${formatNotifTime(lastPolled)}` : 'Live updates'}
                >
                  <span className="relative flex h-1.5 w-1.5 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider">Live</span>
                </div>
                <div className="relative" ref={notifWrapRef}>
                  <button
                    type="button"
                    onClick={() => setNotifOpen((v) => !v)}
                    className="relative flex h-11 w-11 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-primary-50 hover:text-primary-800 active:bg-primary-100"
                    aria-label="Notifications"
                    aria-expanded={notifOpen}
                  >
                    <Bell className="h-6 w-6" strokeWidth={2} />
                    {notifCount > 0 && (
                      <span className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                        {notifCount > 9 ? '9+' : notifCount}
                      </span>
                    )}
                  </button>
                  {notifOpen && (
                    <div className="fixed right-3 top-[calc(env(safe-area-inset-top,0px)+3.5rem)] z-[230] max-h-72 w-[min(calc(100vw-1.5rem),20rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white py-2 shadow-2xl sm:right-4">
                      <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
                        <span className="text-xs font-bold uppercase tracking-wide text-slate-700">Alerts</span>
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                          </span>
                          Live
                        </span>
                      </div>
                      {notifLoading && notifications.length === 0 ? (
                        <p className="px-3 py-4 text-center text-sm text-slate-500">Loading…</p>
                      ) : notifications.length === 0 ? (
                        <p className="px-3 py-4 text-center text-sm text-slate-500">You&apos;re all caught up.</p>
                      ) : (
                        notifications.map((n) => (
                          <button
                            key={n.id}
                            type="button"
                            onClick={() => onNotificationPick(n)}
                            className="w-full border-b border-slate-50 px-3 py-2.5 text-left last:border-0 hover:bg-primary-50/80"
                          >
                            <p className="text-sm font-semibold text-primary-950">{n.title}</p>
                            <p className="mt-0.5 line-clamp-2 text-xs text-slate-600">{n.body}</p>
                            <p className="mt-1 text-[10px] text-slate-400">{formatNotifTime(n.createdAt)}</p>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
            <button
              type="button"
              className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
                open
                  ? 'bg-primary-100 text-primary-800'
                  : 'text-slate-700 hover:bg-slate-100 active:bg-slate-200'
              }`}
              onClick={() => {
                setNotifOpen(false);
                setOpen((o) => !o);
              }}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <X className="h-6 w-6" strokeWidth={2} /> : <Menu className="h-6 w-6" strokeWidth={2} />}
            </button>
          </div>
        </nav>
      </header>

      {/* ─── Desktop sidebar ─── */}
      <aside className="hidden lg:flex flex-col w-[280px] xl:w-[300px] shrink-0 sticky top-0 h-screen max-h-[100dvh] min-h-0 border-r border-primary-200/70 bg-white/95 backdrop-blur-xl shadow-sm z-30 overflow-x-hidden">
        <div className="flex min-h-0 flex-1 flex-col px-4 py-5 xl:px-5 xl:py-7">
          <Link
            to="/"
            aria-label="Go to home"
            className="mb-6 flex shrink-0 items-center gap-3 rounded-xl p-2 -m-2 transition-colors group hover:bg-primary-50/80"
          >
            <img
              src="/transparent_logo.png"
              alt=""
              className="h-11 w-11 xl:h-12 xl:w-12 object-contain shrink-0 group-hover:scale-105 transition-transform duration-300"
            />
            <span className="flex flex-col min-w-0">
              <span className="font-brand font-semibold text-base xl:text-lg tracking-tight italic text-primary-950 leading-tight">
                Rastogi Codeworks
              </span>
              <span className="text-[10px] xl:text-xs font-bold uppercase tracking-widest text-primary-600 mt-1">
                {label}
              </span>
            </span>
          </Link>

          {isAdmin && API_BASE && !useLiftedAdmin && (
            <>
              <div className="mb-3 shrink-0">
                <label className="sr-only">Quick search navigation</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="search"
                    value={navSearch}
                    onChange={(e) => setNavSearch(e.target.value)}
                    placeholder="Quick search menu…"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200/90 text-sm bg-slate-50/90 focus:bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-500/15 outline-none transition-shadow"
                  />
                </div>
              </div>

              <div className="relative mb-4 shrink-0" ref={notifWrapRef}>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setNotifOpen((v) => !v)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-sm font-semibold transition-colors ${
                      notifOpen
                        ? 'border-primary-300 bg-primary-50 text-primary-800'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-primary-200 hover:bg-primary-50/50'
                    }`}
                  >
                    <Bell className="w-4 h-4 shrink-0" />
                    <span>Notifications</span>
                    {notifCount > 0 && (
                      <span className="min-w-[22px] h-[22px] px-1.5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                        {notifCount > 9 ? '9+' : notifCount}
                      </span>
                    )}
                  </button>
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800"
                    title={lastPolled ? `Updated ${formatNotifTime(lastPolled)}` : 'Live updates'}
                  >
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">Live</span>
                  </div>
                </div>

                {notifOpen && (
                  <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-xl border border-slate-200 bg-white shadow-xl shadow-black/10 max-h-72 overflow-y-auto">
                    <div className="sticky top-0 bg-white/95 backdrop-blur px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600">Activity</span>
                      {notifLoading && <span className="text-[10px] text-slate-400">Updating…</span>}
                    </div>
                    {notifications.length === 0 ? (
                      <p className="px-3 py-6 text-sm text-slate-500 text-center">No new activity.</p>
                    ) : (
                      notifications.map((n) => (
                        <button
                          key={n.id}
                          type="button"
                          onClick={() => onNotificationPick(n)}
                          className="w-full text-left px-3 py-2.5 hover:bg-primary-50/90 border-b border-slate-50 last:border-0 transition-colors"
                        >
                          <p className="text-sm font-semibold text-primary-950 leading-snug">{n.title}</p>
                          <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{n.body}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{formatNotifTime(n.createdAt)}</p>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          <nav
            className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden overscroll-y-contain min-w-0 admin-scroll py-0.5"
            aria-label="Dashboard sections"
          >
            {isAdmin ? (
              <>
                {adminNavSections.primary.map(({ id, label: itemLabel, icon: iconKey }) => {
                  const Icon = typeof iconKey === 'string' ? ICON_MAP[iconKey] : iconKey;
                  if (!Icon) return null;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setActiveSection(id)}
                      title={itemLabel}
                      className={navButtonClass(id)}
                    >
                      <Icon className="w-5 h-5 shrink-0 text-primary-600/90" />
                      <span className="text-sm leading-snug truncate">{itemLabel}</span>
                    </button>
                  );
                })}
                {adminNavSections.secondary.length > 0 && (
                  <div
                    className="my-2 border-t border-slate-200/90 shrink-0"
                    role="presentation"
                    aria-hidden
                  />
                )}
                {adminNavSections.secondary.map(({ id, label: itemLabel, icon: iconKey }) => {
                  const Icon = typeof iconKey === 'string' ? ICON_MAP[iconKey] : iconKey;
                  if (!Icon) return null;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setActiveSection(id)}
                      title={itemLabel}
                      className={navButtonClass(id)}
                    >
                      <Icon className="w-5 h-5 shrink-0 text-primary-600/90" />
                      <span className="text-sm leading-snug truncate">{itemLabel}</span>
                    </button>
                  );
                })}
              </>
            ) : (
              navItems.map(({ id, label: itemLabel, icon: iconKey }) => {
                const Icon = typeof iconKey === 'string' ? ICON_MAP[iconKey] : iconKey;
                if (!Icon) return null;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveSection(id)}
                    title={itemLabel}
                    className={navButtonClass(id)}
                  >
                    <Icon className="w-5 h-5 shrink-0 text-primary-600/90" />
                    <span className="text-sm leading-snug truncate">{itemLabel}</span>
                  </button>
                );
              })
            )}
            {isAdmin && filteredNavItems.length === 0 && (
              <p className="text-xs text-slate-500 px-2 py-3">No menu items match.</p>
            )}
          </nav>

          <div className="mt-4 shrink-0 border-t border-slate-200/90 pt-4 flex flex-col gap-2">
            {isAdmin && API_BASE && (
              <div className="relative mb-1" ref={profileWrapRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen((v) => !v)}
                  className={`w-full flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all ${
                    profileOpen
                      ? 'border-primary-300 bg-primary-50/80 shadow-sm'
                      : 'border-slate-200 bg-gradient-to-br from-slate-50 to-white hover:border-primary-200 hover:shadow-sm'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md shadow-primary-600/20">
                    {initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-primary-950 truncate">{displayName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{emailShort || 'Signed in'}</p>
                  </div>
                  {profileOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {profileOpen && (
                  <div className="absolute left-0 right-0 bottom-full mb-2 z-50 rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSection('settings');
                        setProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-3 text-sm font-medium text-slate-700 hover:bg-primary-50"
                    >
                      <Settings className="w-4 h-4 text-primary-600" />
                      Account &amp; security
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-3 text-sm font-medium text-red-700 hover:bg-red-50 border-t border-slate-100"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}

            {showContactCta ? (
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-semibold text-sm text-white bg-primary-500 hover:bg-primary-400 shadow-md shadow-primary-500/20 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
              >
                Get in touch
              </Link>
            ) : (
              onNewInvoice && (
                <button
                  type="button"
                  onClick={() => {
                    onNewInvoice();
                    setActiveSection('create');
                  }}
                  className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-semibold text-sm text-white bg-primary-500 hover:bg-primary-400 shadow-md shadow-primary-500/20 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Plus className="w-4 h-4 shrink-0" />
                  New Invoice
                </button>
              )
            )}

            {(!isAdmin || !API_BASE) && (
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-primary-800 hover:bg-slate-50 border border-slate-200/80 transition-colors"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                Logout
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
