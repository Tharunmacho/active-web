import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Company from '../src/shared/models/Company.js';
import WebUser from '../src/shared/models/WebUser.js';

dotenv.config();

const checkBusinessAccounts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Find user by email
        const user = await WebUser.findOne({ email: 'sairam@gmail.com' }); // Change to your email

        if (!user) {
            console.log('❌ User not found');
            process.exit(1);
        }

        console.log('\n👤 User Details:');
        console.log('User ID:', user._id);
        console.log('Email:', user.email);
        console.log('Name:', user.fullName);

        // Check for companies
        const companies = await Company.find({ userId: user._id });

        console.log('\n🏢 Business Accounts Found:', companies.length);

        if (companies.length > 0) {
            companies.forEach((company, index) => {
                console.log(`\n--- Company ${index + 1} ---`);
                console.log('Business Name:', company.businessName);
                console.log('Status:', company.status);
                console.log('Created At:', company.createdAt);
            });
        } else {
            console.log('❌ No business accounts found for this user');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkBusinessAccounts();
