import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { BlockAdmin } from '../models/ExistingAdmins.js';
import { adminDbConnection } from '../config/multiDatabase.js';

async function checkAdmin() {
  try {
    // Connect to admin database
    await adminDbConnection.asPromise();
    console.log('✅ Connected to adminsdb');

    // Find the specific admin
    const admin = await BlockAdmin.findOne({
      email: 'block.thiruvannamalai.tamilnadu@activ.com'
    });

    if (!admin) {
      console.log('❌ Admin not found');
      process.exit(1);
    }

    console.log('\n📋 Admin Details:');
    console.log(`Email: ${admin.email}`);
    console.log(`Name: ${admin.fullName}`);
    console.log(`Active: ${admin.active}`);
    console.log(`Password Hash: ${admin.passwordHash}`);
    console.log(`\n🔑 Testing passwords:`);

    // Test various password variations
    const testPasswords = [
      'ChangeMe@123',
      'changeme@123',
      'CHANGEME@123',
      'ChangeMe123',
      'Changeme@123'
    ];

    for (const pwd of testPasswords) {
      const isMatch = await bcrypt.compare(pwd, admin.passwordHash);
      console.log(`  "${pwd}": ${isMatch ? '✅ MATCH' : '❌ No match'}`);
    }

    // Also test the comparePassword method
    console.log(`\n🔍 Using model method:`);
    const methodMatch = await admin.comparePassword('ChangeMe@123');
    console.log(`  comparePassword('ChangeMe@123'): ${methodMatch ? '✅ MATCH' : '❌ No match'}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

checkAdmin();
