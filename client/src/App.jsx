import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Contact from './pages/Contact';
import Compare from './pages/Compare';
import Pricing from './pages/Pricing';
import Clients from './pages/Clients';
import Login from './pages/Login';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import CaseStudies from './pages/CaseStudies';
import Resources from './pages/Resources';
import Documentation from './pages/Documentation';
import Support from './pages/Support';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import RefundPolicy from './pages/RefundPolicy';
import SecurityPolicy from './pages/SecurityPolicy';
import Sitemap from './pages/Sitemap';

function isAdminAuthenticated() {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('isAdmin') === 'true';
}

function isClientAuthenticated() {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('isClient') === 'true';
}

function AdminRoute({ children }) {
  return isAdminAuthenticated() ? children : <Navigate to="/login" replace />;
}

function ClientRoute({ children }) {
  return isClientAuthenticated() ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="services/:id" element={<ServiceDetail />} />
        <Route path="compare" element={<Compare />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="clients" element={<Clients />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route
          path="dashboard"
          element={
            <ClientRoute>
              <ClientDashboard />
            </ClientRoute>
          }
        />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogPost />} />
        <Route path="case-studies" element={<CaseStudies />} />
        <Route path="resources" element={<Resources />} />
        <Route path="documentation" element={<Documentation />} />
        <Route path="support" element={<Support />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="terms-and-conditions" element={<TermsConditions />} />
        <Route path="refund-policy" element={<RefundPolicy />} />
        <Route path="security-policy" element={<SecurityPolicy />} />
        <Route path="sitemap" element={<Sitemap />} />
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
    </>
  );
}

export default App;
