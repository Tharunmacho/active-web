import mongoose from 'mongoose';
import Application from '../src/shared/models/Application.js';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ MongoDB Connected`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

const checkPaymentQuery = async () => {
    try {
        await connectDB();

        const userId = '694bb288f2568b4e1aa9a38a';
        const paymentId = 'MOCK_PAY1766568839307UPRZWJ1MG';

        console.log('\n🔍 Testing payment query...');
        console.log('User ID:', userId);
        console.log('Payment ID:', paymentId);

        // Test the exact query from completePayment
        const application = await Application.findOne({
            userId: new mongoose.Types.ObjectId(userId),
            $or: [
                { 'paymentDetails.paymentId': paymentId },
                { 'paymentDetails.instamojoPaymentRequestId': paymentId }
            ]
        });

        if (!application) {
            console.log('\n❌ Application NOT found with $or query');

            // Try finding by userId only
            const appByUser = await Application.findOne({ userId: new mongoose.Types.ObjectId(userId) });
            if (appByUser) {
                console.log('\n✅ Application found by userId only:');
                console.log('  Application ID:', appByUser.applicationId);
                console.log('  Payment Details:', JSON.stringify(appByUser.paymentDetails, null, 2));
            }
        } else {
            console.log('\n✅ Application FOUND with $or query!');
            console.log('  Application ID:', application.applicationId);
            console.log('  Payment Status:', application.paymentStatus);
            console.log('  Payment Details:', JSON.stringify(application.paymentDetails, null, 2));
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

checkPaymentQuery();
