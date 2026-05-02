/**
 * Create an employee user. Run from server folder:
 *   node scripts/createEmployee.js <email> <password> [name]
 */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/User.js';

dotenv.config();

const SALT_ROUNDS = 12;

async function main() {
  const [, , email, password, name] = process.argv;

  if (!email || !password) {
    console.error('Usage: node scripts/createEmployee.js <email> <password> [name]');
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Set MONGODB_URI in .env');
    process.exit(1);
  }

  await mongoose.connect(uri);
  const trimmedEmail = email.trim().toLowerCase();

  const existing = await User.findOne({ email: trimmedEmail }).lean();
  if (existing) {
    console.log('User already exists:', trimmedEmail, '(role:', existing.role + ')');
    await mongoose.disconnect();
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  await User.create({
    email: trimmedEmail,
    passwordHash,
    role: 'employee',
    name: name ? name.trim() : undefined,
  });

  console.log('Employee created:', trimmedEmail);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
