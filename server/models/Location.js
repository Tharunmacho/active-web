import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true,
    trim: true
  },
  district: {
    type: String,
    required: true,
    trim: true
  },
  blocks: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  collection: 'locations'
});

// Create compound index for faster queries
locationSchema.index({ state: 1, district: 1 });

const Location = mongoose.model('Location', locationSchema);

export default Location;
