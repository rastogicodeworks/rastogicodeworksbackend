import mongoose from 'mongoose';

const JobPostingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    department: { type: String, trim: true, default: '' },
    location: { type: String, trim: true, default: '' },
    employmentType: {
      type: String,
      enum: ['full_time', 'part_time', 'contract', 'intern'],
      default: 'full_time',
    },
    description: { type: String, trim: true, default: '' },
    requirements: { type: String, trim: true, default: '' },
    salaryRange: { type: String, trim: true, default: '' },
    status: { type: String, enum: ['draft', 'open', 'closed'], default: 'open' },
  },
  { timestamps: true },
);

JobPostingSchema.index({ status: 1, createdAt: -1 });

export const JobPosting = mongoose.models.JobPosting || mongoose.model('JobPosting', JobPostingSchema);
