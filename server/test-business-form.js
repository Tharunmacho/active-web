import fetch from 'node-fetch';

// Test script to verify business form API
const testBusinessForm = async () => {
  try {
    // First, login to get a token
    console.log('🔐 Logging in...');
    const loginResponse = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: 'test@example.com', // Replace with your test user credentials
        password: 'password123'
      })
    });

    if (!loginResponse.ok) {
      console.error('❌ Login failed:', await loginResponse.text());
      return;
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Login successful! Token:', token.substring(0, 20) + '...');

    // Now test the business form submission
    console.log('\n📝 Testing business form submission...');
    const businessData = {
      doingBusiness: 'yes',
      organization: 'Test Organization',
      constitution: 'Private Limited',
      businessTypes: ['Manufacturing', 'Trader'],
      businessActivities: 'Testing business activities',
      businessYear: '2020',
      employees: '50',
      chamber: 'yes',
      chamberDetails: 'Test Chamber Details',
      govtOrgs: ['MSME']
    };

    console.log('📦 Sending data:', JSON.stringify(businessData, null, 2));

    const response = await fetch('http://localhost:4000/api/business-form', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(businessData)
    });

    console.log('📡 Response status:', response.status);
    const result = await response.json();
    console.log('📥 Response:', JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log('\n✅ SUCCESS! Business form saved to database.');
      console.log('🔍 Check MongoDB Atlas for the data in business_profiles collection');
    } else {
      console.error('\n❌ FAILED! Error:', result.message);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testBusinessForm();
