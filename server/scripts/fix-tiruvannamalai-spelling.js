import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

async function fixSpelling() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Fix Applications collection
    console.log('\n📋 Fixing Applications collection...');
    const applicationsResult = await db.collection('applications').updateMany(
      { district: 'Thiruvannamalai' },
      { $set: { district: 'Tiruvannamalai' } }
    );
    console.log(`✅ Updated ${applicationsResult.modifiedCount} applications`);

    // Fix adminsdb - BlockAdmin collection
    console.log('\n👤 Fixing BlockAdmin collection in adminsdb...');
    const adminsDb = mongoose.connection.useDb('adminsdb');
    
    const blockAdminsResult = await adminsDb.collection('blockadmins').updateMany(
      { 'meta.district': 'Thiruvannamalai' },
      { $set: { 
        'meta.district': 'Tiruvannamalai',
        'meta.districtLc': 'tiruvannamalai'
      }}
    );
    console.log(`✅ Updated ${blockAdminsResult.modifiedCount} block admins`);

    // Update email if needed
    const emailResult = await adminsDb.collection('blockadmins').updateMany(
      { email: /thiruvannamalai/i },
      [
        {
          $set: {
            email: {
              $replaceAll: {
                input: '$email',
                find: 'thiruvannamalai',
                replacement: 'tiruvannamalai'
              }
            }
          }
        }
      ]
    );
    console.log(`✅ Updated ${emailResult.modifiedCount} block admin emails`);

    // Fix DistrictAdmin collection
    console.log('\n👤 Fixing DistrictAdmin collection in adminsdb...');
    const districtAdminsResult = await adminsDb.collection('districtadmins').updateMany(
      { 'meta.district': 'Thiruvannamalai' },
      { $set: { 
        'meta.district': 'Tiruvannamalai',
        'meta.districtLc': 'tiruvannamalai'
      }}
    );
    console.log(`✅ Updated ${districtAdminsResult.modifiedCount} district admins`);

    const districtEmailResult = await adminsDb.collection('districtadmins').updateMany(
      { email: /thiruvannamalai/i },
      [
        {
          $set: {
            email: {
              $replaceAll: {
                input: '$email',
                find: 'thiruvannamalai',
                replacement: 'tiruvannamalai'
              }
            }
          }
        }
      ]
    );
    console.log(`✅ Updated ${districtEmailResult.modifiedCount} district admin emails`);

    console.log('\n✅ All spellings updated successfully!');
    console.log('📝 Summary:');
    console.log(`   - Applications: ${applicationsResult.modifiedCount}`);
    console.log(`   - Block Admins: ${blockAdminsResult.modifiedCount}`);
    console.log(`   - Block Admin Emails: ${emailResult.modifiedCount}`);
    console.log(`   - District Admins: ${districtAdminsResult.modifiedCount}`);
    console.log(`   - District Admin Emails: ${districtEmailResult.modifiedCount}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

fixSpelling();
