import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'rastogi-cookie-consent';
/** Bump this when you change cookie/privacy wording to re-show the banner to existing users */
const CONSENT_VERSION = 1;

/**
 * Data we save for the user's cookie choice (client-side only, in localStorage):
 * - choice: 'accept' | 'reject'
 * - timestamp: when they made the choice (ISO string; useful to re-prompt after 12 months)
 * - version: consent version; bump CONSENT_VERSION to re-show banner when policy/consent text changes
 *
 * Use getStoredConsent() elsewhere (e.g. analytics) to respect the user's choice.
 */
export function getStoredConsent() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.choice === 'accept' || parsed?.choice === 'reject') return parsed;
    return null;
  } catch {
    return null;
  }
}

function saveConsent(choice) {
  const payload = {
    choice,
    timestamp: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [choice, setChoice] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    const stored = getStoredConsent();
    if (stored && stored.version === CONSENT_VERSION) {
      setChoice(stored.choice);
      setVisible(false);
      return;
    }
    // No valid consent or outdated version: show banner
    const t = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(t);
  }, [mounted]);

  const handleAccept = () => {
    saveConsent('accept');
    setChoice('accept');
    setVisible(false);
  };

  const handleReject = () => {
    saveConsent('reject');
    setChoice('reject');
    setVisible(false);
  };

  if (!mounted || !visible || choice) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[9999] p-3 sm:p-4 pointer-events-none isolate"
      aria-live="polite"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div
        className="pointer-events-auto w-full max-w-4xl mx-auto animate-fade-in-up rounded overflow-hidden border border-primary-200/40"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(240,253,244,0.92) 50%, rgba(255,255,255,0.9) 100%)',
          backdropFilter: 'blur(20px) saturate(150%)',
          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
          boxShadow: '0 8px 32px rgba(5, 46, 22, 0.15), inset 0 1px 0 rgba(255,255,255,0.8)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 p-4 sm:px-6 sm:py-5">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div
              className="flex-shrink-0 w-10 h-10 rounded flex items-center justify-center border border-primary-200/60 bg-primary-50"
            >
              <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v10.304c0 1.135.845 2.098 1.972 2.192 1.327.11 2.67.166 4.028.166s2.701-.056 4.028-.166C17.155 20.92 18 19.957 18 18.822V10.608c0-1.135-.845-2.098-1.972-2.192a28.86 28.86 0 00-4.028-.166zm0 0h.008v.008H12V8.25zm0 0V6.75m0 0c-1.355 0-2.697.056-4.024.166C6.845 6.99 6 7.952 6 9.088v.42m12 0v-.42c0-1.136-.845-2.099-1.972-2.193a28.86 28.86 0 00-4.028-.166H12z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className="font-display font-semibold text-base sm:text-lg tracking-tight text-primary-900"
                style={{ textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}
              >
                We value your privacy
              </h3>
              <p
                className="mt-0.5 text-sm leading-relaxed text-primary-800"
                style={{ textShadow: '0 1px 2px rgba(255,255,255,0.6)' }}
              >
                We use cookies to improve your experience and analyze traffic. Choose below.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-shrink-0 border-t border-primary-200/30 pt-4 sm:border-t-0 sm:pt-0">
            <button
              type="button"
              onClick={handleAccept}
              className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium text-white transition-all duration-200 hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:ring-offset-2 focus:ring-offset-white active:scale-[0.98] bg-primary-600 shadow-sm"
            >
              Accept
            </button>
            <button
              type="button"
              onClick={handleReject}
              className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium text-primary-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:ring-offset-2 focus:ring-offset-white active:scale-[0.98] border border-primary-300 bg-white/90 shadow-sm"
            >
              Reject
            </button>
            <Link
              to="/privacy-policy"
              className="inline-flex items-center text-primary-800 hover:text-primary-900 text-sm font-medium underline underline-offset-2 decoration-primary-600 hover:decoration-primary-800 transition-colors py-2 px-1"
              style={{ textShadow: '0 1px 1px rgba(255,255,255,0.5)' }}
            >
              Privacy policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
