import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Location from './src/shared/models/Location.js';

dotenv.config();

const checkChengalpattu = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      family: 4
    });

    console.log('✅ Connected to activ-db\n');

    // Search for Chengalpattu (any case variation)
    const locations = await Location.find({ 
      state: /Tamil Nadu/i,
      district: /chengalpattu/i 
    });

    console.log('📊 Found locations:', locations.length);
    
    if (locations.length > 0) {
      locations.forEach(loc => {
        console.log('\n📍 Location:');
        console.log('  State:', loc.state);
        console.log('  District:', loc.district);
        console.log('  Blocks:', loc.blocks?.length || 0);
        if (loc.blocks) {
          console.log('  Block names:', loc.blocks.join(', '));
        }
      });
    } else {
      console.log('\n❌ No locations found for Chengalpattu district');
      
      // Check all Tamil Nadu districts
      console.log('\n🔍 All Tamil Nadu districts in database:');
      const tnDistricts = await Location.find({ state: /Tamil Nadu/i });
      tnDistricts.forEach(loc => {
        console.log(`  - ${loc.district} (${loc.blocks?.length || 0} blocks)`);
      });
    }

    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkChengalpattu();
