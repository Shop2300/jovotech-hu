// setup.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Czech E-shop...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found! Please create it first.');
  console.log('Run: cp .env.example .env');
  process.exit(1);
}

try {
  // Generate Prisma Client
  console.log('🔧 Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Push database schema
  console.log('\n📊 Creating database schema...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  // Seed the database
  console.log('\n🌱 Seeding database with sample data...');
  execSync('node seed-admin.js', { stdio: 'inherit' });
  
  console.log('\n✅ Setup complete! You can now run:');
  console.log('   npm run dev');
  console.log('\n📋 Admin panel credentials:');
  console.log('   URL: http://localhost:3000/admin');
  console.log('   Password: admin123');
  
} catch (error) {
  console.error('\n❌ Setup failed:', error.message);
  process.exit(1);
}