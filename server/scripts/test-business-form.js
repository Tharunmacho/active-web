import mongoose from 'mongoose';
import BusinessForm from '../models/BusinessForm.js';

const MONGODB_URI = 'mongodb+srv://activapp2025_db_user:o6xFHfqzLXM6LUaa@cluster1.gf7usct.mongodb.net/activ-db';

async function testBusinessFormSave() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB\n');

        // Test saving business form with "no" for saisree
        const testUserId = '6942eeef6c62226f0a30bfde'; // saisree's auth ID
        
        console.log('Testing business form save for userId:', testUserId);
        console.log('Data to save: { doingBusiness: "no" }\n');
        
        // Check if form exists
        let form = await BusinessForm.findOne({ userId: testUserId });
        console.log('Existing form found:', form ? 'Yes' : 'No');
        
        if (!form) {
            form = await BusinessForm.create({
                userId: testUserId,
                doingBusiness: 'no'
            });
            console.log('✅ New business form created:', form._id);
        } else {
            form.doingBusiness = 'no';
            await form.save();
            console.log('✅ Existing business form updated:', form._id);
        }
        
        console.log('\nSaved form data:');
        console.log(JSON.stringify(form, null, 2));
        
        // Verify it was saved
        console.log('\nVerifying save...');
        const verifyForm = await BusinessForm.findOne({ userId: testUserId });
        if (verifyForm) {
            console.log('✅ Verification successful!');
            console.log('doingBusiness value:', verifyForm.doingBusiness);
        } else {
            console.log('❌ Verification failed - form not found!');
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

testBusinessFormSave();
