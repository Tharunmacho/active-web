import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://activapp2025_db_user:o6xFHfqzLXM6LUaa@cluster1.gf7usct.mongodb.net/activ-db?retryWrites=true&w=majority&appName=Cluster1';

const checkAllData = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const db = mongoose.connection.db;

        // Get all collections
        const collections = await db.listCollections().toArray();
        
        console.log('📊 ALL COLLECTIONS AND THEIR DATA:\n');
        console.log('='.repeat(60));

        for (const collectionInfo of collections) {
            const collectionName = collectionInfo.name;
            const collection = db.collection(collectionName);
            const count = await collection.countDocuments();
            
            console.log(`\n📁 ${collectionName}: ${count} documents`);
            
            if (count > 0) {
                const docs = await collection.find().limit(3).toArray();
                docs.forEach((doc, index) => {
                    console.log(`\n   Document ${index + 1}:`);
                    console.log(`   ${JSON.stringify(doc, null, 2).split('\n').join('\n   ')}`);
                });
                if (count > 3) {
                    console.log(`   ... and ${count - 3} more documents`);
                }
            }
            console.log('-'.repeat(60));
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Disconnected from MongoDB');
        process.exit(0);
    }
};

checkAllData();
