import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'client'], required: true, default: 'client' },
    name: { type: String, trim: true },
    gstNumber: { type: String, trim: true },
    billingAddress: { type: String, trim: true },
  },
  { timestamps: true },
);

UserSchema.index({ role: 1 });

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
