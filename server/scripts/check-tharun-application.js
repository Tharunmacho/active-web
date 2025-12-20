import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

async function checkApplication() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    
    // Find user - search for tharun
    const user = await db.collection('webusers').findOne({ 
      email: { $regex: 'tharun', $options: 'i' }
    });
    
    if (!user) {
      console.log('❌ User not found with name tharun');
      // Try to find the latest application
      const latestApp = await db.collection('applications').findOne(
        {},
        { sort: { createdAt: -1 } }
      );
      if (latestApp) {
        console.log('\n📋 Latest Application:');
        console.log(`   Application ID: ${latestApp.applicationId}`);
        console.log(`   User ID: ${latestApp.userId}`);
        console.log(`   Member Type: ${latestApp.memberType}`);
        console.log(`   Email: ${latestApp.memberEmail}`);
        
        // Find the user by ID
        const foundUser = await db.collection('webusers').findOne({ 
          _id: latestApp.userId 
        });
        if (foundUser) {
          console.log(`\n👤 User Found by ID:`);
          console.log(`   Email: ${foundUser.email}`);
          
          // Now check business form
          const businessForm = await db.collection('businessforms').findOne({ 
            userId: latestApp.userId.toString() 
          });
          
          if (businessForm) {
            console.log('\n🏢 Business Form:');
            console.log(`   Doing Business: ${businessForm.doingBusiness}`);
            console.log(`   Organization: ${businessForm.organization || 'Not set'}`);
          }
          
          console.log('\n🔍 Issue Analysis:');
          console.log(`   Application memberType: ${latestApp.memberType}`);
          console.log(`   Business doing business: ${businessForm?.doingBusiness || 'Not found'}`);
          
          if (latestApp.memberType === 'business') {
            console.log('   ✅ Database is CORRECT - memberType is "business"');
            console.log('   ⚠️ Issue is in FRONTEND - not displaying memberType correctly');
          }
          return;
        }
      }
      if (!user) return;
    }
    
    console.log('👤 User Found:');
    console.log(`   Email: ${user.email}`);
    console.log(`   ID: ${user._id}`);
    
    // Find application
    const application = await db.collection('applications').findOne({ 
      userId: user._id 
    });
    
    if (!application) {
      console.log('\n❌ Application not found');
      return;
    }
    
    console.log('\n📋 Application Details:');
    console.log(`   Application ID: ${application.applicationId}`);
    console.log(`   Member Type: ${application.memberType}`);
    console.log(`   Status: ${application.status}`);
    console.log(`   Payment Status: ${application.paymentStatus || 'Not set'}`);
    
    if (application.paymentDetails) {
      console.log('\n💳 Payment Details:');
      console.log(`   Plan Type: ${application.paymentDetails.planType || 'Not set'}`);
      console.log(`   Plan Amount: ${application.paymentDetails.planAmount || 'Not set'}`);
      console.log(`   Total Amount: ${application.paymentDetails.totalAmount || 'Not set'}`);
    } else {
      console.log('\n💳 Payment Details: None');
    }
    
    // Find business form
    const businessForm = await db.collection('businessforms').findOne({ 
      userId: user._id.toString() 
    });
    
    if (businessForm) {
      console.log('\n🏢 Business Form:');
      console.log(`   Doing Business: ${businessForm.doingBusiness}`);
      console.log(`   Organization: ${businessForm.organization || 'Not set'}`);
      console.log(`   Constitution: ${businessForm.constitution || 'Not set'}`);
      console.log(`   Business Year: ${businessForm.businessYear || 'Not set'}`);
      console.log(`   Employees: ${businessForm.employees || 'Not set'}`);
    } else {
      console.log('\n🏢 Business Form: Not found');
    }
    
    console.log('\n🔍 Issue Analysis:');
    if (businessForm?.doingBusiness === 'yes' && application.memberType === 'aspirant') {
      console.log('   ⚠️ MISMATCH FOUND!');
      console.log('   - Business form says: "yes" (should be business member)');
      console.log('   - Application says: "aspirant"');
      console.log('   - FIX NEEDED: Update application.memberType to "business"');
    } else if (businessForm?.doingBusiness === 'yes' && application.memberType === 'business') {
      console.log('   ✅ Correct: Business member');
    } else if (businessForm?.doingBusiness === 'no' && application.memberType === 'aspirant') {
      console.log('   ✅ Correct: Aspirant member');
    } else {
      console.log('   ⚠️ Data inconsistency detected');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

checkApplication();
