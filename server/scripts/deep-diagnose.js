import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://activapp2025_db_user:o6xFHfqzLXM6LUaa@cluster1.gf7usct.mongodb.net/activ-db?retryWrites=true&w=majority';

async function deepDiagnose() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to activ-db\n');

    // Get the application
    const count = await mongoose.connection.db.collection('applications').countDocuments();
    console.log(`Total documents in applications collection: ${count}\n`);
    
    const app = await mongoose.connection.db.collection('applications').findOne({});

    if (!app) {
      console.log('❌ No application found');
      return;
    }

    console.log('APPLICATION DATA:\n');
    console.log(`State: "${app.state}"`);
    console.log(`  Length: ${app.state?.length}`);
    console.log(`  Char codes: [${Array.from(app.state || '').map(c => c.charCodeAt(0)).join(', ')}]`);
    console.log('');
    
    console.log(`District: "${app.district}"`);
    console.log(`  Length: ${app.district?.length}`);
    console.log(`  Char codes: [${Array.from(app.district || '').map(c => c.charCodeAt(0)).join(', ')}]`);
    console.log('');
    
    console.log(`Block: "${app.block}"`);
    console.log(`  Length: ${app.block?.length}`);
    console.log(`  Char codes: [${Array.from(app.block || '').map(c => c.charCodeAt(0)).join(', ')}]`);
    console.log('');
    
    console.log(`Status: "${app.status}"`);
    console.log(`  Length: ${app.status?.length}`);
    console.log('');

    console.log('\n' + '='.repeat(60));
    console.log('ADMIN QUERY VALUES:\n');
    
    const adminState = 'Tamil Nadu';
    const adminDistrict = 'Thiruvannamalai';
    const adminBlock = 'Thandrampet';
    
    console.log(`State: "${adminState}"`);
    console.log(`  Length: ${adminState.length}`);
    console.log(`  Char codes: [${Array.from(adminState).map(c => c.charCodeAt(0)).join(', ')}]`);
    console.log(`  MATCH: ${app.state === adminState ? '✅' : '❌'}`);
    console.log('');
    
    console.log(`District: "${adminDistrict}"`);
    console.log(`  Length: ${adminDistrict.length}`);
    console.log(`  Char codes: [${Array.from(adminDistrict).map(c => c.charCodeAt(0)).join(', ')}]`);
    console.log(`  MATCH: ${app.district === adminDistrict ? '✅' : '❌'}`);
    console.log('');
    
    console.log(`Block: "${adminBlock}"`);
    console.log(`  Length: ${adminBlock.length}`);
    console.log(`  Char codes: [${Array.from(adminBlock).map(c => c.charCodeAt(0)).join(', ')}]`);
    console.log(`  MATCH: ${app.block === adminBlock ? '✅' : '❌'}`);
    console.log('');

    console.log('\n' + '='.repeat(60));
    console.log('TESTING QUERY:\n');

    const query = {
      state: adminState,
      district: adminDistrict,
      block: adminBlock,
      status: 'pending_block_approval'
    };

    const result = await mongoose.connection.db.collection('applications').findOne(query);
    console.log(`Query result: ${result ? '✅ FOUND' : '❌ NOT FOUND'}`);
    
    if (!result) {
      console.log('\n🔍 Trying partial matches:');
      
      const stateMatch = await mongoose.connection.db.collection('applications').findOne({ state: adminState });
      console.log(`State only: ${stateMatch ? '✅' : '❌'}`);
      
      const districtMatch = await mongoose.connection.db.collection('applications').findOne({ district: adminDistrict });
      console.log(`District only: ${districtMatch ? '✅' : '❌'}`);
      
      const blockMatch = await mongoose.connection.db.collection('applications').findOne({ block: adminBlock });
      console.log(`Block only: ${blockMatch ? '✅' : '❌'}`);
      
      const statusMatch = await mongoose.connection.db.collection('applications').findOne({ status: 'pending_block_approval' });
      console.log(`Status only: ${statusMatch ? '✅' : '❌'}`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Done');
    process.exit(0);
  }
}

deepDiagnose();
