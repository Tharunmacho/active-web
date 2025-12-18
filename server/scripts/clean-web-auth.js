import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://activapp2025_db_user:o6xFHfqzLXM6LUaa@cluster1.gf7usct.mongodb.net/activ-db';

async function cleanWebAuthCollection() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        
        // Get all documents from web auth collection
        const webAuthDocs = await db.collection('web auth').find({}).toArray();
        
        console.log(`\nFound ${webAuthDocs.length} documents in web auth collection`);
        
        // For each document, keep only email, password, isActive, and timestamps
        for (const doc of webAuthDocs) {
            const cleanedDoc = {
                email: doc.email,
                password: doc.password,
                isActive: doc.isActive !== undefined ? doc.isActive : true,
                createdAt: doc.createdAt,
                updatedAt: doc.updatedAt,
                __v: doc.__v
            };
            
            // Update the document to remove all other fields
            await db.collection('web auth').replaceOne(
                { _id: doc._id },
                cleanedDoc
            );
            
            console.log(`✓ Cleaned document for: ${doc.email}`);
        }
        
        console.log('\n✓ Web auth collection cleaned successfully!');
        console.log('Now it only contains: email, password, isActive');
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

cleanWebAuthCollection();
