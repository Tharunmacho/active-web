
import mongoose from 'mongoose';
import Application from '../src/shared/models/Application.js';
import WebUser from '../src/shared/models/WebUser.js';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

const checkUserApplication = async () => {
    try {
        await connectDB();
        console.log('✅ DB Connected');

        const email = 'sasvanthuu@gmail.com';
        console.log(`🔍 Looking for user: ${email}`);

        const user = await WebUser.findOne({ email });
        if (!user) {
            console.log('❌ User not found');
            process.exit(1);
        }
        console.log(`✅ User found: ${user._id}`);

        const application = await Application.findOne({ userId: user._id });
        if (!application) {
            console.log('❌ Application not found for user');
            process.exit(1);
        }

        console.log('✅ Application found');
        console.log('Application ID:', application.applicationId);
        console.log('Payment Status:', application.paymentStatus);
        console.log('Payment Details:', JSON.stringify(application.paymentDetails, null, 2));

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

checkUserApplication();
