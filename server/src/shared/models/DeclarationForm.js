import mongoose from 'mongoose';

const declarationFormSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WebUser',
    required: true,
    unique: true
  },
  sisterConcerns: {
    type: String,
    default: ''
  },
  companyNames: {
    type: [String],
    default: []
  },
  declarationAccepted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const DeclarationForm = mongoose.model('DeclarationForm', declarationFormSchema, 'additional form for declaration 4');

export default DeclarationForm;

