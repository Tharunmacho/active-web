
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { BlockAdmin } from '../src/shared/models/ExistingAdmins.js';
import { adminDbConnection } from '../config/multiDatabase.js';

async function fixBlockAdmin() {
    try {
        // Connect to admin database
        await adminDbConnection.asPromise();
        console.log('✅ Connected to adminsdb');

        const email = 'block.madurantakam.chengalpattu.tamil.nadu@activ.com';
        const password = 'ChangeMe@123';

        // Check if admin already exists (case insensitive)
        console.log(`🔍 Checking if admin exists: ${email}`);
        const existingAdmin = await BlockAdmin.findOne({
            email: { $regex: new RegExp(`^${email}$`, 'i') }
        });

        if (existingAdmin) {
            console.log('⚠️  Admin found (creating/updating password)...');
            console.log(`   Found ID: ${existingAdmin._id}, Email: ${existingAdmin.email}`);

            // Hash password
            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(password, salt);

            existingAdmin.passwordHash = passwordHash;
            existingAdmin.active = true;
            existingAdmin.meta = {
                state: 'Tamil Nadu',
                district: 'Chengalpattu',
                block: 'Madurantakam',
                stateLc: 'tamil nadu',
                districtLc: 'chengalpattu',
                blockLc: 'madurantakam',
                mustResetPassword: false
            };
            await existingAdmin.save();

            console.log('\n✅ Admin password and meta updated successfully!');
        } else {
            console.log('📝 Admin NOT found. Creating new admin...');

            // Hash password
            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(password, salt);

            // Create new admin
            const newAdmin = new BlockAdmin({
                adminId: 'BA28002005',
                email: email,
                passwordHash: passwordHash,
                fullName: 'Madurantakam Block Admin',
                role: 'BlockAdmin',
                active: true,
                meta: {
                    state: 'Tamil Nadu',
                    district: 'Chengalpattu',
                    block: 'Madurantakam',
                    stateLc: 'tamil nadu',
                    districtLc: 'chengalpattu',
                    blockLc: 'madurantakam',
                    mustResetPassword: false
                },
                createdAt: new Date(),
                updatedAt: new Date()
            });

            console.log('💾 Saving new admin...');
            try {
                await newAdmin.save();
                console.log('\n✅ New admin created successfully!');
            } catch (saveError) {
                console.error('❌ Save Failed:', saveError.message);
                if (saveError.code === 11000) {
                    console.error('   Duplicate key error:', saveError.keyPattern);
                }
            }
        }

        console.log('\n📋 Admin Details:');
        console.log(`   Email: ${email}`);
        console.log(`   Password: ${password}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ General Error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

fixBlockAdmin();
