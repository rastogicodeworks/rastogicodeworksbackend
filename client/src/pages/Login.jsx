import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Sparkles, FolderOpen, MessageSquare, HelpCircle, Shield, CheckCircle, Eye, EyeOff } from 'lucide-react';
import PageCTA from '../components/PageCTA';
import API_BASE, {
  isProductionWithoutApi,
  PRODUCTION_API_MESSAGE,
  isLocalWithLocalApi,
  LOCAL_SERVER_UNREACHABLE_MESSAGE,
} from '../config/api';
import { setAuthToken } from '../config/auth';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [clientMessage, setClientMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setClientMessage('');
    if (!email.trim() || !password) {
      setClientMessage('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setClientMessage(data.message || (res.status === 401 ? 'Invalid email or password.' : 'Unable to sign in.'));
        return;
      }
      if (data.token) setAuthToken(data.token);
      if (data.user?.role === 'admin') {
        localStorage.setItem('isAdmin', 'true');
        navigate('/admin', { replace: true });
        return;
      }
      if (data.user?.role === 'client') {
        localStorage.setItem('isClient', 'true');
        localStorage.setItem('clientName', data.user?.name || data.user?.email?.split('@')[0] || 'Client');
        navigate('/dashboard', { replace: true });
        return;
      }
      setClientMessage('Unknown account type. Please contact support.');
    } catch {
      let msg = 'Network error. Please try again.';
      if (isProductionWithoutApi()) msg = PRODUCTION_API_MESSAGE;
      else if (isLocalWithLocalApi()) msg = LOCAL_SERVER_UNREACHABLE_MESSAGE;
      setClientMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Full-page hero strip  -  sets the tone */}
      <section className="relative pt-28 pb-8 md:pt-36 md:pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-primary-50/30" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] animate-grid-fade pointer-events-none" />
        <div className="absolute top-0 right-0 w-[min(80vw,600px)] h-[min(80vw,600px)] bg-primary-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[min(60vw,400px)] h-[min(60vw,400px)] bg-primary-50/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-4">
              <Link to="/" className="flex-shrink-0">
                <img
                  src="/transparent_logo.png"
                  alt="Rastogi Codeworks"
                  className="h-16 w-16 md:h-20 md:w-20 object-contain"
                />
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/90 border border-primary-200/80 text-primary-700 px-4 py-2 text-sm font-semibold shadow-sm flex-shrink-0">
                <Sparkles className="w-4 h-4 text-primary-500" />
                Client portal
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-3 text-balance">
              Sign in to your space
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto text-pretty">
              Access project updates, deliverables, and messages. Secure and simple.
            </p>
          </div>
        </div>
      </section>

      {/* Main content  -  form + value props, full width */}
      <section className="relative flex-1 py-4 md:py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-start">
            {/* Left: value + trust */}
            <div className="order-2 lg:order-1 stagger-children">
              <div className="rounded-3xl border border-slate-200/80 bg-slate-50/50 p-6 md:p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Why use the client portal?</h2>
                <ul className="space-y-5">
                  <li className="flex items-start gap-4">
                    <span className="flex items-center justify-center w-11 h-11 rounded-2xl bg-primary-100 text-primary-600 shrink-0">
                      <FolderOpen className="w-5 h-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900">Deliverables in one place</p>
                      <p className="text-sm text-slate-600 mt-0.5">View and download project files and updates anytime.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="flex items-center justify-center w-11 h-11 rounded-2xl bg-primary-100 text-primary-600 shrink-0">
                      <MessageSquare className="w-5 h-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900">Stay in sync</p>
                      <p className="text-sm text-slate-600 mt-0.5">Communicate with your team and track progress.</p>
                    </div>
                  </li>
                </ul>
                <div className="mt-8 pt-6 border-t border-slate-200 flex items-center gap-3 text-slate-600">
                  <Shield className="w-5 h-5 text-primary-600 shrink-0" />
                  <span className="text-sm font-medium">Secure sign-in. Your data is protected.</span>
                </div>
              </div>
            </div>

            {/* Right: form card */}
            <div className="order-1 lg:order-2">
              <div className="rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 p-6 md:p-8 lg:p-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome back</h2>
                <p className="text-slate-600 mb-6">
                  Enter your client portal credentials.{' '}
                  <Link to="/contact" className="text-primary-600 font-semibold hover:underline">
                    Need access?
                  </Link>
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="login-email" className="block text-sm font-semibold text-slate-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full rounded-xl border border-slate-300 bg-slate-50/80 pl-11 pr-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/25 focus:border-primary-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="login-password" className="block text-sm font-semibold text-slate-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-slate-300 bg-slate-50/80 pl-11 pr-12 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/25 focus:border-primary-500 focus:bg-white transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/25 transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="mt-2">
                      <Link to="/contact" className="text-sm text-primary-600 font-medium hover:underline">
                        Forgot password?
                      </Link>
                    </p>
                  </div>

                  {clientMessage && clientMessage !== 'client_contact' && (
                    <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-800">
                      {clientMessage}
                    </div>
                  )}
                  {clientMessage === 'client_contact' && (
                    <div className="rounded-xl bg-primary-50 border border-primary-100 p-4 flex gap-3 animate-fade-in-up">
                      <HelpCircle className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                      <div className="text-sm text-primary-900">
                        <p className="font-semibold mb-1">Don’t have access yet?</p>
                        <p className="text-primary-800 mb-3">
                          We provide client portal credentials per project. Contact us and we’ll set you up.
                        </p>
                        <Link
                          to="/contact"
                          className="inline-flex items-center gap-1.5 text-primary-700 font-semibold hover:text-primary-800"
                        >
                          Contact us for access
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-base font-semibold py-3.5 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:pointer-events-none"
                  >
                    {loading ? 'Signing in…' : 'Sign in'}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-slate-500">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary-500 shrink-0" />
                    Secure connection
                  </span>
                  <span>
                    New here?{' '}
                    <Link to="/contact" className="text-primary-600 font-semibold hover:underline">
                      Start a project
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA  -  full page closure */}
      <PageCTA
        badge="Need help?"
        title="We’re here for you"
        subtitle="Questions about access, projects, or anything else - reach out anytime."
        buttonText="Contact us"
        to="/contact"
      />
    </div>
  );
}
