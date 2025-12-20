import mongoose from 'mongoose';
import WebUser from '../models/WebUser.js';
import WebUserProfile from '../models/WebUserProfile.js';

const MONGODB_URI = 'mongodb+srv://activapp2025_db_user:o6xFHfqzLXM6LUaa@cluster1.gf7usct.mongodb.net/activ-db';

async function testLogin() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB\n');

        // Test 1: Check if web auth collection has data
        const authUsers = await mongoose.connection.db.collection('web auth').find({}).toArray();
        console.log(`Found ${authUsers.length} users in web auth collection:`);
        authUsers.forEach(user => {
            console.log(`  - ${user.email}`);
        });

        // Test 2: Check if web users collection has data
        const profileUsers = await mongoose.connection.db.collection('web users').find({}).toArray();
        console.log(`\nFound ${profileUsers.length} users in web users collection:`);
        profileUsers.forEach(user => {
            console.log(`  - ${user.email} (${user.fullName})`);
        });

        // Test 3: Try to find a user using the model
        const testUser = await WebUser.findOne({ email: 'parvathi@gmail.com' }).select('+password');
        if (testUser) {
            console.log('\n✓ Found user via WebUser model:');
            console.log(`  Email: ${testUser.email}`);
            console.log(`  Has password: ${testUser.password ? 'Yes' : 'No'}`);
            console.log(`  IsActive: ${testUser.isActive}`);
        } else {
            console.log('\n✗ Could not find user via WebUser model');
        }

        // Test 4: Try to find profile
        const testProfile = await WebUserProfile.findOne({ email: 'parvathi@gmail.com' });
        if (testProfile) {
            console.log('\n✓ Found profile via WebUserProfile model:');
            console.log(`  Email: ${testProfile.email}`);
            console.log(`  Name: ${testProfile.fullName}`);
            console.log(`  Phone: ${testProfile.phoneNumber}`);
        } else {
            console.log('\n✗ Could not find profile via WebUserProfile model');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

testLogin();
