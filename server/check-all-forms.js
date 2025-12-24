import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const checkAllForms = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const userId = '6944c77df5d97bf7a6a29baf';
        
        // First, let's list all collections
        console.log('\n📚 Available Collections:');
        const collections = await mongoose.connection.db.listCollections().toArray();
        collections.forEach(c => console.log(`  - ${c.name}`));
        
        // Check PersonalForm
        const PersonalForm = mongoose.model('PersonalForm', new mongoose.Schema({}, { strict: false, collection: 'personalforms' }));
        const personalForm = await PersonalForm.findOne({ userId: userId });
        console.log('\n📋 Personal Form:', personalForm ? {
            name: personalForm.name,
            dob: personalForm.dob,
            gender: personalForm.gender,
            email: personalForm.email,
            isLocked: personalForm.isLocked
        } : 'NOT FOUND');

        // Check BusinessForm
        const BusinessForm = mongoose.model('BusinessForm', new mongoose.Schema({}, { strict: false, collection: 'businessforms' }));
        const businessForm = await BusinessForm.findOne({ userId: userId });
        console.log('\n💼 Business Form:', businessForm ? {
            doingBusiness: businessForm.doingBusiness,
            natureOfBusiness: businessForm.natureOfBusiness
        } : 'NOT FOUND');

        // Check FinancialForm
        const FinancialForm = mongoose.model('FinancialForm', new mongoose.Schema({}, { strict: false, collection: 'financialforms' }));
        const financialForm = await FinancialForm.findOne({ userId: userId });
        console.log('\n💰 Financial Form:', financialForm ? {
            pan: financialForm.pan,
            gst: financialForm.gst,
            annualTurnover: financialForm.annualTurnover
        } : 'NOT FOUND');

        // Check DeclarationForm
        const DeclarationForm = mongoose.model('DeclarationForm', new mongoose.Schema({}, { strict: false, collection: 'declarationforms' }));
        const declarationForm = await DeclarationForm.findOne({ userId: userId });
        console.log('\n📝 Declaration Form:', declarationForm ? {
            declarationAccepted: declarationForm.declarationAccepted,
            signature: declarationForm.signature
        } : 'NOT FOUND');

        // Calculate profile completion
        let completed = 0;
        let totalForms = 4;
        const isDoingBusiness = businessForm?.doingBusiness === 'yes';
        
        if (!isDoingBusiness) {
            totalForms = 3;
        }

        if (personalForm && personalForm.name) completed++;
        if (businessForm && businessForm.doingBusiness) completed++;
        if (isDoingBusiness && financialForm && financialForm.pan) completed++;
        if (declarationForm && declarationForm.declarationAccepted) completed++;

        const percentage = Math.round((completed / totalForms) * 100);
        
        console.log('\n\n📊 PROFILE COMPLETION SUMMARY:');
        console.log('================================');
        console.log(`Total Forms Required: ${totalForms}`);
        console.log(`Forms Completed: ${completed}`);
        console.log(`Completion Percentage: ${percentage}%`);
        console.log(`Is Fully Completed: ${percentage === 100 ? 'YES ✅' : 'NO ❌'}`);
        console.log('================================\n');

        await mongoose.disconnect();
        console.log('✅ Done');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

checkAllForms();
