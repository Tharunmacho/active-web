import mongoose from 'mongoose';
import dotenv from 'dotenv';
import WebUser from './src/shared/models/WebUser.js';
import WebUserProfile from './src/shared/models/WebUserProfile.js';
import PersonalForm from './src/shared/models/PersonalForm.js';

dotenv.config();

const fixUserData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const userId = '6944c77df5d97bf7a6a29baf';
        
        // Fix WebUser fullName
        const webUser = await WebUser.findById(userId);
        if (webUser && !webUser.fullName) {
            webUser.fullName = 'aathif';
            await webUser.save();
            console.log('✅ Updated WebUser fullName to: aathif');
        }

        // Check PersonalForm for name
        const personalForm = await PersonalForm.findOne({ userId: userId });
        if (personalForm) {
            console.log('📝 PersonalForm name:', personalForm.name);
            
            // Update WebUser from PersonalForm if needed
            if (personalForm.name && webUser) {
                webUser.fullName = personalForm.name;
                await webUser.save();
                console.log(`✅ Updated WebUser fullName from PersonalForm:${personalForm.name}`);
            }
        }

        // Check WebUserProfile
        const webUserProfile = await WebUserProfile.findOne({ userId: userId });
        if (webUserProfile) {
            console.log('\n📸 Current WebUserProfile:');
            console.log('  fullName:', webUserProfile.fullName);
            console.log('  profilePhoto exists:', !!webUserProfile.profilePhoto);
            console.log('  profilePhoto length:', webUserProfile.profilePhoto?.length || 0);
        }

        await mongoose.disconnect();
        console.log('\n✅ Done');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

fixUserData();
