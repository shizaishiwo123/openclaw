"use client";
import { useState } from "react";
export default function App() {
  const [message, setMessage] = useState("Hello, 温嘉璇！");

  return (
    <div style={{ textAlign: 'center', padding: '50px', color: '#333' }}>
      <h1>{message}</h1>
      <button className="btn" onClick={() => setMessage("💗 愿意和我一起吗？")}>表白 💕</button>
    </div>
  );
}
