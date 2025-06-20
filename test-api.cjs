const http = require('http');

console.log('🚀 Testing IUSO NestJS API...');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`✅ Status Code: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('✅ Response:', response);
      console.log('🎉 API is working!');
    } catch (e) {
      console.log('📄 Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
  console.log('💡 Make sure NestJS is running on port 3000');
});

req.setTimeout(5000, () => {
  console.log('⏰ Request timeout');
  req.destroy();
});

req.end(); 