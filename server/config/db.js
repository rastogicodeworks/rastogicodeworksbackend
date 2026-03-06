import dns from 'node:dns';
import mongoose from 'mongoose';

// Force Google DNS – bypasses ISP/router DNS servers that refuse SRV record queries,
// which is the cause of "querySrv ECONNREFUSED" on Windows when using mongodb+srv://
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

export async function connectDb() {
  const raw = process.env.MONGODB_URI;
  const uri = typeof raw === 'string' ? raw.trim() : '';
  const isProduction = process.env.NODE_ENV === 'production';

  if (!uri) {
    if (isProduction) {
      throw new Error('[DB] MONGODB_URI is required in production.');
    }
    console.warn('[DB] MONGODB_URI is not set. Backend will start but data will not persist.');
    return;
  }

  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    console.error('[DB] MONGODB_URI must start with mongodb:// or mongodb+srv://.');
    if (isProduction) process.exit(1);
    throw new Error('Invalid MONGODB_URI scheme.');
  }

  const connectOptions = {
    serverSelectionTimeoutMS: 20000,
    connectTimeoutMS: 20000,
    socketTimeoutMS: 30000,
    // Force IPv4 – fixes most local DNS/SRV resolution failures on Windows/Mac
    family: 4,
  };

  try {
    await mongoose.connect(uri, connectOptions);
    console.log('[DB] Connected to MongoDB Atlas');
  } catch (err) {
    console.error('[DB] MongoDB connection error:', err.message);
    console.error('[DB] Checklist:');
    console.error('  1. MongoDB Atlas → Network Access → Add your IP (or 0.0.0.0/0 for local testing)');
    console.error('  2. MongoDB Atlas → Database Access → user has Read/Write on the database');
    console.error('  3. MONGODB_URI in .env uses mongodb+srv:// format with correct user/password');
    if (isProduction) process.exit(1);
    throw err;
  }
}
