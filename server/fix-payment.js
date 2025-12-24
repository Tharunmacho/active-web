import Application from './src/shared/models/Application.js';
import mongoose from 'mongoose';

async function updatePaymentStatus() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb+srv://activapp2025_db_user:o6xFHfqzLXM6LUaa@cluster1.gf7usct.mongodb.net/activ-db?retryWrites=true&w=majority&appName=Cluster1');
    console.log('✅ Connected to MongoDB');

    // Find the application
    const app = await Application.findOne({ applicationId: 'APP-1766511465664-58DLCHSIL' });
    
    if (!app) {
      console.log('❌ Application not found');
      process.exit(1);
    }

    console.log('📋 Current application:');
    console.log('  - Application ID:', app.applicationId);
    console.log('  - Payment Status:', app.paymentStatus);
    console.log('  - Payment Amount:', app.paymentAmount);
    console.log('  - Payment Date:', app.paymentDate);

    // Update payment status
    app.paymentStatus = 'completed';
    app.paymentAmount = 2000;
    app.paymentDate = new Date();
    
    if (!app.paymentDetails) {
      app.paymentDetails = {};
    }
    app.paymentDetails.status = 'completed';
    app.paymentDetails.completedAt = new Date();

    await app.save();

    console.log('\n✅ UPDATED application:');
    console.log('  - Payment Status:', app.paymentStatus);
    console.log('  - Payment Amount:', app.paymentAmount);
    console.log('  - Payment Date:', app.paymentDate);

    await mongoose.disconnect();
    console.log('\n✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updatePaymentStatus();
