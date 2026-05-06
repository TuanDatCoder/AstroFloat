'use client';

import React, { useMemo } from 'react';

const STAR_DATA = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  width: Math.random() * 2 + 0.5,
  left: Math.random() * 100,
  top: Math.random() * 100,
  duration: Math.random() * 8 + 12,
  delay: Math.random() * -20,
  moveX: (Math.random() - 0.5) * 20,
}));

export default function StarsBackground() {
  const stars = useMemo(() =>
    STAR_DATA.map((s) => (
      <div
        key={s.id}
        className="star-particle"
        style={{
          width: s.width,
          height: s.width,
          left: `${s.left}%`,
          top: `${s.top}%`,
          '--dur': `${s.duration}s`,
          '--delay': `${s.delay}s`,
          '--move-x': `${s.moveX}px`,
        }}
      />
    )),
  []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0B0F19] to-[#0B0F19]"></div>
      {stars}
    </div>
  );
}
