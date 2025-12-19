import mongoose from 'mongoose';
import Application from '../models/Application.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function checkApplicationStatuses() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to activ-db\n');

    // Get all applications
    const allApps = await Application.find({});
    console.log(`📊 Total applications: ${allApps.length}\n`);

    // Group by status
    const statusCounts = {};
    allApps.forEach(app => {
      statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
    });

    console.log('📈 Applications by status:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`   ${status}: ${count}`);
    });

    // Show Tamil Nadu applications specifically
    console.log('\n🔍 Tamil Nadu Applications:');
    const tnApps = await Application.find({ 
      state: /tamil nadu/i 
    }).select('applicationId status state district approvals');
    
    console.log(`   Found: ${tnApps.length} applications\n`);
    
    tnApps.forEach(app => {
      console.log(`   ${app.applicationId}:`);
      console.log(`     Status: ${app.status}`);
      console.log(`     Location: ${app.state} > ${app.district}`);
      console.log(`     Block Approval: ${app.approvals?.block?.status || 'pending'}`);
      console.log(`     District Approval: ${app.approvals?.district?.status || 'pending'}`);
      console.log(`     State Approval: ${app.approvals?.state?.status || 'pending'}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkApplicationStatuses();
