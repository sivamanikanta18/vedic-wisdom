import React, { useState, useEffect } from "react";
import "./EssentialTruths.css";
import { progressAPI } from "../utils/api";

const Chanting = () => {
  const [chantCount, setChantCount] = useState(0);
  const [roundCount, setRoundCount] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  const [message, setMessage] = useState("");

  // Load today's round count and calculate total rounds from backend on mount
  useEffect(() => {
    loadTodayProgress();
    calculateTotalRounds();
  }, []);

  const loadTodayProgress = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await progressAPI.getProgressByDate(today);
      if (response.success && response.progress) {
        setRoundCount(response.progress.roundsCompleted || 0);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  // Calculate total rounds from backend stats
  const calculateTotalRounds = async () => {
    try {
      const response = await progressAPI.getStats();
      if (response.success) {
        setTotalRounds(response.stats.totalRounds || 0);
      }
    } catch (error) {
      console.error('Error calculating total rounds:', error);
    }
  };

  // Update dashboard progress when round is completed
  const updateDashboardProgress = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const newRoundCount = roundCount + 1;
      
      // Get current chanting minutes from backend
      const currentProgress = await progressAPI.getProgressByDate(today);
      const chantingMinutes = currentProgress.success && currentProgress.progress 
        ? currentProgress.progress.chantingMinutes 
        : 0;
      
      // Update progress in backend
      await progressAPI.updateProgress(today, newRoundCount, chantingMinutes);
      
      return newRoundCount;
    } catch (error) {
      console.error('Error updating progress:', error);
      return roundCount + 1; // Return incremented count even on error
    }
  };

  const handleChant = async () => {
    const newChantCount = chantCount + 1;
    
    if (newChantCount === 108) {
      // Update dashboard progress
      const newRoundCount = await updateDashboardProgress();
      setRoundCount(newRoundCount);
      setChantCount(0); // Reset to 0 after completing 108
      
      // Recalculate total rounds
      await calculateTotalRounds();
      
      setMessage(`🎉 You have completed ${newRoundCount} round(s) today! One step closer to Krishna! Dashboard updated! ✅`);
    } else {
      setChantCount(newChantCount);
      if (message) setMessage(""); // Clear message when continuing
    }
  };

  return (
    <main className="essential-main">
        <div className="content" style={{ maxWidth: 600, margin: "0 auto", background: "#f9f9f9", padding: 20, borderRadius: 5, boxShadow: "0 0 5px gray" }}>
          <h1>Chanting Hare Krishna Maha Mantra</h1>
          <p>Join us in chanting the Hare Krishna Maha Mantra. Click the button to count your chants. Every completed round brings you one step closer to God.</p>
          <h2>First Chanting</h2>
          <div className="quote" style={{ marginBottom: 16 }}>
            <strong>Hare Krishna Maha Mantra:</strong><br />
            Hare Krishna Hare Krishna Krishna Krishna Hare Hare<br />
            Hare Rama Hare Rama Rama Rama Hare Hare
          </div>
          <button className="back-button" style={{ marginBottom: 12 }} onClick={handleChant}>Count</button>
          <p id="countDisplay" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--deep-maroon)' }}>Chants: {chantCount} / 108</p>
          <p id="roundDisplay" style={{ fontSize: '1.3rem', fontWeight: '600', color: 'var(--gold-dark)' }}>Rounds Completed Today: {roundCount}</p>
          <p id="totalRoundsDisplay" style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--deep-maroon)', marginTop: '0.5rem' }}>Total Rounds (All Time): {totalRounds}</p>
          <p id="messageDisplay" style={{ color: '#388e3c', fontWeight: 600, fontSize: '1.1rem' }}>{message}</p>
          <p id="infoMessage" style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--cream)', borderRadius: '8px', borderLeft: '4px solid var(--gold-primary)' }}>
            💡 <strong>Tip:</strong> One round means chanting the Hare Krishna Maha Mantra 108 times. Chanting 1 round makes you one step closer to Krishna!
          </p>
        </div>
    </main>
  );
};

export default Chanting;
