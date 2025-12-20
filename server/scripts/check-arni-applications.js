import mongoose from 'mongoose';
import { BlockAdmin } from '../models/ExistingAdmins.js';
import Application from '../models/Application.js';
import dotenv from 'dotenv';

dotenv.config();

const checkArniApplications = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get Arni Block Admin details
    const admin = await BlockAdmin.findOne({ 
      email: 'block.arni.thiruvannamalai.tamil.nadu@activ.com' 
    });
    
    console.log('\n📋 Arni Block Admin Details:');
    if (admin) {
      console.log('Email:', admin.email);
      console.log('Meta:', JSON.stringify(admin.meta, null, 2));
    } else {
      console.log('❌ Admin not found');
    }

    // Check all applications with "arni" in location
    const arniApps = await Application.find({
      $or: [
        { 'location.block': /arni/i },
        { 'location.blockLc': /arni/i }
      ]
    }).select('applicationId userId location.state location.district location.block status');

    console.log('\n📋 Applications with "Arni" in location:', arniApps.length);
    arniApps.forEach(app => {
      console.log(`\n  App ID: ${app.applicationId}`);
      console.log(`  User ID: ${app.userId}`);
      console.log(`  Status: ${app.status}`);
      console.log(`  State: "${app.location?.state}"`);
      console.log(`  District: "${app.location?.district}"`);
      console.log(`  Block: "${app.location?.block}"`);
    });

    // Check applications in Thiruvannamalai district
    const thiruApps = await Application.find({
      $or: [
        { 'location.district': /thiruvannamalai/i },
        { 'location.districtLc': /thiruvannamalai/i }
      ]
    }).select('applicationId location.state location.district location.block status');

    console.log('\n📋 Applications in Thiruvannamalai:', thiruApps.length);
    thiruApps.forEach(app => {
      console.log(`  - ${app.applicationId}: ${app.location?.block}, Status: ${app.status}`);
    });

    // Check what exact query would be used for block admin
    if (admin) {
      const exactMatch = await Application.find({
        'location.state': admin.meta.state,
        'location.district': admin.meta.district,
        'location.block': admin.meta.block
      }).select('applicationId location status');

      console.log('\n🔍 Exact match query results:', exactMatch.length);
      exactMatch.forEach(app => {
        console.log(`  - ${app.applicationId}: Status: ${app.status}`);
      });

      // Try with lowercase
      const lcMatch = await Application.find({
        'location.stateLc': admin.meta.stateLc,
        'location.districtLc': admin.meta.districtLc,
        'location.blockLc': admin.meta.blockLc
      }).select('applicationId location status');

      console.log('\n🔍 Lowercase match query results:', lcMatch.length);
      lcMatch.forEach(app => {
        console.log(`  - ${app.applicationId}: Status: ${app.status}`);
      });
    }

    // Check recent applications (last 10)
    const recentApps = await Application.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('applicationId userId location.state location.district location.block status createdAt');

    console.log('\n📋 Recent Applications (last 10):');
    recentApps.forEach(app => {
      console.log(`\n  ${app.applicationId}`);
      console.log(`  Created: ${app.createdAt}`);
      console.log(`  Location: ${app.location?.state} > ${app.location?.district} > ${app.location?.block}`);
      console.log(`  Status: ${app.status}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkArniApplications();
