import React, { useState, useEffect } from 'react';
import './TekkenArena.css';
import VSSection from './VSSection';

const TekkenArena = ({ 
  alphaTotal, 
  betaTotal, 
  alphaCount, 
  betaCount, 
  alphaShadowSize, 
  betaShadowSize, 
  roundTime, 
  roundStartTime 
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

  // Calculate dramatic shadow properties for Tekken-style
  const alphaShadowScale = 1 + (alphaShadowSize * 1.2); // Scale from 1x to 2.2x
  const betaShadowScale = 1 + (betaShadowSize * 1.2);
  const alphaShadowRise = alphaShadowSize * 80; // Rise from 0px to 80px
  const betaShadowRise = betaShadowSize * 80;
  const alphaGlow = alphaShadowSize * 1.5; // Intense glow
  const betaGlow = betaShadowSize * 1.5;

  return (
    <div className="tekken-arena">
      {/* Arena Background */}
      <div className="arena-background">
        <div className="arena-floor"></div>
        <div className="arena-lights"></div>
      </div>

      {/* VS Section - Prominent Center */}
      <div className="vs-section-prominent">
        <VSSection timeLeft={timeLeft} />
      </div>

      {/* Shadow Alpha - Left Side */}
      <div 
        className={`shadow-force alpha-force ${alphaTotal > betaTotal ? 'dominant' : ''}`}
        style={{
          transform: `translateY(-${alphaShadowRise}px) scale(${alphaShadowScale})`,
          filter: `drop-shadow(0 0 ${30 + alphaGlow * 25}px rgba(138, 43, 226, ${0.6 + alphaShadowSize * 0.4}))`
        }}
      >
        <div className="force-aura alpha-aura"></div>
        <div className="force-core alpha-core"></div>
        <div className="force-particles alpha-particles"></div>
        
        {/* Force Stats */}
        <div className="force-stats alpha-stats">
          <div className="force-name">SHADOW ALPHA</div>
          <div className="force-power">{alphaTotal}</div>
          <div className="force-bets">{alphaCount} bets</div>
        </div>
      </div>

      {/* Shadow Beta - Right Side */}
      <div 
        className={`shadow-force beta-force ${betaTotal > alphaTotal ? 'dominant' : ''}`}
        style={{
          transform: `translateY(-${betaShadowRise}px) scale(${betaShadowScale})`,
          filter: `drop-shadow(0 0 ${30 + betaGlow * 25}px rgba(255, 0, 255, ${0.6 + betaShadowSize * 0.4}))`
        }}
      >
        <div className="force-aura beta-aura"></div>
        <div className="force-core beta-core"></div>
        <div className="force-particles beta-particles"></div>
        
        {/* Force Stats */}
        <div className="force-stats beta-stats">
          <div className="force-name">SHADOW BETA</div>
          <div className="force-power">{betaTotal}</div>
          <div className="force-bets">{betaCount} bets</div>
        </div>
      </div>

      {/* Battle Effects */}
      <div className="battle-effects">
        <div className="energy-waves"></div>
        <div className="power-ripples"></div>
      </div>

      {/* Arena Atmosphere */}
      <div className="arena-atmosphere">
        <div className="floating-debris"></div>
        <div className="energy-field"></div>
      </div>
    </div>
  );
};

export default TekkenArena;
