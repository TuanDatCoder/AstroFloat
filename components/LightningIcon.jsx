import React from 'react';

export default function LightningIcon({ className = "w-3.5 h-3.5", size }) {
  const customSize = size ? { width: size, height: size } : {};
  const uid = Math.random().toString(36).slice(2, 8); // tránh conflict id khi nhiều icon cùng page

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none pointer-events-none`}
      style={{ ...customSize, display: 'inline-block', verticalAlign: 'middle', filter: 'drop-shadow(0 0 5px rgba(167,139,250,0.8)) drop-shadow(0 0 2px rgba(236,72,153,0.5))' }}
    >
      <defs>
        {/* Gradient chính: xanh lam → tím violet → hồng */}
        <linearGradient id={`lg-${uid}`} x1="0%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%"   stopColor="#818cf8" />
          <stop offset="45%"  stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>

        {/* Overlay sáng bóng ở cạnh trên trái */}
        <linearGradient id={`shine-${uid}`} x1="0%" y1="0%" x2="60%" y2="80%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* Clip path */}
        <clipPath id={`clip-${uid}`}>
          <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
        </clipPath>

        {/* Hoa văn tinh tú nhỏ, dày vừa phải */}
        <pattern id={`stars-${uid}`} x="0" y="0" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
          {/* Điểm sao nhỏ */}
          <circle cx="1.5" cy="1.5" r="0.7"  fill="#e0e7ff" opacity="0.95" />
          <circle cx="5"   cy="4.5" r="0.5"  fill="#fce7f3" opacity="0.85" />
          <circle cx="3"   cy="6"   r="0.4"  fill="#c7d2fe" opacity="0.8"  />
          {/* Vạch mảnh giống vân Milky Way */}
          <path d="M0 7L7 0" stroke="#ddd6fe" strokeWidth="0.25" opacity="0.35" />
        </pattern>
      </defs>

      {/* Thân tia sét – lớp nền */}
      <path
        d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
        fill={`url(#lg-${uid})`}
        stroke="#c084fc"
        strokeWidth="1"
        strokeLinejoin="round"
      />

      {/* Hoa văn sao phủ lên trong clip */}
      <rect x="0" y="0" width="24" height="24" fill={`url(#stars-${uid})`} clipPath={`url(#clip-${uid})`} />

      {/* Shine highlight phía trên trái */}
      <path
        d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
        fill={`url(#shine-${uid})`}
        clipPath={`url(#clip-${uid})`}
      />

      {/* Đường sáng giữa thân – tạo cảm giác điện năng */}
      <g clipPath={`url(#clip-${uid})`}>
        <path d="M12 4L8 12H12.5L12 20" stroke="white" strokeWidth="0.9" strokeLinecap="round" opacity="0.7" />
        {/* Lõi điện trắng sáng */}
        <circle cx="12" cy="12" r="1.5" fill="white" opacity="0.95" />
        <circle cx="12" cy="12" r="0.7" fill="white" opacity="1" />
      </g>
    </svg>
  );
}
