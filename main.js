(function () {
  'use strict';

  var header = document.getElementById('header');
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');
  var contactForm = document.getElementById('contactForm');
  var formOk = document.getElementById('formOk');

  // Header scroll
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var open = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open);
    });
    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Hero slider
  var slides = document.querySelectorAll('.hero-slide');
  var progressBar = document.getElementById('heroProgress');
  var heroRotate = document.getElementById('heroRotate');
  var rotateWords = ['Solar', 'Wind', 'Water', 'Industrial', 'Renewable'];
  var slideIndex = 0;
  var rotateIndex = 0;
  var slideDuration = 5000;
  var slideStart = Date.now();

  function setSlide(i) {
    slideIndex = (i + slides.length) % slides.length;
    slides.forEach(function (s, idx) {
      s.classList.toggle('active', idx === slideIndex);
    });
    slideStart = Date.now();
  }

  function rotateWord() {
    if (!heroRotate) return;
    heroRotate.classList.add('out');
    setTimeout(function () {
      rotateIndex = (rotateIndex + 1) % rotateWords.length;
      heroRotate.textContent = rotateWords[rotateIndex];
      heroRotate.classList.remove('out');
    }, 300);
  }

  if (slides.length) {
    setInterval(function () {
      setSlide(slideIndex + 1);
      rotateWord();
    }, slideDuration);

    setInterval(function () {
      if (!progressBar) return;
      var elapsed = Date.now() - slideStart;
      var pct = Math.min(elapsed / slideDuration * 100, 100);
      progressBar.style.width = pct + '%';
    }, 50);
  }

  // Projects carousel
  var projectsTrack = document.getElementById('projectsTrack');
  var projPrev = document.getElementById('projPrev');
  var projNext = document.getElementById('projNext');

  if (projectsTrack && projPrev && projNext) {
    projPrev.addEventListener('click', function () {
      projectsTrack.scrollBy({ left: -projectsTrack.clientWidth * 0.8, behavior: 'smooth' });
    });
    projNext.addEventListener('click', function () {
      projectsTrack.scrollBy({ left: projectsTrack.clientWidth * 0.8, behavior: 'smooth' });
    });
  }

  // Scroll reveal
  var reveals = document.querySelectorAll('.reveal');

  function reveal() {
    var wh = window.innerHeight;
    reveals.forEach(function (el) {
      if (el.getBoundingClientRect().top < wh - 60) {
        el.classList.add('visible');
      }
    });
  }
  window.addEventListener('scroll', reveal, { passive: true });
  reveal();

  // Stats counter
  var statValues = document.querySelectorAll('.stat-value');
  var statsDone = false;

  function animateStats() {
    if (statsDone) return;
    var stats = document.getElementById('stats');
    if (!stats || stats.getBoundingClientRect().top > window.innerHeight) return;
    statsDone = true;

    statValues.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      var duration = 2000;
      var start = performance.now();

      function tick(now) {
        var p = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString();
      }
      requestAnimationFrame(tick);
    });
  }
  window.addEventListener('scroll', animateStats, { passive: true });
  animateStats();

  // Contact form
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      formOk.hidden = false;
      contactForm.reset();
      setTimeout(function () { formOk.hidden = true; }, 5000);
    });
  }

  // Active nav
  var sections = document.querySelectorAll('section[id]');
  var navLinks = navMenu ? navMenu.querySelectorAll('a[href^="#"]') : [];

  function highlightNav() {
    var pos = window.scrollY + 120;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');
      if (pos >= top && pos < top + height) {
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }
  window.addEventListener('scroll', highlightNav, { passive: true });

  // Image fallback for broken external URLs
  document.querySelectorAll('img').forEach(function (img) {
    img.addEventListener('error', function () {
      if (img.dataset.error) return;
      img.dataset.error = 'true';
      img.src = 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80';
      img.alt = img.alt || 'Renewable energy';
    }, { once: true });
  });
})();
