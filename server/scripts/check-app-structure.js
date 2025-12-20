import mongoose from 'mongoose';
import Application from '../models/Application.js';
import dotenv from 'dotenv';

dotenv.config();

const checkApplicationStructure = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get the latest application
    const latestApp = await Application.findOne({ 
      applicationId: 'APP-1766217183562-8X0ZRNI1M' 
    });

    if (latestApp) {
      console.log('\n📋 Latest Application (saisree1):');
      console.log(JSON.stringify(latestApp.toObject(), null, 2));
    } else {
      console.log('❌ Application not found');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkApplicationStructure();
