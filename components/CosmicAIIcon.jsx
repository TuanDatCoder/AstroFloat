import React from 'react';

export default function CosmicAIIcon({ className = "w-6 h-6", expression = "idle", numerologyNumber = null, zodiac = null, ...props }) {
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
          @keyframes numberPlay {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(-1.5px, -2px) scale(1.1); }
            66% { transform: translate(1px, -1px) scale(0.95); }
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
          .number-play-anim {
            animation: numberPlay 3s ease-in-out infinite;
            transform-origin: 19px 12px;
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
        expression === 'reading' || expression === 'searching' ? 'reading-head-anim' :
        expression === 'dizzy' || expression === 'thinking' || expression === 'calculating' ? 'dizzy-head-anim' :
        expression === 'rocket' ? 'rocket-head-anim' :
        expression === 'dancing' || expression === 'party' ? 'dancing-head-anim' :
        expression === 'coffee' || expression === 'numerology' || expression === 'love' || expression === 'pondering' || expression?.startsWith('tarot_') ? 'coffee-head-anim' : ''
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

        {/* Dizzy expression (chóng mặt) */}
        {(expression === 'dizzy' || expression === 'thinking' || expression === 'calculating') && (
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

        {expression === 'searching' && (
          <>
            <ellipse cx="9" cy="12.8" rx="1.3" ry="1.6" fill="#22d3ee" className="blink-left-anim" />
            <ellipse cx="15" cy="12.8" rx="1.3" ry="1.6" fill="#22d3ee" className="blink-right-anim" />
            <ellipse cx="7.2" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.6" />
            <ellipse cx="16.8" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.6" />
            <path d="M11.2 14.8c.3.4.9.4 1.6 0" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" />
            <g className="animate-pulse">
              <circle cx="9" cy="12.8" r="2.2" stroke="#eab308" strokeWidth="0.8" fill="none" />
              <line x1="10.5" y1="14.3" x2="12.5" y2="16.3" stroke="#eab308" strokeWidth="0.8" strokeLinecap="round" />
            </g>
          </>
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
            {/* Wizard Hat (Mũ pháp sư) */}
            <path d="M5.5 7.5 Q 11 1 14.5 -1.5 Q 12.5 4 18.5 7.5 Z" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="0.5" />
            <ellipse cx="12" cy="7.5" rx="8" ry="1.5" fill="#172554" />
            {/* Gold star on wizard hat */}
            <path d="M10 3.5 L10.3 4.1 L11 4.2 L10.5 4.7 L10.6 5.4 L10 5 L9.4 5.4 L9.5 4.7 L9 4.2 L9.7 4.1 Z" fill="#eab308" />
            
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
          <>
            {/* Dark Sunglasses (Bảo mật / Đặc vụ) */}
            <path d="M6.5 11.5 Q 9 11.5 9.5 13.5 L 6.5 13.5 Z" fill="#020617" stroke="#38bdf8" strokeWidth="0.8" />
            <path d="M17.5 11.5 Q 15 11.5 14.5 13.5 L 17.5 13.5 Z" fill="#020617" stroke="#38bdf8" strokeWidth="0.8" />
            <line x1="9.5" y1="12" x2="14.5" y2="12" stroke="#38bdf8" strokeWidth="1.2" />
            
            {/* Serious/Cool mouth */}
            <line x1="11" y1="15.2" x2="13" y2="15.2" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" />
            
            {/* Little Shield on chest */}
            <path d="M11.2 16.5 L12.8 16.5 L12.8 17.2 Q 12 18.2 11.2 17.2 Z" fill="#eab308" />
          </>
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
