/**
 * Script to explore the adminsdb database structure
 * Run: node server/scripts/explore-adminsdb.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Use correct credentials from .env
const ADMINS_DB_URI = process.env.MONGODB_URI?.replace('/activ-db', '/adminsdb') || 
  'mongodb+srv://activapp2025_db_user:o6xFHfqzLXM6LUaa@cluster1.gf7usct.mongodb.net/adminsdb?retryWrites=true&w=majority';

async function exploreAdminsDb() {
  try {
    console.log('🔌 Connecting to adminsdb...\n');
    await mongoose.connect(ADMINS_DB_URI);
    console.log('✅ Connected to adminsdb\n');

    const db = mongoose.connection.db;
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('📋 Collections found:', collections.map(c => c.name).join(', '));
    console.log('');

    // Explore each collection
    for (const collectionInfo of collections) {
      const collName = collectionInfo.name;
      const collection = db.collection(collName);
      
      const count = await collection.countDocuments();
      console.log(`\n📁 Collection: ${collName}`);
      console.log(`   Document count: ${count}`);
      
      if (count > 0) {
        // Get one sample document
        const sample = await collection.findOne();
        console.log('   Sample document:');
        console.log('   ' + JSON.stringify(sample, null, 2).split('\n').join('\n   '));
        
        // List all documents if count is small
        if (count <= 10) {
          const allDocs = await collection.find({}).toArray();
          console.log(`\n   All documents in ${collName}:`);
          allDocs.forEach((doc, idx) => {
            console.log(`   ${idx + 1}. Email: ${doc.email || doc.Email || 'N/A'}, Name: ${doc.fullName || doc.name || doc.Name || 'N/A'}`);
            if (doc.state || doc.State) console.log(`      Location: ${doc.state || doc.State}${doc.district || doc.District ? ' > ' + (doc.district || doc.District) : ''}${doc.block || doc.Block ? ' > ' + (doc.block || doc.Block) : ''}`);
          });
        }
      }
      console.log('   ' + '─'.repeat(60));
    }

    console.log('\n✅ Exploration complete!\n');

    mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error exploring adminsdb:', error.message);
    mongoose.connection.close();
    process.exit(1);
  }
}

// Run the exploration
exploreAdminsDb();
