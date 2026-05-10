import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { requireAdmin } from '../middleware/auth.js';
import { AppSettings } from '../models/AppSettings.js';
import { sendMail, isMailTransportConfigured } from '../services/mail.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const allowedImageMimes = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase() || '.bin';
    const name = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (allowedImageMimes.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, GIF, WebP, or SVG images are allowed.'));
    }
  },
});

export const appSettingsRouter = Router();
appSettingsRouter.use(requireAdmin);

function defaultFounderEmail() {
  return (
    process.env.FOUNDER_NOTIFY_EMAIL?.trim().toLowerCase() ||
    process.env.ADMIN_EMAIL?.trim().toLowerCase() ||
    ''
  );
}

async function getOrCreateSettings() {
  let doc = await AppSettings.findOne();
  if (!doc) {
    doc = await AppSettings.create({
      founderNotifyEmail: defaultFounderEmail(),
    });
  }
  return doc;
}

function toPublicSettings(doc) {
  const o = doc.toObject();
  delete o.__v;
  return o;
}

// GET /api/settings/app
appSettingsRouter.get('/', async (req, res) => {
  try {
    const doc = await getOrCreateSettings();
    return res.json({
      success: true,
      settings: toPublicSettings(doc),
      mailTransportConfigured: isMailTransportConfigured(),
    });
  } catch (err) {
    console.error('[settings/app get]', err);
    return res.status(500).json({ success: false, message: 'Failed to load settings.' });
  }
});

// PATCH /api/settings/app
appSettingsRouter.patch('/', async (req, res) => {
  try {
    const doc = await getOrCreateSettings();
    const b = req.body || {};
    const allowed = [
      'emailEnabled',
      'founderNotifyEmail',
      'emailFromName',
      'sendContactConfirmToUser',
      'notifyFounderOnContact',
      'sendCareersConfirmToApplicant',
      'notifyFounderOnCareersApply',
      'invoiceEmailDefaultOn',
      'invoiceCcFounder',
    ];
    for (const key of allowed) {
      if (b[key] === undefined) continue;
      if (key === 'founderNotifyEmail') {
        doc.founderNotifyEmail = String(b[key]).trim().toLowerCase();
      } else if (key === 'emailFromName') {
        doc.emailFromName = String(b[key]).trim().slice(0, 120) || 'Rastogi Codeworks';
      } else if (typeof b[key] === 'boolean') {
        doc[key] = b[key];
      }
    }
    if (
      b.siteContent !== undefined &&
      typeof b.siteContent === 'object' &&
      b.siteContent !== null &&
      !Array.isArray(b.siteContent)
    ) {
      const prev =
        doc.siteContent &&
        typeof doc.siteContent === 'object' &&
        !Array.isArray(doc.siteContent)
          ? { ...doc.siteContent }
          : {};
      doc.siteContent = { ...prev, ...b.siteContent };
      doc.markModified('siteContent');
    }
    await doc.save();
    return res.json({
      success: true,
      settings: toPublicSettings(doc),
      mailTransportConfigured: isMailTransportConfigured(),
    });
  } catch (err) {
    console.error('[settings/app patch]', err);
    return res.status(500).json({ success: false, message: 'Failed to save settings.' });
  }
});

// POST /api/settings/app/test-email — send a test message to founderNotifyEmail
appSettingsRouter.post('/test-email', async (req, res) => {
  try {
    if (!isMailTransportConfigured()) {
      return res.status(400).json({
        success: false,
        message: 'Add RESEND_API_KEY and MAIL_FROM to the server .env first.',
      });
    }
    const doc = await getOrCreateSettings();
    const to = String(req.body?.to || doc.founderNotifyEmail || '').trim().toLowerCase();
    if (!to) {
      return res.status(400).json({
        success: false,
        message: 'Set a founder notification email below, or pass { "to": "you@..." } in the body.',
      });
    }
    const fromName = doc.emailFromName || 'Rastogi Codeworks';
    const result = await sendMail({
      to,
      fromDisplayName: fromName,
      subject: `${fromName} — Test email`,
      html: `<p>This is a test message from your Rastogi Codeworks server.</p><p>If you received it, Resend is configured correctly.</p>`,
    });
    if (!result.ok) {
      return res.status(502).json({
        success: false,
        message: result.skipped ? 'Mail transport not configured.' : result.error || 'Send failed.',
      });
    }
    return res.json({ success: true, message: `Test email sent to ${to}.`, id: result.id });
  } catch (err) {
    console.error('[settings/app test-email]', err);
    return res.status(500).json({ success: false, message: 'Failed to send test email.' });
  }
});

// POST /api/settings/app/media — upload image (multipart field name: file)
appSettingsRouter.post('/media', (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      const msg =
        err instanceof multer.MulterError ? err.message : err.message || 'Upload failed.';
      return res.status(400).json({ success: false, message: msg });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }
    const doc = await getOrCreateSettings();
    const id = crypto.randomUUID();
    const entry = {
      id,
      storedName: req.file.filename,
      originalName: String(req.file.originalname || '').slice(0, 200),
      mimeType: req.file.mimetype,
      size: req.file.size || 0,
      uploadedAt: new Date(),
    };
    doc.mediaImages = [...(doc.mediaImages || []), entry];
    await doc.save();
    return res.status(201).json({
      success: true,
      media: { ...entry, url: `/uploads/${entry.storedName}` },
      settings: toPublicSettings(doc),
      mailTransportConfigured: isMailTransportConfigured(),
    });
  } catch (err) {
    console.error('[settings/app media post]', err);
    return res.status(500).json({ success: false, message: 'Failed to save upload.' });
  }
});

// DELETE /api/settings/app/media/:id — remove library entry and file from disk
appSettingsRouter.delete('/media/:id', async (req, res) => {
  try {
    const doc = await getOrCreateSettings();
    const id = String(req.params.id || '').trim();
    const list = doc.mediaImages || [];
    const idx = list.findIndex((m) => m.id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Image not found.' });
    }
    const [removed] = list.splice(idx, 1);
    doc.mediaImages = list;
    await doc.save();
    try {
      fs.unlinkSync(path.join(uploadsDir, removed.storedName));
    } catch (_) {
      /* file may already be gone */
    }
    return res.json({
      success: true,
      settings: toPublicSettings(doc),
      mailTransportConfigured: isMailTransportConfigured(),
    });
  } catch (err) {
    console.error('[settings/app media delete]', err);
    return res.status(500).json({ success: false, message: 'Failed to delete image.' });
  }
});
