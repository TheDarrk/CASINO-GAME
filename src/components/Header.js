import React from 'react';
import './Header.css';

const Header = ({ balance }) => {
  return (
    <header className="header">
      <h1 className="title">Shadow Betting Arena</h1>
      <div className="balance">
        <span className="balance-label">Balance:</span>
        <span className="balance-amount">{balance}</span>
        <span className="currency">SHAD</span>
      </div>
    </header>
  );
};

export default Header;
