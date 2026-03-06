import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { connectDb } from './config/db.js';
import { bootstrapAdmin } from './scripts/bootstrapAdmin.js';
import { authRouter } from './routes/auth.js';
import { invoicesRouter } from './routes/invoices.js';
import { dashboardRouter } from './routes/dashboard.js';
import { clientsRouter } from './routes/clients.js';
import { projectsRouter } from './routes/projects.js';
import { announcementsRouter } from './routes/announcements.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const HOST = '0.0.0.0';

// Build allowed CORS origins: trim, strip quotes, no trailing slash; add www/non-www pair
function buildAllowedOrigins() {
  const raw = (process.env.CLIENT_URL || 'http://localhost:5173').trim();
  const list = raw
    .split(',')
    .map((o) => o.trim().replace(/^["']|["']$/g, '').replace(/\/+$/, ''))
    .filter(Boolean);
  const set = new Set(list);
  // For each http(s) origin, allow both www and non-www so one env value covers both (skip localhost)
  list.forEach((url) => {
    try {
      if (!url.startsWith('http')) return;
      const u = new URL(url);
      const host = u.hostname.toLowerCase();
      if (host === 'localhost' || host === '127.0.0.1') return;
      if (u.hostname.startsWith('www.')) {
        set.add(`${u.protocol}//${u.hostname.slice(4)}${u.port ? ':' + u.port : ''}`);
      } else {
        set.add(`${u.protocol}//www.${u.hostname}${u.port ? ':' + u.port : ''}`);
      }
    } catch (_) {}
  });
  return [...set];
}

const allowedOrigins = buildAllowedOrigins();
if (process.env.NODE_ENV === 'production') {
  console.log('[CORS] Allowed origins:', allowedOrigins.join(', ') || '(none)');
}

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      const normalized = origin.replace(/\/+$/, '');
      if (allowedOrigins.includes(normalized)) return cb(null, true);
      cb(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
  }),
);

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { success: false, message: 'Too many attempts. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.get('/api/health', (_, res) => {
  res.json({
    status: 'ok',
    message: 'Rastogi Codeworks API',
    // Helps debug login: confirms server has admin env (does not expose secrets)
    adminConfigured: !!(process.env.ADMIN_EMAIL?.trim() && process.env.ADMIN_PASSWORD?.trim()),
  });
});

app.use('/api/auth', authLimiter, authRouter);
app.use('/api/invoices', invoicesRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/announcements', announcementsRouter);

app.use((err, req, res, next) => {
  console.error('[global-error]', err);
  res.status(500).json({ success: false, message: 'Unexpected server error.' });
});

connectDb()
  .then(() => bootstrapAdmin())
  .catch((err) => console.error('[startup]', err))
  .finally(() => {
    app.listen(PORT, HOST, () => {
      const env = process.env.NODE_ENV || 'development';
      console.log(`Server running at http://${HOST}:${PORT} [${env}]`);
    });
  });

