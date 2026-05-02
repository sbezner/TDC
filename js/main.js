/* TDC tribute — interactivity */

(() => {
  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));

  /* ---------- Animated number counters in hero stat banner ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const formatNum = (n) => {
    if (n >= 1000) return n.toLocaleString('en-US') + (n === 100000 ? '+' : '');
    return String(n);
  };
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count, 10);
      const dur = 1400;
      const start = performance.now();
      const ease = (t) => 1 - Math.pow(1 - t, 3);
      const tick = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const v = Math.round(target * ease(t));
        el.textContent = formatNum(v) + (target === 100000 && t === 1 ? '' : '');
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = (target === 100000) ? '100,000+' : target.toLocaleString('en-US');
      };
      requestAnimationFrame(tick);
      countIO.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(c => countIO.observe(c));

  /* ---------- Mobile nav toggle ---------- */
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
  }

  /* ---------- Bar chart fills ---------- */
  const bars = document.querySelectorAll('.bar-row');
  const barIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const w = parseFloat(e.target.dataset.w || '0');
      e.target.style.setProperty('--w', w);
      e.target.classList.add('in');
      barIO.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  bars.forEach(b => barIO.observe(b));

  /* ---------- Units page interactivity ---------- */
  const dots = document.querySelectorAll('#tx-map .unit-dot');
  const units = document.querySelectorAll('.unit[data-unit]');

  const setActive = (key) => {
    dots.forEach(d => d.classList.toggle('active', d.dataset.unit === key));
    units.forEach(u => u.classList.toggle('active', u.dataset.unit === key));
    const target = document.querySelector(`.unit[data-unit="${key}"]`);
    if (target) {
      const rect = target.getBoundingClientRect();
      const inView = rect.top > 80 && rect.bottom < window.innerHeight - 40;
      if (!inView) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  dots.forEach(d => {
    d.addEventListener('click', () => setActive(d.dataset.unit));
    d.addEventListener('mouseenter', () => setActive(d.dataset.unit));
  });
  units.forEach(u => {
    u.addEventListener('click', () => setActive(u.dataset.unit));
    u.addEventListener('mouseenter', () => setActive(u.dataset.unit));
  });

  /* ---------- Smooth nav active state across pages ---------- */
  // already handled with .active class in the HTML; nothing to compute.

  /* ---------- Subtle parallax on hero medallion ---------- */
  const medallion = document.querySelector('.medallion svg');
  if (medallion && window.matchMedia('(min-width: 900px)').matches) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      medallion.style.transform = `translate3d(${x * -10}px, ${y * -10}px, 0) rotate(${x * 1.4}deg)`;
    });
  }
})();
