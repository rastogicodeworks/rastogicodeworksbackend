import mongoose from 'mongoose';

/**
 * Singleton workspace settings (one document). Created on first GET/PATCH.
 */
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
  },
  { timestamps: true },
);

export const AppSettings =
  mongoose.models.AppSettings || mongoose.model('AppSettings', AppSettingsSchema);
