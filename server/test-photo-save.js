import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testPhotoSave = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const userId = '6944c77df5d97bf7a6a29baf';
        
        // Test direct MongoDB query
        const db = mongoose.connection.db;
        const collection = db.collection('web users');
        
        console.log('\n📊 Current data in web users collection:');
        const user = await collection.findOne({ userId: new mongoose.Types.ObjectId(userId) });
        console.log(user ? {
            userId: user.userId,
            email: user.email,
            fullName: user.fullName,
            hasProfilePhoto: !!user.profilePhoto,
            photoLength: user.profilePhoto?.length || 0,
            allFields: Object.keys(user)
        } : 'Not found');

        // Try to update with a test photo
        const testPhoto = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
        
        console.log('\n📸 Attempting to save test photo...');
        const updateResult = await collection.updateOne(
            { userId: new mongoose.Types.ObjectId(userId) },
            { 
                $set: { 
                    profilePhoto: testPhoto,
                    fullName: 'aathiff'
                } 
            }
        );
        console.log('Update result:', updateResult);

        // Verify save
        const updatedUser = await collection.findOne({ userId: new mongoose.Types.ObjectId(userId) });
        console.log('\n📊 After update:');
        console.log({
            fullName: updatedUser.fullName,
            hasProfilePhoto: !!updatedUser.profilePhoto,
            photoLength: updatedUser.profilePhoto?.length || 0
        });

        await mongoose.disconnect();
        console.log('\n✅ Done');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

testPhotoSave();
