// Notification Service for Daily Reminders

export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

export const showChantingReminder = (rounds) => {
  if (Notification.permission === "granted") {
    const notification = new Notification("🙏 Hare Krishna!", {
      body: `Time for your daily chanting! Goal: ${rounds} rounds`,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag: "chanting-reminder",
      requireInteraction: false,
      silent: false
    });

    notification.onclick = () => {
      window.focus();
      window.location.href = "/dashboard";
      notification.close();
    };

    // Auto close after 10 seconds
    setTimeout(() => notification.close(), 10000);
  }
};

export const scheduleDailyReminder = (timeString, rounds) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  
  const scheduleNextReminder = () => {
    const now = new Date();
    const scheduledTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes,
      0
    );

    // If the time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilReminder = scheduledTime - now;

    setTimeout(() => {
      showChantingReminder(rounds);
      // Schedule next day's reminder
      scheduleNextReminder();
    }, timeUntilReminder);

    // Save the scheduled time
    localStorage.setItem("nextReminderTime", scheduledTime.toISOString());
  };

  scheduleNextReminder();
};

export const checkAndShowMissedReminder = (userData) => {
  const today = new Date().toDateString();
  const lastProgress = localStorage.getItem(`progress_${today}`);
  
  if (!lastProgress && userData?.dailyRounds) {
    const now = new Date();
    const [hours] = userData.reminderTime.split(":").map(Number);
    
    // If it's past the reminder time and no progress today
    if (now.getHours() > hours) {
      showChantingReminder(userData.dailyRounds);
    }
  }
};
