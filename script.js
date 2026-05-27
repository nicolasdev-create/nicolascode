/* ============================================================
   NICOLASZ.DEV — PORTFOLIO JS v2
   ============================================================ */

// ── Loading Screen ──────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const loading = document.getElementById('loading');
    if (loading) loading.classList.add('done');
    // Trigger hero reveal after loading
    setTimeout(() => {
      document.querySelectorAll('#hero .reveal-up, #hero .reveal-right').forEach((el, i) => {
        setTimeout(() => el.classList.add('in-view'), i * 130);
      });
    }, 400);
  }, 2000);
});

// ── Custom Cursor ────────────────────────────────────────────
const cursor       = document.getElementById('cursor');
const cursorFollow = document.getElementById('cursor-follower');
const mouseGlow    = document.getElementById('mouse-glow');
let mouseX = 0, mouseY = 0;
let followX = 0, followY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursor) { cursor.style.left = mouseX + 'px'; cursor.style.top = mouseY + 'px'; }
  if (mouseGlow) { mouseGlow.style.left = mouseX + 'px'; mouseGlow.style.top = mouseY + 'px'; }
});

(function animateFollower() {
  followX += (mouseX - followX) * 0.1;
  followY += (mouseY - followY) * 0.1;
  if (cursorFollow) {
    cursorFollow.style.left = followX + 'px';
    cursorFollow.style.top  = followY + 'px';
  }
  requestAnimationFrame(animateFollower);
})();

// Hover states
document.querySelectorAll('a, button, .project-card, .contato-item, .tech-icon, .cta-wpp, .cta-ig, .email-card, .social-pill').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// ── Navbar scroll ────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Mobile Menu ──────────────────────────────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
let menuOpen = false;

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    const spans = hamburger.querySelectorAll('span');
    if (menuOpen) {
      spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
}
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    if (mobileMenu) mobileMenu.classList.remove('open');
    if (hamburger) hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ── Particles Canvas ─────────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x     = Math.random() * W;
      this.y     = Math.random() * H;
      this.r     = Math.random() * 1.4 + 0.3;
      this.vx    = (Math.random() - 0.5) * 0.28;
      this.vy    = (Math.random() - 0.5) * 0.28;
      this.alpha = Math.random() * 0.45 + 0.1;
      this.pulse = Math.random() * Math.PI * 2;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.pulse += 0.018;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      const a = this.alpha * (0.7 + 0.3 * Math.sin(this.pulse));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(77,138,255,${a})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 110; i++) particles.push(new Particle());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 95) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(37,99,255,${0.055 * (1 - d / 95)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  }
  animate();
})();

// ── Reveal Animations (IntersectionObserver) ─────────────────
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const observer  = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = Number(entry.target.dataset.delay || 0);
      setTimeout(() => entry.target.classList.add('in-view'), delay);
    }
  });
}, { threshold: 0.13 });
revealEls.forEach(el => observer.observe(el));

// ── Animated Counters ────────────────────────────────────────
function animateCounter(el, target, duration = 2200) {
  let start;
  const step = ts => {
    if (!start) start = ts;
    const prog = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - prog, 3);
    el.textContent = Math.floor(ease * target);
    if (prog < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}
const statsObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(el => {
        animateCounter(el, parseInt(el.dataset.target), 2200);
      });
      statsObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObs.observe(heroStats);

// ── Skill Bars ───────────────────────────────────────────────
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach((bar, i) => {
        setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, i * 160);
      });
      skillObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
const skillsGrid = document.querySelector('.skills-grid');
if (skillsGrid) skillObs.observe(skillsGrid);

// ── 3D Tilt on project cards ─────────────────────────────────
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r   = card.getBoundingClientRect();
    const x   = e.clientX - r.left, y = e.clientY - r.top;
    const rx  = ((y - r.height / 2) / r.height) * -6;
    const ry  = ((x - r.width  / 2) / r.width ) *  6;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// ── Copy Email Button ────────────────────────────────────────
const copyBtn = document.getElementById('copy-email');
if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    const email = document.getElementById('email-addr')?.textContent?.trim();
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      const def  = copyBtn.querySelector('.copy-default');
      const done = copyBtn.querySelector('.copy-done');
      def.style.display  = 'none';
      done.style.display = 'inline-flex';
      copyBtn.classList.add('copied');
      setTimeout(() => {
        def.style.display  = 'inline-flex';
        done.style.display = 'none';
        copyBtn.classList.remove('copied');
      }, 2500);
    } catch (err) {
      // Fallback: select text
      const el = document.getElementById('email-addr');
      if (el) {
        const range = document.createRange();
        range.selectNode(el);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
      }
    }
  });
}

// ── Smooth Scroll ────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ── Parallax on hero glows ────────────────────────────────────
const heroGlowTop    = document.querySelector('.hero-glow-top');
const heroGlowBottom = document.querySelector('.hero-glow-bottom');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (heroGlowTop)    heroGlowTop.style.transform    = `translateY(${y * 0.15}px)`;
  if (heroGlowBottom) heroGlowBottom.style.transform = `translateY(${-y * 0.1}px)`;
}, { passive: true });

// ── Active nav link ───────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 220) current = s.id; });
  navLinks.forEach(a => {
    const isActive = a.getAttribute('href') === '#' + current;
    a.classList.toggle('active', isActive);
  });
}, { passive: true });

// ── Hover glow on CTA buttons ─────────────────────────────────
document.querySelectorAll('.cta-wpp, .cta-ig').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r  = btn.getBoundingClientRect();
    const x  = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
    const y  = ((e.clientY - r.top ) / r.height * 100).toFixed(1);
    btn.style.setProperty('--mx', x + '%');
    btn.style.setProperty('--my', y + '%');
  });
});

// ── Floating WhatsApp entrance animation ────────────────────
window.addEventListener('load', () => {
  const wppFloat = document.querySelector('.whatsapp-float');
  if (wppFloat) {
    wppFloat.style.opacity = '0';
    wppFloat.style.transform = 'scale(0.5) translateY(20px)';
    wppFloat.style.transition = 'opacity .5s, transform .5s';
    setTimeout(() => {
      wppFloat.style.opacity = '1';
      wppFloat.style.transform = '';
    }, 3000);
  }
});