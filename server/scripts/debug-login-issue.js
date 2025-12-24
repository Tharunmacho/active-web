
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { BlockAdmin } from '../src/shared/models/ExistingAdmins.js';
import { adminDbConnection } from '../config/multiDatabase.js';

async function checkAdmin() {
  try {
    // Connect to admin database
    await adminDbConnection.asPromise();
    console.log('✅ Connected to adminsdb');

    const emailToCheck = 'block.madurantakam.chengalpattu.tamil.nadu@activ.com';

    // Find the specific admin
    console.log(`\n🔍 Searching for admin with email: ${emailToCheck}`);
    
    // Case insensitive search
    const admin = await BlockAdmin.findOne({
      email: { $regex: new RegExp(`^${emailToCheck}$`, 'i') }
    });

    if (!admin) {
      console.log('❌ Admin not found in BlockAdmin collection');
      
      // List a few admins to see what the data looks like
      const allAdmins = await BlockAdmin.find({}).limit(5);
      console.log('\n📋 First 5 admins in DB:');
      allAdmins.forEach(a => console.log(`- ${a.email} (${a.fullName})`));
      
      process.exit(1);
    }

    console.log('\n📋 Admin Found Details:');
    console.log(`Email: ${admin.email}`);
    console.log(`Name: ${admin.fullName}`);
    console.log(`Active: ${admin.active}`);
    console.log(`Role: ${admin.role}`);
    console.log(`Meta:`, admin.meta);

    console.log(`\n🔑 Testing password 'ChangeMe@123':`);
    const isMatch = await admin.comparePassword('ChangeMe@123');
    console.log(`  Result: ${isMatch ? '✅ MATCH' : '❌ NO MATCH'}`);
    
    // If not matching, maybe check hash
    if (!isMatch) {
       console.log('Stored hash:', admin.passwordHash);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

checkAdmin();
