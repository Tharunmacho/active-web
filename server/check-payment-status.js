import mongoose from 'mongoose';
import Application from './src/shared/models/Application.js';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/activ', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function checkAndUpdatePaymentStatus() {
  try {
    console.log('Checking payment status...\n');
    
    // Get the user's email
    const email = 'aathif@gmail.com'; // Update this to your email
    
    // Find application by email
    const app = await Application.findOne({ memberEmail: email });
    
    if (!app) {
      console.log('❌ No application found for', email);
      return;
    }
    
    console.log('Current payment status:', app.paymentStatus);
    console.log('Application ID:', app._id);
    
    // Update to completed if needed
    if (app.paymentStatus !== 'completed') {
      app.paymentStatus = 'completed';
      await app.save();
      console.log('✅ Payment status updated to: completed');
    } else {
      console.log('✅ Payment status is already: completed');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkAndUpdatePaymentStatus();
