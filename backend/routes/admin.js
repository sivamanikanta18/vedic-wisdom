import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Progress from '../models/Progress.js';

const router = express.Router();

// Middleware to check MongoDB connection
router.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database connection not ready',
      connectionState: mongoose.connection.readyState
    });
  }
  next();
});

// Get all users with their progress summary
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password').maxTimeMS(5000);
    
    const usersWithProgress = await Promise.all(
      users.map(async (user) => {
        const userProgress = await Progress.find({ userId: user._id });
        
        let totalRounds = 0;
        let totalMinutes = 0;
        let activeDays = 0;

        userProgress.forEach(progress => {
          totalRounds += progress.roundsCompleted || 0;
          totalMinutes += progress.chantingMinutes || 0;
          if (progress.roundsCompleted > 0) {
            activeDays++;
          }
        });

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          journeyStartDate: user.journeyStartDate,
          spiritualData: user.spiritualData,
          stats: {
            totalDays: userProgress.length,
            activeDays,
            totalRounds,
            totalMinutes,
            averageRoundsPerDay: userProgress.length > 0 ? (totalRounds / userProgress.length).toFixed(2) : 0,
            averageMinutesPerDay: userProgress.length > 0 ? (totalMinutes / userProgress.length).toFixed(2) : 0
          }
        };
      })
    );

    res.json({
      success: true,
      totalUsers: users.length,
      users: usersWithProgress
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// Get specific user's detailed progress
router.get('/users/:userId/progress', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const progress = await Progress.find({ userId }).sort({ date: -1 });

    let totalRounds = 0;
    let totalMinutes = 0;
    let activeDays = 0;

    progress.forEach(p => {
      totalRounds += p.roundsCompleted || 0;
      totalMinutes += p.chantingMinutes || 0;
      if (p.roundsCompleted > 0) {
        activeDays++;
      }
    });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        journeyStartDate: user.journeyStartDate,
        spiritualData: user.spiritualData
      },
      stats: {
        totalDays: progress.length,
        activeDays,
        totalRounds,
        totalMinutes,
        averageRoundsPerDay: progress.length > 0 ? (totalRounds / progress.length).toFixed(2) : 0,
        averageMinutesPerDay: progress.length > 0 ? (totalMinutes / progress.length).toFixed(2) : 0
      },
      progressHistory: progress
    });
  } catch (error) {
    console.error('Get user progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user progress',
      error: error.message
    });
  }
});

// Delete user and all their progress data
router.delete('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete all progress entries for this user
    const progressDeleted = await Progress.deleteMany({ userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: 'User and all associated data deleted successfully',
      deleted: {
        user: user.email,
        progressEntries: progressDeleted.deletedCount
      }
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
});

// Delete all test users (emails containing 'test' or 'example.com')
router.delete('/users/cleanup/test-users', async (req, res) => {
  try {
    // Find all test users
    const testUsers = await User.find({
      $or: [
        { email: { $regex: 'test', $options: 'i' } },
        { email: { $regex: 'example.com', $options: 'i' } }
      ]
    });

    if (testUsers.length === 0) {
      return res.json({
        success: true,
        message: 'No test users found',
        deleted: 0
      });
    }

    const userIds = testUsers.map(u => u._id);

    // Delete all progress entries for test users
    const progressDeleted = await Progress.deleteMany({ userId: { $in: userIds } });

    // Delete all test users
    const usersDeleted = await User.deleteMany({
      $or: [
        { email: { $regex: 'test', $options: 'i' } },
        { email: { $regex: 'example.com', $options: 'i' } }
      ]
    });

    res.json({
      success: true,
      message: 'Test users cleaned up successfully',
      deleted: {
        users: usersDeleted.deletedCount,
        progressEntries: progressDeleted.deletedCount,
        emails: testUsers.map(u => u.email)
      }
    });
  } catch (error) {
    console.error('Cleanup test users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cleaning up test users',
      error: error.message
    });
  }
});

// Get database statistics
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProgressEntries = await Progress.countDocuments();
    
    const allProgress = await Progress.find({});
    let totalRounds = 0;
    let totalMinutes = 0;

    allProgress.forEach(progress => {
      totalRounds += progress.roundsCompleted || 0;
      totalMinutes += progress.chantingMinutes || 0;
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProgressEntries,
        totalRoundsAllUsers: totalRounds,
        totalMinutesAllUsers: totalMinutes,
        averageRoundsPerEntry: totalProgressEntries > 0 ? (totalRounds / totalProgressEntries).toFixed(2) : 0,
        averageMinutesPerEntry: totalProgressEntries > 0 ? (totalMinutes / totalProgressEntries).toFixed(2) : 0
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

export default router;
