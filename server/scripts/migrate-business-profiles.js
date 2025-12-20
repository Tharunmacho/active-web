import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

// Define schemas
const businessProfileSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  businessName: String,
  description: String,
  businessType: String,
  mobileNumber: String,
  area: String,
  location: String,
  logo: String,
  status: String
}, { collection: 'business_profiles_accounts' });

const companySchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  businessName: String,
  description: String,
  businessType: String,
  mobileNumber: String,
  area: String,
  location: String,
  logo: String,
  status: String,
  isActive: Boolean
}, { collection: 'companies' });

const BusinessProfile = mongoose.model('BusinessProfile', businessProfileSchema);
const Company = mongoose.model('Company', companySchema);

// Migration function
const migrateBusinessProfiles = async () => {
  try {
    console.log('🔄 Starting migration from business_profiles_accounts to companies...');
    
    // Get all business profiles
    const businessProfiles = await BusinessProfile.find({});
    console.log(`📊 Found ${businessProfiles.length} business profiles to migrate`);
    
    let migratedCount = 0;
    let skippedCount = 0;
    
    for (const profile of businessProfiles) {
      // Check if this user already has this company in the new collection
      const existingCompany = await Company.findOne({
        userId: profile.userId,
        businessName: profile.businessName
      });
      
      if (existingCompany) {
        console.log(`⏭️  Skipping "${profile.businessName}" - already exists in companies collection`);
        skippedCount++;
        continue;
      }
      
      // Check if this user has any companies
      const userCompanies = await Company.find({ userId: profile.userId });
      const isFirstCompany = userCompanies.length === 0;
      
      // Create new company record
      await Company.create({
        userId: profile.userId,
        businessName: profile.businessName,
        description: profile.description,
        businessType: profile.businessType,
        mobileNumber: profile.mobileNumber,
        area: profile.area,
        location: profile.location,
        logo: profile.logo,
        status: profile.status || 'pending',
        isActive: isFirstCompany // Set first company as active
      });
      
      console.log(`✅ Migrated "${profile.businessName}" ${isFirstCompany ? '(set as active)' : ''}`);
      migratedCount++;
    }
    
    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Migrated: ${migratedCount}`);
    console.log(`   ⏭️  Skipped: ${skippedCount}`);
    console.log(`   📋 Total: ${businessProfiles.length}`);
    console.log('\n✨ Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration error:', error);
    throw error;
  }
};

// Run migration
const run = async () => {
  try {
    await connectDB();
    await migrateBusinessProfiles();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

run();
