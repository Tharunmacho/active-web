import Product from '../models/Product.js';
import Company from '../models/Company.js';

// @desc    Get all products for user
// @route   GET /api/products
// @access  Private
export const getProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    
    console.log('🔍 Fetching products for userId:', userId);
    
    const products = await Product.find({ userId })
      .populate('companyId', 'businessName logo')
      .sort({ createdAt: -1 });
    
    console.log(`✅ Found ${products.length} products`);
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private
export const getProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;
    
    const product = await Product.findOne({ _id: productId, userId })
      .populate('companyId', 'businessName logo');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('❌ Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private
export const createProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const productData = req.body;
    
    console.log('📝 Creating product for userId:', userId);
    console.log('📦 Product data:', JSON.stringify(productData, null, 2));
    
    // Validate required fields
    if (!productData.productName || !productData.category || productData.price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Product name, category, and price are required'
      });
    }

    // Validate price and stock quantity
    if (productData.price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price cannot be negative'
      });
    }

    if (productData.stockQuantity !== undefined && productData.stockQuantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Stock quantity cannot be negative'
      });
    }

    // Get active company if no companyId provided
    let companyId = productData.companyId;
    if (!companyId) {
      console.log('🔍 Looking for active company...');
      const activeCompany = await Company.findOne({ userId, isActive: true });
      console.log('📊 Active company:', activeCompany);
      
      if (!activeCompany) {
        return res.status(400).json({
          success: false,
          message: 'No active company found. Please create a company first or set one as active.'
        });
      }
      companyId = activeCompany._id;
      console.log('✅ Using active company:', companyId);
    }

    // Verify company exists and belongs to user
    const company = await Company.findOne({ _id: companyId, userId });
    if (!company) {
      console.log('❌ Company not found or does not belong to user');
      return res.status(400).json({
        success: false,
        message: 'Invalid company ID or company does not belong to user'
      });
    }
    
    console.log('✅ Company verified:', company.businessName);
    
    // Auto-set status based on stock quantity
    let status = 'active';
    if (productData.stockQuantity === 0) {
      status = 'out_of_stock';
    }
    
    console.log('💾 Creating product in database...');
    const product = await Product.create({
      userId,
      companyId,
      productName: productData.productName,
      description: productData.description,
      category: productData.category,
      sku: productData.sku,
      price: productData.price,
      stockQuantity: productData.stockQuantity || 0,
      productImage: productData.productImage,
      status: productData.status || status
    });
    
    console.log('✅ Product created with ID:', product._id);
    
    // Populate company info before sending response
    const populatedProduct = await Product.findById(product._id)
      .populate('companyId', 'businessName logo');
    
    console.log('📤 Sending success response');
    res.status(201).json({
      success: true,
      data: populatedProduct,
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('❌ Error creating product:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
export const updateProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;
    const productData = req.body;
    
    console.log('📝 Updating product:', productId);
    
    let product = await Product.findOne({ _id: productId, userId });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // If companyId is being changed, verify it belongs to user
    if (productData.companyId && productData.companyId !== product.companyId.toString()) {
      const company = await Company.findOne({ _id: productData.companyId, userId });
      if (!company) {
        return res.status(400).json({
          success: false,
          message: 'Invalid company ID or company does not belong to user'
        });
      }
    }
    
    // Update fields
    const allowedUpdates = ['productName', 'description', 'category', 'sku', 'price', 'stockQuantity', 'productImage', 'status', 'companyId'];
    allowedUpdates.forEach(field => {
      if (productData[field] !== undefined) {
        product[field] = productData[field];
      }
    });

    // Auto-update status if stock becomes 0
    if (product.stockQuantity === 0 && product.status === 'active') {
      product.status = 'out_of_stock';
    }
    
    await product.save();
    
    // Populate company info
    await product.populate('companyId', 'businessName logo');
    
    console.log('✅ Product updated:', product._id);
    
    res.status(200).json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('❌ Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
export const deleteProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;
    
    console.log('🗑️ Deleting product:', productId);
    
    const product = await Product.findOneAndDelete({ _id: productId, userId });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    console.log('✅ Product deleted');
    
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};

// @desc    Get products by company
// @route   GET /api/products/company/:companyId
// @access  Private
export const getProductsByCompany = async (req, res) => {
  try {
    const userId = req.user.id;
    const companyId = req.params.companyId;
    
    // Verify company belongs to user
    const company = await Company.findOne({ _id: companyId, userId });
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }
    
    const products = await Product.find({ userId, companyId })
      .populate('companyId', 'businessName logo')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('❌ Error fetching products by company:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};
