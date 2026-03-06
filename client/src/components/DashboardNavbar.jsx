import { useState } from 'react';
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
} from 'lucide-react';

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
};

/**
 * Shared dashboard navbar with hamburger menu (like main site Navbar).
 * variant: 'client' | 'admin'
 * navItems: [{ id, label, icon }] where icon is the key from ICON_MAP
 */
export default function DashboardNavbar({
  variant = 'client',
  navItems = [],
  activeSection,
  setActiveSection,
  onLogout,
  onNewInvoice,
}) {
  const [open, setOpen] = useState(false);

  const label = variant === 'admin' ? 'Admin' : 'Client';

  const handleNavClick = (id) => {
    setActiveSection(id);
    setOpen(false);
  };

  return (
    <header className="relative sticky top-0 z-40 shrink-0 flex justify-center pt-[max(12px,env(safe-area-inset-top))] sm:pt-[max(14px,env(safe-area-inset-top))] md:pt-4 lg:pt-6 pb-2 sm:pb-3 md:pb-4 lg:pb-6 px-2 sm:px-3 md:px-4 bg-gradient-to-b from-primary-50/30 to-transparent">
      {/* Mobile menu backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[90] lg:hidden bg-black/25"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <nav className="relative z-[100] w-full max-w-7xl min-h-[80px] h-[80px] sm:min-h-[76px] sm:h-[76px] md:min-h-[80px] md:h-[80px] lg:min-h-[84px] lg:h-[84px] xl:h-[96px] pl-2 pr-2 sm:pl-4 sm:pr-4 md:pl-6 md:pr-6 lg:pl-8 lg:pr-8 rounded-full flex items-center justify-between gap-1 sm:gap-2 md:gap-4 bg-white/90 sm:bg-white/80 border border-primary-200/60 sm:border-white/60 shadow-lg shadow-black/5 backdrop-blur-xl transition-all duration-300 overflow-visible max-w-[95vw] sm:max-w-[95%]">
        {/* Left: Logo + Brand + label (CLIENT / Admin); click goes to home */}
        <Link
          to="/"
          aria-label="Go to home"
          className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0 min-w-0 max-w-[45%] sm:max-w-[50%] md:max-w-none group"
        >
          <img
            src="/transparent_logo.png"
            alt="Rastogi Codeworks"
            className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 object-contain flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
          />
          <span className="flex flex-col min-w-0">
            <span className="font-brand font-semibold text-xs min-[380px]:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl tracking-tight truncate italic text-primary-950">
              Rastogi Codeworks
            </span>
            <span className="text-[9px] min-[380px]:text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary-600 mt-0.5 truncate">
              {label}
            </span>
          </span>
        </Link>

        {/* Desktop: Nav links — icons-only at lg, icons+labels at xl */}
        <ul className="hidden lg:flex items-center gap-0.5 xl:gap-1 flex-shrink min-w-0">
          {navItems.map(({ id, label: itemLabel, icon: iconKey }) => {
            const Icon = typeof iconKey === 'string' ? ICON_MAP[iconKey] : iconKey;
            if (!Icon) return null;
            return (
              <li key={id} className="flex items-center">
                <button
                  type="button"
                  onClick={() => setActiveSection(id)}
                  title={itemLabel}
                  className={`flex items-center gap-2 px-2.5 xl:px-3.5 py-2 rounded-full text-sm font-medium transition-colors duration-200 ease-out whitespace-nowrap ${
                    activeSection === id
                      ? 'bg-primary-50 text-primary-700 font-semibold'
                      : 'text-slate-600 hover:text-primary-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="hidden xl:inline">{itemLabel}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Desktop: Actions */}
        <div className="hidden lg:flex items-center gap-1.5 xl:gap-2 shrink-0 pl-1">
          {variant === 'client' ? (
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-3.5 xl:px-5 py-2 xl:py-2.5 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-95 whitespace-nowrap text-white bg-primary-500 hover:bg-primary-400 shadow-md shadow-primary-500/20"
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
                className="inline-flex items-center gap-1.5 px-3.5 xl:px-5 py-2 xl:py-2.5 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-95 whitespace-nowrap text-white bg-primary-500 hover:bg-primary-400 shadow-md shadow-primary-500/20"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span className="hidden xl:inline">New Invoice</span>
                <span className="xl:hidden">New</span>
              </button>
            )
          )}
          <button
            type="button"
            onClick={onLogout}
            title="Logout"
            className="flex items-center gap-1.5 xl:gap-2 px-3 xl:px-4 py-2 xl:py-2.5 rounded-full text-sm font-semibold transition-colors duration-200 whitespace-nowrap text-slate-600 hover:text-primary-700 hover:bg-slate-50"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className="hidden xl:inline">Logout</span>
          </button>
        </div>

        {/* Mobile: Hamburger button */}
        <div className="flex lg:hidden items-center gap-1 shrink-0">
          <button
            type="button"
            className="p-2.5 sm:p-3 rounded-full transition-colors text-slate-600 hover:text-primary-700 hover:bg-primary-50"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile dropdown menu  -  inside nav so it positions below the bar */}
        {open && (
          <div className="absolute top-full left-0 right-0 mt-2 mx-auto w-[calc(100%-0.5rem)] max-w-md max-h-[calc(100vh-8rem)] overflow-y-auto z-[110] bg-white border border-primary-200/80 rounded-2xl shadow-xl shadow-black/20 animate-fade-in-up origin-top lg:hidden">
          <div className="p-4 flex flex-col gap-1">
            {navItems.map(({ id, label: itemLabel, icon: iconKey }) => {
              const Icon = typeof iconKey === 'string' ? ICON_MAP[iconKey] : iconKey;
              if (!Icon) return null;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleNavClick(id)}
                  className={`flex items-center gap-3 w-full py-3 px-4 rounded-xl text-left font-medium transition-colors ${
                    activeSection === id
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-slate-600 hover:bg-primary-50 hover:text-primary-900'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {itemLabel}
                </button>
              );
            })}
          </div>
          <div className="border-t border-slate-200 p-4 flex flex-col gap-2">
            {variant === 'client' ? (
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-white bg-primary-500 hover:bg-primary-400 shadow-md"
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
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-white bg-primary-500 hover:bg-primary-400 shadow-md"
                >
                  <Plus className="w-5 h-5" />
                  New Invoice
                </button>
              )
            )}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-slate-600 hover:bg-slate-50"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
        )}
      </nav>
    </header>
  );
}
