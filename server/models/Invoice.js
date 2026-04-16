import mongoose from 'mongoose';

const PaymentTermSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, default: '' },
    percentage: { type: Number, min: 0, max: 100, required: true },
    dueDate: { type: String, default: '' },
    status: {
      type: String,
      enum: ['due', 'paid', 'partially_paid', 'overdue'],
      default: 'due',
    },
    partialAmount: { type: Number, min: 0, default: 0 },
  },
  { _id: false },
);

const InvoiceItemSchema = new mongoose.Schema(
  {
    description: { type: String, trim: true },
    quantity: { type: Number, default: 1, min: 0 },
    price: { type: Number, default: 0, min: 0 },
  },
  { _id: false },
);

const InvoiceSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true, trim: true },
    clientEmail: { type: String, trim: true, lowercase: true },
    billingAddress: { type: String, trim: true },
    gstNumber: { type: String, trim: true },
    invoiceDate: { type: String, required: true },
    dueDate: { type: String },
    items: { type: [InvoiceItemSchema], default: [] },
    notes: { type: String, trim: true },
    subtotal: { type: Number, required: true, min: 0 },
    taxRate: { type: Number, required: true, min: 0 },
    tax: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    previousBalanceDue: { type: Number, min: 0, default: 0 },
    balanceDue: { type: Number, min: 0, default: 0 },
    linkedPartialInvoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
    status: {
      type: String,
      enum: ['unpaid', 'paid', 'partially_paid', 'overdue'],
      default: 'unpaid',
    },
    paymentTerms: { type: [PaymentTermSchema], default: [] },
    dispute: {
      flagged: { type: Boolean, default: false },
      note: { type: String, trim: true, default: '' },
      flaggedAt: { type: Date },
    },
  },
  { timestamps: true },
);

export const Invoice = mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);

