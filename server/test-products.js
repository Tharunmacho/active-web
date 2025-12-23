import mongoose from 'mongoose';
import Product from './models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

async function testProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const totalProducts = await Product.countDocuments();
    console.log(`\n📦 Total products in database: ${totalProducts}`);
    
    const activeProducts = await Product.countDocuments({ status: 'active' });
    console.log(`✅ Active products: ${activeProducts}`);
    
    if (totalProducts > 0) {
      console.log('\n📋 Sample products:');
      const products = await Product.find().limit(5).lean();
      products.forEach((product, index) => {
        console.log(`\n${index + 1}. ${product.productName}`);
        console.log(`   Description: ${product.description || 'N/A'}`);
        console.log(`   Category: ${product.category}`);
        console.log(`   Price: ₹${product.price}`);
        console.log(`   Status: ${product.status}`);
        console.log(`   User ID: ${product.userId}`);
        console.log(`   Company ID: ${product.companyId}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Connection closed');
  }
}

testProducts();
