import { StateAdmin } from '../models/ExistingAdmins.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const ADMINS_DB_URI = process.env.MONGODB_URI?.replace('/activ-db', '/adminsdb');

async function resetPassword() {
  try {
    await mongoose.connect(ADMINS_DB_URI);
    console.log('✅ Connected to adminsdb\n');

    // Find Tamil Nadu state admin
    const admin = await StateAdmin.findOne({ email: 'state.tamil.nadu@activ.com' });
    
    if (!admin) {
      console.log('❌ Admin not found');
      process.exit(1);
    }

    console.log('Found admin:', admin.fullName);
    console.log('Email:', admin.email);
    console.log('Current password hash:', admin.passwordHash);

    // Set new password
    const newPassword = 'ChangeMe@123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    admin.passwordHash = hashedPassword;
    await admin.save();

    console.log('\n✅ Password updated successfully!');
    console.log('New password:', newPassword);
    console.log('New hash:', hashedPassword);

    // Verify the password works
    const isMatch = await bcrypt.compare(newPassword, admin.passwordHash);
    console.log('\n🔐 Password verification:', isMatch ? '✅ SUCCESS' : '❌ FAILED');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

resetPassword();
