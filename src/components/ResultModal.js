import React from 'react';
import './ResultModal.css';

const ResultModal = ({ show, data, onClose }) => {
  if (!show) return null;

  const { winner, prizePool, winnerType } = data;
  
  const getWinnerAvatarStyle = () => {
    if (winnerType === 'alpha') {
      return {
        background: 'radial-gradient(circle, #8a2be2 0%, #4b0082 100%)',
        boxShadow: '0 0 30px rgba(138, 43, 226, 0.6)'
      };
    } else if (winnerType === 'beta') {
      return {
        background: 'radial-gradient(circle, #ff00ff 0%, #800080 100%)',
        boxShadow: '0 0 30px rgba(255, 0, 255, 0.6)'
      };
    } else {
      return {
        background: 'radial-gradient(circle, #666 0%, #333 100%)',
        boxShadow: '0 0 30px rgba(102, 102, 102, 0.6)'
      };
    }
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{winner === 'Tie' ? 'Round Tied!' : `${winner} Wins!`}</h2>
        </div>
        <div className="modal-body">
          <div className="winner-display">
            <div 
              className="winner-avatar"
              style={getWinnerAvatarStyle()}
            ></div>
            <div className="prize-info">
              <span className="prize-label">Prize Pool:</span>
              <span className="prize-amount">{prizePool}</span>
            </div>
          </div>
        </div>
        <button className="modal-btn" onClick={onClose}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default ResultModal;
