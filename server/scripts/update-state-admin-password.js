import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Connect to adminsdb
const adminDbConnection = mongoose.createConnection(
  'mongodb+srv://activapp2025_db_user:o6xFHfqzLXM6LUaa@cluster1.gf7usct.mongodb.net/adminsdb?retryWrites=true&w=majority'
);

// State Admin Schema
const stateAdminSchema = new mongoose.Schema({
  adminId: String,
  email: String,
  passwordHash: String,
  fullName: String,
  role: String,
  active: Boolean,
  meta: Object,
  lastLoginAt: Date,
  createdAt: Date,
  updatedAt: Date
}, {
  collection: 'stateadmins'
});

const StateAdmin = adminDbConnection.model('StateAdmin', stateAdminSchema);

async function updatePassword() {
  try {
    console.log('🔄 Connecting to adminsdb...');
    
    await adminDbConnection.asPromise();
    console.log('✅ Connected to adminsdb');

    // Find the admin
    const admin = await StateAdmin.findOne({ email: 'state.tamil.nadu@activ.com' });
    
    if (!admin) {
      console.log('❌ Admin not found with email: state.tamil.nadu@activ.com');
      return;
    }

    console.log('✅ Found admin:', {
      email: admin.email,
      fullName: admin.fullName,
      role: admin.role
    });

    // New password
    const newPassword = 'TamilNadu@123';
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Update the password
    admin.passwordHash = passwordHash;
    admin.updatedAt = new Date();
    await admin.save();

    console.log('✅ Password updated successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('Email:', admin.email);
    console.log('Password:', newPassword);
    console.log('\n⚠️  Please change this password after first login!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await adminDbConnection.close();
    console.log('👋 Connection closed');
    process.exit(0);
  }
}

updatePassword();
