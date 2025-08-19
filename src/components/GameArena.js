import React, { useState, useEffect } from 'react';
import './GameArena.css';
import ShadowTeam from './ShadowTeam';
import VSSection from './VSSection';

const GameArena = ({ 
  alphaTotal, 
  betaTotal, 
  alphaCount, 
  betaCount, 
  alphaShadowSize, 
  betaShadowSize, 
  roundTime, 
  roundStartTime, 
  onPlaceBet 
}) => {
  const [timeLeft, setTimeLeft] = useState(roundTime);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - roundStartTime) / 1000);
      const remaining = Math.max(0, roundTime - elapsed);
      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [roundTime, roundStartTime]);

  return (
    <div className="arena">
      <ShadowTeam 
        team="alpha"
        name="Shadow Alpha"
        total={alphaTotal}
        count={alphaCount}
        shadowSize={alphaShadowSize}
        onPlaceBet={onPlaceBet}
        isLeading={alphaTotal > betaTotal}
      />
      
      <VSSection timeLeft={timeLeft} />
      
      <ShadowTeam 
        team="beta"
        name="Shadow Beta"
        total={betaTotal}
        count={betaCount}
        shadowSize={betaShadowSize}
        onPlaceBet={onPlaceBet}
        isLeading={betaTotal > alphaTotal}
      />
    </div>
  );
};

export default GameArena;
