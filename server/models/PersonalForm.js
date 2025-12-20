import mongoose from 'mongoose';

const personalFormSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WebUser',
    required: true,
    unique: true
  },
  name: {
    type: String,
    default: ''
  },
  phoneNumber: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  state: {
    type: String,
    default: ''
  },
  district: {
    type: String,
    default: ''
  },
  block: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  religion: {
    type: String,
    default: ''
  },
  socialCategory: {
    type: String,
    default: ''
  },
  isLocked: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const PersonalForm = mongoose.model('PersonalForm', personalFormSchema, 'additional form for personal information 1');

export default PersonalForm;
