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
      </defs>

      {/* Orbit Ring (Cosmic Aspect) - Back Side */}
      <path 
        d="M3 13.5c1.5-1.5 5.5-3.2 9-3.2s7.5 1.7 9 3.2" 
        stroke="url(#cosmicAIGrad)" 
        strokeWidth="1.2" 
        strokeLinecap="round" 
        strokeDasharray="2 2"
        opacity="0.6"
        transform="rotate(-15 12 12)"
      />

      {/* Ears / Side Bolt Receivers */}
      <rect x="3.5" y="11.5" width="2" height="3" rx="0.8" fill="url(#cosmicAIGrad)" opacity="0.8" />
      <rect x="18.5" y="11.5" width="2" height="3" rx="0.8" fill="url(#cosmicAIGrad)" opacity="0.8" />

      {/* Robot Head Body (AI Aspect - Chubbier shape) */}
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

      {/* Crescent Moon on Forehead (Góc Vũ Trụ Spiritual Aspect) */}
      <path 
        d="M12.2 9.8c0-.5.2-.9.7-1.1-.1-.1-.2-.1-.3-.1-.7 0-1.2.5-1.2 1.2s.5 1.2 1.2 1.2c.1 0 .2 0 .3-.1-.4-.1-.7-.6-.7-1.1z" 
        fill="#22d3ee" 
        opacity="0.9"
      />

      {/* Dynamic Expressions: Eyes, Mouth, Cheeks & Floating elements */}
      {expression === 'happy' && (
        <>
          {/* Curved Happy Eyes (^^) */}
          <path d="M7.8 13c.3-.4.9-.4 1.2 0" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M15 13c.3-.4.9-.4 1.2 0" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          
          {/* Cheerful Cheeks */}
          <ellipse cx="7.2" cy="14.3" rx="1.2" ry="0.7" fill="#d946ef" fillOpacity="0.8" />
          <ellipse cx="16.8" cy="14.3" rx="1.2" ry="0.7" fill="#d946ef" fillOpacity="0.8" />
          
          {/* Happy Open Mouth */}
          <path d="M11.2 14.8c.2.5 1.4.5 1.6 0" fill="#22d3ee" stroke="#22d3ee" strokeWidth="1" strokeLinecap="round" />
        </>
      )}

      {expression === 'sleepy' && (
        <>
          {/* Sleeping Closed Eyes (u u) */}
          <path d="M8 12.8c.2.4.8.4 1 0" stroke="#22d3ee" strokeWidth="1.3" strokeLinecap="round" fill="none" />
          <path d="M15 12.8c.2.4.8.4 1 0" stroke="#22d3ee" strokeWidth="1.3" strokeLinecap="round" fill="none" />
          
          {/* Sleepy zZz animations */}
          <g className="animate-pulse" style={{ transformOrigin: '19px 4px' }}>
            <path d="M18 4.5h1.5L18 6h1.5" stroke="#22d3ee" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M19.5 2h1L19.5 3h1" stroke="#d946ef" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>

          {/* Neutral Sleepy Mouth */}
          <line x1="11.5" y1="14.8" x2="12.5" y2="14.8" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" />
        </>
      )}

      {expression === 'thinking' && (
        <>
          {/* Squinted thinking eyes looking up */}
          <ellipse cx="9" cy="12.2" rx="1.1" ry="1.4" fill="#22d3ee" />
          <ellipse cx="15" cy="12.2" rx="1.3" ry="1.6" fill="#22d3ee" />
          <circle cx="9.2" cy="11.7" r="0.35" fill="#ffffff" />
          <circle cx="15.2" cy="11.7" r="0.4" fill="#ffffff" />
          
          {/* Little floating thinking dots */}
          <g className="animate-bounce" style={{ transformOrigin: '19px 3px' }}>
            <circle cx="18" cy="4" r="0.6" fill="#22d3ee" />
            <circle cx="19.5" cy="3" r="0.6" fill="#d946ef" />
            <circle cx="21" cy="4" r="0.6" fill="#22d3ee" />
          </g>

          {/* Puzzled Wavy Mouth */}
          <path d="M11 14.8c.3-.2.7.2 1 0s.7-.2 1 0" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        </>
      )}

      {expression === 'love' && (
        <>
          {/* Big happy sparkly eyes */}
          <ellipse cx="9" cy="12.8" rx="1.3" ry="1.6" fill="#22d3ee" />
          <ellipse cx="15" cy="12.8" rx="1.3" ry="1.6" fill="#22d3ee" />
          <circle cx="9.4" cy="12.3" r="0.4" fill="#ffffff" />
          <circle cx="15.4" cy="12.3" r="0.4" fill="#ffffff" />
          
          {/* Deep Blush */}
          <ellipse cx="7.2" cy="14.3" rx="1.3" ry="0.8" fill="#f43f5e" fillOpacity="0.85" />
          <ellipse cx="16.8" cy="14.3" rx="1.3" ry="0.8" fill="#f43f5e" fillOpacity="0.85" />

          {/* Happy smile */}
          <path d="M11.2 14.8c.3.4.9.4 1.6 0" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" />

          {/* Floating glowing pink hearts */}
          <g className="animate-bounce" style={{ transformOrigin: '19px 3px' }}>
            <path d="M19 2.5c-.5-.5-1.2 0-1.2 0s-.7-.5-1.2 0c-.5.5-.5 1.2 0 1.8l1.2 1.2 1.2-1.2c.5-.6.5-1.3 0-1.8z" fill="#f43f5e" />
            <path d="M5.2 6c-.3-.3-.8 0-.8 0s-.4-.3-.8 0c-.3.3-.3.8 0 1.1l.8.8.8-.8c.3-.3.3-.8 0-1.1z" fill="#f43f5e" opacity="0.8" />
          </g>
        </>
      )}

      {expression === 'tarot' && (
        <>
          {/* Focused magical eyes */}
          <ellipse cx="9" cy="12.8" rx="1.3" ry="1.6" fill="#22d3ee" />
          <ellipse cx="15" cy="12.8" rx="1.3" ry="1.6" fill="#22d3ee" />
          <circle cx="9.4" cy="12.3" r="0.4" fill="#ffffff" />
          <circle cx="15.4" cy="12.3" r="0.4" fill="#ffffff" />
          
          {/* Subtle blush */}
          <ellipse cx="7.2" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.6" />
          <ellipse cx="16.8" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.6" />

          {/* Cute mouth */}
          <path d="M11.2 14.8c.3.4.9.4 1.6 0" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" />

          {/* Tiny floating neon tarot card */}
          <g className="animate-bounce" style={{ transformOrigin: '19px 4px', animationDuration: '2.5s' }}>
            <rect x="17.2" y="2" width="4.5" height="7" rx="0.5" fill="#060919" stroke="#d946ef" strokeWidth="0.8" transform="rotate(15 19 5)" />
            <path d="M19.5 4.5l.5.8-.5.8-.5-.8z" fill="#22d3ee" transform="rotate(15 19 5)" opacity="0.8" />
          </g>
        </>
      )}

      {expression === 'calculating' && (
        <>
          {/* Animated scanning pupil eyes */}
          <ellipse cx="9" cy="12.8" rx="1.3" ry="1.6" fill="#22d3ee" opacity="0.6" />
          <ellipse cx="15" cy="12.8" rx="1.3" ry="1.6" fill="#22d3ee" opacity="0.6" />
          
          {/* Pupils moving left and right */}
          <circle cx="9" cy="12.8" r="0.6" fill="#22d3ee" className="animate-pulse" />
          <circle cx="15" cy="12.8" r="0.6" fill="#22d3ee" className="animate-pulse" />

          {/* Concentrated mouth */}
          <circle cx="12" cy="14.8" r="0.6" fill="#22d3ee" />

          {/* Outer rotating/spinning computing dots */}
          <g className="animate-spin" style={{ transformOrigin: '12px 12px', animationDuration: '3s' }}>
            <circle cx="12" cy="2" r="0.6" fill="#22d3ee" />
            <circle cx="22" cy="12" r="0.6" fill="#d946ef" />
            <circle cx="12" cy="22" r="0.6" fill="#22d3ee" />
            <circle cx="2" cy="12" r="0.6" fill="#d946ef" />
          </g>
        </>
      )}

      {expression === 'idle' && (
        <>
          {/* Glowing AI Digital Eyes */}
          <ellipse cx="9" cy="12.8" rx="1.3" ry="1.6" fill="#22d3ee" />
          <ellipse cx="15" cy="12.8" rx="1.3" ry="1.6" fill="#22d3ee" />
          <circle cx="9.4" cy="12.3" r="0.4" fill="#ffffff" />
          <circle cx="15.4" cy="12.3" r="0.4" fill="#ffffff" />
          
          {/* Blush Cheeks */}
          <ellipse cx="7.2" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.6" />
          <ellipse cx="16.8" cy="14.3" rx="1.1" ry="0.6" fill="#d946ef" fillOpacity="0.6" />

          {/* Cute Smile */}
          <path d="M11.2 14.8c.3.4.9.4 1.6 0" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" />
        </>
      )}

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

      {/* Orbit Ring (Cosmic Aspect) - Front Side */}
      <path 
        d="M3 13.5c1.5 1.5 5.5 3.2 9 3.2s7.5-1.7 9-3.2" 
        stroke="url(#cosmicAIGrad)" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        transform="rotate(-15 12 12)"
      />

      {/* Background Magic Sparkles */}
      <path d="M19.5 6l.3.7.7.3-.7.3-.3.7-.3-.7-.7-.3.7-.3z" fill="#d946ef" opacity="0.7" />
      <path d="M4.5 17.5l.2.5.5.2-.5.2-.2.5-.2-.5-.5-.2.5-.2z" fill="#a855f7" opacity="0.7" />
    </svg>
  );
}
