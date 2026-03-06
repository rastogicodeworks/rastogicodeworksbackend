import mongoose from 'mongoose';

const MilestoneSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false },
    dueDate: { type: String, default: '' },
  },
  { _id: false },
);

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    clientEmail: { type: String, trim: true, lowercase: true, default: '' },
    clientName: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['planning', 'in-progress', 'review', 'completed', 'on-hold'],
      default: 'planning',
    },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    startDate: { type: String, default: '' },
    dueDate: { type: String, default: '' },
    milestones: { type: [MilestoneSchema], default: [] },
  },
  { timestamps: true },
);

ProjectSchema.index({ clientEmail: 1 });

export const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
