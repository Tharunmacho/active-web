import mongoose from 'mongoose';
import Application from '../src/shared/models/Application.js';
import dotenv from 'dotenv';

dotenv.config();

const checkApplication = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI_MEMBERS || 'mongodb://localhost:27017/active-web-db');
    console.log('✅ Connected to MongoDB');

    // Find all applications
    const applications = await Application.find({}).select('memberName memberEmail memberPhone state district block city applicationId').lean();
    
    console.log('\n📋 All Applications:');
    console.log('='.repeat(80));
    applications.forEach((app, index) => {
      console.log(`\n${index + 1}. Application ID: ${app.applicationId}`);
      console.log(`   Name: ${app.memberName}`);
      console.log(`   Email: ${app.memberEmail}`);
      console.log(`   Phone: ${app.memberPhone}`);
      console.log(`   State: ${app.state}`);
      console.log(`   District: ${app.district}`);
      console.log(`   Block: ${app.block}`);
      console.log(`   City: ${app.city}`);
    });
    console.log('\n' + '='.repeat(80));
    console.log(`\nTotal applications: ${applications.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkApplication();
