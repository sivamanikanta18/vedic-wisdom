import express from 'express';
import College from '../models/College.js';
import User from '../models/User.js';
import { verifyToken } from './auth.js';

const router = express.Router();

// Get all colleges
router.get('/', async (req, res) => {
  try {
    const { temple, city, state } = req.query;
    let query = {};
    
    if (temple) query.temple = temple;
    if (city) query.city = new RegExp(city, 'i');
    if (state) query.state = new RegExp(state, 'i');
    
    const colleges = await College.find(query)
      .populate('temple', 'name city')
      .populate('assignedGuide', 'name spiritualName')
      .select('-__v')
      .sort({ name: 1 });
    
    res.json({
      success: true,
      count: colleges.length,
      colleges
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single college
router.get('/:id', async (req, res) => {
  try {
    const college = await College.findById(req.params.id)
      .populate('temple', 'name city state contact')
      .populate('assignedGuide', 'name spiritualName contact')
      .populate('students', 'name spiritualName initiationStatus joinDate');
    
    if (!college) {
      return res.status(404).json({ success: false, message: 'College not found' });
    }
    
    res.json({
      success: true,
      college
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new college (admin/guide only)
router.post('/', verifyToken, async (req, res) => {
  try {
    if (!['admin', 'guide'].includes(req.user.userType)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }
    
    const college = new College(req.body);
    await college.save();
    
    res.status(201).json({
      success: true,
      message: 'College added successfully',
      college
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update college
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    
    if (!college) {
      return res.status(404).json({ success: false, message: 'College not found' });
    }
    
    // Check permissions
    const canEdit = req.user.userType === 'admin' || 
                   (req.user.userType === 'guide' && college.assignedGuide?.toString() === req.user.id);
    
    if (!canEdit) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }
    
    const updated = await College.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'College updated successfully',
      college: updated
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Assign guide to college
router.put('/:id/assign-guide', verifyToken, async (req, res) => {
  try {
    const { guideId } = req.body;
    
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    
    const guide = await User.findById(guideId);
    if (!guide || !guide.isGuide) {
      return res.status(400).json({ success: false, message: 'Invalid guide' });
    }
    
    const college = await College.findByIdAndUpdate(
      req.params.id,
      { assignedGuide: guideId },
      { new: true }
    ).populate('assignedGuide', 'name spiritualName');
    
    res.json({
      success: true,
      message: 'Guide assigned successfully',
      college
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Add student to college
router.post('/:id/students', verifyToken, async (req, res) => {
  try {
    const { studentId } = req.body;
    
    const college = await College.findById(req.params.id);
    if (!college) {
      return res.status(404).json({ success: false, message: 'College not found' });
    }
    
    // Check permissions
    const canEdit = req.user.userType === 'admin' || 
                   college.assignedGuide?.toString() === req.user.id;
    
    if (!canEdit) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }
    
    // Add student
    if (!college.students.includes(studentId)) {
      college.students.push(studentId);
      college.statistics.totalStudents = college.students.length;
      await college.save();
    }
    
    // Update student's college reference
    await User.findByIdAndUpdate(studentId, { 
      college: college._id,
      userType: 'student'
    });
    
    res.json({
      success: true,
      message: 'Student added successfully'
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get college students
router.get('/:id/students', async (req, res) => {
  try {
    const students = await User.find({ college: req.params.id })
      .select('name spiritualName initiationStatus serviceRoles joinDate assignedGuide')
      .populate('assignedGuide', 'name spiritualName');
    
    res.json({
      success: true,
      count: students.length,
      students
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
