/* ============================================
   GALAXY RECORDING CO — Main JavaScript
   ============================================ */

'use strict';

/* ---- STATE ---- */
let currentPage = 'home';
let mobileMenuOpen = false;
let searchOpen = false;

/* ---- UTILITIES ---- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ============================================
   NAVIGATION — PAGE ROUTING
   ============================================ */
function showPage(id) {
  /* Hide all pages */
  $$('.page').forEach(p => p.classList.remove('active'));

  /* Show target */
  const page = document.getElementById('page-' + id);
  if (!page) return;
  page.classList.add('active');
  currentPage = id;

  /* Update nav link active states */
  $$('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === id);
  });
  $$('.mobile-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === id);
  });

  /* Hide footer on dashboard */
  const footer = document.getElementById('site-footer');
  if (footer) footer.style.display = id === 'dashboard' ? 'none' : '';

  /* Close mobile menu */
  closeMobileMenu();

  /* Scroll to top */
  window.scrollTo({ top: 0, behavior: 'instant' });
}

/* ============================================
   MOBILE MENU
   ============================================ */
function toggleMobileMenu() {
  mobileMenuOpen = !mobileMenuOpen;
  const menu = document.getElementById('mobile-menu');
  const burger = document.getElementById('nav-burger');
  if (!menu) return;

  menu.classList.toggle('open', mobileMenuOpen);
  document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';

  if (burger) {
    const spans = $$('span', burger);
    if (mobileMenuOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  }
}

function closeMobileMenu() {
  mobileMenuOpen = false;
  const menu = document.getElementById('mobile-menu');
  const burger = document.getElementById('nav-burger');
  if (menu) menu.classList.remove('open');
  document.body.style.overflow = '';
  if (burger) {
    $$('span', burger).forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
}

/* ============================================
   SEARCH OVERLAY
   ============================================ */
function openSearch() {
  searchOpen = true;
  const overlay = document.getElementById('search-overlay');
  if (overlay) {
    overlay.classList.add('open');
    const input = $('#search-input');
    if (input) setTimeout(() => input.focus(), 50);
  }
}

function closeSearch() {
  searchOpen = false;
  const overlay = document.getElementById('search-overlay');
  if (overlay) overlay.classList.remove('open');
}

/* ============================================
   NAVBAR SCROLL EFFECT
   ============================================ */
function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const handler = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', handler, { passive: true });
  handler();
}

/* ============================================
   FAQ ACCORDION
   ============================================ */
function initFAQ() {
  $$('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      /* Close all */
      $$('.faq-item').forEach(i => i.classList.remove('open'));

      /* Toggle clicked */
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ============================================
   PORTFOLIO FILTER
   ============================================ */
function initPortfolioFilter() {
  const btns = $$('.filter-btn');
  const items = $$('.portfolio-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.filter;

      items.forEach(item => {
        const show = cat === 'all' || item.dataset.cat === cat;
        item.style.display = show ? '' : 'none';
        /* Slight fade animation */
        if (show) {
          item.style.opacity = '0';
          item.style.transform = 'translateY(10px)';
          requestAnimationFrame(() => {
            item.style.transition = 'opacity 0.3s, transform 0.3s';
            item.style.opacity = '1';
            item.style.transform = '';
          });
        }
      });
    });
  });
}

/* ============================================
   DASHBOARD SIDEBAR NAV
   ============================================ */
function initDashboard() {
  $$('.dash-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      $$('.dash-nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

/* ============================================
   CONTACT FORM
   ============================================ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const btn = form.querySelector('.btn-submit');

  form.addEventListener('submit', e => {
    e.preventDefault();

    if (btn) {
      btn.textContent = 'Sending…';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = '✓ Message Sent!';
        btn.style.background = 'var(--green)';
        btn.style.color = '#080a0f';

        setTimeout(() => {
          btn.textContent = 'Send Message ↗';
          btn.disabled = false;
          btn.style.background = '';
          btn.style.color = '';
          form.reset();
        }, 3500);
      }, 1200);
    }
  });
}

/* ============================================
   NEWSLETTER FORM
   ============================================ */
function initNewsletter() {
  $$('.newsletter-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button');
      const input = form.querySelector('input');
      if (!btn || !input || !input.value) return;

      btn.textContent = '✓ Subscribed!';
      input.value = '';

      setTimeout(() => { btn.textContent = 'Subscribe'; }, 3000);
    });
  });
}

/* ============================================
   SCROLL REVEAL ANIMATIONS
   ============================================ */
function initScrollReveal() {
  /* Only animate elements that are off-screen */
  const targets = $$('.card, .service-card, .portfolio-card, .blog-card, .testi-card, .price-card, .stat-card, .process-step');

  if (!('IntersectionObserver' in window)) return;

  targets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.5s ${(i % 4) * 0.07}s, transform 0.5s ${(i % 4) * 0.07}s`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = '';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
}

/* ============================================
   LOADING SCREEN
   ============================================ */
function initLoadingScreen() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.style.opacity = '0';
      loader.style.transition = 'opacity 0.5s';
      setTimeout(() => loader.remove(), 500);
    }, 600);
  });
}

/* ============================================
   KEYBOARD SHORTCUTS
   ============================================ */
function initKeyboard() {
  document.addEventListener('keydown', e => {
    /* Escape closes search and mobile menu */
    if (e.key === 'Escape') {
      closeSearch();
      closeMobileMenu();
    }
    /* Cmd/Ctrl+K opens search */
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }
  });
}

/* ============================================
   HERO SCROLL INDICATOR
   ============================================ */
function initHeroScroll() {
  const indicator = document.querySelector('.hero-scroll');
  if (!indicator) return;

  indicator.addEventListener('click', () => {
    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) statsBar.scrollIntoView({ behavior: 'smooth' });
  });

  /* Hide when scrolled down */
  window.addEventListener('scroll', () => {
    indicator.style.opacity = window.scrollY > 100 ? '0' : '1';
    indicator.style.pointerEvents = window.scrollY > 100 ? 'none' : '';
  }, { passive: true });
}

/* ============================================
   SMOOTH SECTION ENTRY
   ============================================ */
function initSectionAnimations() {
  const sections = $$('.section-eyebrow, .section-title, .section-sub, .inner-hero h1, .inner-hero .hero-badge');
  sections.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = `opacity 0.55s ${i * 0.08}s, transform 0.55s ${i * 0.08}s`;
  });

  if (!('IntersectionObserver' in window)) {
    sections.forEach(el => { el.style.opacity = '1'; el.style.transform = ''; });
    return;
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = '';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  sections.forEach(el => obs.observe(el));
}

/* ============================================
   INIT
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initFAQ();
  initPortfolioFilter();
  initDashboard();
  initContactForm();
  initNewsletter();
  initKeyboard();
  initHeroScroll();
  initLoadingScreen();

  /* Delay reveal animations slightly */
  setTimeout(() => {
    initScrollReveal();
    initSectionAnimations();
  }, 100);

  /* Show home page by default */
  showPage('home');
});
