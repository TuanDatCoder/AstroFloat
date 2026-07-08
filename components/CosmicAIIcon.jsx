import React from 'react';

export default function CosmicAIIcon({ className = "w-6 h-6", expression = "idle", numerologyNumber = null, zodiac = null, outfit = null, ...props }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className} 
      {...props}
    >
      <defs>
        {/* Cosmic Gradient blending spiritual and AI vibes (Changes stops dynamically on Halloween) */}
        <linearGradient id="cosmicAIGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          {outfit === 'halloween' ? (
            <>
              <stop offset="0%" stopColor="#ea580c" /> {/* orange-600 */}
              <stop offset="60%" stopColor="#7e22ce" /> {/* purple-700 */}
              <stop offset="100%" stopColor="#0f172a" /> {/* slate-900 */}
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#a855f7" /> {/* purple-500 */}
              <stop offset="50%" stopColor="#d946ef" /> {/* fuchsia-500 */}
              <stop offset="100%" stopColor="#22d3ee" /> {/* cyan-400 */}
            </>
          )}
        </linearGradient>
        
        {/* Soft inner glow gradient */}
        <radialGradient id="innerFaceGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
        </radialGradient>

        {/* Embedded Keyframe animations for GIF like movement */}
        <style>{`
          @keyframes floatRing {
            0%, 100% { transform: translateY(0px) rotate(-15deg); }
            50% { transform: translateY(-0.8px) rotate(-13deg); }
          }
          @keyframes spinRing {
            0% { transform: translateY(0px) rotate(0deg); }
            100% { transform: translateY(0px) rotate(360deg); }
          }
          @keyframes naturalBlink {
            0%, 90%, 100% { transform: scaleY(1); }
            95% { transform: scaleY(0.1); }
          }
          @keyframes heartFloat {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-1.5px) scale(1.1); }
          }
          @keyframes cardFloat {
            0%, 100% { transform: translateY(0px) rotate(15deg); }
            50% { transform: translateY(-1.2px) rotate(18deg); }
          }
          @keyframes eyeScan {
            0%, 100% { transform: translateX(0px); }
            25% { transform: translateX(-0.6px); }
            75% { transform: translateX(0.6px); }
          }
          @keyframes drivingShake {
            0%, 100% { transform: rotate(0deg) translateY(0); }
            25% { transform: rotate(-2deg) translateY(-0.4px); }
            75% { transform: rotate(2deg) translateY(0.4px); }
          }
          @keyframes readingBob {
            0%, 100% { transform: translateY(0) rotate(0); }
            50% { transform: translateY(0.6px) rotate(1deg); }
          }
          @keyframes dizzyWobble {
            0%, 100% { transform: rotate(0deg) translate(0px, 0px); }
            25% { transform: rotate(-4deg) translate(-0.8px, -0.4px); }
            50% { transform: rotate(4deg) translate(0.8px, 0.4px); }
            75% { transform: rotate(-2deg) translate(-0.4px, 0.8px); }
          }
          @keyframes haloSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes rocketVibrate {
            0%, 100% { transform: translate(0px, 0px); }
            20% { transform: translate(-0.4px, 0.4px); }
            40% { transform: translate(0.4px, -0.4px); }
            60% { transform: translate(-0.4px, -0.4px); }
            80% { transform: translate(0.4px, 0.4px); }
          }
          @keyframes dancingMove {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            25% { transform: translateY(-1.5px) rotate(-5deg); }
            50% { transform: translateY(0) rotate(0deg); }
            75% { transform: translateY(-1.5px) rotate(5deg); }
          }
          @keyframes coffeeBob {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(0.4px) rotate(1deg); }
          }
          @keyframes numberPlay {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(-1.5px, -2px) scale(1.1); }
            66% { transform: translate(1px, -1px) scale(0.95); }
          }
          @keyframes lookAround {
            0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
            25% { transform: translate(-1px, -0.5px) rotate(-1deg); }
            50% { transform: translate(1px, -0.2px) rotate(1deg); }
            75% { transform: translate(-0.5px, 0.5px) rotate(-0.5deg); }
          }
          @keyframes writingScribble {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            20% { transform: translateY(0.8px) rotate(-2deg); }
            50% { transform: translateY(1.2px) rotate(-3.5deg); }
            80% { transform: translateY(0.5px) rotate(-1deg); }
          }
          @keyframes penStroke {
            0%   { transform: translate(0px, 0px) rotate(-18deg); }
            25%  { transform: translate(-1.2px, 0.6px) rotate(-20deg); }
            50%  { transform: translate(0.8px, 1px) rotate(-16deg); }
            75%  { transform: translate(-0.6px, 0.4px) rotate(-19deg); }
            100% { transform: translate(0px, 0px) rotate(-18deg); }
          }
          @keyframes inkGlow {
            0%, 100% { opacity: 0.4; r: 0.3; }
            50% { opacity: 1; r: 0.5; }
          }
          @keyframes scrollUnfurl {
            0%, 100% { transform: scaleY(1) translateY(0); }
            50% { transform: scaleY(1.04) translateY(0.3px); }
          }
          @keyframes birthdaySparkle {
            0%, 100% { opacity: 0.6; transform: scale(1) rotate(0deg); }
            33% { opacity: 1; transform: scale(1.3) rotate(15deg); }
            66% { opacity: 0.8; transform: scale(0.9) rotate(-10deg); }
          }
          @keyframes galaxyFloat {
            0%, 100% { transform: rotate(0deg) translateY(0px); }
            50% { transform: rotate(5deg) translateY(-1px); }
          }
          @keyframes vertigoSpin {
            0% { transform: rotate(0deg) translate(0, 0); }
            25% { transform: rotate(-8deg) translate(-1px, -0.5px); }
            50% { transform: rotate(8deg) translate(1px, 0.5px); }
            75% { transform: rotate(-4deg) translate(-0.5px, 0.5px); }
            100% { transform: rotate(0deg) translate(0, 0); }
          }
          @keyframes vertigoStarOrbit {
            0% { transform: rotate(0deg) translateX(6px) rotate(0deg); }
            100% { transform: rotate(360deg) translateX(6px) rotate(-360deg); }
          }
          @keyframes vertigoSpiralPulse {
            0%, 100% { opacity: 0.7; transform: scale(1) rotate(0deg); }
            50% { opacity: 1; transform: scale(1.15) rotate(180deg); }
          }

          .look-around-head-anim {
            animation: lookAround 5s ease-in-out infinite;
            transform-origin: 12px 13px;
          }
          .cosmic-ring-anim {
            animation: floatRing 3s ease-in-out infinite;
            transform-origin: 12px 12px;
          }
          .cosmic-ring-spin-anim {
            animation: spinRing 4s linear infinite;
            transform-origin: 12px 12px;
          }
          .blink-left-anim {
            animation: naturalBlink 4s ease-in-out infinite;
            transform-origin: 9px 12.8px;
          }
          .blink-right-anim {
            animation: naturalBlink 4s ease-in-out infinite;
            transform-origin: 15px 12.8px;
          }
          .heart-float-anim {
            animation: heartFloat 2s ease-in-out infinite;
            transform-origin: 12px 12px;
          }
          .card-float-anim {
            animation: cardFloat 2.5s ease-in-out infinite;
            transform-origin: 19px 5px;
          }
          .eye-scan-anim {
            animation: eyeScan 1s ease-in-out infinite;
          }
          .driving-head-anim {
            animation: drivingShake 0.25s linear infinite;
            transform-origin: 12px 13px;
          }
          .reading-head-anim {
            animation: readingBob 2.5s ease-in-out infinite;
            transform-origin: 12px 13px;
          }
          .dizzy-head-anim {
            animation: dizzyWobble 0.4s ease-in-out infinite;
            transform-origin: 12px 13px;
          }
          .dizzy-halo-anim {
            animation: haloSpin 2.5s linear infinite;
            transform-origin: 12px 4px;
          }
          .rocket-head-anim {
            animation: rocketVibrate 0.12s linear infinite;
            transform-origin: 12px 13px;
          }
          .dancing-head-anim {
            animation: dancingMove 0.5s ease-in-out infinite;
            transform-origin: 12px 17px;
          }
          .coffee-head-anim {
            animation: coffeeBob 3s ease-in-out infinite;
            transform-origin: 12px 13px;
          }
          .number-play-anim {
            animation: numberPlay 3s ease-in-out infinite;
            transform-origin: 19px 12px;
          }
          .writing-head-anim {
            animation: writingScribble 1.2s ease-in-out infinite;
            transform-origin: 12px 13px;
          }
          .pen-scribble-anim {
            animation: penStroke 0.9s ease-in-out infinite;
            transform-origin: 17px 16px;
          }
          .scroll-unfurl-anim {
            animation: scrollUnfurl 2s ease-in-out infinite;
            transform-origin: 12px 19px;
          }
          .birthday-sparkle-anim {
            animation: birthdaySparkle 1.5s ease-in-out infinite;
          }
          .galaxy-float-anim {
            animation: galaxyFloat 3s ease-in-out infinite;
            transform-origin: 18px 8px;
          }
          .vertigo-head-anim {
            animation: vertigoSpin 0.35s ease-in-out infinite;
            transform-origin: 12px 13px;
          }
          .vertigo-star-orbit-anim {
            animation: vertigoStarOrbit 1.2s linear infinite;
            transform-origin: 12px 6px;
          }
          .vertigo-spiral-anim {
            animation: vertigoSpiralPulse 0.8s ease-in-out infinite;
          }
          @keyframes spinCW {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes spinCCW {
            0% { transform: rotate(360deg); }
            100% { transform: rotate(0deg); }
          }
          .vortex-spin-clockwise {
            animation: spinCW 1.5s linear infinite;
            transform-origin: 12px 12px;
          }
          .vortex-spin-counterclockwise {
            animation: spinCCW 1.8s linear infinite;
            transform-origin: 12px 12px;
          }
          .vortex-spin-clockwise-fast {
            animation: spinCW 0.8s linear infinite;
            transform-origin: 12px 12px;
          }
        `}</style>
      </defs>

      {/* Orbit Ring (Cosmic Aspect) - Back Side (Not showing when launching rocket for clean lines) */}
      {expression !== 'rocket' && expression !== 'vortex' && (
        <path 
          d="M3 13.5c1.5-1.5 5.5-3.2 9-3.2s7.5 1.7 9 3.2" 
          stroke="url(#cosmicAIGrad)" 
          strokeWidth="1.2" 
          strokeLinecap="round" 
          strokeDasharray="2 2"
          opacity="0.6"
          className={expression === 'vertigo' ? 'cosmic-ring-spin-anim' : 'cosmic-ring-anim'}
        />
      )}

      {/* Ears / Side Bolt Receivers */}
      {expression !== 'rocket' && expression !== 'vortex' && (
        <>
          <rect x="3.5" y="11.5" width="2" height="3" rx="0.8" fill="url(#cosmicAIGrad)" opacity="0.8" />
          <rect x="18.5" y="11.5" width="2" height="3" rx="0.8" fill="url(#cosmicAIGrad)" opacity="0.8" />
        </>
      )}

      {/* Main animated group representing the bot head */}
      <g className={
        expression === 'driving' ? 'driving-head-anim' :
        expression === 'reading' ? 'reading-head-anim' :
        expression === 'writing' ? 'writing-head-anim' :
        expression === 'searching' || expression === 'dizzy' ? 'look-around-head-anim' :
        expression === 'thinking' || expression === 'calculating' ? 'dizzy-head-anim' :
        expression === 'vertigo' ? 'vertigo-head-anim' :
        expression === 'rocket' ? 'rocket-head-anim' :
        expression === 'dancing' || expression === 'party' ? 'dancing-head-anim' :
        expression === 'coffee' || expression === 'numerology' || expression === 'love' || expression === 'pondering' || expression?.startsWith('tarot_') ? 'coffee-head-anim' : ''
      }>
        {expression === 'vortex' ? (
          <g>
            {/* Spinning background vortex rings */}
            <g transform-origin="12 12" className="vortex-spin-clockwise">
              <ellipse cx="12" cy="12" rx="9" ry="3.5" fill="none" stroke="url(#cosmicAIGrad)" strokeWidth="1" transform="rotate(30 12 12)" opacity="0.6" />
              <ellipse cx="12" cy="12" rx="7.5" ry="2.5" fill="none" stroke="#22d3ee" strokeWidth="0.8" transform="rotate(75 12 12)" opacity="0.8" />
              <ellipse cx="12" cy="12" rx="6" ry="1.8" fill="none" stroke="#d946ef" strokeWidth="1.2" transform="rotate(120 12 12)" opacity="0.7" />
              <ellipse cx="12" cy="12" rx="4.5" ry="1.2" fill="none" stroke="#a855f7" strokeWidth="1" transform="rotate(165 12 12)" opacity="0.9" />
            </g>
            
            {/* Swirling particle streams */}
            <g transform-origin="12 12" className="vortex-spin-counterclockwise">
              <path d="M12 12 Q14 7 19 9" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" fill="none" />
              <path d="M12 12 Q10 17 5 15" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" fill="none" />
              <path d="M12 12 Q17 14 15 19" stroke="#d946ef" strokeWidth="1.2" strokeLinecap="round" fill="none" />
              <path d="M12 12 Q7 10 9 5" stroke="#d946ef" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            </g>

            {/* Glowing magic center core */}
            <circle cx="12" cy="12" r="2" fill="#ffffff" className="animate-pulse" />
            <circle cx="12" cy="12" r="3.5" fill="none" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="1 2" className="vortex-spin-clockwise-fast" />

            {/* Magic sparkles flying out */}
            <g className="animate-pulse">
              <circle cx="6" cy="7" r="0.6" fill="#22d3ee" />
              <circle cx="18" cy="17" r="0.6" fill="#d946ef" />
              <circle cx="17" cy="6" r="0.4" fill="#fbbf24" />
              <circle cx="7" cy="18" r="0.4" fill="#fbbf24" />
            </g>
          </g>
        ) : (
          <>
            {/* Rocket Side Wings (Only when launching) */}
            {expression === 'rocket' && (
          <>
            <path d="M4.5 12l-2.5 3.5h2.5z" fill="url(#cosmicAIGrad)" stroke="url(#cosmicAIGrad)" strokeWidth="0.8" />
            <path d="M19.5 12l2.5 3.5h-2.5z" fill="url(#cosmicAIGrad)" stroke="url(#cosmicAIGrad)" strokeWidth="0.8" />
            
            {/* Rocket Thruster Flame */}
            <path d="M9.5 17.5l2.5 4.5 2.5-4.5z" fill="#f97316" />
            <path d="M11 17.5l1 2.5 1-2.5z" fill="#ef4444" />
          </>
        )}

        {/* Dancing Waving Arms */}
        {expression === 'dancing' && (
          <>
            <path d="M5.5 14.5c-1-1.5-1.5-2.8-1-3.2" stroke="url(#cosmicAIGrad)" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M18.5 14.5c1-1.5 1.5-2.8 1-3.2" stroke="url(#cosmicAIGrad)" strokeWidth="1.2" strokeLinecap="round" />
          </>
        )}

        {/* Leo Mane */}
        {zodiac === 'leo' && (
          <>
            <path 
              d="M3 10c-1.5-2.5 1.5-5.5 4.5-5.5s4 1.5 4.5 1.5s1.5-1.5 4.5-1.5s6 3 4.5 5.5s-1 5-4.5 5s-2.5-.5-4.5-.5s-2.5.5-4.5.5s-3-2.5-4.5-5z" 
              fill="#f59e0b" 
              fillOpacity="0.25" 
              stroke="#f59e0b" 
              strokeWidth="0.8" 
              strokeOpacity="0.3" 
            />
            {/* Two cute lion ears on top */}
            <path d="M6.5 8l-2-2.5l-.5 2.5z" fill="#f59e0b" />
            <path d="M17.5 8l2-2.5l.5 2.5z" fill="#f59e0b" />
          </>
        )}

        {/* Robot Head Body */}
        <rect 
          x="5" 
          y="8" 
          width="14" 
          height="9.5" 
          rx="4" 
          fill="#060919" 
          fillOpacity="0.85" 
          stroke="url(#cosmicAIGrad)" 
          strokeWidth="1.5" 
        />
        
        {/* Inner Glow Face overlay */}
        <rect 
          x="5" 
          y="8" 
          width="14" 
          height="9.5" 
          rx="4" 
          fill="url(#innerFaceGlow)" 
          pointerEvents="none"
        />

        {/* Forehead Symbol (Zodiac or Moon) */}
        {zodiac ? (
          <text 
            x="12" 
            y="11.2" 
            fill="#22d3ee" 
            fontSize="3.2" 
            fontWeight="bold" 
            textAnchor="middle" 
            style={{ fontStyle: 'normal', fontFamily: 'Arial, sans-serif' }}
            opacity="0.95"
            className="drop-shadow-[0_0_2px_rgba(34,211,238,0.8)]"
          >
            {zodiac === 'aries' ? '♈' :
             zodiac === 'taurus' ? '♉' :
             zodiac === 'gemini' ? '♊' :
             zodiac === 'cancer' ? '♋' :
             zodiac === 'leo' ? '♌' :
             zodiac === 'virgo' ? '♍' :
             zodiac === 'libra' ? '♎' :
             zodiac === 'scorpio' ? '♏' :
             zodiac === 'sagittarius' ? '♐' :
             zodiac === 'capricorn' ? '♑' :
             zodiac === 'aquarius' ? '♒' :
             zodiac === 'pisces' ? '♓' : ''}
          </text>
        ) : (
          <path 
            d="M12.2 9.8c0-.5.2-.9.7-1.1-.1-.1-.2-.1-.3-.1-.7 0-1.2.5-1.2 1.2s.5 1.2 1.2 1.2c.1 0 .2 0 .3-.1-.4-.1-.7-.6-.7-1.1z" 
            fill="#22d3ee" 
            opacity="0.9"
          />
        )}

        {/* Expressions Logic */}
        {expression === 'happy' && (
          <>
            <path d="M7.8 13c.3-.4.9-.4 1.2 0" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <path d="M15 13c.3-.4.9-.4 1.2 0" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <ellipse cx="7.2" cy="14.3" rx="1.2" ry="0.7" fill="#d946ef" fillOpacity="0.8" />
            <ellipse cx="16.8" cy="14.3" rx="1.2" ry="0.7" fill="#d946ef" fillOpacity="0.8" />
            <path d="M11.2 14.8c.2.5 1.4.5 1.6 0" fill="#22d3ee" stroke="#22d3ee" strokeWidth="1" strokeLinecap="round" />
          </>
        )}

        {expression === 'sleepy' && (
          <>
            <path d="M8 12.8c.2.4.8.4 1 0" stroke="#22d3ee" strokeWidth="1.3" strokeLinecap="round" fill="none" />
            <path d="M15 12.8c.2.4.8.4 1 0" stroke="#22d3ee" strokeWidth="1.3" strokeLinecap="round" fill="none" />
            <line x1="11.5" y1="14.8" x2="12.5" y2="14.8" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" />
            <g className="animate-pulse" style={{ transformOrigin: '19px 4px' }}>
              <path d="M18 4.5h1.5L18 6h1.5" stroke="#22d3ee" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M19.5 2h1L19.5 3h1" stroke="#d946ef" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>
          </>
        )}

        {expression === 'thinking' && (
          <>
            <ellipse cx="9" cy="12.2" rx="1.1" ry="1.4" fill="#22d3ee" />
            <ellipse cx="15" cy="12.2" rx="1.3" ry="1.6" fill="#22d3ee" />
            <circle cx="9.2" cy="11.7" r="0.35" fill="#ffffff" />
            <circle cx="15.2" cy="11.7" r="0.4" fill="#ffffff" />
            <path d="M11 14.8c.3-.2.7.2 1 0s.7-.2 1 0" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <g className="animate-bounce" style={{ transformOrigin: '19px 3px' }}>
              <circle cx="18" cy="4" r="0.6" fill="#22d3ee" />
              <circle cx="19.5" cy="3" r="0.6" fill="#d946ef" />
              <circle cx="21" cy="4" r="0.6" fill="#22d3ee" />
            </g>
          </>
        )}

        {expression === 'love' && (
          <>
            <ellipse cx="9" cy="12.8" rx="1.3" ry="1.6" fill="#22d3ee" className="blink-left-anim" />
            <ellipse cx="15" cy="12.8" rx="1.3" ry="1.6" fill="#22d3ee" className="blink-right-anim" />
            <circle cx="9.4" cy="12.3" r="0.4" fill="#ffffff" className="blink-left-anim" />
            <circle cx="15.4" cy="12.3" r="0.4" fill="#ffffff" className="blink-right-anim" />
            <ellipse cx="7.2" cy="14.3" rx="1.3" ry="0.8" fill="#f43f5e" fillOpacity="0.85" />
            <ellipse cx="16.8" cy="14.3" rx="1.3" ry="0.8" fill="#f43f5e" fillOpacity="0.85" />
            <path d="M11.2 14.8c.3.4.9.4 1.6 0" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" />
            <g className="heart-float-anim">
              <path d="M19 2.5c-.5-.5-1.2 0-1.2 0s-.7-.5-1.2 0c-.5.5-.5 1.2 0 1.8l1.2 1.2 1.2-1.2c.5-.6.5-1.3 0-1.8z" fill="#f43f5e" />
              <path d="M5.2 6c-.3-.3-.8 0-.8 0s-.4-.3-.8 0c-.3.3-.3.8 0 1.1l.8.8.8-.8c.3-.3.3-.8 0-1.1z" fill="#f43f5e" opacity="0.8" />
            </g>
          </>
        )}

        {expression === 'tarot' && (
          <>
            <ellipse cx="9" cy="12.8" rx="1.3" ry="1.6" fill="#22d3ee" className="blink-left-anim" />
            <ellipse cx="15" cy="12.8" rx="1.3" ry="1.6" fill="#22d3ee" className="blink-right-anim" />
            <circle cx="9.4" cy="12.3" r="0.4" fill="#ffffff" className="blink-left-anim" />
            <circle cx="15.4" cy="12.3" r="0.4" fill="#ffffff" className="blink-right-anim" />
            <ellipse cx="7.2" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.6" />
            <ellipse cx="16.8" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.6" />
            <path d="M11.2 14.8c.3.4.9.4 1.6 0" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" />
            <g className="card-float-anim">
              <rect x="17.2" y="2" width="4.5" height="7" rx="0.5" fill="#060919" stroke="#d946ef" strokeWidth="0.8" />
              <path d="M19.5 4.5l.5.8-.5.8-.5-.8z" fill="#22d3ee" opacity="0.8" />
            </g>
          </>
        )}

        {expression === 'calculating' && (
          <>
            <ellipse cx="9" cy="12.8" rx="1.3" ry="1.6" fill="#22d3ee" opacity="0.6" />
            <ellipse cx="15" cy="12.8" rx="1.3" ry="1.6" fill="#22d3ee" opacity="0.6" />
            <g className="eye-scan-anim">
              <circle cx="9" cy="12.8" r="0.6" fill="#22d3ee" />
              <circle cx="15" cy="12.8" r="0.6" fill="#22d3ee" />
            </g>
            <circle cx="12" cy="14.8" r="0.6" fill="#22d3ee" />
            <g className="animate-spin" style={{ transformOrigin: '12px 12px', animationDuration: '3s' }}>
              <circle cx="12" cy="2" r="0.6" fill="#22d3ee" />
              <circle cx="22" cy="12" r="0.6" fill="#d946ef" />
              <circle cx="12" cy="22" r="0.6" fill="#22d3ee" />
              <circle cx="2" cy="12" r="0.6" fill="#d946ef" />
            </g>
          </>
        )}

        {expression === 'wink' && (
          <>
            <ellipse cx="9" cy="12.8" rx="1.3" ry="1.6" fill="#22d3ee" />
            <circle cx="9.4" cy="12.3" r="0.4" fill="#ffffff" />
            <path d="M14 13c.2.4.8.4 1 0" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <ellipse cx="7.2" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.6" />
            <ellipse cx="16.8" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.6" />
            <path d="M11.2 14.8c.3.4.9.4 1.6 0" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" />
          </>
        )}

        {expression === 'excited' && (
          <>
            <path d="M9 11.3l.4.9.9.4-.9.4-.4.9-.4-.9-.9-.4.9-.4Z" fill="#22d3ee" />
            <path d="M15 11.3l.4.9.9.4-.9.4-.4.9-.4-.9-.9-.4.9-.4Z" fill="#22d3ee" />
            <ellipse cx="7.2" cy="14.3" rx="1.3" ry="0.8" fill="#d946ef" fillOpacity="0.8" />
            <ellipse cx="16.8" cy="14.3" rx="1.3" ry="0.8" fill="#d946ef" fillOpacity="0.8" />
            <path d="M11 14.8c.2.6 1.8.6 2 0" fill="#22d3ee" stroke="#22d3ee" strokeWidth="1" strokeLinecap="round" />
            <g className="animate-bounce" style={{ transformOrigin: '19px 3px' }}>
              <circle cx="18" cy="4" r="0.6" fill="#22d3ee" />
              <circle cx="5" cy="5" r="0.6" fill="#d946ef" />
            </g>
          </>
        )}

        {expression === 'shocked' && (
          <>
            <path d="M8 11.8l2 2M10 11.8l-2 2" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M14 11.8l2 2M16 11.8l-2 2" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="12" cy="14.8" r="0.8" stroke="#22d3ee" strokeWidth="1.2" fill="none" />
          </>
        )}

        {/* Driving expression (chạy xe) */}
        {expression === 'driving' && (
          <>
            <ellipse cx="9" cy="12.8" rx="1.3" ry="1.6" fill="#22d3ee" className="blink-left-anim" />
            <ellipse cx="15" cy="12.8" rx="1.3" ry="1.6" fill="#22d3ee" className="blink-right-anim" />
            <circle cx="9.4" cy="12.3" r="0.4" fill="#ffffff" className="blink-left-anim" />
            <circle cx="15.4" cy="12.3" r="0.4" fill="#ffffff" className="blink-right-anim" />
            <ellipse cx="7.2" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.6" />
            <ellipse cx="16.8" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.6" />
            <path d="M11.2 14.8c.3.4.9.4 1.6 0" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" />
            
            {/* Steering wheel */}
            <g className="animate-bounce" style={{ transformOrigin: '12px 16px', animationDuration: '0.8s' }}>
              <circle cx="12" cy="16.5" r="2.2" stroke="#22d3ee" strokeWidth="0.8" fill="none" />
              <line x1="12" y1="16.5" x2="12" y2="18.7" stroke="#22d3ee" strokeWidth="0.8" />
              <line x1="9.8" y1="16.5" x2="14.2" y2="16.5" stroke="#22d3ee" strokeWidth="0.8" />
            </g>
          </>
        )}

        {/* Reading expression (đọc sách) */}
        {expression === 'reading' && (
          <>
            <ellipse cx="9" cy="13.4" rx="1.3" ry="0.8" fill="#22d3ee" className="blink-left-anim" />
            <ellipse cx="15" cy="13.4" rx="1.3" ry="0.8" fill="#22d3ee" className="blink-right-anim" />
            
            <ellipse cx="7.2" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.6" />
            <ellipse cx="16.8" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.6" />
            <path d="M11.2 14.8c.3.2.9.2 1.6 0" stroke="#22d3ee" strokeWidth="1" strokeLinecap="round" />
            
            {/* Mini open book */}
            <path 
              d="M9 17.5c.8-.4 2-.2 2.5.2c.5-.4 1.7-.6 2.5-.2v-2c-.8-.4-2-.2-2.5.2c-.5-.4-1.7-.6-2.5-.2z" 
              fill="#060919" 
              stroke="#d946ef" 
              strokeWidth="0.8" 
            />
          </>
        )}

        {/* Writing expression - Astro cúi đầu viết lên cuộn giấy bằng bút lông */}
        {expression === 'writing' && (
          <>
            {/* Eyes: half-closed, focused downward (nhìn xuống chăm chú) */}
            <ellipse cx="9"  cy="13.5" rx="1.4" ry="0.7" fill="#22d3ee" className="blink-left-anim"  />
            <ellipse cx="15" cy="13.5" rx="1.4" ry="0.7" fill="#22d3ee" className="blink-right-anim" />
            {/* Tiny white shines */}
            <circle cx="9.5"  cy="13.3" r="0.25" fill="#ffffff" className="blink-left-anim" />
            <circle cx="15.5" cy="13.3" r="0.25" fill="#ffffff" className="blink-right-anim" />

            {/* Blush - concentrated pink */}
            <ellipse cx="7"   cy="14.6" rx="1.2" ry="0.65" fill="#d946ef" fillOpacity="0.55" />
            <ellipse cx="17"  cy="14.6" rx="1.2" ry="0.65" fill="#d946ef" fillOpacity="0.55" />

            {/* Tiny focused mouth - pressed together */}
            <path d="M10.8 15.4 Q12 15.7 13.2 15.4" stroke="#22d3ee" strokeWidth="0.9" strokeLinecap="round" fill="none" />

            {/* === SCROLL / PARCHMENT === */}
            <g className="scroll-unfurl-anim">
              {/* Scroll body */}
              <rect x="5.5" y="17" width="13" height="5.5" rx="0.6" fill="#fef9ec" stroke="#d97706" strokeWidth="0.45" />
              {/* Top curl */}
              <ellipse cx="12" cy="17" rx="6.5" ry="0.9" fill="#fde68a" stroke="#d97706" strokeWidth="0.4" />
              {/* Bottom curl */}
              <ellipse cx="12" cy="22.5" rx="6.5" ry="0.9" fill="#fde68a" stroke="#d97706" strokeWidth="0.4" />
              {/* Written lines on scroll */}
              <line x1="7.2" y1="19"   x2="16.8" y2="19"   stroke="#a78bfa" strokeWidth="0.45" strokeLinecap="round" />
              <line x1="7.2" y1="20.2" x2="14.5" y2="20.2" stroke="#a78bfa" strokeWidth="0.45" strokeLinecap="round" />
              {/* Glowing ink trail being written */}
              <line x1="7.2" y1="21.4" x2="11.5" y2="21.4" stroke="#22d3ee" strokeWidth="0.5" strokeLinecap="round" className="animate-pulse" />
            </g>

            {/* === QUILL PEN === */}
            <g className="pen-scribble-anim">
              {/* Feather shaft */}
              <line x1="17" y1="11" x2="11.8" y2="21.6" stroke="#a855f7" strokeWidth="0.9" strokeLinecap="round" />
              {/* Feather barbs - left */}
              <path d="M16.2 12.5 Q14.5 12 14 13.5" stroke="#c4b5fd" strokeWidth="0.55" fill="none" strokeLinecap="round" />
              <path d="M15.4 14   Q13.8 13.5 13.4 15" stroke="#c4b5fd" strokeWidth="0.55" fill="none" strokeLinecap="round" />
              <path d="M14.6 15.5 Q13.2 15.2 13 16.5" stroke="#c4b5fd" strokeWidth="0.55" fill="none" strokeLinecap="round" />
              {/* Feather barbs - right */}
              <path d="M16.2 12.5 Q17.8 12.2 17.5 13.5" stroke="#ddd6fe" strokeWidth="0.5" fill="none" strokeLinecap="round" />
              <path d="M15.4 14   Q17 13.8 16.8 15"   stroke="#ddd6fe" strokeWidth="0.5" fill="none" strokeLinecap="round" />
              {/* Nib tip */}
              <path d="M12.2 20.6 L11.5 21.8 L12.8 21.4 Z" fill="#1e293b" />
              {/* Ink dot - glowing */}
              <circle cx="11.7" cy="21.7" r="0.35" fill="#22d3ee">
                <animate attributeName="r" values="0.25;0.45;0.25" dur="0.9s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;1;0.6" dur="0.9s" repeatCount="indefinite" />
              </circle>
            </g>

            {/* Floating sparkle above (inspiration!) */}
            <path d="M5.5 7l.25.5.5.25-.5.25-.25.5-.25-.5-.5-.25.5-.25z" fill="#a855f7" opacity="0.8" className="animate-pulse" />
            <path d="M19.5 8l.2.4.4.2-.4.2-.2.4-.2-.4-.4-.2.4-.2z" fill="#22d3ee" opacity="0.7" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
          </>
        )}

        {/* Dizzy expression (soi ống nhòm chân thực, đẹp mắt) */}
        {expression === 'dizzy' && (
          <>
            {/* Binoculars Group (Rotated to point Up-Left) */}
            <g transform="rotate(-35, 11.5, 12)">
              {/* Bridge */}
              <rect x="9.5" y="7" width="4" height="2" fill="#a855f7" rx="0.5" />
              <line x1="11.5" y1="7" x2="11.5" y2="9" stroke="#22d3ee" strokeWidth="0.5" />

              {/* --- Left Tube --- */}
              {/* Main body */}
              <path d="M 6.5 5 L 10.5 5 L 10 11 L 7 11 Z" fill="#0f172a" stroke="#22d3ee" strokeWidth="0.8" strokeLinejoin="round" />
              <line x1="7" y1="7" x2="10.2" y2="7" stroke="#3b82f6" strokeWidth="0.5" />
              <line x1="7.2" y1="9" x2="10" y2="9" stroke="#3b82f6" strokeWidth="0.5" />
              {/* Front lens casing */}
              <rect x="6" y="3.5" width="5" height="1.5" rx="0.4" fill="#1e1b4b" stroke="#22d3ee" strokeWidth="0.8" />
              {/* Front glass */}
              <ellipse cx="8.5" cy="4.2" rx="1.8" ry="0.4" fill="#22d3ee" />
              <ellipse cx="8" cy="4" rx="0.4" ry="0.1" fill="#ffffff" />
              {/* Eyecup */}
              <path d="M 7 11 L 10 11 L 10.5 13 L 6.5 13 Z" fill="#0f172a" stroke="#22d3ee" strokeWidth="0.8" strokeLinejoin="round" />

              {/* --- Right Tube --- */}
              {/* Main body */}
              <path d="M 12.5 5 L 16.5 5 L 16 11 L 13 11 Z" fill="#0f172a" stroke="#22d3ee" strokeWidth="0.8" strokeLinejoin="round" />
              <line x1="12.8" y1="7" x2="16" y2="7" stroke="#3b82f6" strokeWidth="0.5" />
              <line x1="13" y1="9" x2="15.8" y2="9" stroke="#3b82f6" strokeWidth="0.5" />
              {/* Front lens casing */}
              <rect x="12" y="3.5" width="5" height="1.5" rx="0.4" fill="#1e1b4b" stroke="#22d3ee" strokeWidth="0.8" />
              {/* Front glass */}
              <ellipse cx="14.5" cy="4.2" rx="1.8" ry="0.4" fill="#22d3ee" />
              <ellipse cx="14" cy="4" rx="0.4" ry="0.1" fill="#ffffff" />
              {/* Eyecup */}
              <path d="M 13 11 L 16 11 L 16.5 13 L 12.5 13 Z" fill="#0f172a" stroke="#22d3ee" strokeWidth="0.8" strokeLinejoin="round" />

              {/* Hands Holding Binoculars */}
              <circle cx="6.5" cy="9.5" r="1.4" fill="url(#cosmicAIGrad)" stroke="#060919" strokeWidth="0.5" />
              <circle cx="16.5" cy="9.5" r="1.4" fill="url(#cosmicAIGrad)" stroke="#060919" strokeWidth="0.5" />
            </g>

            {/* Blush (on face) */}
            <ellipse cx="5.5" cy="14" rx="1.2" ry="0.6" fill="#d946ef" fillOpacity="0.5" />
            <ellipse cx="17.5" cy="14" rx="1.2" ry="0.6" fill="#d946ef" fillOpacity="0.5" />

            {/* Curiously open mouth */}
            <ellipse cx="11.5" cy="15.5" rx="1.4" ry="1.0" fill="#060919" stroke="#22d3ee" strokeWidth="0.6" />
            <path d="M 10.8 15.5 Q 11.5 16.2 12.2 15.5" stroke="#d946ef" strokeWidth="0.5" fill="none" />
          </>
        )}

        {/* Vertigo expression (chóng mặt khi lướt nhanh) */}
        {expression === 'vertigo' && (
          <>
            {/* Spiral Eyes (mắt xoáy xoắn ốc) */}
            <g className="vertigo-spiral-anim" style={{ transformOrigin: '9px 13px' }}>
              <circle cx="9" cy="13" r="2" fill="#060919" stroke="#22d3ee" strokeWidth="0.6" />
              <path d="M9 11.5 Q10 12.5 9 13 Q8 13.5 9 14 Q10 14.5 9 14.5" stroke="#a855f7" strokeWidth="0.8" fill="none" strokeLinecap="round" />
            </g>
            <g className="vertigo-spiral-anim" style={{ transformOrigin: '15px 13px', animationDelay: '0.2s' }}>
              <circle cx="15" cy="13" r="2" fill="#060919" stroke="#22d3ee" strokeWidth="0.6" />
              <path d="M15 11.5 Q16 12.5 15 13 Q14 13.5 15 14 Q16 14.5 15 14.5" stroke="#a855f7" strokeWidth="0.8" fill="none" strokeLinecap="round" />
            </g>

            {/* Dizzy mouth (wavy/confused) */}
            <path d="M10 15.5 Q10.8 15 11.5 15.5 Q12.2 16 13 15.5" stroke="#22d3ee" strokeWidth="1" fill="none" strokeLinecap="round" />

            {/* Blush */}
            <ellipse cx="7" cy="14.5" rx="1.2" ry="0.6" fill="#d946ef" fillOpacity="0.6" />
            <ellipse cx="17" cy="14.5" rx="1.2" ry="0.6" fill="#d946ef" fillOpacity="0.6" />

            {/* Stars orbiting around head */}
            <g className="vertigo-star-orbit-anim">
              <path d="M12 6 l.3.7.7.3-.7.3-.3.7-.3-.7-.7-.3.7-.3z" fill="#fbbf24" />
            </g>
            <g className="vertigo-star-orbit-anim" style={{ animationDelay: '0.4s' }}>
              <path d="M12 6 l.2.5.5.2-.5.2-.2.5-.2-.5-.5-.2.5-.2z" fill="#22d3ee" />
            </g>
            <g className="vertigo-star-orbit-anim" style={{ animationDelay: '0.8s' }}>
              <path d="M12 6 l.25.6.6.25-.6.25-.25.6-.25-.6-.6-.25.6-.25z" fill="#d946ef" />
            </g>
          </>
        )}

        {/* Rocket expression (Scroll to top launch) */}
        {expression === 'rocket' && (
          <>
            {/* Determined / Flying eyes */}
            <path d="M7.8 13.2c.3-.4.9-.4 1.2 0" stroke="#22d3ee" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            <path d="M15 13.2c.3-.4.9-.4 1.2 0" stroke="#22d3ee" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            <ellipse cx="7.2" cy="14.5" rx="1" ry="0.5" fill="#d946ef" fillOpacity="0.7" />
            <ellipse cx="16.8" cy="14.5" rx="1" ry="0.5" fill="#d946ef" fillOpacity="0.7" />
            <path d="M11.5 15.2h1" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" />
          </>
        )}

        {/* Dancing / Waving hands expression */}
        {expression === 'dancing' && (
          <>
            <path d="M11.2 14.8c.2.5 1.4.5 1.6 0" fill="#22d3ee" stroke="#22d3ee" strokeWidth="1" strokeLinecap="round" />
            
            {/* Music Notes */}
            <path d="M3 6.5v2.5M3 7.2c-.4 0-.6.2-.6.4s.2.4.6.4c.4 0 .6-.2.6-.4v-2.5z" fill="#d946ef" />
            <path d="M21 5.5v2.5M21 6.2c-.4 0-.6.2-.6.4s.2.4.6.4c.4 0 .6-.2.6-.4v-2.5z" fill="#22d3ee" />
          </>
        )}

        {/* Coffee / Drinking coffee expression */}
        {expression === 'coffee' && (
          <>
            <ellipse cx="9" cy="12.8" rx="1.3" ry="1.6" fill="#22d3ee" className="blink-left-anim" />
            <ellipse cx="15" cy="12.8" rx="1.3" ry="1.6" fill="#22d3ee" className="blink-right-anim" />
            <circle cx="9.4" cy="12.3" r="0.4" fill="#ffffff" className="blink-left-anim" />
            <circle cx="15.4" cy="12.3" r="0.4" fill="#ffffff" className="blink-right-anim" />
            
            <ellipse cx="7.2" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.6" />
            <ellipse cx="16.8" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.6" />
            <path d="M11.2 14.8c.3.2.9.2 1.6 0" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" />

            {/* Coffee cup */}
            <path d="M10.8 15.2h2.4v1.8c0 .5-.4.8-.8.8h-.8c-.4 0-.8-.3-.8-.8z" fill="#d946ef" />
            <path d="M13.2 15.6c.4 0 .6.2.6.4s-.2.4-.6.4" stroke="#d946ef" strokeWidth="0.8" fill="none" />
            {/* Steam rising */}
            <path d="M11.4 14.2c0-.5.4-.5.4-1" stroke="#22d3ee" strokeWidth="0.6" strokeLinecap="round" />
            <path d="M12.6 14.2c0-.5.4-.5.4-1" stroke="#22d3ee" strokeWidth="0.6" strokeLinecap="round" />
          </>
        )}

        {expression === 'blushing' && (
          <>
            <path d="M7.8 13c.3-.4.9-.4 1.2 0" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <path d="M15 13c.3-.4.9-.4 1.2 0" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <ellipse cx="7.2" cy="14.3" rx="1.8" ry="1.2" fill="#f43f5e" fillOpacity="0.95" />
            <ellipse cx="16.8" cy="14.3" rx="1.8" ry="1.2" fill="#f43f5e" fillOpacity="0.95" />
            <path d="M11 14.8c.2.5 1.8.5 2 0" fill="#22d3ee" stroke="#22d3ee" strokeWidth="1" strokeLinecap="round" />
          </>
        )}

        {expression === 'shy' && (
          <>
            <path d="M7.8 13.5c0-.4.4-.7.8-.7s.8.3.8.7" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M14.8 13.5c0-.4.4-.7.8-.7s.8.3.8.7" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <ellipse cx="7.2" cy="14.5" rx="1.4" ry="0.9" fill="#d946ef" fillOpacity="0.85" />
            <ellipse cx="16.8" cy="14.5" rx="1.4" ry="0.9" fill="#d946ef" fillOpacity="0.85" />
            <path d="M10.8 15.5c.3-.2.8.2 1.1 0" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </>
        )}

        {expression === 'thief' && (
          <g>
            {/* Black Knit Beanie Hat on top of head */}
            <path d="M 4.5 9 C 4.5 5.5, 19.5 5.5, 19.5 9 Z" fill="#090d16" stroke="#1e293b" strokeWidth="0.8" />
            <rect x="4.2" y="8" width="15.6" height="1.8" rx="0.5" fill="#1e293b" stroke="#334155" strokeWidth="0.5" />
            
            {/* Sneaky eyes looking sideways */}
            <ellipse cx="9" cy="13" rx="1.3" ry="1.5" fill="#0f172a" stroke="#22d3ee" strokeWidth="0.6" />
            <ellipse cx="15" cy="13" rx="1.3" ry="1.5" fill="#0f172a" stroke="#22d3ee" strokeWidth="0.6" />
            <circle cx="10.2" cy="13" r="0.6" fill="#22d3ee" />
            <circle cx="16.2" cy="13" r="0.6" fill="#22d3ee" />
            <circle cx="10.4" cy="12.7" r="0.2" fill="#ffffff" />
            <circle cx="16.4" cy="12.7" r="0.2" fill="#ffffff" />

            {/* Black Bandit Eye Mask */}
            <path d="M 5 11 C 5 11, 12 11.5, 19 11 L 19 14.5 C 19 14.5, 12 15, 5 14.5 Z" fill="#090d16" fillOpacity="0.95" stroke="#1e293b" strokeWidth="0.5" />
            
            {/* Mask cutouts for eyes */}
            <ellipse cx="9" cy="13" rx="1.8" ry="1.2" fill="#0f172a" />
            <ellipse cx="15" cy="13" rx="1.8" ry="1.2" fill="#0f172a" />
            <circle cx="10.2" cy="13" r="0.6" fill="#22d3ee" />
            <circle cx="16.2" cy="13" r="0.6" fill="#22d3ee" />

            {/* Sneaky smirk */}
            <path d="M 10.5 16 Z M 10.5 15.8 Q 12 16.5 13.5 15.5" stroke="#22d3ee" strokeWidth="1.1" strokeLinecap="round" fill="none" />
            
            {/* Thief Loot Bag/Sack on the bottom-left side */}
            <g className="animate-pulse">
              <path d="M 3.5 17 C 2 17, 1 18.5, 1.5 20.5 C 2 22.5, 5 22.5, 5.5 20.5 C 6 18.5, 5 17, 3.5 17 Z" fill="#090d16" stroke="#1e293b" strokeWidth="0.6" />
              <path d="M 3.5 17 L 2.8 15.8 M 3.5 17 L 4.2 15.8" stroke="#1e293b" strokeWidth="0.8" strokeLinecap="round" />
              {/* Dollar sign on the bag */}
              <text x="3.5" y="20.5" fill="#facc15" fontSize="3" fontWeight="bold" textAnchor="middle" style={{ fontStyle: 'normal', fontFamily: 'Arial, sans-serif' }}>$</text>
            </g>
          </g>
        )}


        {expression === 'hurt' && (
          <>
            <path d="M7.5 12l2 2M9.5 12l-2 2" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M14.5 12l2 2M16.5 12l-2 2" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M10.5 15.5c1 .5 2 .5 3 0" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M11 6.8c0-1.8 2-1.8 2 0z" fill="#facc15" stroke="#eab308" strokeWidth="1" />
            <g className="animate-spin" style={{ transformOrigin: '12px 6px', animationDuration: '2s' }}>
              <circle cx="9" cy="5" r="0.4" fill="#facc15" />
              <circle cx="15" cy="5" r="0.4" fill="#facc15" />
            </g>
          </>
        )}

        {expression === 'annoyed' && (
          <>
            <path d="M7 11.2l2 .5" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M17 11.2l-2 .5" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" />
            <ellipse cx="9" cy="12.8" rx="1.1" ry="1.4" fill="#22d3ee" />
            <ellipse cx="15" cy="12.8" rx="1.1" ry="1.4" fill="#22d3ee" />
            <ellipse cx="7.2" cy="14.3" rx="1.3" ry="0.8" fill="#ef4444" fillOpacity="0.85" />
            <ellipse cx="16.8" cy="14.3" rx="1.3" ry="0.8" fill="#ef4444" fillOpacity="0.85" />
            <line x1="10.5" y1="15" x2="13.5" y2="15" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" />
          </>
        )}
        {expression === 'groggy' && (
          <>
            <path d="M7.5 13c.5-.3 1.5-.3 2 0" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <path d="M14.5 13c.5-.3 1.5-.3 2 0" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <ellipse cx="7.2" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.5" />
            <ellipse cx="16.8" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.5" />
            <path d="M10.8 15c.3-.1.8.1 1.1 0" stroke="#22d3ee" strokeWidth="1" strokeLinecap="round" fill="none" />
          </>
        )}

        {expression === 'reading_news' && (
          <>
            <ellipse cx="9" cy="13.4" rx="1.3" ry="0.8" fill="#22d3ee" className="blink-left-anim" />
            <ellipse cx="15" cy="13.4" rx="1.3" ry="0.8" fill="#22d3ee" className="blink-right-anim" />
            <ellipse cx="7.2" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.6" />
            <ellipse cx="16.8" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.6" />
            <path d="M11.2 14.8c.3.2.9.2 1.6 0" stroke="#22d3ee" strokeWidth="1" strokeLinecap="round" />
            <rect x="8.5" y="15.2" width="7" height="4.5" rx="0.5" fill="#f8fafc" stroke="#64748b" strokeWidth="0.6" />
            <line x1="9.5" y1="16.5" x2="14.5" y2="16.5" stroke="#94a3b8" strokeWidth="0.5" />
            <line x1="9.5" y1="18" x2="12.5" y2="18" stroke="#94a3b8" strokeWidth="0.5" />
          </>
        )}

        {/* Searching expression (Kính lúp soi hướng lên góc trên bên trái) */}
        {expression === 'searching' && (
          <g>
            {/* Eyes looking up-left */}
            <circle cx="8" cy="11.5" r="1.5" fill="#22d3ee" />
            <circle cx="14" cy="11.5" r="1.5" fill="#22d3ee" />
            
            {/* Pupils */}
            <circle cx="7.5" cy="11" r="0.5" fill="#ffffff" />
            <circle cx="13.5" cy="11" r="0.5" fill="#ffffff" />

            {/* Magnifying Glass pointing up-left */}
            <g className="animate-pulse">
              {/* Glass Lens */}
              <circle cx="8" cy="11.5" r="3.2" fill="#22d3ee" fillOpacity="0.1" />
              {/* Silver Frame */}
              <circle cx="8" cy="11.5" r="3.2" stroke="#94a3b8" strokeWidth="1" fill="none" />
              <circle cx="8" cy="11.5" r="2.7" stroke="#cbd5e1" strokeWidth="0.5" fill="none" />
              {/* Lens highlight */}
              <path d="M 5.5 10 A 2.5 2.5 0 0 1 9.5 8" stroke="#ffffff" strokeWidth="0.6" strokeLinecap="round" fill="none" />
              
              {/* Wooden Handle (pointing down-right) */}
              <path d="M 10 13.5 L 13.5 17" stroke="#78350f" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M 10 13.5 L 13.5 17" stroke="#92400e" strokeWidth="0.8" strokeLinecap="round" />
              
              {/* Hand holding the magnifying glass */}
              <circle cx="11.5" cy="15" r="1.4" fill="url(#cosmicAIGrad)" stroke="#060919" strokeWidth="0.5" />
            </g>

            {/* Blush */}
            <ellipse cx="5.5" cy="13.5" rx="1.2" ry="0.6" fill="#d946ef" fillOpacity="0.5" />
            <ellipse cx="16.5" cy="13.5" rx="1.2" ry="0.6" fill="#d946ef" fillOpacity="0.5" />

            {/* Mouth: small cute shape */}
            <ellipse cx="11" cy="15" rx="0.8" ry="0.5" fill="none" stroke="#22d3ee" strokeWidth="0.8" />
          </g>
        )}

        {expression === 'pondering' && (
          <>
            {/* Eyes looking up/closed (suy tư) */}
            <path d="M7 12.5c.3-.6 1.1-.6 1.4 0" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M15.6 12.5c.3-.6 1.1-.6 1.4 0" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            
            {/* Blush */}
            <ellipse cx="7.2" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.6" />
            <ellipse cx="16.8" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.6" />
            
            {/* Small mouth */}
            <path d="M11 15c.2-.2.8-.2 1 0" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            
            {/* Loading / Pondering dots animating above head */}
            <g className="animate-pulse" style={{ animationDuration: '1.5s' }}>
              <circle cx="9" cy="5" r="0.8" fill="#eab308" />
              <circle cx="12" cy="4.5" r="0.8" fill="#eab308" style={{ animationDelay: '0.2s' }} />
              <circle cx="15" cy="5" r="0.8" fill="#eab308" style={{ animationDelay: '0.4s' }} />
            </g>
          </>
        )}

        {expression === 'wizard' && (
          <>
            {/* Happy Eyes */}
            <ellipse cx="9" cy="12.5" rx="1.2" ry="1.4" fill="#22d3ee" className="blink-left-anim" />
            <ellipse cx="15" cy="12.5" rx="1.2" ry="1.4" fill="#22d3ee" className="blink-right-anim" />
            
            {/* Smile */}
            <path d="M10 15 Q 12 16.8 14 15" stroke="#22d3ee" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            
            {/* Blush */}
            <ellipse cx="7.2" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.6" />
            <ellipse cx="16.8" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.6" />
            
            {/* Holding Crystal Ball (Quả cầu pha lê) */}
            <g transform="translate(13.5, 13.5)">
              {/* Stand */}
              <path d="M0.5 4 L2.5 4 L2 5 L1 5 Z" fill="#64748b" />
              {/* Ball */}
              <circle cx="1.5" cy="2.5" r="1.8" fill="#a5f3fc" stroke="#22d3ee" strokeWidth="0.5" fillOpacity="0.8" />
              {/* Sparkle inside ball */}
              <circle cx="1" cy="2" r="0.4" fill="#ffffff" />
              {/* Hand holding it */}
              <circle cx="-0.2" cy="3.2" r="1" fill="#22d3ee" />
            </g>

            {/* Floating Tarot Card (bài tarot bay) */}
            <g className="card-float-anim" style={{ transformOrigin: '3px 6px' }}>
              <g transform="translate(1, 4) rotate(-15)">
                <rect x="0" y="0" width="3" height="4.5" rx="0.3" fill="#f8fafc" stroke="#a855f7" strokeWidth="0.4" />
                <circle cx="1.5" cy="2.25" r="1" fill="#eab308" />
                <circle cx="1.9" cy="1.8" r="0.8" fill="#f8fafc" />
              </g>
            </g>

            {/* Floating Love Hearts (trái tim tình yêu) */}
            <g className="heart-float-anim" style={{ transformOrigin: '20px 5px' }}>
              <path d="M20 5 C19.5 4 18.5 4 18.5 5 C18.5 6.2 20 7.2 20 7.2 C20 7.2 21.5 6.2 21.5 5 C21.5 4 20.5 4 20 5 Z" fill="#f43f5e" />
            </g>
            <g className="heart-float-anim" style={{ transformOrigin: '4px 3px', animationDelay: '0.5s' }}>
              <path d="M4 3 C3.7 2.5 3.2 2.5 3.2 3 C3.2 3.6 4 4.1 4 4.1 C4 4.1 4.8 3.6 4.8 3 C4.8 2.5 4.3 2.5 4 3 Z" fill="#d946ef" fillOpacity="0.8" />
            </g>
          </>
        )}

        {expression === 'crown' && (
          <>
            {/* Golden Crown (Mũ vương miện hoàng gia vũ trụ) */}
            <path d="M7 8 L6 4 L9 6 L12 3 L15 6 L18 4 L17 8 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" strokeLinejoin="round" />
            {/* Jewels on the crown */}
            <circle cx="12" cy="3" r="0.6" fill="#ef4444" />
            <circle cx="6" cy="4" r="0.4" fill="#3b82f6" />
            <circle cx="18" cy="4" r="0.4" fill="#3b82f6" />
            
            {/* Happy eyes */}
            <path d="M7 12.5c.3-.6 1.1-.6 1.4 0" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M15.6 12.5c.3-.6 1.1-.6 1.4 0" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            
            {/* Cute smile */}
            <path d="M10 15 Q 12 16.8 14 15" stroke="#22d3ee" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            
            {/* Blush */}
            <ellipse cx="7.2" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.6" />
            <ellipse cx="16.8" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.6" />
            
            {/* Magical sparkles */}
            <g className="animate-pulse" fill="#fbbf24">
              <circle cx="4" cy="5" r="0.5" />
              <circle cx="20" cy="5" r="0.5" />
              <circle cx="12" cy="1.5" r="0.4" />
            </g>
          </>
        )}

        {expression === 'witch' && (
          <>
            {/* Witch Hat */}
            {/* Cone with a bend */}
            <path d="M6 7.5 Q 10 3 14 -1 Q 12 4 18 7.5 Z" fill="#581c87" />
            {/* Brim */}
            <ellipse cx="12" cy="7.5" rx="8" ry="1.5" fill="#3b0764" />
            
            {/* Calm/Magical Eyes */}
            <path d="M7 12.5c.3-.6 1.1-.6 1.4 0" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M15.6 12.5c.3-.6 1.1-.6 1.4 0" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            
            {/* Tiny mysterious smile */}
            <path d="M11 15c.2.2.8.2 1 0" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            
            {/* Holding Tarot Card (hand on the side) */}
            <g transform="translate(13, 13) rotate(15)">
              {/* Card Base */}
              <rect x="0" y="0" width="3.5" height="5.5" rx="0.4" fill="#f8fafc" stroke="#64748b" strokeWidth="0.4" />
              {/* Card back design (Moon/Star) */}
              <circle cx="1.75" cy="2.75" r="1.2" fill="#eab308" />
              <circle cx="2.2" cy="2.2" r="1" fill="#f8fafc" /> {/* Moon crescent effect */}
              {/* Magic hand */}
              <circle cx="-0.5" cy="3" r="1.2" fill="#22d3ee" />
            </g>
          </>
        )}

        {expression === 'lawyer' && (
          <>
            {/* Judge Wig (Tóc thẩm phán) */}
            <g fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.8">
              <ellipse cx="12" cy="7.5" rx="6" ry="2.5" />
              <circle cx="4.5" cy="9.5" r="1.6" />
              <circle cx="4.5" cy="11.5" r="1.6" />
              <circle cx="4.5" cy="13.5" r="1.6" />
              <circle cx="4.5" cy="15.5" r="1.6" />
              <circle cx="19.5" cy="9.5" r="1.6" />
              <circle cx="19.5" cy="11.5" r="1.6" />
              <circle cx="19.5" cy="13.5" r="1.6" />
              <circle cx="19.5" cy="15.5" r="1.6" />
            </g>

            {/* Eyes */}
            <ellipse cx="9" cy="12.6" rx="0.8" ry="1.2" fill="#22d3ee" className="blink-left-anim" />
            <ellipse cx="15" cy="12.6" rx="0.8" ry="1.2" fill="#22d3ee" className="blink-right-anim" />
            
            {/* Serious mouth */}
            <line x1="10.5" y1="15.2" x2="13.5" y2="15.2" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" />
            
            {/* Wooden Gavel (Búa thẩm phán) */}
            <g transform="translate(13.5, 14.5) rotate(35)">
              <rect x="0" y="0" width="1.2" height="3.5" fill="#92400e" rx="0.4" />
              <rect x="-1" y="-0.5" width="3.2" height="1.5" rx="0.3" fill="#78350f" />
            </g>
          </>
        )}

        {expression === 'security' && (
          <g>
            {/* Vietnamese Police Cap (Nón công an) on top of head */}
            <path d="M 4.5 8 C 3 4.5, 21 4.5, 19.5 8 Z" fill="#14532d" stroke="#166534" strokeWidth="0.4" />
            <path d="M 4.8 7.6 Q 12 8.6 19.2 7.6 L 19.4 8.2 Q 12 9.2 4.6 8.2 Z" fill="#dc2626" />
            <circle cx="12" cy="7.8" r="0.9" fill="#eab308" stroke="#ca8a04" strokeWidth="0.2" />
            <polygon points="12,7.3 12.2,7.7 12.6,7.7 12.3,7.9 12.4,8.3 12,8.1 11.6,8.3 11.7,7.9 11.4,7.7 11.8,7.7" fill="#dc2626" />
            <ellipse cx="12" cy="8.2" rx="7.2" ry="0.6" fill="#0f172a" stroke="#1e293b" strokeWidth="0.4" />

            {/* Dark Sunglasses (Bảo mật / Đặc vụ) */}
            <path d="M6.5 11.5 Q 9 11.5 9.5 13.5 L 6.5 13.5 Z" fill="#020617" stroke="#38bdf8" strokeWidth="0.8" />
            <path d="M17.5 11.5 Q 15 11.5 14.5 13.5 L 17.5 13.5 Z" fill="#020617" stroke="#38bdf8" strokeWidth="0.8" />
            <line x1="9.5" y1="12" x2="14.5" y2="12" stroke="#38bdf8" strokeWidth="1.2" />
            
            {/* Serious/Cool mouth */}
            <line x1="11" y1="15.2" x2="13" y2="15.2" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" />
            
            {/* Little Shield on chest */}
            <path d="M11.2 16.5 L12.8 16.5 L12.8 17.2 Q 12 18.2 11.2 17.2 Z" fill="#eab308" />
          </g>
        )}

        {expression === 'presenter' && (
          <>
            {/* Floating enthusiasm sparkles */}
            <g className="animate-pulse" fill="#fef08a">
              <path d="M5 6 L5.5 7 L6.5 7.5 L5.5 8 L5 9 L4.5 8 L3.5 7.5 L4.5 7 Z" />
              <path d="M18 5 L18.5 6 L19.5 6.5 L18.5 7 L18 8 L17.5 7 L16.5 6.5 L17.5 6 Z" />
              <path d="M14 3 L14.3 3.8 L15 4 L14.3 4.2 L14 5 L13.7 4.2 L13 4 L13.7 3.8 Z" />
            </g>
            
            {/* Starry anime eyes */}
            <path d="M9 11.5 L9.5 12.5 L10.5 13 L9.5 13.5 L9 14.5 L8.5 13.5 L7.5 13 L8.5 12.5 Z" fill="#fef08a" className="blink-left-anim" />
            <path d="M15 11.5 L15.5 12.5 L16.5 13 L15.5 13.5 L15 14.5 L14.5 13.5 L13.5 13 L14.5 12.5 Z" fill="#fef08a" className="blink-right-anim" />
            
            {/* Blush */}
            <ellipse cx="7.2" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.6" />
            <ellipse cx="16.8" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.6" />
            
            {/* Bright open smile */}
            <path d="M10.5 15.5 Q12 17.5 13.5 15.5 Z" fill="#f43f5e" />
          </>
        )}

        {expression === 'singing' && (
          <>
            <ellipse cx="9" cy="12.5" rx="1.2" ry="1.4" fill="#22d3ee" />
            <ellipse cx="15" cy="12.5" rx="1.2" ry="1.4" fill="#22d3ee" />
            <ellipse cx="7.2" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.6" />
            <ellipse cx="16.8" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.6" />
            <circle cx="12" cy="15.2" r="1.2" fill="#ef4444" stroke="#22d3ee" strokeWidth="0.8" />
            <g className="animate-bounce" style={{ transformOrigin: '12px 12px' }}>
              <path d="M18 4.5v2.5M18 5.2c-.4 0-.6.2-.6.4s.2.4.6.4c.4 0 .6-.2.6-.4v-2.5z" fill="#d946ef" />
              <path d="M5 5.5v2.5M5 6.2c-.4 0-.6.2-.6.4s.2.4.6.4c.4 0 .6-.2.6-.4v-2.5z" fill="#22d3ee" />
            </g>
          </>
        )}
        {expression === 'party' && (
          <>
            <ellipse cx="9" cy="12.8" rx="1.4" ry="1.4" fill="#22d3ee" className="blink-left-anim" />
            <ellipse cx="15" cy="12.8" rx="1.4" ry="1.4" fill="#22d3ee" className="blink-right-anim" />
            <ellipse cx="7.2" cy="14.3" rx="1.3" ry="0.8" fill="#f43f5e" fillOpacity="0.85" />
            <ellipse cx="16.8" cy="14.3" rx="1.3" ry="0.8" fill="#f43f5e" fillOpacity="0.85" />
            <path d="M10 14.5c.5 1.5 3.5 1.5 4 0" fill="#f43f5e" stroke="#22d3ee" strokeWidth="0.8" />
            <g className="animate-bounce" style={{ transformOrigin: '12px 12px' }}>
              <path d="M12 1.5l-2.5 6.5h5z" fill="#ec4899" />
              <circle cx="12" cy="1.5" r="1.2" fill="#fcd34d" />
              <path d="M10.5 8l1.5-6.5 1.5 6.5" fill="none" stroke="#22d3ee" strokeWidth="0.5" opacity="0.5" />
            </g>
          </>
        )}


        {expression === 'phone' && (
          <>
            <ellipse cx="9" cy="12.8" rx="1.3" ry="1.6" fill="#22d3ee" className="blink-left-anim" />
            <ellipse cx="15" cy="12.8" rx="1.3" ry="1.6" fill="#22d3ee" className="blink-right-anim" />
            <ellipse cx="7.2" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.6" />
            <ellipse cx="16.8" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.6" />
            <path d="M11.2 14.8c.3.4.9.4 1.6 0" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" />
            <g className="animate-pulse" style={{ transform: 'rotate(5deg)' }}>
              <rect x="15" y="13" width="3.5" height="5.5" rx="0.5" fill="#1e293b" stroke="#22d3ee" strokeWidth="0.6" />
              <rect x="15.5" y="13.5" width="2.5" height="4.5" fill="#22d3ee" fillOpacity="0.8" />
            </g>
          </>
        )}

        {expression === 'guitar' && (
          <>
            <ellipse cx="9" cy="12.8" rx="1.3" ry="1.6" fill="#22d3ee" className="blink-left-anim" />
            <ellipse cx="15" cy="12.8" rx="1.3" ry="1.6" fill="#22d3ee" className="blink-right-anim" />
            <ellipse cx="7.2" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.6" />
            <ellipse cx="16.8" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.6" />
            <path d="M11.2 14.8c.3.4.9.4 1.6 0" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" />
            <g style={{ transform: 'rotate(-20deg)', transformOrigin: '12px 16px' }}>
              <rect x="5" y="15.2" width="8" height="0.8" fill="#eab308" />
              <ellipse cx="13.5" cy="15.6" rx="2" ry="1.3" fill="#ea580c" />
              <circle cx="13" cy="15.6" r="0.4" fill="#000" />
            </g>
          </>
        )}
        {expression === 'love' && (
          <>
            <path d="M7 11.5c.2-.5.8-.8 1.3-.5l.7.5.7-.5c.5-.3 1.1 0 1.3.5.2.5-.2 1.2-1.3 2l-.7.5-.7-.5c-1.1-.8-1.5-1.5-1.3-2z" fill="#f43f5e" />
            <path d="M13 11.5c.2-.5.8-.8 1.3-.5l.7.5.7-.5c.5-.3 1.1 0 1.3.5.2.5-.2 1.2-1.3 2l-.7.5-.7-.5c-1.1-.8-1.5-1.5-1.3-2z" fill="#f43f5e" />
            <ellipse cx="7.2" cy="14.5" rx="1.5" ry="0.9" fill="#f43f5e" fillOpacity="0.8" />
            <ellipse cx="16.8" cy="14.5" rx="1.5" ry="0.9" fill="#f43f5e" fillOpacity="0.8" />
            <path d="M10.8 14.8c.3.5.9.5 1.4 0" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <g className="card-float-anim">
              <path d="M2.5 4.5c.1-.3.4-.4.6-.2l.4.3.4-.3c.2-.2.5-.1.6.2c.1.3-.1.6-.6 1l-.4.3-.4-.3c-.5-.4-.7-.7-.6-1z" fill="#f43f5e" />
              <path d="M21.5 5.5c.1-.3.4-.4.6-.2l.4.3.4-.3c.2-.2.5-.1.6.2c.1.3-.1.6-.6 1l-.4.3-.4-.3c-.5-.4-.7-.7-.6-1z" fill="#f43f5e" />
            </g>
          </>
        )}
        {expression === 'tarot_love' && (
          <>
            <ellipse cx="9" cy="12.8" rx="1.3" ry="1.6" fill="#22d3ee" className="blink-left-anim" />
            <ellipse cx="15" cy="12.8" rx="1.3" ry="1.6" fill="#22d3ee" className="blink-right-anim" />
            <ellipse cx="7.2" cy="14.3" rx="1.1" ry="0.6" fill="#f43f5e" fillOpacity="0.75" />
            <ellipse cx="16.8" cy="14.3" rx="1.1" ry="0.6" fill="#f43f5e" fillOpacity="0.75" />
            <path d="M11.2 14.8c.3.4.9.4 1.6 0" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" />
            <g className="card-float-anim">
              <rect x="17.2" y="2" width="4.5" height="7" rx="0.5" fill="#060919" stroke="#f43f5e" strokeWidth="0.8" />
              <path d="M19.5 4.5c-.2-.2-.5 0-.5 0s-.3-.2-.5 0c-.2.2-.2.5 0 .7l.5.5.5-.5c.2-.2.2-.5 0-.7z" fill="#f43f5e" />
            </g>
          </>
        )}

        {expression === 'tarot_career' && (
          <>
            <ellipse cx="9" cy="12.8" rx="1.3" ry="1.6" fill="#22d3ee" className="blink-left-anim" />
            <ellipse cx="15" cy="12.8" rx="1.3" ry="1.6" fill="#22d3ee" className="blink-right-anim" />
            <ellipse cx="7.2" cy="14.3" rx="1.1" ry="0.6" fill="#0ea5e9" fillOpacity="0.6" />
            <ellipse cx="16.8" cy="14.3" rx="1.1" ry="0.6" fill="#0ea5e9" fillOpacity="0.6" />
            <path d="M11.2 14.8c.3.4.9.4 1.6 0" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" />
            <g className="card-float-anim">
              <rect x="17.2" y="2" width="4.5" height="7" rx="0.5" fill="#060919" stroke="#0ea5e9" strokeWidth="0.8" />
              <circle cx="19.5" cy="5.5" r="1" fill="#eab308" />
            </g>
          </>
        )}

        {expression === 'tarot_finance' && (
          <>
            <ellipse cx="9" cy="12.8" rx="1.3" ry="1.6" fill="#22d3ee" className="blink-left-anim" />
            <ellipse cx="15" cy="12.8" rx="1.3" ry="1.6" fill="#22d3ee" className="blink-right-anim" />
            <ellipse cx="7.2" cy="14.3" rx="1.1" ry="0.6" fill="#22c55e" fillOpacity="0.6" />
            <ellipse cx="16.8" cy="14.3" rx="1.1" ry="0.6" fill="#22c55e" fillOpacity="0.6" />
            <path d="M11.2 14.8c.3.4.9.4 1.6 0" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" />
            <g className="card-float-anim">
              <rect x="17.2" y="2" width="4.5" height="7" rx="0.5" fill="#060919" stroke="#22c55e" strokeWidth="0.8" />
              <circle cx="19.5" cy="5.5" r="0.8" fill="#eab308" />
            </g>
          </>
        )}

        {expression === 'tarot_daily' && (
          <>
            <ellipse cx="9" cy="12.8" rx="1.3" ry="1.6" fill="#22d3ee" className="blink-left-anim" />
            <ellipse cx="15" cy="12.8" rx="1.3" ry="1.6" fill="#22d3ee" className="blink-right-anim" />
            <ellipse cx="7.2" cy="14.3" rx="1.1" ry="0.6" fill="#eab308" fillOpacity="0.6" />
            <ellipse cx="16.8" cy="14.3" rx="1.1" ry="0.6" fill="#eab308" fillOpacity="0.6" />
            <path d="M11.2 14.8c.3.4.9.4 1.6 0" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" />
            <g className="card-float-anim">
              <rect x="17.2" y="2" width="4.5" height="7" rx="0.5" fill="#060919" stroke="#eab308" strokeWidth="0.8" />
              <circle cx="19.5" cy="5.5" r="0.6" fill="#eab308" />
              <line x1="19.5" y1="4.3" x2="19.5" y2="4.7" stroke="#eab308" strokeWidth="0.4" />
              <line x1="19.5" y1="6.3" x2="19.5" y2="6.7" stroke="#eab308" strokeWidth="0.4" />
              <line x1="18.3" y1="5.5" x2="18.7" y2="5.5" stroke="#eab308" strokeWidth="0.4" />
              <line x1="20.3" y1="5.5" x2="20.7" y2="5.5" stroke="#eab308" strokeWidth="0.4" />
            </g>
          </>
        )}

        {expression === 'tarot_shuffling' && (
          <>
            <ellipse cx="9" cy="12.8" rx="1.3" ry="1.6" fill="#22d3ee" opacity="0.6" />
            <ellipse cx="15" cy="12.8" rx="1.3" ry="1.6" fill="#22d3ee" opacity="0.6" />
            <circle cx="12" cy="14.8" r="0.6" fill="#22d3ee" />
            
            {/* Shuffling Cards Orbit */}
            <g className="animate-spin" style={{ transformOrigin: '12px 12.5px', animationDuration: '2s' }}>
              <g transform="translate(12, 1) rotate(15)">
                <rect x="-1.5" y="-2.5" width="3" height="5" rx="0.3" fill="#060919" stroke="#22d3ee" strokeWidth="0.6" />
              </g>
              <g transform="translate(22, 12) rotate(45)">
                <rect x="-1.5" y="-2.5" width="3" height="5" rx="0.3" fill="#060919" stroke="#d946ef" strokeWidth="0.6" />
              </g>
              <g transform="translate(2, 12) rotate(-45)">
                <rect x="-1.5" y="-2.5" width="3" height="5" rx="0.3" fill="#060919" stroke="#eab308" strokeWidth="0.6" />
              </g>
            </g>
          </>
        )}

        {expression === 'idle' && (
          <>
            <ellipse cx="9" cy="12.8" rx="1.3" ry="1.6" fill="#22d3ee" className="blink-left-anim" />
            <ellipse cx="15" cy="12.8" rx="1.3" ry="1.6" fill="#22d3ee" className="blink-right-anim" />
            <circle cx="9.4" cy="12.3" r="0.4" fill="#ffffff" className="blink-left-anim" />
            <circle cx="15.4" cy="12.3" r="0.4" fill="#ffffff" className="blink-right-anim" />
            <ellipse cx="7.2" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.6" />
            <ellipse cx="16.8" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.6" />
            <path d="M11.2 14.8c.3.4.9.4 1.6 0" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" />
          </>
        )}

        {expression === 'numerology' && (
          <>
            {/* Happy/wink excited eyes looking at the number */}
            <path d="M7.8 13c.3-.4.9-.4 1.2 0" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <path d="M15 13c.3-.4.9-.4 1.2 0" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <ellipse cx="7.2" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.6" />
            <ellipse cx="16.8" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.6" />
            <path d="M11.2 14.8c.3.4.9.4 1.6 0" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" />
            
            {/* Glowing Orb containing the Numerology Number */}
            <g className="number-play-anim" style={{ transformOrigin: '19px 12px' }}>
              <circle cx="19" cy="12" r="3.2" fill="#060919" stroke="url(#cosmicAIGrad)" strokeWidth="0.8" />
              <circle cx="19" cy="12" r="3.2" fill="url(#innerFaceGlow)" opacity="0.85" />
              <text x="19" y="13.2" fill="#22d3ee" fontSize="4.2" fontWeight="black" textAnchor="middle" style={{ fontStyle: 'normal' }}>
                {numerologyNumber || '8'}
              </text>
            </g>
            
            {/* Magic sparkles around the orb */}
            <path d="M19 6.5l.2.4.4.2-.4.2-.2.4-.2-.4-.4-.2.4-.2z" fill="#d946ef" opacity="0.8" />
            <path d="M22.5 15.5l.2.4.4.2-.4.2-.2.4-.2-.4-.4-.2.4-.2z" fill="#22d3ee" opacity="0.8" />
          </>
        )}

        {/* Zodiac additions inside the head group so they move with the head */}
        {zodiac === 'aries' && (
          <g>
            <path d="M5.5 10c-2.5-1-4.5-.5-5 1.5s1.5 3 3 2.5c1.5-.5 2-2 2-4" stroke="url(#cosmicAIGrad)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M18.5 10c2.5-1 4.5-.5 5 1.5s-1.5 3-3 2.5c-1.5-.5-2-2-2-4" stroke="url(#cosmicAIGrad)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M4 17.5c2 1 4 .5 6 1s4-1 6-.5c2-.5 4-1 4-1" stroke="url(#cosmicAIGrad)" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.8" />
          </g>
        )}
        {zodiac === 'taurus' && (
          <g>
            <path d="M6.5 8.5c-1.2-2.5-3-2.5-3.5-.5s1 2.5 3 1" stroke="url(#cosmicAIGrad)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M17.5 8.5c1.2-2.5 3-2.5 3.5-.5s-1 2.5-3 1" stroke="url(#cosmicAIGrad)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <circle cx="12" cy="15.8" r="1.2" stroke="#facc15" strokeWidth="0.8" fill="none" />
          </g>
        )}
        {zodiac === 'gemini' && (
          <g className="heart-float-anim" style={{ transformOrigin: '19px 12px' }}>
            <rect x="18.5" y="7" width="5" height="4" rx="1.5" fill="#060919" stroke="#d946ef" strokeWidth="0.6" />
            <circle cx="20" cy="8.5" r="0.4" fill="#d946ef" />
            <circle cx="22" cy="8.5" r="0.4" fill="#d946ef" />
            <path d="M20.5 9.8c.2.2.8.2 1 0" stroke="#d946ef" strokeWidth="0.4" strokeLinecap="round" />
          </g>
        )}
        {zodiac === 'cancer' && (
          <g>
            <circle cx="12" cy="12.5" r="9" stroke="#22d3ee" strokeWidth="0.5" strokeDasharray="3 2" opacity="0.4" className="animate-spin" style={{ animationDuration: '8s', transformOrigin: '12px 12.5px' }} />
            <path d="M4 14c-1.5.5-2-1-1.5-2s1.5-1.2 2 0c.3.8-.2 1.5-.5 2" fill="url(#cosmicAIGrad)" />
            <path d="M20 14c1.5.5 2-1 1.5-2s-1.5-1.2-2 0c-.3.8.2 1.5.5 2" fill="url(#cosmicAIGrad)" />
          </g>
        )}
        {zodiac === 'virgo' && (
          <g>
            <path d="M7 8c2-2.5 8-2.5 10 0" stroke="#10b981" strokeWidth="0.8" fill="none" />
            <circle cx="9" cy="6.5" r="0.8" fill="#d946ef" />
            <circle cx="12" cy="5.5" r="1" fill="#facc15" />
            <circle cx="15" cy="6.5" r="0.8" fill="#22d3ee" />
            <path d="M3 7l.2.4.4.2-.4.2-.2.4-.2-.4-.4-.2.4-.2z" fill="#facc15" />
            <path d="M21 7l.2.4.4.2-.4.2-.2.4-.2-.4-.4-.2.4-.2z" fill="#facc15" />
          </g>
        )}
        {zodiac === 'libra' && (
          <g>
            <path d="M3.5 13H1.5M2.5 13v3" stroke="url(#cosmicAIGrad)" strokeWidth="0.8" />
            <path d="M1 16h3l-1.5 1.5z" fill="#22d3ee" />
            <path d="M20.5 13h-2M19.5 13v3" stroke="url(#cosmicAIGrad)" strokeWidth="0.8" />
            <path d="M18 16h3l-1.5 1.5z" fill="#22d3ee" />
          </g>
        )}
        {zodiac === 'scorpio' && (
          <g>
            <path d="M19 16c2 1 3.5 0 3-2s-1.5-2.5-3-1.5l-1 1" stroke="url(#cosmicAIGrad)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M18.5 13.5l-.8-1.5l1.5.5z" fill="#ef4444" />
          </g>
        )}
        {zodiac === 'sagittarius' && (
          <g>
            <g transform="rotate(-15 6 16)">
              <path d="M4 14c-1.5 1-1.5 3 0 4" stroke="#eab308" strokeWidth="0.8" fill="none" />
              <line x1="2.5" y1="16" x2="6" y2="16" stroke="#22d3ee" strokeWidth="0.8" />
              <path d="M6 16l-1-.5v1z" fill="#22d3ee" />
            </g>
            <path d="M7 8c-1-2-1-4 1-5c0 2 0 4-1 5z" fill="#ec4899" />
          </g>
        )}
        {zodiac === 'capricorn' && (
          <g>
            <path d="M8 8c-1-3-3-3-4-2c1 1.5 2 2.5 4 2" stroke="url(#cosmicAIGrad)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M16 8c1-3 3-3 4-2c-1 1.5-2 2.5-4 2" stroke="url(#cosmicAIGrad)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M5 16.5c-1.5 1-3 1-3.5 2.5s.5 2.5 1.5 2" stroke="url(#cosmicAIGrad)" strokeWidth="1.2" fill="none" />
          </g>
        )}
        {zodiac === 'aquarius' && (
          <g>
            <path d="M2.5 10c-.5-1-1.5-1-2 0s.5 2 2 1.5z" fill="#060919" stroke="#22d3ee" strokeWidth="0.8" />
            <path d="M1 11.5c-.8 1.5.5 3 0 4" stroke="#22d3ee" strokeWidth="0.6" strokeLinecap="round" strokeDasharray="1 1" />
          </g>
        )}
        {zodiac === 'pisces' && (
          <g className="heart-float-anim" style={{ transformOrigin: '12px 12px' }}>
            <path d="M2 9.5c1 .5 1-.5 2 0c-1 .5-1-.5-2 0" fill="#22d3ee" />
            <path d="M20 15c1 .5 1-.5 2 0c-1 .5-1-.5-2 0" fill="#d946ef" />
          </g>
        )}

        {/* --- SEASONAL OUTFITS / DECORATIONS --- */}
        {outfit === 'christmas' && (
          <g>
            {/* Red Cap */}
            <path 
              d="M 6 8.5 C 5 5, 12 3, 15 5 C 16 6, 17 7.5, 17 8 C 17 8.5, 6 9.5, 6 8.5 Z" 
              fill="#ef4444" 
              stroke="#dc2626" 
              strokeWidth="0.5" 
            />
            {/* White Fluffy Brim */}
            <rect x="4.5" y="7.5" width="15" height="1.8" rx="0.9" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.4" />
            {/* Pom-pom */}
            <circle cx="16.5" cy="4.8" r="1.1" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.4" />
          </g>
        )}

        {outfit === 'halloween' && (
          <g>
            {/* Cone */}
            <path 
              d="M 6.5 7.5 L 12 1.5 L 17.5 7.5 Z" 
              fill="#1e1b4b" 
              stroke="#f97316" 
              strokeWidth="0.5" 
            />
            {/* Hat Band (Orange) */}
            <path d="M 6.2 6.5 L 17.8 6.5 L 17.5 7.5 L 6.5 7.5 Z" fill="#ea580c" />
            {/* Gold Buckle */}
            <rect x="11.2" y="6.3" width="1.6" height="1.4" rx="0.2" fill="#fbbf24" stroke="#d97706" strokeWidth="0.3" />
            {/* Brim */}
            <ellipse cx="12" cy="7.8" rx="8" ry="1.2" fill="#0f172a" stroke="#f97316" strokeWidth="0.4" />
          </g>
        )}

        {outfit === 'birthday' && (
          <g>
            {/* Cake / Birthday Hat Body */}
            <rect x="7" y="5" width="10" height="3" rx="0.6" fill="#fbcfe8" stroke="#db2777" strokeWidth="0.5" />
            {/* Frosting / Cream points */}
            <circle cx="8.5" cy="5" r="0.4" fill="#ffffff" />
            <circle cx="10.25" cy="5" r="0.4" fill="#ffffff" />
            <circle cx="12" cy="5" r="0.4" fill="#ffffff" />
            <circle cx="13.75" cy="5" r="0.4" fill="#ffffff" />
            <circle cx="15.5" cy="5" r="0.4" fill="#ffffff" />
            <path d="M 7 6.5 C 8 7.5, 10 7.5, 12 6.5 C 14 7.5, 16 7.5, 17 6.5" stroke="#db2777" strokeWidth="0.5" fill="none" />
            {/* Candle */}
            <rect x="11.4" y="2.5" width="1.2" height="2.5" rx="0.2" fill="#67e8f9" stroke="#0891b2" strokeWidth="0.3" />
            {/* Candle Flame (animated pulsing) */}
            <path 
              d="M 12 0.5 C 11.5 1.5, 11.5 2.2, 12 2.5 C 12.5 2.2, 12.5 1.5, 12 0.5 Z" 
              fill="#f97316" 
              className="animate-pulse" 
              style={{ transformOrigin: '12px 2px' }}
            />
            {/* Birthday sparkles floating around */}
            <path d="M5 4.5l.25.5.5.25-.5.25-.25.5-.25-.5-.5-.25.5-.25z" fill="#f43f5e" className="birthday-sparkle-anim" />
            <path d="M19.5 3l.2.4.4.2-.4.2-.2.4-.2-.4-.4-.2.4-.2z" fill="#fbbf24" className="birthday-sparkle-anim" style={{ animationDelay: '0.4s' }} />
            <path d="M4 8l.15.3.3.15-.3.15-.15.3-.15-.3-.3-.15.3-.15z" fill="#a855f7" className="birthday-sparkle-anim" style={{ animationDelay: '0.8s' }} />
            <path d="M20.5 7l.15.3.3.15-.3.15-.15.3-.15-.3-.3-.15.3-.15z" fill="#22d3ee" className="birthday-sparkle-anim" style={{ animationDelay: '0.2s' }} />
          </g>
        )}

        {outfit === 'valentine' && (
          <g className="heart-float-anim" style={{ transformOrigin: '17px 16px' }}>
            {/* Heart shaped Chocolate Box */}
            <path 
              d="M 17 14 C 16 12.5, 14.5 12.5, 14.5 14 C 14.5 16, 17 18, 17 18 C 17 18, 19.5 16, 19.5 14 C 19.5 12.5, 18 12.5, 17 14 Z" 
              fill="#be123c" 
              stroke="#fda4af" 
              strokeWidth="0.5" 
            />
            {/* Yellow Ribbon / Bow */}
            <path d="M 14.7 15 L 19.3 15 M 17 13.5 L 17 17.5" stroke="#fbbf24" strokeWidth="0.4" />
            <circle cx="17" cy="15" r="0.4" fill="#fbbf24" />
          </g>
        )}

        {outfit === 'tet' && (
          <g style={{ transform: 'rotate(-10deg)', transformOrigin: '17px 15px' }}>
            {/* Red Envelope */}
            <rect x="15" y="13.5" width="4.5" height="6.5" rx="0.4" fill="#dc2626" stroke="#fbbf24" strokeWidth="0.4" />
            {/* Flap lines */}
            <path d="M 15 14.5 L 17.25 16 L 19.5 14.5" fill="none" stroke="#b91c1c" strokeWidth="0.4" />
            {/* Gold Star */}
            <path d="M 17.25 16.5 L 17.5 17.2 L 18.2 17.2 L 17.65 17.6 L 17.85 18.3 L 17.25 17.9 L 16.65 18.3 L 16.85 17.6 L 16.3 17.2 L 17 17.2 Z" fill="#fbbf24" />
          </g>
        )}

        {/* Costume outfit: hero star-cape & collar (for nickname field on register page) */}
        {outfit === 'costume' && (
          <g>
            {/* Sparkling hero collar / neck piece */}
            <path d="M 6 17.5 Q 9 19.5 12 18 Q 15 19.5 18 17.5 L 17 16 Q 14.5 17.5 12 16.5 Q 9.5 17.5 7 16 Z"
              fill="#7c3aed" stroke="#a78bfa" strokeWidth="0.5" />
            {/* Left cape wing */}
            <path d="M 7 16 Q 3 14 2 10 Q 4 12 6 15 Z"
              fill="#4c1d95" stroke="#7c3aed" strokeWidth="0.5" />
            {/* Right cape wing */}
            <path d="M 17 16 Q 21 14 22 10 Q 20 12 18 15 Z"
              fill="#4c1d95" stroke="#7c3aed" strokeWidth="0.5" />
            {/* Gold star badge on collar */}
            <path d="M 12 17 L 12.3 17.8 L 13.1 17.8 L 12.5 18.3 L 12.7 19.1 L 12 18.6 L 11.3 19.1 L 11.5 18.3 L 10.9 17.8 L 11.7 17.8 Z"
              fill="#fbbf24" />
            {/* Sparkles floating around outfit */}
            <g className="animate-pulse" fill="#a78bfa">
              <path d="M 3 8 L 3.2 8.6 L 3.8 8.6 L 3.3 9 L 3.5 9.6 L 3 9.2 L 2.5 9.6 L 2.7 9 L 2.2 8.6 L 2.8 8.6 Z" />
              <path d="M 21 8 L 21.2 8.6 L 21.8 8.6 L 21.3 9 L 21.5 9.6 L 21 9.2 L 20.5 9.6 L 20.7 9 L 20.2 8.6 L 20.8 8.6 Z" />
            </g>
          </g>
        )}

        {/* Galaxy outfit: Astronomer/Galaxy Explorer costume (for nickname field on register page) */}
        {outfit === 'galaxy' && (
          <g>
            {/* Galaxy explorer scarf / collar flowing */}
            <path d="M 5.5 17 Q 9 20 12 18.5 Q 15 20 18.5 17 L 17.5 15.5 Q 14.5 18 12 16.8 Q 9.5 18 6.5 15.5 Z"
              fill="#0ea5e9" stroke="#38bdf8" strokeWidth="0.5" />
            {/* Left flowing cloak */}
            <path d="M 6.5 15.5 Q 2 13 1.5 9 Q 3.5 11.5 5.5 14.5 Z"
              fill="#0c4a6e" stroke="#0ea5e9" strokeWidth="0.5" />
            {/* Right flowing cloak */}
            <path d="M 17.5 15.5 Q 22 13 22.5 9 Q 20.5 11.5 18.5 14.5 Z"
              fill="#0c4a6e" stroke="#0ea5e9" strokeWidth="0.5" />
            {/* Star chart / mini constellation held */}
            <g className="galaxy-float-anim">
              <rect x="17" y="5" width="5" height="4" rx="0.5" fill="#0f172a" stroke="#38bdf8" strokeWidth="0.5" />
              <circle cx="18.2" cy="6.2" r="0.3" fill="#fbbf24" />
              <circle cx="20.5" cy="6.5" r="0.3" fill="#22d3ee" />
              <circle cx="19" cy="7.8" r="0.3" fill="#a855f7" />
              <line x1="18.2" y1="6.2" x2="20.5" y2="6.5" stroke="#38bdf8" strokeWidth="0.3" />
              <line x1="20.5" y1="6.5" x2="19" y2="7.8" stroke="#38bdf8" strokeWidth="0.3" />
            </g>
            {/* Galaxy sparkles */}
            <g fill="#38bdf8" className="animate-pulse">
              <path d="M 3 7 L 3.2 7.6 L 3.8 7.6 L 3.3 8 L 3.5 8.6 L 3 8.2 L 2.5 8.6 L 2.7 8 L 2.2 7.6 L 2.8 7.6 Z" />
            </g>
            <path d="M20 12l.2.4.4.2-.4.2-.2.4-.2-.4-.4-.2.4-.2z" fill="#fbbf24" className="animate-pulse" />
          </g>
        )}

        {/* Wizard outfit: Áo choàng pháp sư (works with any expression) */}
        {outfit === 'wizard' && (
          <g>
            {/* Wizard Hat (only if not wearing other hats or wigs) */}
            {expression !== 'witch' && expression !== 'security' && expression !== 'thief' && expression !== 'lawyer' && expression !== 'vortex' && (
              <g>
                <path d="M5.5 7.5 Q 11 1 14.5 -1.5 Q 12.5 4 18.5 7.5 Z" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="0.5" />
                <ellipse cx="12" cy="7.5" rx="8" ry="1.5" fill="#172554" />
                {/* Gold star on wizard hat */}
                <path d="M10 3.5 L10.3 4.1 L11 4.2 L10.5 4.7 L10.6 5.4 L10 5 L9.4 5.4 L9.5 4.7 L9 4.2 L9.7 4.1 Z" fill="#eab308" />
              </g>
            )}

            {/* Wizard Cloak / Collar */}
            <path d="M 6 17.5 Q 9 19.5 12 18 Q 15 19.5 18 17.5 L 17 16 Q 14.5 17.5 12 16.5 Q 9.5 17.5 7 16 Z"
              fill="#1e3a8a" stroke="#3b82f6" strokeWidth="0.5" />
            {/* Left cloak wing */}
            <path d="M 7 16 Q 3 14 2 10 Q 4 12 6 15 Z"
              fill="#172554" stroke="#1e3a8a" strokeWidth="0.5" />
            {/* Right cloak wing */}
            <path d="M 17 16 Q 21 14 22 10 Q 20 12 18 15 Z"
              fill="#172554" stroke="#1e3a8a" strokeWidth="0.5" />
            {/* Gold star badge on collar */}
            <path d="M 12 17 L 12.3 17.8 L 13.1 17.8 L 12.5 18.3 L 12.7 19.1 L 12 18.6 L 11.3 19.1 L 11.5 18.3 L 10.9 17.8 L 11.7 17.8 Z"
              fill="#eab308" />
            {/* Sparkle accents on cloak */}
            <g className="animate-pulse" fill="#3b82f6">
              <path d="M 3 8 L 3.2 8.6 L 3.8 8.6 L 3.3 9 L 3.5 9.6 L 3 9.2 L 2.5 9.6 L 2.7 9 L 2.2 8.6 L 2.8 8.6 Z" />
              <path d="M 21 8 L 21.2 8.6 L 21.8 8.6 L 21.3 9 L 21.5 9.6 L 21 9.2 L 20.5 9.6 L 20.7 9 L 20.2 8.6 L 20.8 8.6 Z" />
            </g>
          </g>
        )}

        {/* Discover outfit: Trang phục Giải mã / Khám phá (Zodiac + Numerology) */}
        {outfit === 'discover' && (
          <g>
            {/* 1. Zodiac Element: Miniature Zodiac Wheel behind the head */}
            <circle cx="12" cy="12" r="10" fill="none" stroke="#22d3ee" strokeWidth="0.4" strokeDasharray="1 3" className="vortex-spin-clockwise" style={{ animationDuration: '6s' }} opacity="0.5" />
            <circle cx="12" cy="12" r="8.5" fill="none" stroke="#a855f7" strokeWidth="0.3" strokeDasharray="3 3" className="vortex-spin-counterclockwise" style={{ animationDuration: '8s' }} opacity="0.4" />
            
            {/* Little zodiac glyph symbols or star dots around the wheel */}
            <g className="vortex-spin-clockwise" style={{ animationDuration: '10s' }} opacity="0.6">
              <path d="M12 2.5 L12.5 3.2" stroke="#22d3ee" strokeWidth="0.4" />
              <path d="M21.5 12 L20.8 12.5" stroke="#22d3ee" strokeWidth="0.4" />
              <path d="M12 21.5 L11.5 20.8" stroke="#22d3ee" strokeWidth="0.4" />
              <path d="M2.5 12 L3.2 11.5" stroke="#22d3ee" strokeWidth="0.4" />
            </g>

            {/* 2. Numerology Elements: Floating numbers (1, 5, 8) swirling around */}
            <g className="number-play-anim" style={{ transformOrigin: '4px 6px' }}>
              <text x="3" y="6" fill="#fbbf24" fontSize="2.8" fontWeight="black" opacity="0.9" className="drop-shadow-[0_0_3px_rgba(251,191,36,0.8)]">7</text>
            </g>
            <g className="number-play-anim" style={{ transformOrigin: '20px 8px', animationDelay: '0.8s' }}>
              <text x="19" y="8" fill="#d946ef" fontSize="2.5" fontWeight="black" opacity="0.8" className="drop-shadow-[0_0_3px_rgba(217,70,239,0.8)]">3</text>
            </g>
            <g className="number-play-anim" style={{ transformOrigin: '5px 19px', animationDelay: '1.6s' }}>
              <text x="4" y="19" fill="#22d3ee" fontSize="2.6" fontWeight="black" opacity="0.85" className="drop-shadow-[0_0_3px_rgba(34,211,238,0.8)]">9</text>
            </g>

            {/* 3. Explorer Outfit details */}
            {/* Explorer Monocle / Cosmic Lens over right eye (Nhòm giải mã) */}
            {expression !== 'searching' && (
              <g>
                <circle cx="15" cy="12.5" r="2.2" fill="none" stroke="#22d3ee" strokeWidth="0.6" className="animate-pulse" />
                <line x1="16.5" y1="11" x2="19" y2="8" stroke="#22d3ee" strokeWidth="0.5" />
                <circle cx="19" cy="8" r="0.4" fill="#22d3ee" />
              </g>
            )}

            {/* Star-decked Collar / Scarf */}
            <path d="M 6 17.5 Q 9 19.5 12 18 Q 15 19.5 18 17.5 L 17.2 16 Q 14.5 17.5 12 16.8 Q 9.5 17.5 6.8 16 Z"
              fill="#0f172a" stroke="#a855f7" strokeWidth="0.6" />
            <circle cx="12" cy="18.5" r="0.6" fill="#fbbf24" className="animate-ping" />
            <circle cx="12" cy="18.5" r="0.6" fill="#fbbf24" />
          </g>
        )}

        {/* Numerology Birthday Outfit: Thần số học ngày sinh (gồm những con số) */}
        {outfit === 'numerology_birthday' && (
          <g>
            {/* Spinning number ring behind the head */}
            <circle cx="12" cy="12" r="9" fill="none" stroke="#a855f7" strokeWidth="0.3" strokeDasharray="2 4" className="vortex-spin-clockwise" style={{ animationDuration: '7s' }} opacity="0.4" />
            
            {/* Floating glowing birthday numbers */}
            <g className="number-play-anim" style={{ transformOrigin: '3px 8px' }}>
              <text x="2" y="8" fill="#fbbf24" fontSize="2.8" fontWeight="black" opacity="0.9" className="drop-shadow-[0_0_3px_rgba(251,191,36,0.8)]">8</text>
            </g>
            <g className="number-play-anim" style={{ transformOrigin: '21px 11px', animationDelay: '0.6s' }}>
              <text x="20" y="11" fill="#22d3ee" fontSize="2.6" fontWeight="black" opacity="0.9" className="drop-shadow-[0_0_3px_rgba(34,211,238,0.8)]">2</text>
            </g>
            <g className="number-play-anim" style={{ transformOrigin: '5px 19px', animationDelay: '1.2s' }}>
              <text x="4" y="19" fill="#d946ef" fontSize="2.7" fontWeight="black" opacity="0.85" className="drop-shadow-[0_0_3px_rgba(217,70,239,0.8)]">4</text>
            </g>
            <g className="number-play-anim" style={{ transformOrigin: '19px 19px', animationDelay: '1.8s' }}>
              <text x="18" y="19" fill="#34d399" fontSize="2.5" fontWeight="black" opacity="0.8" className="drop-shadow-[0_0_3px_rgba(52,211,153,0.8)]">6</text>
            </g>

            {/* Glowing collar with math matrix vibes */}
            <path d="M 6 17.5 Q 9 19.5 12 18 Q 15 19.5 18 17.5 L 17.2 16 Q 14.5 17.5 12 16.8 Q 9.5 17.5 6.8 16 Z"
              fill="#0f172a" stroke="#a855f7" strokeWidth="0.6" />
            <rect x="10.5" y="18" width="3" height="1" rx="0.2" fill="#3b0764" stroke="#22d3ee" strokeWidth="0.3" />
            <text x="12" y="18.8" fill="#22d3ee" fontSize="0.9" textAnchor="middle" fontWeight="bold">NUM</text>
          </g>
        )}

        {/* Numerology Name Outfit: Thần số học theo tên (chữ cái & con số) */}
        {outfit === 'numerology_name' && (
          <g>
            {/* Spinning letter/number ring behind */}
            <circle cx="12" cy="12" r="9" fill="none" stroke="#22d3ee" strokeWidth="0.3" strokeDasharray="1 4" className="vortex-spin-counterclockwise" style={{ animationDuration: '9s' }} opacity="0.4" />
            
            {/* Floating letters & numbers */}
            <g className="number-play-anim" style={{ transformOrigin: '3px 9px' }}>
              <text x="2" y="9" fill="#a855f7" fontSize="2.8" fontWeight="black" opacity="0.9" className="drop-shadow-[0_0_3px_rgba(168,85,247,0.8)]">A</text>
            </g>
            <g className="number-play-anim" style={{ transformOrigin: '21px 8px', animationDelay: '0.5s' }}>
              <text x="20" y="8" fill="#fbbf24" fontSize="2.6" fontWeight="black" opacity="0.9" className="drop-shadow-[0_0_3px_rgba(251,191,36,0.8)]">5</text>
            </g>
            <g className="number-play-anim" style={{ transformOrigin: '4px 19px', animationDelay: '1.0s' }}>
              <text x="3" y="19" fill="#d946ef" fontSize="2.7" fontWeight="black" opacity="0.85" className="drop-shadow-[0_0_3px_rgba(217,70,239,0.8)]">N</text>
            </g>
            <g className="number-play-anim" style={{ transformOrigin: '19px 18px', animationDelay: '1.5s' }}>
              <text x="18" y="18" fill="#22d3ee" fontSize="2.5" fontWeight="black" opacity="0.8" className="drop-shadow-[0_0_3px_rgba(34,211,238,0.8)]">1</text>
            </g>

            {/* Glowing collar with name/letters details */}
            <path d="M 6 17.5 Q 9 19.5 12 18 Q 15 19.5 18 17.5 L 17.2 16 Q 14.5 17.5 12 16.8 Q 9.5 17.5 6.8 16 Z"
              fill="#0f172a" stroke="#d946ef" strokeWidth="0.6" />
            <rect x="10.5" y="18" width="3" height="1" rx="0.2" fill="#4a044e" stroke="#d946ef" strokeWidth="0.3" />
            <text x="12" y="18.8" fill="#d946ef" fontSize="0.9" textAnchor="middle" fontWeight="bold">ABC</text>
          </g>
        )}

        {/* Zodiac Page Outfit: Trang chòm sao / Cung hoàng đạo */}
        {outfit === 'zodiac_page' && (
          <g>
            {/* Constellation lines behind the head */}
            <g className="vortex-spin-clockwise" style={{ animationDuration: '12s' }} opacity="0.4">
              <circle cx="12" cy="12" r="9.5" fill="none" stroke="#22d3ee" strokeWidth="0.3" strokeDasharray="3 5" />
              {/* Constellation dots */}
              <circle cx="12" cy="2.5" r="0.6" fill="#ffffff" />
              <circle cx="21.5" cy="12" r="0.6" fill="#ffffff" />
              <circle cx="12" cy="21.5" r="0.6" fill="#ffffff" />
              <circle cx="2.5" cy="12" r="0.6" fill="#ffffff" />
              <line x1="12" y1="2.5" x2="21.5" y2="12" stroke="#22d3ee" strokeWidth="0.25" />
              <line x1="21.5" y1="12" x2="12" y2="21.5" stroke="#22d3ee" strokeWidth="0.25" />
              <line x1="12" y1="21.5" x2="2.5" y2="12" stroke="#22d3ee" strokeWidth="0.25" />
              <line x1="2.5" y1="12" x2="12" y2="2.5" stroke="#22d3ee" strokeWidth="0.25" />
            </g>

            {/* Glowing stars around head */}
            <g className="number-play-anim" style={{ transformOrigin: '3px 8px' }}>
              <path d="M3 6l.2.4.4.2-.4.2-.2.4-.2-.4-.4-.2.4-.2z" fill="#fbbf24" />
            </g>
            <g className="number-play-anim" style={{ transformOrigin: '21px 9px', animationDelay: '0.6s' }}>
              <path d="M20 7l.25.5.5.25-.5.25-.25.5-.25-.5-.5-.25.5-.25z" fill="#22d3ee" />
            </g>
            <g className="number-play-anim" style={{ transformOrigin: '4px 19px', animationDelay: '1.2s' }}>
              <path d="M3 17l.2.4.4.2-.4.2-.2.4-.2-.4-.4-.2.4-.2z" fill="#d946ef" />
            </g>
            <g className="number-play-anim" style={{ transformOrigin: '20px 19px', animationDelay: '1.8s' }}>
              <path d="M19 17l.2.4.4.2-.4.2-.2.4-.2-.4-.4-.2.4-.2z" fill="#34d399" />
            </g>

            {/* Galaxy collar */}
            <path d="M 6 17.5 Q 9 19.5 12 18 Q 15 19.5 18 17.5 L 17.2 16 Q 14.5 17.5 12 16.8 Q 9.5 17.5 6.8 16 Z"
              fill="#0f172a" stroke="#22d3ee" strokeWidth="0.6" />
            <polygon points="12,17.4 12.2,17.9 12.7,17.9 12.3,18.1 12.5,18.6 12,18.3 11.5,18.6 11.7,18.1 11.3,17.9 11.8,17.9" fill="#fbbf24" className="animate-pulse" />
          </g>
        )}
          </>
        )}
      </g>

      {/* Antenna (AI Receiver) */}
      {expression !== 'vortex' && (
        <line 
          x1="12" 
          y1="8" 
          x2="12" 
          y2="5" 
          stroke="url(#cosmicAIGrad)" 
          strokeWidth="1.2" 
          strokeLinecap="round" 
        />
      )}

      {/* Sparking Star/Sparkle atop Antenna (Spiritual/Magic Aspect) */}
      {expression !== 'vortex' && (
        <path 
          d="M12 2l.5 1.2 1.2.5-1.2.5-.5 1.2-.5-1.2-1.2-.5 1.2-.5z" 
          fill="#22d3ee" 
        />
      )}

      {/* Orbit Ring (Cosmic Aspect) - Front Side (Not showing when launching rocket for clean lines) */}
      {expression !== 'rocket' && expression !== 'vortex' && (
        <path 
          d="M3 13.5c1.5 1.5 5.5 3.2 9 3.2s7.5-1.7 9-3.2" 
          stroke="url(#cosmicAIGrad)" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          className={expression === 'vertigo' ? 'cosmic-ring-spin-anim' : 'cosmic-ring-anim'}
        />
      )}

      {/* Background Magic Sparkles */}
      {expression !== 'rocket' && (
        <>
          <path d="M19.5 6l.3.7.7.3-.7.3-.3.7-.3-.7-.7-.3.7-.3z" fill="#d946ef" opacity="0.7" />
          <path d="M4.5 17.5l.2.5.5.2-.5.2-.2.5-.2-.5-.5-.2.5-.2z" fill="#a855f7" opacity="0.7" />
        </>
      )}
    </svg>
  );
}
