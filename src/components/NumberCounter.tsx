import React, { useEffect, useState } from 'react';

export const NumberCounter = ({ value, className, suffix = '' }: { value: number | string, className?: string, suffix?: string }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const target = typeof value === 'string' ? parseFloat(value) : value;

  useEffect(() => {
    if (isNaN(target)) return;
    
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayValue(target);
      return;
    }
    let start = 0;
    const end = target;
    if (start === end) {
      setDisplayValue(end);
      return;
    }
    
    const duration = 600;
    let startTime = null;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      // ease-out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      setDisplayValue(Math.floor(easeProgress * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(end);
      }
    };
    
    requestAnimationFrame(animate);
  }, [target]);

  if (isNaN(target)) return <span className={className}>{value}{suffix}</span>;
  return <span className={className}>{displayValue}{suffix}</span>;
};
