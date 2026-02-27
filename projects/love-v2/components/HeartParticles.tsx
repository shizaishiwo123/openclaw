"use client";
import { useEffect, useRef } from "react";

export default function HeartParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let animId: number;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    class Particle {
      x = 0; y = 0; vx = 0; vy = 0; alpha = 0; r = 0; life = 0; age = 0; hue = 0;
      constructor() { this.reset(); }
      reset() {
        const t = Math.random() * Math.PI * 2;
        const scale = 10 + Math.random() * 5;
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2 - 20;
        this.x = cx + scale * 16 * Math.pow(Math.sin(t), 3);
        this.y = cy - scale * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5 - 0.5;
        this.alpha = Math.random() * 0.9 + 0.1;
        this.r = Math.random() * 2.5 + 0.8;
        this.life = Math.random() * 100 + 80;
        this.age = 0;
        this.hue = Math.random() * 50 + 320;
      }
      update() { this.x += this.vx * 0.4; this.y += this.vy * 0.4; this.age++; this.alpha = (1 - this.age / this.life) * 0.85; if (this.age > this.life) this.reset(); }
      draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI*2); ctx.fillStyle = `hsla(${this.hue},100%,70%,${this.alpha})`; ctx.fill(); }
    }

    const particles = Array.from({ length: 200 }, () => new Particle());

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-1 pointer-events-none" style={{zIndex:1}} />;
}
