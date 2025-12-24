import mongoose from 'mongoose';
import Location from '../src/shared/models/Location.js';
import dotenv from 'dotenv';

dotenv.config();

const verify = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'activ-db' });
    console.log('✅ Connected to MongoDB\n');

    // Check Tamil Nadu - Chengalpattu
    const chengalpattu = await Location.findOne({ 
      state: /tamil nadu/i, 
      district: /chengalpattu/i 
    });
    
    console.log('📍 Tamil Nadu - Chengalpattu:');
    if (chengalpattu) {
      console.log(`   ✅ Found: ${chengalpattu.district}`);
      console.log(`   📊 Blocks (${chengalpattu.blocks?.length || 0}):`, chengalpattu.blocks?.slice(0, 5).join(', '), '...');
    } else {
      console.log('   ❌ Not found');
    }

    // Check first 5 Tamil Nadu districts
    console.log('\n📋 Tamil Nadu districts (first 10):');
    const tamilNaduDistricts = await Location.find({ state: /tamil nadu/i }).limit(10);
    tamilNaduDistricts.forEach((loc, i) => {
      console.log(`   ${i + 1}. ${loc.district} (${loc.blocks?.length || 0} blocks)`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

verify();
