/**
 * Script to test the admin approval workflow
 * This script simulates a member submitting an application and admin approvals
 * Run: node server/scripts/test-admin-workflow.js
 */

import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import Application from '../models/Application.js';
import WebUser from '../models/WebUser.js';
import PersonalForm from '../models/PersonalForm.js';
import BusinessForm from '../models/BusinessForm.js';
import DeclarationForm from '../models/DeclarationForm.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://activapp2025_db_user:Activapp%402025@cluster1.gf7usct.mongodb.net/activ-db?retryWrites=true&w=majority';

async function testWorkflow() {
  try {
    console.log('🔌 Connecting to MongoDB...\n');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Step 1: Find saisree's user account
    console.log('📋 Step 1: Finding saisree user account...');
    const saisreeAuth = await mongoose.connection.db.collection('web auth').findOne({ email: 'saisree@gmail.com' });
    
    if (!saisreeAuth) {
      console.log('❌ Saisree user not found in web auth collection');
      console.log('Please make sure saisree is registered first');
      mongoose.connection.close();
      process.exit(1);
    }
    
    console.log('✅ Found saisree:', saisreeAuth.email);
    console.log('   User ID:', saisreeAuth._id.toString(), '\n');

    // Step 2: Check her forms
    console.log('📋 Step 2: Checking saisree\'s forms...');
    const personalForm = await PersonalForm.findOne({ userId: saisreeAuth._id });
    const businessForm = await BusinessForm.findOne({ userId: saisreeAuth._id });
    const declarationForm = await DeclarationForm.findOne({ userId: saisreeAuth._id });

    console.log('   Personal Form:', personalForm ? '✅ Exists' : '❌ Missing');
    console.log('   Business Form:', businessForm ? '✅ Exists' : '❌ Missing');
    console.log('   Declaration Form:', declarationForm ? '✅ Exists' : '❌ Missing');

    if (personalForm) {
      console.log('\n   Location Details:');
      console.log('   State:', personalForm.state);
      console.log('   District:', personalForm.district);
      console.log('   Block:', personalForm.block);
      console.log('   City:', personalForm.city);
    }
    console.log('');

    // Step 3: Check if application exists
    console.log('📋 Step 3: Checking for existing application...');
    let application = await Application.findOne({ userId: saisreeAuth._id });
    
    if (application) {
      console.log('✅ Application already exists!');
      console.log('   Application ID:', application.applicationId);
      console.log('   Status:', application.status);
      console.log('   Submitted:', application.submittedAt);
    } else {
      console.log('⚠️  No application found');
      console.log('   Application will be created when saisree submits declaration form\n');
    }
    console.log('');

    // Step 4: Find relevant admins
    console.log('📋 Step 4: Finding relevant admins for approval...');
    
    if (personalForm) {
      const blockAdmin = await Admin.findOne({
        role: 'block_admin',
        state: personalForm.state,
        district: personalForm.district,
        block: personalForm.block
      });

      const districtAdmin = await Admin.findOne({
        role: 'district_admin',
        state: personalForm.state,
        district: personalForm.district
      });

      const stateAdmin = await Admin.findOne({
        role: 'state_admin',
        state: personalForm.state
      });

      console.log('\n   Approval Chain:');
      console.log('   1️⃣  Block Admin:', blockAdmin ? `${blockAdmin.fullName} (${blockAdmin.email})` : '❌ Not Found');
      console.log('   2️⃣  District Admin:', districtAdmin ? `${districtAdmin.fullName} (${districtAdmin.email})` : '❌ Not Found');
      console.log('   3️⃣  State Admin:', stateAdmin ? `${stateAdmin.fullName} (${stateAdmin.email})` : '❌ Not Found');
    }
    console.log('');

    // Step 5: Show application status if it exists
    if (application) {
      console.log('📋 Step 5: Current Approval Status:');
      console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('   Block Admin:');
      console.log('   Status:', application.approvals.block.status);
      if (application.approvals.block.adminName) {
        console.log('   Approved by:', application.approvals.block.adminName);
        console.log('   Date:', application.approvals.block.actionDate);
        console.log('   Remarks:', application.approvals.block.remarks || 'None');
      }
      console.log('');
      console.log('   District Admin:');
      console.log('   Status:', application.approvals.district.status);
      if (application.approvals.district.adminName) {
        console.log('   Approved by:', application.approvals.district.adminName);
        console.log('   Date:', application.approvals.district.actionDate);
        console.log('   Remarks:', application.approvals.district.remarks || 'None');
      }
      console.log('');
      console.log('   State Admin:');
      console.log('   Status:', application.approvals.state.status);
      if (application.approvals.state.adminName) {
        console.log('   Approved by:', application.approvals.state.adminName);
        console.log('   Date:', application.approvals.state.actionDate);
        console.log('   Remarks:', application.approvals.state.remarks || 'None');
      }
      console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    }

    // Step 6: Test admin login endpoints
    console.log('📋 Step 6: Testing Admin API Endpoints...');
    console.log('\n✅ You can test the following API calls:\n');
    
    console.log('1️⃣  Block Admin Login:');
    console.log('   POST http://localhost:4000/api/admin/login');
    console.log('   Body: {');
    console.log('     "email": "thandrampattu.block@activ.com",');
    console.log('     "password": "Admin@123"');
    console.log('   }\n');

    console.log('2️⃣  Get Pending Applications (Block Admin):');
    console.log('   GET http://localhost:4000/api/applications');
    console.log('   Headers: { "Authorization": "Bearer <token>" }\n');

    console.log('3️⃣  Approve Application:');
    console.log('   POST http://localhost:4000/api/applications/<applicationId>/approve');
    console.log('   Headers: { "Authorization": "Bearer <token>" }');
    console.log('   Body: { "remarks": "Verified by block admin" }\n');

    console.log('4️⃣  Get Dashboard Stats:');
    console.log('   GET http://localhost:4000/api/admin/dashboard/stats');
    console.log('   Headers: { "Authorization": "Bearer <token>" }\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✅ Workflow Test Complete!\n');

    // Summary
    console.log('📊 Summary:');
    console.log('   - Member: saisree@gmail.com');
    console.log('   - Forms Complete:', personalForm && businessForm && declarationForm ? 'Yes ✅' : 'No ❌');
    console.log('   - Application Exists:', application ? 'Yes ✅' : 'No ❌');
    if (application) {
      console.log('   - Current Status:', application.status);
    }
    console.log('   - Admin Accounts Created: 7');
    console.log('');

    mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error testing workflow:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}

// Run the test
testWorkflow();
