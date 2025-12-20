import mongoose from 'mongoose';
import { BlockAdmin } from '../models/ExistingAdmins.js';
import Application from '../models/Application.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

async function checkDistrictSpelling() {
  
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_ADMIN_URI;
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    
    // Get unique district names from Arni and Thandrampet admins
    const admins = await BlockAdmin.find({
      'meta.district': { $regex: /tiruvannamalai/i }
    }).lean();
    
    console.log(`\nFound ${admins.length} admins with Tiruvannamalai district\n`);
    
    // Get unique district spellings
    const districtSpellings = [...new Set(admins.map(a => a.meta.district))];
    console.log('Unique district spellings:');
    districtSpellings.forEach(d => console.log(`  - "${d}"`));
    
    // Check applications
    const apps = await Application.find({
      district: { $regex: /tiruvannamalai/i }
    }).lean();
    
    console.log(`\nFound ${apps.length} applications with Tiruvannamalai district\n`);
    
    const appDistrictSpellings = [...new Set(apps.map(a => a.district))];
    console.log('Application district spellings:');
    appDistrictSpellings.forEach(d => console.log(`  - "${d}"`));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

checkDistrictSpelling();
