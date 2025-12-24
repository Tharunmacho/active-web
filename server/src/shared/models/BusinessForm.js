import mongoose from 'mongoose';

const businessFormSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WebUser',
    required: true
  },
  doingBusiness: {
    type: String,
    enum: ['yes', 'no'],
    required: true
  },
  organization: {
    type: String,
    trim: true
  },
  constitution: {
    type: String,
    trim: true
  },
  businessTypes: [{
    type: String,
    enum: ['Manufacturing', 'Services', 'Trade'],
    trim: true
  }],
  businessActivities: {
    type: String,
    trim: true
  },
  businessYear: {
    type: String,
    trim: true
  },
  employees: {
    type: String,
    trim: true
  },
  chamber: {
    type: String,
    enum: ['yes', 'no'],
    trim: true
  },
  chamberDetails: {
    type: String,
    trim: true
  },
  govtOrgs: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  collection: 'additional form for bussiness 2'
});

const BusinessForm = mongoose.model('BusinessForm', businessFormSchema);

export default BusinessForm;

