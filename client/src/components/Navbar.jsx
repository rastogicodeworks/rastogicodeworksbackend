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

const SCROLL_THRESHOLD = 280; // switch to dark navbar after scrolling past hero

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll(); // run once for initial state
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

  const darkMode = scrolled;

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none px-2 sm:px-4 pt-[max(12px,env(safe-area-inset-top))] sm:pt-[max(14px,env(safe-area-inset-top))] md:pt-4 lg:pt-6">
      {/* Mobile menu backdrop  -  below nav so clicking outside closes menu */}
      {open && (
        <div
          className="fixed inset-0 z-0 lg:hidden bg-black/25 pointer-events-auto"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}
      <nav className={`relative z-10 pointer-events-auto backdrop-blur-xl rounded-full pl-3 pr-3 sm:pl-5 sm:pr-5 md:pl-8 md:pr-8 h-[72px] sm:h-[76px] md:h-[84px] lg:h-[96px] w-[95%] max-w-7xl min-w-0 transition-all duration-300 flex items-center justify-between gap-1 sm:gap-2 md:gap-4 ${open ? 'overflow-visible' : 'overflow-hidden'} ${
        darkMode 
          ? 'bg-primary-900/60 md:bg-primary-900/80 border border-white/20 shadow-lg shadow-black/20' 
          : 'bg-white/40 sm:bg-white/50 border border-primary-200/50 sm:border-white/30 shadow-lg shadow-black/10'
      }`}>
        
        {/* Left: Logo + Brand name  -  switch logo when navbar is dark (scrolled); click goes to home and scroll to top */}
        <Link
          to="/"
          aria-label="Go to home"
          className="flex items-center gap-2 md:gap-3 shrink-0 min-w-0 max-w-[60%] sm:max-w-none group"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img
            src={darkMode ? '/logo_transparent.png' : '/transparent_logo.png'}
            alt="Rastogi Codeworks"
            className="h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 object-contain flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
          />
          <span className={`font-brand font-semibold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl tracking-tight truncate italic transition-colors duration-300 ${
            darkMode ? 'text-white' : 'text-primary-950'
          }`}>
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
                    ? darkMode 
                      ? 'bg-white/20 text-white font-semibold' 
                      : 'bg-primary-50 text-primary-700 font-semibold' 
                    : darkMode 
                      ? 'text-white/90 hover:text-white hover:bg-white/10' 
                      : 'text-slate-600 hover:text-primary-700 hover:bg-slate-50'
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
                  darkMode 
                    ? 'text-white/90 hover:text-white hover:bg-white/10' 
                    : 'text-slate-600 hover:text-primary-700 hover:bg-slate-50'
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
                  darkMode 
                    ? 'text-white/90 hover:text-white hover:bg-white/10' 
                    : 'text-slate-600 hover:text-primary-700 hover:bg-slate-50'
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
                  darkMode 
                    ? 'text-white/90 hover:text-white hover:bg-white/10' 
                    : 'text-slate-600 hover:text-primary-700 hover:bg-slate-50'
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
                  darkMode 
                    ? 'text-white/90 hover:text-white hover:bg-white/10' 
                    : 'text-slate-600 hover:text-primary-700 hover:bg-slate-50'
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
                  darkMode 
                    ? 'text-white/90 hover:text-white hover:bg-white/10' 
                    : 'text-slate-600 hover:text-primary-700 hover:bg-slate-50'
                }`}
              >
                Login
              </Link>
              <Link
                to="/contact"
                className={`px-5 py-3 md:px-6 md:py-3.5 rounded-full font-semibold text-sm md:text-base transition-all duration-300 hover:scale-[1.03] active:scale-95 whitespace-nowrap flex-shrink-0 ${
                  darkMode
                    ? 'text-primary-900 bg-white hover:bg-white/90 shadow-md shadow-black/20'
                    : 'text-white bg-primary-500 hover:bg-primary-400 shadow-md shadow-primary-500/20'
                }`}
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
            type="button"
            className={`lg:hidden p-2.5 sm:p-3 rounded-full transition-colors shrink-0 ${
              darkMode ? 'text-white/90 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-primary-700 hover:bg-primary-50'
            }`}
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
        </button>

        {/* Mobile Menu Dropdown  -  only visible below lg; never show on desktop */}
        {open && (
          <div className="absolute top-full left-0 right-0 mt-4 p-6 z-[110] bg-white border border-primary-200/80 rounded-2xl shadow-xl shadow-black/20 animate-fade-in-up origin-top flex flex-col gap-4 max-h-[calc(100vh-7rem)] overflow-y-auto lg:hidden">
            <ul className="space-y-2">
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    onClick={() => setOpen(false)}
                    className={`block py-3 px-6 rounded-xl font-medium text-lg transition-all ${
                      location.pathname === to ? 'bg-primary-50 text-primary-900' : 'text-slate-600 hover:bg-primary-50 hover:text-primary-900'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pt-4 border-t border-slate-200 flex flex-col gap-3">
              {isAdminLoggedIn() ? (
                <>
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="block py-3 px-6 rounded-xl font-medium text-center text-lg text-slate-600 hover:bg-primary-50 hover:text-primary-900"
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
                    className="block py-3 px-6 rounded-xl font-medium text-center text-lg text-slate-600 hover:bg-primary-50 hover:text-primary-900"
                  >
                    Logout
                  </button>
                </>
              ) : isClientLoggedIn() ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className="block py-3 px-6 rounded-xl font-medium text-center text-lg text-slate-600 hover:bg-primary-50 hover:text-primary-900"
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
                    className="block py-3 px-6 rounded-xl font-medium text-center text-lg text-slate-600 hover:bg-primary-50 hover:text-primary-900"
                  >
                    Login
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setOpen(false)}
                    className="block py-3.5 px-6 rounded-xl font-semibold text-center text-lg text-white bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/20"
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
