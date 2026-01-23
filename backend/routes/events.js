import express from 'express';
import mongoose from 'mongoose';
import { verifyToken } from './auth.js';
import Event from '../models/Event.js';
import User from '../models/User.js';

const router = express.Router();

function parseAdminEmails() {
  const raw = process.env.ADMIN_EMAILS || '';
  return new Set(
    raw
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean)
  );
}

async function requireAdmin(req, res, next) {
  try {
    const adminEmails = parseAdminEmails();
    if (adminEmails.size === 0) {
      return res.status(403).json({ success: false, message: 'Admin access not configured' });
    }

    const user = await User.findById(req.userId).select('email').lean();
    const email = (user?.email || '').toLowerCase();

    if (!adminEmails.has(email)) {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    req.isAdmin = true;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error checking admin access', error: error.message });
  }
}

function getMyRsvp(event, userId) {
  const match = (event?.rsvps || []).find(r => String(r.userId) === String(userId));
  return match ? { status: match.status, respondedAt: match.respondedAt } : null;
}

function getMyAttendance(event, userId) {
  const match = (event?.attendance || []).find(a => String(a.userId) === String(userId));
  return match ? { attended: !!match.attended, markedAt: match.markedAt } : null;
}

function buildPublicEvent(event, userId) {
  const yesCount = (event?.rsvps || []).filter(r => r.status === 'yes').length;
  const noCount = (event?.rsvps || []).filter(r => r.status === 'no').length;
  const maybeCount = (event?.rsvps || []).filter(r => r.status === 'maybe').length;

  return {
    id: event._id,
    title: event.title,
    description: event.description,
    location: event.location,
    startAt: event.startAt,
    endAt: event.endAt,
    createdBy: event.createdBy,
    rsvpCounts: {
      yes: yesCount,
      no: noCount,
      maybe: maybeCount,
      total: (event?.rsvps || []).length
    },
    myRsvp: getMyRsvp(event, userId),
    myAttendance: getMyAttendance(event, userId),
    createdAt: event.createdAt,
    updatedAt: event.updatedAt
  };
}

router.use(verifyToken);

router.get('/', async (req, res) => {
  try {
    const from = req.query.from ? new Date(req.query.from) : null;
    const to = req.query.to ? new Date(req.query.to) : null;

    const query = {};
    if (from && !Number.isNaN(from.getTime())) query.startAt = { ...(query.startAt || {}), $gte: from };
    if (to && !Number.isNaN(to.getTime())) query.startAt = { ...(query.startAt || {}), $lte: to };

    const events = await Event.find(query).sort({ startAt: 1 }).lean();

    return res.json({
      success: true,
      events: events.map(e => buildPublicEvent(e, req.userId))
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching events', error: error.message });
  }
});

router.get('/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ success: false, message: 'Invalid event id' });
    }

    const adminEmails = parseAdminEmails();
    const user = await User.findById(req.userId).select('email').lean();
    const isAdmin = adminEmails.size > 0 && adminEmails.has((user?.email || '').toLowerCase());

    if (isAdmin) {
      const event = await Event.findById(eventId)
        .populate('createdBy', 'name email')
        .populate('rsvps.userId', 'name email')
        .populate('attendance.userId', 'name email')
        .lean();
      if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }
      return res.json({ success: true, event });
    }

    const event = await Event.findById(eventId).lean();
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    return res.json({ success: true, event: buildPublicEvent(event, req.userId) });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching event', error: error.message });
  }
});

router.post('/', requireAdmin, async (req, res) => {
  try {
    const { title, description, location, startAt, endAt } = req.body || {};

    if (typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'title is required' });
    }

    const start = new Date(startAt);
    if (!startAt || Number.isNaN(start.getTime())) {
      return res.status(400).json({ success: false, message: 'startAt must be a valid date' });
    }

    const end = endAt ? new Date(endAt) : null;
    if (endAt && Number.isNaN(end.getTime())) {
      return res.status(400).json({ success: false, message: 'endAt must be a valid date' });
    }

    const event = new Event({
      title: title.trim(),
      description: typeof description === 'string' ? description.trim() : '',
      location: typeof location === 'string' ? location.trim() : '',
      startAt: start,
      endAt: end,
      createdBy: req.userId
    });

    await event.save();

    return res.status(201).json({ success: true, message: 'Event created', event });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error creating event', error: error.message });
  }
});

router.put('/:eventId', requireAdmin, async (req, res) => {
  try {
    const { eventId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ success: false, message: 'Invalid event id' });
    }

    const updates = {};
    if (typeof req.body?.title === 'string') updates.title = req.body.title.trim();
    if (typeof req.body?.description === 'string') updates.description = req.body.description.trim();
    if (typeof req.body?.location === 'string') updates.location = req.body.location.trim();

    if (req.body?.startAt !== undefined) {
      const start = new Date(req.body.startAt);
      if (Number.isNaN(start.getTime())) {
        return res.status(400).json({ success: false, message: 'startAt must be a valid date' });
      }
      updates.startAt = start;
    }

    if (req.body?.endAt !== undefined) {
      const end = req.body.endAt ? new Date(req.body.endAt) : null;
      if (req.body.endAt && Number.isNaN(end.getTime())) {
        return res.status(400).json({ success: false, message: 'endAt must be a valid date' });
      }
      updates.endAt = end;
    }

    updates.updatedAt = new Date();

    const event = await Event.findByIdAndUpdate(eventId, { $set: updates }, { new: true });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    return res.json({ success: true, message: 'Event updated', event });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating event', error: error.message });
  }
});

router.delete('/:eventId', requireAdmin, async (req, res) => {
  try {
    const { eventId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ success: false, message: 'Invalid event id' });
    }

    const event = await Event.findByIdAndDelete(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    return res.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error deleting event', error: error.message });
  }
});

router.post('/:eventId/rsvp', async (req, res) => {
  try {
    const { eventId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ success: false, message: 'Invalid event id' });
    }

    const status = typeof req.body?.status === 'string' ? req.body.status.toLowerCase() : '';
    if (!['yes', 'no', 'maybe'].includes(status)) {
      return res.status(400).json({ success: false, message: 'status must be yes, no, or maybe' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const idx = event.rsvps.findIndex(r => String(r.userId) === String(req.userId));
    const now = new Date();
    if (idx >= 0) {
      event.rsvps[idx].status = status;
      event.rsvps[idx].respondedAt = now;
    } else {
      event.rsvps.push({ userId: req.userId, status, respondedAt: now });
    }

    await event.save();

    return res.json({
      success: true,
      message: 'RSVP updated',
      event: buildPublicEvent(event.toObject(), req.userId)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating RSVP', error: error.message });
  }
});

router.post('/:eventId/attendance', requireAdmin, async (req, res) => {
  try {
    const { eventId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ success: false, message: 'Invalid event id' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const records = Array.isArray(req.body?.records)
      ? req.body.records
      : req.body?.userId
        ? [{ userId: req.body.userId, attended: req.body.attended }]
        : [];

    if (records.length === 0) {
      return res.status(400).json({ success: false, message: 'Provide records[] or userId/attended' });
    }

    const now = new Date();
    for (const record of records) {
      if (!record?.userId) continue;
      if (!mongoose.Types.ObjectId.isValid(record.userId)) continue;

      const attended = record.attended !== undefined ? !!record.attended : true;
      const idx = event.attendance.findIndex(a => String(a.userId) === String(record.userId));
      if (idx >= 0) {
        event.attendance[idx].attended = attended;
        event.attendance[idx].markedAt = now;
      } else {
        event.attendance.push({ userId: record.userId, attended, markedAt: now });
      }
    }

    await event.save();

    const populated = await Event.findById(eventId)
      .populate('createdBy', 'name email')
      .populate('rsvps.userId', 'name email')
      .populate('attendance.userId', 'name email')
      .lean();

    return res.json({ success: true, message: 'Attendance updated', event: populated || event });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating attendance', error: error.message });
  }
});

export default router;
