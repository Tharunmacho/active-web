import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { BlockAdmin } from '../models/ExistingAdmins.js';
import { adminDbConnection } from '../config/multiDatabase.js';

async function updatePassword() {
  try {
    // Connect to admin database
    await adminDbConnection.asPromise();
    console.log('✅ Connected to adminsdb');

    // Find the admin
    const admin = await BlockAdmin.findOne({
      email: 'block.thiruvannamalai.tamilnadu@activ.com'
    });

    if (!admin) {
      console.log('❌ Admin not found');
      process.exit(1);
    }

    console.log(`\n📋 Found admin: ${admin.email}`);
    console.log(`Current password hash: ${admin.passwordHash.substring(0, 20)}...`);

    // Hash the new password
    const newPassword = 'ChangeMe@123';
    const salt = await bcrypt.genSalt(12);
    const newHash = await bcrypt.hash(newPassword, salt);

    console.log(`\n🔑 New password hash: ${newHash.substring(0, 20)}...`);

    // Verify the new hash works
    const testMatch = await bcrypt.compare(newPassword, newHash);
    console.log(`✅ Verification test: ${testMatch ? 'PASS' : 'FAIL'}`);

    // Update the admin
    admin.passwordHash = newHash;
    await admin.save();

    console.log(`\n✅ Password updated successfully!`);
    console.log(`\nYou can now login with:`);
    console.log(`  Email: ${admin.email}`);
    console.log(`  Password: ${newPassword}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

updatePassword();
