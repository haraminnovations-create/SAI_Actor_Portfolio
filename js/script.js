/* ==========================================================================
   YORVIK SHARJITH SHAANK — 3D CINEMATIC PORTFOLIO
   Vanilla JavaScript. No libraries, no build step.
   ----------------------------------------------------------------------
   01 Helpers               07 Gallery filter + lightbox
   02 Placeholders          08 Flip cards
   03 Sound engine          09 Video
   04 Intro (3D cube)       10 Cursor
   05 Header / reveal       11 Form · vCard · PDF
   06 3D tilt + coverflow   12 Boot
   02b Frame fit            06b Role rotators
   ========================================================================== */

(function () {
  'use strict';

  /* ======================================================================
     01. HELPERS
     ====================================================================== */
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const COARSE  = matchMedia('(pointer: coarse)').matches;
  const NO3D    = REDUCED || COARSE;

  function raf(fn) {
    let q = false;
    return function (...a) {
      if (q) return;
      q = true;
      requestAnimationFrame(() => { q = false; fn.apply(this, a); });
    };
  }

  const lock = (on) => document.body.classList.toggle('lock', on);
  const pad2 = (n) => String(n).padStart(2, '0');
  const clamp = (v, a, b) => Math.min(Math.max(v, a), b);

  /* ======================================================================
     02. IMAGE PLACEHOLDERS
     Any photograph not yet in /images becomes a labelled plate in the
     palette, so the 3D layout is complete before the shoot files land.
     ====================================================================== */
  function makePlaceholder(img) {
    if (img.dataset.phDone) return;
    img.dataset.phDone = '1';

    const label = (img.dataset.ph || 'IMAGE').replace(/&/g, 'and').replace(/[<>"]/g, '');

    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0%" stop-color="#1a4038"/><stop offset="100%" stop-color="#0b1f1a"/>' +
      '</linearGradient></defs>' +
      '<rect width="900" height="600" fill="url(#g)"/>' +
      '<rect x="26" y="26" width="848" height="548" rx="14" fill="none" ' +
      'stroke="#d4af37" stroke-opacity="0.4" stroke-dasharray="8 10"/>' +
      '<path d="M450 246l8 20 20 8-20 8-8 20-8-20-20-8 20-8z" fill="#d4af37" fill-opacity="0.75"/>' +
      '<text x="450" y="336" fill="#c0c0c0" font-family="Inter,Arial,sans-serif" ' +
      'font-size="26" font-weight="600" letter-spacing="4" text-anchor="middle">' +
      label + '</text></svg>';

    img.removeAttribute('srcset');
    img.onerror = null;
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    img.classList.add('ph');
    if (!img.alt) img.alt = label;
  }

  function initPlaceholders() {
    $$('img[data-ph]').forEach((img) => {
      img.addEventListener('error', () => makePlaceholder(img), { once: true });
      if (img.complete && img.naturalWidth === 0) makePlaceholder(img);
    });
  }

  /* ======================================================================
     02b. FRAME FIT — every photograph whole inside its frame
     The stills run from 9:20 phone video to 3:2 stage frames, so no single
     crop could hold them all: heads and feet were being cut off. The CSS
     now CONTAINS every picture, and this fills the space the frame shape
     leaves over with a blurred, darkened copy of that same picture, so a
     frame still reads as a photograph rather than as a letterbox.

     Runs after the coverflow builds, so its frames are covered too.
     ====================================================================== */
  const FIT_FRAMES = [
    '.stack__face', '.pc__stack', '.pc', '.cf__i',
    '.cred__art', '.mc__img', '.gi', '.player__in'
  ].join(',');

  /** Paint the fill behind `frame` from the picture currently showing in it. */
  function paintFill(frame, img) {
    let bg = frame.firstElementChild;
    if (!bg || !bg.classList.contains('fitbg')) {
      bg = document.createElement('span');
      bg.className = 'fitbg';
      bg.setAttribute('aria-hidden', 'true');
      frame.prepend(bg);
    }
    // a placeholder plate is already a full-bleed graphic — leave it bare
    const plate = img.classList.contains('ph');
    bg.classList.toggle('off', plate);
    bg.style.backgroundImage = plate ? '' : 'url("' + img.src.replace(/"/g, '%22') + '")';
  }

  function initFit() {
    $$(FIT_FRAMES).forEach((frame) => {
      // a .pc that only wraps a .pc__stack is skipped — the stack is the frame
      const shots = $$(':scope > img', frame);
      if (!shots.length) return;

      const showing = () => shots.find((s) => s.classList.contains('on')) || shots[0];
      const sync = () => paintFill(frame, showing());

      sync();
      shots.forEach((img) => {
        if (!img.complete) img.addEventListener('load', sync, { once: true });
        // makePlaceholder swaps the src in on error — repaint once it has
        img.addEventListener('error', () => setTimeout(sync, 0));
      });

      // a self-turning card changes picture on its own: follow the .on class
      if (shots.length > 1) {
        new MutationObserver(sync)
          .observe(frame, { attributes: true, attributeFilter: ['class'], subtree: true });
      }
    });

    // frames are laid out from the sizes stamped on the tags, then measured
    // again whenever the measure under them can have changed
    const settle = () => requestAnimationFrame(() => { justifyFrames(); trueShape(); fitGalleryRows(); });
    settle();
    window.addEventListener('load', settle);
    let t = null;
    window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(settle, 180); });
    $$('.fb[data-f]').forEach((b) => b.addEventListener('click', () => setTimeout(settle, 60)));
  }

  /** Give every gallery tile the height its own photograph asks for.
      A tile's width is fixed by its column span; its height is free, because
      the grid runs on 110px rows. So a standing portrait is given a tall
      tile and a stage frame a wide one, and the fill behind is left with
      almost nothing to cover. Re-measured on resize, so it holds at every
      breakpoint. */
  function fitGalleryRows() {
    const gg = $('#gg');
    if (!gg) return;
    const cs = getComputedStyle(gg);
    const row = parseFloat(cs.gridAutoRows) || 110;
    const gap = parseFloat(cs.rowGap) || 14;
    if (!row) return;

    $$('.gi', gg).forEach((tile) => {
      const img = tile.querySelector('img');
      if (!img || img.classList.contains('ph')) return;
      const iw = Number(img.getAttribute('width'))  || img.naturalWidth;
      const ih = Number(img.getAttribute('height')) || img.naturalHeight;
      const w = tile.getBoundingClientRect().width;
      if (!w || !iw || !ih) return;                     // filtered out of sight
      const want = w * ih / iw;
      const rows = clamp(Math.round((want + gap) / (row + gap)), 3, 44);
      tile.style.gridRow = 'span ' + rows;   // shorthand, as the sheet writes it
    });

    // the text tiles between the pictures are sized from what they actually
    // say, so the finer row step never clips or strands them
    $$('.gnote', gg).forEach((note) => {
      const pad = parseFloat(getComputedStyle(note).paddingTop) * 2;
      const kids = $$(':scope > *', note);
      if (!kids.length) return;
      const inner = kids.reduce((s, k) => s + k.getBoundingClientRect().height, 0);
      const lead = (kids.length - 1) * (parseFloat(getComputedStyle(note).rowGap) || 0);
      note.style.gridRow = 'span ' + clamp(Math.ceil((inner + lead + pad + gap) / (row + gap)), 1, 40);
    });
  }

  /* ======================================================================
     02c. TRUE-SHAPE FRAMES — a card cut to its own photograph
     A card no longer imposes one shape on every picture. Each frame takes
     its photograph's own proportion — wide for a stage frame, standing for
     a portrait — and then each row is justified to the full measure, the
     way prints are hung: the heights within a row agree, the widths do not.
     Nothing is cropped and nothing is padded.

     Every <img> carries its real width and height, so a row can be laid out
     before a single picture has downloaded — no reflow as they arrive.
     ====================================================================== */

  /** The proportion a frame should take. A card that turns over three
      photographs of different shapes is given the middle ground of the
      three, and its blurred fill covers what is left. */
  function shapeOf(card) {
    const shots = $$('img', card);
    if (!shots.length) return 0;
    let logs = 0, n = 0;
    shots.forEach((img) => {
      const w = Number(img.getAttribute('width'))  || img.naturalWidth;
      const h = Number(img.getAttribute('height')) || img.naturalHeight;
      if (w > 0 && h > 0) { logs += Math.log(w / h); n++; }
    });
    return n ? Math.exp(logs / n) : 0;
  }

  /** The frames that hold a single picture on their own — the hero plate,
      the screen-credit print, each reel poster — take that picture's shape
      too, so nothing is left standing in a box cut for something else. */
  function trueShape() {
    $$('.stack, .cred__art, .mc__img, .player__in').forEach((frame) => {
      const r = shapeOf(frame);
      if (r) frame.style.setProperty('--ar', r.toFixed(4));
    });
  }

  function justifyFrames() {
    $$('.cards, .rgrid').forEach((wall) => {
      const cards = $$(':scope > .pc', wall);
      if (cards.length < 2) return;

      const shape = cards.map(shapeOf);
      if (shape.some((r) => !r)) return;          // a picture has no size yet

      wall.classList.add('fitrow');
      const cs = getComputedStyle(wall);
      const gap = parseFloat(cs.columnGap) || 16;
      const W = wall.clientWidth;
      if (W < 40) return;

      // a comfortable row height for this measure, and the tallest a row is
      // ever allowed to grow when it is the trailing one
      const target = clamp(W / 3.1, 210, 430);
      const ceiling = clamp(W / 1.7, 340, 720);

      // a small curated set — the four frames of a rasa, the three of a role —
      // is one row by intent, so it is held together wherever there is room
      // for it, and split evenly rather than raggedly when there is not.
      // Longer walls are packed instead:
      // fill a row until one more frame would squeeze it too short.
      const rows = [];
      const all = shape.map((_, i) => i);
      const total = (ix) => ix.reduce((s, i) => s + shape[i], 0);

      if (cards.length === 4 && W < 680) {
        // on a phone four across would be four thumbnails: two and two
        rows.push({ line: all.slice(0, 2), sum: total(all.slice(0, 2)), short: true });
        rows.push({ line: all.slice(2),    sum: total(all.slice(2)),    short: true });
      } else if (cards.length <= 4) {
        rows.push({ line: all, sum: total(all), short: true });
      } else {
        let line = [], sum = 0;
        shape.forEach((r, i) => {
          line.push(i); sum += r;
          if ((W - gap * (line.length - 1)) / sum <= target) {
            rows.push({ line, sum }); line = []; sum = 0;
          }
        });
        if (line.length) rows.push({ line, sum, short: true });
      }

      rows.forEach(({ line, sum, short }) => {
        const full = (W - gap * (line.length - 1)) / sum;
        // a trailing row still spans the measure; only a single leftover frame
        // is held back, since one picture blown up full width reads as a fault
        const h = short ? (line.length < 2 ? target : Math.min(full, ceiling)) : full;

        line.forEach((i) => {
          // floored, never rounded up: a row can then only fall a pixel or two
          // short of the measure — which the centred wall absorbs — and never
          // overflow it, which would drop a frame onto a line of its own
          const w = Math.floor(h * shape[i]);
          cards[i].style.width = w + 'px';
          cards[i].style.setProperty('--ar', shape[i].toFixed(4));
        });
      });
    });
  }

  /* ======================================================================
     03. SOUND ENGINE
     Interaction signatures are synthesised with the Web Audio API — the
     site ships no click-sound files. Silent until the visitor opts in.
     ====================================================================== */
  const Sound = (function () {
    let ctx = null, on = false, last = 0;
    const voice = $('#voice'), amb = $('#ambience');

    function ensure() {
      if (ctx) return ctx;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      return ctx;
    }

    function blip(kind) {
      if (!on || REDUCED) return;
      const c = ensure();
      if (!c) return;
      if (c.state === 'suspended') c.resume();

      const now = performance.now();
      if (now - last < 90) return;
      last = now;

      const t = c.currentTime;
      const osc = c.createOscillator(), gain = c.createGain(), filt = c.createBiquadFilter();
      filt.type = 'lowpass'; filt.frequency.value = 2600;

      const spec = {
        tap:   { type: 'sine',     f0: 880, f1: 660, dur: 0.16, vol: 0.05 },
        enter: { type: 'triangle', f0: 440, f1: 880, dur: 0.34, vol: 0.07 },
        move:  { type: 'sine',     f0: 620, f1: 560, dur: 0.12, vol: 0.03 }
      }[kind] || { type: 'sine', f0: 800, f1: 640, dur: 0.16, vol: 0.045 };

      osc.type = spec.type;
      osc.frequency.setValueAtTime(spec.f0, t);
      osc.frequency.exponentialRampToValueAtTime(spec.f1, t + spec.dur);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(spec.vol, t + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + spec.dur);

      osc.connect(filt); filt.connect(gain); gain.connect(c.destination);
      osc.start(t); osc.stop(t + spec.dur + 0.02);
    }

    function set(state) {
      on = state;
      const btn = $('#sndBtn'), icon = $('#sndIcon');
      if (btn) btn.setAttribute('aria-pressed', String(on));
      if (icon) icon.setAttribute('href', on ? '#i-sound' : '#i-mute');
      if (on) {
        ensure();
        if (amb) { amb.volume = 0.12; const p = amb.play(); if (p && p.catch) p.catch(() => {}); }
      } else {
        if (amb) amb.pause();
        if (voice) voice.pause();
      }
      try { localStorage.setItem('ys-sound', on ? '1' : '0'); } catch (e) {}
    }

    function playVoice() {
      if (!on || !voice) return;
      voice.volume = 1;
      const p = voice.play();
      if (p && p.catch) p.catch(() => {});
    }

    return { blip, set, playVoice, toggle: () => set(!on) };
  })();

  function initSound() {
    const btn = $('#sndBtn');
    if (btn) btn.addEventListener('click', () => { Sound.toggle(); Sound.blip('tap'); });
    document.addEventListener('click', (e) => {
      const el = e.target.closest('[data-sfx]');
      if (el) Sound.blip(el.dataset.sfx);
    });
  }

  /* ======================================================================
     04. INTRO — the rotating 3D cube gate
     ====================================================================== */
  function initIntro() {
    const intro = $('#intro');
    if (!intro) { document.body.classList.remove('lock-init'); return; }

    let done = false;
    function enter(withSound) {
      if (done) return;
      done = true;
      if (withSound) { Sound.set(true); Sound.playVoice(); }
      intro.classList.add('gone');
      document.body.classList.remove('lock-init');
      setTimeout(() => intro.remove(), 950);
    }

    $('#introEnter').addEventListener('click', () => enter(false));
    $('#introSound').addEventListener('click', () => enter(true));
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape' || e.key === 'Enter') { enter(false); document.removeEventListener('keydown', esc); }
    });
    setTimeout(() => enter(false), 14000);   // never trap anyone
  }

  /* ======================================================================
     05. HEADER · NAV · SCROLL SPY · REVEAL · COUNTERS
     ====================================================================== */
  function initHeader() {
    const hdr = $('#hdr'), brg = $('#brg'), nav = $('#nav');
    const prog = $('#prog'), toTop = $('#toTop');
    const links = $$('.nav__a');
    const secs = links.map((a) => $(a.getAttribute('href'))).filter(Boolean);
    let scrim = null;

    function close() {
      if (!nav) return;
      nav.classList.remove('open'); brg.classList.remove('on');
      brg.setAttribute('aria-expanded', 'false');
      lock(false);
      if (scrim) { scrim.classList.remove('open'); const el = scrim; scrim = null; setTimeout(() => el.remove(), 400); }
    }
    function open() {
      nav.classList.add('open'); brg.classList.add('on');
      brg.setAttribute('aria-expanded', 'true');
      lock(true);
      scrim = document.createElement('div');
      scrim.className = 'scrim';
      document.body.appendChild(scrim);
      requestAnimationFrame(() => scrim.classList.add('open'));
      scrim.addEventListener('click', close);
    }

    if (brg) brg.addEventListener('click', () => {
      nav.classList.contains('open') ? close() : open();
      Sound.blip('tap');
    });
    links.forEach((a) => a.addEventListener('click', close));
    addEventListener('resize', () => { if (innerWidth > 900) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

    const onScroll = raf(() => {
      const y = scrollY;
      const max = document.documentElement.scrollHeight - innerHeight;
      if (hdr) hdr.classList.toggle('stuck', y > 50);
      if (prog) prog.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
      if (toTop) toTop.classList.toggle('show', y > 700);

      const probe = y + innerHeight * 0.3;
      let cur = secs[0];
      secs.forEach((s) => { if (s.offsetTop <= probe) cur = s; });
      if (cur) links.forEach((a) => a.classList.toggle('on', a.getAttribute('href') === '#' + cur.id));
    });
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (toTop) toTop.addEventListener('click', () =>
      scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' }));
  }

  function initReveal() {
    const items = $$('.rv');
    if (REDUCED || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('on'));
      return;
    }
    const io = new IntersectionObserver((en, obs) => {
      en.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('on'); obs.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    items.forEach((el) => io.observe(el));
  }

  function initCounters() {
    const nums = $$('.cnt');
    if (!nums.length) return;
    const run = (el) => {
      const target = parseInt(el.dataset.count, 10) || 0;
      if (REDUCED) { el.textContent = target; return; }
      const start = performance.now();
      (function step(now) {
        const p = Math.min((now - start) / 1500, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      })(start);
    };
    if (!('IntersectionObserver' in window)) { nums.forEach(run); return; }
    const io = new IntersectionObserver((en, obs) => {
      en.forEach((e) => { if (e.isIntersecting) { run(e.target); obs.unobserve(e.target); } });
    }, { threshold: 0.5 });
    nums.forEach((n) => io.observe(n));
  }

  /* ======================================================================
     06a. 3D TILT
     Each .tilt surface leans toward the pointer. The rotation is written
     as CSS custom properties so the transform itself stays in the sheet.
     ====================================================================== */
  function initTilt() {
    if (NO3D) return;

    $$('.tilt').forEach((el) => {
      const max = parseFloat(el.dataset.tilt) || 8;
      let rect = null;

      const measure = () => { rect = el.getBoundingClientRect(); };

      el.addEventListener('pointerenter', () => {
        measure();
        el.classList.add('live');
      });

      el.addEventListener('pointermove', (e) => {
        if (!rect) measure();
        // -0.5 … 0.5 across the surface
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.setProperty('--ry', (clamp(px, -0.5, 0.5) * max * 2).toFixed(2) + 'deg');
        el.style.setProperty('--rx', (clamp(-py, -0.5, 0.5) * max * 2).toFixed(2) + 'deg');
        el.style.setProperty('--tz', '18px');
      });

      el.addEventListener('pointerleave', () => {
        el.classList.remove('live');
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
        el.style.setProperty('--tz', '0px');
        rect = null;
      });
    });

    addEventListener('resize', () => {
      $$('.tilt').forEach((el) => {
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      });
    }, { passive: true });
  }

  /* ======================================================================
     06b. 3D COVERFLOW — the 25 frames
     Slides are generated from the gallery so both surfaces always use the
     same photographs in the same order. Each slide is positioned in real
     3D space by its distance from the active one.
     ====================================================================== */
  function initCoverflow() {
    const stage = $('#cfStage');
    const src = $$('#gg .gi');
    if (!stage || !src.length) return;

    const numEl = $('#cfNum'), capEl = $('#cfCap'), catEl = $('#cfCat');
    const totEl = $('#cfTot'), fill = $('#cfFill');

    const data = src.map((f) => {
      const img = f.querySelector('img');
      return {
        src: f.dataset.full || (img ? img.src : ''),
        w:   img ? Number(img.getAttribute('width'))  : 0,
        h:   img ? Number(img.getAttribute('height')) : 0,
        ph:  img ? (img.dataset.ph || 'IMAGE') : 'IMAGE',
        n:   f.dataset.n, cap: f.dataset.cap, cat: f.dataset.cat
      };
    });

    const total = data.length;
    if (totEl) totEl.textContent = pad2(total);   // 9 today, 25 later — no code change
    let i = 0;

    data.forEach((d, k) => {
      const fig = document.createElement('figure');
      fig.className = 'cf__i';
      // the frame is cut to this picture, not to a house shape
      if (d.w && d.h) fig.style.setProperty('--ar', (d.w / d.h).toFixed(4));
      const img = document.createElement('img');
      img.alt = d.cap || '';
      img.loading = k < 4 ? 'eager' : 'lazy';
      img.dataset.ph = d.ph;
      if (d.w && d.h) { img.width = d.w; img.height = d.h; }
      img.addEventListener('error', () => makePlaceholder(img), { once: true });
      img.src = d.src;
      const num = document.createElement('span');
      num.className = 'cf__num';
      num.textContent = d.n || pad2(k + 1);
      fig.append(img, num);
      stage.appendChild(fig);
    });

    const slides = $$('.cf__i', stage);

    /** Lay every slide out in 3D relative to the active index. */
    function layout() {
      slides.forEach((s, k) => {
        // shortest way round the ring, so the fan is always full on BOTH
        // sides — otherwise frame 01 would only ever show cards to its right
        let off = k - i;
        if (off >  total / 2) off -= total;
        if (off < -total / 2) off += total;

        const a = Math.abs(off);
        const sign = Math.sign(off);

        // beyond 4 either side, park it out of sight — keeps the DOM cheap
        if (a > 4) {
          s.style.opacity = '0';
          s.style.transform =
            'translate(-50%,-50%) translateX(' + (sign * 60) + '%) translateZ(-900px)';
          s.style.zIndex = '0';
          s.classList.remove('mid');
          return;
        }

        const x  = off * 30;                    // % spread
        const z  = -a * 190;                    // depth falloff
        const ry = off * -32;                   // fan the outer cards
        const sc = 1 - a * 0.07;

        s.style.opacity = String(1 - a * 0.16);
        s.style.zIndex = String(50 - a);
        s.style.transform =
          'translate(-50%,-50%) translateX(' + x + '%) translateZ(' + z + 'px) ' +
          'rotateY(' + ry + 'deg) scale(' + sc + ')';
        s.classList.toggle('mid', off === 0);
      });

      const d = data[i];
      if (numEl) numEl.textContent = d.n || pad2(i + 1);
      if (capEl) capEl.textContent = d.cap || '';
      if (catEl) catEl.textContent = (d.cat || '').toUpperCase();
      if (fill) fill.style.width = (((i + 1) / total) * 100) + '%';
    }

    function go(n) { i = ((n % total) + total) % total; layout(); }

    $('#cfPrev').addEventListener('click', () => go(i - 1));
    $('#cfNext').addEventListener('click', () => go(i + 1));

    stage.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); go(i - 1); Sound.blip('move'); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); Sound.blip('move'); }
    });

    let wheelLock = false;
    stage.addEventListener('wheel', (e) => {
      if (wheelLock) return;
      wheelLock = true;
      setTimeout(() => { wheelLock = false; }, 340);
      go(i + (e.deltaY > 0 || e.deltaX > 0 ? 1 : -1));
    }, { passive: true });

    // drag / swipe
    let x0 = null, dragging = false;
    const down = (x) => { x0 = x; dragging = true; };
    const up = (x) => {
      if (!dragging || x0 === null) return;
      const dx = x - x0;
      if (Math.abs(dx) > 45) { go(i + (dx < 0 ? 1 : -1)); Sound.blip('move'); }
      dragging = false; x0 = null;
    };
    stage.addEventListener('mousedown', (e) => { e.preventDefault(); down(e.clientX); });
    addEventListener('mouseup', (e) => up(e.clientX));
    stage.addEventListener('touchstart', (e) => down(e.changedTouches[0].clientX), { passive: true });
    stage.addEventListener('touchend', (e) => up(e.changedTouches[0].clientX), { passive: true });

    // click a side card to bring it forward; click the middle to enlarge
    slides.forEach((s, k) => {
      s.addEventListener('click', () => {
        if (k === i) { if (window.__ysLightbox) window.__ysLightbox(i); }
        else go(k);
      });
    });

    layout();
  }

  /* ======================================================================
     06b. ROLE CARD ROTATORS
     Each stage card holds its own photographs and turns them over by
     itself. No controls, no hover, no clicks. Cards are staggered so the
     row never flips as one block, and a card only runs while it is on
     screen and the tab is in front.
     ====================================================================== */
  function initRotators() {
    const cards = $$('[data-rot]');
    if (!cards.length || REDUCED) return;

    const runners = cards.map((card, c) => {
      const shots = $$('.pc__stack img', card);
      if (shots.length < 2) return null;
      const every = Number(card.dataset.rot) || 5200;
      let i = 0, timer = null, seen = false;

      const step = () => {
        shots[i].classList.remove('on');
        i = (i + 1) % shots.length;
        shots[i].classList.add('on');
      };
      const start = () => { if (!timer) timer = setInterval(step, every); };
      const stop  = () => { clearInterval(timer); timer = null; };

      return {
        card,
        // stagger the first turn so the three cards never move together
        wake: () => { if (seen) { start(); return; } seen = true; setTimeout(start, c * 1500); },
        rest: stop,
        live: () => Boolean(timer) || !seen
      };
    }).filter(Boolean);

    if (!runners.length) return;

    const visible = new Set();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const r = runners.find((x) => x.card === e.target);
        if (!r) return;
        if (e.isIntersecting) { visible.add(r); if (!document.hidden) r.wake(); }
        else { visible.delete(r); r.rest(); }
      });
    }, { rootMargin: '120px 0px' });
    runners.forEach((r) => io.observe(r.card));

    document.addEventListener('visibilitychange', () => {
      visible.forEach((r) => (document.hidden ? r.rest() : r.wake()));
    });
  }
  /* ======================================================================
     07. GALLERY FILTER + LIGHTBOX
     ====================================================================== */
  function initGallery() {
    const btns = $$('.fb[data-f]');
    const items = $$('#gg .gi');
    const notes = $$('#gg .gnote');
    const none = $('#ggNone');

    btns.forEach((b) => {
      b.addEventListener('click', () => {
        const f = b.dataset.f;
        btns.forEach((x) => x.classList.toggle('on', x === b));
        let shown = 0;
        items.forEach((it, k) => {
          const match = f === 'all' || it.dataset.cat === f;
          it.classList.toggle('hide', !match);
          if (match) {
            shown++;
            it.style.animation = 'none';
            void it.offsetWidth;
            it.style.animation = '';
            it.style.animationDelay = (k * 30) + 'ms';
          }
        });
        notes.forEach((n) => n.classList.toggle('hide', f !== 'all'));
        if (none) none.hidden = shown !== 0;
      });
    });

    const box = $('#lb'), img = $('#lbImg'), cap = $('#lbCap'), cnt = $('#lbC');
    if (!box) return;

    let list = [], i = 0, lastFocus = null;

    function render() {
      if (!list.length) return;
      i = ((i % list.length) + list.length) % list.length;
      const f = list[i], inner = f.querySelector('img');
      img.classList.remove('ph');
      img.dataset.phDone = '';
      img.dataset.ph = inner ? (inner.dataset.ph || 'IMAGE') : 'IMAGE';
      img.alt = f.dataset.cap || '';
      img.onerror = () => makePlaceholder(img);
      img.src = f.dataset.full || (inner ? inner.src : '');
      cap.textContent = (f.dataset.n ? f.dataset.n + ' — ' : '') + (f.dataset.cap || '');
      cnt.textContent = pad2(i + 1) + ' / ' + pad2(list.length);
    }

    function open(target) {
      list = items.filter((s) => !s.classList.contains('hide'));
      i = typeof target === 'number' ? target : Math.max(0, list.indexOf(target));
      lastFocus = document.activeElement;
      box.hidden = false;
      requestAnimationFrame(() => box.classList.add('open'));
      lock(true); render(); $('#lbX').focus();
    }
    function close() {
      box.classList.remove('open'); lock(false);
      setTimeout(() => { box.hidden = true; img.src = ''; }, 360);
      if (lastFocus) lastFocus.focus();
    }

    // the coverflow uses this to enlarge the front frame
    window.__ysLightbox = (index) => { list = items.slice(); open(index); };

    items.forEach((s) => {
      s.setAttribute('tabindex', '0');
      s.setAttribute('role', 'button');
      s.setAttribute('aria-label', 'View photograph ' + (s.dataset.n || ''));
      s.addEventListener('click', () => { open(s); Sound.blip('tap'); });
      s.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(s); }
      });
    });

    $('#lbX').addEventListener('click', close);
    $('#lbP').addEventListener('click', () => { i--; render(); });
    $('#lbN').addEventListener('click', () => { i++; render(); });
    box.addEventListener('click', (e) => { if (e.target === box) close(); });
    document.addEventListener('keydown', (e) => {
      if (box.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') { i--; render(); }
      if (e.key === 'ArrowRight') { i++; render(); }
    });

    let x0 = null;
    box.addEventListener('touchstart', (e) => { x0 = e.changedTouches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 55) { i += dx < 0 ? 1 : -1; render(); }
      x0 = null;
    }, { passive: true });
  }

  /* ======================================================================
     08. FLIP CARDS — hover on desktop, tap on touch
     ====================================================================== */
  function initFlips() {
    $$('.flip').forEach((f) => {
      f.addEventListener('click', () => { f.classList.toggle('on'); Sound.blip('tap'); });
      f.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); f.classList.toggle('on'); }
      });
    });
  }

  /* ======================================================================
     09. VIDEO
     ====================================================================== */
  function initVideo() {
    const modal = $('#vm'), vid = $('#vmV'), fb = $('#vmF');
    if (!modal) return;

    const amb = $('#ambience');
    let ambWasOn = false, waiting = null;

    /* the card that stands in when a clip cannot play — hoisted, because the
       metadata handler below needs it too */
    const showFb = () => { fb.hidden = false; vid.style.visibility = 'hidden'; };
    vid.onerror = showFb;

    // the room tone and a showreel should never talk over each other
    function duck() {
      if (!amb) return;
      ambWasOn = !amb.paused;
      if (ambWasOn) amb.pause();
    }
    function unduck() {
      if (!amb || !ambWasOn) return;
      ambWasOn = false;
      const p = amb.play();
      if (p && p.catch) p.catch(() => {});
    }

    function open(src, poster) {
      modal.hidden = false;
      requestAnimationFrame(() => modal.classList.add('open'));
      lock(true);
      fb.hidden = true;
      vid.style.visibility = 'visible';
      vid.muted = false;
      if (poster) vid.poster = poster;
      duck();
      // reset to 16:9 until this clip says otherwise
      modal.style.setProperty('--vm-ar', '1.7778');

      vid.src = src;
      const p = vid.play();
      if (p && p.catch) p.catch(() => {});

      /* Only call a clip missing when the browser has genuinely got nowhere.
         These files are large — the audition runs to well over a gigabyte —
         and a second is nothing like long enough to hand over a first frame,
         which is what made a perfectly good video show the "not available"
         card. The wait is generous now, and it is dropped the moment any
         metadata arrives. */
      clearTimeout(waiting);
      waiting = setTimeout(() => { if (vid.readyState === 0) showFb(); }, 15000);

      $('#vmX').focus();
    }
    function close() {
      modal.classList.remove('open'); lock(false); vid.pause();
      unduck();
      setTimeout(() => { modal.hidden = true; vid.removeAttribute('src'); vid.load(); }, 360);
    }

    // a 9:16 dance reel gets a 9:16 window, not black bars
    vid.addEventListener('loadedmetadata', () => {
      clearTimeout(waiting);            // it is alive; stop waiting for it
      /* A container can open with no picture the browser can decode — an
         HEVC / H.265 file does exactly that in Chrome and Firefox: duration
         arrives, dimensions come back 0x0, and the viewer gets a black
         window. Say so instead of showing them nothing. */
      if (!vid.videoWidth || !vid.videoHeight) { showFb(); return; }
      if (vid.videoWidth && vid.videoHeight) {
        modal.style.setProperty('--vm-ar', (vid.videoWidth / vid.videoHeight).toFixed(4));
      }
    });
    vid.addEventListener('ended', unduck);

    $$('[data-video]').forEach((el) => {
      el.addEventListener('click', () => open(el.dataset.video, el.dataset.poster));
    });
    $$('[data-href]').forEach((el) => {
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => open_(el.dataset.href));
    });
    function open_(u) { window.open(u, '_blank', 'noopener'); }

    $$('.mc__f').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.mc');
        if (!card || !card.dataset.video) return;
        open(card.dataset.video, card.dataset.poster);
        setTimeout(() => { if (vid.requestFullscreen) vid.requestFullscreen().catch(() => {}); }, 400);
      });
    });

    $('#vmX').addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
    document.addEventListener('keydown', (e) => { if (!modal.hidden && e.key === 'Escape') close(); });
  }

  /* ======================================================================
     10. CUSTOM CURSOR — desktop only
     ====================================================================== */
  /* ======================================================================
     10. AURA — a light that follows the pointer
     The pointer itself is left alone: this is the system cursor with a
     bloom of gold drifting behind it and a short comet tail chasing that.
     Everything is transform-only and pointer-events:none, so it never
     touches layout and never eats a click.
     ====================================================================== */
  function initAura() {
    if (NO3D || innerWidth < 1024) return;
    const box = $('#aura');
    if (!box) return;

    const BEADS = 7;
    const bloom = document.createElement('span');
    bloom.className = 'aura__bloom';
    box.appendChild(bloom);

    // the tail thins and fades toward its end
    const beads = [];
    for (let i = 0; i < BEADS; i++) {
      const b = document.createElement('span');
      b.className = 'aura__t';
      const s = 11 - i;
      b.style.width = b.style.height = s + 'px';
      b.style.margin = (-s / 2) + 'px 0 0 ' + (-s / 2) + 'px';
      b.style.opacity = (0.82 - i * 0.095).toFixed(2);
      box.appendChild(b);
      beads.push({ el: b, x: innerWidth / 2, y: innerHeight / 2, i: i });
    }

    /* the tail's glow is the one part of the pointer that cannot live in the
       stylesheet — each bead's shadow is written here, per bead — so it is
       repainted when the theme changes: gold light on the dark ground, royal
       blue ink on the light one */
    function paintTail() {
      const light = document.documentElement.getAttribute('data-theme') === 'light';
      const tint = light ? '30,58,138' : '212,175,55';
      beads.forEach(({ el, i }) => {
        el.style.boxShadow = '0 0 ' + (18 - i) + 'px rgba(' + tint + ',' + (light ? '.5' : '.85') + ')';
      });
    }
    paintTail();
    window.__ysAuraPaint = paintTail;   // initTheme calls this on a switch

    let mx = innerWidth / 2, my = innerHeight / 2;
    let bx = mx, by = my, px = mx, py = my;
    let energy = 0, driven = false;

    addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      box.classList.add('lit');
    }, { passive: true });
    document.addEventListener('mouseleave', () => box.classList.remove('lit'));
    document.addEventListener('mouseenter', () => box.classList.add('lit'));

    const lerp = (a, b, t) => a + (b - a) * t;

    (function loop() {
      // the bloom is heavy and arrives a beat late
      bx = lerp(bx, mx, 0.055);
      by = lerp(by, my, 0.055);

      // how hard the pointer is being thrown around, smoothed
      const speed = Math.hypot(mx - px, my - py);
      px = mx; py = my;
      energy = lerp(energy, clamp(speed / 42, 0, 1), 0.08);

      bloom.style.transform = 'translate3d(' + bx + 'px,' + by + 'px,0) scale(' +
                              (1 + energy * 0.22).toFixed(3) + ')';

      /* On the light ground there is no bloom — the trail IS the pointer — so
         it is shown only while the pointer is actually moving and fades out
         as it comes to rest. The dark theme keeps its steady glow, and the
         stylesheet is handed the opacity back the moment we switch away. */
      if (document.documentElement.getAttribute('data-theme') === 'light') {
        box.style.opacity = Math.min(1, energy * 6).toFixed(2);
        driven = true;
      } else if (driven) {
        box.style.opacity = '';
        driven = false;
      }

      // each bead chases the one ahead of it, the first chases the pointer
      let tx = mx, ty = my;
      for (const b of beads) {
        b.x = lerp(b.x, tx, 0.42);
        b.y = lerp(b.y, ty, 0.42);
        b.el.style.transform = 'translate3d(' + b.x + 'px,' + b.y + 'px,0)';
        tx = b.x; ty = b.y;
      }
      requestAnimationFrame(loop);
    })();
  }
  function initMagnetic() {
    if (NO3D || innerWidth < 1024) return;

    $$('[data-mag]').forEach((el) => {
      let rect = null;
      el.addEventListener('pointerenter', () => { rect = el.getBoundingClientRect(); });
      el.addEventListener('pointermove', (e) => {
        if (!rect) rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = 'translate(' + (px * 14).toFixed(1) + 'px,' +
                             (py * 8).toFixed(1) + 'px) translateZ(14px)';
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; rect = null; });
    });
  }

  /* ======================================================================
     10c. HERO PARALLAX — the portrait drifts slower than the page
     ====================================================================== */
  function initParallax() {
    const art = $('.hero__art');
    if (!art || NO3D) return;
    const onScroll = raf(() => {
      const y = scrollY;
      if (y > innerHeight * 1.2) return;
      art.style.transform = 'translate3d(0,' + (-y * 0.08).toFixed(1) + 'px,0)';
    });
    addEventListener('scroll', onScroll, { passive: true });
  }

  /* ======================================================================
     11. FORM · vCARD · PDF
     ====================================================================== */
  const CONTACT = {
    name: 'Yorvik Sharjith Shaank', first: 'Yorvik', last: 'Sharjith Shaank',
    role: 'Actor · Dancer · Choreographer',
    email: 'sharjithshank@gmail.com', phone: '+916305068693',
    city: 'Hyderabad', state: 'Telangana', land: 'India',
    // the profiles, in one place: the contact card in index.html links to
    // these and the saved .vcf carries them too
    social: [
      ['Instagram', 'https://www.instagram.com/yorviksharjithshaank'],
      ['Facebook',  'https://www.facebook.com/share/1GoBXoXxq3/'],
      ['X',         'https://x.com/Yorviksharxud2'],
      ['WhatsApp',  'https://wa.me/916305068693']
    ]
  };

  function initVcard() {
    const btn = $('#saveContact');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const vcf = [
        'BEGIN:VCARD', 'VERSION:3.0',
        'N:' + CONTACT.last + ';' + CONTACT.first + ';;;',
        'FN:' + CONTACT.name,
        'TITLE:' + CONTACT.role,
        'EMAIL;TYPE=INTERNET,PREF:' + CONTACT.email,
        'TEL;TYPE=CELL,VOICE:' + CONTACT.phone,
        'ADR;TYPE=HOME:;;;' + CONTACT.city + ';' + CONTACT.state + ';;' + CONTACT.land,
        'NOTE:Acting · Movement · Storytelling',
        // one URL line per profile, the label kept so a phone shows it
      ].concat(CONTACT.social.map(function (s) {
        return 'URL;TYPE=' + s[0] + ':' + s[1];
      })).concat([
        'END:VCARD'
      ]).join('\r\n');
      const blob = new Blob([vcf], { type: 'text/vcard;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'Yorvik-Sharjith-Shaank.vcf';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    });
  }

  function initForm() {
    const form = $('#form');
    if (!form) return;
    const note = $('#fnote'), btn = $('#sendBtn'), lab = $('.btn__l', btn);
    const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
    const PHONE = /^[+()\-\s0-9]{7,20}$/;

    // the one address an enquiry is for — change it here and nowhere else
    const ADDRESS = 'yorviksharjithshaank@gmail.com';
    const RELAY   = 'https://formsubmit.co/ajax/' + ADDRESS;

    function err(field, msg) {
      const w = field.closest('.f');
      w.classList.toggle('bad', Boolean(msg));
      $('.e', w).textContent = msg || '';
      return !msg;
    }
    function check(f) {
      const v = f.value.trim();
      if (f.hasAttribute('required') && !v) return err(f, 'This field is required.');
      if (f.type === 'email' && v && !EMAIL.test(v)) return err(f, 'Enter a valid email address.');
      if (f.type === 'tel' && v && !PHONE.test(v)) return err(f, 'Enter a valid phone number.');
      if (f.id === 'cn' && v && v.length < 2) return err(f, 'Please enter your full name.');
      if (f.id === 'cm' && v && v.length < 15) return err(f, 'A few more details, please (15+ characters).');
      return err(f, '');
    }

    const fields = $$('input, select, textarea', form);
    fields.forEach((f) => {
      f.addEventListener('blur', () => check(f));
      f.addEventListener('input', () => { if (f.closest('.f').classList.contains('bad')) check(f); });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!fields.map(check).every(Boolean)) {
        note.textContent = 'Please correct the highlighted fields.';
        note.className = 'fnote no';
        const bad = $('.f.bad input, .f.bad select, .f.bad textarea', form);
        if (bad) bad.focus();
        return;
      }
      send();
    });

    /* ---- where an enquiry goes ------------------------------------------
       This site is a set of files: a page on its own cannot put mail on the
       wire, so the enquiry is handed to FormSubmit, a relay that forwards it
       to the address below and keeps no account. If the relay cannot be
       reached — offline, blocked, down — the visitor's own mail client is
       opened with the whole enquiry already written out, so nothing a
       casting director types is ever lost.

       ONE-TIME STEP: the first enquiry ever sent makes FormSubmit email
       ADDRESS a confirmation link. Until someone clicks it, nothing is
       forwarded. See README.txt.
       -------------------------------------------------------------------- */
    function collect() {
      const val = (id) => (($(id) || {}).value || '').trim();
      return {
        name:    val('#cn'),
        email:   val('#ce'),
        phone:   val('#cp') || '—',
        type:    val('#ctp'),
        date:    val('#cd') || 'not given',
        message: val('#cm')
      };
    }

    function say(msg, kind, hold) {
      note.textContent = msg;
      note.className = 'fnote' + (kind ? ' ' + kind : '');
      if (hold) setTimeout(() => { note.textContent = ''; note.className = 'fnote'; }, hold);
    }

    function resting() {
      btn.classList.remove('sending');
      btn.disabled = false;
      lab.textContent = 'SEND ENQUIRY';
    }

    /* the same enquiry, written as a letter — the fallback route */
    function letter(d) {
      const body = [
        'Name: ' + d.name,
        'Email: ' + d.email,
        'Phone: ' + d.phone,
        'Enquiry: ' + d.type,
        'Audition / shoot date: ' + d.date,
        '',
        d.message
      ].join('\n');
      return 'mailto:' + ADDRESS +
             '?subject=' + encodeURIComponent('Casting enquiry — ' + d.name) +
             '&body=' + encodeURIComponent(body);
    }

    function send() {
      const d = collect();
      btn.classList.add('sending');
      btn.disabled = true;
      lab.textContent = 'SENDING…';
      say('', '');

      fetch(RELAY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          Name: d.name,
          Email: d.email,
          Phone: d.phone,
          Enquiry: d.type,
          'Audition / shoot date': d.date,
          Details: d.message,
          _subject: 'Casting enquiry — ' + d.name,
          _template: 'table',
          _captcha: 'false',
          _honey: ''                    // spam trap: real people leave it empty
        })
      })
        .then((r) => r.json().catch(() => ({ success: r.ok })))
        .then((r) => {
          const ok = r && (r.success === true || r.success === 'true');
          if (!ok) throw new Error(r && r.message ? r.message : 'not delivered');
          resting();
          say('Thank you — your enquiry is on its way to Yorvik.', 'ok', 9000);
          form.reset();
        })
        .catch(() => {
          // the relay could not be reached: hand the letter to the visitor
          resting();
          say('Opening your mail app so the enquiry is not lost…', 'no', 12000);
          location.href = letter(d);
        });
    }
  }

  function initPdf() {
    const btn = $('#printPdf');
    if (!btn) return;
    btn.addEventListener('click', () => {
      $$('.rv').forEach((el) => el.classList.add('on'));
      setTimeout(() => print(), 260);
    });
  }

  /* ======================================================================
     MISC
     ====================================================================== */
  function initMisc() {
    const yr = $('#yr');
    if (yr) yr.textContent = new Date().getFullYear();

    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id === '#' || id.length < 2) return;
        const t = $(id);
        if (!t) return;
        e.preventDefault();
        const off = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--hh'), 10) || 74;
        scrollTo({ top: t.getBoundingClientRect().top + scrollY - off + 1,
                   behavior: REDUCED ? 'auto' : 'smooth' });
      });
    });

    // social links carry no URLs yet — say so rather than going nowhere
    $$('a[data-nourl]').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const old = a.textContent;
        a.textContent = 'LINK NOT SET';
        setTimeout(() => { a.textContent = old; }, 1400);
      });
    });

    try {
      if (localStorage.getItem('ys-sound') === '1') {
        const icon = $('#sndIcon');
        if (icon) icon.setAttribute('href', '#i-sound');
      }
    } catch (e) {}
  }

  /* ======================================================================
     11b. THEME — dark by default, light on request
     The inline script in <head> has already written data-theme on <html>
     before the first paint, so the page never flashes the wrong ground.
     This wires the header button to it, keeps the icon and the labels
     honest, and remembers the visitor's choice.
     ====================================================================== */
  function initTheme() {
    const root = document.documentElement;
    const btn  = $('#thmBtn'), icon = $('#thmIcon');
    const meta = $('meta[name="theme-color"]');

    const isLight = () => root.getAttribute('data-theme') === 'light';

    function apply(theme, remember) {
      const light = theme === 'light';
      root.setAttribute('data-theme', light ? 'light' : 'dark');
      if (btn) {
        btn.setAttribute('aria-pressed', String(light));
        // the button says what it will DO, not what it is showing
        btn.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
        btn.title = light ? 'Dark theme' : 'Light theme';
      }
      if (icon) icon.setAttribute('href', light ? '#i-moon' : '#i-sun');
      if (meta) meta.setAttribute('content', light ? '#fbf8f2' : '#0b1f1a');
      if (window.__ysAuraPaint) window.__ysAuraPaint();   // the pointer's tail changes tint with the ground
      if (remember) { try { localStorage.setItem('ys-theme', light ? 'light' : 'dark'); } catch (e) {} }
    }

    apply(isLight() ? 'light' : 'dark', false);   // sync the button to <html>
    if (!btn) return;
    btn.addEventListener('click', () => apply(isLight() ? 'dark' : 'light', true));
  }

  /* ======================================================================
     12. BOOT
     ====================================================================== */
  function boot() {
    initTheme();
    initPlaceholders();
    initSound();
    initIntro();
    initHeader();
    initReveal();
    initCounters();
    initGallery();      // registers the lightbox hook the coverflow uses
    initCoverflow();
    initFit();          // after the coverflow builds its frames
    initRotators();
    initTilt();
    initFlips();
    initVideo();
    initAura();
    initMagnetic();
    initParallax();
    initVcard();
    initForm();
    initPdf();
    initMisc();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
