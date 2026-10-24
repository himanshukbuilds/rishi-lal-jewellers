'use client';

import { useEffect, useRef } from 'react';

/** Lightweight animated silk surfaces, isolated from the carousel controls and copy. */
export default function BridalRibbons() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { alpha: true });
    if (!context) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let time = 0;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      draw();
    };

    const drawRibbon = (config, phase) => {
      const { y, amplitude, thickness, speed, color } = config;
      const points = [];
      const steps = Math.max(28, Math.round(width / 12));
      for (let index = 0; index <= steps; index += 1) {
        const x = (index / steps) * (width + 80) - 40;
        const wave = Math.sin(index / steps * Math.PI * 2.1 + phase) * amplitude;
        const fineWave = Math.sin(index / steps * Math.PI * 5.2 - phase * 0.65) * amplitude * 0.22;
        points.push({ x, y: y + wave + fineWave });
      }

      context.beginPath();
      points.forEach((point, index) => {
        if (index === 0) context.moveTo(point.x, point.y);
        else {
          const previous = points[index - 1];
          const midX = (previous.x + point.x) / 2;
          const midY = (previous.y + point.y) / 2;
          context.quadraticCurveTo(previous.x, previous.y, midX, midY);
        }
      });
      context.lineTo(width + 80, points[points.length - 1].y + thickness);
      for (let index = points.length - 1; index >= 0; index -= 1) {
        const point = points[index];
        const sheen = Math.sin(index / steps * Math.PI * 2.1 + phase + 0.55) * amplitude;
        context.lineTo(point.x, point.y + thickness + sheen * 0.42);
      }
      context.closePath();

      const gradient = context.createLinearGradient(0, y - amplitude, 0, y + thickness + amplitude);
      gradient.addColorStop(0, color[0]);
      gradient.addColorStop(0.34, color[1]);
      gradient.addColorStop(0.48, color[2]);
      gradient.addColorStop(0.58, color[1]);
      gradient.addColorStop(1, color[3]);
      context.fillStyle = gradient;
      context.shadowColor = 'rgba(214, 179, 106, 0.28)';
      context.shadowBlur = 16;
      context.fill();
      context.shadowBlur = 0;

      // Narrow moving champagne reflection follows the curved surface.
      context.save();
      context.globalCompositeOperation = 'screen';
      context.globalAlpha = 0.36;
      context.beginPath();
      points.forEach((point, index) => {
        const shine = Math.sin(index / steps * Math.PI * 2.1 + phase + 0.55) * amplitude;
        const py = point.y + thickness * 0.28 + shine * 0.15;
        if (index === 0) context.moveTo(point.x, py);
        else context.lineTo(point.x, py);
      });
      const sweep = ((time * speed * 0.08) % (width + 300)) - 150;
      const reflection = context.createLinearGradient(sweep - 110, 0, sweep + 110, 0);
      reflection.addColorStop(0, 'rgba(255, 235, 177, 0)');
      reflection.addColorStop(0.5, 'rgba(255, 226, 160, 0.88)');
      reflection.addColorStop(1, 'rgba(255, 235, 177, 0)');
      context.strokeStyle = reflection;
      context.lineWidth = Math.max(2, thickness * 0.08);
      context.filter = 'blur(5px)';
      context.stroke();
      context.restore();
    };

    function draw() {
      if (!width || !height) return;
      context.clearRect(0, 0, width, height);
      const ribbons = [
        { y: height * 0.18, amplitude: height * 0.085, thickness: height * 0.15, speed: 0.75, color: ['rgba(53,5,13,.14)', 'rgba(101,11,25,.4)', 'rgba(151,35,48,.46)', 'rgba(53,5,13,.22)'] },
        { y: height * 0.52, amplitude: height * 0.075, thickness: height * 0.18, speed: 0.52, color: ['rgba(53,5,13,.08)', 'rgba(101,11,25,.35)', 'rgba(126,20,36,.46)', 'rgba(53,5,13,.16)'] },
        { y: height * 0.79, amplitude: height * 0.06, thickness: height * 0.13, speed: 0.64, color: ['rgba(53,5,13,.04)', 'rgba(101,11,25,.28)', 'rgba(137,28,41,.38)', 'rgba(53,5,13,.12)'] },
      ];
      ribbons.forEach((ribbon, index) => drawRibbon(ribbon, time * ribbon.speed + index * 2.15));
      if (!reducedMotion) {
        time += 0.012;
        frame = window.requestAnimationFrame(draw);
      }
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });
    if (!reducedMotion) frame = window.requestAnimationFrame(draw);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 z-[5] h-full w-full pointer-events-none" />;
}
