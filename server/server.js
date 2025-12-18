import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import personalFormRoutes from './routes/personalFormRoutes.js';
import businessFormRoutes from './routes/businessFormRoutes.js';
import businessProfileRoutes from './routes/businessProfileRoutes.js';
import financialFormRoutes from './routes/financialFormRoutes.js';
import declarationFormRoutes from './routes/declarationFormRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import productRoutes from './routes/productRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/personal-form', personalFormRoutes);
app.use('/api/business-form', businessFormRoutes);
app.use('/api/business-profile', businessProfileRoutes);
app.use('/api/financial-form', financialFormRoutes);
app.use('/api/declaration-form', declarationFormRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/products', productRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

// Start server only after database connection
const startServer = async () => {
  try {
    // Connect to database first
    await connectDB();
    
    // Then start the server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📡 Server is ready to accept connections`);
    });

    server.on('error', (error) => {
      console.error('❌ Server error:', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (error) => {
      console.error('❌ Unhandled Promise Rejection:', error);
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
