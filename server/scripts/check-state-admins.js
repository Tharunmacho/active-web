import { StateAdmin } from '../models/ExistingAdmins.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const ADMINS_DB_URI = process.env.MONGODB_URI?.replace('/activ-db', '/adminsdb');

async function checkStateAdmins() {
  try {
    await mongoose.connect(ADMINS_DB_URI);
    console.log('✅ Connected to adminsdb\n');

    // Check for SA001
    const sa001 = await StateAdmin.findOne({ email: 'stateadmin@activ.com' });
    console.log('SA001 (stateadmin@activ.com):', sa001 ? 'EXISTS' : 'NOT FOUND');
    
    // List all state admins
    const allStateAdmins = await StateAdmin.find({}).select('adminId email fullName meta.state active');
    console.log(`\nTotal State Admins: ${allStateAdmins.length}\n`);
    
    console.log('All State Admins:');
    allStateAdmins.forEach((admin, idx) => {
      console.log(`${idx + 1}. ${admin.adminId} - ${admin.email}`);
      console.log(`   Name: ${admin.fullName}`);
      console.log(`   State: ${admin.meta?.state || 'N/A'}`);
      console.log(`   Active: ${admin.active}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkStateAdmins();
