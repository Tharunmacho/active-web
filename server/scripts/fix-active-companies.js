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

// Define company schema
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

const Company = mongoose.model('Company', companySchema);

// Fix active companies
const fixActiveCompanies = async () => {
  try {
    console.log('🔄 Checking for users without active companies...');
    
    // Get all unique user IDs
    const allCompanies = await Company.find({});
    const userIds = [...new Set(allCompanies.map(c => c.userId.toString()))];
    
    console.log(`📊 Found ${userIds.length} users with companies`);
    
    let fixedCount = 0;
    
    for (const userId of userIds) {
      // Check if user has an active company
      const activeCompany = await Company.findOne({ 
        userId: new mongoose.Types.ObjectId(userId), 
        isActive: true 
      });
      
      if (!activeCompany) {
        // Get first company for this user
        const firstCompany = await Company.findOne({ 
          userId: new mongoose.Types.ObjectId(userId) 
        }).sort({ createdAt: 1 });
        
        if (firstCompany) {
          // Set it as active
          firstCompany.isActive = true;
          await firstCompany.save();
          
          console.log(`✅ Set "${firstCompany.businessName}" as active for user ${userId}`);
          fixedCount++;
        }
      } else {
        console.log(`✓ User ${userId} already has active company: "${activeCompany.businessName}"`);
      }
    }
    
    console.log(`\n📊 Fixed ${fixedCount} users without active companies`);
    console.log('✨ Done!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
};

// Run
const run = async () => {
  try {
    await connectDB();
    await fixActiveCompanies();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

run();
