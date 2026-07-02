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
      {/* Left Card */}
      <g transform="rotate(-20 12 17)">
        {/* Background & Shadow Card */}
        <rect 
          x="9" 
          y="4.5" 
          width="6" 
          height="11" 
          rx="1" 
          fill="#060814" 
          className="stroke-purple-500/70" 
          strokeWidth="1.2" 
        />
        {/* Inner dotted border */}
        <rect 
          x="9.8" 
          y="5.3" 
          width="4.4" 
          height="9.4" 
          rx="0.5" 
          className="stroke-purple-500/30" 
          strokeWidth="0.8" 
          strokeDasharray="1.5 1" 
        />
        {/* Small symbol */}
        <circle cx="12" cy="10" r="1" className="fill-purple-400/40" />
      </g>
      
      {/* Right Card */}
      <g transform="rotate(20 12 17)">
        {/* Background & Shadow Card */}
        <rect 
          x="9" 
          y="4.5" 
          width="6" 
          height="11" 
          rx="1" 
          fill="#060814" 
          className="stroke-purple-500/70" 
          strokeWidth="1.2" 
        />
        {/* Inner dotted border */}
        <rect 
          x="9.8" 
          y="5.3" 
          width="4.4" 
          height="9.4" 
          rx="0.5" 
          className="stroke-purple-500/30" 
          strokeWidth="0.8" 
          strokeDasharray="1.5 1" 
        />
        {/* Small symbol */}
        <circle cx="12" cy="10" r="1" className="fill-purple-400/40" />
      </g>

      {/* Center Card (On top, slightly higher) */}
      <g transform="translate(0, -1)">
        {/* Main Card Body */}
        <rect 
          x="9" 
          y="4.5" 
          width="6" 
          height="11" 
          rx="1" 
          fill="#080c21" 
          className="stroke-purple-400" 
          strokeWidth="1.3" 
        />
        {/* Inner dotted border */}
        <rect 
          x="9.8" 
          y="5.3" 
          width="4.4" 
          height="9.4" 
          rx="0.5" 
          className="stroke-purple-400/40" 
          strokeWidth="0.8" 
          strokeDasharray="1.5 1" 
        />
        {/* Mystical Star Cross symbol in the center */}
        <line x1="12" y1="8" x2="12" y2="12" className="stroke-cyan-300" strokeWidth="0.8" />
        <line x1="10" y1="10" x2="14" y2="10" className="stroke-cyan-300" strokeWidth="0.8" />
        <circle cx="12" cy="10" r="0.6" className="fill-white" />
      </g>

      {/* Magical sparkles below the cards fan */}
      <circle cx="6" cy="18" r="0.6" className="fill-cyan-300" />
      <circle cx="18" cy="18" r="0.6" className="fill-cyan-300" />
      <circle cx="12" cy="18.5" r="0.8" className="fill-purple-300" />
    </svg>
  );
}
