import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Application from '../src/shared/models/Application.js';

dotenv.config();

const fixPaymentData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const userId = '694b9f627d5433ec47ef28d3'; // vinoth's user ID
        const paymentId = 'PAY1766586412813';
        const mockPaymentId = 'MOCK_PAY1766586412813UBCSYIHO6';

        const application = await Application.findOne({ userId });

        if (!application) {
            console.log('❌ No application found');
            process.exit(1);
        }

        console.log('📋 Current payment details:', application.paymentDetails);

        // Update with the payment ID from the URL
        application.paymentDetails = {
            paymentId: paymentId,
            instamojoPaymentRequestId: mockPaymentId,
            planType: 'annual',
            planAmount: 500,
            supportAmount: 0,
            totalAmount: 500,
            initiatedAt: new Date(),
            testMode: true
        };
        application.paymentStatus = 'pending';

        await application.save();

        console.log('✅ Payment data updated successfully!');
        console.log('💰 New payment details:', application.paymentDetails);
        console.log('\n🎯 Now try completing the payment again!');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

fixPaymentData();
