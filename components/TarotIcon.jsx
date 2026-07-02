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
      {/* Card Border */}
      <rect 
        x="4.5" 
        y="2.5" 
        width="15" 
        height="19" 
        rx="2" 
        className="stroke-purple-400" 
        strokeWidth="1.5"
      />
      {/* Inner dotted border */}
      <rect 
        x="6.5" 
        y="4.5" 
        width="11" 
        height="15" 
        rx="1" 
        className="stroke-purple-400/40" 
        strokeWidth="1" 
        strokeDasharray="2 1.5"
      />
      
      {/* Mystical Moon and Stars Design */}
      {/* Crescent Moon */}
      <path 
        d="M12.5 8C10.29 8 8.5 9.79 8.5 12C8.5 14.21 10.29 16 12.5 16C13.25 16 13.95 15.79 14.55 15.44C13 14.9 12 13.57 12 12C12 10.43 13 9.1 14.55 8.56C13.95 8.21 13.25 8 12.5 8Z" 
        className="fill-cyan-300 stroke-cyan-300"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      
      {/* Top Right Star */}
      <path 
        d="M15.5 10L15.7 10.7L16.4 10.9L15.7 11.1L15.5 11.8L15.3 11.1L14.6 10.9L15.3 10.7L15.5 10Z" 
        className="fill-purple-300" 
      />
      
      {/* Bottom Left Star */}
      <path 
        d="M9.5 13L9.7 13.7L10.4 13.9L9.7 14.1L9.5 14.8L9.3 14.1L8.6 13.9L9.3 13.7L9.5 13Z" 
        className="fill-purple-300" 
      />
    </svg>
  );
}
