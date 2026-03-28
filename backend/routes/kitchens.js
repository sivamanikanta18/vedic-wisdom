import express from 'express';
import Kitchen from '../models/Kitchen.js';
import { verifyToken } from './auth.js';

const router = express.Router();

// Get all kitchens
router.get('/', async (req, res) => {
  try {
    const { city, state, temple } = req.query;
    let query = {};
    
    if (city) query.city = new RegExp(city, 'i');
    if (state) query.state = new RegExp(state, 'i');
    if (temple) query.temple = temple;
    
    const kitchens = await Kitchen.find(query)
      .populate('temple', 'name city')
      .select('-__v')
      .sort({ city: 1 });
    
    res.json({
      success: true,
      count: kitchens.length,
      kitchens
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single kitchen
router.get('/:id', async (req, res) => {
  try {
    const kitchen = await Kitchen.findById(req.params.id)
      .populate('temple', 'name city state');
    
    if (!kitchen) {
      return res.status(404).json({ success: false, message: 'Kitchen not found' });
    }
    
    res.json({ success: true, kitchen });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new kitchen (admin only)
router.post('/', verifyToken, async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    
    const kitchen = new Kitchen(req.body);
    await kitchen.save();
    
    res.status(201).json({
      success: true,
      message: 'Kitchen created successfully',
      kitchen
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update kitchen (admin only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    
    const kitchen = await Kitchen.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!kitchen) {
      return res.status(404).json({ success: false, message: 'Kitchen not found' });
    }
    
    res.json({
      success: true,
      message: 'Kitchen updated successfully',
      kitchen
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Add distribution record
router.post('/:id/distribution', verifyToken, async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    
    const { date, mealsServed, schoolsReached, notes } = req.body;
    
    const kitchen = await Kitchen.findById(req.params.id);
    
    if (!kitchen) {
      return res.status(404).json({ success: false, message: 'Kitchen not found' });
    }
    
    // Add distribution record
    kitchen.distributionHistory.push({
      date: new Date(date),
      mealsServed,
      schoolsReached,
      notes
    });
    
    // Update statistics
    kitchen.statistics.totalMealsServed += mealsServed;
    kitchen.statistics.totalSchoolsSupported = Math.max(
      kitchen.statistics.totalSchoolsSupported,
      schoolsReached
    );
    
    await kitchen.save();
    
    res.json({
      success: true,
      message: 'Distribution record added',
      kitchen
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get kitchen statistics
router.get('/:id/statistics', async (req, res) => {
  try {
    const kitchen = await Kitchen.findById(req.params.id);
    
    if (!kitchen) {
      return res.status(404).json({ success: false, message: 'Kitchen not found' });
    }
    
    // Calculate monthly statistics
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    
    const monthlyStats = kitchen.distributionHistory.filter(
      record => new Date(record.date) >= thirtyDaysAgo
    );
    
    const monthlyMeals = monthlyStats.reduce((sum, record) => sum + record.mealsServed, 0);
    const monthlySchools = monthlyStats.reduce((sum, record) => sum + record.schoolsReached, 0);
    
    res.json({
      success: true,
      statistics: {
        total: kitchen.statistics,
        last30Days: {
          mealsServed: monthlyMeals,
          schoolsReached: monthlySchools,
          averageDailyMeals: Math.round(monthlyMeals / 30)
        },
        capacity: kitchen.capacity
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get distribution history
router.get('/:id/distribution', async (req, res) => {
  try {
    const { page = 1, limit = 30 } = req.query;
    
    const kitchen = await Kitchen.findById(req.params.id);
    
    if (!kitchen) {
      return res.status(404).json({ success: false, message: 'Kitchen not found' });
    }
    
    // Sort by date descending
    const sortedHistory = kitchen.distributionHistory
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const start = (page - 1) * limit;
    const paginatedHistory = sortedHistory.slice(start, start + parseInt(limit));
    
    res.json({
      success: true,
      count: sortedHistory.length,
      distribution: paginatedHistory,
      totalPages: Math.ceil(sortedHistory.length / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
