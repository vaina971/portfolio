/**
 * VAÏNA CHARABIE — Portfolio JS v2
 * Vanilla JavaScript ES2020+
 */
'use strict';

/* ══════════════════════════════════════════════════
   0. I18N — FR / EN
══════════════════════════════════════════════════ */
const I18n = (() => {
  const KEY = 'vaina-lang';
  let lang = 'fr';

  const META = {
    fr: {
      title: 'Vaïna Charabie — Étudiante en BUT MMI & Future Graphiste',
      desc: "Vaïna Charabie — Web Designer & Designer Graphique. Portfolio créatif d'une étudiante BUT MMI passionnée par la création visuelle."
    },
    en: {
      title: 'Vaïna Charabie — BUT MMI Student & Future Graphic Designer',
      desc: 'Vaïna Charabie — Web Designer & Graphic Designer. Creative portfolio of an MMI student passionate about visual creation.'
    }
  };

  function applyStatic() {
    document.querySelectorAll('[data-en]').forEach(el => {
      if (el.dataset.fr === undefined) el.dataset.fr = el.innerHTML;
      el.innerHTML = lang === 'en' ? el.dataset.en : el.dataset.fr;
    });
    document.querySelectorAll('[data-en-aria]').forEach(el => {
      if (el.dataset.frAria === undefined) el.dataset.frAria = el.getAttribute('aria-label') || '';
      el.setAttribute('aria-label', lang === 'en' ? el.dataset.enAria : el.dataset.frAria);
    });
    document.querySelectorAll('[data-en-placeholder]').forEach(el => {
      if (el.dataset.frPlaceholder === undefined) el.dataset.frPlaceholder = el.getAttribute('placeholder') || '';
      el.setAttribute('placeholder', lang === 'en' ? el.dataset.enPlaceholder : el.dataset.frPlaceholder);
    });
  }

  function applyMeta() {
    const m = META[lang];
    document.title = m.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', m.desc);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', m.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', m.desc);
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', lang === 'en' ? 'en_US' : 'fr_FR');
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', m.title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', m.desc);
  }

  function apply(l, { persist = true } = {}) {
    lang = l;
    document.documentElement.lang = lang;
    if (persist) localStorage.setItem(KEY, lang);
    applyStatic();
    applyMeta();
    const cur = document.getElementById('langCurrent');
    if (cur) cur.textContent = lang === 'en' ? 'EN' : 'FR';
    document.getElementById('langToggle')?.setAttribute('aria-label', lang === 'en' ? 'Switch to French' : 'Passer en anglais');
    const mobileToggle = document.getElementById('mobileLangToggle');
    if (mobileToggle) mobileToggle.textContent = lang === 'en' ? '🇫🇷 Passer en français' : '🇬🇧 Switch to English';
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }

  function init() {
    const saved = localStorage.getItem(KEY);
    apply(saved === 'en' ? 'en' : 'fr', { persist: false });
    const toggle = () => apply(lang === 'fr' ? 'en' : 'fr');
    document.getElementById('langToggle')?.addEventListener('click', toggle);
    document.getElementById('mobileLangToggle')?.addEventListener('click', toggle);
  }

  return { init, get: () => lang };
})();

/* ══════════════════════════════════════════════════
   0b. INTRO — FLEUR STYLISÉE
══════════════════════════════════════════════════ */
const IntroAnimation = (() => {
  const KEY = 'vaina-intro-seen';
  let overlay, finished = false, autoTimer = null;

  function lockScroll(lock) {
    document.documentElement.style.overflow = lock ? 'hidden' : '';
  }

  function finish() {
    if (finished || !overlay) return;
    finished = true;
    clearTimeout(autoTimer);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    overlay.classList.add('is-opening');
    lockScroll(false);
    sessionStorage.setItem(KEY, '1');
    const cleanup = () => { overlay.hidden = true; };
    if (reduced) cleanup();
    else setTimeout(cleanup, 1000);
  }

  function init() {
    overlay = document.getElementById('introOverlay');
    if (!overlay) return;

    if (sessionStorage.getItem(KEY) === '1') {
      finished = true;
      overlay.hidden = true;
      return;
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { finish(); return; }

    lockScroll(true);
    const skip = document.getElementById('introSkip');
    skip?.addEventListener('click', finish);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') finish(); }, { once: true });
    autoTimer = setTimeout(finish, 5000);
  }

  return { init };
})();

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
   « Dream Pop Lofi » — DRAGON-STUDIO (Pixabay)
   Pixabay Content License — pixabay.com/service/license-summary/
══════════════════════════════════════════════════ */
const MagicMusic = (() => {
  let audio, playing = false;

  function init() {
    const btn = document.getElementById('musicToggle');
    if (!btn) return;
    audio = new Audio('assets/audio/dream-pop-lofi.mp3');
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
  function init() {
    if (!cur || !fol) return;
    if (window.matchMedia('(pointer:coarse)').matches) return;
    document.addEventListener('mousemove', e => {
      const x = e.clientX + 'px', y = e.clientY + 'px';
      cur.style.left = x; cur.style.top = y;
      fol.style.left = x; fol.style.top = y;
    });
    document.querySelectorAll('a,button,.projet-card,.service-card,.tool-card,.filter-btn,.timeline-tab,.client-card').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
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
  const WORDS = {
    fr: ['Designer Graphique','Créatrice Visuelle','UX/UI Designer','Étudiante MMI','Passionnée du Design'],
    en: ['Graphic Designer','Visual Creator','UX/UI Designer','MMI Student','Design Enthusiast']
  };
  let wi=0, ci=0, del=false, tid=null;
  function words() { return WORDS[I18n.get()] || WORDS.fr; }
  function type() {
    const el = document.getElementById('typewriter');
    if (!el) return;
    const list = words();
    const w = list[wi % list.length];
    if (!del) {
      el.textContent = w.slice(0, ci+1); ci++;
      if (ci === w.length) { del=true; tid=setTimeout(type,2200); return; }
    } else {
      el.textContent = w.slice(0, ci-1); ci--;
      if (ci === 0) { del=false; wi=(wi+1)%list.length; }
    }
    tid = setTimeout(type, del ? 55 : 90);
  }
  function init() {
    setTimeout(type, 1500);
    document.addEventListener('langchange', () => { wi = 0; ci = 0; del = false; });
  }
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
    // consentPolicyLink lives inside i18n-swapped markup (recreated on language toggle) — use delegation
    document.addEventListener('click', e => {
      if (!e.target.closest('#consentPolicyLink')) return;
      e.preventDefault();
      const modal = document.getElementById('politiqueModal');
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      setTimeout(() => modal.querySelector('.modal-close')?.focus(), 100);
    });
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

    const LABELS = {
      fr: { desc:'📋 Description', objectifs:'🎯 Objectifs', outils:'🛠️ Outils utilisés', competences:'💡 Compétences développées', voir:'Voir le projet en ligne →', dl:'Télécharger', fullscreen:'Ouvrir en plein écran ↗', doc:'document complet', enlarge:"Agrandir l'image" },
      en: { desc:'📋 Description', objectifs:'🎯 Objectives', outils:'🛠️ Tools used', competences:'💡 Skills developed', voir:'View project online →', dl:'Download', fullscreen:'Open fullscreen ↗', doc:'full document', enlarge:'Enlarge image' }
    };

    document.querySelectorAll('.projet-card').forEach(card => {
      card.addEventListener('click', () => {
        const d = card.dataset;
        const lang = I18n.get();
        const L = LABELS[lang] || LABELS.fr;
        const pick = (fr, en) => (lang === 'en' && en) ? en : fr;
        const title = pick(d.title, d.titleEn);
        const desc = pick(d.desc, d.descEn);
        const objectifs = pick(d.objectifs, d.objectifsEn);
        const competences = pick(d.competences, d.competencesEn);
        const downloadLabel = pick(d.downloadLabel, d.downloadLabelEn) || L.dl;
        const category = pick(card.querySelector('.projet-category-badge')?.dataset.fr ?? card.querySelector('.projet-category-badge')?.textContent, card.querySelector('.projet-category-badge')?.dataset.en);
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
        const gallery = images.map(src => `<button type="button" class="projet-modal-thumb" data-lightbox-src="${src}" aria-label="${L.enlarge}"><img src="${src}" alt="${title}" loading="lazy" onerror="this.closest('.projet-modal-thumb').style.display='none'" /></button>`).join('');
        const docViewer = d.doc ? `<div class="projet-modal-doc-wrap"><iframe class="projet-modal-doc" src="${d.doc}" title="${title} — ${L.doc}"></iframe><a href="${d.doc}" target="_blank" rel="noopener noreferrer" class="projet-modal-doc-expand">${L.fullscreen}</a></div>` : '';
        content.innerHTML = `
          <div class="projet-modal-header">
            <p class="projet-modal-category">${category||''}</p>
            <h2 class="projet-modal-title">${title||'Projet'}</h2>
          </div>
          ${docViewer}
          ${videoPlayers ? `<div class="projet-modal-videos">${videoPlayers}</div>` : ''}
          <div class="projet-modal-gallery">${gallery}</div>
          <div class="projet-modal-section" style="margin-top:1.5rem">
            <h4>${L.desc}</h4>
            <p>${desc||''}</p>
          </div>
          <div class="projet-modal-section">
            <h4>${L.objectifs}</h4>
            <p>${objectifs||''}</p>
          </div>
          <div class="projet-modal-section">
            <h4>${L.outils}</h4>
            <div class="projet-modal-tools">${tools}</div>
          </div>
          <div class="projet-modal-section">
            <h4>${L.competences}</h4>
            <p>${competences||''}</p>
          </div>
          <div class="projet-modal-actions">
            ${d.lien ? `<a href="${d.lien}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="display:inline-flex">${L.voir}</a>` : ''}
            ${d.download ? `<a href="${d.download}" download class="btn btn-secondary" style="display:inline-flex">${downloadLabel}</a>` : ''}
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

    const LABELS = {
      fr: { ig:'📷 Aperçu du feed Instagram', fb:'📘 Aperçu Facebook', enlarge:'Agrandir', mission:'Mission : Création de contenus visuels', both:'Facebook & Instagram', fbOnly:'Facebook', via:'Client via 10Gitallab', presentation:'🏢 Présentation', maMission:'🎯 Ma mission', visuelsFb:'📘 Visuels Facebook', visuelsIg:'📷 Visuels Instagram', resultats:'✅ Résultats obtenus' },
      en: { ig:'📷 Instagram feed preview', fb:'📘 Facebook preview', enlarge:'Enlarge', mission:'Mission: Creating visual content for', both:'Facebook & Instagram', fbOnly:'Facebook', via:'Client via 10Gitallab', presentation:'🏢 Overview', maMission:'🎯 My mission', visuelsFb:'📘 Facebook visuals', visuelsIg:'📷 Instagram visuals', resultats:'✅ Results achieved' }
    };

    document.querySelectorAll('.client-card').forEach(card => {
      card.addEventListener('click', () => {
        const d = card.dataset;
        const lang = I18n.get();
        const L = LABELS[lang] || LABELS.fr;
        const pick = (fr, en) => (lang === 'en' && en) ? en : fr;
        const hasIg = !!d.clientIg;
        const desc = pick(d.clientDesc, d.clientDescEn);
        const mission = pick(d.clientMission, d.clientMissionEn);
        const fb = pick(d.clientFb, d.clientFbEn);
        const ig = pick(d.clientIg, d.clientIgEn);
        const results = pick(d.clientResults, d.clientResultsEn);
        const media = [];
        if (hasIg && d.clientImgIg) media.push({ src: d.clientImgIg, label: L.ig });
        if (d.clientImgFb) media.push({ src: d.clientImgFb, label: L.fb });
        const mediaHtml = media.map(m => `
          <button type="button" class="client-modal-thumb" data-lightbox-src="${m.src}" aria-label="${L.enlarge} ${m.label}">
            <img src="${m.src}" alt="${m.label} — ${d.clientName||''}" loading="lazy" />
            <span>${m.label}</span>
          </button>
        `).join('');
        const IG_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>';
        const FB_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>';
        const socials = [];
        if (d.clientInstagram) socials.push({ href: d.clientInstagram, icon: IG_ICON, label: 'Instagram' });
        if (d.clientFacebook) socials.push({ href: d.clientFacebook, icon: FB_ICON, label: 'Facebook' });
        const socialsHtml = socials.length ? `<div class="client-modal-socials">${socials.map(s => `<a href="${s.href}" target="_blank" rel="noopener noreferrer" class="client-modal-social" aria-label="${s.label}">${s.icon}<span>${s.label}</span></a>`).join('')}</div>` : '';
        content.innerHTML = `
          <div class="client-modal-logo">${d.clientLogo||'🏢'}</div>
          <h2 class="client-modal-name">${d.clientName||'Client'}</h2>
          <p class="client-modal-tag">${L.mission} ${hasIg ? L.both : L.fbOnly} · ${L.via}</p>
          ${socialsHtml}
          ${mediaHtml ? `<div class="client-modal-media">${mediaHtml}</div>` : ''}
          <div class="client-modal-section">
            <h4>${L.presentation}</h4>
            <p>${desc||''}</p>
          </div>
          <div class="client-modal-section">
            <h4>${L.maMission}</h4>
            <p>${mission||''}</p>
          </div>
          <div class="client-modal-section">
            <h4>${L.visuelsFb}</h4>
            <p>${fb||''}</p>
          </div>
          ${hasIg ? `
          <div class="client-modal-section">
            <h4>${L.visuelsIg}</h4>
            <p>${ig}</p>
          </div>` : ''}
          <div class="client-modal-results">
            <h4>${L.resultats}</h4>
            <p>${results||''}</p>
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
  const TXT = { fr: 'Aller au contenu principal', en: 'Skip to main content' };
  function init() {
    const s=document.createElement('a');
    s.href='#main-content'; s.textContent=TXT[I18n.get()] || TXT.fr;
    s.style.cssText='position:fixed;top:-100px;left:1rem;background:var(--choco);color:#fff;padding:.75rem 1.5rem;border-radius:0 0 16px 16px;font-weight:700;z-index:9999;transition:top .2s';
    s.addEventListener('focus',()=>s.style.top='0');
    s.addEventListener('blur',()=>s.style.top='-100px');
    document.body.prepend(s);
    document.addEventListener('langchange', e => { s.textContent = TXT[e.detail.lang] || TXT.fr; });
  }
  return { init };
})();

/* ══════════════════════════════════════════════════
   22b. ANNÉE FOOTER
══════════════════════════════════════════════════ */
const FooterYear = (() => {
  function init() {
    const el = document.getElementById('footerYear');
    if (!el) return;
    const start = 2025, now = new Date().getFullYear();
    el.textContent = now > start ? `${start}–${now}` : String(start);
  }
  return { init };
})();

/* ══════════════════════════════════════════════════
   INIT GLOBAL
══════════════════════════════════════════════════ */
function initAll() {
  I18n.init();
  IntroAnimation.init();
  FooterYear.init();
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