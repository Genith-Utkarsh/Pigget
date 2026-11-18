'use client';

import React, { useEffect, useRef } from 'react';

export const AmbientBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Dynamic glowing orbs matching Superbridge blue/indigo/purple palette
    const orbs = [
      {
        x: width * 0.65,
        y: height * 0.35,
        r: 380,
        vx: 0.15,
        vy: 0.12,
        color: 'rgba(59, 130, 246, 0.18)', // Electric blue
      },
      {
        x: width * 0.3,
        y: height * 0.6,
        r: 440,
        vx: -0.12,
        vy: -0.08,
        color: 'rgba(67, 56, 202, 0.14)', // Indigo
      },
      {
        x: width * 0.5,
        y: height * 0.2,
        r: 320,
        vx: 0.08,
        vy: -0.14,
        color: 'rgba(99, 102, 241, 0.12)', // Soft Violet
      },
    ];

    let t = 0;
    const render = () => {
      t += 0.005;
      ctx.fillStyle = '#111117';
      ctx.fillRect(0, 0, width, height);

      // Render glowing soft orbs
      orbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        // Soft bounce within boundaries
        if (orb.x < -100 || orb.x > width + 100) orb.vx *= -1;
        if (orb.y < -100 || orb.y > height + 100) orb.vy *= -1;

        const dynamicR = orb.r + Math.sin(t) * 40;
        const gradient = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          dynamicR
        );
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(0.5, orb.color.replace(')', ', 0.05)').replace('rgba', 'rgba'));
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, dynamicR, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      style={{ opacity: 1 }}
      aria-hidden="true"
    >
      <div className="shader w-screen h-screen">
        <canvas
          ref={canvasRef}
          data-renderer="shaders"
          className="w-full h-full block"
        />
      </div>
      {/* Subtle organic noise/specular texture overlay */}
      <div className="sb-rollie-background fixed inset-0 z-[1] transition-all bg-[radial-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />
    </div>
  );
};
