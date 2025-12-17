import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://activapp2025_db_user:o6xFHfqzLXM6LUaa@cluster1.gf7usct.mongodb.net/activ-db?retryWrites=true&w=majority&appName=Cluster1';

const checkData = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const db = mongoose.connection.db;

        console.log('📦 PRODUCTS:');
        const products = await db.collection('products').find().toArray();
        console.log(`Found ${products.length} products:`);
        products.forEach((product, index) => {
            console.log(`\n${index + 1}. ${product.productName}`);
            console.log(`   Category: ${product.category}`);
            console.log(`   Price: ₹${product.price}`);
            console.log(`   Stock: ${product.stockQuantity}`);
            console.log(`   Status: ${product.status}`);
            console.log(`   Created: ${product.createdAt}`);
        });

        console.log('\n\n🏢 COMPANIES:');
        const companies = await db.collection('companies').find().toArray();
        console.log(`Found ${companies.length} companies:`);
        companies.forEach((company, index) => {
            console.log(`\n${index + 1}. ${company.companyName || company.businessName}`);
            console.log(`   Active: ${company.isActive}`);
            console.log(`   Category: ${company.businessCategory || 'N/A'}`);
        });

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Disconnected from MongoDB');
        process.exit(0);
    }
};

checkData();
