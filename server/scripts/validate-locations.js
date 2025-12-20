import mongoose from 'mongoose';
import { BlockAdmin, DistrictAdmin, StateAdmin } from '../models/ExistingAdmins.js';
import Application from '../models/Application.js';
import { INDIA_BLOCKS } from '../data/india-locations.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const validateAndFixLocations = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_ADMIN_URI;
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Get all Tamil Nadu blocks from data file
    const tamilNaduDistricts = INDIA_BLOCKS["Tamil Nadu"];
    console.log('\n📋 Tamil Nadu Districts in data file:', Object.keys(tamilNaduDistricts).length);

    // Get all Block Admins for Tamil Nadu
    const tamilNaduBlockAdmins = await BlockAdmin.find({
      'meta.state': 'Tamil Nadu'
    }).select('email meta.district meta.block');

    console.log('\n📋 Tamil Nadu Block Admins in database:', tamilNaduBlockAdmins.length);

    // Check for mismatches
    const mismatches = [];
    const corrections = [];

    for (const admin of tamilNaduBlockAdmins) {
      const adminDistrict = admin.meta.district;
      const adminBlock = admin.meta.block;

      // Check if district exists in data file
      const districtInData = Object.keys(tamilNaduDistricts).find(
        d => d.toLowerCase() === adminDistrict.toLowerCase()
      );

      if (!districtInData) {
        mismatches.push({
          type: 'DISTRICT_NOT_IN_DATA',
          admin: admin.email,
          adminValue: adminDistrict,
          suggestion: 'District not found in data file'
        });
        continue;
      }

      // Check if block exists in the district's blocks
      const blocksInDistrict = tamilNaduDistricts[districtInData];
      const blockInData = blocksInDistrict.find(
        b => b.toLowerCase() === adminBlock.toLowerCase()
      );

      if (!blockInData) {
        mismatches.push({
          type: 'BLOCK_NOT_IN_DATA',
          admin: admin.email,
          adminDistrict: adminDistrict,
          adminBlock: adminBlock,
          dataDistrict: districtInData,
          availableBlocks: blocksInDistrict.join(', ')
        });
      } else if (adminDistrict !== districtInData || adminBlock !== blockInData) {
        // Spelling/case mismatch
        corrections.push({
          admin: admin.email,
          currentDistrict: adminDistrict,
          correctDistrict: districtInData,
          currentBlock: adminBlock,
          correctBlock: blockInData
        });
      }
    }

    // Display mismatches
    if (mismatches.length > 0) {
      console.log('\n❌ MISMATCHES FOUND:');
      console.log('='.repeat(80));
      
      const districtMismatches = mismatches.filter(m => m.type === 'DISTRICT_NOT_IN_DATA');
      const blockMismatches = mismatches.filter(m => m.type === 'BLOCK_NOT_IN_DATA');

      if (districtMismatches.length > 0) {
        console.log('\n🔴 Districts not in data file:');
        districtMismatches.forEach(m => {
          console.log(`  ${m.admin}: "${m.adminValue}"`);
        });
      }

      if (blockMismatches.length > 0) {
        console.log('\n🔴 Blocks not in data file:');
        blockMismatches.forEach(m => {
          console.log(`\n  ${m.admin}:`);
          console.log(`    Admin has: ${m.adminDistrict} > ${m.adminBlock}`);
          console.log(`    Data has: ${m.dataDistrict}`);
          console.log(`    Available blocks: ${m.availableBlocks}`);
        });
      }
    }

    // Display corrections needed
    if (corrections.length > 0) {
      console.log('\n⚠️  CORRECTIONS NEEDED (spelling/case):');
      console.log('='.repeat(80));
      corrections.forEach(c => {
        console.log(`\n  ${c.admin}:`);
        if (c.currentDistrict !== c.correctDistrict) {
          console.log(`    District: "${c.currentDistrict}" → "${c.correctDistrict}"`);
        }
        if (c.currentBlock !== c.correctBlock) {
          console.log(`    Block: "${c.currentBlock}" → "${c.correctBlock}"`);
        }
      });
    }

    // Check applications
    console.log('\n\n📋 CHECKING APPLICATIONS:');
    console.log('='.repeat(80));

    const allApps = await Application.find({
      state: 'Tamil Nadu'
    }).select('applicationId state district block');

    console.log(`\nTotal Tamil Nadu applications: ${allApps.length}`);

    const appMismatches = [];
    const appCorrections = [];

    for (const app of allApps) {
      const districtInData = Object.keys(tamilNaduDistricts).find(
        d => d.toLowerCase() === app.district.toLowerCase()
      );

      if (!districtInData) {
        appMismatches.push({
          appId: app.applicationId,
          district: app.district,
          block: app.block,
          issue: 'District not in data'
        });
        continue;
      }

      const blocksInDistrict = tamilNaduDistricts[districtInData];
      const blockInData = blocksInDistrict.find(
        b => b.toLowerCase() === app.block.toLowerCase()
      );

      if (!blockInData) {
        appMismatches.push({
          appId: app.applicationId,
          district: app.district,
          block: app.block,
          dataDistrict: districtInData,
          issue: `Block "${app.block}" not in ${districtInData}`,
          availableBlocks: blocksInDistrict.join(', ')
        });
      } else if (app.district !== districtInData || app.block !== blockInData) {
        appCorrections.push({
          appId: app.applicationId,
          currentDistrict: app.district,
          correctDistrict: districtInData,
          currentBlock: app.block,
          correctBlock: blockInData
        });
      }
    }

    if (appMismatches.length > 0) {
      console.log('\n❌ Application mismatches:');
      appMismatches.forEach(m => {
        console.log(`\n  ${m.appId}:`);
        console.log(`    Has: ${m.district} > ${m.block}`);
        console.log(`    Issue: ${m.issue}`);
        if (m.availableBlocks) {
          console.log(`    Available: ${m.availableBlocks}`);
        }
      });
    }

    if (appCorrections.length > 0) {
      console.log('\n⚠️  Application corrections needed:');
      appCorrections.forEach(c => {
        console.log(`\n  ${c.appId}:`);
        if (c.currentDistrict !== c.correctDistrict) {
          console.log(`    District: "${c.currentDistrict}" → "${c.correctDistrict}"`);
        }
        if (c.currentBlock !== c.correctBlock) {
          console.log(`    Block: "${c.currentBlock}" → "${c.correctBlock}"`);
        }
      });
    }

    // Summary
    console.log('\n\n📊 SUMMARY:');
    console.log('='.repeat(80));
    console.log(`Total Block Admins checked: ${tamilNaduBlockAdmins.length}`);
    console.log(`Admin mismatches: ${mismatches.length}`);
    console.log(`Admin corrections needed: ${corrections.length}`);
    console.log(`Applications checked: ${allApps.length}`);
    console.log(`Application mismatches: ${appMismatches.length}`);
    console.log(`Application corrections needed: ${appCorrections.length}`);

    if (mismatches.length === 0 && corrections.length === 0 && 
        appMismatches.length === 0 && appCorrections.length === 0) {
      console.log('\n✅ All locations match! No corrections needed.');
    } else {
      console.log('\n⚠️  Corrections required. Run fix script to update.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

validateAndFixLocations();
