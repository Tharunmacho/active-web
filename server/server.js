import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import compression from 'compression';
import connectDB from './src/config/database.js';

// Feature Routes
import authRoutes from './src/features/member/routes/authRoutes.js';
import profileRoutes from './src/features/member/routes/profileRoutes.js';
import personalFormRoutes from './src/features/member/routes/personalFormRoutes.js';
import businessFormRoutes from './src/features/member/routes/businessFormRoutes.js';
import financialFormRoutes from './src/features/member/routes/financialFormRoutes.js';
import declarationFormRoutes from './src/features/member/routes/declarationFormRoutes.js';
import applicationRoutes from './src/features/member/routes/applicationRoutes.js';
import companyRoutes from './src/features/business/routes/companyRoutes.js';
import productRoutes from './src/features/business/routes/productRoutes.js';
import adminRoutes from './src/features/admin/routes/adminRoutes.js';
import paymentRoutes from './src/features/payment/routes/paymentRoutes.js';
import locationRoutes from './src/shared/utils/locationRoutes.js';
import memberRoutes from './routes/memberRoutes.js';

// Shared Middleware
import { errorHandler } from './src/shared/middleware/errorHandler.js';

// Load env vars
dotenv.config();

const app = express();

// Security & Performance Middleware
app.use(compression()); // Compress all responses
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Disable x-powered-by header for security
app.disable('x-powered-by');

// Debug middleware - log all requests
app.use((req, res, next) => {
  console.log(`📍 ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/personal-form', personalFormRoutes);
app.use('/api/business-form', businessFormRoutes);
app.use('/api/financial-form', financialFormRoutes);
app.use('/api/declaration-form', declarationFormRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/members', memberRoutes);

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
