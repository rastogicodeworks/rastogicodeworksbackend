import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { JobPosting } from '../models/JobPosting.js';
import { JobApplication } from '../models/JobApplication.js';

export const hiringRouter = Router();
hiringRouter.use(requireAdmin);

// ─── Job postings ───
hiringRouter.get('/jobs', async (req, res) => {
  try {
    const jobs = await JobPosting.find().sort({ createdAt: -1 }).lean();
    const counts = await JobApplication.aggregate([
      { $group: { _id: '$jobPosting', count: { $sum: 1 } } },
    ]);
    const countMap = new Map(counts.map((c) => [String(c._id), c.count]));
    const withCounts = jobs.map((j) => ({
      ...j,
      applicationCount: countMap.get(String(j._id)) || 0,
    }));
    return res.json({ success: true, jobs: withCounts });
  } catch (err) {
    console.error('[hiring/jobs/get]', err);
    return res.status(500).json({ success: false, message: 'Failed to load job postings.' });
  }
});

hiringRouter.post('/jobs', async (req, res) => {
  try {
    const {
      title,
      department,
      location,
      employmentType,
      description,
      requirements,
      salaryRange,
      status,
    } = req.body || {};
    if (!title?.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required.' });
    }
    const job = await JobPosting.create({
      title: title.trim(),
      department: department ? String(department).trim() : '',
      location: location ? String(location).trim() : '',
      employmentType: ['full_time', 'part_time', 'contract', 'intern'].includes(employmentType)
        ? employmentType
        : 'full_time',
      description: description ? String(description).trim() : '',
      requirements: requirements ? String(requirements).trim() : '',
      salaryRange: salaryRange ? String(salaryRange).trim() : '',
      status: ['draft', 'open', 'closed'].includes(status) ? status : 'open',
    });
    return res.status(201).json({ success: true, job });
  } catch (err) {
    console.error('[hiring/jobs/post]', err);
    return res.status(500).json({ success: false, message: 'Failed to create job posting.' });
  }
});

hiringRouter.patch('/jobs/:id', async (req, res) => {
  try {
    const update = {};
    const b = req.body || {};
    if (b.title !== undefined) update.title = String(b.title).trim();
    if (b.department !== undefined) update.department = String(b.department).trim();
    if (b.location !== undefined) update.location = String(b.location).trim();
    if (b.employmentType !== undefined && ['full_time', 'part_time', 'contract', 'intern'].includes(b.employmentType)) {
      update.employmentType = b.employmentType;
    }
    if (b.description !== undefined) update.description = String(b.description).trim();
    if (b.requirements !== undefined) update.requirements = String(b.requirements).trim();
    if (b.salaryRange !== undefined) update.salaryRange = String(b.salaryRange).trim();
    if (b.status !== undefined && ['draft', 'open', 'closed'].includes(b.status)) update.status = b.status;

    const job = await JobPosting.findByIdAndUpdate(req.params.id, update, { new: true }).lean();
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });
    return res.json({ success: true, job });
  } catch (err) {
    console.error('[hiring/jobs/patch]', err);
    return res.status(500).json({ success: false, message: 'Failed to update job.' });
  }
});

hiringRouter.delete('/jobs/:id', async (req, res) => {
  try {
    await JobApplication.deleteMany({ jobPosting: req.params.id });
    const deleted = await JobPosting.findByIdAndDelete(req.params.id).lean();
    if (!deleted) return res.status(404).json({ success: false, message: 'Job not found.' });
    return res.json({ success: true });
  } catch (err) {
    console.error('[hiring/jobs/delete]', err);
    return res.status(500).json({ success: false, message: 'Failed to delete job.' });
  }
});

// ─── Applications ───
hiringRouter.get('/applications', async (req, res) => {
  try {
    const { jobId } = req.query;
    const q = jobId ? { jobPosting: jobId } : {};
    const applications = await JobApplication.find(q)
      .populate('jobPosting', 'title department status')
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ success: true, applications });
  } catch (err) {
    console.error('[hiring/applications/get]', err);
    return res.status(500).json({ success: false, message: 'Failed to load applications.' });
  }
});

hiringRouter.post('/applications', async (req, res) => {
  try {
    const { jobPosting, applicantName, email, phone, coverLetter, portfolioUrl } = req.body || {};
    if (!jobPosting || !applicantName?.trim() || !email?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Job, applicant name, and email are required.',
      });
    }
    const job = await JobPosting.findById(jobPosting).lean();
    if (!job) return res.status(404).json({ success: false, message: 'Job posting not found.' });

    const application = await JobApplication.create({
      jobPosting,
      applicantName: applicantName.trim(),
      email: String(email).trim().toLowerCase(),
      phone: phone ? String(phone).trim() : '',
      coverLetter: coverLetter ? String(coverLetter).trim() : '',
      portfolioUrl: portfolioUrl ? String(portfolioUrl).trim() : '',
    });
    const populated = await JobApplication.findById(application._id)
      .populate('jobPosting', 'title department status')
      .lean();
    return res.status(201).json({ success: true, application: populated });
  } catch (err) {
    console.error('[hiring/applications/post]', err);
    return res.status(500).json({ success: false, message: 'Failed to add application.' });
  }
});

hiringRouter.patch('/applications/:id', async (req, res) => {
  try {
    const { status, internalNotes } = req.body || {};
    const update = {};
    if (status !== undefined && ['new', 'reviewing', 'interview', 'offer', 'hired', 'rejected'].includes(status)) {
      update.status = status;
    }
    if (internalNotes !== undefined) update.internalNotes = String(internalNotes).trim();

    const application = await JobApplication.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate('jobPosting', 'title department status')
      .lean();
    if (!application) return res.status(404).json({ success: false, message: 'Application not found.' });
    return res.json({ success: true, application });
  } catch (err) {
    console.error('[hiring/applications/patch]', err);
    return res.status(500).json({ success: false, message: 'Failed to update application.' });
  }
});

hiringRouter.delete('/applications/:id', async (req, res) => {
  try {
    const deleted = await JobApplication.findByIdAndDelete(req.params.id).lean();
    if (!deleted) return res.status(404).json({ success: false, message: 'Application not found.' });
    return res.json({ success: true });
  } catch (err) {
    console.error('[hiring/applications/delete]', err);
    return res.status(500).json({ success: false, message: 'Failed to delete application.' });
  }
});
