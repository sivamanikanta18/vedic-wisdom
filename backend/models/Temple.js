import mongoose from 'mongoose';

const templeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Temple name is required'],
    trim: true,
    unique: true
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
    required: [true, 'Address is required'],
    trim: true
  },
  contact: {
    phone: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    website: {
      type: String,
      trim: true
    }
  },
  leadership: [{
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    contact: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    }
  }],
  description: {
    type: String,
    trim: true
  },
  images: [{
    type: String
  }],
  programs: [{
    name: {
      type: String,
      required: true
    },
    schedule: {
      type: String
    },
    description: {
      type: String
    }
  }],
  statistics: {
    totalDevotees: {
      type: Number,
      default: 0
    },
    initiatedDevotees: {
      type: Number,
      default: 0
    },
    activeStudents: {
      type: Number,
      default: 0
    },
    totalEvents: {
      type: Number,
      default: 0
    }
  },
  akshayaPatraKitchen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Kitchen'
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

// Update timestamp on save
templeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Temple = mongoose.model('Temple', templeSchema);

export default Temple;
