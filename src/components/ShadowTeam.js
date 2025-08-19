import React from 'react';
import './ShadowTeam.css';

const ShadowTeam = ({ team, name, total, count, shadowSize, onPlaceBet, isLeading }) => {
  // Calculate dynamic shadow properties based on bet amount
  const shadowScale = 1 + (shadowSize * 0.5); // Scale from 1x to 1.5x
  const shadowRise = shadowSize * 40; // Rise from 0px to 40px
  const shadowGlow = shadowSize * 0.8; // Glow intensity from 0 to 0.8
  const shadowOpacity = 0.4 + (shadowSize * 0.4); // Opacity from 0.4 to 0.8

  const handleBet = () => {
    onPlaceBet(team);
  };

  return (
    <div 
      className={`shadow-team ${team} ${isLeading ? 'leading' : ''}`}
      style={{
        transform: `translateY(-${shadowRise}px) scale(${shadowScale})`,
        borderColor: isLeading 
          ? 'rgba(0, 255, 136, 0.8)' 
          : `rgba(138, 43, 226, ${shadowOpacity})`,
        boxShadow: isLeading 
          ? '0 0 30px rgba(0, 255, 136, 0.3)' 
          : `0 0 ${30 + shadowGlow * 20}px rgba(138, 43, 226, ${shadowOpacity})`
      }}
    >
      <div 
        className="shadow-avatar"
        style={{
          transform: `scale(${shadowScale})`,
          filter: `drop-shadow(0 0 ${20 + shadowGlow * 15}px rgba(138, 43, 226, ${shadowOpacity}))`
        }}
      >
        <div className="shadow-core"></div>
        <div className="shadow-particles"></div>
      </div>
      
      <h2 className="team-name">{name}</h2>
      
      <div className="bet-info">
        <div className="total-bet">
          <span className="label">Total Bet:</span>
          <span className="amount">{total}</span>
        </div>
        <div className="bet-count">
          <span className="label">Bets:</span>
          <span className="count">{count}</span>
        </div>
      </div>
      
      <div className="bet-input">
        <input 
          type="number" 
          id={`${team}-bet`}
          placeholder="Enter bet amount" 
          min="1"
        />
        <button 
          className={`bet-btn ${team}-btn`}
          onClick={handleBet}
        >
          Bet on {name.split(' ')[1]}
        </button>
      </div>
      
      {/* Dynamic shadow effect that grows with bets */}
      <div 
        className="dynamic-shadow"
        style={{
          transform: `scale(${shadowScale * 1.2}) translateY(${shadowRise * 0.5}px)`,
          opacity: shadowOpacity * 0.6
        }}
      ></div>
    </div>
  );
};

export default ShadowTeam;
