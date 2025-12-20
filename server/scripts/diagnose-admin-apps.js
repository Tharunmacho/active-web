import mongoose from 'mongoose';
import { adminDbConnection, mainDbConnection } from '../config/multiDatabase.js';
import { BlockAdmin } from '../models/ExistingAdmins.js';
import Application from '../models/Application.js';

async function diagnoseAdminAndApplications() {
  try {
    console.log('🔍 Starting Diagnosis...\n');

    // Find the Thandrampet Block Admin
    const admin = await BlockAdmin.findOne({ 
      email: 'block.thandrampet.thiruvannamalai.tamil.nadu@activ.com' 
    });

    if (!admin) {
      console.log('❌ Thandrampet Block Admin not found!');
      return;
    }

    console.log('👤 ADMIN DATA:');
    console.log('   Email:', admin.email);
    console.log('   Full Name:', admin.fullName);
    console.log('   Role:', 'block_admin');
    console.log('   Meta Object:', admin.meta);
    console.log('   State:', admin.meta?.state);
    console.log('   District:', admin.meta?.district);
    console.log('   Block:', admin.meta?.block);
    console.log('');

    // Find all applications
    const allApplications = await Application.find({});
    console.log(`📋 TOTAL APPLICATIONS IN DATABASE: ${allApplications.length}\n`);

    if (allApplications.length > 0) {
      console.log('📊 APPLICATION DETAILS:');
      allApplications.forEach((app, index) => {
        console.log(`\n   Application ${index + 1}:`);
        console.log('   ├─ Application ID:', app.applicationId);
        console.log('   ├─ Member Name:', app.memberName);
        console.log('   ├─ State:', `"${app.state}"`);
        console.log('   ├─ District:', `"${app.district}"`);
        console.log('   ├─ Block:', `"${app.block}"`);
        console.log('   ├─ Status:', app.status);
        console.log('   └─ Submitted:', app.submittedAt);
      });
    }

    console.log('\n\n🔍 MATCH ANALYSIS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const adminState = admin.meta?.state;
    const adminDistrict = admin.meta?.district;
    const adminBlock = admin.meta?.block;

    console.log('Admin has location data:', {
      state: adminState ? '✅' : '❌',
      district: adminDistrict ? '✅' : '❌',
      block: adminBlock ? '✅' : '❌'
    });

    if (allApplications.length > 0) {
      const app = allApplications[0];
      
      console.log('\nComparison:');
      console.log('┌─────────────┬──────────────────────────┬──────────────────────────┬─────────┐');
      console.log('│ Field       │ Admin                    │ Application              │ Match   │');
      console.log('├─────────────┼──────────────────────────┼──────────────────────────┼─────────┤');
      console.log(`│ State       │ "${adminState || 'NULL'}"${' '.repeat(25 - (adminState?.length || 4))}│ "${app.state}"${' '.repeat(25 - app.state.length)}│ ${adminState === app.state ? '✅' : '❌'}      │`);
      console.log(`│ District    │ "${adminDistrict || 'NULL'}"${' '.repeat(25 - (adminDistrict?.length || 4))}│ "${app.district}"${' '.repeat(25 - app.district.length)}│ ${adminDistrict === app.district ? '✅' : '❌'}      │`);
      console.log(`│ Block       │ "${adminBlock || 'NULL'}"${' '.repeat(25 - (adminBlock?.length || 4))}│ "${app.block}"${' '.repeat(25 - app.block.length)}│ ${adminBlock === app.block ? '✅' : '❌'}      │`);
      console.log(`│ Status      │ pending_block_approval   │ "${app.status}"${' '.repeat(25 - app.status.length)}│ ${app.status === 'pending_block_approval' ? '✅' : '❌'}      │`);
      console.log('└─────────────┴──────────────────────────┴──────────────────────────┴─────────┘');

      const allMatch = adminState === app.state && 
                      adminDistrict === app.district && 
                      adminBlock === app.block && 
                      app.status === 'pending_block_approval';

      console.log('\n' + (allMatch ? '✅ ALL FIELDS MATCH!' : '❌ MISMATCH DETECTED!'));

      if (!allMatch) {
        console.log('\n🔧 SOLUTION:');
        if (!adminState || !adminDistrict || !adminBlock) {
          console.log('   Admin is missing location metadata. Run: npm run fix-admin-metadata');
        } else if (adminState !== app.state || adminDistrict !== app.district || adminBlock !== app.block) {
          console.log('   Location values don\'t match (check for typos, case sensitivity, extra spaces)');
          console.log('   Fix options:');
          console.log('   1. Update admin metadata to match application');
          console.log('   2. Update application location to match admin');
        } else if (app.status !== 'pending_block_approval') {
          console.log('   Application status is not "pending_block_approval"');
          console.log('   Current status:', app.status);
        }
      }
    }

    console.log('\n✅ Diagnosis complete!');

  } catch (error) {
    console.error('❌ Error during diagnosis:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

// Run the diagnosis
diagnoseAdminAndApplications();
