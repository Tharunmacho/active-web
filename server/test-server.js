import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

console.log('1. Loading environment...');
dotenv.config();

console.log('2. Attempting to import models...');
try {
  const WebUser = await import('./models/WebUser.js');
  console.log('   ✓ WebUser model loaded');
  const WebUserProfile = await import('./models/WebUserProfile.js');
  console.log('   ✓ WebUserProfile model loaded');
} catch (err) {
  console.error('   ✗ Model import error:', err.message);
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/health', (req, res) => {
  console.log('Health check hit!');
  res.json({ success: true, message: 'Server is alive' });
});

// Test login route
app.post('/api/auth/login', (req, res) => {
  console.log('Login endpoint hit!', req.body);
  res.json({ success: false, message: 'Test login endpoint' });
});

const PORT = 4000;

// Connect DB first
connectDB();

app.listen(PORT, () => {
  console.log(`✅ Test server running on http://localhost:${PORT}`);
  console.log(`Try: http://localhost:${PORT}/api/health`);
});

// Handle errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});
