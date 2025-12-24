import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Application from './src/shared/models/Application.js';
import WebUserProfile from './src/shared/models/WebUserProfile.js';

dotenv.config();

const createTestApplication = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      family: 4
    });

    console.log('✅ Connected to activ-db');

    // Find or create a test user for Madurantakam
    let testUser = await WebUserProfile.findOne({ email: 'test.madurantakam@example.com' });
    
    if (!testUser) {
      testUser = await WebUserProfile.create({
        userId: new mongoose.Types.ObjectId(),
        name: 'Test User Madurantakam',
        email: 'test.madurantakam@example.com',
        phone: '9876543210',
        state: 'Tamil Nadu',
        district: 'Chengalpattu',
        block: 'Madurantakam',
        city: 'Madurantakam Town',
        memberType: 'business',
        isActive: true
      });
      console.log('✅ Created test user:', testUser.email);
    } else {
      console.log('✅ Found existing test user:', testUser.email);
    }

    // Check if application already exists
    const existingApp = await Application.findOne({ 
      memberEmail: testUser.email 
    });

    if (existingApp) {
      console.log('⚠️ Application already exists for this user:', existingApp.applicationId);
      await mongoose.connection.close();
      process.exit(0);
    }

    // Create application
    const application = await Application.create({
      userId: testUser.userId,
      applicationId: `APP-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      memberName: testUser.name,
      memberEmail: testUser.email,
      memberPhone: testUser.phone,
      state: 'Tamil Nadu',
      district: 'Chengalpattu',
      block: 'Madurantakam',
      city: 'Madurantakam Town',
      memberType: 'business',
      status: 'pending_block_approval',
      approvals: {
        block: {
          status: 'pending',
          adminId: null,
          adminName: null,
          comments: null,
          timestamp: null
        },
        district: {
          status: 'pending',
          adminId: null,
          adminName: null,
          comments: null,
          timestamp: null
        },
        state: {
          status: 'pending',
          adminId: null,
          adminName: null,
          comments: null,
          timestamp: null
        }
      },
      submittedAt: new Date()
    });

    console.log('\n✅ Created test application:');
    console.log('Application ID:', application.applicationId);
    console.log('Member:', application.memberName);
    console.log('Email:', application.memberEmail);
    console.log('Location:', application.block, ',', application.district, ',', application.state);
    console.log('Status:', application.status);
    console.log('\n📧 This application should now appear in the dashboard for:');
    console.log('   block.madurantakam.chengalpattu.tamil.nadu@activ.com');

    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createTestApplication();
