import mongoose from 'mongoose';
import Location from '../models/Location.js';
import dotenv from 'dotenv';

dotenv.config();

const checkLocations = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check districts with "Tiruvannamalai"
    const districts = await Location.find({
      $or: [
        { name: /tiruvannamalai/i, type: 'district' },
        { name: /thiruvannamalai/i, type: 'district' }
      ]
    });

    console.log('\n📋 Districts with similar names:', districts.length);
    districts.forEach(d => {
      console.log(`  - Name: "${d.name}", Type: ${d.type}, Parent: ${d.parentName || 'N/A'}`);
    });

    // Check blocks with "Arni" or "Arani"
    const blocks = await Location.find({
      $or: [
        { name: /^arni$/i, type: 'block' },
        { name: /^arani$/i, type: 'block' }
      ]
    });

    console.log('\n📋 Blocks with "Arni" or "Arani":', blocks.length);
    blocks.forEach(b => {
      console.log(`  - Name: "${b.name}", Type: ${b.type}, Parent: ${b.parentName || 'N/A'}, State: ${b.state || 'N/A'}`);
    });

    // Get all blocks in Tiruvannamalai district
    const tiruBlocks = await Location.find({
      type: 'block',
      parentName: /tiruvannamalai/i
    });

    console.log('\n📋 All blocks in Tiruvannamalai district:', tiruBlocks.length);
    tiruBlocks.forEach(b => {
      console.log(`  - "${b.name}"`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkLocations();
