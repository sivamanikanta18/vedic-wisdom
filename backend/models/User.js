import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  communityProfile: {
    folk: {
      type: String,
      trim: true,
      default: ''
    },
    folkGuide: {
      type: String,
      trim: true,
      default: ''
    },
    templeCenter: {
      type: String,
      trim: true,
      default: ''
    }
  },
  preferences: {
    classRemindersEnabled: {
      type: Boolean,
      default: true
    },
    timezone: {
      type: String,
      trim: true,
      default: 'Asia/Kolkata'
    },
    language: {
      type: String,
      trim: true,
      default: 'en'
    }
  },
  spiritualData: {
    dailyRounds: {
      type: Number,
      default: 0
    },
    chantingTime: {
      type: Number,
      default: 0
    },
    notificationEnabled: {
      type: Boolean,
      default: true
    },
    reminderTime: {
      type: String,
      default: '06:00'
    }
  },
  games: {
    krishnaWordSearch: {
      bestScore: {
        type: Number,
        default: 0,
        min: 0
      },
      bestTimeMs: {
        type: Number,
        default: null,
        min: 0
      },
      lastPlayedAt: {
        type: Date,
        default: null
      }
    }
  },
  journeyStartDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON response
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', userSchema);

export default User;
