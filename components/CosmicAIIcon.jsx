import React from 'react';

export default function CosmicAIIcon({ className = "w-6 h-6", expression = "idle", ...props }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className} 
      {...props}
    >
      <defs>
        {/* Cosmic Gradient blending spiritual and AI vibes */}
        <linearGradient id="cosmicAIGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" /> {/* purple-500 */}
          <stop offset="50%" stopColor="#d946ef" /> {/* fuchsia-500 */}
          <stop offset="100%" stopColor="#22d3ee" /> {/* cyan-400 */}
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

          .cosmic-ring-anim {
            animation: floatRing 3s ease-in-out infinite;
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
        `}</style>
      </defs>

      {/* Orbit Ring (Cosmic Aspect) - Back Side (Not showing when launching rocket for clean lines) */}
      {expression !== 'rocket' && (
        <path 
          d="M3 13.5c1.5-1.5 5.5-3.2 9-3.2s7.5 1.7 9 3.2" 
          stroke="url(#cosmicAIGrad)" 
          strokeWidth="1.2" 
          strokeLinecap="round" 
          strokeDasharray="2 2"
          opacity="0.6"
          className="cosmic-ring-anim"
        />
      )}

      {/* Ears / Side Bolt Receivers */}
      {expression !== 'rocket' && (
        <>
          <rect x="3.5" y="11.5" width="2" height="3" rx="0.8" fill="url(#cosmicAIGrad)" opacity="0.8" />
          <rect x="18.5" y="11.5" width="2" height="3" rx="0.8" fill="url(#cosmicAIGrad)" opacity="0.8" />
        </>
      )}

      {/* Main animated group representing the bot head */}
      <g className={
        expression === 'driving' ? 'driving-head-anim' :
        expression === 'reading' ? 'reading-head-anim' :
        expression === 'dizzy' ? 'dizzy-head-anim' :
        expression === 'rocket' ? 'rocket-head-anim' :
        expression === 'dancing' ? 'dancing-head-anim' :
        expression === 'coffee' ? 'coffee-head-anim' : ''
      }>
        
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

        {/* Crescent Moon on Forehead */}
        <path 
          d="M12.2 9.8c0-.5.2-.9.7-1.1-.1-.1-.2-.1-.3-.1-.7 0-1.2.5-1.2 1.2s.5 1.2 1.2 1.2c.1 0 .2 0 .3-.1-.4-.1-.7-.6-.7-1.1z" 
          fill="#22d3ee" 
          opacity="0.9"
        />

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

        {/* Dizzy expression (chóng mặt) */}
        {expression === 'dizzy' && (
          <>
            <path d="M8 11.8l2 2M10 11.8l-2 2" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M14 11.8l2 2M16 11.8l-2 2" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M10 15c.5-.5 1 .5 1.5 0s1-.5 1.5 0" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <ellipse 
              cx="12" 
              cy="4.5" 
              rx="3.5" 
              ry="1.2" 
              stroke="#d946ef" 
              strokeWidth="0.8" 
              fill="none" 
              strokeDasharray="2 1" 
              className="dizzy-halo-anim" 
            />
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
            <ellipse cx="9" cy="12.8" rx="1.3" ry="1.6" fill="#22d3ee" className="blink-left-anim" />
            <ellipse cx="15" cy="12.8" rx="1.3" ry="1.6" fill="#22d3ee" className="blink-right-anim" />
            <circle cx="9.4" cy="12.3" r="0.4" fill="#ffffff" className="blink-left-anim" />
            <circle cx="15.4" cy="12.3" r="0.4" fill="#ffffff" className="blink-right-anim" />
            <ellipse cx="7.2" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.6" />
            <ellipse cx="16.8" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.6" />
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
      </g>

      {/* Antenna (AI Receiver) */}
      <line 
        x1="12" 
        y1="8" 
        x2="12" 
        y2="5" 
        stroke="url(#cosmicAIGrad)" 
        strokeWidth="1.2" 
        strokeLinecap="round" 
      />

      {/* Sparking Star/Sparkle atop Antenna (Spiritual/Magic Aspect) */}
      <path 
        d="M12 2l.5 1.2 1.2.5-1.2.5-.5 1.2-.5-1.2-1.2-.5 1.2-.5z" 
        fill="#22d3ee" 
      />

      {/* Orbit Ring (Cosmic Aspect) - Front Side (Not showing when launching rocket for clean lines) */}
      {expression !== 'rocket' && (
        <path 
          d="M3 13.5c1.5 1.5 5.5 3.2 9 3.2s7.5-1.7 9-3.2" 
          stroke="url(#cosmicAIGrad)" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          className="cosmic-ring-anim"
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
