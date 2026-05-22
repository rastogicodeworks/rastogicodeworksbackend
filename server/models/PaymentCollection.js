import mongoose from 'mongoose';

const PaymentCollectionSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true, trim: true },
    clientEmail: { type: String, trim: true, lowercase: true, default: '' },
    description: { type: String, trim: true, default: '' },
    amount: { type: Number, required: true, min: 0 },
    collectedAmount: { type: Number, min: 0, default: 0 },
    dueDate: { type: String, default: '' },
    notes: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['pending', 'partial', 'collected', 'overdue', 'cancelled'],
      default: 'pending',
    },
    linkedInvoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
  },
  { timestamps: true },
);

PaymentCollectionSchema.index({ clientEmail: 1, status: 1 });
PaymentCollectionSchema.index({ dueDate: 1 });

export const PaymentCollection =
  mongoose.models.PaymentCollection || mongoose.model('PaymentCollection', PaymentCollectionSchema);
