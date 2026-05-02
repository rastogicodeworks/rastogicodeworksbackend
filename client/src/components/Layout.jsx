import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import CookieConsent from './CookieConsent';
import VisitEngagementPopup from './VisitEngagementPopup';
const STANDALONE_DASHBOARD_PREFIXES = ['/admin', '/dashboard', '/employee'];

export default function Layout() {
  const location = useLocation();
  const path = location.pathname.replace(/\/+$/, '') || '/';
  const isStandalonePage = STANDALONE_DASHBOARD_PREFIXES.some(
    (p) => path === p || path.startsWith(`${p}/`),
  );

  if (isStandalonePage) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <CookieConsent />
      <VisitEngagementPopup />
    </div>
  );
}
