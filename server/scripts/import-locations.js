import XLSX from 'xlsx';
import mongoose from 'mongoose';
import Location from '../models/Location.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const importLocations = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'activ-db'
    });
    console.log('✅ MongoDB Connected');

    // Read Excel file
    const excelFilePath = path.join(__dirname, '..', '..', 'All_Blockof_Indiawith_Coverageof_villages.xlsx');
    console.log('📂 Reading Excel file from:', excelFilePath);
    
    const workbook = XLSX.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { range: 1 }); // Skip first row (title)

    console.log(`📊 Found ${data.length} rows in Excel`);

    // Clear existing data
    await Location.deleteMany({});
    console.log('🗑️  Cleared existing location data');

    // Group data by state and district
    const locationMap = new Map();

    data.forEach(row => {
      // Use the correct column names from the Excel file
      const state = row['State Name (In English)'];
      const district = row['District Name (In English)'];
      const block = row['Development Block Name (In English)'];

      if (!state || !district || !block) {
        return;
      }

      const key = `${state}|${district}`;
      
      if (!locationMap.has(key)) {
        locationMap.set(key, {
          state: state.trim(),
          district: district.trim(),
          blocks: []
        });
      }

      const location = locationMap.get(key);
      const blockTrimmed = block.trim();
      if (!location.blocks.includes(blockTrimmed)) {
        location.blocks.push(blockTrimmed);
      }
    });

    // Convert map to array and insert
    const locations = Array.from(locationMap.values());
    
    if (locations.length === 0) {
      console.log('❌ No valid location data found!');
      process.exit(1);
    }

    await Location.insertMany(locations);
    
    console.log('✅ Successfully imported location data!');
    console.log(`📍 Total states: ${new Set(locations.map(l => l.state)).size}`);
    console.log(`📍 Total districts: ${locations.length}`);
    console.log(`📍 Total blocks: ${locations.reduce((sum, l) => sum + l.blocks.length, 0)}`);

    // Show sample data
    console.log('\n📋 Sample data:');
    locations.slice(0, 3).forEach(loc => {
      console.log(`  ${loc.state} > ${loc.district} > ${loc.blocks.length} blocks`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing locations:', error);
    process.exit(1);
  }
};

importLocations();
