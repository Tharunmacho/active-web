import mongoose from 'mongoose';
import Application from './src/shared/models/Application.js';
import WebUser from './src/shared/models/WebUser.js';
import dotenv from 'dotenv';

dotenv.config();

async function updatePaymentStatus() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Update the user's application to mark payment as completed
    const email = 'tharun1234@gmail.com';
    
    // First find the user by email
    const user = await WebUser.findOne({ email });
    
    if (!user) {
      console.log('❌ No user found for:', email);
      return;
    }
    
    console.log('✅ User found:', user._id);
    
    // Find the application by userId
    const application = await Application.findOne({ userId: user._id });
    
    if (!application) {
      console.log('❌ No application found for user:', user._id);
      return;
    }
    
    console.log('\n📋 Current application status:');
    console.log('Application ID:', application.applicationId);
    console.log('User ID:', application.userId);
    console.log('Payment Status:', application.paymentStatus);
    
    // Update payment status to completed
    application.paymentStatus = 'completed';
    application.paymentDate = new Date();
    application.paymentAmount = 500; // Set appropriate amount
    application.transactionId = 'TXN-' + Date.now();
    
    // Update payment details
    if (!application.paymentDetails) {
      application.paymentDetails = {};
    }
    application.paymentDetails.status = 'completed';
    application.paymentDetails.completedAt = new Date();
    application.paymentDetails.planType = 'Intermediate Plan';
    application.paymentDetails.totalAmount = 500;
    
    await application.save();
    
    console.log('\n✅ Payment status updated successfully!');
    console.log('New Payment Status:', application.paymentStatus);
    console.log('Payment Date:', application.paymentDate);
    console.log('Transaction ID:', application.transactionId);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Connection closed');
  }
}

updatePaymentStatus();
