'use client';

import React, { useEffect, useRef } from 'react';

export const AmbientBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    resizeCanvas();

    const handleResize = () => {
      if (!canvas) return;
      resizeCanvas();
      if (prefersReducedMotion.matches) drawStaticFrame();
    };

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
        y: height * 0.15,
        r: 300,
        vx: -0.06,
        vy: 0.05,
        color: 'rgba(56, 189, 248, 0.12)', // Luminous Cyan / Top glow
      },
      {
        x: width * 0.5,
        y: height * 0.28,
        r: 340,
        vx: 0.08,
        vy: -0.12,
        color: 'rgba(99, 102, 241, 0.13)', // Soft Violet
      },
    ];

    let lastFrameTime = 0;
    let elapsed = 0;
    let isRunning = false;
    const render = (time: number) => {
      if (!isRunning) return;
      const delta = lastFrameTime ? Math.min(time - lastFrameTime, 50) : 0;
      lastFrameTime = time;
      elapsed += delta / 1000;
      const frameScale = delta / 16.67;
      ctx.clearRect(0, 0, width, height);

      // Render glowing soft orbs
      orbs.forEach((orb) => {
        orb.x += orb.vx * frameScale;
        orb.y += orb.vy * frameScale;

        // Soft bounce within boundaries
        if (orb.x < -100 || orb.x > width + 100) orb.vx *= -1;
        if (orb.y < -100 || orb.y > height + 100) orb.vy *= -1;

        const dynamicR = orb.r + Math.sin(elapsed * 0.3) * 40;
        const gradient = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          dynamicR
        );
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(0.5, orb.color.replace(/,\s*[\d.]+\)$/, ', 0.06)'));
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, dynamicR, 0, Math.PI * 2);
        ctx.fill();
      });

      if (!prefersReducedMotion.matches) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const drawStaticFrame = () => {
      isRunning = true;
      render(performance.now());
      isRunning = false;
    };
    const start = () => {
      if (isRunning || document.hidden) return;
      if (prefersReducedMotion.matches) {
        drawStaticFrame();
        return;
      }
      isRunning = true;
      lastFrameTime = 0;
      animationFrameId = requestAnimationFrame(render);
    };
    const stop = () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
    };
    const handleVisibilityChange = () => {
      if (document.hidden) stop();
      else start();
    };
    const handleMotionPreferenceChange = () => {
      stop();
      if (!prefersReducedMotion.matches) start();
      else drawStaticFrame();
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    prefersReducedMotion.addEventListener('change', handleMotionPreferenceChange);
    if (prefersReducedMotion.matches) handleMotionPreferenceChange();
    else start();

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      prefersReducedMotion.removeEventListener('change', handleMotionPreferenceChange);
      stop();
    };
  }, []);

  return (
    <>
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
      </div>
      <div
        className="sb-rollie-background fixed inset-0 z-[1] pointer-events-none transition-all"
        aria-hidden="true"
      />
    </>
  );
};
