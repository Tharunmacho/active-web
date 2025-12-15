import mongoose from 'mongoose';
import Location from './models/Location.js';
import dotenv from 'dotenv';

dotenv.config();

async function testBlocks() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const state = 'Tamil Nadu';
    const district = 'Tiruvannamalai';
    
    console.log(`\nSearching for: ${state} - ${district}`);
    
    const location = await Location.findOne({ state, district });
    
    if (location) {
      console.log('✅ Location found!');
      console.log('State:', location.state);
      console.log('District:', location.district);
      console.log('Number of blocks:', location.blocks.length);
      console.log('\nFirst 10 blocks:');
      location.blocks.slice(0, 10).forEach((block, index) => {
        console.log(`  ${index + 1}. ${block}`);
      });
    } else {
      console.log('❌ No location found!');
      
      // Let's check what's in the database
      const allLocations = await Location.find({}).limit(5);
      console.log('\nSample locations in database:');
      allLocations.forEach(loc => {
        console.log(`  - State: "${loc.state}", District: "${loc.district}", Blocks: ${loc.blocks.length}`);
      });
      
      // Check if state exists with different casing/spacing
      const tamilNaduLocations = await Location.find({ 
        state: { $regex: 'tamil', $options: 'i' } 
      }).limit(5);
      console.log('\nLocations matching "Tamil" (case insensitive):');
      tamilNaduLocations.forEach(loc => {
        console.log(`  - State: "${loc.state}", District: "${loc.district}"`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Connection closed');
  }
}

testBlocks();
