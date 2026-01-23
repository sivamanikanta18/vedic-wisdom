import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

function parseAdminEmails() {
  const raw = process.env.ADMIN_EMAILS || '';
  return new Set(
    raw
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean)
  );
}

// Verify token middleware
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, communityProfile } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide name, email, and password' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered' 
      });
    }

    // Create new user
    const safeCommunityProfile = {
      folk: typeof communityProfile?.folk === 'string' ? communityProfile.folk.trim() : '',
      folkGuide: typeof communityProfile?.folkGuide === 'string' ? communityProfile.folkGuide.trim() : '',
      templeCenter: typeof communityProfile?.templeCenter === 'string' ? communityProfile.templeCenter.trim() : ''
    };

    const user = new User({
      name,
      email,
      password,
      communityProfile: safeCommunityProfile
    });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        communityProfile: user.communityProfile,
        preferences: user.preferences,
        spiritualData: user.spiritualData,
        journeyStartDate: user.journeyStartDate
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error registering user', 
      error: error.message 
    });
  }
});

router.get('/admin-status', verifyToken, async (req, res) => {
  try {
    const adminEmails = parseAdminEmails();
    if (adminEmails.size === 0) {
      return res.json({ success: true, isAdmin: false, configured: false });
    }

    const user = await User.findById(req.userId).select('email').lean();
    const email = (user?.email || '').toLowerCase();
    const isAdmin = adminEmails.has(email);

    return res.json({ success: true, isAdmin, configured: true });
  } catch (error) {
    console.error('Admin status error:', error);
    return res.status(500).json({ success: false, message: 'Error checking admin status', error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email and password' 
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        communityProfile: user.communityProfile,
        preferences: user.preferences,
        spiritualData: user.spiritualData,
        journeyStartDate: user.journeyStartDate
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error logging in', 
      error: error.message 
    });
  }
});

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        communityProfile: user.communityProfile,
        preferences: user.preferences,
        spiritualData: user.spiritualData,
        journeyStartDate: user.journeyStartDate
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching profile', 
      error: error.message 
    });
  }
});

// Update spiritual data
router.put('/spiritual-data', verifyToken, async (req, res) => {
  try {
    const { dailyRounds, chantingTime, notificationEnabled, reminderTime } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    user.spiritualData = {
      dailyRounds: dailyRounds || user.spiritualData.dailyRounds,
      chantingTime: chantingTime || user.spiritualData.chantingTime,
      notificationEnabled: notificationEnabled !== undefined ? notificationEnabled : user.spiritualData.notificationEnabled,
      reminderTime: reminderTime || user.spiritualData.reminderTime
    };

    await user.save();

    res.json({
      success: true,
      message: 'Spiritual data updated successfully',
      spiritualData: user.spiritualData
    });
  } catch (error) {
    console.error('Update spiritual data error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating spiritual data', 
      error: error.message 
    });
  }
});

export default router;
