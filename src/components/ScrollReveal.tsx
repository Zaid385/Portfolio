import React, { useEffect, useRef, useState } from 'react';
import './ScrollReveal.css';

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: 'fade-up' | 'fade-in' | 'scale-up' | 'sketch-draw';
  delay?: number;
  threshold?: number;
  className?: string;
}

export function ScrollReveal({ 
  children, 
  animation = 'fade-up', 
  delay = 0, 
  threshold = 0.1,
  className = ''
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        // In our case we only want it to animate in once
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          // Optional: observer.unobserve(domRef.current!) to only animate once
          observer.unobserve(domRef.current!);
        }
      },
      { threshold }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  return (
    <div
      ref={domRef}
      className={`scroll-reveal scroll-reveal--${animation} ${isVisible ? 'scroll-reveal--visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
