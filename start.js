#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting Smart Campus Backend...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('⚠️  No .env file found. Creating one from env.example...');
  const envExample = fs.readFileSync(path.join(__dirname, 'env.example'), 'utf8');
  fs.writeFileSync(envPath, envExample);
  console.log('✅ .env file created. Please update the values as needed.\n');
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing dependencies...');
  const install = spawn('npm', ['install'], { stdio: 'inherit', shell: true });
  
  install.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Dependencies installed successfully!\n');
      startServer();
    } else {
      console.error('❌ Failed to install dependencies');
      process.exit(1);
    }
  });
} else {
  startServer();
}

function startServer() {
  console.log('🔧 Starting server...');
  console.log('📚 API Documentation: API_DOCUMENTATION.md');
  console.log('🌐 Server will be available at http://localhost:4000');
  console.log('👥 Demo users:');
  console.log('   Admin: admin@klh.edu / admin123');
  console.log('   Faculty: faculty@klh.edu / faculty123');
  console.log('   Student: student@klh.edu / student123');
  console.log('\n' + '='.repeat(50) + '\n');

  const server = spawn('node', ['server.js'], { stdio: 'inherit', shell: true });
  
  server.on('close', (code) => {
    console.log(`\n🛑 Server stopped with code ${code}`);
  });

  // Handle Ctrl+C
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    server.kill('SIGINT');
    process.exit(0);
  });
}
