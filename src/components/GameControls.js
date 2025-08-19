import React from 'react';
import './GameControls.css';

const GameControls = ({ onPlaceBet, currentTeam }) => {
  return (
    <div className="game-controls">
      <div className="controls-header">
        <h3>Place Your Bets</h3>
        <div className="team-indicator">
          {currentTeam && (
            <span className={`current-team ${currentTeam}`}>
              Currently betting on: {currentTeam === 'alpha' ? 'Shadow Alpha' : 'Shadow Beta'}
            </span>
          )}
        </div>
      </div>
      
      <div className="betting-controls">
        {/* Shadow Alpha Controls */}
        <div className="bet-control alpha-control">
          <div className="control-header">
            <div className="team-icon alpha-icon"></div>
            <h4>Shadow Alpha</h4>
          </div>
          <div className="bet-input-group">
            <input 
              type="number" 
              id="alpha-bet"
              placeholder="Enter bet amount" 
              min="1"
              className="bet-input alpha-input"
            />
            <button 
              className="bet-btn alpha-btn"
              onClick={() => onPlaceBet('alpha')}
            >
              Bet on Alpha
            </button>
          </div>
        </div>

        {/* VS Separator */}
        <div className="vs-separator">
          <div className="vs-line"></div>
          <div className="vs-text">VS</div>
          <div className="vs-line"></div>
        </div>

        {/* Shadow Beta Controls */}
        <div className="bet-control beta-control">
          <div className="control-header">
            <div className="team-icon beta-icon"></div>
            <h4>Shadow Beta</h4>
          </div>
          <div className="bet-input-group">
            <input 
              type="number" 
              id="beta-bet"
              placeholder="Enter bet amount" 
              min="1"
              className="bet-input beta-input"
            />
            <button 
              className="bet-btn beta-btn"
              onClick={() => onPlaceBet('beta')}
            >
              Bet on Beta
            </button>
          </div>
        </div>
      </div>

      {/* Quick Bet Buttons */}
      <div className="quick-bets">
        <button 
          className="quick-bet-btn"
          onClick={() => {
            document.getElementById('alpha-bet').value = '100';
            onPlaceBet('alpha');
          }}
        >
          Quick Bet 100 on Alpha
        </button>
        <button 
          className="quick-bet-btn"
          onClick={() => {
            document.getElementById('beta-bet').value = '100';
            onPlaceBet('beta');
          }}
        >
          Quick Bet 100 on Beta
        </button>
      </div>
    </div>
  );
};

export default GameControls;
