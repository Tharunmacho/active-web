import mongoose from 'mongoose';
import Application from '../models/Application.js';
import dotenv from 'dotenv';

dotenv.config();

const fixApplicationLocation = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Update the application
    const result = await Application.updateOne(
      { applicationId: 'APP-1766217183562-8X0ZRNI1M' },
      { 
        $set: { 
          block: 'Arni',  // Change from 'Arani' to 'Arni'
          district: 'Thiruvannamalai'  // Add the 'h'
        } 
      }
    );

    console.log('\n✅ Update result:', result);

    // Verify the update
    const updated = await Application.findOne({ 
      applicationId: 'APP-1766217183562-8X0ZRNI1M' 
    }).select('applicationId state district block status');

    console.log('\n📋 Updated Application:');
    console.log('  Application ID:', updated.applicationId);
    console.log('  State:', updated.state);
    console.log('  District:', updated.district);
    console.log('  Block:', updated.block);
    console.log('  Status:', updated.status);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixApplicationLocation();
