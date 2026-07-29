import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';

function useMedia(queries, values, defaultValue) {
  const get = () => {
    if (typeof window === 'undefined') return defaultValue;
    return values[queries.findIndex(q => window.matchMedia(q).matches)] ?? defaultValue;
  };
  const [value, setValue] = useState(get);
  useEffect(() => {
    const handler = () => setValue(get);
    queries.forEach(q => window.matchMedia(q).addEventListener('change', handler));
    return () => queries.forEach(q => window.matchMedia(q).removeEventListener('change', handler));
  }, []);
  return value;
}

function useMeasure() {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0 });
  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width }));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, size];
}

export default function Masonry({
  children,
  gap = 16,
  stagger = 0.04,
  blurToFocus = true,
}) {
  if (!Array.isArray(children)) children = [children];
  children = children.filter(Boolean);

  const columns = useMedia(
    ['(min-width:1400px)', '(min-width:1000px)', '(min-width:640px)'],
    [4, 3, 2],
    1
  );

  const [containerRef, { width }] = useMeasure();
  const childRefs = useRef([]);
  const [ready, setReady] = useState(false);
  const gridRef = useRef([]);

  // 计算网格布局
  const grid = useMemo(() => {
    if (!width || columns <= 1) return children.map((_, i) => ({ i, x: 0, y: i * 300, w: width, h: 200 }));
    const colHeights = new Array(columns).fill(0);
    const totalGaps = (columns - 1) * gap;
    const colW = (width - totalGaps) / columns;

    return children.map((_, i) => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = col * (colW + gap);
      const el = childRefs.current[i];
      const h = el ? el.getBoundingClientRect().height : 200;
      const y = colHeights[col];
      colHeights[col] += h + gap;
      return { i, x, y, w: colW, h };
    });
  }, [children, columns, width, gap]);

  // 测量后定位 + 动画
  useLayoutEffect(() => {
    if (grid.length === 0 || !containerRef.current) return;

    // 先静默定位所有卡片（不触发动画）
    let maxY = 0;
    grid.forEach((item) => {
      const el = childRefs.current[item.i];
      if (!el) return;
      el.style.position = 'absolute';
      el.style.left = `${item.x}px`;
      el.style.top = `${item.y}px`;
      el.style.width = `${item.w}px`;
      el.style.opacity = '0';
      el.style.filter = blurToFocus ? 'blur(8px)' : 'none';
      if (item.y + item.h > maxY) maxY = item.y + item.h;
    });

    containerRef.current.style.height = `${maxY + 16}px`;

    // 然后统一播放入场动画
    if (!ready) {
      setReady(true);
      gridRef.current = grid;
      requestAnimationFrame(() => {
        grid.forEach((item, index) => {
          const el = childRefs.current[item.i];
          if (!el) return;
          gsap.to(el, {
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.6,
            delay: index * stagger,
            ease: 'power2.out',
          });
        });
      });
    } else if (JSON.stringify(gridRef.current.map(g => ({ x: g.x, y: g.y, w: g.w }))) !==
               JSON.stringify(grid.map(g => ({ x: g.x, y: g.y, w: g.w })))) {
      // 窗口大小改变时平滑过渡到新位置
      gridRef.current = grid;
      grid.forEach((item) => {
        const el = childRefs.current[item.i];
        if (!el) return;
        gsap.to(el, {
          left: item.x,
          top: item.y,
          width: item.w,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      });
    }
  }, [grid, ready, stagger, blurToFocus]);

  return (
    <div ref={containerRef} className="relative w-full">
      {children.map((child, i) => (
        <div key={i} ref={el => { childRefs.current[i] = el; }}>
          {child}
        </div>
      ))}
    </div>
  );
}
