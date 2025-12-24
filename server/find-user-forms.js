import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const findUserAndForms = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check web auth collection for the user
        const WebAuth = mongoose.model('WebAuth', new mongoose.Schema({}, { strict: false, collection: 'web auth' }));
        const webAuth = await WebAuth.findOne({ email: 'aathif@gmail.com' });
        console.log('\n👤 Web Auth User:', webAuth ? {
            _id: webAuth._id,
            email: webAuth.email,
            fullName: webAuth.fullName
        } : 'NOT FOUND');

        if (webAuth) {
            const userId = webAuth._id.toString();
            console.log('\n🔍 Using userId:', userId);

            // Check all forms with this userId
            const PersonalForm = mongoose.model('PersonalForm', new mongoose.Schema({}, { strict: false, collection: 'personalforms' }));
            const personalForm = await PersonalForm.findOne({ userId: userId });
            console.log('\n📋 Personal Form:', personalForm || 'NOT FOUND');

            const BusinessForm = mongoose.model('BusinessForm', new mongoose.Schema({}, { strict: false, collection: 'businessforms' }));
            const businessForm = await BusinessForm.findOne({ userId: userId });
            console.log('\n💼 Business Form:', businessForm || 'NOT FOUND');

            const FinancialForm = mongoose.model('FinancialForm', new mongoose.Schema({}, { strict: false, collection: 'financialforms' }));
            const financialForm = await FinancialForm.findOne({ userId: userId });
            console.log('\n💰 Financial Form:', financialForm || 'NOT FOUND');

            const DeclarationForm = mongoose.model('DeclarationForm', new mongoose.Schema({}, { strict: false, collection: 'declarationforms' }));
            const declarationForm = await DeclarationForm.findOne({ userId: userId });
            console.log('\n📝 Declaration Form:', declarationForm || 'NOT FOUND');

            // Also check by ObjectId
            console.log('\n\n🔄 Trying with ObjectId...');
            const objectIdUserId = webAuth._id;
            
            const personalFormObj = await PersonalForm.findOne({ userId: objectIdUserId });
            console.log('📋 Personal Form (ObjectId):', personalFormObj || 'NOT FOUND');

            const businessFormObj = await BusinessForm.findOne({ userId: objectIdUserId });
            console.log('💼 Business Form (ObjectId):', businessFormObj || 'NOT FOUND');

            const financialFormObj = await FinancialForm.findOne({ userId: objectIdUserId });
            console.log('💰 Financial Form (ObjectId):', financialFormObj || 'NOT FOUND');

            const declarationFormObj = await DeclarationForm.findOne({ userId: objectIdUserId });
            console.log('📝 Declaration Form (ObjectId):', declarationFormObj || 'NOT FOUND');

            // Check all personal forms to see what's there
            console.log('\n\n📊 All Personal Forms in DB:');
            const allPersonalForms = await PersonalForm.find().limit(5);
            allPersonalForms.forEach(form => {
                console.log(`  - userId: ${form.userId} (type: ${typeof form.userId})`);
            });
        }

        await mongoose.disconnect();
        console.log('\n✅ Done');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

findUserAndForms();
