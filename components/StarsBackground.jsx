'use client';

import React, { useState, useEffect, useMemo } from 'react';

export default function StarsBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stars = useMemo(() => {
    if (!mounted) return null;

    return Array.from({ length: 12 }, (_, i) => {
      const width = Math.random() * 2 + 0.5;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const duration = Math.random() * 8 + 12;
      const delay = Math.random() * -20;
      const moveX = (Math.random() - 0.5) * 20;

      return (
        <div
          key={i}
          className="star-particle"
          style={{
            width,
            height: width,
            left: `${left}%`,
            top: `${top}%`,
            '--dur': `${duration}s`,
            '--delay': `${delay}s`,
            '--move-x': `${moveX}px`,
          }}
        />
      );
    });
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0B0F19] to-[#0B0F19]"></div>
      {stars}
    </div>
  );
}
