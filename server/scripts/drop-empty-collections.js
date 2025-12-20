import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://activapp2025_db_user:o6xFHfqzLXM6LUaa@cluster1.gf7usct.mongodb.net/activ-db';

async function dropEmptyCollections() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();

        console.log('\nChecking all collections...\n');

        for (const collection of collections) {
            const collectionName = collection.name;
            const count = await db.collection(collectionName).countDocuments();

            console.log(`${collectionName}: ${count} documents`);

            if (count === 0) {
                console.log(`  → Dropping empty collection: ${collectionName}`);
                await db.dropCollection(collectionName);
                console.log(`  ✓ Dropped ${collectionName}\n`);
            }
        }

        console.log('\n✓ Cleanup complete!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

dropEmptyCollections();
