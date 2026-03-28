import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Dashboard.css";
import { 
  requestNotificationPermission, 
  scheduleDailyReminder, 
  showChantingReminder,
  checkAndShowMissedReminder 
} from "../utils/notificationService";
import { authAPI, progressAPI, logout } from "../utils/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [userData, setUserData] = useState(null);
  const [fullUser, setFullUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [setupData, setSetupData] = useState({
    dailyRounds: "",
    chantingTime: "",
    notificationEnabled: true,
    reminderTime: "06:00"
  });
  const [todayProgress, setTodayProgress] = useState({
    roundsCompleted: 0,
    chantingMinutes: 0,
    lastChanted: null
  });
  const [overallStats, setOverallStats] = useState({
    totalRounds: 0,
    totalMinutes: 0,
    totalDays: 0,
    currentStreak: 0,
    startDate: null
  });

  const [debugInfo, setDebugInfo] = useState({});

  // Authentic HKM Role Display Names - Only 3 roles
  const getRoleDisplayName = (userType) => {
    const roleNames = {
      'folk_boy': 'Folk Boy',
      'folk_guide': 'Folk Guide',
      'admin': 'Administrator'
    };
    return roleNames[userType] || 'Folk Boy';
  };

  // Role-based color coding - Only 3 roles
  const getRoleClass = (userType) => {
    if (userType === 'admin') return 'role-admin';
    if (userType === 'folk_guide') return 'role-guide';
    return 'role-folk';
  };

  // Check if user is a folk boy
  const isFolk = () => fullUser?.userType === 'folk_boy';
  
  // Check if user is folk guide
  const isGuide = () => fullUser?.userType === 'folk_guide';
  
  // Check if user is admin
  const isAdmin = () => fullUser?.userType === 'admin';

  useEffect(() => {
    // Load user profile from backend
    loadUserProfile();

    // Request notification permission
    requestNotificationPermission();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Periodically reload progress to catch updates from other pages (e.g., Chanting page)
  useEffect(() => {
    if (!userData) return;

    const intervalId = setInterval(() => {
      loadTodayProgress();
      calculateOverallStats();
    }, 30000); // Reload every 30 seconds

    return () => clearInterval(intervalId);
  }, [userData]);

  // Track time spent on dashboard
  useEffect(() => {
    if (!userData) return;

    const startTime = Date.now();
    const initialMinutes = todayProgress.chantingMinutes || 0;
    const initialRounds = todayProgress.roundsCompleted;

    // Update minutes every minute
    const intervalId = setInterval(() => {
      const minutesElapsed = Math.floor((Date.now() - startTime) / 60000);
      if (minutesElapsed > 0) {
        setTodayProgress(prev => ({
          ...prev,
          chantingMinutes: initialMinutes + minutesElapsed
        }));
      }
    }, 60000); // Every 1 minute

    // Save time when component unmounts
    const saveTimeOnExit = async () => {
      const minutesElapsed = Math.floor((Date.now() - startTime) / 60000);
      if (minutesElapsed > 0) {
        const today = new Date().toISOString().split('T')[0];
        try {
          await progressAPI.updateProgress(
            today,
            initialRounds,
            initialMinutes + minutesElapsed
          );
        } catch (err) {
          console.error('Error saving time:', err);
        }
      }
    };

    return () => {
      clearInterval(intervalId);
      saveTimeOnExit();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]); // Only depend on userData to avoid re-creating timer

  const handleSetupChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSetupData({
      ...setupData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const loadTodayProgress = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await progressAPI.getProgressByDate(today);
      if (response.success && response.progress) {
        setTodayProgress({
          roundsCompleted: response.progress.roundsCompleted || 0,
          chantingMinutes: response.progress.chantingMinutes || 0,
          lastChanted: response.progress.lastChanted || null
        });
      }
    } catch (error) {
      console.error('Error loading today progress:', error);
    }
  };

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      console.log('Loading user profile...');
      const response = await authAPI.getProfile();
      console.log('Profile response:', response);
      
      if (response.success) {
        const user = response.user;
        console.log('User data:', user);
        
        // Check if spiritual data is set up
        if (!user.spiritualData?.dailyRounds) {
          console.log('First time user - showing setup');
          setIsFirstTime(true);
          setLoading(false);
        } else {
          setUserData(user.spiritualData);
          setFullUser(user);
          console.log('Full user set:', user.userType, user.initiationStatus);
          setIsFirstTime(false);
          
          // Load today's progress and stats in parallel for faster loading
          const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
          
          // Execute both API calls simultaneously
          const [progressResponse, statsResponse] = await Promise.allSettled([
            progressAPI.getProgressByDate(today),
            progressAPI.getStats()
          ]);

          // Handle progress response
          if (progressResponse.status === 'fulfilled' && progressResponse.value.success && progressResponse.value.progress) {
            setTodayProgress({
              roundsCompleted: progressResponse.value.progress.roundsCompleted || 0,
              chantingMinutes: progressResponse.value.progress.chantingMinutes || 0,
              lastChanted: progressResponse.value.progress.lastChanted || null
            });
          }

          // Handle stats response
          if (statsResponse.status === 'fulfilled' && statsResponse.value.success) {
            const userFromStorage = localStorage.getItem('user');
            const userData = userFromStorage ? JSON.parse(userFromStorage) : null;
            const startDate = userData?.journeyStartDate || new Date().toISOString();
            const start = new Date(startDate);
            const todayDate = new Date();
            const daysSinceStart = Math.floor((todayDate - start) / (1000 * 60 * 60 * 24)) + 1;

            setOverallStats({
              totalRounds: statsResponse.value.stats.totalRounds || 0,
              totalMinutes: statsResponse.value.stats.totalMinutes || 0,
              totalDays: daysSinceStart,
              activeDays: statsResponse.value.stats.activeDays || 0,
              currentStreak: statsResponse.value.stats.currentStreak || 0,
              startDate
            });
          }

          // Check for missed reminders
          checkAndShowMissedReminder(user.spiritualData);

          // Schedule daily reminder if enabled
          if (user.spiritualData.notificationEnabled) {
            scheduleDailyReminder(user.spiritualData.reminderTime, user.spiritualData.dailyRounds);
          }
          
          setLoading(false);
        }
      } else {
        console.error('Profile load failed:', response);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setDebugInfo(prev => ({ ...prev, error: error.message, stack: error.stack }));
      setLoading(false);
      if (error.message?.includes('token')) {
        logout();
        navigate("/login");
      }
    }
  };

  const handleSetupSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('Saving spiritual data:', setupData);
      // Save spiritual data to backend
      const response = await authAPI.updateSpiritualData(setupData);
      console.log('Save response:', response);
      
      if (response.success) {
        setUserData(setupData);
        setIsFirstTime(false);

        // Request notification permission and schedule daily reminder
        if (setupData.notificationEnabled) {
          requestNotificationPermission().then((granted) => {
            if (granted) {
              scheduleDailyReminder(setupData.reminderTime, setupData.dailyRounds);
            }
          });
        }

        alert("Your spiritual journey tracker is set up!");
      } else {
        console.error('Save failed:', response);
        alert('Failed to save settings: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving spiritual data:', error);
      alert('Failed to save settings: ' + (error.message || 'Network error'));
    }
  };


  const updateProgress = async (field, value) => {
    // Update state first for immediate UI feedback
    setTodayProgress(prev => ({
      ...prev,
      [field]: value,
      lastChanted: new Date().toISOString()
    }));
    
    // Save to backend
    try {
      const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
      
      // Get current values, update the specific field
      const roundsToSave = field === 'roundsCompleted' ? value : todayProgress.roundsCompleted;
      const minutesToSave = field === 'chantingMinutes' ? value : todayProgress.chantingMinutes;
      
      await progressAPI.updateProgress(today, roundsToSave, minutesToSave);
      
      // Reload today's progress from backend to ensure consistency
      await loadTodayProgress();
      
      // Recalculate overall stats
      await calculateOverallStats();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const incrementRounds = () => {
    updateProgress("roundsCompleted", todayProgress.roundsCompleted + 1);
  };

  const decrementRounds = () => {
    if (todayProgress.roundsCompleted > 0) {
      updateProgress("roundsCompleted", todayProgress.roundsCompleted - 1);
    }
  };

  const getProgressPercentage = () => {
    if (!userData?.dailyRounds) return 0;
    return Math.min((todayProgress.roundsCompleted / userData.dailyRounds) * 100, 100);
  };

  const getStreak = () => {
    // Return streak from backend stats
    return overallStats.currentStreak || 0;
  };

  const calculateOverallStats = async () => {
    try {
      const response = await progressAPI.getStats();
      if (response.success) {
        // Get user data from state or localStorage
        const userFromStorage = localStorage.getItem('user');
        const user = userFromStorage ? JSON.parse(userFromStorage) : null;
        const startDate = user?.journeyStartDate || new Date().toISOString();
        const start = new Date(startDate);
        const today = new Date();
        const daysSinceStart = Math.floor((today - start) / (1000 * 60 * 60 * 24)) + 1;

        setOverallStats({
          totalRounds: response.stats.totalRounds || 0,
          totalMinutes: response.stats.totalMinutes || 0,
          totalDays: daysSinceStart,
          activeDays: response.stats.activeDays || 0,
          currentStreak: response.stats.currentStreak || 0,
          startDate
        });
      }
    } catch (error) {
      console.error('Error calculating stats:', error);
      // Set default values on error
      setOverallStats({
        totalRounds: 0,
        totalMinutes: 0,
        totalDays: 1,
        activeDays: 0,
        currentStreak: 0,
        startDate: new Date().toISOString()
      });
    }
  };

  if (isFirstTime) {
    return (
      <div className="dashboard-page">
        <div className="setup-container">
          <div className="setup-header">
            <h1>🙏 Welcome to Your Spiritual Journey</h1>
            <p>Let's set up your daily spiritual practice tracker</p>
          </div>

          <form className="setup-form" onSubmit={handleSetupSubmit}>
            <div className="form-group">
              <label htmlFor="dailyRounds">
                How many rounds of chanting do you want to complete daily?
              </label>
              <input
                type="number"
                id="dailyRounds"
                name="dailyRounds"
                value={setupData.dailyRounds}
                onChange={handleSetupChange}
                min="1"
                max="64"
                required
                placeholder="e.g., 16"
              />
              <small>One round = 108 times Hare Krishna Maha Mantra</small>
            </div>

            <div className="form-group">
              <label htmlFor="chantingTime">
                Preferred time for chanting (minutes per session)
              </label>
              <input
                type="number"
                id="chantingTime"
                name="chantingTime"
                value={setupData.chantingTime}
                onChange={handleSetupChange}
                min="5"
                max="480"
                required
                placeholder="e.g., 30"
              />
            </div>

            <div className="form-group">
              <label htmlFor="reminderTime">
                What time should we remind you daily?
              </label>
              <input
                type="time"
                id="reminderTime"
                name="reminderTime"
                value={setupData.reminderTime}
                onChange={handleSetupChange}
                required
              />
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="notificationEnabled"
                  checked={setupData.notificationEnabled}
                  onChange={handleSetupChange}
                />
                <span>Enable daily reminders & notifications</span>
              </label>
            </div>

            <button type="submit" className="setup-button">
              Start My Spiritual Journey 🕉️
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container" style={{ textAlign: 'center', padding: '4rem' }}>
          <h2>Loading your spiritual journey... 🙏</h2>
          <p>Please wait while we fetch your progress data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Your Spiritual Dashboard</h1>
          <p>Track your daily spiritual practice</p>
        </div>

        {/* DEBUG PANEL - Remove after fixing */}
        {/* <div style={{background: '#ffeb3b', padding: '1rem', margin: '1rem 0', borderRadius: '8px', border: '2px solid #f57f17'}}>
          <h3 style={{margin: '0 0 0.5rem 0', color: '#e65100'}}>Debug Info</h3>
          <h3 style={{margin: '0 0 0.5rem 0', color: '#e65100'}}>🔧 Debug Info</h3>
          <pre style={{fontSize: '0.8rem', overflow: 'auto', maxHeight: '200px', background: 'white', padding: '0.5rem', borderRadius: '4px'}}>
{JSON.stringify({
  loading,
  isFirstTime,
  hasFullUser: !!fullUser,
  hasUserData: !!userData,
  userType: fullUser?.userType,
  initiationStatus: fullUser?.initiationStatus,
  hasSpiritualName: !!fullUser?.spiritualName,
  hasTemple: !!fullUser?.temple,
  error: debugInfo.error || 'none'
}, null, 2)}
          </pre>
        </div> */}

        {/* Professional HKM Devotee Identity Card - only show when fullUser loaded */}
        {fullUser && (
          <div className="hkm-identity-card">
            <div className="identity-header">
              <div className={`role-badge ${getRoleClass(fullUser.userType)}`}>
                {getRoleDisplayName(fullUser.userType)}
              </div>
              <div className="user-basic-info">
                <h2 className="user-name">{fullUser.name || 'User'}</h2>
                <p className="user-email">{fullUser.email}</p>
              </div>
              {fullUser.spiritualName && (
                <div className="spiritual-name-header">
                  <span className="spiritual-label">Spiritual Name</span>
                  <span className="spiritual-value">{fullUser.spiritualName}</span>
                </div>
              )}
            </div>
            
            <div className="identity-body">
              <div className="identity-main">
                <div className="initiation-status">
                  <span className={`status-badge ${fullUser.initiationStatus || 'none'}`}>
                    {fullUser.initiationStatus === 'none' && 'Not Initiated'}
                    {fullUser.initiationStatus === 'first' && 'First Initiated'}
                    {fullUser.initiationStatus === 'second' && 'Second Initiated'}
                    {!fullUser.initiationStatus && 'Not Initiated'}
                  </span>
                </div>
                
                {fullUser.temple && (
                  <div className="temple-affiliation">
                    <span className="affiliation-text">Temple: {fullUser.temple.name}</span>
                    <Link to={`/temples/${fullUser.temple._id}`} className="view-link">View</Link>
                  </div>
                )}
                
                {fullUser.college && (
                  <div className="college-affiliation">
                    <span className="affiliation-text">College: {fullUser.college.name}</span>
                    <Link to={`/colleges/${fullUser.college._id}`} className="view-link">View</Link>
                  </div>
                )}
              </div>
              
              <div className="identity-stats">
                <div className="id-stat">
                  <span className="id-stat-value">{fullUser.serviceRoles?.length || 0}</span>
                  <span className="id-stat-label">Services</span>
                </div>
                <div className="id-stat">
                  <span className="id-stat-value">
                    {new Date(fullUser.joinDate || Date.now()).getFullYear()}
                  </span>
                  <span className="id-stat-label">Member Since</span>
                </div>
                <div className="id-stat">
                  <span className="id-stat-value">{overallStats.totalRounds || 0}</span>
                  <span className="id-stat-label">Total Rounds</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Role-Based Quick Actions - Only 3 roles: folk_boy, folk_guide, admin */}
        <div className="role-actions-section">
          <h3>Quick Actions</h3>
          <div className="role-actions-grid">
            {/* Folk Boy sees Learning links + Chatbot */}
            {fullUser && isFolk() && (
              <>
                <Link to="/scriptures" className="role-action-btn">
                  <span className="action-text">Scriptures</span>
                </Link>
                <Link to="/chanting" className="role-action-btn">
                  <span className="action-text">Chanting</span>
                </Link>
                <Link to="/quiz" className="role-action-btn">
                  <span className="action-text">Quiz</span>
                </Link>
                <Link to="/games" className="role-action-btn">
                  <span className="action-text">Games</span>
                </Link>
                <Link to="/krishna-chat" className="role-action-btn highlight">
                  <span className="action-text">Ask Sastra</span>
                </Link>
                {fullUser.assignedGuide && (
                  <div className="role-action-btn info">
                    <span className="action-text">
                      Guide: {fullUser.assignedGuide.spiritualName || fullUser.assignedGuide.name}
                    </span>
                  </div>
                )}
              </>
            )}
            
            {/* Folk Guide sees Learning + HKM + Student Management */}
            {fullUser && isGuide() && (
              <>
                <Link to="/scriptures" className="role-action-btn">
                  <span className="action-text">Scriptures</span>
                </Link>
                <Link to="/chanting" className="role-action-btn">
                  <span className="action-text">Chanting</span>
                </Link>
                <Link to="/quiz" className="role-action-btn">
                  <span className="action-text">Quiz</span>
                </Link>
                <Link to="/games" className="role-action-btn">
                  <span className="action-text">Games</span>
                </Link>
                <Link to="/krishna-chat" className="role-action-btn">
                  <span className="action-text">Ask Sastra</span>
                </Link>
                <Link to="/temples" className="role-action-btn">
                  <span className="action-text">Temples</span>
                </Link>
                <Link to="/guide/students" className="role-action-btn highlight">
                  <span className="action-text">My Students ({fullUser.students?.length || 0})</span>
                </Link>
                <Link to="/community" className="role-action-btn">
                  <span className="action-text">Community</span>
                </Link>
              </>
            )}
            
            {/* Admin sees everything */}
            {fullUser && isAdmin() && (
              <>
                <Link to="/temples" className="role-action-btn">
                  <span className="action-text">Temples</span>
                </Link>
                <Link to="/colleges" className="role-action-btn">
                  <span className="action-text">Colleges</span>
                </Link>
                <Link to="/community" className="role-action-btn">
                  <span className="action-text">Community</span>
                </Link>
                <Link to="/akshaya-patra" className="role-action-btn highlight">
                  <span className="action-text">Akshaya Patra</span>
                </Link>
                <Link to="/events" className="role-action-btn">
                  <span className="action-text">Events</span>
                </Link>
                <Link to="/admin/users" className="role-action-btn admin">
                  <span className="action-text">User Management</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Today's Progress */}
        <div className="progress-section">
          <h2>Today's Progress</h2>
          <div className="progress-card">
            <div className="progress-circle">
              <svg viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#f4e4c1"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeDasharray={`${getProgressPercentage() * 2.827} 282.7`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#FFD700" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="progress-text">
                <span className="rounds-completed">{todayProgress.roundsCompleted}</span>
                <span className="rounds-total">/ {userData?.dailyRounds}</span>
                <span className="rounds-label">Rounds</span>
              </div>
            </div>

            <div className="progress-controls">
              <button onClick={decrementRounds} className="control-btn">-</button>
              <button onClick={incrementRounds} className="control-btn primary">
                Complete Round
              </button>
              <button onClick={incrementRounds} className="control-btn">+</button>
            </div>
          </div>
        </div>

        {/* Stats Grid - Today */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{getStreak()}</div>
            <div className="stat-label">Day Streak</div>
          </div>

          <div className="stat-card">
            <div className="stat-value">{todayProgress.chantingMinutes}</div>
            <div className="stat-label">Minutes Today</div>
          </div>

          <div className="stat-card">
            <div className="stat-value">{Math.round(getProgressPercentage())}%</div>
            <div className="stat-label">Goal Progress</div>
          </div>

          <div className="stat-card">
            <div className="stat-value">{todayProgress.roundsCompleted * 108}</div>
            <div className="stat-label">Mantras Chanted</div>
          </div>
        </div>

        {/* Overall Statistics from Day 1 */}
        <div className="overall-stats-section">
          <h2>Overall Journey Statistics</h2>
          <p className="journey-start">
            Journey started: {overallStats.startDate ? new Date(overallStats.startDate).toLocaleDateString() : 'Today'}
          </p>
          
          {/* First Row - 3 cards */}
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '1rem' }}>
            <div className="stat-card overall">
              <div className="stat-value">{overallStats.totalDays}</div>
              <div className="stat-label">Total Days</div>
            </div>

            <div className="stat-card overall">
              <div className="stat-value">{overallStats.activeDays}</div>
              <div className="stat-label">Active Days</div>
            </div>

            <div className="stat-card overall">
              <div className="stat-value">{overallStats.totalRounds}</div>
              <div className="stat-label">Total Rounds</div>
            </div>
          </div>

          {/* Second Row - 3 cards */}
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="stat-card overall">
              <div className="stat-value">{Math.floor(overallStats.totalMinutes / 60)}h {overallStats.totalMinutes % 60}m</div>
              <div className="stat-label">Total Time</div>
            </div>

            <div className="stat-card overall">
              <div className="stat-value">{overallStats.totalRounds * 108}</div>
              <div className="stat-label">Total Mantras</div>
            </div>

            <div className="stat-card overall">
              <div className="stat-value">{overallStats.totalDays > 0 ? Math.round((overallStats.totalRounds / overallStats.totalDays) * 10) / 10 : 0}</div>
              <div className="stat-label">Avg Rounds/Day</div>
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="motivation-card">
          {todayProgress.roundsCompleted >= userData?.dailyRounds ? (
            <>
              <h3>Congratulations!</h3>
              <p>You've completed your daily goal! Keep up the excellent spiritual practice!</p>
            </>
          ) : (
            <>
              <h3>Keep Going!</h3>
              <p>
                You're {userData?.dailyRounds - todayProgress.roundsCompleted} rounds away from 
                completing today's goal. Hare Krishna!
              </p>
            </>
          )}
        </div>

        {/* Settings */}
        <div className="dashboard-settings">
          <button 
            onClick={() => {
              setIsFirstTime(true);
            }}
            className="settings-btn"
          >
            Update Goals
          </button>
          <button 
            onClick={() => showChantingReminder(userData?.dailyRounds)}
            className="settings-btn"
          >
            Test Notification
          </button>
          <button 
            onClick={() => {
              // Clear all data and logout
              logout();
              
              // Clear any remaining localStorage items
              const keysToRemove = [];
              for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('progress_') || key.startsWith('session_')) {
                  keysToRemove.push(key);
                }
              }
              keysToRemove.forEach(key => localStorage.removeItem(key));
              
              // Redirect to home
              navigate("/", { replace: true });
            }}
            className="settings-btn"
            style={{ backgroundColor: '#c33', color: 'white' }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
