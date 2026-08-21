/**
 * VAÏNA CHARABIE — Portfolio JS v2
 * Vanilla JavaScript ES2020+
 */
'use strict';

/* ══════════════════════════════════════════════════
   1. THÈME
══════════════════════════════════════════════════ */
const ThemeManager = (() => {
  const html = document.documentElement;
  const btn  = document.getElementById('themeToggle');
  const KEY  = 'vaina-theme';
  function apply(t) { html.setAttribute('data-theme', t); localStorage.setItem(KEY, t); }
  function init() {
    const saved = localStorage.getItem(KEY);
    const sys   = window.matchMedia('(prefers-color-scheme: dark)').matches;
    apply(saved || (sys ? 'dark' : 'light'));
    btn?.addEventListener('click', () => apply(html.getAttribute('data-theme') === 'light' ? 'dark' : 'light'));
  }
  return { init };
})();

/* ══════════════════════════════════════════════════
   1b. MUSIQUE FÉÉRIQUE
   « Music Box Theme » — Kevin MacLeod (incompetech.com)
   Licence CC BY 4.0 — creativecommons.org/licenses/by/4.0
══════════════════════════════════════════════════ */
const MagicMusic = (() => {
  let audio, playing = false;

  function init() {
    const btn = document.getElementById('musicToggle');
    if (!btn) return;
    audio = new Audio('assets/audio/musique-feerique.mp3');
    audio.loop = true;
    audio.volume = 0;
    audio.preload = 'none';

    function fadeTo(target, duration) {
      const start = audio.volume;
      const startTime = performance.now();
      function step(now) {
        const p = Math.min((now - startTime) / duration, 1);
        audio.volume = start + (target - start) * p;
        if (p < 1) requestAnimationFrame(step);
        else if (target === 0) audio.pause();
      }
      requestAnimationFrame(step);
    }

    btn.addEventListener('click', () => {
      playing = !playing;
      if (playing) { audio.play().catch(() => {}); fadeTo(.5, 1200); }
      else { fadeTo(0, 800); }
      btn.classList.toggle('is-playing', playing);
      btn.setAttribute('aria-pressed', String(playing));
    });
  }
  return { init };
})();

/* ══════════════════════════════════════════════════
   2. CURSEUR
══════════════════════════════════════════════════ */
const CursorManager = (() => {
  const cur = document.getElementById('cursor');
  const fol = document.getElementById('cursorFollower');
  let mx=0, my=0, fx=0, fy=0;
  function animate() {
    fx += (mx - fx) * .12; fy += (my - fy) * .12;
    if (cur) { cur.style.left = mx+'px'; cur.style.top = my+'px'; }
    if (fol) { fol.style.left = fx+'px'; fol.style.top = fy+'px'; }
    requestAnimationFrame(animate);
  }
  function init() {
    if (!cur || !fol) return;
    if (window.matchMedia('(pointer:coarse)').matches) return;
    document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
    document.querySelectorAll('a,button,.projet-card,.service-card,.tool-card,.filter-btn,.timeline-tab,.client-card').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
    animate();
  }
  return { init };
})();

/* ══════════════════════════════════════════════════
   3. HEADER SCROLL
══════════════════════════════════════════════════ */
const HeaderManager = (() => {
  const header   = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  function onScroll() {
    header?.classList.toggle('scrolled', window.scrollY > 40);
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) current = s.id; });
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#'+current));
  }
  function init() { window.addEventListener('scroll', onScroll, {passive:true}); onScroll(); }
  return { init };
})();

/* ══════════════════════════════════════════════════
   4. BURGER
══════════════════════════════════════════════════ */
const BurgerMenu = (() => {
  const burger = document.getElementById('burger');
  const menu   = document.getElementById('mobileMenu');
  function toggle(open) {
    burger?.setAttribute('aria-expanded', String(open));
    menu?.setAttribute('aria-hidden', String(!open));
    burger?.classList.toggle('open', open);
    menu?.classList.toggle('open', open);
  }
  function init() {
    burger?.addEventListener('click', () => toggle(burger.getAttribute('aria-expanded') !== 'true'));
    document.querySelectorAll('.mobile-nav-link').forEach(l => l.addEventListener('click', () => toggle(false)));
    document.addEventListener('click', e => { if (!burger?.contains(e.target) && !menu?.contains(e.target)) toggle(false); });
  }
  return { init };
})();

/* ══════════════════════════════════════════════════
   5. ANIMATION PRÉNOM
══════════════════════════════════════════════════ */
const NameAnimation = (() => {
  function init() {
    const c = document.getElementById('nameLetters');
    if (!c) return;
    'Vaïna Charabie'.split('').forEach((ch, i) => {
      const s = document.createElement('span');
      s.classList.add('name-letter');
      s.textContent = ch === ' ' ? '\u00A0' : ch;
      s.style.animationDelay = `${0.5 + i * 0.06}s`;
      c.appendChild(s);
    });
  }
  return { init };
})();

/* ══════════════════════════════════════════════════
   6. TYPEWRITER
══════════════════════════════════════════════════ */
const Typewriter = (() => {
  const WORDS = ['Designer Graphique','Créatrice Visuelle','UX/UI Designer','Étudiante MMI','Passionnée du Design'];
  let wi=0, ci=0, del=false, tid=null;
  function type() {
    const el = document.getElementById('typewriter');
    if (!el) return;
    const w = WORDS[wi];
    if (!del) {
      el.textContent = w.slice(0, ci+1); ci++;
      if (ci === w.length) { del=true; tid=setTimeout(type,2200); return; }
    } else {
      el.textContent = w.slice(0, ci-1); ci--;
      if (ci === 0) { del=false; wi=(wi+1)%WORDS.length; }
    }
    tid = setTimeout(type, del ? 55 : 90);
  }
  function init() { setTimeout(type, 1500); }
  return { init };
})();

/* ══════════════════════════════════════════════════
   7. SCROLL REVEAL
══════════════════════════════════════════════════ */
const ScrollReveal = (() => {
  function init() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } });
    }, { threshold:.12, rootMargin:'0px 0px -60px 0px' });
    document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right').forEach(el => obs.observe(el));
  }
  return { init };
})();

/* ══════════════════════════════════════════════════
   8. COMPTEURS
══════════════════════════════════════════════════ */
const AnimatedCounters = (() => {
  function animate(el, target) {
    const s = performance.now();
    function step(now) {
      const p = Math.min((now-s)/1800, 1), e = 1-Math.pow(1-p,3);
      el.textContent = Math.floor(e*target);
      if (p<1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function init() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { animate(e.target, +e.target.dataset.count); obs.unobserve(e.target); } });
    }, { threshold:.5 });
    document.querySelectorAll('.stat-number[data-count]').forEach(el => obs.observe(el));
  }
  return { init };
})();

/* ══════════════════════════════════════════════════
   9. BARRES COMPÉTENCES
══════════════════════════════════════════════════ */
const SkillBars = (() => {
  function animBar(fill, pct, target) {
    requestAnimationFrame(() => { fill.style.width = target+'%'; });
    const s = performance.now();
    function step(now) {
      const p = Math.min((now-s)/1200,1), e = 1-Math.pow(1-p,3);
      pct.textContent = Math.floor(e*target)+'%';
      if (p<1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function init() {
    const items = document.querySelectorAll('.skill-bar-item');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const fill = e.target.querySelector('.skill-bar-fill');
        const pct  = e.target.querySelector('.skill-percent');
        const w    = fill?.dataset.width;
        if (fill && pct && w) {
          const delay = Array.from(items).indexOf(e.target) * 80;
          setTimeout(() => animBar(fill, pct, +w), delay);
        }
        obs.unobserve(e.target);
      });
    }, { threshold:.3 });
    items.forEach(el => obs.observe(el));
  }
  return { init };
})();

/* ══════════════════════════════════════════════════
   10. FILTRE PROJETS
══════════════════════════════════════════════════ */
const ProjectFilter = (() => {
  function init() {
    const btns  = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.projet-card');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
        btn.classList.add('active'); btn.setAttribute('aria-selected','true');
        const f = btn.dataset.filter;
        cards.forEach((c,i) => {
          const match = f==='all' || c.dataset.category.split(/\s+/).includes(f);
          c.classList.toggle('hidden', !match);
          if (match) c.style.transitionDelay = (i*.04)+'s';
          else c.style.transitionDelay = '0s';
        });
      });
    });
  }
  return { init };
})();

/* ══════════════════════════════════════════════════
   11. ONGLETS TIMELINE
══════════════════════════════════════════════════ */
const TimelineTabs = (() => {
  function init() {
    document.querySelectorAll('.timeline-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const t = tab.dataset.tab;
        document.querySelectorAll('.timeline-tab').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
        tab.classList.add('active'); tab.setAttribute('aria-selected','true');
        document.querySelectorAll('.timeline-panel').forEach(p => p.classList.toggle('active', p.id==='tab-'+t));
      });
    });
  }
  return { init };
})();

/* ══════════════════════════════════════════════════
   12. BACK TO TOP
══════════════════════════════════════════════════ */
const BackToTop = (() => {
  function init() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => { btn.hidden = window.scrollY <= 400; }, {passive:true});
    btn.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));
  }
  return { init };
})();

/* ══════════════════════════════════════════════════
   13. FORMULAIRE CONTACT (AJAX + PHP)
══════════════════════════════════════════════════ */
const ContactForm = (() => {
  function init() {
    const form    = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    const error   = document.getElementById('formError');
    const submitBtn = document.getElementById('submitBtn');

    if (!form) return;

    // Ajouter le spinner au bouton
    const spinner = document.createElement('span');
    spinner.className = 'btn-spinner';
    spinner.setAttribute('aria-hidden','true');
    submitBtn?.querySelector('span')?.insertAdjacentElement('afterend', spinner);

    form.addEventListener('submit', async e => {
      e.preventDefault();
      // Validation côté client
      let valid = true;
      form.querySelectorAll('[required]').forEach(f => {
        f.style.borderColor = '';
        if (!f.value.trim()) { f.style.borderColor='#ef4444'; valid=false; setTimeout(()=>f.style.borderColor='',3000); }
        if (f.type==='email' && f.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value)) {
          f.style.borderColor='#ef4444'; valid=false; setTimeout(()=>f.style.borderColor='',3000);
        }
      });
      if (!valid) return;

      // État loading
      submitBtn?.classList.add('btn--loading');
      submitBtn.disabled = true;
      success.hidden = true; error.hidden = true;

      try {
        const data = new FormData(form);
        const resp = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });
        const json = await resp.json().catch(() => null);
        if (resp.ok && json) {
          success.hidden = false;
          form.reset();
          setTimeout(() => success.hidden=true, 6000);
        } else {
          error.hidden = false;
          setTimeout(() => error.hidden=true, 6000);
        }
      } catch (_) {
        error.hidden = false;
        setTimeout(() => error.hidden=true, 6000);
      } finally {
        submitBtn?.classList.remove('btn--loading');
        submitBtn.disabled = false;
      }
    });
  }
  return { init };
})();

/* ══════════════════════════════════════════════════
   14. MODALES LÉGALES
══════════════════════════════════════════════════ */
const Modals = (() => {
  function setup(triggerId, modalId, overlayId) {
    const trigger = document.getElementById(triggerId);
    const modal   = document.getElementById(modalId);
    const overlay = document.getElementById(overlayId);
    const close   = modal?.querySelector('.modal-close');
    const open  = () => { modal.hidden=false; document.body.style.overflow='hidden'; setTimeout(()=>close?.focus(),100); };
    const shut  = () => { modal.hidden=true; document.body.style.overflow=''; trigger?.focus(); };
    trigger?.addEventListener('click', e => { e.preventDefault(); open(); });
    overlay?.addEventListener('click', shut);
    close?.addEventListener('click', shut);
    modal?.addEventListener('keydown', e => { if(e.key==='Escape') shut(); });
  }
  function init() {
    setup('mentionsLink','mentionsModal','mentionsOverlay');
    setup('politiqueLink','politiqueModal','politiqueOverlay');
  }
  return { init };
})();

/* ══════════════════════════════════════════════════
   15. MODALE PROJETS (étude de cas)
══════════════════════════════════════════════════ */
const ProjetModals = (() => {
  function init() {
    const modal   = document.getElementById('projetModal');
    const overlay = document.getElementById('projetOverlay');
    const content = document.getElementById('projetModalContent');
    const close   = modal?.querySelector('.modal-close');

    function shut() { modal.hidden=true; document.body.style.overflow=''; }
    overlay?.addEventListener('click', shut);
    close?.addEventListener('click', shut);
    modal?.addEventListener('keydown', e => { if(e.key==='Escape') shut(); });

    document.querySelectorAll('.projet-card').forEach(card => {
      card.addEventListener('click', () => {
        const d = card.dataset;
        const tools = d.outils ? d.outils.split(',').map(t=>`<span>${t.trim()}</span>`).join('') : '';
        const files = (d.images !== undefined ? d.images : 'vaina.png').split(',').map(s=>s.trim()).filter(Boolean);
        const isDrive = src => /drive\.google\.com\/file\/d\//.test(src);
        const isVideo = src => !isDrive(src) && /\.(mp4|mov|webm)$/i.test(src);
        const images = files.filter(f => !isVideo(f) && !isDrive(f));
        const videos = files.filter(isVideo);
        const driveVideos = files.filter(isDrive);
        const videoPlayers = videos.map(src => `<video class="projet-modal-video" src="${src}" controls preload="metadata"></video>`).join('')
          + driveVideos.map(src => {
              const id = src.match(/\/d\/([^/]+)/)?.[1];
              return `<iframe class="projet-modal-video projet-modal-video-drive" src="https://drive.google.com/file/d/${id}/preview" allow="autoplay" allowfullscreen></iframe>`;
            }).join('');
        const gallery = images.map(src => `<button type="button" class="projet-modal-thumb" data-lightbox-src="${src}" aria-label="Agrandir l'image"><img src="${src}" alt="${d.title}" loading="lazy" onerror="this.closest('.projet-modal-thumb').style.display='none'" /></button>`).join('');
        const docViewer = d.doc ? `<div class="projet-modal-doc-wrap"><iframe class="projet-modal-doc" src="${d.doc}" title="${d.title} — document complet"></iframe><a href="${d.doc}" target="_blank" rel="noopener noreferrer" class="projet-modal-doc-expand">Ouvrir en plein écran ↗</a></div>` : '';
        content.innerHTML = `
          <div class="projet-modal-header">
            <p class="projet-modal-category">${card.querySelector('.projet-category-badge')?.textContent||''}</p>
            <h2 class="projet-modal-title">${d.title||'Projet'}</h2>
          </div>
          ${docViewer}
          ${videoPlayers ? `<div class="projet-modal-videos">${videoPlayers}</div>` : ''}
          <div class="projet-modal-gallery">${gallery}</div>
          <div class="projet-modal-section" style="margin-top:1.5rem">
            <h4>📋 Description</h4>
            <p>${d.desc||''}</p>
          </div>
          <div class="projet-modal-section">
            <h4>🎯 Objectifs</h4>
            <p>${d.objectifs||''}</p>
          </div>
          <div class="projet-modal-section">
            <h4>🛠️ Outils utilisés</h4>
            <div class="projet-modal-tools">${tools}</div>
          </div>
          <div class="projet-modal-section">
            <h4>💡 Compétences développées</h4>
            <p>${d.competences||''}</p>
          </div>
          <div class="projet-modal-actions">
            ${d.lien ? `<a href="${d.lien}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="display:inline-flex">Voir le projet en ligne →</a>` : ''}
            ${d.download ? `<a href="${d.download}" download class="btn btn-secondary" style="display:inline-flex">${d.downloadLabel || 'Télécharger'}</a>` : ''}
          </div>
        `;
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
        close?.focus();
      });
    });
  }
  return { init };
})();

/* ══════════════════════════════════════════════════
   16. MODALE CLIENTS
══════════════════════════════════════════════════ */
const ClientModals = (() => {
  function init() {
    const modal   = document.getElementById('clientModal');
    const overlay = document.getElementById('clientOverlay');
    const content = document.getElementById('clientModalContent');
    const close   = modal?.querySelector('.modal-close');

    function shut() { modal.hidden=true; document.body.style.overflow=''; }
    overlay?.addEventListener('click', shut);
    close?.addEventListener('click', shut);
    modal?.addEventListener('keydown', e => { if(e.key==='Escape') shut(); });

    document.querySelectorAll('.client-card').forEach(card => {
      card.addEventListener('click', () => {
        const d = card.dataset;
        const hasIg = !!d.clientIg;
        const media = [];
        if (hasIg && d.clientImgIg) media.push({ src: d.clientImgIg, label: '📷 Aperçu du feed Instagram' });
        if (d.clientImgFb) media.push({ src: d.clientImgFb, label: '📘 Aperçu Facebook' });
        const mediaHtml = media.map(m => `
          <button type="button" class="client-modal-thumb" data-lightbox-src="${m.src}" aria-label="Agrandir ${m.label}">
            <img src="${m.src}" alt="${m.label} — ${d.clientName||''}" loading="lazy" />
            <span>${m.label}</span>
          </button>
        `).join('');
        content.innerHTML = `
          <div class="client-modal-logo">${d.clientLogo||'🏢'}</div>
          <h2 class="client-modal-name">${d.clientName||'Client'}</h2>
          <p class="client-modal-tag">Mission : Création de contenus visuels ${hasIg ? 'Facebook & Instagram' : 'Facebook'} · Client via 10Gitallab</p>
          ${mediaHtml ? `<div class="client-modal-media">${mediaHtml}</div>` : ''}
          <div class="client-modal-section">
            <h4>🏢 Présentation</h4>
            <p>${d.clientDesc||''}</p>
          </div>
          <div class="client-modal-section">
            <h4>🎯 Ma mission</h4>
            <p>${d.clientMission||''}</p>
          </div>
          <div class="client-modal-section">
            <h4>📘 Visuels Facebook</h4>
            <p>${d.clientFb||''}</p>
          </div>
          ${hasIg ? `
          <div class="client-modal-section">
            <h4>📷 Visuels Instagram</h4>
            <p>${d.clientIg}</p>
          </div>` : ''}
          <div class="client-modal-results">
            <h4>✅ Résultats obtenus</h4>
            <p>${d.clientResults||''}</p>
          </div>
        `;
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
        close?.focus();
      });
    });
  }
  return { init };
})();

/* ══════════════════════════════════════════════════
   16b. LIGHTBOX (agrandissement des images cliquables)
══════════════════════════════════════════════════ */
const Lightbox = (() => {
  let modal, img, close;
  function build() {
    modal = document.createElement('div');
    modal.className = 'lightbox';
    modal.hidden = true;
    modal.innerHTML = `
      <div class="lightbox-overlay"></div>
      <button type="button" class="lightbox-close" aria-label="Fermer">✕</button>
      <img class="lightbox-img" alt="" />
    `;
    document.body.appendChild(modal);
    img = modal.querySelector('.lightbox-img');
    close = modal.querySelector('.lightbox-close');
    modal.querySelector('.lightbox-overlay').addEventListener('click', shut);
    close.addEventListener('click', shut);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) shut(); });
  }
  function open(src, alt) {
    img.src = src; img.alt = alt || '';
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function shut() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }
  function init() {
    build();
    document.addEventListener('click', e => {
      const trigger = e.target.closest('[data-lightbox-src]');
      if (!trigger) return;
      open(trigger.dataset.lightboxSrc, trigger.getAttribute('aria-label'));
    });
  }
  return { init };
})();

/* ══════════════════════════════════════════════════
   17. PARTICLES, PAPILLONS, PÉTALES, ÉTOILES
══════════════════════════════════════════════════ */
const Decoratives = (() => {
  function particles() {
    const c = document.getElementById('particlesContainer');
    if (!c) return;
    const n = window.innerWidth < 768 ? 6 : 12;
    for (let i=0; i<n; i++) {
      const p = document.createElement('div'); p.classList.add('particle');
      const sz = Math.random()*40+10;
      p.style.cssText=`width:${sz}px;height:${sz}px;left:${Math.random()*100}%;animation-duration:${Math.random()*15+8}s;animation-delay:${Math.random()*10}s`;
      c.appendChild(p);
    }
  }
  function butterflies() {
    const c = document.getElementById('butterfliesContainer');
    if (!c) return;
    const spawn = () => {
      const el = document.createElement('div'); el.classList.add('butterfly');
      el.textContent = ['🦋','🌸','✨','🌺'][Math.floor(Math.random()*4)];
      const dur = Math.random()*12+10;
      el.style.cssText=`top:${Math.random()*70+10}%;animation-duration:${dur}s;font-size:${Math.random()*.8+1}rem`;
      c.appendChild(el);
      setTimeout(() => el.remove(), dur*1000);
    };
    setTimeout(() => { spawn(); setInterval(spawn, Math.random()*12000+6000); }, 4000);
  }
  function petals() {
    const c = document.getElementById('petalsContainer');
    if (!c) return;
    for (let i=0; i<(window.innerWidth<768?5:9); i++) {
      const p = document.createElement('div'); p.classList.add('petal');
      p.style.cssText=`left:${Math.random()*100}%;animation-duration:${Math.random()*10+8}s;animation-delay:${Math.random()*15}s;transform:rotate(${Math.random()*360}deg)`;
      c.appendChild(p);
    }
  }
  function stars() {
    const c = document.getElementById('starsContainer');
    if (!c) return;
    for (let i=0; i<(window.innerWidth<768?10:20); i++) {
      const s = document.createElement('div'); s.classList.add('star-deco');
      s.textContent = ['✦','✧','⋆','✶','⭒'][Math.floor(Math.random()*5)];
      s.style.cssText=`left:${Math.random()*95}%;top:${Math.random()*95}%;animation-duration:${Math.random()*5+3}s;animation-delay:${Math.random()*8}s`;
      c.appendChild(s);
    }
  }
  function init() { particles(); butterflies(); petals(); stars(); }
  return { init };
})();

/* ══════════════════════════════════════════════════
   18. PARALLAXE HERO
══════════════════════════════════════════════════ */
const Parallax = (() => {
  function init() {
    if (window.innerWidth < 768) return;
    if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    let tick = false;
    window.addEventListener('scroll', () => {
      if (!tick) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          const hc = document.querySelector('.hero-content');
          const hv = document.querySelector('.hero-visual');
          if (hc) hc.style.transform = `translateY(${y*.15}px)`;
          if (hv) hv.style.transform = `translateY(${y*.08}px)`;
          tick = false;
        });
        tick = true;
      }
    }, {passive:true});
  }
  return { init };
})();

/* ══════════════════════════════════════════════════
   19. SMOOTH SCROLL
══════════════════════════════════════════════════ */
const SmoothNav = (() => {
  function init() {
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        if (href === '#') return;
        const t = document.querySelector(href);
        if (!t) return;
        e.preventDefault();
        window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - navH, behavior:'smooth' });
      });
    });
  }
  return { init };
})();

/* ══════════════════════════════════════════════════
   20. RIPPLE
══════════════════════════════════════════════════ */
const Ripple = (() => {
  function init() {
    const style = document.createElement('style');
    style.textContent = `@keyframes rippleAnim{to{transform:scale(4);opacity:0}}`;
    document.head.appendChild(style);
    document.querySelectorAll('.btn,.btn-cv,.btn-nav-cta,.filter-btn,.timeline-tab').forEach(btn => {
      btn.addEventListener('click', e => {
        btn.querySelectorAll('.ripple').forEach(r=>r.remove());
        const rect=btn.getBoundingClientRect(), sz=Math.max(rect.width,rect.height);
        const r=document.createElement('span');
        r.className='ripple';
        r.style.cssText=`position:absolute;width:${sz}px;height:${sz}px;left:${e.clientX-rect.left-sz/2}px;top:${e.clientY-rect.top-sz/2}px;border-radius:50%;background:rgba(255,255,255,.28);transform:scale(0);animation:rippleAnim 600ms linear;pointer-events:none`;
        btn.style.overflow='hidden';
        btn.appendChild(r);
        r.addEventListener('animationend',()=>r.remove());
      });
    });
  }
  return { init };
})();

/* ══════════════════════════════════════════════════
   21. LAZY IMAGES
══════════════════════════════════════════════════ */
const LazyImages = (() => {
  function init() {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      img.style.opacity='0'; img.style.transition='opacity .6s ease';
      if (img.complete) img.style.opacity='1';
      else img.addEventListener('load',()=>img.style.opacity='1');
    });
  }
  return { init };
})();

/* ══════════════════════════════════════════════════
   22. SKIP LINK
══════════════════════════════════════════════════ */
const SkipLink = (() => {
  function init() {
    const s=document.createElement('a');
    s.href='#main-content'; s.textContent='Aller au contenu principal';
    s.style.cssText='position:fixed;top:-100px;left:1rem;background:var(--choco);color:#fff;padding:.75rem 1.5rem;border-radius:0 0 16px 16px;font-weight:700;z-index:9999;transition:top .2s';
    s.addEventListener('focus',()=>s.style.top='0');
    s.addEventListener('blur',()=>s.style.top='-100px');
    document.body.prepend(s);
  }
  return { init };
})();

/* ══════════════════════════════════════════════════
   INIT GLOBAL
══════════════════════════════════════════════════ */
function initAll() {
  ThemeManager.init();
  MagicMusic.init();
  CursorManager.init();
  HeaderManager.init();
  BurgerMenu.init();
  NameAnimation.init();
  Typewriter.init();
  ScrollReveal.init();
  AnimatedCounters.init();
  SkillBars.init();
  ProjectFilter.init();
  TimelineTabs.init();
  BackToTop.init();
  ContactForm.init();
  Modals.init();
  ProjetModals.init();
  ClientModals.init();
  Lightbox.init();
  Decoratives.init();
  Parallax.init();
  SmoothNav.init();
  Ripple.init();
  LazyImages.init();
  SkipLink.init();
  console.log('🌸 Portfolio Vaïna — v2 chargé');
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', initAll)
  : initAll();