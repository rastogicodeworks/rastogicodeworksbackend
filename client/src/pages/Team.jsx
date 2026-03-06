import { Link } from 'react-router-dom';
import { ArrowRight, User, Quote, CheckCircle, Linkedin, Mail, Phone } from 'lucide-react';
import PageCTA from '../components/PageCTA';

const founder = {
  name: 'Vasu Rastogi',
  role: 'Founder & CEO',
  focus: 'Leading Rastogi Codeworks with a focus on building reliable software, transparent client relationships, and a team that ships with confidence. Passionate about turning ideas into products that move businesses forward.',
  initials: 'VR',
  linkedin: 'https://www.linkedin.com/in/vasu-rastogi',
  whatsapp: 'https://wa.me/918859985607',
  phone: 'tel:+918859985607',
  email: `mailto:rastogicodeworks@gmail.com?subject=${encodeURIComponent('Hello from your website')}&body=${encodeURIComponent('Hey,\n\nI am reaching out from your website. I would like to connect with Rastogi Codeworks.\n\nBest regards')}`,
};

function WhatsAppIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const howWeWork = [
  'Weekly or bi-weekly check-ins with clear agendas and outcomes.',
  'Dedicated Slack/Teams channels for quick questions and updates.',
  'Documentation-first mindset so knowledge stays with your company.',
];

export default function Team() {
  return (
    <div className="overflow-x-hidden bg-white selection:bg-primary-100 selection:text-primary-900 font-sans">
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-50/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-slate-200/80 text-slate-600 text-sm font-medium mb-12 shadow-sm shadow-slate-200/50 backdrop-blur-sm">
            <User className="w-4 h-4 text-primary-600" />
            <span className="uppercase tracking-widest">Our Team</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-8 leading-[1.08] mt-0">
            The person behind{' '}
            <span className="font-brand font-semibold italic text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-500 to-teal-500">
              Rastogi Codeworks
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            A small, senior-led company focused on one thing: shipping software your business and users can rely on.
          </p>
        </div>
      </section>

      {/* Founder profile  -  single featured card */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/30 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/40 transition-shadow duration-300">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
              {/* Photo */}
              <div className="md:col-span-2 relative overflow-hidden bg-primary-50 min-h-[280px] md:min-h-0">
                <img
                  src="/Vasu.jpeg"
                  alt="Vasu Rastogi – Founder & CEO, Rastogi Codeworks"
                  className="w-full h-full object-cover object-top absolute inset-0"
                />
                {/* subtle gradient overlay at bottom to blend into card */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/20 to-transparent pointer-events-none md:hidden" />
              </div>
              {/* Content */}
              <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-center">
                <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-2">
                  Founder &amp; CEO
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
                  {founder.name}
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                  {founder.focus}
                </p>
                {/* Contact icons  -  LinkedIn, WhatsApp, Call, Mail */}
                <div className="flex flex-wrap items-center gap-3 mb-8">
                  <a
                    href={founder.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-primary-50 hover:text-primary-600 transition-all duration-300 hover:scale-105"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href={founder.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-[#25D366]/10 hover:text-[#25D366] transition-all duration-300 hover:scale-105"
                    aria-label="WhatsApp"
                  >
                    <WhatsAppIcon className="w-5 h-5" />
                  </a>
                  <a
                    href={founder.phone}
                    className="w-11 h-11 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-primary-50 hover:text-primary-600 transition-all duration-300 hover:scale-105"
                    aria-label="Call"
                  >
                    <Phone className="w-5 h-5" />
                  </a>
                  <a
                    href={founder.email}
                    className="w-11 h-11 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-primary-50 hover:text-primary-600 transition-all duration-300 hover:scale-105"
                    aria-label="Email"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                </div>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center w-full md:w-auto px-8 py-4 rounded-full bg-primary-600 text-white font-bold shadow-lg shadow-primary-500/25 hover:bg-primary-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  Get in touch
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How we work with you */}
      <section className="py-20 md:py-28 bg-slate-50/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-semibold text-primary-600 uppercase tracking-widest mb-4">How we work</p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-6 leading-tight">
                We plug into your team
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                We work as an extension of your existing team - or as your full product team if you&apos;re just getting started. You get direct access to the people doing the work, regular check-ins, and honest guidance.
              </p>
              <ul className="space-y-4">
                {howWeWork.map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-slate-700">
                    <CheckCircle className="w-6 h-6 text-primary-500 shrink-0 mt-0.5" />
                    <span className="text-base font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-white border border-slate-100 p-8 md:p-10 shadow-lg shadow-slate-200/30">
              <Quote className="w-12 h-12 text-primary-200 mb-6" />
              <p className="text-lg font-semibold text-slate-900 mb-4">
                Built for long-term partnerships
              </p>
              <p className="text-slate-600 leading-relaxed">
                Many of our clients stay with us beyond their first launch. We help them iterate on features, expand into new markets, and keep their systems healthy as they grow.
              </p>
            </div>
          </div>
        </div>
      </section>

      <PageCTA
        title="Ready to build together?"
        subtitle="Reach out and we'll get back with a clear plan and next steps."
        buttonText="Contact us"
      />
    </div>
  );
}
