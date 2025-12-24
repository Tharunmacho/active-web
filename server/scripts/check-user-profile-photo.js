import mongoose from 'mongoose';
import WebUserProfile from '../src/shared/models/WebUserProfile.js';
import dotenv from 'dotenv';

dotenv.config();

const checkUserProfile = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const email = 'vinoth@gmail.com';
        console.log(`\n🔍 Looking for user profile: ${email}`);

        const profile = await WebUserProfile.findOne({ email });

        if (!profile) {
            console.log('❌ Profile not found');
            process.exit(1);
        }

        console.log('\n📋 User Profile Details:');
        console.log('  User ID:', profile.userId);
        console.log('  Full Name:', profile.fullName);
        console.log('  Email:', profile.email);
        console.log('  Phone:', profile.phoneNumber);
        console.log('  Profile Photo:', profile.profilePhoto ? `${profile.profilePhoto.substring(0, 50)}...` : 'NOT SET');
        console.log('  Role:', profile.role);

        if (!profile.profilePhoto) {
            console.log('\n⚠️  NO PROFILE PHOTO STORED IN DATABASE');
            console.log('   User needs to upload a profile photo first!');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

checkUserProfile();
