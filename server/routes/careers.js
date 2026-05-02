import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { JobPosting } from '../models/JobPosting.js';
import { JobApplication } from '../models/JobApplication.js';

export const careersRouter = Router();

const applyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many applications from this connection. Try again later.' },
});

/** Public: list roles that are open (shown on /careers) */
careersRouter.get('/jobs', async (req, res) => {
  try {
    const jobs = await JobPosting.find({ status: 'open' })
      .select('title department location employmentType description requirements salaryRange createdAt')
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ success: true, jobs });
  } catch (err) {
    console.error('[careers/jobs]', err);
    return res.status(500).json({ success: false, message: 'Unable to load roles.' });
  }
});

/** Public: submit application to an open role */
careersRouter.post('/apply', applyLimiter, async (req, res) => {
  try {
    const { jobId, applicantName, email, phone, coverLetter, portfolioUrl } = req.body || {};
    if (!jobId || !applicantName?.trim() || !email?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Job, full name, and email are required.',
      });
    }
    const job = await JobPosting.findOne({ _id: jobId, status: 'open' }).lean();
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'This role is not accepting applications.',
      });
    }
    await JobApplication.create({
      jobPosting: jobId,
      applicantName: applicantName.trim(),
      email: String(email).trim().toLowerCase(),
      phone: phone ? String(phone).trim() : '',
      coverLetter: coverLetter ? String(coverLetter).trim() : '',
      portfolioUrl: portfolioUrl ? String(portfolioUrl).trim() : '',
    });
    return res.status(201).json({
      success: true,
      message: 'Application received. Our team will review and get back to you.',
    });
  } catch (err) {
    console.error('[careers/apply]', err);
    return res.status(500).json({ success: false, message: 'Could not submit application.' });
  }
});
