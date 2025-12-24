import mongoose from 'mongoose';
import Application from './src/shared/models/Application.js';

const updatePayment = async () => {
  try {
    await mongoose.connect('mongodb+srv://admin:admin@cluster0.gf7usct.mongodb.net/activ-db?retryWrites=true&w=majority');
    console.log('✅ Connected to MongoDB');
    
    const app = await Application.findOne({ applicationId: 'APP-1766511465664-58DLCHSIL' });
    console.log('Current payment status:', app.paymentStatus);
    
    app.paymentStatus = 'completed';
    app.paymentDate = new Date();
    app.paymentAmount = 2000;
    
    await app.save();
    console.log('✅ Payment status updated to:', app.paymentStatus);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

updatePayment();
