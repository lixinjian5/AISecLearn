import { useState, useCallback } from 'react';

// 粒子爆发颜色
const BURST_COLORS = ['#6366f1', '#06b6d4', '#8b5cf6', '#a78bfa', '#22d3ee'];

export default function ClickBurst({ children, className = '' }) {
  const [bursts, setBursts] = useState([]);

  const handleClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    const newBursts = Array.from({ length: 10 }, (_, i) => ({
      id: `${id}-${i}`,
      x,
      y,
      angle: (Math.PI * 2 * i) / 10 + (Math.random() - 0.5) * 0.5,
      distance: 30 + Math.random() * 40,
      size: 3 + Math.random() * 4,
      color: BURST_COLORS[Math.floor(Math.random() * BURST_COLORS.length)],
      duration: 500 + Math.random() * 300,
    }));

    setBursts((prev) => [...prev, ...newBursts]);

    // 自动清理
    setTimeout(() => {
      setBursts((prev) => prev.filter((b) => !newBursts.find((nb) => nb.id === b.id)));
    }, 900);
  }, []);

  return (
    <div className={`relative ${className}`} onClick={handleClick}>
      {children}
      {bursts.map((b) => (
        <span
          key={b.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: b.x,
            top: b.y,
            width: b.size,
            height: b.size,
            background: b.color,
            boxShadow: `0 0 ${b.size * 2}px ${b.color}`,
            animation: `burst-fly ${b.duration}ms ease-out forwards`,
            '--tx': `${Math.cos(b.angle) * b.distance}px`,
            '--ty': `${Math.sin(b.angle) * b.distance}px`,
          }}
        />
      ))}
    </div>
  );
}

// 注入全局动画
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes burst-fly {
      0% { transform: translate(0, 0) scale(1); opacity: 1; }
      100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}
