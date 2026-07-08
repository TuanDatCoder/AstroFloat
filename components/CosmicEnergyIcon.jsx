import React from 'react';

export default function CosmicEnergyIcon({ className = "w-5 h-5", size }) {
  const customSize = size ? { width: size, height: size } : {};

  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none pointer-events-none drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]`}
      style={{ ...customSize, display: 'inline-block', verticalAlign: 'middle' }}
    >
      <defs>
        {/* Gradients */}
        <radialGradient id="ballGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#f472b6" /> {/* Pink */}
          <stop offset="50%" stopColor="#a855f7" /> {/* Purple */}
          <stop offset="100%" stopColor="#1e1b4b" /> {/* Dark Indigo */}
        </radialGradient>
        <linearGradient id="baseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Crystal Ball sphere */}
      <circle cx="12" cy="10" r="7.5" fill="url(#ballGlow)" stroke="#f472b6" strokeWidth="0.5" opacity="0.9" />

      {/* Internal magical sparkles/stars */}
      <path 
        d="M12 5.5L12.5 7.5L14.5 8L12.5 8.5L12 10.5L11.5 8.5L9.5 8L11.5 7.5L12 5.5Z" 
        fill="#ffffff" 
        filter="url(#glow)"
      />
      <circle cx="15" cy="12" r="0.8" fill="#e0f2fe" opacity="0.8" />
      <circle cx="9" cy="11" r="0.6" fill="#e0f2fe" opacity="0.7" />
      <path d="M11 13.5L11.3 14.2L12 14.5L11.3 14.8L11 15.5L10.7 14.8L10 14.5L10.7 14.2L11 13.5Z" fill="#ffffff" opacity="0.9" />

      {/* Spherical glossy reflection highlight */}
      <ellipse cx="10" cy="6" rx="2.5" ry="1.2" fill="#ffffff" opacity="0.45" transform="rotate(-15 10 6)" />

      {/* Celestial stand / base */}
      <path 
        d="M6 18.5C6 17.5 7.5 17 12 17C16.5 17 18 17.5 18 18.5C18 19.5 16 20.5 12 20.5C8 20.5 6 19.5 6 18.5Z" 
        fill="url(#baseGradient)" 
        stroke="#818cf8" 
        strokeWidth="0.5"
      />
      <path 
        d="M8.5 16.5L9.5 17.5H14.5L15.5 16.5" 
        stroke="#818cf8" 
        strokeWidth="1" 
        strokeLinecap="round" 
        opacity="0.8"
      />
      <path 
        d="M10.5 18.5C10.5 18.5 11 19.5 12 19.5C13 19.5 13.5 18.5 13.5 18.5" 
        stroke="#a855f7" 
        strokeWidth="1" 
        strokeLinecap="round"
      />
    </svg>
  );
}
