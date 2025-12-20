require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');

async function checkArniAdmin() {
  try {
    const adminsDbUri = process.env.MONGODB_ADMINS_URI;
    const adminsConn = await mongoose.createConnection(adminsDbUri).asPromise();
    console.log('✅ Connected to adminsdb');
    
    const BlockAdmin = adminsConn.model('BlockAdmin', new mongoose.Schema({}, { strict: false, collection: 'blockadmins' }));
    
    const admin = await BlockAdmin.findOne({ email: 'block.arni.thiruvannamalai.tamil.nadu@activ.com' });
    
    if (admin) {
      console.log('\n📋 Arni Block Admin:');
      console.log('Email:', admin.email);
      console.log('Meta District:', admin.meta?.district);
      console.log('Meta District LC:', admin.meta?.districtLc);
      console.log('Meta Block:', admin.meta?.block);
      console.log('Meta Block LC:', admin.meta?.blockLc);
    } else {
      console.log('❌ Admin not found');
    }
    
    await adminsConn.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkArniAdmin();
