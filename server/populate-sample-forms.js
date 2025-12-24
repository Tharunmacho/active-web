import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const populateSampleForms = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const userId = '6944c77df5d97bf7a6a29baf'; // Meera's user ID

        // Define models
        const PersonalForm = mongoose.model('PersonalForm', new mongoose.Schema({}, { strict: false, collection: 'personalforms' }));
        const BusinessForm = mongoose.model('BusinessForm', new mongoose.Schema({}, { strict: false, collection: 'businessforms' }));
        const DeclarationForm = mongoose.model('DeclarationForm', new mongoose.Schema({}, { strict: false, collection: 'declarationforms' }));

        console.log('\n📝 Creating sample forms for user...\n');

        // Create Personal Form
        await PersonalForm.findOneAndUpdate(
            { userId: userId },
            {
                userId: userId,
                name: 'Meera',
                dob: '1995-01-01',
                gender: 'Female',
                email: 'aathif@gmail.com',
                phoneNumber: '9876543210',
                address: '123 Main Street',
                city: 'Chennai',
                state: 'Tamil Nadu',
                pincode: '600001',
                isLocked: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            { upsert: true, new: true }
        );
        console.log('✅ Personal Form created/updated');

        // Create Business Form (Not doing business - Aspirant)
        await BusinessForm.findOneAndUpdate(
            { userId: userId },
            {
                userId: userId,
                doingBusiness: 'no',
                aspiringBusiness: 'Yes, I want to start a business',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            { upsert: true, new: true }
        );
        console.log('✅ Business Form created/updated (Aspirant)');

        // Create Declaration Form
        await DeclarationForm.findOneAndUpdate(
            { userId: userId },
            {
                userId: userId,
                declarationAccepted: true,
                signature: 'Meera',
                signatureDate: new Date(),
                createdAt: new Date(),
                updatedAt: new Date()
            },
            { upsert: true, new: true }
        );
        console.log('✅ Declaration Form created/updated');

        console.log('\n🎉 Sample profile data populated successfully!');
        console.log('📊 Profile should now show as 100% complete');
        console.log('\n⚠️  Note: User will need to refresh the dashboard to see the changes\n');

        await mongoose.disconnect();
        console.log('✅ Done');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

populateSampleForms();
