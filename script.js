/* ============================================================
   Ankit Raj — Portfolio interactions
   ============================================================ */
(function () {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Theme ─────────────────────────────────────── */
  const root = document.documentElement;
  const stored = localStorage.getItem('ar-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.setAttribute('data-theme', stored || (prefersDark ? 'dark' : 'light'));

  $('#themeToggle').addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('ar-theme', next);
  });

  /* ── Navbar: shadow on scroll + active link ────── */
  const navbar = $('#navbar');
  const navLinks = $$('.nav-link');
  const sections = navLinks
    .map(l => $(l.getAttribute('href')))
    .filter(Boolean);

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);

    const pos = window.scrollY + window.innerHeight * 0.32;
    let current = sections[0];
    sections.forEach(sec => { if (sec.offsetTop <= pos) current = sec; });

    // Bottom of page always highlights the last section.
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) {
      current = sections[sections.length - 1];
    }

    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current.id));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile menu ───────────────────────────────── */
  const menuBtn = $('#menuBtn');
  const navMenu = $('#navLinks');
  const closeMenu = () => {
    navMenu.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  };
  menuBtn.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  navLinks.forEach(l => l.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  /* ── Typing effect ─────────────────────────────── */
  const roles = [
    'CSE Student & Technopreneur',
    'Founder @ Inook Ai',
    'Full Stack Builder',
    'DSA Learner'
  ];
  const typedEl = $('#typed');
  let rIdx = 0, cIdx = 0, deleting = false;

  function type() {
    const word = roles[rIdx];
    typedEl.textContent = word.slice(0, cIdx);

    let delay = deleting ? 45 : 85;
    if (!deleting && cIdx === word.length) { delay = 1700; deleting = true; }
    else if (deleting && cIdx === 0) { deleting = false; rIdx = (rIdx + 1) % roles.length; delay = 260; }
    else { cIdx += deleting ? -1 : 1; }

    setTimeout(type, delay);
  }
  if (reduceMotion) { typedEl.textContent = roles[0]; } else { type(); }

  /* ── Skill bars markup ─────────────────────────── */
  $$('.bars li').forEach(li => {
    const label = $('span', li);
    const row = document.createElement('div');
    row.className = 'bar-row';
    li.insertBefore(row, label);
    row.appendChild(label);
    const pct = document.createElement('b');
    pct.className = 'bar-pct';
    pct.textContent = (li.dataset.level || 0) + '%';
    row.appendChild(pct);

    const track = document.createElement('span');
    track.className = 'bar-track';
    const fill = document.createElement('span');
    fill.className = 'bar-fill';
    track.appendChild(fill);
    li.appendChild(track);
  });

  /* ── Counters ──────────────────────────────────── */
  function formatCount(value, el) {
    const suffix = el.dataset.suffix || '';
    if (el.dataset.format === 'inr') {
      // 200000 -> ₹2,00,000+  (Indian grouping)
      return '₹' + value.toLocaleString('en-IN') + '+';
    }
    return value.toLocaleString('en-IN') + suffix;
  }

  function runCounter(el) {
    const target = Number(el.dataset.count) || 0;
    if (reduceMotion) { el.textContent = formatCount(target, el); return; }
    const duration = 1500;
    const start = performance.now();
    (function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = formatCount(Math.round(target * eased), el);
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }

  /* ── Reveal on scroll ──────────────────────────── */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('visible');

      $$('.bars li', el).forEach((li, i) => {
        const fill = $('.bar-fill', li);
        if (fill) setTimeout(() => { fill.style.width = (li.dataset.level || 0) + '%'; }, i * 110);
      });
      $$('.counter', el).forEach(runCounter);

      io.unobserve(el);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  $$('.reveal').forEach((el, i) => {
    el.style.transitionDelay = Math.min(i % 4, 3) * 90 + 'ms';
    io.observe(el);
  });

  /* ── Toast ─────────────────────────────────────── */
  const toastEl = $('#toast');
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3800);
  }

  /* ── Contact form → opens mail client ──────────── */
  const form = $('#contactForm');
  const note = $('#formNote');

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name = $('#name');
    const email = $('#email');
    const subject = $('#subject');
    const message = $('#message');
    let ok = true;

    [name, email, message].forEach(f => {
      const bad = !f.value.trim() || (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value));
      f.classList.toggle('invalid', bad);
      if (bad) ok = false;
    });

    if (!ok) {
      note.textContent = 'Please fill in your name, a valid email, and a message.';
      return;
    }

    const subjectLine = subject.value.trim() || `Portfolio enquiry from ${name.value.trim()}`;
    const body = `Hi Ankit,\n\n${message.value.trim()}\n\n—\n${name.value.trim()}\n${email.value.trim()}`;
    window.location.href =
      `mailto:ankitrajjgupta02@gmail.com?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(body)}`;

    note.textContent = 'Opening your email app… if nothing happens, write to ankitrajjgupta02@gmail.com';
    toast('Thanks! Your email draft is ready to send.');
    form.reset();
  });

  $$('.field input, .field textarea').forEach(f =>
    f.addEventListener('input', () => f.classList.remove('invalid'))
  );

  /* ── Copy email on long-press of the email chip ── */
  $$('a[href^="mailto:"]').forEach(a => {
    a.addEventListener('contextmenu', () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(a.getAttribute('href').replace('mailto:', ''));
        toast('Email address copied to clipboard');
      }
    });
  });

  /* ── Footer year ───────────────────────────────── */
  $('#year').textContent = new Date().getFullYear();
})();
