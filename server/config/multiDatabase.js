import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Optimized connection options
const connectionOptions = {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s
  socketTimeoutMS: 45000, // Close sockets after 45s
  maxPoolSize: 10, // Max 10 connections
  minPoolSize: 2, // Min 2 connections
  connectTimeoutMS: 10000, // Connection timeout 10s
  family: 4 // Use IPv4 only
};

// Connection to main activ-db (for applications, users, etc.)
const mainDbConnection = mongoose.createConnection(
  process.env.MONGODB_URI || 'mongodb+srv://activapp2025_db_user:o6xFHfqzLXM6LUaa@cluster1.gf7usct.mongodb.net/activ-db?retryWrites=true&w=majority',
  connectionOptions
);

// Connection to adminsdb (for admin authentication)
const adminDbConnection = mongoose.createConnection(
  process.env.MONGODB_URI?.replace('/activ-db', '/adminsdb') || 
  'mongodb+srv://activapp2025_db_user:o6xFHfqzLXM6LUaa@cluster1.gf7usct.mongodb.net/adminsdb?retryWrites=true&w=majority',
  connectionOptions
);

mainDbConnection.on('connected', () => {
  console.log('✅ Connected to activ-db (main database)');
});

mainDbConnection.on('error', (err) => {
  console.error('❌ Main DB connection error:', err.message);
});

mainDbConnection.on('disconnected', () => {
  console.warn('⚠️ Main DB disconnected');
});

adminDbConnection.on('connected', () => {
  console.log('✅ Connected to adminsdb (admin database)');
});

adminDbConnection.on('error', (err) => {
  console.error('❌ Admin DB connection error:', err.message);
});

adminDbConnection.on('disconnected', () => {
  console.warn('⚠️ Admin DB disconnected');
});

export { mainDbConnection, adminDbConnection };
export default mainDbConnection;
