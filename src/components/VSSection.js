import React from 'react';
import './VSSection.css';

const VSSection = ({ timeLeft }) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  // Determine timer color based on time remaining
  let timerColor = '#00ff88';
  let timerAnimation = 'none';
  
  if (timeLeft <= 10) {
    timerColor = '#ff4444';
    timerAnimation = 'pulse 0.5s ease-in-out infinite';
  } else if (timeLeft <= 20) {
    timerColor = '#ffaa00';
  }

  return (
    <div className="vs-section">
      <div className="vs-circle">
        <span className="vs-text">VS</span>
      </div>
      <div className="timer">
        <div className="timer-label">Next Round</div>
        <div 
          className="timer-display"
          style={{ 
            color: timerColor,
            animation: timerAnimation
          }}
        >
          {timeString}
        </div>
      </div>
    </div>
  );
};

export default VSSection;
