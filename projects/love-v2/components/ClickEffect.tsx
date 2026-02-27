"use client";
import { useEffect } from "react";

const EMOJIS = ["💗","💕","💖","❤️","✨","🌸","💫","⭐","🌟"];

export default function ClickEffect() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const count = 5 + Math.floor(Math.random() * 4);
      for (let i = 0; i < count; i++) {
        const el = document.createElement("div");
        el.className = "float-emoji";
        el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
        el.style.left = (e.clientX + (Math.random() - 0.5) * 60) + "px";
        el.style.top = e.clientY + "px";
        el.style.fontSize = (12 + Math.random() * 16) + "px";
        el.style.animationDuration = (0.8 + Math.random() * 0.8) + "s";
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1800);
      }
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);
  return null;
}
