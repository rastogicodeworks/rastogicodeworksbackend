import mongoose from 'mongoose';

const JobApplicationSchema = new mongoose.Schema(
  {
    jobPosting: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPosting', required: true },
    applicantName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, default: '' },
    coverLetter: { type: String, trim: true, default: '' },
    portfolioUrl: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['new', 'reviewing', 'interview', 'offer', 'hired', 'rejected'],
      default: 'new',
    },
    internalNotes: { type: String, trim: true, default: '' },
  },
  { timestamps: true },
);

JobApplicationSchema.index({ jobPosting: 1, createdAt: -1 });
JobApplicationSchema.index({ email: 1 });

export const JobApplication =
  mongoose.models.JobApplication || mongoose.model('JobApplication', JobApplicationSchema);
