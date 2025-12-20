import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://activapp2025_db_user:o6xFHfqzLXM6LUaa@cluster1.gf7usct.mongodb.net/activ-db?retryWrites=true&w=majority';

async function fixNow() {
  try {
    console.log('🔧 Fixing the district field NOW...\n');

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected\n');

    // Update directly
    const result = await mongoose.connection.db.collection('applications').updateMany(
      { district: 'Tiruvannamalai' },  // Find documents with wrong spelling
      { $set: { district: 'Thiruvannamalai' } }  // Fix to correct spelling (with 'h')
    );

    console.log(`📊 Modified ${result.modifiedCount} document(s)`);
    console.log(`📊 Matched ${result.matchedCount} document(s)\n`);

    // Verify
    const app = await mongoose.connection.db.collection('applications').findOne({});
    console.log(`✅ Verification - District is now: "${app.district}"`);
    console.log(`   Length: ${app.district.length}`);
    console.log(`   Starts with: ${app.district.substring(0, 5)}`);

    // Test query
    const testResult = await mongoose.connection.db.collection('applications').findOne({
      state: 'Tamil Nadu',
      district: 'Thiruvannamalai',
      block: 'Thandrampet',
      status: 'pending_block_approval'
    });

    console.log(`\n🎯 Query test: ${testResult ? '✅ SUCCESS! Application found!' : '❌ Still not found'}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Done');
    process.exit(0);
  }
}

fixNow();
