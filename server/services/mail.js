/**
 * Transactional email via Resend (https://resend.com).
 * Env: RESEND_API_KEY, MAIL_FROM (e.g. "Rastogi Codeworks <onboarding@yourdomain.com>")
 */

export function isMailTransportConfigured() {
  return !!(process.env.RESEND_API_KEY?.trim() && process.env.MAIL_FROM?.trim());
}

/** Build Resend "from" using optional display name; keeps address from MAIL_FROM. */
function resolveFromHeader(fromDisplayName) {
  const raw = process.env.MAIL_FROM?.trim() || '';
  if (!raw) return '';
  const nameTrim = fromDisplayName?.trim();
  if (!nameTrim) return raw;
  const m = raw.match(/^(.+?)\s*<([^>]+)>\s*$/);
  const addr = m ? m[2].trim() : raw.includes('@') ? raw : '';
  if (!addr) return raw;
  return `${nameTrim} <${addr}>`;
}

/**
 * @param {{ to: string | string[], subject: string, html: string, replyTo?: string, bcc?: string | string[], fromDisplayName?: string }} opts
 * @returns {Promise<{ ok: boolean, skipped?: boolean, id?: string, error?: string }>}
 */
export async function sendMail({ to, subject, html, replyTo, bcc, fromDisplayName }) {
  if (!isMailTransportConfigured()) {
    console.warn('[mail] skipped: set RESEND_API_KEY and MAIL_FROM in .env');
    return { ok: false, skipped: true, error: 'Mail not configured' };
  }

  const recipients = Array.isArray(to) ? to : [to];
  const from = resolveFromHeader(fromDisplayName) || process.env.MAIL_FROM.trim();
  const body = {
    from,
    to: recipients,
    subject,
    html,
  };
  if (replyTo?.trim()) body.reply_to = replyTo.trim();
  if (bcc) {
    body.bcc = Array.isArray(bcc) ? bcc : [bcc];
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error('[mail] Resend error', res.status, data);
      return {
        ok: false,
        error: data.message || data.error?.message || `HTTP ${res.status}`,
      };
    }
    return { ok: true, id: data.id };
  } catch (e) {
    console.error('[mail] fetch error', e);
    return { ok: false, error: e.message || 'Network error' };
  }
}
