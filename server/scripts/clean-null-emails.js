import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://activapp2025_db_user:o6xFHfqzLXM6LUaa@cluster1.gf7usct.mongodb.net/activ-db?retryWrites=true&w=majority&appName=Cluster1';

const cleanNullEmails = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const db = mongoose.connection.db;
        const webUsersCollection = db.collection('web users');

        // Find documents with null email
        const nullEmailDocs = await webUsersCollection.find({ email: null }).toArray();
        console.log(`📊 Found ${nullEmailDocs.length} documents with null email`);

        if (nullEmailDocs.length > 0) {
            console.log('\nDocuments with null email:');
            nullEmailDocs.forEach(doc => {
                console.log(`  - ID: ${doc._id}, Name: ${doc.fullName || 'N/A'}`);
            });

            // Delete documents with null email
            const result = await webUsersCollection.deleteMany({ email: null });
            console.log(`\n✅ Deleted ${result.deletedCount} documents with null email`);
        } else {
            console.log('✅ No documents with null email found');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Disconnected from MongoDB');
        process.exit(0);
    }
};

cleanNullEmails();
