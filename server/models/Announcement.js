import mongoose from 'mongoose';

const AnnouncementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    pinned: { type: Boolean, default: false },
    // 'all' = visible to all clients; specific email = only that client
    audience: { type: String, default: 'all' },
  },
  { timestamps: true },
);

export const Announcement = mongoose.models.Announcement || mongoose.model('Announcement', AnnouncementSchema);
