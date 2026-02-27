"use client";
import { useState } from "react";

export default function LoveRedesign() {
  const [isHeartClicked, setHeartClicked] = useState(false);

  return (
    <div>
      <h1 className="aesthetic-title" style={{ color: 'var(--primary)' }}>
        温 嘉 璇，我有一件重要的事想和你说 💕
      </h1>
      <div style={{ textAlign: 'center' }}>
        <button
          className="btn-simple"
          style={{ background: 'var(--primary)', color: 'white', padding: '15px', borderRadius: '30px', cursor: 'pointer', margin: '20px' }}
          onClick={() => setHeartClicked(!isHeartClicked)}
        >
          {isHeartClicked ? '💖 对不起！再点一下' : '💗 点击看惊喜'}
        </button>

        {isHeartClicked && <p style={{ fontSize: '20px', color: 'var(--secondary)' }}>每一次相遇，都是奇迹。</p>}
      </div>
    </div>
  );
}
