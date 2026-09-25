'use client';

import { useRef, useState, MouseEvent, useEffect } from 'react';

interface MagicCardProps {
  children: React.ReactNode;
  className?: string;
  gradientColor?: string;
}

export default function MagicCard({
  children,
  className = '',
  gradientColor = '#4ade80',
}: MagicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile devices
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024 || 'ontouchstart' in window);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isMobile) return;

    // Use requestAnimationFrame for smoother performance
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setMousePosition({ x, y });

      // Calculate 3D tilt effect with reduced intensity
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateXValue = ((y - centerY) / centerY) * -5; // Reduced from -10
      const rotateYValue = ((x - centerX) / centerX) * 5;  // Reduced from 10

      setRotateX(rotateXValue);
      setRotateY(rotateYValue);
    });
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotateX(0);
    setRotateY(0);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden transition-all duration-300 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovering && !isMobile
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
        willChange: isHovering && !isMobile ? 'transform' : 'auto',
      }}
    >
      {/* Spotlight gradient following cursor - Desktop only */}
      {isHovering && !isMobile && (
        <div
          className="pointer-events-none absolute inset-0 opacity-50 transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, ${gradientColor}40, transparent 40%)`,
          }}
        />
      )}

      {/* Border glow effect - Desktop only */}
      {isHovering && !isMobile && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            boxShadow: `0 0 20px ${gradientColor}80`,
          }}
        />
      )}

      {children}
    </div>
  );
}
