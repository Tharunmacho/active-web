import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://activapp2025_db_user:o6xFHfqzLXM6LUaa@cluster1.gf7usct.mongodb.net/activ-db?retryWrites=true&w=majority&appName=Cluster1';

const dropOldCollections = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const db = mongoose.connection.db;

        // Collections to drop
        const collectionsToDelete = [
            'additional form for business 2',
            'additional form for bussiness 2',
            'additional form for declaration 1',
            'additional form for declaration 4',
            'additional form for financial 3',
            'additional form for personal information 1',
            'additional form for personal information 4',
            'additional forms 1 to 4',
            'business_profiles',
            'business_profiles_accounts'
        ];

        console.log('📋 Collections to drop:');
        collectionsToDelete.forEach(col => console.log(`   - ${col}`));
        console.log('');

        // Get all existing collections
        const collections = await db.listCollections().toArray();
        const existingCollectionNames = collections.map(col => col.name);

        console.log('🗑️  Dropping collections...\n');

        for (const collectionName of collectionsToDelete) {
            if (existingCollectionNames.includes(collectionName)) {
                try {
                    await db.dropCollection(collectionName);
                    console.log(`✅ Dropped: ${collectionName}`);
                } catch (error) {
                    console.log(`⚠️  Could not drop ${collectionName}: ${error.message}`);
                }
            } else {
                console.log(`⏭️  Skipped (doesn't exist): ${collectionName}`);
            }
        }

        console.log('\n✨ Cleanup complete!');
        console.log('\n📊 Remaining collections:');
        const remainingCollections = await db.listCollections().toArray();
        remainingCollections.forEach(col => console.log(`   - ${col.name}`));

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Disconnected from MongoDB');
        process.exit(0);
    }
};

dropOldCollections();
