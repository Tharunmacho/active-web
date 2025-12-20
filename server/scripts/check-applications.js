import mongoose from 'mongoose';
import Application from '../models/Application.js';
import { mainDbConnection } from '../config/multiDatabase.js';

async function checkSaisreeApplication() {
  try {
    await mainDbConnection.asPromise();
    console.log('✅ Connected to activ-db');

    // Find all applications
    const allApps = await Application.find({});
    console.log(`\n📊 Total applications in database: ${allApps.length}`);
    
    if (allApps.length > 0) {
      console.log('\n📋 All Applications:');
      allApps.forEach((app, idx) => {
        console.log(`\n${idx + 1}. Application:`);
        console.log(`   ID: ${app.applicationId}`);
        console.log(`   User Name: ${app.userName}`);
        console.log(`   State: "${app.state}"`);
        console.log(`   District: "${app.district}"`);
        console.log(`   Block: "${app.block}"`);
        console.log(`   Status: ${app.status}`);
        console.log(`   Submitted: ${app.submittedAt}`);
      });
    }

    // Search specifically for Thandrampet
    console.log('\n\n🔍 Searching for Thandrampet applications...');
    const thandrampetApps = await Application.find({
      block: { $regex: /thandrampet/i }
    });
    
    console.log(`\n📋 Thandrampet applications: ${thandrampetApps.length}`);

    // Check what the admin query would be
    console.log('\n\n🔍 Expected query for Block Admin:');
    console.log({
      state: 'Tamil Nadu',
      district: 'Thiruvannamalai', 
      block: 'Thandrampet',
      status: 'pending_block_approval'
    });

    const matchingApps = await Application.find({
      state: 'Tamil Nadu',
      district: 'Thiruvannamalai',
      block: 'Thandrampet',
      status: 'pending_block_approval'
    });

    console.log(`\n✅ Applications matching block admin query: ${matchingApps.length}`);
    if (matchingApps.length > 0) {
      matchingApps.forEach((app, idx) => {
        console.log(`\n${idx + 1}. ${app.userName} - ${app.applicationId}`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

checkSaisreeApplication();
