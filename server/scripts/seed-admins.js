/**
 * Script to seed admin users for testing the hierarchical approval workflow
 * Run: node server/scripts/seed-admins.js
 */

import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://activapp2025_db_user:Activapp%402025@cluster1.gf7usct.mongodb.net/activ-db?retryWrites=true&w=majority';

// Admin users to seed
const adminUsers = [
  {
    fullName: 'Thandrampattu Block Admin',
    email: 'thandrampattu.block@activ.com',
    password: 'Admin@123',
    phoneNumber: '9876543210',
    role: 'block_admin',
    state: 'Andhra Pradesh',
    district: 'Anantapur',
    block: 'Thandrampattu'
  },
  {
    fullName: 'Anantapur District Admin',
    email: 'anantapur.district@activ.com',
    password: 'Admin@123',
    phoneNumber: '9876543211',
    role: 'district_admin',
    state: 'Andhra Pradesh',
    district: 'Anantapur'
  },
  {
    fullName: 'Andhra Pradesh State Admin',
    email: 'ap.state@activ.com',
    password: 'Admin@123',
    phoneNumber: '9876543212',
    role: 'state_admin',
    state: 'Andhra Pradesh'
  },
  // Additional admins for testing
  {
    fullName: 'Bangalore North Block Admin',
    email: 'blr.north.block@activ.com',
    password: 'Admin@123',
    phoneNumber: '9876543213',
    role: 'block_admin',
    state: 'Karnataka',
    district: 'Bangalore Urban',
    block: 'Bangalore North'
  },
  {
    fullName: 'Bangalore Urban District Admin',
    email: 'blr.district@activ.com',
    password: 'Admin@123',
    phoneNumber: '9876543214',
    role: 'district_admin',
    state: 'Karnataka',
    district: 'Bangalore Urban'
  },
  {
    fullName: 'Karnataka State Admin',
    email: 'karnataka.state@activ.com',
    password: 'Admin@123',
    phoneNumber: '9876543215',
    role: 'state_admin',
    state: 'Karnataka'
  },
  {
    fullName: 'Super Admin',
    email: 'super.admin@activ.com',
    password: 'Admin@123',
    phoneNumber: '9876543216',
    role: 'super_admin',
    state: 'All India'
  }
];

async function seedAdmins() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('🗑️  Clearing existing admin users...');
    await Admin.deleteMany({});
    console.log('✅ Cleared existing admins\n');

    console.log('👥 Creating admin users...\n');
    
    for (const adminData of adminUsers) {
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

    console.log('✅ All admin users created successfully!\n');
    console.log('📋 Admin Login Credentials Summary:');
    console.log('=' .repeat(60));
    adminUsers.forEach(admin => {
      console.log(`${admin.role.toUpperCase().replace('_', ' ')}`);
      console.log(`  Email: ${admin.email}`);
      console.log(`  Password: Admin@123`);
      console.log('');
    });
    console.log('=' .repeat(60));
    console.log('\n✅ Seeding complete!\n');

    mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding admins:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}

// Run the seed function
seedAdmins();
