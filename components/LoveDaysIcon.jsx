import React from 'react';

export default function LoveDaysIcon({ className = "w-6 h-6", ...props }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className} 
      {...props}
    >
      {/* Calendar Base Card */}
      <rect 
        x="12" 
        y="24" 
        width="76" 
        height="68" 
        rx="16" 
        fill="#fef0f3" 
        stroke="#321e25" 
        strokeWidth="4.5" 
      />

      {/* Clip path for header to follow card's rounded top corners */}
      <clipPath id="headerClip">
        <rect x="12" y="24" width="76" height="68" rx="16" />
      </clipPath>

      {/* Header Area */}
      <rect 
        x="12" 
        y="24" 
        width="76" 
        height="24" 
        fill="#f99bb1" 
        clipPath="url(#headerClip)" 
      />
      
      {/* Header separator line */}
      <line 
        x1="12" 
        y1="48" 
        x2="88" 
        y2="48" 
        stroke="#321e25" 
        strokeWidth="4.5" 
      />

      {/* Specular highlight / shine on top-left of header */}
      <path 
        d="M 19 38 A 8 8 0 0 1 27 30" 
        stroke="#ffffff" 
        strokeWidth="3" 
        strokeLinecap="round" 
        fill="none" 
        opacity="0.9" 
      />
      <circle cx="19" cy="44" r="1.5" fill="#ffffff" opacity="0.9" />

      {/* Small heart on top-right of header */}
      <g transform="translate(75, 36) rotate(15) scale(0.75)">
        <path 
          d="M 0 -4 C -2 -7, -6 -6, -6 -2 C -6 2, -2 5, 0 8 C 2 5, 6 2, 6 -2 C 6 -6, 2 -7, 0 -4" 
          fill="#cfbdc8" 
          stroke="#321e25" 
          strokeWidth="3.5" 
          strokeLinejoin="round" 
        />
      </g>

      {/* Holes for the binder rings */}
      <rect x="25" y="28" width="8" height="6" rx="3" fill="#e57b95" stroke="#321e25" strokeWidth="3.5" />
      <rect x="46" y="28" width="8" height="6" rx="3" fill="#e57b95" stroke="#321e25" strokeWidth="3.5" />
      <rect x="67" y="28" width="8" height="6" rx="3" fill="#e57b95" stroke="#321e25" strokeWidth="3.5" />

      {/* Binder rings capsules */}
      <g id="rings">
        {/* Ring 1 */}
        <g transform="translate(24, 12)">
          <rect x="0" y="0" width="10" height="22" rx="5" fill="#f4d0d8" stroke="#321e25" strokeWidth="3.5" />
          <rect x="3" y="4" width="4" height="14" rx="2" fill="#321e25" />
          <path d="M 3.5 6 V 14" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
        </g>
        {/* Ring 2 */}
        <g transform="translate(45, 12)">
          <rect x="0" y="0" width="10" height="22" rx="5" fill="#f4d0d8" stroke="#321e25" strokeWidth="3.5" />
          <rect x="3" y="4" width="4" height="14" rx="2" fill="#321e25" />
          <path d="M 3.5 6 V 14" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
        </g>
        {/* Ring 3 */}
        <g transform="translate(66, 12)">
          <rect x="0" y="0" width="10" height="22" rx="5" fill="#f4d0d8" stroke="#321e25" strokeWidth="3.5" />
          <rect x="3" y="4" width="4" height="14" rx="2" fill="#321e25" />
          <path d="M 3.5 6 V 14" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </g>

      {/* Inner graphic (Infinity Hearts) */}
      <g id="infinity-hearts">
        {/* Outer Ribbon Shape */}
        <path 
          d="M 50 70 
             C 43 58, 32 54, 26 60 
             C 20 66, 24 76, 30 80 
             C 38 86, 46 78, 50 70 
             C 54 78, 62 86, 70 80 
             C 76 76, 80 66, 74 60 
             C 68 54, 57 58, 50 70 Z" 
          fill="#ffa4b9" 
          stroke="#321e25" 
          strokeWidth="4.5" 
          strokeLinejoin="round" 
        />

        {/* Left Inner Heart Cutout */}
        <path 
          d="M 44 70 
             C 41 64, 34 62, 31 66 
             C 29 68, 31 70, 34 70 
             C 31 70, 29 72, 31 74 
             C 34 78, 41 76, 44 70 Z" 
          fill="#fef0f3" 
          stroke="#321e25" 
          strokeWidth="4.5" 
          strokeLinejoin="round" 
        />

        {/* Right Inner Heart Cutout */}
        <path 
          d="M 56 70 
             C 59 64, 66 62, 69 66 
             C 71 68, 69 70, 66 70 
             C 69 70, 71 72, 69 74 
             C 66 78, 59 76, 56 70 Z" 
          fill="#fef0f3" 
          stroke="#321e25" 
          strokeWidth="4.5" 
          strokeLinejoin="round" 
        />
      </g>

      {/* Decorative Rays above the Infinity Hearts */}
      <g stroke="#f99bb1" strokeWidth="3" strokeLinecap="round">
        <line x1="50" y1="52" x2="50" y2="48" />
        <line x1="45" y1="53" x2="42" y2="50" />
        <line x1="55" y1="53" x2="58" y2="50" />
      </g>
    </svg>
  );
}
