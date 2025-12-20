import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { adminDbConnection } from '../config/multiDatabase.js';
import { BlockAdmin, DistrictAdmin, StateAdmin, SuperAdmin } from '../models/ExistingAdmins.js';

const testAdminLogin = async () => {
  try {
    console.log('🔍 Testing Admin Login with Existing Data...\n');

    // Test 1: Check if we can find a block admin
    console.log('1. Looking for block admin in Thandrampet, Tiruvannamalai, Tamil Nadu...');
    const blockAdmin = await BlockAdmin.findOne({
      'meta.stateLc': 'tamil nadu',
      'meta.districtLc': 'tiruvannamalai',
      'meta.blockLc': 'thandrampet'
    });

    if (blockAdmin) {
      console.log('✅ Block Admin found:');
      console.log('   Email:', blockAdmin.email);
      console.log('   Name:', blockAdmin.fullName);
      console.log('   Role:', blockAdmin.role);
      console.log('   Active:', blockAdmin.active);
      console.log('   Location:', blockAdmin.meta.block, blockAdmin.meta.district, blockAdmin.meta.state);
      console.log('   Password Hash:', blockAdmin.passwordHash.substring(0, 29) + '...');
      
      // Test password verification - we don't know the actual password
      console.log('\n   Note: Password hash exists, ready for authentication');
    } else {
      console.log('❌ No block admin found for Thandrampet');
    }

    // Test 2: Check district admin
    console.log('\n2. Looking for district admin in Tiruvannamalai, Tamil Nadu...');
    const districtAdmin = await DistrictAdmin.findOne({
      'meta.stateLc': 'tamil nadu',
      'meta.districtLc': 'tiruvannamalai'
    });

    if (districtAdmin) {
      console.log('✅ District Admin found:');
      console.log('   Email:', districtAdmin.email);
      console.log('   Name:', districtAdmin.fullName);
      console.log('   Active:', districtAdmin.active);
      console.log('   Location:', districtAdmin.meta.district, districtAdmin.meta.state);
    } else {
      console.log('❌ No district admin found for Tiruvannamalai');
    }

    // Test 3: Check state admin
    console.log('\n3. Looking for state admin in Tamil Nadu...');
    const stateAdmin = await StateAdmin.findOne({
      'meta.stateLc': 'tamil nadu'
    });

    if (stateAdmin) {
      console.log('✅ State Admin found:');
      console.log('   Email:', stateAdmin.email);
      console.log('   Name:', stateAdmin.fullName);
      console.log('   Active:', stateAdmin.active);
      console.log('   Location:', stateAdmin.meta.state);
    } else {
      console.log('❌ No state admin found for Tamil Nadu');
    }

    // Test 4: Check super admin
    console.log('\n4. Looking for super admin...');
    const superAdmin = await SuperAdmin.findOne();

    if (superAdmin) {
      console.log('✅ Super Admin found:');
      console.log('   Email:', superAdmin.email);
      console.log('   Name:', superAdmin.fullName);
      console.log('   Active:', superAdmin.active);
    } else {
      console.log('❌ No super admin found');
    }

    // Test 5: Count all admins
    console.log('\n5. Counting all admins...');
    const blockCount = await BlockAdmin.countDocuments();
    const districtCount = await DistrictAdmin.countDocuments();
    const stateCount = await StateAdmin.countDocuments();
    const superCount = await SuperAdmin.countDocuments();

    console.log('   Block Admins:', blockCount);
    console.log('   District Admins:', districtCount);
    console.log('   State Admins:', stateCount);
    console.log('   Super Admins:', superCount);
    console.log('   Total:', blockCount + districtCount + stateCount + superCount);

    // Test 6: Sample a few block admins from different states
    console.log('\n6. Sample block admins from different states...');
    const sampleAdmins = await BlockAdmin.find().limit(5).select('email fullName meta.state meta.district meta.block');
    
    sampleAdmins.forEach((admin, index) => {
      console.log(`   ${index + 1}. ${admin.email}`);
      console.log(`      Location: ${admin.meta.block}, ${admin.meta.district}, ${admin.meta.state}`);
    });

    console.log('\n✅ All tests completed successfully!');
    console.log('\n📝 Next Steps:');
    console.log('   1. Use the email addresses shown above to test login');
    console.log('   2. You will need the actual passwords from your admin setup');
    console.log('   3. Test the login API: POST /api/admin/auth/login');
    console.log('   4. Use the returned JWT token to access protected routes');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    await adminDbConnection.close();
    console.log('\n🔌 Database connections closed');
    process.exit(0);
  }
};

// Run the test
testAdminLogin();
