import mongoose from 'mongoose';

const EmployeeTaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    assigneeEmail: { type: String, required: true, trim: true, lowercase: true },
    dueDate: { type: String, trim: true, default: '' },
    priority: { type: String, enum: ['low', 'normal', 'high'], default: 'normal' },
    status: { type: String, enum: ['todo', 'in_progress', 'done'], default: 'todo' },
  },
  { timestamps: true },
);

EmployeeTaskSchema.index({ assigneeEmail: 1, status: 1 });
EmployeeTaskSchema.index({ createdAt: -1 });

export const EmployeeTask =
  mongoose.models.EmployeeTask || mongoose.model('EmployeeTask', EmployeeTaskSchema);
