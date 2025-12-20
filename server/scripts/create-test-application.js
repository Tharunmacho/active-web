import mongoose from 'mongoose';
import Application from '../models/Application.js';
import { mainDbConnection } from '../config/multiDatabase.js';

async function createTestApplication() {
  try {
    // Connect to main database
    await mainDbConnection.asPromise();
    console.log('✅ Connected to activ-db');

    // Check if test application already exists
    const existingApp = await Application.findOne({
      userName: 'Test Thandrampet Member',
      state: 'Tamil Nadu',
      district: 'Thiruvannamalai',
      block: 'Thandrampet'
    });

    if (existingApp) {
      console.log('⚠️  Test application already exists');
      console.log('\n📋 Existing Application:');
      console.log(`   ID: ${existingApp.applicationId}`);
      console.log(`   Name: ${existingApp.userName}`);
      console.log(`   Location: ${existingApp.block}, ${existingApp.district}, ${existingApp.state}`);
      console.log(`   Status: ${existingApp.status}`);
      process.exit(0);
    }

    // Create test application
    const applicationId = `ACTIV-${Date.now()}`;
    const newApplication = new Application({
      applicationId: applicationId,
      userId: new mongoose.Types.ObjectId(), // Dummy user ID
      userName: 'Test Thandrampet Member',
      memberType: 'Individual',
      state: 'Tamil Nadu',
      district: 'Thiruvannamalai',
      block: 'Thandrampet',
      status: 'pending_block_approval',
      submittedAt: new Date(),
      approvalHistory: [
        {
          level: 'submitted',
          action: 'submitted',
          timestamp: new Date(),
          remarks: 'Application submitted successfully'
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newApplication.save();
    console.log('\n✅ Test application created successfully!');
    console.log('\n📋 Application Details:');
    console.log(`   Application ID: ${applicationId}`);
    console.log(`   Name: Test Thandrampet Member`);
    console.log(`   Location: Thandrampet, Thiruvannamalai, Tamil Nadu`);
    console.log(`   Status: pending_block_approval`);
    console.log(`   Member Type: Individual`);
    console.log('\n✅ This application will now appear in the Thandrampet Block Admin Dashboard!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

createTestApplication();
