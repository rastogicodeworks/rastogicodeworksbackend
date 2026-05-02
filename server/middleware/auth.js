import jwt from 'jsonwebtoken';

const TOKEN_COOKIE_NAME = 'rc_token';
const TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function issueToken(res, payload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');

  const token = jwt.sign(
    { sub: payload.sub, email: payload.email, role: payload.role },
    secret,
    { expiresIn: '7d' },
  );

  const isProduction = process.env.NODE_ENV === 'production';
  // Cross-origin (e.g. Vercel client + Render API) requires sameSite: 'none' and secure
  res.cookie(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: TOKEN_MAX_AGE_MS,
  });
  return token;
}

export function clearToken(res) {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie(TOKEN_COOKIE_NAME, {
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction,
  });
}

export function requireAuth(req, res, next) {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ success: false, message: 'Auth not configured.' });
    }

    const token =
      req.cookies?.[TOKEN_COOKIE_NAME] ||
      (req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : null);

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated.' });
    }

    const decoded = jwt.verify(token, secret);
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user) return requireAuth(req, res, () => requireAdmin(req, res, next));
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required.' });
  }
  req.admin = req.user;
  next();
}

export function requireClient(req, res, next) {
  if (!req.user) return requireAuth(req, res, () => requireClient(req, res, next));
  if (req.user.role !== 'client') {
    return res.status(403).json({ success: false, message: 'Client access required.' });
  }
  next();
}

export function requireEmployee(req, res, next) {
  if (!req.user) return requireAuth(req, res, () => requireEmployee(req, res, next));
  if (req.user.role !== 'employee') {
    return res.status(403).json({ success: false, message: 'Employee access required.' });
  }
  next();
}

// Legacy helpers for existing admin-only cookie name (optional; can remove once frontend uses new token)
export function issueAdminToken(res, payload) {
  issueToken(res, { ...payload, role: 'admin' });
}
export function clearAdminToken(res) {
  clearToken(res);
}
