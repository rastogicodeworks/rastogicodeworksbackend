import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/clients', label: 'Clients' },
  { to: '/compare', label: 'Compare' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/contact', label: 'Contact' },
];

function isAdminLoggedIn() {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('isAdmin') === 'true';
}

function isClientLoggedIn() {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('isClient') === 'true';
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu when viewport becomes desktop (lg) so it never shows alongside horizontal nav
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const handler = () => {
      if (media.matches) setOpen(false);
    };
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  const darkMode = false;
  const isHome = location.pathname === '/';
  const pathSegs = location.pathname.split('/').filter(Boolean);
  const isServiceDetail = pathSegs[0] === 'services' && pathSegs.length >= 2;
  const isPricingPage = location.pathname === '/pricing';
  /** Dark-hero pages: frosted bar + light text at top; solid white after scroll */
  const liquidGlass = (isHome || isServiceDetail) && !scrolled;
  /** Solid readable bar (scrolled, or pricing hero which is light) */
  const solidLightBar = scrolled || (isPricingPage && !scrolled);

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none px-2 sm:px-4 pt-[max(12px,env(safe-area-inset-top))] sm:pt-[max(14px,env(safe-area-inset-top))] md:pt-4 lg:pt-6">
      {/* Mobile menu backdrop  -  below nav so clicking outside closes menu */}
      {open && (
        <div
          className="fixed inset-0 z-0 lg:hidden bg-black/40 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-black/25 pointer-events-auto"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}
      <nav
        className={`relative z-10 pointer-events-auto rounded-full pl-5 pr-5 sm:pl-6 sm:pr-6 md:pl-8 md:pr-8 h-[84px] sm:h-[88px] md:h-[96px] lg:h-[108px] w-[95%] max-w-7xl min-w-0 transition-all duration-500 flex items-center justify-between gap-1 sm:gap-2 md:gap-4 [transition-property:background-color,backdrop-filter,box-shadow,border-color] ${open ? 'overflow-visible' : 'overflow-hidden'} ${
          liquidGlass
            ? 'border border-white/15 bg-white/[0.04] shadow-lg shadow-black/10 backdrop-blur-3xl backdrop-saturate-200'
            : solidLightBar
              ? 'border border-slate-200/50 bg-white shadow-md shadow-slate-900/[0.07] backdrop-blur-3xl backdrop-saturate-100'
              : 'border border-slate-200/40 bg-white/50 shadow-md shadow-slate-900/[0.04] backdrop-blur-xl backdrop-saturate-150'
        }`}
      >
        
        {/* Left: Logo + Brand name  -  light text on liquid (home / service detail hero); click goes to home */}
        <Link
          to="/"
          aria-label="Go to home"
          className="flex items-center gap-2 md:gap-3 shrink-0 min-w-0 max-w-[70%] sm:max-w-none group"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img
            src={darkMode ? '/logo_transparent.png' : '/transparent_logo.png'}
            alt="Rastogi Codeworks"
            className="h-11 w-11 sm:h-11 sm:w-11 md:h-12 md:w-12 lg:h-14 lg:w-14 object-contain flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
          />
          <span
            className={`font-brand font-semibold text-lg leading-tight tracking-tight sm:text-xl md:text-xl lg:text-2xl truncate italic transition-colors duration-300 ${
              darkMode || liquidGlass ? 'text-white drop-shadow-sm' : 'text-primary-950'
            }`}
          >
            Rastogi Codeworks
          </span>
        </Link>

        {/* Middle: Navigation Links  -  include Dashboard when client is logged in */}
        <ul className="hidden lg:flex items-center gap-1 xl:gap-2 h-full flex-shrink min-w-0">
          {navLinks.map(({ to, label }) => (
            <li key={to} className="h-full flex items-center">
              <Link
                to={to}
                className={`px-4 py-2 rounded-full text-sm xl:text-base font-medium transition-colors duration-200 ease-out whitespace-nowrap ${
                  location.pathname === to
                    ? darkMode || liquidGlass
                      ? 'bg-white/25 text-white font-semibold shadow-inner shadow-black/10'
                      : 'bg-primary-50 text-primary-700 font-semibold'
                    : darkMode || liquidGlass
                      ? 'text-white/90 hover:bg-white/15 hover:text-white'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-primary-700'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right: Actions  -  Admin/Client + Logout when logged in, else Login + Get Started */}
        <div className="hidden md:flex items-center gap-2 md:gap-3 shrink-0 pl-2">
          {isAdminLoggedIn() ? (
            <>
              <Link
                to="/admin"
                className={`px-4 py-2.5 md:px-5 md:py-3 rounded-full text-sm md:text-base font-semibold transition-colors duration-200 whitespace-nowrap ${
                  darkMode || liquidGlass
                    ? 'text-white/90 hover:bg-white/15 hover:text-white'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-primary-700'
                }`}
              >
                Admin
              </Link>
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('isAdmin');
                  window.location.href = '/login';
                }}
                className={`px-4 py-2.5 md:px-5 md:py-3 rounded-full text-sm md:text-base font-semibold transition-colors duration-200 whitespace-nowrap ${
                  darkMode || liquidGlass
                    ? 'text-white/90 hover:bg-white/15 hover:text-white'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-primary-700'
                }`}
              >
                Logout
              </button>
            </>
          ) : isClientLoggedIn() ? (
            <>
              <Link
                to="/dashboard"
                className={`px-4 py-2.5 md:px-5 md:py-3 rounded-full text-sm md:text-base font-semibold transition-colors duration-200 whitespace-nowrap ${
                  darkMode || liquidGlass
                    ? 'text-white/90 hover:bg-white/15 hover:text-white'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-primary-700'
                }`}
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('isClient');
                  localStorage.removeItem('clientName');
                  window.location.href = '/login';
                }}
                className={`px-4 py-2.5 md:px-5 md:py-3 rounded-full text-sm md:text-base font-semibold transition-colors duration-200 whitespace-nowrap ${
                  darkMode || liquidGlass
                    ? 'text-white/90 hover:bg-white/15 hover:text-white'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-primary-700'
                }`}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`px-4 py-2.5 md:px-5 md:py-3 rounded-full text-sm md:text-base font-semibold transition-colors duration-200 whitespace-nowrap ${
                  darkMode || liquidGlass
                    ? 'text-white/90 hover:bg-white/15 hover:text-white'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-primary-700'
                }`}
              >
                Login
              </Link>
              <Link
                to="/contact"
                className={`px-5 py-3 md:px-6 md:py-3.5 rounded-full font-semibold text-sm md:text-base transition-all duration-300 hover:scale-[1.03] active:scale-95 whitespace-nowrap flex-shrink-0 ${
                  darkMode || liquidGlass
                    ? 'bg-white text-primary-900 shadow-lg shadow-black/25 hover:bg-primary-50'
                    : 'bg-primary-500 text-white shadow-md shadow-primary-500/20 hover:bg-primary-400'
                }`}
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu: hamburger (closed) / X (open) */}
        <button
          type="button"
          className={`lg:hidden relative shrink-0 rounded-full p-3 transition-colors sm:p-3.5 ${
            darkMode || liquidGlass
              ? 'text-white hover:bg-white/15 hover:text-white'
              : 'text-slate-600 hover:bg-primary-50 hover:text-primary-700'
          }`}
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <span className="relative inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center">
            <svg
              className={`absolute inset-0 h-full w-full transition-opacity duration-300 ease-out ${
                open ? 'pointer-events-none opacity-0' : 'opacity-100'
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M5 7h14M5 12h14M5 17h14" />
            </svg>
            <svg
              className={`absolute inset-0 h-full w-full transition-opacity duration-300 ease-out ${
                open ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M7 7l10 10M17 7L7 17" />
            </svg>
          </span>
        </button>

        {/* Mobile Menu Dropdown  -  only visible below lg; never show on desktop */}
        {open && (
          <div
            className={`absolute left-0 right-0 top-full z-[110] mt-4 flex max-h-[calc(100vh-7rem)] flex-col gap-4 overflow-y-auto rounded-2xl p-6 shadow-xl animate-fade-in-up origin-top lg:hidden [transform:translateZ(0)] isolate ${
              liquidGlass
                ? 'border border-white/30 bg-slate-950/35 text-white shadow-black/40 backdrop-blur-3xl backdrop-saturate-200'
                : 'border border-slate-200/60 bg-white/70 text-slate-900 shadow-black/20 backdrop-blur-3xl backdrop-saturate-150'
            }`}
          >
            <ul className="space-y-2">
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    onClick={() => setOpen(false)}
                    className={`block rounded-xl px-6 py-3 text-lg font-medium transition-all ${
                      liquidGlass
                        ? location.pathname === to
                          ? 'bg-white/20 font-semibold text-white'
                          : 'text-white/90 hover:bg-white/10 hover:text-white'
                        : location.pathname === to
                          ? 'bg-primary-50 text-primary-900'
                          : 'text-slate-600 hover:bg-primary-50 hover:text-primary-900'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div
              className={`flex flex-col gap-3 border-t pt-4 ${liquidGlass ? 'border-white/20' : 'border-slate-200'}`}
            >
              {isAdminLoggedIn() ? (
                <>
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className={`block rounded-xl px-6 py-3 text-center text-lg font-medium ${
                      liquidGlass
                        ? 'text-white/90 hover:bg-white/10 hover:text-white'
                        : 'text-slate-600 hover:bg-primary-50 hover:text-primary-900'
                    }`}
                  >
                    Admin
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      localStorage.removeItem('isAdmin');
                      window.location.href = '/login';
                    }}
                    className={`block rounded-xl px-6 py-3 text-center text-lg font-medium ${
                      liquidGlass
                        ? 'text-white/90 hover:bg-white/10 hover:text-white'
                        : 'text-slate-600 hover:bg-primary-50 hover:text-primary-900'
                    }`}
                  >
                    Logout
                  </button>
                </>
              ) : isClientLoggedIn() ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className={`block rounded-xl px-6 py-3 text-center text-lg font-medium ${
                      liquidGlass
                        ? 'text-white/90 hover:bg-white/10 hover:text-white'
                        : 'text-slate-600 hover:bg-primary-50 hover:text-primary-900'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      localStorage.removeItem('isClient');
                      localStorage.removeItem('clientName');
                      window.location.href = '/login';
                    }}
                    className="block py-3.5 px-6 rounded-xl font-semibold text-center text-lg text-white bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/20"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className={`block rounded-xl px-6 py-3 text-center text-lg font-medium ${
                      liquidGlass
                        ? 'text-white/90 hover:bg-white/10 hover:text-white'
                        : 'text-slate-600 hover:bg-primary-50 hover:text-primary-900'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setOpen(false)}
                    className="block rounded-xl bg-primary-600 px-6 py-3.5 text-center text-lg font-semibold text-white shadow-lg shadow-primary-500/20 hover:bg-primary-700"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
