import mongoose from 'mongoose';

const rsvpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    status: {
      type: String,
      required: true,
      enum: ['yes', 'no', 'maybe']
    },
    respondedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    attended: {
      type: Boolean,
      default: false
    },
    markedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  location: {
    type: String,
    trim: true,
    default: ''
  },
  startAt: {
    type: Date,
    required: true,
    index: true
  },
  endAt: {
    type: Date,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  rsvps: {
    type: [rsvpSchema],
    default: []
  },
  attendance: {
    type: [attendanceSchema],
    default: []
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

eventSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

eventSchema.index({ startAt: 1 });

const Event = mongoose.model('Event', eventSchema);

export default Event;
