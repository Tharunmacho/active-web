import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connection to main activ-db (for applications, users, etc.)
const mainDbConnection = mongoose.createConnection(
  process.env.MONGODB_URI || 'mongodb+srv://activapp2025_db_user:o6xFHfqzLXM6LUaa@cluster1.gf7usct.mongodb.net/activ-db?retryWrites=true&w=majority'
);

// Connection to adminsdb (for admin authentication)
const adminDbConnection = mongoose.createConnection(
  process.env.MONGODB_URI?.replace('/activ-db', '/adminsdb') || 
  'mongodb+srv://activapp2025_db_user:o6xFHfqzLXM6LUaa@cluster1.gf7usct.mongodb.net/adminsdb?retryWrites=true&w=majority'
);

mainDbConnection.on('connected', () => {
  console.log('✅ Connected to activ-db (main database)');
});

mainDbConnection.on('error', (err) => {
  console.error('❌ Main DB connection error:', err);
});

adminDbConnection.on('connected', () => {
  console.log('✅ Connected to adminsdb (admin database)');
});

adminDbConnection.on('error', (err) => {
  console.error('❌ Admin DB connection error:', err);
});

export { mainDbConnection, adminDbConnection };
export default mainDbConnection;
