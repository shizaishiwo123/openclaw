"use client";
import { useState, useEffect, useRef } from "react";

// ── 星空画布 ──
function StarCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    const stars = Array.from({length:180}, () => ({
      x: Math.random()*window.innerWidth, y: Math.random()*window.innerHeight,
      r: Math.random()*1.4+0.3, phase: Math.random()*Math.PI*2
    }));
    let t = 0, id: number;
    const draw = () => {
      ctx.clearRect(0,0,c.width,c.height); t += 0.01;
      stars.forEach(s => {
        const a = (Math.sin(s.phase + t) + 1) / 2 * 0.85 + 0.1;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,220,235,${a})`; ctx.fill();
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="fixed inset-0 z-0 pointer-events-none" />;
}

// ── 自定义光标 ──
function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dot.current) { dot.current.style.left = e.clientX+"px"; dot.current.style.top = e.clientY+"px"; }
    };
    window.addEventListener("mousemove", onMove);
    let id: number;
    const cur = { x: 0, y: 0 };
    const tick = () => {
      cur.x += (pos.current.x - cur.x) * 0.15;
      cur.y += (pos.current.y - cur.y) * 0.15;
      if (ring.current) { ring.current.style.left = cur.x+"px"; ring.current.style.top = cur.y+"px"; }
      id = requestAnimationFrame(tick);
    };
    tick();
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(id); };
  }, []);
  return (<><div ref={dot} className="cursor-dot" /><div ref={ring} className="cursor-ring" /></>);
}

// ── 花瓣 ──
function Petals() {
  useEffect(() => {
    const items = ["🌸","🌹","🌺","🌷","💮"];
    const id = setInterval(() => {
      const el = document.createElement("div");
      el.className = "petal";
      el.textContent = items[Math.floor(Math.random()*items.length)];
      el.style.left = Math.random()*100+"vw";
      el.style.fontSize = (14+Math.random()*10)+"px";
      el.style.animationDuration = (5+Math.random()*6)+"s";
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 12000);
    }, 800);
    return () => clearInterval(id);
  }, []);
  return null;
}

// ── 点击飘心 ──
function ClickEffect() {
  useEffect(() => {
    const emojis = ["💗","💕","💖","✨","🌸"];
    const handler = (e: MouseEvent) => {
      for (let i = 0; i < 5; i++) {
        const el = document.createElement("div");
        el.className = "float-emoji";
        el.textContent = emojis[Math.floor(Math.random()*emojis.length)];
        el.style.left = (e.clientX+(Math.random()-.5)*40)+"px";
        el.style.top = e.clientY+"px";
        el.style.fontSize = (12+Math.random()*14)+"px";
        el.style.animationDuration = (0.8+Math.random()*0.7)+"s";
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1500);
      }
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);
  return null;
}

// ── 喜欢你的理由 ──
const REASONS = [
  { emoji:"😊", label:"你的笑容", desc:"你笑起来的样子，让整个世界都温柔了。" },
  { emoji:"💬", label:"你的声音", desc:"听到你说话，我的心就会平静下来。" },
  { emoji:"✨", label:"你的温柔", desc:"你对每一件事都认真，那份温柔让我心疼。" },
  { emoji:"🌟", label:"你的眼神", desc:"你看我的眼神，是我见过最美的风景。" },
  { emoji:"🫂", label:"你的陪伴", desc:"有你在的地方，哪里都像家。" },
  { emoji:"🌹", label:"你的一切", desc:"你所有的一切，都是我喜欢你的理由。" },
];

// ── 纸屑爆炸 ──
function launchConfetti() {
  const colors = ["#ff0055","#ff6b9d","#ffd700","#ff9cc2","#ffffff","#c084fc"];
  for (let i = 0; i < 70; i++) {
    setTimeout(() => {
      const el = document.createElement("div");
      el.className = "petal";
      el.textContent = ["💗","💕","💖","🌸","✨","⭐"][Math.floor(Math.random()*6)];
      el.style.left = Math.random()*100+"vw";
      el.style.fontSize = (12+Math.random()*16)+"px";
      el.style.animationDuration = (2+Math.random()*2)+"s";
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 5000);
    }, i * 40);
  }
}

export default function Home() {
  const [page, setPage] = useState(0); // 0=hero, 1=reasons, 2=confess
  const [flipped, setFlipped] = useState<number|null>(null);
  const [noCount, setNoCount] = useState(0);
  const [done, setDone] = useState(false);

  const handleYes = () => { setDone(true); launchConfetti(); };
  const handleNo = () => {
    const n = noCount + 1;
    setNoCount(n);
    if (n >= 3) handleYes();
  };

  return (
    <div className="relative min-h-screen text-white">
      <StarCanvas />
      <CustomCursor />
      <Petals />
      <ClickEffect />

      {/* ── 第一页：开场 ── */}
      {page === 0 && (
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <p className="text-pink-300 text-sm tracking-[0.5em] mb-6 opacity-80">✨ 有些话，我想亲口告诉你 ✨</p>

          <h1 className="text-6xl sm:text-8xl font-bold mb-4" style={{
            background:"linear-gradient(135deg,#ffb3d1,#ff6b9d,#ffd700)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            textShadow:"none", filter:"drop-shadow(0 0 20px rgba(255,107,157,0.5))"
          }}>
            温嘉璇
          </h1>

          <p className="text-white/70 text-xl mb-14 tracking-wider">你是我最美好的遇见 💕</p>

          <div className="text-[130px] sm:text-[160px] animate-heartbeat mb-10 select-none"
            style={{filter:"drop-shadow(0 0 25px #ff0055) drop-shadow(0 0 50px rgba(255,107,157,0.5))"}}>
            💗
          </div>

          <button className="btn-main text-lg px-12 py-4" onClick={() => setPage(1)}>
            点击开始 →
          </button>

          <p className="text-white/30 text-xs mt-6 tracking-widest">为你准备了一封特别的信</p>
        </div>
      )}

      {/* ── 第二页：喜欢你的理由 ── */}
      {page === 1 && (
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-16">
          <p className="text-pink-300 text-sm tracking-[0.4em] mb-3">💗 写给温嘉璇</p>
          <h2 className="text-white text-3xl sm:text-4xl font-bold mb-2 text-center">
            我喜欢你的理由
          </h2>
          <p className="text-white/50 text-sm mb-10 text-center">点击卡片查看内容</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-xl w-full mb-10">
            {REASONS.map((r, i) => (
              <div key={i}
                className="card p-5 flex flex-col items-center gap-2 text-center cursor-none transition-all duration-300"
                style={{ minHeight:"130px", justifyContent:"center" }}
                onClick={() => setFlipped(flipped === i ? null : i)}>
                <span className="text-4xl">{r.emoji}</span>
                {flipped === i ? (
                  <p className="text-white text-xs leading-relaxed animate-fade-up">{r.desc}</p>
                ) : (
                  <p className="text-pink-200 text-sm font-medium">{r.label}</p>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button className="btn-outline" onClick={() => setPage(0)}>← 返回</button>
            <button className="btn-main" onClick={() => setPage(2)}>下一步 →</button>
          </div>
        </div>
      )}

      {/* ── 第三页：表白 ── */}
      {page === 2 && !done && (
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <div className="text-7xl animate-float mb-8 select-none"
            style={{filter:"drop-shadow(0 0 20px #ff0055)"}}>
            💗
          </div>

          <h2 className="text-white text-3xl sm:text-4xl font-bold mb-6">
            温嘉璇，我喜欢你
          </h2>

          {/* 信件内容 */}
          <div className="card p-7 max-w-md w-full mb-10 animate-glow">
            <p className="text-white/90 text-base leading-8 mb-4">
              遇见你之后，<br/>
              平凡的日子都变得闪闪发光。
            </p>
            <p className="text-white/90 text-base leading-8 mb-4">
              每次想起你，心跳都会快一拍，<br/>
              那是我藏不住的喜欢。
            </p>
            <p className="text-pink-200 text-lg font-medium italic mt-2">
              「愿意让我好好喜欢你吗？」
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <button className="btn-main text-lg px-12 py-4" onClick={handleYes}>
              💕 愿意！
            </button>
            <button
              className="btn-outline"
              onClick={handleNo}
              style={{
                transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                transform: noCount > 0 ? `translate(${(Math.random()-.5)*180}px,${(Math.random()-.5)*100}px)` : ""
              }}>
              {noCount === 0 ? "再想想..." : noCount === 1 ? "抓不到我 😄" : "好啦好啦 💕"}
            </button>
          </div>

          <button className="text-white/30 text-sm mt-8 hover:text-white/50 transition-colors" onClick={() => setPage(1)}>
            ← 返回
          </button>
        </div>
      )}

      {/* ── 答应了！ ── */}
      {done && (
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <div className="text-8xl mb-8 animate-heartbeat"
            style={{filter:"drop-shadow(0 0 30px #ff0055)"}}>
            🎉
          </div>
          <h2 className="text-white text-4xl font-bold mb-4">太好啦！</h2>
          <div className="card p-8 max-w-sm w-full animate-glow">
            <p className="text-white text-base leading-8 mb-4">
              我的心都飞起来了！<br/>
              从今以后，让我来守护你的每一天。
            </p>
            <p className="text-pink-200 text-lg italic">
              温嘉璇，你是我最幸运的遇见 💗
            </p>
          </div>
          <div className="flex gap-2 mt-8 flex-wrap justify-center">
            {["💗","💕","💖","❤️","🌹","✨","🌸","💫","⭐"].map((e,i) => (
              <span key={i} className="text-2xl animate-float" style={{animationDelay:`${i*0.15}s`}}>{e}</span>
            ))}
          </div>
          <button className="btn-main mt-8" onClick={() => { setDone(false); setPage(0); setNoCount(0); }}>
            再看一遍 💕
          </button>
        </div>
      )}
    </div>
  );
}
