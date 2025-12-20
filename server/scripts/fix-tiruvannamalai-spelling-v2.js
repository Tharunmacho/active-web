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
    
    // First update meta fields
    const blockAdminsResult = await adminsDb.collection('blockadmins').updateMany(
      { 'meta.district': 'Thiruvannamalai' },
      { $set: { 
        'meta.district': 'Tiruvannamalai',
        'meta.districtLc': 'tiruvannamalai'
      }}
    );
    console.log(`✅ Updated ${blockAdminsResult.modifiedCount} block admin meta fields`);

    // Get all block admins with old email spelling
    const blockAdmins = await adminsDb.collection('blockadmins').find({ 
      email: { $regex: 'thiruvannamalai', $options: 'i' } 
    }).toArray();
    
    console.log(`📧 Found ${blockAdmins.length} block admins with old email spelling`);
    
    let emailUpdated = 0;
    for (const admin of blockAdmins) {
      const oldEmail = admin.email;
      const newEmail = oldEmail.replace(/thiruvannamalai/gi, 'tiruvannamalai');
      
      if (oldEmail !== newEmail) {
        try {
          await adminsDb.collection('blockadmins').updateOne(
            { _id: admin._id },
            { $set: { email: newEmail } }
          );
          console.log(`  ✅ Updated: ${oldEmail} → ${newEmail}`);
          emailUpdated++;
        } catch (error) {
          if (error.code === 11000) {
            console.log(`  ⚠️ Skipping ${oldEmail} (duplicate exists)`);
          } else {
            console.error(`  ❌ Error updating ${oldEmail}:`, error.message);
          }
        }
      }
    }
    console.log(`✅ Updated ${emailUpdated} block admin emails`);

    // Fix DistrictAdmin collection
    console.log('\n👤 Fixing DistrictAdmin collection in adminsdb...');
    const districtAdminsResult = await adminsDb.collection('districtadmins').updateMany(
      { 'meta.district': 'Thiruvannamalai' },
      { $set: { 
        'meta.district': 'Tiruvannamalai',
        'meta.districtLc': 'tiruvannamalai'
      }}
    );
    console.log(`✅ Updated ${districtAdminsResult.modifiedCount} district admin meta fields`);

    // Get all district admins with old email spelling
    const districtAdmins = await adminsDb.collection('districtadmins').find({ 
      email: { $regex: 'thiruvannamalai', $options: 'i' } 
    }).toArray();
    
    console.log(`📧 Found ${districtAdmins.length} district admins with old email spelling`);
    
    let districtEmailUpdated = 0;
    for (const admin of districtAdmins) {
      const oldEmail = admin.email;
      const newEmail = oldEmail.replace(/thiruvannamalai/gi, 'tiruvannamalai');
      
      if (oldEmail !== newEmail) {
        try {
          await adminsDb.collection('districtadmins').updateOne(
            { _id: admin._id },
            { $set: { email: newEmail } }
          );
          console.log(`  ✅ Updated: ${oldEmail} → ${newEmail}`);
          districtEmailUpdated++;
        } catch (error) {
          if (error.code === 11000) {
            console.log(`  ⚠️ Skipping ${oldEmail} (duplicate exists)`);
          } else {
            console.error(`  ❌ Error updating ${oldEmail}:`, error.message);
          }
        }
      }
    }
    console.log(`✅ Updated ${districtEmailUpdated} district admin emails`);

    console.log('\n✅ All spellings updated successfully!');
    console.log('📝 Summary:');
    console.log(`   - Applications: ${applicationsResult.modifiedCount}`);
    console.log(`   - Block Admin Meta: ${blockAdminsResult.modifiedCount}`);
    console.log(`   - Block Admin Emails: ${emailUpdated}`);
    console.log(`   - District Admin Meta: ${districtAdminsResult.modifiedCount}`);
    console.log(`   - District Admin Emails: ${districtEmailUpdated}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    console.log('\n🔌 Disconnecting from MongoDB...');
    await mongoose.connection.close();
    console.log('✅ Disconnected');
  }
}

fixSpelling();
