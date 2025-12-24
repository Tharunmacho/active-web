import mongoose from 'mongoose';
import Location from '../src/shared/models/Location.js';
import dotenv from 'dotenv';

dotenv.config();

const checkLocations = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI_MEMBERS || 'mongodb://localhost:27017/active-web-db');
    console.log('✅ Connected to MongoDB\n');

    // Check total locations
    const totalLocations = await Location.countDocuments();
    console.log(`📊 Total location documents: ${totalLocations}\n`);

    // List all unique states
    console.log('🌍 All states in database:');
    const allStates = await Location.distinct('state');
    console.log(allStates, '\n');

    // Find Tamil Nadu - Chengalpattu (exact match)
    console.log('📍 Searching for: Tamil Nadu - Chengalpattu (exact match)');
    const chengalpattu = await Location.findOne({ 
      state: 'Tamil Nadu', 
      district: 'Chengalpattu' 
    });
    
    if (chengalpattu) {
      console.log('✅ Found!');
      console.log('   State:', chengalpattu.state);
      console.log('   District:', chengalpattu.district);
      console.log('   Blocks:', chengalpattu.blocks);
      console.log('   Total blocks:', chengalpattu.blocks?.length || 0);
    } else {
      console.log('❌ Not found with exact match!\n');
      
      // Try case-insensitive
      console.log('🔄 Trying case-insensitive search...');
      const chengalpattuCI = await Location.findOne({ 
        state: { $regex: /^tamil nadu$/i }, 
        district: { $regex: /^chengalpattu$/i } 
      });
      
      if (chengalpattuCI) {
        console.log('✅ Found with case-insensitive search!');
        console.log('   Actual state:', chengalpattuCI.state);
        console.log('   Actual district:', chengalpattuCI.district);
        console.log('   Blocks:', chengalpattuCI.blocks);
        console.log('   Total blocks:', chengalpattuCI.blocks?.length || 0);
      } else {
        console.log('❌ Still not found!\n');
      }
    }

    // List all districts in Tamil Nadu
    console.log('\n📋 All districts in Tamil Nadu:');
    const tamilNaduDistricts = await Location.find({ 
      state: { $regex: /^tamil nadu$/i } 
    }).select('state district blocks -_id').limit(50);
    
    if (tamilNaduDistricts.length === 0) {
      console.log('   ❌ No districts found for Tamil Nadu');
      
      // List all available data
      console.log('\n📦 Sample of available location documents:');
      const sampleLocations = await Location.find({}).limit(10);
      sampleLocations.forEach((loc, index) => {
        console.log(`\n${index + 1}. State: "${loc.state}"`);
        console.log(`   District: "${loc.district}"`);
        console.log(`   Blocks: [${loc.blocks?.slice(0, 3).join(', ')}${loc.blocks?.length > 3 ? '...' : ''}]`);
        console.log(`   Total blocks: ${loc.blocks?.length || 0}`);
      });
    } else {
      tamilNaduDistricts.forEach((loc, index) => {
        console.log(`${index + 1}. ${loc.district} (${loc.blocks?.length || 0} blocks)`);
        if (loc.blocks?.length > 0) {
          console.log(`   Sample blocks: ${loc.blocks.slice(0, 3).join(', ')}${loc.blocks.length > 3 ? '...' : ''}`);
        }
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkLocations();
