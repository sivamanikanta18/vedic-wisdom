import express from 'express';
import Progress from '../models/Progress.js';
import User from '../models/User.js';
import { verifyToken } from './auth.js';

const router = express.Router();

async function getUserEmail(userId) {
  const user = await User.findById(userId).select('email');
  return user?.email || '';
}

// All routes require authentication
router.use(verifyToken);

// Get progress for a specific date
router.get('/date/:dateString', async (req, res) => {
  try {
    const { dateString } = req.params;
    
    const progress = await Progress.findOne({ 
      userId: req.userId, 
      dateString 
    });

    if (!progress) {
      return res.json({
        success: true,
        progress: {
          roundsCompleted: 0,
          chantingMinutes: 0,
          lastChanted: null
        }
      });
    }

    res.json({
      success: true,
      progress: {
        roundsCompleted: progress.roundsCompleted,
        chantingMinutes: progress.chantingMinutes,
        lastChanted: progress.lastChanted,
        userEmail: progress.userEmail
      }
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching progress', 
      error: error.message 
    });
  }
});

// Update or create progress for a specific date
router.post('/update', async (req, res) => {
  try {
    const { dateString, roundsCompleted, chantingMinutes } = req.body;

    if (!dateString) {
      return res.status(400).json({ 
        success: false, 
        message: 'Date string is required' 
      });
    }

    const date = new Date(dateString);

    let progress = await Progress.findOne({ 
      userId: req.userId, 
      dateString 
    });

    if (progress) {
      // Update existing progress
      if (roundsCompleted !== undefined) progress.roundsCompleted = roundsCompleted;
      if (chantingMinutes !== undefined) progress.chantingMinutes = chantingMinutes;
      progress.lastChanted = new Date();

      if (!progress.userEmail) {
        progress.userEmail = await getUserEmail(req.userId);
      }
    } else {
      // Create new progress
      const userEmail = await getUserEmail(req.userId);
      progress = new Progress({
        userId: req.userId,
        userEmail,
        date,
        dateString,
        roundsCompleted: roundsCompleted || 0,
        chantingMinutes: chantingMinutes || 0,
        lastChanted: new Date()
      });
    }

    await progress.save();

    res.json({
      success: true,
      message: 'Progress updated successfully',
      progress: {
        roundsCompleted: progress.roundsCompleted,
        chantingMinutes: progress.chantingMinutes,
        lastChanted: progress.lastChanted,
        userEmail: progress.userEmail
      }
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating progress', 
      error: error.message 
    });
  }
});

router.post('/backfill-email', async (req, res) => {
  try {
    const userEmail = await getUserEmail(req.userId);
    if (!userEmail) {
      return res.status(404).json({
        success: false,
        message: 'User email not found'
      });
    }

    const result = await Progress.updateMany(
      {
        userId: req.userId,
        $or: [{ userEmail: { $exists: false } }, { userEmail: '' }]
      },
      { $set: { userEmail } }
    );

    res.json({
      success: true,
      message: 'Backfill completed',
      userEmail,
      matched: result?.matchedCount ?? result?.n ?? 0,
      modified: result?.modifiedCount ?? result?.nModified ?? 0
    });
  } catch (error) {
    console.error('Backfill email error:', error);
    res.status(500).json({
      success: false,
      message: 'Error backfilling emails',
      error: error.message
    });
  }
});

// Get progress for a date range
router.get('/range', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'Start date and end date are required' 
      });
    }

    const progress = await Progress.find({
      userId: req.userId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ date: 1 });

    res.json({
      success: true,
      progress
    });
  } catch (error) {
    console.error('Get range progress error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching progress range', 
      error: error.message 
    });
  }
});

// Get overall statistics
router.get('/stats', async (req, res) => {
  try {
    const allProgress = await Progress.find({ userId: req.userId }).sort({ date: -1 });

    let totalRounds = 0;
    let totalMinutes = 0;
    let activeDays = 0;
    let currentStreak = 0;

    allProgress.forEach(progress => {
      totalRounds += progress.roundsCompleted || 0;
      totalMinutes += progress.chantingMinutes || 0;
      if (progress.roundsCompleted > 0) {
        activeDays++;
      }
    });

    // Calculate streak (consecutive days with progress)
    if (allProgress.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Sort by date descending
      const sortedProgress = allProgress.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Check if today has progress
      const todayProgress = sortedProgress.find(p => {
        const pDate = new Date(p.date);
        pDate.setHours(0, 0, 0, 0);
        return pDate.getTime() === today.getTime();
      });
      
      // Start checking from today if there's progress, otherwise from yesterday
      let checkDate = new Date(today);
      if (!todayProgress || todayProgress.roundsCompleted === 0) {
        // If no progress today, start checking from yesterday
        checkDate.setDate(checkDate.getDate() - 1);
      }
      
      for (const progress of sortedProgress) {
        const progressDate = new Date(progress.date);
        progressDate.setHours(0, 0, 0, 0);
        
        // Check if this date matches our expected date
        if (progressDate.getTime() === checkDate.getTime() && progress.roundsCompleted > 0) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1); // Move to previous day
        } else if (progressDate.getTime() < checkDate.getTime()) {
          // Gap in streak, stop counting
          break;
        }
      }
    }

    res.json({
      success: true,
      stats: {
        totalRounds,
        totalMinutes,
        activeDays,
        totalDays: allProgress.length,
        currentStreak
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
