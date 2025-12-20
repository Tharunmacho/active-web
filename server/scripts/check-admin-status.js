import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

async function checkStatus() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const adminsDb = mongoose.connection.useDb('adminsdb');
    
    // Check block admins for Thandrampet
    console.log('👤 Block Admins for Thandrampet:');
    const blockAdmins = await adminsDb.collection('blockadmins').find({ 
      'meta.block': 'Thandrampet' 
    }).toArray();
    
    for (const admin of blockAdmins) {
      console.log(`\n📧 Email: ${admin.email}`);
      console.log(`📍 Location: ${admin.meta.state} > ${admin.meta.district} > ${admin.meta.block}`);
      console.log(`👤 Name: ${admin.fullName}`);
      console.log(`🆔 Admin ID: ${admin.adminId}`);
    }
    
    // Check applications for Tiruvannamalai/Thiruvannamalai
    console.log('\n\n📋 Applications in Thandrampet:');
    const db = mongoose.connection.db;
    const applications = await db.collection('applications').find({ 
      block: 'Thandrampet' 
    }).toArray();
    
    for (const app of applications) {
      console.log(`\n📝 App ID: ${app.applicationId}`);
      console.log(`📧 Email: ${app.email}`);
      console.log(`📍 Location: ${app.state} > ${app.district} > ${app.block}`);
      console.log(`📊 Status: ${app.status}`);
    }
    
    console.log(`\n📊 Total applications: ${applications.length}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

checkStatus();
