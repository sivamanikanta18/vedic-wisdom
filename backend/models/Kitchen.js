import mongoose from 'mongoose';

const kitchenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Kitchen name is required'],
    trim: true
  },
  temple: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Temple'
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  address: {
    type: String,
    required: true
  },
  contact: {
    manager: {
      type: String
    },
    phone: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    }
  },
  capacity: {
    mealsPerDay: {
      type: Number,
      default: 0
    },
    schoolsSupported: {
      type: Number,
      default: 0
    },
    studentsFed: {
      type: Number,
      default: 0
    }
  },
  distributionHistory: [{
    date: {
      type: Date,
      required: true
    },
    mealsServed: {
      type: Number,
      default: 0
    },
    schoolsReached: {
      type: Number,
      default: 0
    },
    notes: {
      type: String
    }
  }],
  statistics: {
    totalMealsServed: {
      type: Number,
      default: 0
    },
    totalSchoolsSupported: {
      type: Number,
      default: 0
    },
    activeSince: {
      type: Date
    }
  },
  isActive: {
    type: Boolean,
    default: true
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

kitchenSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Kitchen = mongoose.model('Kitchen', kitchenSchema);

export default Kitchen;
