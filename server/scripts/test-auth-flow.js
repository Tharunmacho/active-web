import mongoose from 'mongoose';
import WebUser from '../models/WebUser.js';
import WebUserProfile from '../models/WebUserProfile.js';
import bcrypt from 'bcryptjs';

const MONGODB_URI = 'mongodb+srv://activapp2025_db_user:o6xFHfqzLXM6LUaa@cluster1.gf7usct.mongodb.net/activ-db';

async function testAuthFlow() {
    try {
        console.log('1. Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const db = mongoose.connection.db;

        // Test 1: Check web auth collection raw data
        console.log('2. Checking web auth collection (raw)...');
        const authUsers = await db.collection('web auth').find({}).toArray();
        console.log(`✅ Found ${authUsers.length} users in web auth collection`);
        authUsers.forEach(user => {
            console.log(`   - ${user.email}`);
            console.log(`     Has password: ${user.password ? 'Yes (length: ' + user.password.length + ')' : 'No'}`);
            console.log(`     IsActive: ${user.isActive}`);
        });

        // Test 2: Check web users collection raw data
        console.log('\n3. Checking web users collection (raw)...');
        const profileUsers = await db.collection('web users').find({}).toArray();
        console.log(`✅ Found ${profileUsers.length} users in web users collection`);
        profileUsers.forEach(user => {
            console.log(`   - ${user.email} (${user.fullName})`);
        });

        // Test 3: Test WebUser model
        console.log('\n4. Testing WebUser model...');
        const testEmail = 'parvathi@gmail.com';
        const authUser = await WebUser.findOne({ email: testEmail }).select('+password');
        
        if (!authUser) {
            console.log(`❌ Could not find user with email: ${testEmail} using WebUser model`);
            console.log('   This means the model is not correctly configured!');
            process.exit(1);
        }
        
        console.log(`✅ Found user via WebUser model`);
        console.log(`   Email: ${authUser.email}`);
        console.log(`   Password hash: ${authUser.password ? authUser.password.substring(0, 20) + '...' : 'MISSING'}`);
        console.log(`   IsActive: ${authUser.isActive}`);

        // Test 4: Test password comparison
        console.log('\n5. Testing password comparison...');
        const testPassword = 'test123'; // Replace with actual password
        
        if (!authUser.password) {
            console.log('❌ Password is missing from auth user!');
            process.exit(1);
        }

        const isMatch = await authUser.comparePassword(testPassword);
        console.log(`   Testing password "${testPassword}": ${isMatch ? '✅ MATCH' : '❌ NO MATCH'}`);

        if (!isMatch) {
            console.log('\n   Trying to find what the original password might be...');
            console.log('   The password hash in database is:', authUser.password.substring(0, 30) + '...');
            console.log('   This looks like a bcrypt hash:', authUser.password.startsWith('$2a$') || authUser.password.startsWith('$2b$'));
        }

        // Test 5: Test WebUserProfile model
        console.log('\n6. Testing WebUserProfile model...');
        const userProfile = await WebUserProfile.findOne({ userId: authUser._id });
        
        if (!userProfile) {
            console.log(`❌ Could not find profile for userId: ${authUser._id}`);
            console.log('   Trying to find by email...');
            const profileByEmail = await WebUserProfile.findOne({ email: testEmail });
            if (profileByEmail) {
                console.log(`✅ Found profile by email!`);
                console.log(`   UserID in profile: ${profileByEmail.userId}`);
                console.log(`   UserID in auth: ${authUser._id}`);
                console.log(`   Do they match? ${profileByEmail.userId.toString() === authUser._id.toString()}`);
            } else {
                console.log(`❌ No profile found at all for ${testEmail}`);
            }
        } else {
            console.log(`✅ Found profile via WebUserProfile model`);
            console.log(`   Email: ${userProfile.email}`);
            console.log(`   Name: ${userProfile.fullName}`);
            console.log(`   Phone: ${userProfile.phoneNumber}`);
            console.log(`   Role: ${userProfile.role}`);
        }

        // Test 6: Simulate login flow
        console.log('\n7. Simulating complete login flow...');
        console.log(`   Step 1: Find user by email in web auth...`);
        const loginUser = await WebUser.findOne({ email: testEmail }).select('+password');
        if (!loginUser) {
            console.log('   ❌ Login failed: User not found');
            process.exit(1);
        }
        console.log('   ✅ User found in web auth');

        console.log(`   Step 2: Check if user is active...`);
        if (!loginUser.isActive) {
            console.log('   ❌ Login failed: User is not active');
            process.exit(1);
        }
        console.log('   ✅ User is active');

        console.log(`   Step 3: Compare password...`);
        const passwordMatch = await loginUser.comparePassword(testPassword);
        if (!passwordMatch) {
            console.log('   ❌ Login failed: Password does not match');
            console.log('   Note: You need to use the correct password for this test');
        } else {
            console.log('   ✅ Password matches');
        }

        console.log(`   Step 4: Get user profile from web users...`);
        const loginProfile = await WebUserProfile.findOne({ userId: loginUser._id });
        if (!loginProfile) {
            console.log('   ❌ Login failed: Profile not found');
            process.exit(1);
        }
        console.log('   ✅ Profile found');
        console.log(`   Complete user data:`);
        console.log(`      ID: ${loginUser._id}`);
        console.log(`      Email: ${loginProfile.email}`);
        console.log(`      Name: ${loginProfile.fullName}`);
        console.log(`      Phone: ${loginProfile.phoneNumber}`);
        console.log(`      Role: ${loginProfile.role}`);

        console.log('\n✅ All tests completed!');
        console.log('\nSummary:');
        console.log(`- Web Auth collection: ${authUsers.length} users`);
        console.log(`- Web Users collection: ${profileUsers.length} profiles`);
        console.log(`- Models working: ${authUser && userProfile ? 'Yes' : 'No'}`);
        console.log(`- Password verification: ${passwordMatch ? 'Working' : 'Failed (check password)'}`);

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error occurred:');
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

testAuthFlow();
