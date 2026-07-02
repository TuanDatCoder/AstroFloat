import React from 'react';

export default function TarotIcon({ className = "w-6 h-6", ...props }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className} 
      {...props}
    >
      <defs>
        {/* Gradient for premium neon-like borders */}
        <linearGradient id="tarotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" /> {/* purple-500 */}
          <stop offset="50%" stopColor="#d946ef" /> {/* fuchsia-500 */}
          <stop offset="100%" stopColor="#22d3ee" /> {/* cyan-400 */}
        </linearGradient>
      </defs>

      {/* Left Card */}
      <g transform="rotate(-15 12 18)">
        <rect 
          x="8.5" 
          y="4" 
          width="7" 
          height="12" 
          rx="1" 
          fill="#060919"
          stroke="url(#tarotGrad)" 
          strokeWidth="1.2" 
          strokeOpacity="0.8"
        />
        <rect 
          x="9.3" 
          y="4.8" 
          width="5.4" 
          height="10.4" 
          rx="0.5" 
          stroke="#a855f7" 
          strokeWidth="0.5" 
          strokeOpacity="0.3"
          strokeDasharray="1.5 1"
        />
        {/* Mystic Diamond on left card */}
        <path d="M12 8L13.5 10L12 12L10.5 10Z" fill="#a855f7" fillOpacity="0.15" />
      </g>
      
      {/* Right Card */}
      <g transform="rotate(15 12 18)">
        <rect 
          x="8.5" 
          y="4" 
          width="7" 
          height="12" 
          rx="1" 
          fill="#060919"
          stroke="url(#tarotGrad)" 
          strokeWidth="1.2" 
          strokeOpacity="0.8"
        />
        <rect 
          x="9.3" 
          y="4.8" 
          width="5.4" 
          height="10.4" 
          rx="0.5" 
          stroke="#a855f7" 
          strokeWidth="0.5" 
          strokeOpacity="0.3"
          strokeDasharray="1.5 1"
        />
        {/* Mystic Diamond on right card */}
        <path d="M12 8L13.5 10L12 12L10.5 10Z" fill="#a855f7" fillOpacity="0.15" />
      </g>

      {/* Center Card (Slightly raised & highlighted) */}
      <g transform="translate(0, -1)">
        <rect 
          x="8.5" 
          y="4" 
          width="7" 
          height="12" 
          rx="1" 
          fill="#0a0f2b" 
          stroke="url(#tarotGrad)" 
          strokeWidth="1.5" 
        />
        <rect 
          x="9.3" 
          y="4.8" 
          width="5.4" 
          height="10.4" 
          rx="0.5" 
          stroke="#22d3ee" 
          strokeWidth="0.7" 
          strokeOpacity="0.5"
          strokeDasharray="1.5 1"
        />
        {/* Moon & Star logo inside center card */}
        {/* Crescent Moon */}
        <path 
          d="M12.5 8.2C11.5 8.2 10.7 9 10.7 10C10.7 11 11.5 11.8 12.5 11.8C12.8 11.8 13.1 11.7 13.4 11.6C12.7 11.3 12.2 10.7 12.2 10C12.2 9.3 12.7 8.7 13.4 8.4C13.1 8.3 12.8 8.2 12.5 8.2Z" 
          fill="#22d3ee" 
        />
        {/* Small sparkle star */}
        <path d="M11 9L11.2 9.4L11.6 9.5L11.2 9.6L11 10L10.8 9.6L10.4 9.5L10.8 9.4Z" fill="#e2e8f0" />
      </g>

      {/* Magic glow sparkles */}
      <path d="M4 14L4.5 14.5L5 14L4.5 13.5Z" fill="#22d3ee" opacity="0.6" />
      <path d="M20 14L20.5 14.5L21 14L20.5 13.5Z" fill="#22d3ee" opacity="0.6" />
      <circle cx="12" cy="18" r="0.6" fill="#a855f7" />
    </svg>
  );
}
