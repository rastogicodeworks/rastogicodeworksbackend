import { useState, useEffect, useRef } from 'react';
import { Search, Bell } from 'lucide-react';
import API_BASE from '../config/api';
import { formatNotifTime } from '../utils/formatNotifTime';

/**
 * Sticky desktop header: quick search + notifications + live indicator (admin).
 */
export default function AdminDesktopTopBar({
  navSearch,
  setNavSearch,
  notifications,
  notifLoading,
  lastPolled,
  setActiveSection,
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const notifWrapRef = useRef(null);
  const notifCount = notifications.length;

  useEffect(() => {
    if (!notifOpen) return;
    const onDoc = (e) => {
      if (notifWrapRef.current && !notifWrapRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [notifOpen]);

  const onNotificationPick = (n) => {
    if (n.section) setActiveSection(n.section);
    setNotifOpen(false);
  };

  const apiLive = !!API_BASE;

  return (
    <header className="hidden lg:block sticky top-0 z-40 shrink-0 border-b border-slate-200 bg-white">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-3 flex flex-row flex-nowrap items-center gap-3 min-w-0">
        <label className="sr-only">Quick search navigation</label>
        <div className="relative flex-1 min-w-0 basis-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="search"
            value={navSearch}
            onChange={(e) => setNavSearch(e.target.value)}
            placeholder="Quick search menu…"
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 text-sm bg-white text-slate-800 placeholder:text-slate-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/15 outline-none transition-shadow"
          />
        </div>

        <div className="relative flex items-center gap-2 shrink-0" ref={notifWrapRef}>
          <button
            type="button"
            onClick={() => apiLive && setNotifOpen((v) => !v)}
            disabled={!apiLive}
            title={!apiLive ? 'Connect the API to load notifications' : undefined}
            className={`inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border text-sm font-semibold transition-colors ${
              !apiLive
                ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                : notifOpen
                  ? 'border-primary-300 bg-primary-50 text-primary-800'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Bell className="w-4 h-4 shrink-0" />
            <span>Notifications</span>
            {apiLive && notifCount > 0 && (
              <span className="min-w-[22px] h-[22px] px-1.5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                {notifCount > 9 ? '9+' : notifCount}
              </span>
            )}
          </button>

          <div
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full border ${
              apiLive
                ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                : 'bg-slate-100 border-slate-200 text-slate-500'
            }`}
            title={
              !apiLive
                ? 'API not configured'
                : lastPolled
                  ? `Updated ${formatNotifTime(lastPolled)}`
                  : 'Live updates'
            }
          >
            <span className="relative flex h-2 w-2 shrink-0">
              {apiLive ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-400" />
              )}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider">{apiLive ? 'Live' : 'Offline'}</span>
          </div>

          {apiLive && notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-[min(100vw-2rem,360px)] z-50 rounded-xl border border-slate-200 bg-white shadow-xl shadow-black/10 max-h-72 overflow-y-auto">
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
      </div>
    </header>
  );
}
