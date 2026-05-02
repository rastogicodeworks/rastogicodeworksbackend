import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, ChevronDown, ChevronUp, Send, CheckCircle, AlertCircle } from 'lucide-react';
import SEO from '../components/SEO';
import API_BASE from '../config/api';

const TYPE_LABELS = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  intern: 'Internship',
};

export default function Careers() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [applyForm, setApplyForm] = useState({
    applicantName: '',
    email: '',
    phone: '',
    coverLetter: '',
    portfolioUrl: '',
  });
  const [applySubmitting, setApplySubmitting] = useState(false);
  const [applyMessage, setApplyMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    window.scrollTo(0, 0);
    let cancelled = false;
    async function load() {
      if (!API_BASE) {
        setError('Careers are temporarily unavailable.');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/api/careers/jobs`);
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok) throw new Error(data.message || 'Failed to load');
        setJobs(data.jobs || []);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Could not load openings.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const toggleApply = (jobId) => {
    setExpandedId((id) => (id === jobId ? null : jobId));
    setApplyMessage({ type: '', text: '' });
    setApplyForm({ applicantName: '', email: '', phone: '', coverLetter: '', portfolioUrl: '' });
  };

  const handleApply = async (e, jobId) => {
    e.preventDefault();
    setApplyMessage({ type: '', text: '' });
    if (!applyForm.applicantName.trim() || !applyForm.email.trim()) {
      setApplyMessage({ type: 'err', text: 'Please enter your name and email.' });
      return;
    }
    setApplySubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/careers/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          applicantName: applyForm.applicantName.trim(),
          email: applyForm.email.trim(),
          phone: applyForm.phone.trim(),
          coverLetter: applyForm.coverLetter.trim(),
          portfolioUrl: applyForm.portfolioUrl.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Submission failed');
      setApplyMessage({ type: 'ok', text: data.message || 'Thank you! We received your application.' });
      setApplyForm({ applicantName: '', email: '', phone: '', coverLetter: '', portfolioUrl: '' });
    } catch (err) {
      setApplyMessage({ type: 'err', text: err.message || 'Something went wrong.' });
    } finally {
      setApplySubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/40 via-white to-slate-50">
      <SEO
        title="Careers"
        description="Open roles at Rastogi Codeworks. Apply for engineering, design, and delivery positions."
        path="/careers"
      />
      <section className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <nav className="text-sm text-slate-500 mb-6">
          <Link to="/" className="hover:text-primary-700">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-primary-800 font-medium">Careers</span>
        </nav>
        <h1 className="text-3xl sm:text-4xl font-bold text-primary-950 tracking-tight mb-3">
          Join the team
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mb-10">
          Open positions are listed below. Status must be <strong>Open</strong> in the admin hiring panel for a role to appear here.
        </p>

        {loading && <p className="text-slate-500">Loading openings…</p>}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-8 text-center text-slate-600">
            <Briefcase className="w-10 h-10 mx-auto text-slate-300 mb-3" />
            <p className="font-medium text-slate-800">No open roles right now</p>
            <p className="text-sm mt-2">Check back later or <Link to="/contact" className="text-primary-600 font-semibold hover:underline">get in touch</Link>.</p>
          </div>
        )}

        <ul className="space-y-4">
          {jobs.map((job) => {
            const id = job._id;
            const open = expandedId === id;
            return (
              <li
                key={id}
                className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-primary-950">{job.title}</h2>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-sm text-slate-600">
                        {[job.department, job.location].filter(Boolean).length > 0 && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            {[job.department, job.location].filter(Boolean).join(' · ')}
                          </span>
                        )}
                        <span className="text-primary-700 font-medium">
                          {TYPE_LABELS[job.employmentType] || job.employmentType}
                        </span>
                        {job.salaryRange && (
                          <span className="text-slate-500">{job.salaryRange}</span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleApply(id)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                    >
                      {open ? (
                        <>
                          <ChevronUp className="w-4 h-4" /> Close
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" /> Apply
                        </>
                      )}
                    </button>
                  </div>
                  {job.description && (
                    <div className="mt-4 text-sm text-slate-700 whitespace-pre-wrap">{job.description}</div>
                  )}
                  {job.requirements && (
                    <div className="mt-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Requirements</p>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap">{job.requirements}</p>
                    </div>
                  )}

                  {open && (
                    <form
                      onSubmit={(e) => handleApply(e, id)}
                      className="mt-6 pt-6 border-t border-slate-100 space-y-3"
                    >
                      <p className="text-sm font-semibold text-primary-950">Apply for this role</p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <input
                          required
                          placeholder="Full name *"
                          value={applyForm.applicantName}
                          onChange={(e) => setApplyForm((p) => ({ ...p, applicantName: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                        />
                        <input
                          required
                          type="email"
                          placeholder="Email *"
                          value={applyForm.email}
                          onChange={(e) => setApplyForm((p) => ({ ...p, email: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                        />
                      </div>
                      <input
                        placeholder="Phone"
                        value={applyForm.phone}
                        onChange={(e) => setApplyForm((p) => ({ ...p, phone: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                      />
                      <input
                        placeholder="Portfolio or LinkedIn URL"
                        value={applyForm.portfolioUrl}
                        onChange={(e) => setApplyForm((p) => ({ ...p, portfolioUrl: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                      />
                      <textarea
                        placeholder="Cover letter (optional)"
                        rows={4}
                        value={applyForm.coverLetter}
                        onChange={(e) => setApplyForm((p) => ({ ...p, coverLetter: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm resize-none"
                      />
                      {applyMessage.text && (
                        <div
                          className={`rounded-lg px-3 py-2 text-sm flex items-center gap-2 ${
                            applyMessage.type === 'ok'
                              ? 'bg-emerald-50 text-emerald-800'
                              : 'bg-red-50 text-red-800'
                          }`}
                        >
                          {applyMessage.type === 'ok' ? (
                            <CheckCircle className="w-4 h-4 shrink-0" />
                          ) : (
                            <AlertCircle className="w-4 h-4 shrink-0" />
                          )}
                          {applyMessage.text}
                        </div>
                      )}
                      <button
                        type="submit"
                        disabled={applySubmitting}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                        {applySubmitting ? 'Sending…' : 'Submit application'}
                      </button>
                    </form>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
