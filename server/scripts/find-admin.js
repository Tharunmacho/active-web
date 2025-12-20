import mongoose from 'mongoose';
import { adminDbConnection } from '../config/multiDatabase.js';
import { BlockAdmin, DistrictAdmin, StateAdmin, SuperAdmin } from '../models/ExistingAdmins.js';

// Helper function to search admins by location
const findAdminsByLocation = async (state, district = null, block = null) => {
  try {
    console.log('\n🔍 Searching for admins...');
    console.log('State:', state);
    if (district) console.log('District:', district);
    if (block) console.log('Block:', block);
    console.log('---');

    const stateLc = state.toLowerCase();
    const districtLc = district ? district.toLowerCase() : null;
    const blockLc = block ? block.toLowerCase() : null;

    // Find matching admins
    const results = {
      block: null,
      district: null,
      state: null,
      super: null
    };

    // Search for state admin
    results.state = await StateAdmin.findOne({
      'meta.stateLc': stateLc
    });

    if (results.state) {
      console.log('\n✅ STATE ADMIN FOUND:');
      console.log('   Email:', results.state.email);
      console.log('   Name:', results.state.fullName);
      console.log('   Role:', results.state.role);
      console.log('   Active:', results.state.active);
      console.log('   Password Hash:', results.state.passwordHash.substring(0, 29) + '...');
    }

    // Search for district admin if district provided
    if (districtLc) {
      results.district = await DistrictAdmin.findOne({
        'meta.stateLc': stateLc,
        'meta.districtLc': districtLc
      });

      if (results.district) {
        console.log('\n✅ DISTRICT ADMIN FOUND:');
        console.log('   Email:', results.district.email);
        console.log('   Name:', results.district.fullName);
        console.log('   Role:', results.district.role);
        console.log('   Active:', results.district.active);
        console.log('   Password Hash:', results.district.passwordHash.substring(0, 29) + '...');
      }
    }

    // Search for block admin if block provided
    if (blockLc) {
      results.block = await BlockAdmin.findOne({
        'meta.stateLc': stateLc,
        'meta.districtLc': districtLc,
        'meta.blockLc': blockLc
      });

      if (results.block) {
        console.log('\n✅ BLOCK ADMIN FOUND:');
        console.log('   Email:', results.block.email);
        console.log('   Name:', results.block.fullName);
        console.log('   Role:', results.block.role);
        console.log('   Active:', results.block.active);
        console.log('   Password Hash:', results.block.passwordHash.substring(0, 29) + '...');
      }
    }

    // Get super admin
    results.super = await SuperAdmin.findOne();
    if (results.super) {
      console.log('\n✅ SUPER ADMIN FOUND:');
      console.log('   Email:', results.super.email);
      console.log('   Name:', results.super.fullName);
      console.log('   Role:', results.super.role);
      console.log('   Active:', results.super.active);
    }

    console.log('\n---');
    console.log('📝 Summary:');
    console.log('   State Admin:', results.state ? '✅ Found' : '❌ Not found');
    console.log('   District Admin:', districtLc ? (results.district ? '✅ Found' : '❌ Not found') : '⏭️  Not searched');
    console.log('   Block Admin:', blockLc ? (results.block ? '✅ Found' : '❌ Not found') : '⏭️  Not searched');
    console.log('   Super Admin:', results.super ? '✅ Found' : '❌ Not found');

    return results;

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
};

// List available states
const listStates = async () => {
  try {
    console.log('\n📍 Available States/UTs:\n');
    
    const states = await StateAdmin.find().select('meta.state').sort({ 'meta.state': 1 });
    
    states.forEach((admin, index) => {
      console.log(`   ${index + 1}. ${admin.meta.state}`);
    });

    console.log(`\n   Total: ${states.length} states/UTs`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
};

// List districts in a state
const listDistricts = async (state) => {
  try {
    const stateLc = state.toLowerCase();
    console.log(`\n📍 Districts in ${state}:\n`);
    
    const districts = await DistrictAdmin.find({ 'meta.stateLc': stateLc })
      .select('meta.district')
      .sort({ 'meta.district': 1 });
    
    if (districts.length === 0) {
      console.log('   No districts found');
      return;
    }

    districts.forEach((admin, index) => {
      console.log(`   ${index + 1}. ${admin.meta.district}`);
    });

    console.log(`\n   Total: ${districts.length} districts`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
};

// List blocks in a district
const listBlocks = async (state, district) => {
  try {
    const stateLc = state.toLowerCase();
    const districtLc = district.toLowerCase();
    console.log(`\n📍 Blocks in ${district}, ${state}:\n`);
    
    const blocks = await BlockAdmin.find({ 
      'meta.stateLc': stateLc,
      'meta.districtLc': districtLc
    })
      .select('meta.block')
      .sort({ 'meta.block': 1 });
    
    if (blocks.length === 0) {
      console.log('   No blocks found');
      return;
    }

    blocks.forEach((admin, index) => {
      console.log(`   ${index + 1}. ${admin.meta.block}`);
    });

    console.log(`\n   Total: ${blocks.length} blocks`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
};

// Main function to run examples
const main = async () => {
  try {
    console.log('🔧 Admin Finder Tool\n');
    console.log('This tool helps you find admin credentials by location.\n');

    // Get command line arguments
    const args = process.argv.slice(2);
    const command = args[0];

    if (!command) {
      console.log('Usage:');
      console.log('  node scripts/find-admin.js states                    - List all states');
      console.log('  node scripts/find-admin.js districts "Tamil Nadu"     - List districts in state');
      console.log('  node scripts/find-admin.js blocks "Tamil Nadu" "Tiruvannamalai"  - List blocks in district');
      console.log('  node scripts/find-admin.js find "Tamil Nadu"          - Find state admin');
      console.log('  node scripts/find-admin.js find "Tamil Nadu" "Tiruvannamalai"  - Find state & district admins');
      console.log('  node scripts/find-admin.js find "Tamil Nadu" "Tiruvannamalai" "Thandrampet"  - Find all admins\n');
      return;
    }

    if (command === 'states') {
      await listStates();
    } else if (command === 'districts') {
      const state = args[1];
      if (!state) {
        console.log('❌ Please provide state name: node scripts/find-admin.js districts "State Name"');
        return;
      }
      await listDistricts(state);
    } else if (command === 'blocks') {
      const state = args[1];
      const district = args[2];
      if (!state || !district) {
        console.log('❌ Please provide state and district: node scripts/find-admin.js blocks "State" "District"');
        return;
      }
      await listBlocks(state, district);
    } else if (command === 'find') {
      const state = args[1];
      const district = args[2] || null;
      const block = args[3] || null;
      
      if (!state) {
        console.log('❌ Please provide at least state name: node scripts/find-admin.js find "State Name"');
        return;
      }
      
      await findAdminsByLocation(state, district, block);
    } else {
      console.log('❌ Unknown command. Use: states, districts, blocks, or find');
    }

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    await adminDbConnection.close();
    console.log('\n🔌 Database connections closed');
    process.exit(0);
  }
};

// Run the tool
main();
