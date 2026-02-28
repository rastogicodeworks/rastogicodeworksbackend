import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Linkedin, CheckCircle, ArrowRight } from 'lucide-react';
import PageCTA from '../components/PageCTA';
import SEO from '../components/SEO';

const FORMSPREE_URL = 'https://formspree.io/f/xdalgpab';

const emailSubject = 'Enquiry from your website';
const emailBody = `Hey,

I am reaching out from your website. I would like to discuss how we can work together.

Best regards`;
const mailtoHref = `mailto:rastogicodeworks@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

const whatsAppText = 'Hey, I am reaching out from your website. I would like to connect with Rastogi Codeworks. Could we schedule a call?';
const whatsAppHref = `https://wa.me/918859985607?text=${encodeURIComponent(whatsAppText)}`;

const contactOptions = [
  {
    icon: <Mail className="w-5 h-5" />,
    label: 'Email us',
    value: 'rastogicodeworks@gmail.com',
    href: mailtoHref,
  },
  {
    icon: <Phone className="w-5 h-5" />,
    label: 'Call us',
    value: '+91 88599- 85607',
    href: whatsAppHref,
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    label: 'Address',
    value: 'Netaji Subhash Place, New Delhi, India',
    href: 'https://maps.google.com/?q=Netaji+Subhash+Place,+New+Delhi,+India',
  },
  {
    icon: <MessageCircle className="w-5 h-5" />,
    label: 'WhatsApp',
    value: 'Chat with us',
    href: whatsAppHref,
  },
  {
    icon: <Linkedin className="w-5 h-5" />,
    label: 'LinkedIn',
    value: 'Connect on LinkedIn',
    href: 'https://www.linkedin.com/company/rastogicodeworks/',
  },
];

function WhatsAppIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok !== false) {
        setStatus({ type: 'success', message: 'Thank you! We will get back to you soon.' });
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setStatus({ type: 'error', message: data.error || 'Something went wrong. Please try again.' });
      }
    } catch {
      setStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-x-hidden bg-white selection:bg-primary-100 selection:text-primary-900 font-sans">
      <SEO
        title="Contact"
        description="Contact Rastogi Codeworks for custom software development. Email rastogicodeworks@gmail.com, call +91 8859985607, or use our form. Based in Netaji Subhash Place, New Delhi. Get a free quote for web, mobile, or cloud projects across India."
        path="/contact"
        keywords="contact Rastogi Codeworks, software development enquiry, get quote India, web development contact, New Delhi software company, hire developers India"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'Rastogi Codeworks',
          description: 'Professional software development and digital solutions. Where Code Meets Experience.',
          url: 'https://rastogicodeworks.com',
          email: 'rastogicodeworks@gmail.com',
          telephone: '+918859985607',
          address: { '@type': 'PostalAddress', addressLocality: 'New Delhi', addressRegion: 'Delhi', addressCountry: 'IN' },
          areaServed: { '@type': 'Country', name: 'India' },
        }}
      />
      {/* Hero  -  inviting, connection-focused */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-50/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,197,94,0.06),transparent)] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-slate-200/80 text-slate-600 text-sm font-medium mb-8 shadow-sm shadow-slate-200/50 backdrop-blur-sm">
            <MessageCircle className="w-4 h-4 text-primary-600" />
            <span className="uppercase tracking-widest">Get in touch</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-8 leading-[1.08] mt-0">
            Let&apos;s build something{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-500 to-teal-500">
              great together
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Have a project in mind? We&apos;d love to hear from you. Share your ideas and we&apos;ll get back with a clear plan and next steps.
          </p>
        </div>
      </section>

      {/* Main content  -  contact options + form */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left  -  why connect + contact options */}
            <div className="lg:col-span-5">
              <p className="text-sm font-semibold text-primary-600 uppercase tracking-widest mb-4">We&apos;re here to help</p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-6 leading-tight">
                Start a conversation
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-10">
                Whether you need a new website, API, or full-stack application - we&apos;re here to help. Share your requirements and we&apos;ll respond with next steps.
              </p>

              {/* Contact cards */}
              <div className="space-y-4 mb-10">
                {contactOptions.map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-primary-100 hover:bg-primary-50/30 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-600 group-hover:text-primary-600 group-hover:border-primary-100 transition-colors shadow-sm">
                      {item.label === 'WhatsApp' ? <WhatsAppIcon className="w-5 h-5" /> : item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{item.label}</p>
                      <p className="font-semibold text-slate-900 truncate">{item.value}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all shrink-0" />
                  </a>
                ))}
              </div>

              {/* Trust strip */}
              <div className="rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100/50 border border-primary-100 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-600 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 mb-1">Response time</p>
                    <p className="text-sm text-slate-600">We typically reply within 24–48 hours on business days.</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-100 p-6">
                <p className="font-bold text-slate-900 mb-2">What to include</p>
                <p className="text-sm text-slate-600">Project type, timeline, and any technical constraints. The more detail, the better we can tailor our response.</p>
              </div>
            </div>

            {/* Right  -  form */}
            <div id="contact-form" className="lg:col-span-7 scroll-mt-24">
              <div className="rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/30 p-8 md:p-10 lg:p-12">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Send us a message</h3>
                <p className="text-slate-600 mb-8">Fill in the form below and we&apos;ll get back to you soon.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">Name *</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white outline-none transition placeholder:text-slate-400"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">Email *</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white outline-none transition placeholder:text-slate-400"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">Contact number</label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white outline-none transition placeholder:text-slate-400"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                      <input
                        id="subject"
                        name="subject"
                        type="text"
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white outline-none transition placeholder:text-slate-400"
                        placeholder="Project or inquiry"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white outline-none transition resize-none placeholder:text-slate-400"
                      placeholder="Tell us about your project, timeline, and goals..."
                    />
                  </div>
                  {status && (
                    <div className={`flex items-center gap-3 p-4 rounded-xl ${status.type === 'success' ? 'bg-primary-50 text-primary-800 border border-primary-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                      {status.type === 'success' && <CheckCircle className="w-5 h-5 shrink-0" />}
                      <p className="text-sm font-medium">{status.message}</p>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl font-bold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>Sending...</>
                    ) : (
                      <>
                        Send message
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PageCTA
        title="Ready to start your project?"
        subtitle="Use the form above or reach out directly - we typically reply within 24–48 hours."
        buttonText="Back to form"
        to="#contact-form"
      />

      {/* Reassurance strip */}
      <section className="py-16 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-600 text-lg font-medium">
            No commitment required. Share your idea and we&apos;ll respond with honest feedback and a clear path forward.
          </p>
        </div>
      </section>
    </div>
  );
}
