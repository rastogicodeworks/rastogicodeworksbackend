import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { AppSettings } from '../models/AppSettings.js';
import { sendMail, isMailTransportConfigured } from '../services/mail.js';

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
