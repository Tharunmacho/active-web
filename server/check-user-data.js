import mongoose from 'mongoose';
import dotenv from 'dotenv';
import WebUser from './src/shared/models/WebUser.js';
import WebUserProfile from './src/shared/models/WebUserProfile.js';

dotenv.config();

const checkUserData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const userId = '6944c77df5d97bf7a6a29baf';
        
        console.log('\n📊 Checking WebUser:');
        const webUser = await WebUser.findById(userId);
        console.log(webUser ? {
            id: webUser._id,
            email: webUser.email,
            fullName: webUser.fullName,
            phoneNumber: webUser.phoneNumber
        } : 'Not found');

        console.log('\n📊 Checking WebUserProfile:');
        const webUserProfile = await WebUserProfile.findOne({ userId: userId });
        console.log(webUserProfile ? {
            userId: webUserProfile.userId,
            fullName: webUserProfile.fullName,
            hasPhoto: !!webUserProfile.profilePhoto,
            photoLength: webUserProfile.profilePhoto?.length || 0
        } : 'Not found');

        await mongoose.disconnect();
        console.log('\n✅ Done');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

checkUserData();
