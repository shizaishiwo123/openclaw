"use client";
import { useState, useEffect, useRef } from "react";
import StarField from "@/components/StarField";
import HeartParticles from "@/components/HeartParticles";
import Cursor from "@/components/Cursor";
import Petals from "@/components/Petals";
import ClickEffect from "@/components/ClickEffect";

// ── 打字机 hook ──────────────────────────────────────────────
function useTypewriter(text: string, speed = 60, start = true) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!start) return;
    setDisplayed("");
    let i = 0;
    const id = setInterval(() => {
      setDisplayed(text.slice(0, ++i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, start]);
  return displayed;
}

// ── 数据 ─────────────────────────────────────────────────────
const REASONS = [
  { emoji: "😊", title: "你的笑容", text: "你笑起来的样子，让整个世界都变得温柔。" },
  { emoji: "💬", title: "你的声音", text: "听到你说话，我的心就会不由自主地平静下来。" },
  { emoji: "✨", title: "你的温柔", text: "你对每一件事都认真对待，那种温柔让我心疼。" },
  { emoji: "🌟", title: "你的眼神", text: "你看我的眼神，是我见过最美的风景。" },
  { emoji: "🫂", title: "你的陪伴", text: "有你在的地方，哪里都是家。" },
  { emoji: "🌸", title: "你的一切", text: "你所有的一切，都是我喜欢你的理由。" },
];

const TIMELINE = [
  { date: "第一次相遇", icon: "🌅", text: "那一天，你出现在我的视野里，从此再也移不开眼。" },
  { date: "开始在意", icon: "💭", text: "不知从何时起，总是不自觉地想起你。" },
  { date: "心动的瞬间", icon: "💗", text: "那一刻，我的心跳告诉我，你不一样。" },
  { date: "确定的喜欢", icon: "💍", text: "我想，我真的喜欢你。" },
];

const MESSAGES = [
  "温嘉璇，你知道吗，每次看到你，我都会不自觉地微笑。",
  "我希望我能成为让你感到幸福的那个人。",
  "如果可以，我想陪你走过每一个春夏秋冬。",
  "你的快乐，是我最想守护的东西。",
  "温嘉璇，我喜欢你，很认真的那种喜欢。",
];

// ── 烟花 ──────────────────────────────────────────────────────
function launchConfetti(count = 60) {
  const colors = ["#ff0055","#ff6b9d","#ffd700","#ff9cc2","#fff","#a855f7"];
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement("div");
      el.className = "confetti-piece";
      el.style.cssText = `left:${Math.random()*100}vw;top:-10px;width:${6+Math.random()*8}px;height:${6+Math.random()*8}px;background:${colors[Math.floor(Math.random()*colors.length)]};border-radius:${Math.random()>0.5?"50%":"2px"};animation-duration:${2+Math.random()*2}s;`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 4500);
    }, i * 30);
  }
}

// ── MAIN ──────────────────────────────────────────────────────
export default function Home() {
  const [section, setSection] = useState<"hero"|"reasons"|"timeline"|"letter"|"answer">("hero");
  const [flippedCard, setFlippedCard] = useState<number|null>(null);
  const [msgIndex, setMsgIndex] = useState(0);
  const [heartClicks, setHeartClicks] = useState(0);
  const [answered, setAnswered] = useState<"yes"|"no"|null>(null);
  const [noCount, setNoCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [typeStart, setTypeStart] = useState(false);
  const [progress, setProgress] = useState(0);
  const heartRef = useRef<HTMLDivElement>(null);

  const currentMsg = useTypewriter(MESSAGES[msgIndex], 55, typeStart && section === "letter");

  useEffect(() => {
    if (section === "letter") { setTypeStart(false); setTimeout(() => setTypeStart(true), 300); }
  }, [section, msgIndex]);

  // scroll progress
  useEffect(() => {
    const secs = ["hero","reasons","timeline","letter","answer"] as const;
    setProgress((secs.indexOf(section) / (secs.length - 1)) * 100);
  }, [section]);

  const handleHeartClick = () => {
    const n = heartClicks + 1;
    setHeartClicks(n);
    if (heartRef.current) {
      heartRef.current.style.transform = "scale(1.5)";
      setTimeout(() => { if(heartRef.current) heartRef.current.style.transform = ""; }, 300);
    }
    spawnHeartBurst();
    if (n >= 7) setSection("reasons");
  };

  const spawnHeartBurst = () => {
    const emojis = ["💗","💕","💖","❤️","🌹"];
    for (let i = 0; i < 12; i++) {
      setTimeout(() => {
        const el = document.createElement("div");
        el.className = "float-emoji";
        el.textContent = emojis[Math.floor(Math.random()*emojis.length)];
        el.style.cssText = `left:${40+Math.random()*20}vw;top:${30+Math.random()*20}vh;font-size:${16+Math.random()*20}px;animation-duration:${0.8+Math.random()*1}s;`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 2000);
      }, i * 60);
    }
  };

  const handleYes = () => {
    setAnswered("yes");
    setShowModal(true);
    launchConfetti(80);
  };

  const moveNoBtn = () => {
    const n = noCount + 1;
    setNoCount(n);
    if (n >= 4) { handleYes(); return; }
  };

  const sections = ["hero","reasons","timeline","letter","answer"] as const;

  return (
    <div className="relative min-h-screen text-white selection:bg-pink-500/30">
      <StarField />
      <HeartParticles />
      <Cursor />
      <Petals />
      <ClickEffect />

      {/* Progress bar */}
      <div className="fixed top-0 left-0 z-50 h-0.5 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 transition-all duration-700" style={{width:`${progress}%`}} />

      {/* Nav dots */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {sections.map((s,i) => (
          <button key={s} onClick={() => setSection(s)} className={`w-2.5 h-2.5 rounded-full border border-pink-400 transition-all duration-300 ${section===s?"bg-pink-400 scale-125":"bg-transparent hover:bg-pink-400/50"}`} />
        ))}
      </div>

      {/* ── HERO ── */}
      {section === "hero" && (
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 text-center">
          <p className="text-pink-300 tracking-[0.4em] text-sm mb-6 animate-fade-in-down" style={{animationDelay:"0.2s",opacity:0}}>
            ✨ 一封来自心底的告白 ✨
          </p>
          <h1 className="text-gradient animate-gradient-x text-5xl sm:text-7xl font-bold mb-2 animate-fade-in-down" style={{animationDelay:"0.5s",opacity:0}}>
            温 嘉 璇
          </h1>
          <p className="text-pink-200/70 text-lg tracking-widest mb-12 animate-fade-in-up" style={{animationDelay:"0.9s",opacity:0}}>
            你是我最美好的相遇
          </p>

          {/* Big heart */}
          <div ref={heartRef} className="animate-heartbeat text-[120px] sm:text-[160px] mb-6 transition-transform duration-300 select-none" style={{filter:"drop-shadow(0 0 30px #ff0055) drop-shadow(0 0 60px #ff6b9d)",cursor:"none"}} onClick={handleHeartClick}>
            💗
          </div>

          {heartClicks > 0 && (
            <p className="text-pink-300/80 text-sm mb-4 animate-fade-in-up">
              {heartClicks < 7 ? `再点 ${7-heartClicks} 次 💕` : ""}
            </p>
          )}

          <p className="text-pink-400/60 text-sm tracking-widest animate-bounce-soft mt-4">
            点击爱心开始 ↓
          </p>

          {/* Orbit rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-80 h-80 rounded-full border border-pink-500/10 animate-spin-slow" />
            <div className="absolute w-64 h-64 rounded-full border border-pink-500/10" style={{animation:"spin-slow 12s linear infinite reverse"}} />
          </div>
        </div>
      )}

      {/* ── REASONS ── */}
      {section === "reasons" && (
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
          <h2 className="text-gradient animate-gradient-x text-4xl font-bold mb-2 text-center animate-fade-in-down">
            我喜欢你的理由
          </h2>
          <p className="text-pink-300/60 text-sm tracking-widest mb-12 text-center">点击卡片查看</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl w-full">
            {REASONS.map((r, i) => (
              <div key={i} className="relative h-36 cursor-none" style={{perspective:"800px"}} onClick={() => setFlippedCard(flippedCard===i?null:i)}>
                <div className="relative w-full h-full transition-transform duration-500" style={{transformStyle:"preserve-3d",transform:flippedCard===i?"rotateY(180deg)":"rotateY(0)"}}>
                  {/* Front */}
                  <div className="absolute inset-0 glass rounded-2xl flex flex-col items-center justify-center gap-2 glow-pink" style={{backfaceVisibility:"hidden"}}>
                    <span className="text-4xl">{r.emoji}</span>
                    <span className="text-pink-200 text-sm font-medium">{r.title}</span>
                  </div>
                  {/* Back */}
                  <div className="absolute inset-0 rounded-2xl flex items-center justify-center p-3 text-center text-pink-100 text-xs leading-relaxed" style={{backfaceVisibility:"hidden",transform:"rotateY(180deg)",background:"linear-gradient(135deg,rgba(255,0,85,.2),rgba(255,107,157,.2))",border:"1px solid rgba(255,107,157,.3)"}}>
                    {r.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 mt-12">
            <button className="btn-ghost px-6 py-2.5 text-sm" onClick={() => setSection("hero")}>← 返回</button>
            <button className="btn-love px-6 py-2.5 text-sm" onClick={() => setSection("timeline")}>下一页 →</button>
          </div>
        </div>
      )}

      {/* ── TIMELINE ── */}
      {section === "timeline" && (
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
          <h2 className="text-gradient animate-gradient-x text-4xl font-bold mb-2 text-center animate-fade-in-down">
            我们的故事
          </h2>
          <p className="text-pink-300/60 text-sm tracking-widest mb-14 text-center">每一个瞬间都珍贵</p>

          <div className="relative max-w-lg w-full">
            {/* Line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-pink-500/0 via-pink-500/60 to-pink-500/0" />
            <div className="flex flex-col gap-8">
              {TIMELINE.map((t, i) => (
                <div key={i} className="flex gap-6 items-start animate-fade-in-up" style={{animationDelay:`${i*0.15}s`,opacity:0}}>
                  <div className="relative flex-shrink-0 w-12 h-12 rounded-full glass flex items-center justify-center text-xl glow-pink z-10">
                    {t.icon}
                    <div className="absolute inset-0 rounded-full border border-pink-400/30 animate-pulse" />
                  </div>
                  <div className="glass rounded-2xl p-4 flex-1">
                    <p className="text-pink-400 text-xs tracking-widest mb-1">{t.date}</p>
                    <p className="text-pink-100 text-sm leading-relaxed">{t.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mt-12">
            <button className="btn-ghost px-6 py-2.5 text-sm" onClick={() => setSection("reasons")}>← 返回</button>
            <button className="btn-love px-6 py-2.5 text-sm" onClick={() => setSection("letter")}>下一页 →</button>
          </div>
        </div>
      )}

      {/* ── LETTER ── */}
      {section === "letter" && (
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
          <h2 className="text-gradient animate-gradient-x text-4xl font-bold mb-2 text-center">
            写给你的话
          </h2>
          <p className="text-pink-300/60 text-sm tracking-widest mb-10 text-center">每一句都是真心</p>

          <div className="glass-strong rounded-3xl p-8 max-w-lg w-full glow-pink min-h-[180px] flex flex-col justify-between">
            <p className="text-pink-100 text-base leading-relaxed min-h-[100px]">
              {currentMsg}
              <span className="animate-pulse text-pink-400">|</span>
            </p>
            <div className="flex justify-between items-center mt-6">
              <div className="flex gap-1.5">
                {MESSAGES.map((_, i) => (
                  <button key={i} onClick={() => { setMsgIndex(i); setTypeStart(false); setTimeout(() => setTypeStart(true), 100); }}
                    className={`w-2 h-2 rounded-full transition-all ${msgIndex===i?"bg-pink-400 scale-125":"bg-pink-400/30"}`} />
                ))}
              </div>
              <button className="btn-ghost text-xs px-4 py-2" onClick={() => { const n=(msgIndex+1)%MESSAGES.length; setMsgIndex(n); setTypeStart(false); setTimeout(()=>setTypeStart(true),100); }}>
                下一句 →
              </button>
            </div>
          </div>

          {/* Mini music visualizer decoration */}
          <div className="flex gap-1 mt-8 items-end h-8">
            {Array.from({length:12}).map((_,i)=>(
              <div key={i} className="w-1.5 bg-gradient-to-t from-pink-600 to-pink-300 rounded-full" style={{height:`${30+Math.sin(i*0.8)*50}%`,animation:`bounce-soft ${0.8+i*0.1}s ease-in-out infinite`,animationDelay:`${i*0.08}s`}} />
            ))}
          </div>
          <p className="text-pink-400/40 text-xs mt-2 tracking-widest">♪ 心跳的声音 ♪</p>

          <div className="flex gap-4 mt-10">
            <button className="btn-ghost px-6 py-2.5 text-sm" onClick={() => setSection("timeline")}>← 返回</button>
            <button className="btn-love px-8 py-2.5 text-sm" onClick={() => setSection("answer")}>表白时刻 💗</button>
          </div>
        </div>
      )}

      {/* ── ANSWER ── */}
      {section === "answer" && (
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 text-center">
          <div className="text-8xl animate-heartbeat mb-6" style={{filter:"drop-shadow(0 0 30px #ff0055)"}}>💗</div>
          <h2 className="text-gradient animate-gradient-x text-4xl sm:text-5xl font-bold mb-4">
            温嘉璇，我喜欢你
          </h2>
          <p className="text-pink-200/80 text-lg mb-12 max-w-sm leading-relaxed">
            愿意给我一个机会，让我好好喜欢你吗？
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <button className="btn-love px-10 py-4 text-lg font-medium" onClick={handleYes}>
              💕 愿意！
            </button>
            <div className="relative">
              <button
                className="btn-ghost px-8 py-4 text-base transition-all duration-200"
                onClick={moveNoBtn}
                style={{
                  transform: noCount > 0 ? `translate(${(Math.random()-0.5)*200}px,${(Math.random()-0.5)*150}px)` : "",
                  transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)"
                }}
              >
                {noCount === 0 ? "再想想..." : noCount === 1 ? "抓不到我 😄" : noCount === 2 ? "别追啦 😆" : "好啦好啦 💕"}
              </button>
            </div>
          </div>

          <button className="btn-ghost mt-8 px-6 py-2 text-sm opacity-50 hover:opacity-100" onClick={() => setSection("letter")}>← 返回</button>
        </div>
      )}

      {/* ── MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{background:"rgba(0,0,0,0.75)"}}>
          <div className="glass-strong rounded-3xl p-10 text-center max-w-sm w-[90%] animate-pop-in glow-pink">
            <div className="text-6xl mb-4">🎉💕🌹</div>
            <h3 className="text-shimmer animate-shimmer text-2xl font-bold mb-4">太好啦！</h3>
            <p className="text-pink-100 leading-relaxed mb-6 text-sm">
              我的心都要飞起来了！<br/>
              从今以后，让我来守护你的每一天。<br/>
              温嘉璇，你是我最幸运的遇见 💗
            </p>
            <div className="flex gap-1 justify-center mb-6">
              {["💗","💕","💖","❤️","🌹","✨","💗","💕","💖"].map((e,i)=>(
                <span key={i} className="text-lg animate-bounce-soft" style={{animationDelay:`${i*0.1}s`}}>{e}</span>
              ))}
            </div>
            <button className="btn-love w-full py-3 text-base font-medium" onClick={() => { setShowModal(false); launchConfetti(40); }}>
              💕 开始我们的故事
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
