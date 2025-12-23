import mongoose from 'mongoose';

const financialFormSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WebUser',
    required: true
  },
  pan: {
    type: String,
    trim: true,
    uppercase: true
  },
  gst: {
    type: String,
    trim: true,
    uppercase: true
  },
  udyam: {
    type: String,
    trim: true
  },
  filedITR: {
    type: String,
    enum: ['yes', 'no'],
    trim: true
  },
  itrYears: {
    type: String,
    trim: true
  },
  turnoverRange: {
    type: String,
    trim: true
  },
  turnover1: {
    type: String,
    trim: true
  },
  turnover2: {
    type: String,
    trim: true
  },
  turnover3: {
    type: String,
    trim: true
  },
  govtSchemes: {
    type: String,
    enum: ['yes', 'no'],
    trim: true
  },
  scheme1: {
    type: String,
    trim: true
  },
  scheme2: {
    type: String,
    trim: true
  },
  scheme3: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  collection: 'additional form for financial 3'
});

const FinancialForm = mongoose.model('FinancialForm', financialFormSchema);

export default FinancialForm;

