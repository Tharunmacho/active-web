import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Application from '../src/shared/models/Application.js';
import WebUser from '../src/shared/models/WebUser.js';

dotenv.config();

const createApplication = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Find user
        const user = await WebUser.findOne({ email: 'sairam@gmail.com' });

        if (!user) {
            console.log('❌ User not found');
            process.exit(1);
        }

        console.log('👤 User found:', user.email);

        // Check if application already exists
        const existingApp = await Application.findOne({ userId: user._id });

        if (existingApp) {
            console.log('✅ Application already exists:', existingApp.applicationId);
            console.log('Payment Status:', existingApp.paymentStatus);

            // Update to completed if needed
            if (existingApp.paymentStatus !== 'completed') {
                existingApp.paymentStatus = 'completed';
                existingApp.paymentAmount = 500;
                existingApp.paymentDate = new Date();
                await existingApp.save();
                console.log('✅ Updated payment status to completed');
            }
        } else {
            // Create new application
            const application = new Application({
                userId: user._id,
                applicationId: `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                memberName: user.fullName || 'Sairam',
                memberEmail: user.email,
                memberPhone: user.phone || '1234567890',
                memberType: 'aspirant',
                status: 'approved',
                district: 'Ariyalur',
                block: 'Andimadam',
                state: 'Tamil Nadu',
                blockApproval: 'approved',
                districtApproval: 'approved',
                stateApproval: 'approved',
                paymentStatus: 'completed',
                paymentAmount: 500,
                paymentDate: new Date(),
                submittedAt: new Date()
            });

            await application.save();
            console.log('✅ Created new application:', application.applicationId);
        }

        console.log('\n🎉 Done! User now has a completed application.');
        console.log('Refresh the dashboard to see changes.');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createApplication();
