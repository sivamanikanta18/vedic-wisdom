import express from 'express';
import Event from '../models/Event.js';
import User from '../models/User.js';
import { verifyToken } from './auth.js';

const router = express.Router();

// Get all events for the logged-in guide or admin (admin sees all events)
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || (user.userType !== 'folk_guide' && user.userType !== 'admin')) {
      return res.status(403).json({ success: false, message: 'Only guides and admins can access this' });
    }

    // Admin sees all events, guide sees only their events
    const query = user.userType === 'admin' ? {} : { createdBy: req.userId };
    const events = await Event.find(query)
      .sort({ startAt: -1 })
      .lean();

    res.json({ success: true, events });
  } catch (error) {
    console.error('Get guide events error:', error);
    res.status(500).json({ success: false, message: 'Error fetching events' });
  }
});

// Create new event (guide or admin)
router.post('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || (user.userType !== 'folk_guide' && user.userType !== 'admin')) {
      return res.status(403).json({ success: false, message: 'Only guides and admins can create events' });
    }

    const { title, description, location, startAt, endAt, college } = req.body;

    if (!title || !startAt) {
      return res.status(400).json({ success: false, message: 'Title and date are required' });
    }

    const event = new Event({
      title,
      description: description || '',
      location: location || '',
      startAt: new Date(startAt),
      endAt: endAt ? new Date(endAt) : null,
      createdBy: req.userId,
      college: college || '',
      rsvps: [],
      attendance: []
    });

    await event.save();

    res.status(201).json({ success: true, event, message: 'Event created successfully' });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ success: false, message: 'Error creating event' });
  }
});

// Update event attendance (guide or admin)
router.post('/:eventId/attendance', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || (user.userType !== 'folk_guide' && user.userType !== 'admin')) {
      return res.status(403).json({ success: false, message: 'Only guides and admins can take attendance' });
    }

    const { studentId, present } = req.body;
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Admin can update any event, guide can only update their own
    if (user.userType !== 'admin' && event.createdBy.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'You can only update your own events' });
    }

    // Update or add attendance
    const existingIndex = event.attendance.findIndex(a => a.userId.toString() === studentId);
    if (existingIndex >= 0) {
      event.attendance[existingIndex].attended = present;
      event.attendance[existingIndex].markedAt = new Date();
    } else {
      event.attendance.push({
        userId: studentId,
        attended: present,
        markedAt: new Date()
      });
    }

    await event.save();

    res.json({ success: true, message: 'Attendance updated' });
  } catch (error) {
    console.error('Update attendance error:', error);
    res.status(500).json({ success: false, message: 'Error updating attendance' });
  }
});

// Get event details with attendance (guide or admin)
router.get('/:eventId', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || (user.userType !== 'folk_guide' && user.userType !== 'admin')) {
      return res.status(403).json({ success: false, message: 'Only guides and admins can access this' });
    }

    const { eventId } = req.params;

    const event = await Event.findById(eventId)
      .populate('attendance.userId', 'name email')
      .lean();

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Admin can view any event, guide can only view their own
    if (user.userType !== 'admin' && event.createdBy.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'You can only view your own events' });
    }

    // Get all students for admin, or guide's students for guide
    let students;
    if (user.userType === 'admin') {
      students = await User.find({ userType: 'folk_boy' }).select('name email');
    } else {
      const guide = await User.findById(req.userId).populate('students', 'name email');
      students = guide.students || [];
    }

    res.json({ 
      success: true, 
      event,
      students: students || []
    });
  } catch (error) {
    console.error('Get event details error:', error);
    res.status(500).json({ success: false, message: 'Error fetching event details' });
  }
});

// Delete event (guide or admin)
router.delete('/:eventId', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || (user.userType !== 'folk_guide' && user.userType !== 'admin')) {
      return res.status(403).json({ success: false, message: 'Only guides and admins can delete events' });
    }

    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Admin can delete any event, guide can only delete their own
    if (user.userType !== 'admin' && event.createdBy.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'You can only delete your own events' });
    }

    await Event.findByIdAndDelete(eventId);

    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ success: false, message: 'Error deleting event' });
  }
});

// ========== FOLK BOY RSVP ROUTES ==========

// Get all upcoming events for Folk Boys to RSVP
router.get('/folk/upcoming', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.userType !== 'folk_boy') {
      return res.status(403).json({ success: false, message: 'Only folk boys can access this' });
    }

    // Get all events starting from today
    const today = new Date();
    const events = await Event.find({ startAt: { $gte: today } })
      .sort({ startAt: 1 })
      .populate('createdBy', 'name')
      .lean();

    // Add user's RSVP status to each event
    const eventsWithRSVP = events.map(event => {
      const userRSVP = event.rsvps?.find(r => r.userId.toString() === req.userId);
      return {
        ...event,
        userRSVP: userRSVP ? userRSVP.status : null
      };
    });

    res.json({ success: true, events: eventsWithRSVP });
  } catch (error) {
    console.error('Get upcoming events error:', error);
    res.status(500).json({ success: false, message: 'Error fetching events' });
  }
});

// RSVP to an event (Yes/No/Maybe)
router.post('/:eventId/rsvp', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.userType !== 'folk_boy') {
      return res.status(403).json({ success: false, message: 'Only folk boys can RSVP' });
    }

    const { eventId } = req.params;
    const { status } = req.body; // 'yes', 'no', 'maybe'

    if (!['yes', 'no', 'maybe'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be yes, no, or maybe' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check if event is in the future
    if (new Date(event.startAt) < new Date()) {
      return res.status(400).json({ success: false, message: 'Cannot RSVP to past events' });
    }

    // Update or add RSVP
    const existingIndex = event.rsvps.findIndex(r => r.userId.toString() === req.userId);
    if (existingIndex >= 0) {
      event.rsvps[existingIndex].status = status;
      event.rsvps[existingIndex].respondedAt = new Date();
    } else {
      event.rsvps.push({
        userId: req.userId,
        status,
        respondedAt: new Date()
      });
    }

    await event.save();

    res.json({ success: true, message: `RSVP updated to ${status}` });
  } catch (error) {
    console.error('RSVP error:', error);
    res.status(500).json({ success: false, message: 'Error updating RSVP' });
  }
});

// Get event with RSVP'd students (for Guide/Admin attendance)
router.get('/:eventId/attendance-list', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || (user.userType !== 'folk_guide' && user.userType !== 'admin')) {
      return res.status(403).json({ success: false, message: 'Only guides and admins can access this' });
    }

    const { eventId } = req.params;

    const event = await Event.findById(eventId)
      .populate('rsvps.userId', 'name email')
      .populate('attendance.userId', 'name email')
      .lean();

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Admin can view any event, guide can only view their own
    if (user.userType !== 'admin' && event.createdBy.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'You can only view your own events' });
    }

    // Get students who RSVP'd Yes
    const registeredStudents = event.rsvps
      ?.filter(r => r.status === 'yes')
      ?.map(r => ({
        ...r.userId,
        rsvpStatus: r.status,
        attended: event.attendance?.find(a => a.userId._id.toString() === r.userId._id.toString())?.attended || false
      })) || [];

    res.json({ 
      success: true, 
      event: {
        _id: event._id,
        title: event.title,
        startAt: event.startAt,
        location: event.location
      },
      registeredStudents
    });
  } catch (error) {
    console.error('Get attendance list error:', error);
    res.status(500).json({ success: false, message: 'Error fetching attendance list' });
  }
});

export default router;
