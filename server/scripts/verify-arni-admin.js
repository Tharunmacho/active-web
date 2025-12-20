import mongoose from 'mongoose';
import { BlockAdmin } from '../models/ExistingAdmins.js';
import dotenv from 'dotenv';

dotenv.config();

const verifyAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_ADMIN_URI || process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    console.log('📂 Database:', mongoose.connection.name);

    // Search for admin with exact email
    const admin1 = await BlockAdmin.findOne({ 
      email: 'block.arni.thiruvannamalai.tamil.nadu@activ.com' 
    });
    console.log('\n🔍 Search with exact email:');
    console.log(admin1 ? '✅ Found' : '❌ Not found');
    if (admin1) {
      console.log('Admin ID:', admin1.adminId);
      console.log('Email:', admin1.email);
      console.log('Name:', admin1.fullName);
      console.log('Active:', admin1.active);
      console.log('Location:', admin1.meta);
    }

    // Search with case-insensitive regex
    const admin2 = await BlockAdmin.findOne({ 
      email: { $regex: new RegExp('^block\\.arni\\.thiruvannamalai\\.tamil\\.nadu@activ\\.com$', 'i') }
    });
    console.log('\n🔍 Search with case-insensitive:');
    console.log(admin2 ? '✅ Found' : '❌ Not found');

    // Count all block admins in Thiruvannamalai
    const count = await BlockAdmin.countDocuments({
      'meta.districtLc': 'thiruvannamalai'
    });
    console.log('\n📊 Total Thiruvannamalai block admins:', count);

    // List all Thiruvannamalai admins
    const allAdmins = await BlockAdmin.find({
      'meta.districtLc': 'thiruvannamalai'
    }).select('email fullName meta.block');
    
    console.log('\n📋 All Thiruvannamalai Block Admins:');
    allAdmins.forEach(admin => {
      console.log(`  - ${admin.meta.block}: ${admin.email}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

verifyAdmin();
