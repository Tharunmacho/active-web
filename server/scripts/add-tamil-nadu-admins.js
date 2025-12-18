/**
 * Script to add Tamil Nadu admins for saisree's location
 * Run: node server/scripts/add-tamil-nadu-admins.js
 */

import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://activapp2025_db_user:Activapp%402025@cluster1.gf7usct.mongodb.net/activ-db?retryWrites=true&w=majority';

// Tamil Nadu admin users for saisree's location
const tamilNaduAdmins = [
  {
    fullName: 'Thandrampet Block Admin',
    email: 'thandrampet.block@activ.com',
    password: 'Admin@123',
    phoneNumber: '9876543220',
    role: 'block_admin',
    state: 'Tamil Nadu',
    district: 'Tiruvannamalai',
    block: 'Thandrampet'
  },
  {
    fullName: 'Tiruvannamalai District Admin',
    email: 'tiruvannamalai.district@activ.com',
    password: 'Admin@123',
    phoneNumber: '9876543221',
    role: 'district_admin',
    state: 'Tamil Nadu',
    district: 'Tiruvannamalai'
  },
  {
    fullName: 'Tamil Nadu State Admin',
    email: 'tamilnadu.state@activ.com',
    password: 'Admin@123',
    phoneNumber: '9876543222',
    role: 'state_admin',
    state: 'Tamil Nadu'
  }
];

async function addTamilNaduAdmins() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('👥 Creating Tamil Nadu admin users for saisree\'s location...\n');
    
    for (const adminData of tamilNaduAdmins) {
      // Check if admin already exists
      const existingAdmin = await Admin.findOne({ email: adminData.email });
      
      if (existingAdmin) {
        console.log(`⚠️  Admin already exists: ${adminData.email}\n`);
        continue;
      }

      const admin = await Admin.create(adminData);
      console.log(`✅ Created ${admin.role}:`);
      console.log(`   Name: ${admin.fullName}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Password: Admin@123`);
      if (admin.state) console.log(`   State: ${admin.state}`);
      if (admin.district) console.log(`   District: ${admin.district}`);
      if (admin.block) console.log(`   Block: ${admin.block}`);
      console.log('');
    }

    console.log('✅ Tamil Nadu admin users created successfully!\n');
    console.log('📋 Login Credentials for Saisree\'s Location:');
    console.log('═'.repeat(60));
    console.log('BLOCK ADMIN (Thandrampet)');
    console.log('  Email: thandrampet.block@activ.com');
    console.log('  Password: Admin@123');
    console.log('');
    console.log('DISTRICT ADMIN (Tiruvannamalai)');
    console.log('  Email: tiruvannamalai.district@activ.com');
    console.log('  Password: Admin@123');
    console.log('');
    console.log('STATE ADMIN (Tamil Nadu)');
    console.log('  Email: tamilnadu.state@activ.com');
    console.log('  Password: Admin@123');
    console.log('═'.repeat(60));
    console.log('\n✅ Setup complete! Now saisree\'s application can go through approval workflow.\n');

    mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error creating admins:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}

// Run the function
addTamilNaduAdmins();
