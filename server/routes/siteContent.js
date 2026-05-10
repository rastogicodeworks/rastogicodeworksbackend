import { Router } from 'express';
import { AppSettings } from '../models/AppSettings.js';

/** Public read-only CMS payload for the marketing site (no auth). */
export const siteContentPublicRouter = Router();

siteContentPublicRouter.get('/', async (_req, res) => {
  try {
    const doc = await AppSettings.findOne().lean();
    const images = (doc?.mediaImages || []).map((m) => ({
      id: m.id,
      url: `/uploads/${m.storedName}`,
      originalName: m.originalName || '',
      uploadedAt: m.uploadedAt,
    }));
    const raw = doc?.siteContent;
    const siteContent =
      raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
    return res.json({
      success: true,
      siteContent,
      mediaImages: images,
    });
  } catch (err) {
    console.error('[site-content get]', err);
    return res.status(500).json({ success: false, message: 'Failed to load site content.' });
  }
});
