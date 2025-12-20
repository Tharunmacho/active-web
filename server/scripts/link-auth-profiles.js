import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://activapp2025_db_user:o6xFHfqzLXM6LUaa@cluster1.gf7usct.mongodb.net/activ-db';

async function linkAuthAndProfiles() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB\n');

        const db = mongoose.connection.db;

        // Get all users from web auth
        const authUsers = await db.collection('web auth').find({}).toArray();
        console.log(`Found ${authUsers.length} users in web auth collection\n`);

        // Link each auth user to their profile
        for (const authUser of authUsers) {
            const profile = await db.collection('web users').findOne({ email: authUser.email });
            
            if (profile) {
                if (!profile.userId) {
                    // Add userId to the profile
                    await db.collection('web users').updateOne(
                        { _id: profile._id },
                        { $set: { userId: authUser._id } }
                    );
                    console.log(`✅ Linked profile for ${authUser.email}`);
                    console.log(`   Auth ID: ${authUser._id}`);
                    console.log(`   Profile ID: ${profile._id}`);
                } else {
                    console.log(`⚠️  Profile for ${authUser.email} already has userId: ${profile.userId}`);
                }
            } else {
                console.log(`❌ No profile found for ${authUser.email} - Creating one...`);
                
                // Create a basic profile for this auth user
                await db.collection('web users').insertOne({
                    userId: authUser._id,
                    email: authUser.email,
                    fullName: authUser.email.split('@')[0], // Use email prefix as name
                    phoneNumber: '',
                    state: '',
                    district: '',
                    block: '',
                    city: '',
                    role: 'member',
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                console.log(`✅ Created profile for ${authUser.email}`);
            }
        }

        console.log('\n✅ All profiles linked successfully!');
        
        // Verify the links
        console.log('\nVerifying links...');
        for (const authUser of authUsers) {
            const profile = await db.collection('web users').findOne({ userId: authUser._id });
            if (profile) {
                console.log(`✅ ${authUser.email} -> ${profile.fullName}`);
            } else {
                console.log(`❌ ${authUser.email} -> NO PROFILE FOUND!`);
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

linkAuthAndProfiles();
