import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

async function fixDuplicateAdmin() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const adminsDb = mongoose.connection.useDb('adminsdb');
    
    // Find both admins
    const oldAdmin = await adminsDb.collection('blockadmins').findOne({ 
      email: 'block.thandrampet.thiruvannamalai.tamil.nadu@activ.com'
    });
    
    const newAdmin = await adminsDb.collection('blockadmins').findOne({ 
      email: 'block.thandrampet.tiruvannamalai.tamil.nadu@activ.com'
    });
    
    console.log('📊 Current Status:');
    console.log('\n🔴 Old Admin (WITH \'h\'):');
    if (oldAdmin) {
      console.log(`  Email: ${oldAdmin.email}`);
      console.log(`  District: ${oldAdmin.meta.district}`);
      console.log(`  Admin ID: ${oldAdmin.adminId}`);
      console.log(`  Has Password: ${!!oldAdmin.password}`);
    } else {
      console.log('  Not found');
    }
    
    console.log('\n🟢 New Admin (WITHOUT \'h\'):');
    if (newAdmin) {
      console.log(`  Email: ${newAdmin.email}`);
      console.log(`  District: ${newAdmin.meta.district}`);
      console.log(`  Admin ID: ${newAdmin.adminId}`);
      console.log(`  Has Password: ${!!newAdmin.password}`);
    } else {
      console.log('  Not found');
    }
    
    if (oldAdmin && newAdmin) {
      console.log('\n🔧 Fixing strategy:');
      console.log('   - Deleting the new admin (duplicate)');
      console.log('   - Updating old admin with correct spelling\n');
      
      // Delete the new admin (without 'h')
      await adminsDb.collection('blockadmins').deleteOne({ 
        _id: newAdmin._id 
      });
      console.log('✅ Deleted duplicate admin');
      
      // Update the old admin to have correct spelling
      await adminsDb.collection('blockadmins').updateOne(
        { _id: oldAdmin._id },
        { 
          $set: { 
            'meta.district': 'Tiruvannamalai',
            'meta.districtLc': 'tiruvannamalai'
          } 
        }
      );
      console.log('✅ Updated old admin with correct district spelling');
      
      console.log('\n✅ Fix complete! Admin can now see all applications.');
      
    } else if (oldAdmin && !newAdmin) {
      console.log('\n✅ Only old admin exists. Updating spelling...');
      await adminsDb.collection('blockadmins').updateOne(
        { _id: oldAdmin._id },
        { 
          $set: { 
            'meta.district': 'Tiruvannamalai',
            'meta.districtLc': 'tiruvannamalai'
          } 
        }
      );
      console.log('✅ Updated admin with correct spelling');
    } else if (!oldAdmin && newAdmin) {
      console.log('\n✅ Only new admin exists. No action needed.');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

fixDuplicateAdmin();
