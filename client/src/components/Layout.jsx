import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import CookieConsent from './CookieConsent';
import VisitEngagementPopup from './VisitEngagementPopup';
export default function Layout() {
  const location = useLocation();
  const isStandalonePage = location.pathname === '/admin' || location.pathname === '/dashboard';

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
