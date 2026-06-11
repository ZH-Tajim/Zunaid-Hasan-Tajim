/* ============================================================
   Zunaid Hasan Tajim — Research Profile Website
   JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── ACTIVE NAV HIGHLIGHT ON SCROLL ──────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 80;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* ── MOBILE HAMBURGER MENU ────────────────────────────── */
  const hamburger = document.getElementById('nav-hamburger');
  const navLinksEl = document.getElementById('nav-links');

  if (hamburger && navLinksEl) {
    hamburger.addEventListener('click', function () {
      navLinksEl.classList.toggle('open');
      const isOpen = navLinksEl.classList.contains('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a link is clicked
    navLinksEl.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinksEl.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu on outside click
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !navLinksEl.contains(e.target)) {
        navLinksEl.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── SCROLL FADE-IN ANIMATIONS ───────────────────────── */
  const fadeEls = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  fadeEls.forEach(el => observer.observe(el));

  /* ── SMOOTH SCROLL FOR NAV LINKS ─────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 70;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── ANIMATED STAT COUNTERS ───────────────────────────── */
  function animateCounter(el, target, duration, isDecimal) {
    const start = performance.now();
    const startVal = 0;

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (target - startVal) * eased;

      el.textContent = isDecimal ? current.toFixed(1) : Math.round(current);

      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const statObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const numEl = entry.target.querySelector('.num');
          if (numEl) {
            const rawVal = numEl.getAttribute('data-val');
            const isDecimal = rawVal && rawVal.includes('.');
            const target = parseFloat(rawVal || numEl.textContent);
            animateCounter(numEl, target, 1200, isDecimal);
          }
          statObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.badge').forEach(badge => {
    const numEl = badge.querySelector('.num');
    if (numEl) {
      const val = numEl.textContent;
      numEl.setAttribute('data-val', val);
      numEl.textContent = '0';
      statObserver.observe(badge);
    }
  });

  /* ── BACK TO TOP BUTTON ───────────────────────────────── */
  const backToTop = document.getElementById('back-to-top');

  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── COPY EMAIL TO CLIPBOARD ──────────────────────────── */
  const emailLinks = document.querySelectorAll('.copy-email');
  emailLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const email = this.getAttribute('data-email');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(email).then(() => {
          showToast('Email copied to clipboard!');
        });
      } else {
        // fallback
        const ta = document.createElement('textarea');
        ta.value = email;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('Email copied!');
      }
    });
  });

  function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 2500);
  }

  /* ── YEAR IN FOOTER ───────────────────────────────────── */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});