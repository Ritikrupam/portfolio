/* ========================================
   RITIK RUPAM NANDA — PORTFOLIO JS
   Premium AI/ML Engineer Portfolio
   ======================================== */

'use strict';

/* ========== UTILS ========== */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ========== SCROLL PROGRESS ========== */
const scrollBar = $('#scrollProgress');
function updateScrollProgress() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const pct = (window.scrollY / total) * 100;
  if (scrollBar) scrollBar.style.width = pct + '%';
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });

/* ========== NAVBAR ========== */
const navbar = $('#navbar');
const navLinks = $$('.nav-link');
const sections = $$('section[id]');

function updateNavbar() {
  if (window.scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');

  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.id;
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}
window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

/* ========== HAMBURGER MENU ========== */
const hamburger = $('#hamburger');
const navLinksContainer = $('#navLinks');

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinksContainer.classList.toggle('open');
});

navLinksContainer?.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinksContainer.classList.remove('open');
  });
});

/* ========== CUSTOM CURSOR ========== */
const cursorDot = $('#cursorDot');
const cursorRing = $('#cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.14;
  ringY += (mouseY - ringY) * 0.14;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Cursor hover states
document.querySelectorAll('a, button, .project-card, .cert-card, .skill-icon-badge, .stat-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorRing.style.width = '56px';
    cursorRing.style.height = '56px';
    cursorRing.style.borderColor = 'var(--purple)';
    cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursorRing.style.width = '36px';
    cursorRing.style.height = '36px';
    cursorRing.style.borderColor = 'var(--cyan)';
    cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
  });
});

/* ========== PARTICLE SYSTEM ========== */
const canvas = $('#particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouseParticleX = -9999, mouseParticleY = -9999;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
resizeCanvas();

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? '0, 240, 255' : '180, 0, 255';
    this.pulse = Math.random() * Math.PI * 2;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.pulse += 0.01;
    const pulseOpacity = this.opacity + Math.sin(this.pulse) * 0.1;

    // Mouse repel
    const dx = this.x - mouseParticleX;
    const dy = this.y - mouseParticleY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 100) {
      const angle = Math.atan2(dy, dx);
      const force = (100 - dist) / 100;
      this.x += Math.cos(angle) * force * 1.5;
      this.y += Math.sin(angle) * force * 1.5;
    }

    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    return pulseOpacity;
  }
  draw() {
    const op = this.update();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color}, ${op})`;
    ctx.fill();
  }
}

function initParticles() {
  const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 180);
  particles = Array.from({ length: count }, () => new Particle());
}
initParticles();

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0, 240, 255, ${0.04 * (1 - dist / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawConnections();
  particles.forEach(p => p.draw());
  requestAnimationFrame(animateParticles);
}
animateParticles();

document.addEventListener('mousemove', e => {
  mouseParticleX = e.clientX;
  mouseParticleY = e.clientY + window.scrollY;
});

/* ========== TYPING ANIMATION ========== */
const roles = [
  'AI/ML Engineer',
  'Deep Learning Researcher',
  'Computer Vision Enthusiast',
  'Full Stack Developer',
];
let roleIdx = 0, charIdx = 0, isDeleting = false;
const typingEl = $('#typingText');

function type() {
  if (!typingEl) return;
  const word = roles[roleIdx];

  if (!isDeleting) {
    typingEl.textContent = word.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === word.length) {
      setTimeout(() => { isDeleting = true; type(); }, 2000);
      return;
    }
  } else {
    typingEl.textContent = word.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
  }

  const speed = isDeleting ? 50 : 90;
  setTimeout(type, speed);
}
type();

/* ========== SCROLL REVEAL (Intersection Observer) ========== */
const revealEls = $$('.reveal-fade, .reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || i * 80;
      setTimeout(() => {
        entry.target.classList.add('revealed');
      }, parseInt(delay));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach((el, i) => {
  el.dataset.delay = i % 5 * 100;
  revealObserver.observe(el);
});

/* ========== SKILL BAR ANIMATION ========== */
const skillBars = $$('.pill-fill');

const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

skillBars.forEach(bar => barObserver.observe(bar));

/* ========== ANIMATED COUNTERS ========== */
const statNums = $$('.stat-num');

function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const isFloat = target % 1 !== 0;
  const duration = 1800;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4);
    const value = isFloat ? (target * ease).toFixed(2) : Math.floor(target * ease);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => counterObserver.observe(el));

/* ========== 3D TILT CARDS ========== */
$$('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -6;
    const rotY = ((x - cx) / cx) * 6;
    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    card.style.transition = 'transform 0.5s ease';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s ease';
  });
});

/* ========== BACK TO TOP ========== */
const backToTop = $('#backToTop');
backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ========== CONTACT FORM ========== */
const contactForm = $('#contactForm');
contactForm?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = contactForm.querySelector('.form-submit');
  const original = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
  btn.style.background = 'linear-gradient(135deg, var(--green), var(--cyan))';
  setTimeout(() => {
    btn.innerHTML = original;
    btn.style.background = '';
    contactForm.reset();
  }, 3000);
});

/* ========== MOUSE GLOW FOLLOW ========== */
const glowEl = document.createElement('div');
glowEl.style.cssText = `
  position: fixed;
  pointer-events: none;
  z-index: 0;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0,240,255,0.04), transparent 70%);
  transform: translate(-50%, -50%);
  transition: left 0.12s ease, top 0.12s ease;
`;
document.body.appendChild(glowEl);

document.addEventListener('mousemove', e => {
  glowEl.style.left = e.clientX + 'px';
  glowEl.style.top = e.clientY + 'px';
});

/* ========== HERO STAGGERED ENTRANCE ========== */
const heroRevealOrder = ['.hero-greeting', '.hero-name', '.hero-roles', '.hero-bio', '.hero-ctas', '.hero-socials', '.hero-image'];
heroRevealOrder.forEach((sel, i) => {
  const el = $(sel);
  if (!el) return;
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  setTimeout(() => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  }, 300 + i * 150);
});

/* ========== RESUME BUTTON ========== */
// ⬇️ REPLACE "your-resume.pdf" with the actual path to your resume file
$('#resumeBtn')?.addEventListener('click', e => {
  e.preventDefault();
  const link = document.createElement('a');
  link.href = 'assets/resume.pdf'; // <-- Change this path
  link.download = 'Ritik_Rupam_Nanda_Resume.pdf';
  link.click();
});

/* ========== PARALLAX BLOBS ========== */
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const blob1 = $('.blob-1');
  const blob2 = $('.blob-2');
  if (blob1) blob1.style.transform = `translateY(${scrolled * 0.08}px)`;
  if (blob2) blob2.style.transform = `translateY(${-scrolled * 0.05}px)`;
}, { passive: true });

/* ========== SECTION GRADIENT BORDERS ON HOVER ========== */
$$('.project-card, .cert-card, .exp-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', x + '%');
    card.style.setProperty('--mouse-y', y + '%');
  });
});

console.log('%c✦ Ritik Rupam Nanda | AI/ML Engineer Portfolio', 'color: #00f0ff; font-family: monospace; font-size: 14px; font-weight: bold;');
console.log('%c Built with raw HTML/CSS/JS — no frameworks, just craft.', 'color: #8892b0; font-family: monospace; font-size: 12px;');
