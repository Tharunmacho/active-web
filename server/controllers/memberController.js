import WebUser from '../src/shared/models/WebUser.js';
import Application from '../src/shared/models/Application.js';
import Company from '../src/shared/models/Company.js';
import Product from '../src/shared/models/Product.js';

// @desc    Get all paid members with their products
// @route   GET /api/members/paid-members
// @access  Private
export const getPaidMembers = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { limit = 20, page = 1 } = req.query;
    
    // Find all applications with completed payment status
    const paidApplications = await Application.find({
      paymentStatus: 'completed',
      userId: { $ne: currentUserId } // Exclude current user
    })
    .select('userId memberName memberEmail')
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit))
    .lean();
    
    if (!paidApplications || paidApplications.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }
    
    // Get user IDs
    const userIds = paidApplications.map(app => app.userId);
    
    // Fetch user details
    const users = await WebUser.find({ _id: { $in: userIds } })
      .select('fullName email profilePicture')
      .lean();
    
    // Fetch companies for these users
    const companies = await Company.find({ userId: { $in: userIds } })
      .select('userId businessName businessType logo')
      .lean();
    
    // Fetch products for these users
    const products = await Product.find({ userId: { $in: userIds }, status: 'active' })
      .select('userId productName productImage price category')
      .limit(100)
      .lean();
    
    // Group products by userId
    const productsByUser = {};
    products.forEach(product => {
      const userId = product.userId.toString();
      if (!productsByUser[userId]) {
        productsByUser[userId] = [];
      }
      productsByUser[userId].push(product);
    });
    
    // Group companies by userId
    const companiesByUser = {};
    companies.forEach(company => {
      const userId = company.userId.toString();
      if (!companiesByUser[userId]) {
        companiesByUser[userId] = [];
      }
      companiesByUser[userId].push(company);
    });
    
    // Combine all data
    const membersData = users.map(user => {
      const userId = user._id.toString();
      return {
        userId: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePicture: user.profilePicture,
        companies: companiesByUser[userId] || [],
        products: (productsByUser[userId] || []).slice(0, 6), // Limit to 6 products per user
        productCount: (productsByUser[userId] || []).length
      };
    });
    
    res.status(200).json({
      success: true,
      count: membersData.length,
      page: parseInt(page),
      data: membersData
    });
  } catch (error) {
    console.error('Error fetching paid members:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching paid members',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
