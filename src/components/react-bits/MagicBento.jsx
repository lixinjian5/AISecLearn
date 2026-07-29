import { useRef, useEffect, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import './MagicBento.css';

const DEFAULT_GLOW_COLOR = '99, 102, 241';
const MOBILE_BREAKPOINT = 768;

const createParticleElement = (x, y, color = DEFAULT_GLOW_COLOR) => {
  const el = document.createElement('div');
  el.style.cssText = `
    position: absolute; width: 4px; height: 4px; border-radius: 50%;
    background: rgba(${color}, 1); box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none; z-index: 100; left: ${x}px; top: ${y}px;
  `;
  return el;
};

function ParticleCard({
  children, className = '', disableAnimations = false, style,
  particleCount = 12, glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true, clickEffect = true, enableMagnetism = true,
}) {
  const cardRef = useRef(null);
  const particlesRef = useRef([]);
  const timeoutsRef = useRef([]);
  const isHoveredRef = useRef(false);
  const particlesInitRef = useRef(false);
  const magRef = useRef(null);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magRef.current?.kill();
    particlesRef.current.forEach(p => {
      gsap.to(p, { scale: 0, opacity: 0, duration: 0.3, ease: 'back.in(1.7)', onComplete: () => p.remove() });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;
    if (!particlesInitRef.current) {
      particlesInitRef.current = true;
      const { width, height } = cardRef.current.getBoundingClientRect();
      for (let i = 0; i < particleCount; i++) {
        const timeoutId = setTimeout(() => {
          if (!isHoveredRef.current || !cardRef.current) return;
          const clone = createParticleElement(Math.random() * width, Math.random() * height, glowColor);
          cardRef.current.appendChild(clone);
          particlesRef.current.push(clone);
          gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });
          gsap.to(clone, { x: (Math.random() - 0.5) * 80, y: (Math.random() - 0.5) * 80, rotation: Math.random() * 360, duration: 2 + Math.random() * 2, ease: 'none', repeat: -1, yoyo: true });
          gsap.to(clone, { opacity: 0.3, duration: 1.5, ease: 'power2.inOut', repeat: -1, yoyo: true });
        }, i * 80);
        timeoutsRef.current.push(timeoutId);
      }
    }
  }, [particleCount, glowColor]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;
    const el = cardRef.current;

    const enter = () => { isHoveredRef.current = true; animateParticles(); };
    const leave = () => { isHoveredRef.current = false; particlesInitRef.current = false; clearAllParticles(); };
    const move = (e) => {
      if (!enableTilt && !enableMagnetism) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const cx = rect.width / 2, cy = rect.height / 2;
      if (enableTilt) gsap.to(el, { rotateX: ((y - cy) / cy) * -8, rotateY: ((x - cx) / cx) * 8, duration: 0.1, ease: 'power2.out', transformPerspective: 1000 });
      if (enableMagnetism) magRef.current = gsap.to(el, { x: (x - cx) * 0.04, y: (y - cy) * 0.04, duration: 0.3, ease: 'power2.out' });
    };
    const click = (e) => {
      if (!clickEffect) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const max = Math.max(Math.hypot(x, y), Math.hypot(x - rect.width, y), Math.hypot(x, y - rect.height), Math.hypot(x - rect.width, y - rect.height));
      const ripple = document.createElement('div');
      ripple.style.cssText = `position:absolute;width:${max*2}px;height:${max*2}px;border-radius:50%;background:radial-gradient(circle,rgba(${glowColor},0.4) 0%,rgba(${glowColor},0.2) 30%,transparent 70%);left:${x-max}px;top:${y-max}px;pointer-events:none;z-index:1000;`;
      el.appendChild(ripple);
      gsap.fromTo(ripple, { scale: 0, opacity: 1 }, { scale: 1, opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => ripple.remove() });
    };

    el.addEventListener('mouseenter', enter);
    el.addEventListener('mouseleave', leave);
    el.addEventListener('mousemove', move);
    el.addEventListener('click', click);
    return () => {
      isHoveredRef.current = false;
      el.removeEventListener('mouseenter', enter);
      el.removeEventListener('mouseleave', leave);
      el.removeEventListener('mousemove', move);
      el.removeEventListener('click', click);
      clearAllParticles();
    };
  }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor]);

  return <div ref={cardRef} className={`${className} particle-container`} style={{ ...style, position: 'relative', overflow: 'hidden' }}>{children}</div>;
}

function GlobalSpotlight({ gridRef, disableAnimations, enabled, spotlightRadius = 400, glowColor = DEFAULT_GLOW_COLOR }) {
  const spotlightRef = useRef(null);

  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;
    const spotlight = document.createElement('div');
    spotlight.style.cssText = `position:fixed;width:800px;height:800px;border-radius:50%;pointer-events:none;background:radial-gradient(circle,rgba(${glowColor},0.12) 0%,rgba(${glowColor},0.06) 15%,rgba(${glowColor},0.03) 30%,rgba(${glowColor},0.01) 50%,transparent 70%);z-index:200;opacity:0;transform:translate(-50%,-50%);mix-blend-mode:screen;`;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const calc = (r) => ({ proximity: r * 0.5, fadeDistance: r * 0.75 });
    const { proximity, fadeDistance } = calc(spotlightRadius);

    const move = (e) => {
      if (!spotlightRef.current || !gridRef.current) return;
      const cards = gridRef.current.querySelectorAll('.magic-bento-card');
      const section = gridRef.current;
      const sRect = section.getBoundingClientRect();
      const inside = e.clientX >= sRect.left && e.clientX <= sRect.right && e.clientY >= sRect.top && e.clientY <= sRect.bottom;

      if (!inside) {
        gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3 });
        cards.forEach(c => c.style.setProperty('--glow-intensity', '0'));
        return;
      }

      cards.forEach(card => {
        const r = card.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy) - Math.max(r.width, r.height) / 2;
        const ed = Math.max(0, dist);
        let g = 0;
        if (ed <= proximity) g = 1;
        else if (ed <= fadeDistance) g = (fadeDistance - ed) / (fadeDistance - proximity);
        card.style.setProperty('--glow-x', `${((e.clientX - r.left) / r.width) * 100}%`);
        card.style.setProperty('--glow-y', `${((e.clientY - r.top) / r.height) * 100}%`);
        card.style.setProperty('--glow-intensity', g.toString());
      });

      gsap.to(spotlightRef.current, { left: e.clientX, top: e.clientY, duration: 0.2, opacity: 0.7 });
    };

    const leave = () => {
      gridRef.current?.querySelectorAll('.magic-bento-card').forEach(c => c.style.setProperty('--glow-intensity', '0'));
      if (spotlightRef.current) gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3 });
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseleave', leave);
    return () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', leave);
      spotlightRef.current?.remove();
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
}

function useMobile() {
  const [is, setIs] = useState(false);
  useEffect(() => {
    const check = () => setIs(window.innerWidth <= MOBILE_BREAKPOINT);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return is;
}

export default function MagicBento({
  items = [],
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  enableTilt = true,
  enableMagnetism = true,
  clickEffect = true,
  spotlightRadius = 400,
  particleCount = 10,
  glowColor = DEFAULT_GLOW_COLOR,
  disableAnimations = false,
  renderCard,
}) {
  const gridRef = useRef(null);
  const isMobile = useMobile();
  const disabled = disableAnimations || isMobile;

  return (
    <>
      {enableSpotlight && <GlobalSpotlight gridRef={gridRef} disableAnimations={disabled} enabled={enableSpotlight} spotlightRadius={spotlightRadius} glowColor={glowColor} />}
      <div className="card-grid bento-section" ref={gridRef}>
        {items.map((item, i) => {
          const cls = `magic-bento-card ${enableBorderGlow ? 'magic-bento-card--border-glow' : ''}`;
          const style = { '--glow-color': glowColor, backgroundColor: item.bg || '#111827' };

          const content = renderCard ? renderCard(item, i) : (
            <>
              <div>
                <p style={{ fontSize: 14, color: '#9ca3af', marginBottom: 4 }}>{item.label}</p>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 6 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.4 }}>{item.desc}</p>
              </div>
            </>
          );

          if (enableStars) {
            return (
              <ParticleCard key={i} className={cls} style={style} disableAnimations={disabled} particleCount={particleCount} glowColor={glowColor} enableTilt={enableTilt} clickEffect={clickEffect} enableMagnetism={enableMagnetism}>
                {content}
              </ParticleCard>
            );
          }

          return <div key={i} className={cls} style={style}>{content}</div>;
        })}
      </div>
    </>
  );
}
