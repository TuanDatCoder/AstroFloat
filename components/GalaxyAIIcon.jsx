import React from 'react';

const GalaxyAIIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path d="M10 4 Q 10 13 19 13 Q 10 13 10 22 Q 10 13 1 13 Q 10 13 10 4 Z" />
    <path d="M19 1 Q 19 5 23 5 Q 19 5 19 9 Q 19 5 15 5 Q 19 5 19 1 Z" />
    <path d="M13 1 Q 13 3 15 3 Q 13 3 13 5 Q 13 3 11 3 Q 13 3 13 1 Z" />
  </svg>
);

export default GalaxyAIIcon;
