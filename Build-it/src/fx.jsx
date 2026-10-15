import React, { useEffect, useRef, useState } from "react";

/* Scroll-reveal wrapper: fades/slides/blurs children in on intersection.
   Props: delay (ms), y (px), className */
export function Reveal({ children, delay = 0, y = 28, className = "" }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`rv ${vis ? "on" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ["--ry"]: `${y}px` }}
    >
      {children}
    </div>
  );
}

/* Animated number that counts up when scrolled into view. */
export function CountUp({ to, suffix = "", duration = 1400 }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t) => {
          const p = Math.min(1, (t - t0) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setN(Math.round(to * eased));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration]);
  return (
    <span ref={ref}>
      {n.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

/* 3D tilt-on-hover card wrapper (desktop pointers only). */
export function Tilt({ children, className = "", max = 9 }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg) translateY(-4px)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return (
    <div ref={ref} className={`tilt ${className}`} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </div>
  );
}

/* Magnetic hover: element gravitates slightly toward the cursor. */
export function Magnetic({ children, className = "" }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${(x * 0.12).toFixed(1)}px, ${(y * 0.18).toFixed(1)}px)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return (
    <span ref={ref} className={`mag ${className}`} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </span>
  );
}

/* Infinite marquee strip. */
export function Marquee({ items }) {
  const row = [...items, ...items];
  return (
    <div className="mq" aria-hidden="true">
      <div className="mq-track">
        {row.map((t, i) => (
          <span key={i} className="mq-item">
            <i className="fa-solid fa-leaf" /> {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* Animated solarpunk canvas: rising sun glow, drifting spores,
   circuit-vines that grow across the hero. Respects reduced motion. */
export function SolarCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    let w, h, raf;
    const spores = Array.from({ length: 70 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 1 + Math.random() * 2.6,
      s: 0.0004 + Math.random() * 0.0012,
      o: 0.15 + Math.random() * 0.5,
      ph: Math.random() * Math.PI * 2,
    }));
    // vine circuits: polylines that grow + pulse
    const vines = Array.from({ length: 5 }, (_, v) => {
      const pts = [];
      let x = -0.05, y = 0.25 + v * 0.13 + Math.random() * 0.05;
      for (let i = 0; i < 9; i++) {
        pts.push([x, y]);
        x += 0.12 + Math.random() * 0.06;
        y += (Math.random() - 0.5) * 0.12;
      }
      return { pts, prog: 0, speed: 0.0016 + Math.random() * 0.0012 };
    });
    const size = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    window.addEventListener("resize", size);
    let t = 0;
    const draw = () => {
      t += 1;
      ctx.clearRect(0, 0, w, h);
      // sun glow
      const sx = w * 0.78, sy = h * 0.32;
      const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, Math.max(w, h) * 0.45);
      g.addColorStop(0, "rgba(255,106,77,0.5)");
      g.addColorStop(0.35, "rgba(194,58,36,0.18)");
      g.addColorStop(1, "rgba(194,58,36,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      // sun disc with slow pulse
      const pr = 46 + Math.sin(t * 0.012) * 5;
      ctx.beginPath();
      ctx.arc(sx, sy, pr, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,106,77,0.85)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(sx, sy, pr + 14, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,106,77,0.35)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // vines
      vines.forEach((v) => {
        v.prog = Math.min(1, v.prog + v.speed);
        ctx.beginPath();
        const n = Math.max(2, Math.floor(v.pts.length * v.prog));
        v.pts.slice(0, n).forEach(([px, py], i) => {
          const X = px * w, Y = py * h + Math.sin(t * 0.01 + i) * 4;
          i === 0 ? ctx.moveTo(X, Y) : ctx.lineTo(X, Y);
        });
        ctx.strokeStyle = "rgba(194,58,36,0.5)";
        ctx.lineWidth = 1.6;
        ctx.stroke();
        // node dots
        v.pts.slice(0, n).forEach(([px, py]) => {
          ctx.beginPath();
          ctx.arc(px * w, py * h, 2.6, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,106,77,0.8)";
          ctx.fill();
        });
      });
      // spores drift upward
      spores.forEach((s) => {
        s.y -= s.s;
        if (s.y < -0.02) {
          s.y = 1.02;
          s.x = Math.random();
        }
        const tw = 0.6 + 0.4 * Math.sin(t * 0.03 + s.ph);
        ctx.beginPath();
        ctx.arc(s.x * w + Math.sin(t * 0.008 + s.ph) * 12, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,106,77,${(s.o * tw).toFixed(3)})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
    };
  }, []);
  return <canvas ref={ref} className="solar-cv" aria-hidden="true" />;
}

/* Top scroll-progress bar. */
export function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    const bar = ref.current;
    if (!bar) return;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div ref={ref} className="progress" />;
}
