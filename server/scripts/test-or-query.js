// Quick test to verify the $or query works
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testQuery = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const Application = mongoose.model('Application', new mongoose.Schema({}, { strict: false, collection: 'applications' }));

        const userId = '694bb288f2568b4e1aa9a38a';
        const paymentId = 'MOCK_PAY1766568839307UPRZWJ1MG';

        console.log('\n🔍 Testing $or query:');
        console.log('  User ID:', userId);
        console.log('  Payment ID:', paymentId);

        const result = await Application.findOne({
            userId: new mongoose.Types.ObjectId(userId),
            $or: [
                { 'paymentDetails.paymentId': paymentId },
                { 'paymentDetails.instamojoPaymentRequestId': paymentId }
            ]
        });

        if (result) {
            console.log('\n✅ SUCCESS! Application found');
            console.log('  Application ID:', result.applicationId);
            console.log('  Stored paymentId:', result.paymentDetails?.paymentId);
            console.log('  Stored instamojoPaymentRequestId:', result.paymentDetails?.instamojoPaymentRequestId);
        } else {
            console.log('\n❌ FAILED! Application not found');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

testQuery();
