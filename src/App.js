import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Header from './components/Header';
import TekkenArena from './components/TekkenArena';
import GameControls from './components/GameControls';
import HistorySection from './components/HistorySection';
import RulesSection from './components/RulesSection';
import ResultModal from './components/ResultModal';
import BackgroundParticles from './components/BackgroundParticles';

function App() {
  const [gameState, setGameState] = useState({
    balance: 1000,
    currentTeam: null,
    alphaBets: [],
    betaBets: [],
    roundTime: 30,
    roundActive: true,
    roundStartTime: Date.now()
  });

  const [history, setHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});

  // Calculate bet totals and weights
  const alphaTotal = gameState.alphaBets.reduce((sum, bet) => sum + bet.weightedAmount, 0);
  const betaTotal = gameState.betaBets.reduce((sum, bet) => sum + bet.weightedAmount, 0);
  
  // Calculate shadow sizes based on bet amounts (normalized to 0-1 range)
  const maxBet = Math.max(alphaTotal, betaTotal, 1);
  const alphaShadowSize = alphaTotal / maxBet;
  const betaShadowSize = betaTotal / maxBet;

  // Place bet function
  const placeBet = useCallback((team) => {
    const betInput = document.getElementById(`${team}-bet`);
    const betAmount = parseInt(betInput.value);
    
    if (!betAmount || betAmount <= 0) {
      showNotification('Please enter a valid bet amount!', 'error');
      return;
    }
    
    if (betAmount > gameState.balance) {
      showNotification('Insufficient balance!', 'error');
      return;
    }
    
    // Check if switching teams (penalty applies)
    let newBalance = gameState.balance - betAmount;
    if (gameState.currentTeam && gameState.currentTeam !== team) {
      const penalty = Math.floor(gameState.balance * 0.1); // 10% penalty
      newBalance -= penalty;
      showNotification(`Team switching penalty: -${penalty} SHAD`, 'warning');
    }
    
    // Calculate bet weight based on time
    const timeElapsed = (Date.now() - gameState.roundStartTime) / 1000;
    const weight = Math.max(0.5, 1 - (timeElapsed / gameState.roundTime) * 0.5);
    const weightedBet = Math.floor(betAmount * weight);
    
    // Add bet to team
    const bet = {
      amount: betAmount,
      weightedAmount: weightedBet,
      time: Date.now(),
      weight: weight
    };
    
    const newAlphaBets = team === 'alpha' ? [...gameState.alphaBets, bet] : gameState.alphaBets;
    const newBetaBets = team === 'beta' ? [...gameState.betaBets, bet] : gameState.betaBets;
    
    setGameState(prev => ({
      ...prev,
      balance: newBalance,
      currentTeam: team,
      alphaBets: newAlphaBets,
      betaBets: newBetaBets
    }));
    
    // Add to history
    addHistoryItem(
      `Bet ${betAmount} on Shadow ${team === 'alpha' ? 'Alpha' : 'Beta'}`,
      team,
      weightedBet,
      `Weight: ${(weight * 100).toFixed(0)}%`
    );
    
    // Clear input
    betInput.value = '';
    
    showNotification(`Bet placed! Weight: ${(weight * 100).toFixed(0)}%`, 'success');
  }, [gameState]);

  // Show notification
  const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'error' ? '#ff4444' : type === 'warning' ? '#ffaa00' : type === 'success' ? '#00ff88' : '#8a2be2'};
      color: white;
      padding: 15px 25px;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      z-index: 1001;
      transform: translateX(400px);
      transition: transform 0.3s ease;
      font-weight: 600;
      max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(400px)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };

  // Add history item
  const addHistoryItem = (message, team, amount, details) => {
    const newItem = {
      id: Date.now(),
      message,
      team,
      amount,
      details,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setHistory(prev => [newItem, ...prev.slice(0, 19)]); // Keep max 20 items
  };

  // End round and determine winner
  const endRound = useCallback(() => {
    let winner, winnerTeam, prizePool;
    
    if (alphaTotal > betaTotal) {
      winner = 'alpha';
      winnerTeam = 'Shadow Alpha';
      prizePool = alphaTotal + betaTotal;
    } else if (betaTotal > alphaTotal) {
      winner = 'beta';
      winnerTeam = 'Shadow Beta';
      prizePool = alphaTotal + betaTotal;
    } else {
      winner = 'tie';
      winnerTeam = 'Tie';
      prizePool = 0;
    }
    
    // Show result modal
    setModalData({ winner: winnerTeam, prizePool, winnerType: winner });
    setShowModal(true);
    
    // Add result to history
    if (winner !== 'tie') {
      addHistoryItem(
        `${winnerTeam} wins the round!`,
        'system',
        prizePool,
        `Prize pool: ${prizePool} SHAD`
      );
    } else {
      addHistoryItem(
        'Round ended in a tie!',
        'system',
        0,
        'No winner this round'
      );
    }
    
    // Reset for next round
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        alphaBets: [],
        betaBets: [],
        currentTeam: null,
        roundTime: 30,
        roundActive: true,
        roundStartTime: Date.now()
      }));
    }, 3000);
  }, [alphaTotal, betaTotal]);

  // Start round timer
  useEffect(() => {
    if (!gameState.roundActive) return;
    
    const timer = setInterval(() => {
      const timeLeft = Math.max(0, gameState.roundTime - Math.floor((Date.now() - gameState.roundStartTime) / 1000));
      
      if (timeLeft <= 0) {
        endRound();
        return;
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameState.roundActive, gameState.roundStartTime, gameState.roundTime, endRound]);

  // Initialize game
  useEffect(() => {
    addHistoryItem('Welcome to Shadow Betting Arena!', 'system', 0, 'Start your betting journey!');
  }, []);

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '1') {
        document.getElementById('alpha-bet')?.focus();
      } else if (e.key === '2') {
        document.getElementById('beta-bet')?.focus();
      } else if (e.key === 'Enter') {
        const focusedInput = document.activeElement;
        if (focusedInput?.id === 'alpha-bet') {
          placeBet('alpha');
        } else if (focusedInput?.id === 'beta-bet') {
          placeBet('beta');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [placeBet]);

  return (
    <div className="App">
      <BackgroundParticles />
      <div className="container">
        <Header balance={gameState.balance} />
        
        {/* Main Tekken Arena - Center Focus */}
        <TekkenArena 
          alphaTotal={alphaTotal}
          betaTotal={betaTotal}
          alphaCount={gameState.alphaBets.length}
          betaCount={gameState.betaBets.length}
          alphaShadowSize={alphaShadowSize}
          betaShadowSize={betaShadowSize}
          roundTime={gameState.roundTime}
          roundStartTime={gameState.roundStartTime}
        />
        
        {/* Game Controls - Moved to Bottom */}
        <GameControls 
          onPlaceBet={placeBet}
          currentTeam={gameState.currentTeam}
        />
        
        {/* History and Rules - Side Sections */}
        <div className="side-sections">
          <HistorySection history={history} />
          <RulesSection />
        </div>
      </div>
      
      <ResultModal 
        show={showModal}
        data={modalData}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}

export default App;
