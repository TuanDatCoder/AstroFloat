import React from 'react';

export default function CosmicAIIcon({ className = "w-6 h-6", ...props }) {
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
      <rect x="4.5" y="11.5" width="2" height="3" rx="0.8" fill="url(#cosmicAIGrad)" opacity="0.8" />
      <rect x="17.5" y="11.5" width="2" height="3" rx="0.8" fill="url(#cosmicAIGrad)" opacity="0.8" />

      {/* Robot Head Body (AI Aspect) */}
      <rect 
        x="6" 
        y="8.5" 
        width="12" 
        height="9" 
        rx="3.5" 
        fill="#060919" 
        fillOpacity="0.85" 
        stroke="url(#cosmicAIGrad)" 
        strokeWidth="1.5" 
      />
      
      {/* Inner Glow Face overlay */}
      <rect 
        x="6" 
        y="8.5" 
        width="12" 
        height="9" 
        rx="3.5" 
        fill="url(#innerFaceGlow)" 
        pointerEvents="none"
      />

      {/* Crescent Moon on Forehead (Góc Vũ Trụ Spiritual Aspect) */}
      <path 
        d="M12.2 10.4c0-.6.3-1.1.8-1.3-.1-.1-.3-.1-.4-.1-.8 0-1.4.6-1.4 1.4s.6 1.4 1.4 1.4c.1 0 .3 0 .4-.1-.5-.2-.8-.7-.8-1.3z" 
        fill="#22d3ee" 
        opacity="0.9"
      />

      {/* Glowing AI Digital Eyes */}
      <ellipse cx="9.5" cy="13.2" rx="0.8" ry="1.1" fill="#22d3ee" />
      <ellipse cx="14.5" cy="13.2" rx="0.8" ry="1.1" fill="#22d3ee" />

      {/* Happy Smile Mouth */}
      <path 
        d="M11 15.2c.5.5 1.5.5 2 0" 
        stroke="#d946ef" 
        strokeWidth="1" 
        strokeLinecap="round" 
      />

      {/* Antenna (AI Receiver) */}
      <line 
        x1="12" 
        y1="8.5" 
        x2="12" 
        y2="5.5" 
        stroke="url(#cosmicAIGrad)" 
        strokeWidth="1.2" 
        strokeLinecap="round" 
      />

      {/* Sparking Star/Sparkle atop Antenna (Spiritual/Magic Aspect) */}
      <path 
        d="M12 2.5l.5 1.2 1.2.5-1.2.5-.5 1.2-.5-1.2-1.2-.5 1.2-.5z" 
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
