// Global time tracker for spiritual practice
let sessionStartTime = null;
let timeTrackerInterval = null;

export const startTimeTracking = () => {
  // Initialize session start time
  sessionStartTime = Date.now();
  
  // Update time every minute
  if (timeTrackerInterval) {
    clearInterval(timeTrackerInterval);
  }
  
  timeTrackerInterval = setInterval(() => {
    updateTimeSpent();
  }, 60000); // Update every minute
  
  // Also update on page visibility change
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  // Update on page unload
  window.addEventListener('beforeunload', updateTimeSpent);
};

export const stopTimeTracking = () => {
  if (timeTrackerInterval) {
    clearInterval(timeTrackerInterval);
    timeTrackerInterval = null;
  }
  
  // Save final time
  updateTimeSpent();
  
  // Remove event listeners
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  window.removeEventListener('beforeunload', updateTimeSpent);
};

const handleVisibilityChange = () => {
  if (document.hidden) {
    // Page is hidden, save current time
    updateTimeSpent();
  } else {
    // Page is visible again, restart timer
    sessionStartTime = Date.now();
  }
};

const updateTimeSpent = () => {
  if (!sessionStartTime) return;
  
  const timeSpent = Math.floor((Date.now() - sessionStartTime) / 60000); // Convert to minutes
  
  if (timeSpent > 0) {
    const today = new Date().toDateString();
    const sessionKey = `session_${today}`;
    const progressKey = `progress_${today}`;
    
    // Get current progress
    const progress = localStorage.getItem(progressKey);
    let currentProgress = {
      roundsCompleted: 0,
      chantingMinutes: 0,
      lastChanted: null
    };
    
    if (progress) {
      currentProgress = JSON.parse(progress);
    }
    
    // Get previous session time
    const previousSessionTime = parseInt(localStorage.getItem(sessionKey) || '0');
    const totalMinutes = previousSessionTime + timeSpent;
    
    // Update chanting minutes
    currentProgress.chantingMinutes = totalMinutes;
    
    // Save progress
    localStorage.setItem(progressKey, JSON.stringify(currentProgress));
    localStorage.setItem(sessionKey, totalMinutes.toString());
    
    // Reset session start time
    sessionStartTime = Date.now();
  }
};

export const getTimeSpentToday = () => {
  const today = new Date().toDateString();
  const progressKey = `progress_${today}`;
  const progress = localStorage.getItem(progressKey);
  
  if (progress) {
    const data = JSON.parse(progress);
    return data.chantingMinutes || 0;
  }
  
  return 0;
};
