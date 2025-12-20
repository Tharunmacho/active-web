import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { BlockAdmin } from '../models/ExistingAdmins.js';
import dotenv from 'dotenv';

dotenv.config();

const addArniAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_ADMIN_URI || process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await BlockAdmin.findOne({ 
      email: 'block.arni.thiruvannamalai.tamil.nadu@activ.com' 
    });

    if (existingAdmin) {
      console.log('⚠️ Admin already exists, updating password...');
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('ChangeMe@123', salt);
      
      existingAdmin.passwordHash = hashedPassword;
      await existingAdmin.save();
      
      console.log('✅ Admin password updated successfully!');
      console.log('Email:', existingAdmin.email);
      console.log('Password: ChangeMe@123');
      process.exit(0);
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('ChangeMe@123', salt);

    // Create new Block Admin
    const newAdmin = new BlockAdmin({
      adminId: 'BA28029002',
      fullName: 'Arni Block Admin',
      email: 'block.arni.thiruvannamalai.tamil.nadu@activ.com',
      passwordHash: hashedPassword,
      active: true,
      meta: {
        state: 'Tamil Nadu',
        stateLc: 'tamil nadu',
        district: 'Thiruvannamalai',
        districtLc: 'thiruvannamalai',
        block: 'Arni',
        blockLc: 'arni',
        mustResetPassword: true
      },
      createdAt: new Date(),
      lastLoginAt: null
    });

    await newAdmin.save();
    
    console.log('✅ Arni Block Admin created successfully!');
    console.log('Email:', newAdmin.email);
    console.log('Admin ID:', newAdmin.adminId);
    console.log('Location: Arni, Thiruvannamalai, Tamil Nadu');
    console.log('Password: ChangeMe@123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

addArniAdmin();
