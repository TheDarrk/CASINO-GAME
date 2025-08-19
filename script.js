// Game State
let gameState = {
    balance: 1000,
    currentTeam: null,
    alphaBets: [],
    betaBets: [],
    roundTime: 30,
    roundActive: true,
    roundStartTime: Date.now()
};

// DOM Elements
const balanceElement = document.getElementById('balance');
const alphaTotalElement = document.getElementById('alpha-total');
const betaTotalElement = document.getElementById('beta-total');
const alphaCountElement = document.getElementById('alpha-count');
const betaCountElement = document.getElementById('beta-count');
const timerElement = document.getElementById('timer');
const historyListElement = document.getElementById('history-list');
const resultModal = document.getElementById('result-modal');

// Initialize game
document.addEventListener('DOMContentLoaded', function() {
    updateDisplay();
    startRoundTimer();
    addHistoryItem('Welcome to Shadow Betting Arena!', 'system', 0, 'Start your betting journey!');
});

// Place bet function
function placeBet(team) {
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
    if (gameState.currentTeam && gameState.currentTeam !== team) {
        const penalty = Math.floor(gameState.balance * 0.1); // 10% penalty
        gameState.balance -= penalty;
        showNotification(`Team switching penalty: -${penalty} SHAD`, 'warning');
    }
    
    // Calculate bet weight based on time
    const timeElapsed = (Date.now() - gameState.roundStartTime) / 1000;
    const weight = Math.max(0.5, 1 - (timeElapsed / gameState.roundTime) * 0.5);
    const weightedBet = Math.floor(betAmount * weight);
    
    // Deduct bet amount
    gameState.balance -= betAmount;
    
    // Add bet to team
    const bet = {
        amount: betAmount,
        weightedAmount: weightedBet,
        time: Date.now(),
        weight: weight
    };
    
    if (team === 'alpha') {
        gameState.alphaBets.push(bet);
    } else {
        gameState.betaBets.push(bet);
    }
    
    gameState.currentTeam = team;
    
    // Add to history
    addHistoryItem(
        `Bet ${betAmount} on Shadow ${team === 'alpha' ? 'Alpha' : 'Beta'}`,
        team,
        weightedBet,
        `Weight: ${(weight * 100).toFixed(0)}%`
    );
    
    // Update display
    updateDisplay();
    
    // Clear input
    betInput.value = '';
    
    showNotification(`Bet placed! Weight: ${(weight * 100).toFixed(0)}%`, 'success');
}

// Update display
function updateDisplay() {
    balanceElement.textContent = gameState.balance;
    
    // Calculate totals
    const alphaTotal = gameState.alphaBets.reduce((sum, bet) => sum + bet.weightedAmount, 0);
    const betaTotal = gameState.betaBets.reduce((sum, bet) => sum + bet.weightedAmount, 0);
    
    alphaTotalElement.textContent = alphaTotal;
    betaTotalElement.textContent = betaTotal;
    alphaCountElement.textContent = gameState.alphaBets.length;
    betaCountElement.textContent = gameState.betaBets.length;
    
    // Update team borders based on leading
    const alphaTeam = document.getElementById('team-alpha');
    const betaTeam = document.getElementById('team-beta');
    
    if (alphaTotal > betaTotal) {
        alphaTeam.style.borderColor = 'rgba(0, 255, 136, 0.8)';
        alphaTeam.style.boxShadow = '0 0 30px rgba(0, 255, 136, 0.3)';
        betaTeam.style.borderColor = 'rgba(138, 43, 226, 0.4)';
        betaTeam.style.boxShadow = 'none';
    } else if (betaTotal > alphaTotal) {
        betaTeam.style.borderColor = 'rgba(0, 255, 136, 0.8)';
        betaTeam.style.style.boxShadow = '0 0 30px rgba(0, 255, 136, 0.3)';
        alphaTeam.style.borderColor = 'rgba(138, 43, 226, 0.4)';
        alphaTeam.style.boxShadow = 'none';
    } else {
        alphaTeam.style.borderColor = 'rgba(138, 43, 226, 0.4)';
        alphaTeam.style.boxShadow = 'none';
        betaTeam.style.borderColor = 'rgba(138, 43, 226, 0.4)';
        betaTeam.style.boxShadow = 'none';
    }
}

// Start round timer
function startRoundTimer() {
    const timer = setInterval(() => {
        if (!gameState.roundActive) {
            clearInterval(timer);
            return;
        }
        
        const timeLeft = Math.max(0, gameState.roundTime - Math.floor((Date.now() - gameState.roundStartTime) / 1000));
        
        if (timeLeft <= 0) {
            endRound();
            return;
        }
        
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Change color based on time remaining
        if (timeLeft <= 10) {
            timerElement.style.color = '#ff4444';
            timerElement.style.animation = 'pulse 0.5s ease-in-out infinite';
        } else if (timeLeft <= 20) {
            timerElement.style.color = '#ffaa00';
        } else {
            timerElement.style.color = '#00ff88';
        }
    }, 1000);
}

// End round and determine winner
function endRound() {
    gameState.roundActive = false;
    
    const alphaTotal = gameState.alphaBets.reduce((sum, bet) => sum + bet.weightedAmount, 0);
    const betaTotal = gameState.betaBets.reduce((sum, bet) => sum + bet.weightedAmount, 0);
    
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
    showResultModal(winnerTeam, prizePool, winner);
    
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
        resetRound();
    }, 3000);
}

// Reset round
function resetRound() {
    gameState.alphaBets = [];
    gameState.betaBets = [];
    gameState.currentTeam = null;
    gameState.roundTime = 30;
    gameState.roundActive = true;
    gameState.roundStartTime = Date.now();
    
    updateDisplay();
    startRoundTimer();
    
    // Reset timer display
    timerElement.textContent = '00:30';
    timerElement.style.color = '#00ff88';
    timerElement.style.animation = 'none';
    
    // Reset team borders
    const alphaTeam = document.getElementById('team-alpha');
    const betaTeam = document.getElementById('team-beta');
    alphaTeam.style.borderColor = 'rgba(138, 43, 226, 0.4)';
    alphaTeam.style.boxShadow = 'none';
    betaTeam.style.borderColor = 'rgba(138, 43, 226, 0.4)';
    betaTeam.style.boxShadow = 'none';
}

// Show result modal
function showResultModal(winner, prizePool, winnerType) {
    const winnerText = document.getElementById('winner-text');
    const winnerAvatar = document.getElementById('winner-avatar');
    const prizeAmount = document.getElementById('prize-amount');
    
    winnerText.textContent = winner === 'Tie' ? 'Round Tied!' : `${winner} Wins!`;
    prizeAmount.textContent = prizePool;
    
    if (winnerType === 'alpha') {
        winnerAvatar.style.background = 'radial-gradient(circle, #8a2be2 0%, #4b0082 100%)';
        winnerAvatar.style.boxShadow = '0 0 30px rgba(138, 43, 226, 0.6)';
    } else if (winnerType === 'beta') {
        winnerAvatar.style.background = 'radial-gradient(circle, #ff00ff 0%, #800080 100%)';
        winnerAvatar.style.boxShadow = '0 0 30px rgba(255, 0, 255, 0.6)';
    } else {
        winnerAvatar.style.background = 'radial-gradient(circle, #666 0%, #333 100%)';
        winnerAvatar.style.boxShadow = '0 0 30px rgba(102, 102, 102, 0.6)';
    }
    
    resultModal.style.display = 'block';
}

// Close modal
function closeModal() {
    resultModal.style.display = 'none';
}

// Add history item
function addHistoryItem(message, team, amount, details) {
    const historyItem = document.createElement('div');
    historyItem.className = `history-item ${team === 'beta' ? 'beta' : ''}`;
    
    const timestamp = new Date().toLocaleTimeString();
    
    historyItem.innerHTML = `
        <div class="history-info">
            <div class="history-team">${message}</div>
            <div class="history-time">${timestamp}</div>
        </div>
        <div class="history-amount">${amount > 0 ? amount + ' SHAD' : ''}</div>
        <div class="history-weight">${details}</div>
    `;
    
    historyListElement.insertBefore(historyItem, historyListElement.firstChild);
    
    // Limit history items
    if (historyListElement.children.length > 20) {
        historyListElement.removeChild(historyListElement.lastChild);
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
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
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add some visual effects
function addVisualEffects() {
    // Add floating particles to the background
    const particles = document.createElement('div');
    particles.className = 'background-particles';
    particles.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
    `;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(138, 43, 226, 0.6);
            border-radius: 50%;
            animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        particles.appendChild(particle);
    }
    
    document.body.appendChild(particles);
    
    // Add CSS animation for particles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
            50% { transform: translateY(-100px) scale(1.5); opacity: 0.8; }
        }
    `;
    document.head.appendChild(style);
}

// Initialize visual effects
addVisualEffects();

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === '1') {
        document.getElementById('alpha-bet').focus();
    } else if (e.key === '2') {
        document.getElementById('beta-bet').focus();
    } else if (e.key === 'Enter') {
        const focusedInput = document.activeElement;
        if (focusedInput.id === 'alpha-bet') {
            placeBet('alpha');
        } else if (focusedInput.id === 'beta-bet') {
            placeBet('beta');
        }
    }
});

// Add hover effects for better UX
document.querySelectorAll('.shadow-team').forEach(team => {
    team.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    team.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add sound effects (optional)
function playSound(type) {
    // This would integrate with Web Audio API for sound effects
    // For now, just a placeholder
    console.log(`Playing ${type} sound`);
}

// Performance optimization: Throttle update function
let updateTimeout;
function throttledUpdate() {
    if (updateTimeout) return;
    updateTimeout = setTimeout(() => {
        updateDisplay();
        updateTimeout = null;
    }, 16); // ~60fps
}
