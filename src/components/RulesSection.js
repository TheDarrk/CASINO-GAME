import React from 'react';
import './RulesSection.css';

const RulesSection = () => {
  const rules = [
    {
      icon: '⚡',
      text: 'Early bets have higher weight - bet quickly for maximum impact!'
    },
    {
      icon: '🔄',
      text: 'Switching teams costs 10% of your total balance'
    },
    {
      icon: '🏆',
      text: 'Team with highest weighted bet total wins'
    },
    {
      icon: '⏰',
      text: 'New round every 30 seconds'
    },
    {
      icon: '👻',
      text: 'Shadow size grows with bet amounts - bigger bets = bigger shadows!'
    }
  ];

  return (
    <div className="rules-section">
      <h3 className="section-title">Game Rules</h3>
      <div className="rules-content">
        {rules.map((rule, index) => (
          <div key={index} className="rule">
            <span className="rule-icon">{rule.icon}</span>
            <span>{rule.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RulesSection;
