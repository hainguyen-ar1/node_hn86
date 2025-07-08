import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

// Test rate limiting
async function testRateLimit() {
  console.log('🧪 Testing Rate Limiting...\n');

  const testData = {
    email: 'test@example.com',
    password: '123456'
  };

  try {
    // Test multiple requests to trigger rate limiting
    for (let i = 1; i <= 7; i++) {
      try {
        const response = await axios.post(`${BASE_URL}/user/login`, testData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log(`✅ Request ${i}: Success (${response.status})`);
      } catch (error) {
        if (error.response?.status === 429) {
          console.log(`🚫 Request ${i}: Rate Limited (429) - Too many requests`);
        } else {
          console.log(`❌ Request ${i}: Error (${error.response?.status || 'Unknown'})`);
        }
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n📊 Rate Limiting Test Summary:');
    console.log('- First 5 requests: Should succeed (401 for invalid credentials)');
    console.log('- Requests 6+: Should be rate limited (429)');
    console.log('- Rate limit: 5 requests per 15 minutes for auth routes');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Test validation
async function testValidation() {
  console.log('\n🧪 Testing Input Validation...\n');

  const invalidUserData = {
    fullName: 'A', // Too short
    email: 'invalid-email', // Invalid email
    password: '123', // Too short
    phone: '123', // Invalid phone
    gender: 'invalid' // Invalid gender
  };

  try {
    const response = await axios.post(`${BASE_URL}/user/register`, invalidUserData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('❌ Validation failed - should have rejected invalid data');
  } catch (error) {
    if (error.response?.status === 400) {
      console.log('✅ Validation working correctly - rejected invalid data');
      console.log('📝 Error message:', error.response.data.message);
    } else {
      console.log('❌ Unexpected error:', error.response?.status);
    }
  }
}

// Test security headers
async function testSecurityHeaders() {
  console.log('\n🧪 Testing Security Headers...\n');

  try {
    const response = await axios.get(`${BASE_URL}/`);
    const headers = response.headers;

    console.log('🔒 Security Headers Check:');
    console.log('- X-Frame-Options:', headers['x-frame-options'] || 'Not set');
    console.log('- X-Content-Type-Options:', headers['x-content-type-options'] || 'Not set');
    console.log('- X-XSS-Protection:', headers['x-xss-protection'] || 'Not set');
    console.log('- Content-Security-Policy:', headers['content-security-policy'] ? 'Set' : 'Not set');

  } catch (error) {
    console.error('❌ Security headers test failed:', error.message);
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting Security & Rate Limiting Tests...\n');
  
  await testRateLimit();
  await testValidation();
  await testSecurityHeaders();
  
  console.log('\n✅ All tests completed!');
}

runTests().catch(console.error); 