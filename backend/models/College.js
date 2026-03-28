import mongoose from 'mongoose';

const collegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'College name is required'],
    trim: true
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
    trim: true
  },
  contactPerson: {
    name: {
      type: String
    },
    phone: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    },
    designation: {
      type: String
    }
  },
  temple: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Temple',
    required: true
  },
  assignedGuide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  programs: [{
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    schedule: {
      day: {
        type: String
      },
      time: {
        type: String
      },
      venue: {
        type: String
      }
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  statistics: {
    totalStudents: {
      type: Number,
      default: 0
    },
    activeStudents: {
      type: Number,
      default: 0
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

collegeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const College = mongoose.model('College', collegeSchema);

export default College;
