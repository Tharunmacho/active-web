// Test if payment complete endpoint exists
const token = 'YOUR_TOKEN_HERE'; // Replace with actual token from localStorage

fetch('http://localhost:4000/api/payment/complete', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
        applicationId: 'APP-1766565065128-1414OSWQZ',
        paymentMethod: 'test',
        transactionId: 'TEST123'
    })
})
    .then(res => res.json())
    .then(data => console.log('✅ Response:', data))
    .catch(err => console.error('❌ Error:', err));
