(function () {
  'use strict';

    const q = (s) => document.querySelector(s);
    const qa = (s) => Array.from(document.querySelectorAll(s));
    const header = q('#rescoHeader');
    const logoLight = q('#rescoLogoLight');
    const logoDark = q('#rescoLogoDark');
    const navLinks = qa('#rescoNavMenu a[data-nav]');
    const cta = q('#rescoHeader nav > a:last-child');

    const setHeader = () => {
      const s = window.scrollY > 20;
      if (!header) return;
      header.style.background = s ? 'rgba(255,255,255,.94)' : 'transparent';
      header.style.backdropFilter = s ? 'blur(12px)' : 'none';
      header.style.boxShadow = s ? '0 1px 0 #E3E6F0' : 'none';
      if (logoLight) logoLight.style.opacity = s ? '0' : '1';
      if (logoDark) logoDark.style.opacity = s ? '1' : '0';
      navLinks.forEach((a) => { a.style.color = s ? '#414A6B' : 'rgba(255,255,255,.88)'; });
      const toggle = q('#rescoNavToggle');
      if (toggle) toggle.style.color = s ? '#101634' : '#ffffff';
    };
    setHeader();
    window.addEventListener('scroll', setHeader, { passive: true });

    // responsive nav
    const mq = window.matchMedia('(max-width: 1024px)');
    const navMenu = q('#rescoNavMenu');
    const toggle = q('#rescoNavToggle');
    let open = false;
    const applyMenu = () => {
      if (!navMenu || !toggle) return;
      if (mq.matches) {
        toggle.style.display = 'flex';
        if (cta) cta.style.display = 'none';
        Object.assign(navMenu.style, {
          display: open ? 'flex' : 'none', position: 'fixed', top: '76px', left: '0', right: '0',
          flexDirection: 'column', alignItems: 'stretch', background: '#ffffff', padding: '20px 24px 24px',
          borderBottom: '1px solid #E3E6F0', boxShadow: '0 24px 48px rgba(16,22,52,.1)', zIndex: '99', gap: '2px', marginLeft: '0'
        });
        navLinks.forEach((a) => { a.style.color = '#414A6B'; a.style.padding = '14px 16px'; a.style.fontSize = '1rem'; });
        const sm = document.querySelector('#rescoSvcMenu');
        if (sm) Object.assign(sm.style, { display: 'block', position: 'static', minWidth: '0', border: 'none', boxShadow: 'none', padding: '0 0 0 12px', background: 'transparent' });
      } else {
        toggle.style.display = 'none';
        if (cta) cta.style.display = 'inline-flex';
        Object.assign(navMenu.style, {
          display: 'flex', position: 'static', flexDirection: 'row', alignItems: 'center',
          background: 'none', padding: '0', border: 'none', boxShadow: 'none', gap: '4px', marginLeft: 'auto'
        });
        navLinks.forEach((a) => { a.style.padding = '8px 14px'; a.style.fontSize = '.875rem'; });
        const sm2 = document.querySelector('#rescoSvcMenu');
        if (sm2) Object.assign(sm2.style, { display: 'none', position: 'absolute', minWidth: '268px', border: '1px solid #E3E6F0', boxShadow: '0 4px 8px rgba(16,22,52,.04), 0 24px 48px rgba(16,22,52,.12)', padding: '8px', background: '#ffffff' });
        setHeader();
      }
    };
    applyMenu();
    mq.addEventListener('change', applyMenu);
    // services dropdown
    const svcItem = q('#rescoSvcItem');
    const svcMenu = q('#rescoSvcMenu');
    const svcTrigger = q('[data-svc-trigger]');
    const subs = qa('#rescoSvcMenu a[data-sub]');
    let svcOpen = false;
    const setSvc = (v) => { svcOpen = v; if (svcMenu && !mq.matches) svcMenu.style.display = v ? 'block' : 'none'; };
    if (svcItem) {
      svcItem.addEventListener('mouseenter', () => setSvc(true));
      svcItem.addEventListener('mouseleave', () => setSvc(false));
    }
    if (svcTrigger) svcTrigger.addEventListener('click', (e) => { if (!mq.matches) { e.preventDefault(); setSvc(!svcOpen); } });
    subs.forEach((a) => a.addEventListener('click', () => { setSvc(false); open = false; applyMenu(); }));

    if (toggle) toggle.addEventListener('click', () => { open = !open; toggle.setAttribute('aria-expanded', String(open)); applyMenu(); });
    navLinks.forEach((a) => a.addEventListener('click', () => { open = false; applyMenu(); }));

    // projects carousel
    const track = q('#rescoProjTrack');
    const prev = q('#rescoProjPrev');
    const next = q('#rescoProjNext');
    if (track && prev && next) {
      prev.addEventListener('click', () => track.scrollBy({ left: -track.clientWidth * 0.8, behavior: 'smooth' }));
      next.addEventListener('click', () => track.scrollBy({ left: track.clientWidth * 0.8, behavior: 'smooth' }));
    }

    // reveal
    const reveals = qa('[data-reveal]');
    reveals.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1)';
    });
    const onReveal = () => {
      const wh = window.innerHeight;
      reveals.forEach((el) => {
        if (el.getBoundingClientRect().top < wh - 60) { el.style.opacity = '1'; el.style.transform = 'none'; }
      });
    };
    onReveal();
    window.addEventListener('scroll', onReveal, { passive: true });

    // stats counters
    const stats = qa('[data-stat]');
    let done = false;
    const runStats = () => {
      if (done) return;
      const sec = q('#stats');
      if (!sec || sec.getBoundingClientRect().top > window.innerHeight) return;
      done = true;
      stats.forEach((el) => {
        const target = parseInt(el.getAttribute('data-stat'), 10);
        const t0 = performance.now();
        const tick = (now) => {
          const p = Math.min((now - t0) / 2000, 1);
          const eased = 1 - Math.pow(1 - p, 4);
          el.textContent = Math.floor(eased * target).toLocaleString();
          if (p < 1) requestAnimationFrame(tick); else el.textContent = target.toLocaleString();
        };
        requestAnimationFrame(tick);
      });
    };
    runStats();
    window.addEventListener('scroll', runStats, { passive: true });

    // contact form
    const form = q('#rescoForm');
    const ok = q('#rescoFormOk');
    if (form) form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (ok) { ok.style.display = 'block'; setTimeout(() => { ok.style.display = 'none'; }, 5000); }
      form.reset();
    });
  
})();
