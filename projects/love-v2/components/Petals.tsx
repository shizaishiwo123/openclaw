"use client";
import { useEffect } from "react";

const PETALS = ["🌸","🌹","🌺","💮","🌷","🪷"];

export default function Petals() {
  useEffect(() => {
    const spawn = () => {
      const el = document.createElement("div");
      el.className = "petal";
      el.textContent = PETALS[Math.floor(Math.random() * PETALS.length)];
      el.style.left = Math.random() * 100 + "vw";
      el.style.top = "-40px";
      el.style.fontSize = (14 + Math.random() * 14) + "px";
      el.style.animationDuration = (5 + Math.random() * 7) + "s";
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 13000);
    };
    const id = setInterval(spawn, 700);
    return () => clearInterval(id);
  }, []);
  return null;
}
