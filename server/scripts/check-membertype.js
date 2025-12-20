import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

async function checkLatestApplication() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected\n');

    const db = mongoose.connection.db;
    
    // Get the latest application
    const app = await db.collection('applications')
      .findOne({}, { sort: { createdAt: -1 } });
    
    if (!app) {
      console.log('❌ No applications found');
      return;
    }
    
    console.log('📋 Latest Application:');
    console.log('   App ID:', app.applicationId);
    console.log('   Email:', app.memberEmail);
    console.log('   👤 MEMBER TYPE:', app.memberType || '❌ NOT SET');
    console.log('   Status:', app.status);
    console.log('\n📦 Full memberType field:', JSON.stringify({ memberType: app.memberType }, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

checkLatestApplication();
