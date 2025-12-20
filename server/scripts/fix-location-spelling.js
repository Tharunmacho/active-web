import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

async function fixTiruvannamalaiSpelling() {
  try {
    const mainDbUri = process.env.MONGODB_URI;
    const adminsDbUri = mainDbUri.replace('/activ-db', '/adminsdb');
    
    const adminsConn = await mongoose.createConnection(adminsDbUri).asPromise();
    const mainConn = await mongoose.createConnection(mainDbUri).asPromise();
    
    console.log('✅ Connected to databases\n');
    
    const BlockAdmin = adminsConn.model('BlockAdmin', new mongoose.Schema({}, { strict: false, collection: 'blockadmins' }));
    const Application = mainConn.model('Application', new mongoose.Schema({}, { strict: false, collection: 'applications' }));
    
    // Fix BlockAdmins
    console.log('🔄 Fixing BlockAdmin records...');
    const adminResult = await BlockAdmin.updateMany(
      { 'meta.district': 'Tiruvannamalai' },
      { 
        $set: { 
          'meta.district': 'Thiruvannamalai',
          'meta.districtLc': 'thiruvannamalai'
        } 
      }
    );
    console.log(`✅ Updated ${adminResult.modifiedCount} BlockAdmin records`);
    
    // Fix Applications
    console.log('\n🔄 Fixing Application records...');
    const appResult = await Application.updateMany(
      { district: 'Tiruvannamalai' },
      { $set: { district: 'Thiruvannamalai' } }
    );
    console.log(`✅ Updated ${appResult.modifiedCount} Application records`);
    
    // Minor block spelling fixes
    console.log('\n🔄 Fixing minor block spelling differences...');
    
    // T. Palur -> T.Palur spacing
    const palurResult = await BlockAdmin.updateMany(
      { 'meta.district': 'Ariyalur', 'meta.block': 'T. Palur' },
      { 
        $set: { 
          'meta.block': 'T.Palur',
          'meta.blockLc': 't.palur'
        } 
      }
    );
    console.log(`  ✅ T.Palur: ${palurResult.modifiedCount} records`);
    
    // S. Pudur -> S.Pudur spacing
    const pudurResult = await BlockAdmin.updateMany(
      { 'meta.district': 'Sivaganga', 'meta.block': 'S. Pudur' },
      { 
        $set: { 
          'meta.block': 'S.Pudur',
          'meta.blockLc': 's.pudur'
        } 
      }
    );
    console.log(`  ✅ S.Pudur: ${pudurResult.modifiedCount} records`);
    
    // Manachanellur -> Manachanallur spelling
    const manaResult = await BlockAdmin.updateMany(
      { 'meta.district': 'Tiruchirappalli', 'meta.block': 'Manachanellur' },
      { 
        $set: { 
          'meta.block': 'Manachanallur',
          'meta.blockLc': 'manachanallur'
        } 
      }
    );
    console.log(`  ✅ Manachanallur: ${manaResult.modifiedCount} records`);
    
    console.log('\n✅ All fixes complete!');
    
    await adminsConn.close();
    await mainConn.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixTiruvannamalaiSpelling();
