import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

async function fixTiruvannamalaiBlockName() {
  try {
    const mainDbUri = process.env.MONGODB_URI;
    const adminsDbUri = mainDbUri.replace('/activ-db', '/adminsdb');
    
    const adminsConn = await mongoose.createConnection(adminsDbUri).asPromise();
    console.log('✅ Connected to adminsdb\n');
    
    const BlockAdmin = adminsConn.model('BlockAdmin', new mongoose.Schema({}, { strict: false, collection: 'blockadmins' }));
    
    // Fix block name from "Tiruvannamalai" to "Thiruvannamalai"
    console.log('🔄 Fixing Thiruvannamalai block name...');
    const result = await BlockAdmin.updateMany(
      { 
        'meta.district': 'Thiruvannamalai',
        'meta.block': 'Tiruvannamalai'
      },
      { 
        $set: { 
          'meta.block': 'Thiruvannamalai',
          'meta.blockLc': 'thiruvannamalai'
        } 
      }
    );
    console.log(`✅ Updated ${result.modifiedCount} record(s)`);
    
    await adminsConn.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixTiruvannamalaiBlockName();
