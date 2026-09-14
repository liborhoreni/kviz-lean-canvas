const COLORS = ['#640ABA', '#2F6FD9', '#FED977', '#D6336C', '#B6DEFF'];

export function burstConfetti(canvas, { count = 160 } = {}) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const w = window.innerWidth;
  const h = window.innerHeight;
  const particles = Array.from({ length: count }).map(() => ({
    x: Math.random() * w,
    y: -20 - Math.random() * h * 0.4,
    r: 4 + Math.random() * 5,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    vx: -2.5 + Math.random() * 5,
    vy: 2 + Math.random() * 3,
    rot: Math.random() * 360,
    vr: -8 + Math.random() * 16,
    shape: Math.random() < 0.5 ? 'rect' : 'circle',
  }));

  let frame = 0;
  const maxFrames = 160;
  let raf;

  function tick() {
    frame++;
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      if (p.shape === 'rect') {
        ctx.fillRect(-p.r, -p.r * 0.6, p.r * 2, p.r * 1.2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    if (frame < maxFrames) {
      raf = requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, w, h);
    }
  }
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}
