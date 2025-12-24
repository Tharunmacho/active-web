import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { BlockAdmin, DistrictAdmin, StateAdmin, SuperAdmin } from './src/shared/models/ExistingAdmins.js';
import Application from './src/shared/models/Application.js';

dotenv.config();

const checkMeeraAdmin = async () => {
  try {
    // Connect to adminsdb
    const adminConn = await mongoose.createConnection(process.env.MONGO_URI_ADMINS, {
      serverSelectionTimeoutMS: 5000,
      family: 4
    });

    console.log('✅ Connected to adminsdb');

    // Check all admin collections for meera@gmail.com
    const BlockAdminModel = adminConn.model('BlockAdmin', BlockAdmin.schema);
    const DistrictAdminModel = adminConn.model('DistrictAdmin', DistrictAdmin.schema);
    const StateAdminModel = adminConn.model('StateAdmin', StateAdmin.schema);
    const SuperAdminModel = adminConn.model('SuperAdmin', SuperAdmin.schema);

    let admin = await BlockAdminModel.findOne({ email: 'meera@gmail.com' });
    let role = 'block_admin';
    
    if (!admin) {
      admin = await DistrictAdminModel.findOne({ email: 'meera@gmail.com' });
      role = 'district_admin';
    }
    
    if (!admin) {
      admin = await StateAdminModel.findOne({ email: 'meera@gmail.com' });
      role = 'state_admin';
    }
    
    if (!admin) {
      admin = await SuperAdminModel.findOne({ email: 'meera@gmail.com' });
      role = 'super_admin';
    }

    if (admin) {
      console.log('\n📧 Admin found:');
      console.log('Email:', admin.email);
      console.log('Role:', role);
      console.log('Name:', admin.name);
      console.log('State:', admin.meta?.state);
      console.log('District:', admin.meta?.district);
      console.log('Block:', admin.meta?.block);
      console.log('Active:', admin.active);
    } else {
      console.log('\n❌ No admin found with email: meera@gmail.com');
    }

    // Now connect to activ-db and check applications
    const mainConn = await mongoose.createConnection(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      family: 4
    });

    console.log('\n✅ Connected to activ-db');

    const ApplicationModel = mainConn.model('Application', Application.schema);
    const allApps = await ApplicationModel.find({});
    
    console.log(`\n📊 Total applications in database: ${allApps.length}`);
    
    if (allApps.length > 0) {
      console.log('\n📋 All applications:');
      allApps.forEach(app => {
        console.log(`- ID: ${app.applicationId}`);
        console.log(`  Member: ${app.memberName} (${app.memberEmail})`);
        console.log(`  Location: ${app.block}, ${app.district}, ${app.state}`);
        console.log(`  Status: ${app.status}`);
        console.log(`  Block Approval: ${app.approvals?.block?.status || 'none'}`);
        console.log(`  District Approval: ${app.approvals?.district?.status || 'none'}`);
        console.log(`  State Approval: ${app.approvals?.state?.status || 'none'}`);
        console.log('');
      });

      if (admin && role === 'district_admin') {
        console.log('\n🔍 Filtering for district admin:');
        const filtered = allApps.filter(app => {
          const stateMatch = app.state?.toLowerCase() === admin.meta?.state?.toLowerCase();
          const districtMatch = app.district?.toLowerCase() === admin.meta?.district?.toLowerCase();
          console.log(`  App ${app.applicationId}: state=${app.state} (${stateMatch}), district=${app.district} (${districtMatch})`);
          return stateMatch && districtMatch;
        });
        console.log(`\n✅ Matching applications for district admin: ${filtered.length}`);
      }
    }

    await adminConn.close();
    await mainConn.close();
    process.exit(0);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkMeeraAdmin();
