import mongoose from 'mongoose';

const additionalFormSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WebUser',
    required: true
  },
  // Step 1: Personal Details
  name: {
    type: String,
    trim: true
  },
  block: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  district: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  religion: {
    type: String,
    trim: true
  },
  socialCategory: {
    type: String,
    trim: true
  },
  
  // Step 2: Business Information
  doingBusiness: String,
  organization: String,
  constitution: String,
  businessTypes: [String],
  businessYear: String,
  employees: String,
  chamber: String,
  govtOrgs: [String],
  
  // Step 3: Financial & Compliance
  pan: String,
  gst: String,
  udyam: String,
  filedITR: String,
  itrYears: String,
  turnoverRange: String,
  turnover1: String,
  turnover2: String,
  turnover3: String,
  govtSchemes: String,
  
  // Step 4: Declaration
  sisterConcerns: String,
  companyNames: String,
  declarationAccepted: Boolean,
  
  // Status
  isLocked: {
    type: Boolean,
    default: false
  },
  completedSteps: {
    type: [Number],
    default: []
  }
}, {
  timestamps: true,
  collection: 'additional forms 1 to 4'
});

// Create index on userId for faster queries
additionalFormSchema.index({ userId: 1 });

const AdditionalForm = mongoose.model('AdditionalForm', additionalFormSchema);

export default AdditionalForm;

