import express from 'express';
import Temple from '../models/Temple.js';
import User from '../models/User.js';
import { verifyToken } from './auth.js';

const router = express.Router();

// Get all temples
router.get('/', async (req, res) => {
  try {
    const { city, state, active } = req.query;
    let query = {};
    
    if (city) query.city = new RegExp(city, 'i');
    if (state) query.state = new RegExp(state, 'i');
    if (active !== undefined) query.isActive = active === 'true';
    
    const temples = await Temple.find(query)
      .select('-__v')
      .sort({ name: 1 });
    
    res.json({
      success: true,
      count: temples.length,
      temples
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single temple
router.get('/:id', async (req, res) => {
  try {
    const temple = await Temple.findById(req.params.id)
      .populate('akshayaPatraKitchen', 'name city capacity.mealsPerDay');
    
    if (!temple) {
      return res.status(404).json({ success: false, message: 'Temple not found' });
    }
    
    // Get devotees count
    const devoteesCount = await User.countDocuments({ temple: temple._id });
    
    res.json({
      success: true,
      temple: {
        ...temple.toObject(),
        devoteesCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new temple (admin only)
router.post('/', verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    
    const temple = new Temple(req.body);
    await temple.save();
    
    res.status(201).json({
      success: true,
      message: 'Temple created successfully',
      temple
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update temple (admin only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    
    const temple = await Temple.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!temple) {
      return res.status(404).json({ success: false, message: 'Temple not found' });
    }
    
    res.json({
      success: true,
      message: 'Temple updated successfully',
      temple
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get temple devotees
router.get('/:id/devotees', async (req, res) => {
  try {
    const { page = 1, limit = 20, initiation } = req.query;
    
    let query = { temple: req.params.id };
    if (initiation) query.initiationStatus = initiation;
    
    const devotees = await User.find(query)
      .select('name spiritualName initiationStatus serviceRoles joinDate')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ joinDate: -1 });
    
    const count = await User.countDocuments(query);
    
    res.json({
      success: true,
      count,
      devotees,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get temple statistics
router.get('/:id/statistics', async (req, res) => {
  try {
    const templeId = req.params.id;
    
    const stats = await User.aggregate([
      { $match: { temple: new mongoose.Types.ObjectId(templeId) } },
      {
        $group: {
          _id: null,
          totalDevotees: { $sum: 1 },
          initiatedDevotees: {
            $sum: { $cond: [{ $ne: ['$initiationStatus', 'none'] }, 1, 0] }
          },
          firstInitiation: {
            $sum: { $cond: [{ $eq: ['$initiationStatus', 'first'] }, 1, 0] }
          },
          secondInitiation: {
            $sum: { $cond: [{ $eq: ['$initiationStatus', 'second'] }, 1, 0] }
          },
          guides: { $sum: { $cond: ['$isGuide', 1, 0] } },
          students: { $sum: { $cond: [{ $eq: ['$userType', 'student'] }, 1, 0] } }
        }
      }
    ]);
    
    res.json({
      success: true,
      statistics: stats[0] || {
        totalDevotees: 0,
        initiatedDevotees: 0,
        firstInitiation: 0,
        secondInitiation: 0,
        guides: 0,
        students: 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
