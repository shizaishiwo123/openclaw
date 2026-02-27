"use client";
import { useEffect, useRef } from "react";

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.6 + 0.2,
      alpha: Math.random(),
      speed: (Math.random() - 0.5) * 0.015,
      twinkle: Math.random() * Math.PI * 2,
    }));

    // Shooting stars
    const shooters: { x: number; y: number; len: number; speed: number; alpha: number; active: boolean }[] = [];
    const spawnShooter = () => {
      shooters.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height * 0.5, len: 120 + Math.random() * 80, speed: 8 + Math.random() * 6, alpha: 1, active: true });
    };
    const shootInterval = setInterval(spawnShooter, 3000);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Stars
      stars.forEach(s => {
        s.twinkle += s.speed;
        const a = (Math.sin(s.twinkle) + 1) / 2;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        const hue = Math.random() > 0.9 ? 340 : 0;
        ctx.fillStyle = `hsla(${hue},80%,95%,${a * 0.9})`;
        ctx.fill();
      });

      // Shooting stars
      shooters.forEach((sh, i) => {
        if (!sh.active) return;
        ctx.save();
        ctx.translate(sh.x, sh.y);
        ctx.rotate(Math.PI / 4);
        const grad = ctx.createLinearGradient(0, 0, sh.len, 0);
        grad.addColorStop(0, `rgba(255,200,220,0)`);
        grad.addColorStop(1, `rgba(255,200,220,${sh.alpha})`);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(sh.len, 0);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
        sh.x += sh.speed;
        sh.y += sh.speed;
        sh.alpha -= 0.02;
        if (sh.alpha <= 0) shooters.splice(i, 1);
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(shootInterval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
}
