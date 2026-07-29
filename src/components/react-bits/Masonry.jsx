import { useEffect, useLayoutEffect, useMemo, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';

function useMedia(queries, values, defaultValue) {
  const get = () => {
    if (typeof window === 'undefined') return defaultValue;
    return values[queries.findIndex(q => matchMedia(q).matches)] ?? defaultValue;
  };
  const [value, setValue] = useState(get);
  useEffect(() => {
    const handler = () => setValue(get);
    queries.forEach(q => matchMedia(q).addEventListener('change', handler));
    return () => queries.forEach(q => matchMedia(q).removeEventListener('change', handler));
  }, [queries]);
  return value;
}

function useMeasure() {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, size];
}

export default function Masonry({
  children,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = false,
  hoverScale = 0.97,
  blurToFocus = true,
  gap = 16,
}) {
  if (!Array.isArray(children)) children = [children];
  children = children.filter(Boolean);

  const columns = useMedia(
    ['(min-width:1500px)', '(min-width:1000px)', '(min-width:600px)', '(min-width:400px)'],
    [4, 3, 2, 1],
    1
  );

  const [containerRef, { width }] = useMeasure();
  const childRefs = useRef([]);
  const [heights, setHeights] = useState([]);
  const hasMounted = useRef(false);

  // 测量每个子元素的高度
  useEffect(() => {
    const timer = setTimeout(() => {
      const h = childRefs.current.map(el => el?.getBoundingClientRect?.()?.height || 200);
      setHeights(h);
    }, 100);
    return () => clearTimeout(timer);
  }, [children, width, columns]);

  const grid = useMemo(() => {
    if (!width || heights.length === 0) return [];
    const colHeights = new Array(columns).fill(0);
    const totalGaps = (columns - 1) * gap;
    const columnWidth = (width - totalGaps) / columns;

    return children.map((_, i) => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = col * (columnWidth + gap);
      const h = heights[i] || 200;
      const y = colHeights[col];
      colHeights[col] += h + gap;
      return { i, x, y, w: columnWidth, h };
    });
  }, [columns, children, width, heights, gap]);

  useLayoutEffect(() => {
    if (grid.length === 0) return;

    grid.forEach((item) => {
      const el = childRefs.current[item.i];
      if (!el) return;
      const id = `masonry-${item.i}`;
      el.setAttribute('data-key', id);
      const animProps = { x: item.x, y: item.y, width: item.w };

      if (!hasMounted.current) {
        let startY = item.y + 100;
        if (animateFrom === 'top') startY = -200;
        if (animateFrom === 'bottom') startY = window.innerHeight + 200;
        if (animateFrom === 'left') { el.style.opacity = '0'; el.style.transform = 'translateX(-200px)'; }
        if (animateFrom === 'right') { el.style.opacity = '0'; el.style.transform = 'translateX(200px)'; }

        gsap.fromTo(el, {
          opacity: 0,
          y: startY,
          filter: blurToFocus ? 'blur(8px)' : 'none',
        }, {
          opacity: 1,
          ...animProps,
          filter: 'blur(0px)',
          duration: 0.8,
          ease: 'power3.out',
          delay: item.i * stagger,
        });
      } else {
        gsap.to(el, { ...animProps, duration, ease, overwrite: 'auto' });
      }
    });

    hasMounted.current = true;
  }, [grid, stagger, animateFrom, blurToFocus, duration, ease]);

  const handleMouseEnter = useCallback((el) => {
    if (scaleOnHover) gsap.to(el, { scale: hoverScale, duration: 0.3, ease: 'power2.out' });
  }, [scaleOnHover, hoverScale]);

  const handleMouseLeave = useCallback((el) => {
    if (scaleOnHover) gsap.to(el, { scale: 1, duration: 0.3, ease: 'power2.out' });
  }, [scaleOnHover]);

  return (
    <div ref={containerRef} className="relative w-full" style={{ minHeight: '200px' }}>
      {children.map((child, i) => (
        <div
          key={i}
          ref={el => { childRefs.current[i] = el; }}
          className="absolute box-content"
          style={{ width: grid[i]?.w || '100%', willChange: 'transform, opacity' }}
          onMouseEnter={e => handleMouseEnter(e.currentTarget)}
          onMouseLeave={e => handleMouseLeave(e.currentTarget)}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
