import React from 'react';
import './HistorySection.css';

const HistorySection = ({ history }) => {
  return (
    <div className="history-section">
      <h3 className="section-title">Betting History</h3>
      <div className="history-list">
        {history.length === 0 ? (
          <div className="history-empty">No bets placed yet</div>
        ) : (
          history.map((item) => (
            <div 
              key={item.id} 
              className={`history-item ${item.team === 'beta' ? 'beta' : ''}`}
            >
              <div className="history-info">
                <div className="history-team">{item.message}</div>
                <div className="history-time">{item.timestamp}</div>
              </div>
              <div className="history-amount">
                {item.amount > 0 ? `${item.amount} SHAD` : ''}
              </div>
              <div className="history-weight">{item.details}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistorySection;
