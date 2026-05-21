import mongoose from 'mongoose';

const QuotationItemSchema = new mongoose.Schema(
  {
    description: { type: String, trim: true },
    quantity: { type: Number, default: 1, min: 0 },
    price: { type: Number, default: 0, min: 0 },
  },
  { _id: false },
);

const QuotationSchema = new mongoose.Schema(
  {
    quoteNumber: { type: String, required: true, trim: true },
    clientName: { type: String, required: true, trim: true },
    companyName: { type: String, trim: true, default: 'Rastogi Codeworks' },
    projectTitle: { type: String, trim: true, default: '' },
    billingAddress: { type: String, trim: true, default: '' },
    serviceId: { type: String, trim: true, default: '' },
    quoteDate: { type: String, default: '' },
    validUntil: { type: String, default: '' },
    deliveryDays: { type: String, default: '' },
    deliveryUnit: { type: String, enum: ['days', 'months'], default: 'days' },
    projectDeliveryMode: { type: String, trim: true, default: '' },
    phaseCount: { type: String, trim: true, default: '' },
    projectModeDetails: { type: String, trim: true, default: '' },
    scopeType: { type: String, trim: true, default: '' },
    scopeDetails: { type: String, trim: true, default: '' },
    requirements: { type: String, trim: true, default: '' },
    paymentTerms: { type: String, trim: true, default: '' },
    notes: { type: String, trim: true, default: '' },
    items: { type: [QuotationItemSchema], default: [] },
    subtotal: { type: Number, required: true, min: 0, default: 0 },
    total: { type: Number, required: true, min: 0, default: 0 },
    hasCompanyLogo: { type: Boolean, default: false },
    hasClientLogo: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

QuotationSchema.index({ createdAt: -1 });
QuotationSchema.index({ quoteNumber: 1 });

export const Quotation = mongoose.models.Quotation || mongoose.model('Quotation', QuotationSchema);
