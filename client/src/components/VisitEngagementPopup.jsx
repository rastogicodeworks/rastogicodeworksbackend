import { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { X, Phone, Download, Send, CheckCircle, ChevronDown, Check } from 'lucide-react';
import { FORMSPREE_CONTACT_URL } from '../config/formspree';

const DELAY_MS = 5_000;
const SESSION_KEY = 'rcw-visit-engagement-popup-dismissed';
/** Bump when changing delay logic so returning visitors get the new schedule */
const FIRE_AT_KEY = 'rcw-visit-engagement-popup-fire-at-v2';

const skipPopup = (pathname) =>
  pathname === '/login' || pathname === '/dashboard' || pathname === '/admin';

const preferredTimeOptions = [
  { value: '', label: 'No preference' },
  { value: 'Morning (9 AM – 12 PM IST)', label: 'Morning (9 AM – 12 PM IST)' },
  { value: 'Afternoon (12 PM – 4 PM IST)', label: 'Afternoon (12 PM – 4 PM IST)' },
  { value: 'Evening (4 PM – 8 PM IST)', label: 'Evening (4 PM – 8 PM IST)' },
  { value: 'Night (8 PM – 10 PM IST)', label: 'Night (8 PM – 10 PM IST)' },
];

/** Matches Tailwind max-h-56; menu flips above trigger when viewport space below is tight */
const MENU_GAP_PX = 8;
const MENU_MAX_H_PX = 224;

function PreferredTimePicker({ value, onChange }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [coords, setCoords] = useState(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const triggerRef = useRef(null);
  const listRef = useRef(null);

  const selectedLabel =
    preferredTimeOptions.find((o) => o.value === value)?.label ?? 'No preference';

  const updateCoords = useCallback(() => {
    if (!triggerRef.current || !menuOpen) return;
    const r = triggerRef.current.getBoundingClientRect();
    const vh = window.visualViewport?.height ?? window.innerHeight;
    const vt = window.visualViewport?.offsetTop ?? 0;
    const spaceBelow = vh + vt - r.bottom - MENU_GAP_PX;
    const spaceAbove = r.top - vt - MENU_GAP_PX;
    const needMin = 200;
    const openUp =
      (spaceBelow < needMin && spaceAbove >= spaceBelow) ||
      (spaceBelow < MENU_MAX_H_PX && spaceAbove > MENU_MAX_H_PX);

    if (openUp) {
      let maxH = Math.min(MENU_MAX_H_PX, Math.max(120, spaceAbove - 8));
      let top = r.top - maxH - MENU_GAP_PX;
      if (top < vt + 8) {
        top = vt + 8;
        maxH = Math.min(maxH, r.top - top - MENU_GAP_PX);
      }
      setCoords({
        top,
        left: r.left,
        width: r.width,
        maxHeight: maxH,
      });
    } else {
      const maxH = Math.min(MENU_MAX_H_PX, Math.max(120, spaceBelow - 8));
      setCoords({
        top: r.bottom + MENU_GAP_PX,
        left: r.left,
        width: r.width,
        maxHeight: maxH,
      });
    }
  }, [menuOpen]);

  useLayoutEffect(() => {
    updateCoords();
  }, [menuOpen, updateCoords]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onScrollResize = () => updateCoords();
    window.addEventListener('scroll', onScrollResize, true);
    window.addEventListener('resize', onScrollResize);
    return () => {
      window.removeEventListener('scroll', onScrollResize, true);
      window.removeEventListener('resize', onScrollResize);
    };
  }, [menuOpen, updateCoords]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onMouseDown = (e) => {
      if (triggerRef.current?.contains(e.target)) return;
      if (listRef.current?.contains(e.target)) return;
      setMenuOpen(false);
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [menuOpen]);

  useLayoutEffect(() => {
    if (!menuOpen) return;
    const i = preferredTimeOptions.findIndex((o) => o.value === value);
    setActiveIdx(i >= 0 ? i : 0);
    listRef.current?.focus();
  }, [menuOpen, value]);

  const pick = (v) => {
    onChange(v);
    setMenuOpen(false);
  };

  const onTriggerKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setMenuOpen((o) => !o);
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setMenuOpen(true);
    }
  };

  const onListKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, preferredTimeOptions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      pick(preferredTimeOptions[activeIdx].value);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIdx(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIdx(preferredTimeOptions.length - 1);
    }
  };

  return (
    <>
      <button
        type="button"
        id="popup-time"
        ref={triggerRef}
        aria-haspopup="listbox"
        aria-expanded={menuOpen}
        aria-controls="popup-time-listbox"
        onClick={() => setMenuOpen((o) => !o)}
        onKeyDown={onTriggerKeyDown}
        className="group flex w-full items-center justify-between gap-2 rounded-xl border-2 border-primary-200/90 bg-gradient-to-b from-white to-emerald-50/40 px-3.5 py-2.5 text-left text-sm font-medium text-slate-800 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset] outline-none transition hover:border-primary-400 hover:shadow-sm focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500/30"
      >
        <span className="min-w-0 flex-1 truncate">{selectedLabel}</span>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-600/10 text-primary-700 transition group-hover:bg-primary-600/15">
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}
            aria-hidden
          />
        </span>
      </button>

      {menuOpen &&
        coords &&
        createPortal(
          <ul
            ref={listRef}
            id="popup-time-listbox"
            role="listbox"
            tabIndex={-1}
            aria-activedescendant={`time-opt-${activeIdx}`}
            onKeyDown={onListKeyDown}
            style={{
              position: 'fixed',
              top: coords.top,
              left: coords.left,
              width: coords.width,
              maxHeight: coords.maxHeight,
              zIndex: 10060,
            }}
            className="overflow-y-auto overscroll-contain rounded-2xl border border-primary-100/90 bg-white py-2 shadow-xl shadow-slate-900/15 ring-1 ring-primary-900/5"
          >
            {preferredTimeOptions.map((opt, idx) => {
              const selected = value === opt.value;
              const highlighted = idx === activeIdx;
              return (
                <li key={opt.value || 'any'} role="presentation" className="px-1.5">
                  <button
                    type="button"
                    id={`time-opt-${idx}`}
                    role="option"
                    aria-selected={selected}
                    onMouseEnter={() => setActiveIdx(idx)}
                    onClick={() => pick(opt.value)}
                    className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                      selected
                        ? 'bg-primary-600 font-semibold text-white shadow-sm'
                        : highlighted
                          ? 'bg-emerald-50 text-primary-900'
                          : 'text-slate-700 hover:bg-emerald-50/80'
                    }`}
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center" aria-hidden>
                      {selected ? <Check className="h-4 w-4 text-white" strokeWidth={2.5} /> : null}
                    </span>
                    <span className="min-w-0 flex-1 leading-snug">{opt.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>,
          document.body
        )}
    </>
  );
}

export default function VisitEngagementPopup() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', preferredTime: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const dismiss = useCallback(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* ignore */
    }
    setOpen(false);
  }, []);

  useEffect(() => {
    if (skipPopup(location.pathname)) return undefined;
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return undefined;
    } catch {
      /* ignore */
    }
    let fireAt = NaN;
    try {
      const raw = sessionStorage.getItem(FIRE_AT_KEY);
      if (raw) fireAt = Number(raw);
      if (!Number.isFinite(fireAt)) {
        fireAt = Date.now() + DELAY_MS;
        sessionStorage.setItem(FIRE_AT_KEY, String(fireAt));
      }
    } catch {
      fireAt = Date.now() + DELAY_MS;
    }
    const ms = Math.max(0, fireAt - Date.now());
    const t = window.setTimeout(() => setOpen(true), ms);
    return () => window.clearTimeout(t);
  }, [location.pathname]);

  useEffect(() => {
    if (skipPopup(location.pathname)) setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, dismiss]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    const message = [
      '[Website popup — request a call]',
      `Phone: ${form.phone}`,
      form.email ? `Email: ${form.email}` : 'Email: (not provided)',
      `Preferred time: ${form.preferredTime || 'Any / flexible'}`,
    ].join('\n');

    const payload = {
      name: form.name,
      phone: form.phone,
      subject: 'Website: Request a call (popup)',
      message,
    };
    const trimmedEmail = form.email.trim();
    if (trimmedEmail) payload.email = trimmedEmail;

    try {
      const res = await fetch(FORMSPREE_CONTACT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok !== false) {
        setStatus({ type: 'success', message: "Thanks — we'll call you soon." });
        setForm({ name: '', phone: '', email: '', preferredTime: '' });
        window.setTimeout(() => {
          dismiss();
        }, 2200);
      } else {
        setStatus({ type: 'error', message: data.error || 'Something went wrong. Try again or use Contact.' });
      }
    } catch {
      setStatus({ type: 'error', message: 'Network error. Please try the Contact page.' });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-end justify-center p-4 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="visit-popup-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        aria-label="Close"
        onClick={dismiss}
      />
      <div className="relative z-[10001] w-full max-w-md overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-900/25 animate-fade-in-up max-h-[min(90vh,640px)] flex flex-col">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-100 bg-gradient-to-br from-primary-50/90 to-white px-5 py-4 sm:px-6">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white shadow-md shadow-primary-600/25">
              <Phone className="h-5 w-5" aria-hidden />
            </div>
            <div className="min-w-0 pt-0.5">
              <h2 id="visit-popup-title" className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                Request a call
              </h2>
              <p className="mt-0.5 text-sm text-slate-600 leading-snug">
                Leave your details and we&apos;ll reach out. Or download our brochure (PDF) below.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="shrink-0 rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
          <a
            href="/Rastogicodeworks-Broucher.pdf"
            download="Rastogicodeworks-Broucher.pdf"
            className="mb-5 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary-200 bg-primary-50/50 px-4 py-3 text-sm font-semibold text-primary-800 transition-colors hover:border-primary-300 hover:bg-primary-50"
          >
            <Download className="h-4 w-4 shrink-0" aria-hidden />
            Download brochure (PDF)
          </a>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="popup-name" className="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">
                Name *
              </label>
              <input
                id="popup-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="popup-phone" className="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">
                Phone *
              </label>
              <input
                id="popup-phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20"
                placeholder="+91 …"
              />
            </div>
            <div>
              <label htmlFor="popup-email" className="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">
                Email <span className="font-normal normal-case text-slate-400">(optional)</span>
              </label>
              <input
                id="popup-email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label htmlFor="popup-time" className="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">
                Best time to call <span className="font-normal normal-case text-slate-400">(optional)</span>
              </label>
              <PreferredTimePicker
                value={form.preferredTime}
                onChange={(v) => setForm((prev) => ({ ...prev, preferredTime: v }))}
              />
            </div>

            {status && (
              <div
                className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium ${
                  status.type === 'success'
                    ? 'border-primary-100 bg-primary-50 text-primary-900'
                    : 'border-red-100 bg-red-50 text-red-800'
                }`}
              >
                {status.type === 'success' && <CheckCircle className="h-4 w-4 shrink-0" />}
                {status.message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-3 text-sm font-bold text-white shadow-lg shadow-primary-600/25 transition hover:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                'Sending…'
              ) : (
                <>
                  Request my call
                  <Send className="h-4 w-4" />
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-slate-500">
              We respect your privacy. This appears once per visit; you can close anytime.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
