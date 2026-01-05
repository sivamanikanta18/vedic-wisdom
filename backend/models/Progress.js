import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  userEmail: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  dateString: {
    type: String,
    required: true
  },
  roundsCompleted: {
    type: Number,
    default: 0,
    min: 0
  },
  chantingMinutes: {
    type: Number,
    default: 0,
    min: 0
  },
  lastChanted: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for userId and date
progressSchema.index({ userId: 1, dateString: 1 }, { unique: true });

// Update the updatedAt timestamp before saving
progressSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Progress = mongoose.model('Progress', progressSchema);

export default Progress;
