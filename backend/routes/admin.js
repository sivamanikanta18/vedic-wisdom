import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Progress from '../models/Progress.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

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

// Middleware to check if user is admin
const requireAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user || user.userType !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Only Administrators can perform this action.' 
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

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

// Update user role - ADMIN ONLY
router.put('/users/:id/role', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { userType } = req.body;

    // Validate role
    const validRoles = ['folk_boy', 'folk_guide', 'admin'];
    if (!validRoles.includes(userType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be one of: folk_boy, folk_guide, admin'
      });
    }

    // Get current user data for logging
    const currentUser = await User.findById(id);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const oldRole = currentUser.userType;

    const user = await User.findByIdAndUpdate(
      id,
      { userType },
      { new: true }
    ).select('-password');

    // LOG ROLE CHANGE
    console.log(`[ROLE CHANGE] ${req.user?.email} changed ${user.email} from ${oldRole} to ${userType}`);

    res.json({
      success: true,
      message: `User role updated to ${userType}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType
      }
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user role',
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

// ============== GUIDE-STUDENT MANAGEMENT ROUTES ==============

// Get all students assigned to a guide
router.get('/guides/:guideId/students', async (req, res) => {
  try {
    const { guideId } = req.params;
    
    // Verify guide exists and is actually a guide
    const guide = await User.findById(guideId).select('-password');
    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'Guide not found'
      });
    }
    
    if (guide.userType !== 'folk_guide' && guide.userType !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'User is not a guide'
      });
    }

    // Get all students with their details
    const students = await User.find({
      _id: { $in: guide.students || [] }
    }).select('-password');

    // Get progress for each student
    const studentsWithProgress = await Promise.all(
      students.map(async (student) => {
        const progress = await Progress.find({ userId: student._id });
        
        let totalRounds = 0;
        let totalMinutes = 0;
        let activeDays = 0;

        progress.forEach(p => {
          totalRounds += p.roundsCompleted || 0;
          totalMinutes += p.chantingMinutes || 0;
          if (p.roundsCompleted > 0) activeDays++;
        });

        return {
          id: student._id,
          name: student.name,
          email: student.email,
          joinDate: student.joinDate,
          initiationStatus: student.initiationStatus,
          spiritualName: student.spiritualName,
          isActive: student.isActive,
          stats: {
            totalDays: progress.length,
            activeDays,
            totalRounds,
            totalMinutes,
            averageRoundsPerDay: progress.length > 0 ? (totalRounds / progress.length).toFixed(2) : 0
          }
        };
      })
    );

    res.json({
      success: true,
      guide: {
        id: guide._id,
        name: guide.name,
        email: guide.email,
        spiritualName: guide.spiritualName
      },
      totalStudents: students.length,
      students: studentsWithProgress
    });
  } catch (error) {
    console.error('Get guide students error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching guide students',
      error: error.message
    });
  }
});

// Assign a student to a guide
router.post('/guides/:guideId/students', async (req, res) => {
  try {
    const { guideId } = req.params;
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is required'
      });
    }

    // Verify guide exists
    const guide = await User.findById(guideId);
    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'Guide not found'
      });
    }

    // Verify student exists
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if student is already assigned to this guide
    if (guide.students && guide.students.includes(studentId)) {
      return res.status(400).json({
        success: false,
        message: 'Student is already assigned to this guide'
      });
    }

    // Add student to guide's students array
    if (!guide.students) guide.students = [];
    guide.students.push(studentId);
    await guide.save();

    // Update student's assignedGuide field
    student.assignedGuide = guideId;
    await student.save();

    res.json({
      success: true,
      message: 'Student assigned to guide successfully',
      guide: {
        id: guide._id,
        name: guide.name,
        totalStudents: guide.students.length
      },
      student: {
        id: student._id,
        name: student.name,
        email: student.email
      }
    });
  } catch (error) {
    console.error('Assign student error:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning student to guide',
      error: error.message
    });
  }
});

// Remove a student from a guide
router.delete('/guides/:guideId/students/:studentId', async (req, res) => {
  try {
    const { guideId, studentId } = req.params;

    // Verify guide exists
    const guide = await User.findById(guideId);
    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'Guide not found'
      });
    }

    // Verify student exists
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Remove student from guide's students array
    if (guide.students) {
      guide.students = guide.students.filter(id => id.toString() !== studentId);
      await guide.save();
    }

    // Remove guide from student's assignedGuide field
    if (student.assignedGuide && student.assignedGuide.toString() === guideId) {
      student.assignedGuide = null;
      await student.save();
    }

    res.json({
      success: true,
      message: 'Student removed from guide successfully',
      guide: {
        id: guide._id,
        name: guide.name,
        totalStudents: guide.students ? guide.students.length : 0
      }
    });
  } catch (error) {
    console.error('Remove student error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing student from guide',
      error: error.message
    });
  }
});

// Get all available students (not assigned to any guide)
router.get('/students/unassigned', async (req, res) => {
  try {
    const unassignedStudents = await User.find({
      userType: 'folk_boy',
      $or: [
        { assignedGuide: null },
        { assignedGuide: { $exists: false } }
      ]
    }).select('-password');

    res.json({
      success: true,
      count: unassignedStudents.length,
      students: unassignedStudents.map(student => ({
        id: student._id,
        name: student.name,
        email: student.email,
        joinDate: student.joinDate,
        initiationStatus: student.initiationStatus
      }))
    });
  } catch (error) {
    console.error('Get unassigned students error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching unassigned students',
      error: error.message
    });
  }
});

// Get all guides with their student counts
router.get('/guides', async (req, res) => {
  try {
    const guides = await User.find({
      userType: { $in: ['folk_guide', 'admin'] }
    }).select('-password');

    const guidesWithStats = guides.map(guide => ({
      id: guide._id,
      name: guide.name,
      email: guide.email,
      spiritualName: guide.spiritualName,
      userType: guide.userType,
      totalStudents: guide.students ? guide.students.length : 0
    }));

    res.json({
      success: true,
      count: guidesWithStats.length,
      guides: guidesWithStats
    });
  } catch (error) {
    console.error('Get guides error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching guides',
      error: error.message
    });
  }
});

// Debug endpoint - check actual database roles
router.get('/debug/roles', async (req, res) => {
  try {
    const users = await User.find({}).select('name email userType').sort({ email: 1 });
    res.json({
      success: true,
      count: users.length,
      users: users.map(u => ({
        name: u.name,
        email: u.email,
        userType: u.userType
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
