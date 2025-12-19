import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connect to actv-db database (the one with 'applications' collection)
const MONGODB_URI = 'mongodb+srv://activapp2025_db_user:o6xFHfqzLXM6LUaa@cluster1.gf7usct.mongodb.net/actv-db?retryWrites=true&w=majority';

async function fixDistrictSpelling() {
  try {
    console.log('🔧 Fixing district spelling...\n');
    console.log('Looking for: "Tiruvannamalai" (without h)');
    console.log('Changing to: "Thiruvannamalai" (with h)\n');

    // Connect to the correct database
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to activ-db database\n');

    // Find application with wrong spelling in activ-db.applications
    const applications = await mongoose.connection.db.collection('applications').find({ 
      district: 'Tiruvannamalai'  // Wrong spelling (without 'h')
    }).toArray();

    console.log(`📋 Found ${applications.length} application(s) with spelling "Tiruvannamalai"`);

    if (applications.length === 0) {
      console.log('❌ No applications found to fix');
      return;
    }

    // Update each application
    for (const app of applications) {
      console.log(`\n🔄 Updating application: ${app.applicationNumber || app.applicationId}`);
      console.log(`   Old district: "${app.district}"`);
      
      await mongoose.connection.db.collection('applications').updateOne(
        { _id: app._id },
        { $set: { district: 'Thiruvannamalai' } }
      );
      
      console.log(`   New district: "Thiruvannamalai"`);
      console.log(`   ✅ Updated successfully!`);
    }

    console.log('\n✅ All applications updated!');
    console.log('\n🔍 Verifying the fix...');

    // Verify the fix
    const verifyQuery = {
      state: 'Tamil Nadu',
      district: 'Thiruvannamalai',
      block: 'Thandrampet',
      status: 'pending_block_approval'
    };

    const matchingApps = await mongoose.connection.db.collection('applications').find(verifyQuery).toArray();
    console.log(`📊 Applications matching admin query: ${matchingApps.length}`);
    
    if (matchingApps.length > 0) {
      console.log('\n✅ SUCCESS! Applications will now appear in Block Admin dashboard!');
      matchingApps.forEach(app => {
        console.log(`   - ${app.applicationNumber || app.applicationId}: ${app.state}, ${app.district}, ${app.block}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from database');
    process.exit(0);
  }
}

fixDistrictSpelling();
