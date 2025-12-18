import mongoose from 'mongoose';
import Application from '../models/Application.js';
import PersonalForm from '../models/PersonalForm.js';
import DeclarationForm from '../models/DeclarationForm.js';
import { mainDbConnection } from '../config/multiDatabase.js';

async function findSaisreeApplication() {
  try {
    // Connect to main database
    await mainDbConnection.asPromise();
    console.log('✅ Connected to activ-db');

    // Search for saisree in personal forms
    console.log('\n🔍 Searching for Saisree in personal forms...');
    const personalForms = await PersonalForm.find({
      $or: [
        { fullName: /saisree/i },
        { fullName: /sai sree/i }
      ]
    });

    console.log(`\n📋 Found ${personalForms.length} personal forms for Saisree:`);
    personalForms.forEach((form, idx) => {
      console.log(`\n${idx + 1}. Personal Form:`);
      console.log(`   User ID: ${form.userId}`);
      console.log(`   Name: ${form.fullName}`);
      console.log(`   State: ${form.state}`);
      console.log(`   District: ${form.district}`);
      console.log(`   Block: ${form.block}`);
      console.log(`   Completed: ${form.isCompleted}`);
    });

    // Search for applications
    console.log('\n🔍 Searching for applications...');
    const applications = await Application.find({
      userName: /saisree/i
    });

    console.log(`\n📋 Found ${applications.length} applications for Saisree:`);
    applications.forEach((app, idx) => {
      console.log(`\n${idx + 1}. Application:`);
      console.log(`   Application ID: ${app.applicationId}`);
      console.log(`   User ID: ${app.userId}`);
      console.log(`   Name: ${app.userName}`);
      console.log(`   State: ${app.state}`);
      console.log(`   District: ${app.district}`);
      console.log(`   Block: ${app.block}`);
      console.log(`   Status: ${app.status}`);
      console.log(`   Submitted At: ${app.submittedAt}`);
    });

    // Search for declaration forms
    console.log('\n🔍 Searching for declaration forms...');
    const declarations = await DeclarationForm.find();
    const saisreeDeclarations = declarations.filter(d => 
      d.fullName?.toLowerCase().includes('saisree') ||
      d.fullName?.toLowerCase().includes('sai sree')
    );

    console.log(`\n📋 Found ${saisreeDeclarations.length} declaration forms for Saisree:`);
    saisreeDeclarations.forEach((form, idx) => {
      console.log(`\n${idx + 1}. Declaration Form:`);
      console.log(`   User ID: ${form.userId}`);
      console.log(`   Name: ${form.fullName}`);
      console.log(`   Completed: ${form.isCompleted}`);
    });

    // Check all applications for Thandrampet
    console.log('\n\n🔍 All applications for Thandrampet block:');
    const thandrampetApps = await Application.find({
      block: /thandrampet/i
    });

    console.log(`\n📋 Found ${thandrampetApps.length} applications for Thandrampet:`);
    thandrampetApps.forEach((app, idx) => {
      console.log(`\n${idx + 1}. Application:`);
      console.log(`   ID: ${app.applicationId}`);
      console.log(`   Name: ${app.userName}`);
      console.log(`   State: ${app.state}`);
      console.log(`   District: ${app.district}`);
      console.log(`   Block: ${app.block}`);
      console.log(`   Status: ${app.status}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

findSaisreeApplication();
