import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connect to remote MongoDB ADMINSDB database (where district admins are stored)
const MONGODB_URI = 'mongodb+srv://activapp2025_db_user:o6xFHfqzLXM6LUaa@cluster1.gf7usct.mongodb.net/adminsdb?retryWrites=true&w=majority';

async function fixDistrictAdminSpelling() {
  try {
    console.log('🔧 Fixing district admin spelling...\n');
    console.log('Looking for: "Tiruvannamalai" (without h)');
    console.log('Changing to: "Thiruvannamalai" (with h)\n');

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to adminsdb database\n');

    // List all collections to find the right one
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 Available collections:', collections.map(c => c.name).join(', '));

    // Try different collection names
    let admin = null;
    let collectionName = '';
    
    for (const name of ['districtadmins', 'district_admins', 'admins', 'DistrictAdmins']) {
      admin = await mongoose.connection.db.collection(name).findOne({ 
        email: 'district.tiruvannamalai.tamil.nadu@activ.com'
      });
      if (admin) {
        collectionName = name;
        console.log(`✅ Found admin in collection: ${name}`);
        break;
      }
    }

    if (!admin) {
      console.log('❌ District admin not found in any collection');
      return;
    }

    console.log('📋 Current district admin data:', {
      email: admin.email,
      district: admin.meta?.district,
      districtLc: admin.meta?.districtLc
    });

    // Update with correct spelling
    await mongoose.connection.db.collection(collectionName).updateOne(
      { email: 'district.tiruvannamalai.tamil.nadu@activ.com' },
      { 
        $set: { 
          'meta.district': 'Thiruvannamalai',
          'meta.districtLc': 'thiruvannamalai'
        } 
      }
    );

    console.log('✅ Updated district admin spelling to "Thiruvannamalai"');

    // Verify the fix
    const updated = await mongoose.connection.db.collection(collectionName).findOne({ 
      email: 'district.tiruvannamalai.tamil.nadu@activ.com'
    });

    console.log('\n📋 Verified updated data:', {
      email: updated.email,
      district: updated.meta?.district,
      districtLc: updated.meta?.districtLc
    });

    console.log('\n✅ SUCCESS! District admin will now see applications with matching district!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from database');
    process.exit(0);
  }
}

fixDistrictAdminSpelling();
