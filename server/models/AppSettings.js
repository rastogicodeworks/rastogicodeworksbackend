import mongoose from 'mongoose';

/**
 * Singleton workspace settings (one document). Created on first GET/PATCH.
 */
const MediaImageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    storedName: { type: String, required: true },
    originalName: { type: String, trim: true, default: '' },
    mimeType: { type: String, default: '' },
    size: { type: Number, min: 0, default: 0 },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const AppSettingsSchema = new mongoose.Schema(
  {
    emailEnabled: { type: Boolean, default: true },
    /** Where form/application notifications are sent (founder / ops). */
    founderNotifyEmail: { type: String, trim: true, lowercase: true, default: '' },
    /** Shown as display name in From header (domain must match Resend). */
    emailFromName: { type: String, trim: true, default: 'Rastogi Codeworks' },
    sendContactConfirmToUser: { type: Boolean, default: true },
    notifyFounderOnContact: { type: Boolean, default: true },
    sendCareersConfirmToApplicant: { type: Boolean, default: true },
    notifyFounderOnCareersApply: { type: Boolean, default: true },
    /** Default for invoice UI: offer “email client” when saving. */
    invoiceEmailDefaultOn: { type: Boolean, default: false },
    invoiceCcFounder: { type: Boolean, default: true },
    /** Editable marketing/home copy (admin CMS). Shallow-merged on PATCH. */
    siteContent: { type: mongoose.Schema.Types.Mixed, default: {} },
    /** Uploaded images served from /uploads/:storedName */
    mediaImages: { type: [MediaImageSchema], default: [] },
  },
  { timestamps: true },
);

export const AppSettings =
  mongoose.models.AppSettings || mongoose.model('AppSettings', AppSettingsSchema);
