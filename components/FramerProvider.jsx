'use client';

import { LazyMotion, domMax } from 'framer-motion';

export default function FramerProvider({ children }) {
  return (
    <LazyMotion features={domMax} strict>
      {children}
    </LazyMotion>
  );
}
