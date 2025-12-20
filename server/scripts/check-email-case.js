import mongoose from 'mongoose';
import { BlockAdmin } from '../models/ExistingAdmins.js';
import dotenv from 'dotenv';

dotenv.config();

const checkEmailCase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_ADMIN_URI || process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const email = 'block.arni.thiruvannamalai.tamil.nadu@activ.com';
    
    // Test 1: Exact match
    const test1 = await BlockAdmin.findOne({ email: email });
    console.log('\n1️⃣ Exact match:', test1 ? '✅ Found' : '❌ Not found');
    if (test1) console.log('   Stored email:', test1.email);

    // Test 2: Lowercase
    const test2 = await BlockAdmin.findOne({ email: email.toLowerCase() });
    console.log('\n2️⃣ Lowercase match:', test2 ? '✅ Found' : '❌ Not found');
    if (test2) console.log('   Stored email:', test2.email);

    // Test 3: With active flag
    const test3 = await BlockAdmin.findOne({ email: email.toLowerCase(), active: true });
    console.log('\n3️⃣ Lowercase + active=true:', test3 ? '✅ Found' : '❌ Not found');
    if (test3) {
      console.log('   Stored email:', test3.email);
      console.log('   Active:', test3.active);
      console.log('   Has passwordHash:', !!test3.passwordHash);
      console.log('   Password length:', test3.passwordHash?.length);
    }

    // Test 4: Check all Arni admins
    const arniAdmins = await BlockAdmin.find({ 
      $or: [
        { 'meta.block': 'Arni' },
        { 'meta.blockLc': 'arni' },
        { email: /arni/i }
      ]
    });
    console.log('\n4️⃣ All admins with "arni":', arniAdmins.length);
    arniAdmins.forEach(admin => {
      console.log(`   - Email: ${admin.email}, Active: ${admin.active}, Block: ${admin.meta?.block}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkEmailCase();
