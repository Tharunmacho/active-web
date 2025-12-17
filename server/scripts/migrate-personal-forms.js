import mongoose from 'mongoose';
import WebUser from '../models/WebUser.js';
import PersonalForm from '../models/PersonalForm.js';

const MONGO_URI = 'mongodb+srv://activapp2025_db_user:o6xFHfqzLXM6LUaa@cluster1.gf7usct.mongodb.net/activ-db?retryWrites=true&w=majority&appName=Cluster1';

const migratePersonalForms = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find all users
    const users = await WebUser.find({});
    console.log(`📊 Found ${users.length} users in web auth collection\n`);

    for (const user of users) {
      // Check if personal form already exists
      const existingForm = await PersonalForm.findOne({ userId: user._id });
      
      if (existingForm) {
        console.log(`⏭️  Personal form already exists for ${user.email}`);
        continue;
      }

      // Create personal form from user data
      const personalForm = await PersonalForm.create({
        userId: user._id,
        name: user.fullName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        state: user.state || '',
        district: user.district || '',
        block: user.block || '',
        city: user.city || '',
        religion: '',
        socialCategory: '',
        isLocked: false
      });

      console.log(`✅ Created personal form for ${user.email}`);
      console.log(`   - Name: ${personalForm.name}`);
      console.log(`   - Phone: ${personalForm.phoneNumber}`);
      console.log(`   - Location: ${personalForm.state}, ${personalForm.district}, ${personalForm.block}\n`);
    }

    console.log('✨ Migration completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

migratePersonalForms();
