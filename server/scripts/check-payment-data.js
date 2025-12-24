import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Application from '../src/shared/models/Application.js';

dotenv.config();

const checkPaymentData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const userId = '694b9f627d5433ec47ef28d3'; // vinoth's user ID

        const application = await Application.findOne({ userId });

        if (!application) {
            console.log('❌ No application found');
            return;
        }

        console.log('\n📋 Application Details:');
        console.log('Application ID:', application.applicationId);
        console.log('Payment Status:', application.paymentStatus);
        console.log('\n💰 Payment Details:');
        console.log(JSON.stringify(application.paymentDetails, null, 2));

        // Try to find with MOCK_PAY ID
        const mockPayId = 'MOCK_PAY1766586412813UBCSYIHO6';
        const found = await Application.findOne({
            userId,
            $or: [
                { 'paymentDetails.paymentId': mockPayId },
                { 'paymentDetails.instamojoPaymentRequestId': mockPayId }
            ]
        });

        console.log('\n🔍 Search Result for', mockPayId, ':', found ? 'FOUND ✅' : 'NOT FOUND ❌');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkPaymentData();
