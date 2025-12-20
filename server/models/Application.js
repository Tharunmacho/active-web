import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  // Reference to the member who submitted
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WebUser',
    required: true
  },
  applicationId: {
    type: String,
    required: true
  },
  
  // Member information (cached for easy access)
  memberName: String,
  memberEmail: String,
  memberPhone: String,
  
  // Location details
  state: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  block: {
    type: String,
    required: true
  },
  city: String,
  
  // Member type
  memberType: {
    type: String,
    enum: ['aspirant', 'business'],
    required: true
  },
  
  // Application status - hierarchical approval flow
  status: {
    type: String,
    enum: [
      'pending_block_approval',    // Waiting for block admin
      'pending_district_approval',  // Block approved, waiting for district
      'pending_state_approval',     // District approved, waiting for state
      'approved',                   // Fully approved by all levels
      'rejected'                    // Rejected at any level
    ],
    default: 'pending_block_approval'
  },
  
  // Approval tracking
  approvals: {
    block: {
      adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
      adminName: String,
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
      remarks: String,
      actionDate: Date
    },
    district: {
      adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
      adminName: String,
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
      remarks: String,
      actionDate: Date
    },
    state: {
      adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
      adminName: String,
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
      remarks: String,
      actionDate: Date
    }
  },
  
  // Form data references
  personalFormId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PersonalForm'
  },
  businessFormId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BusinessForm'
  },
  financialFormId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FinancialForm'
  },
  declarationFormId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeclarationForm'
  },
  
  // Payment details (after final approval)
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentAmount: Number,
  paymentDate: Date,
  transactionId: String,
  
  // Detailed payment information
  paymentDetails: {
    paymentId: String,           // Unique payment ID
    instamojoPaymentRequestId: String, // Instamojo payment request ID
    instamojoPaymentId: String,  // Instamojo payment ID after completion
    planType: String,            // Plan name (e.g., "Aspirant Plan", "Basic Plan", "Intermediate Plan", "Ideal Plan")
    planAmount: Number,          // Base membership amount
    supportAmount: Number,       // Optional support/donation amount
    totalAmount: Number,         // Total paid amount
    paymentMethod: {
      type: String,
      enum: ['card', 'upi', 'netbanking']
    },
    transactionId: String,       // Gateway transaction ID
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed']
    },
    initiatedAt: Date,
    completedAt: Date,
    failedAt: Date
  },
  
  submittedAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
applicationSchema.index({ userId: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ state: 1, district: 1, block: 1 });
applicationSchema.index({ applicationId: 1 });

export default mongoose.model('Application', applicationSchema, 'applications');
