import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { BlockAdmin } from '../models/ExistingAdmins.js';
import { adminDbConnection } from '../config/multiDatabase.js';

async function createBlockAdmin() {
  try {
    // Connect to admin database
    await adminDbConnection.asPromise();
    console.log('✅ Connected to adminsdb');

    const email = 'block.thandrampet.thiruvannamalai.tamil.nadu@activ.com';
    const password = 'ChangeMe@123';

    // Check if admin already exists
    const existingAdmin = await BlockAdmin.findOne({ email });
    if (existingAdmin) {
      console.log('⚠️  Admin already exists, updating password...');
      
      // Hash password
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);
      
      existingAdmin.passwordHash = passwordHash;
      existingAdmin.active = true;
      await existingAdmin.save();
      
      console.log('\n✅ Admin password updated successfully!');
    } else {
      console.log('📝 Creating new admin...');
      
      // Hash password
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      // Create new admin
      const newAdmin = new BlockAdmin({
        adminId: 'BA_THANDRAMPET_001',
        email: email,
        passwordHash: passwordHash,
        fullName: 'Thandrampet Block Admin',
        role: 'BlockAdmin',
        active: true,
        meta: {
          state: 'Tamil Nadu',
          district: 'Thiruvannamalai',
          block: 'Thandrampet',
          stateLc: 'tamil nadu',
          districtLc: 'thiruvannamalai',
          blockLc: 'thandrampet',
          mustResetPassword: false
        },
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await newAdmin.save();
      console.log('\n✅ New admin created successfully!');
    }

    console.log('\n📋 Admin Details:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Location: Thandrampet, Thiruvannamalai, Tamil Nadu`);
    console.log('\n✅ You can now login with these credentials!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

createBlockAdmin();
