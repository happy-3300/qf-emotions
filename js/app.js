/* QF Space — page logic: stage scaling, language, feelings, verse view, idle return, offline cache. */
(function () {
  'use strict';

  var C = window.QF_CONTENT;
  var root = document.documentElement;
  var stage = document.getElementById('stage');
  var home = document.getElementById('home');
  var verse = document.getElementById('verse');
  var vTitle = verse.querySelector('.v-title');
  var vBox = verse.querySelector('.v-box');
  var vBody = verse.querySelector('.v-body');
  var lang = 'ar';
  var current = null; /* feeling shown in the verse view, or null on the welcome screen */

  var AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
  function num(n) { return lang === 'ar' ? String(n).replace(/\d/g, function (d) { return AR_DIGITS[d]; }) : String(n); }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  /* One ayah / du'a: text in ornate brackets (Arabic ayah) or quotes (English), then its reference. */
  function renderText(item, parent) {
    var t = item[lang];
    if (lang === 'ar') t = item.type === 'ayah' ? '﴿' + t + '﴾' : t;
    else t = '“' + t + '”';
    parent.appendChild(el('p', 'text ' + item.type, t));
    if (item.ref) {
      var r = lang === 'ar' ? item.ref.ar + ': ' + num(item.ref.ayah) : item.ref.en + ': ' + item.ref.ayah;
      parent.appendChild(el('div', 'ref', r));
    }
  }

  /* ---------- Language ---------- */
  var KEY = 'qf-feelings-lang';
  function readLang() {
    var q = new URLSearchParams(location.search).get('lang');
    if (q === 'ar' || q === 'en') return q;
    try { var s = localStorage.getItem(KEY); if (s === 'ar' || s === 'en') return s; } catch (e) {}
    return 'ar';
  }
  function setLang(l, pushUrl) {
    lang = l;
    root.lang = l;
    root.dir = l === 'ar' ? 'rtl' : 'ltr';
    try { localStorage.setItem(KEY, l); } catch (e) {}
    if (pushUrl) {
      var u = new URL(location.href);
      u.searchParams.set('lang', l);
      history.replaceState(null, '', u);
    }
    render();
  }

  /* ---------- Rendering ---------- */
  var feelingsBox = home.querySelector('.feelings');
  C.feelings.forEach(function (f) {
    var b = el('button', 'btn feel');
    b.type = 'button';
    b.dataset.id = f.id;
    b.addEventListener('click', function () { showFeeling(f); });
    feelingsBox.appendChild(b);
  });

  function render() {
    document.querySelectorAll('[data-t]').forEach(function (n) { n.textContent = C.ui[n.dataset.t][lang]; });
    var intro = home.querySelector('.intro');
    intro.textContent = '';
    renderText(C.intro, intro);
    feelingsBox.querySelectorAll('.feel').forEach(function (b) {
      var f = C.feelings.filter(function (x) { return x.id === b.dataset.id; })[0];
      b.textContent = f.label[lang];
    });
    if (current) { fillVerse(current); playFor(current, false); }
  }

  function fillVerse(f) {
    vTitle.textContent = f.label[lang];
    vBody.textContent = '';
    f.texts.forEach(function (item, i) {
      if (i) vBody.appendChild(el('div', 'divider'));
      renderText(item, vBody);
    });
    fitVerse();
  }

  /* Largest font size (stage px) at which the text still fits the box. */
  function fitVerse() {
    var fs = 40;
    vBody.style.setProperty('--fs', fs);
    while (vBody.scrollHeight > vBox.clientHeight && fs > 16) {
      fs -= 1;
      vBody.style.setProperty('--fs', fs);
    }
  }

  function showFeeling(f) {
    current = f;
    fillVerse(f);
    playFor(f, true);
    home.classList.remove('is-active');
    verse.classList.add('is-active');
  }
  function showHome() {
    current = null;
    stopAudio();
    verse.classList.remove('is-active');
    home.classList.add('is-active');
  }
  verse.querySelector('.back').addEventListener('click', showHome);

  document.querySelectorAll('a[data-lang]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      ev.preventDefault();
      setLang(a.dataset.lang, true);
    });
  });

  /* ---------- Audio ----------
     Each feeling's file (content.js `audio`) plays when it opens. All files are fetched once in the background and
     played from memory: no delay on tap, and the service worker keeps a copy so they also play offline. */
  var player = new Audio();
  var audioBtn = verse.querySelector('.audio-btn');
  var loaded = {}; /* src -> object URL, false if missing */
  function audioSrc(f) {
    var a = f && f.audio;
    return !a ? null : typeof a === 'string' ? a : (a[lang] || a.ar || a.en || null);
  }
  function preloadAudio() {
    var seen = {};
    C.feelings.forEach(function (f) {
      var a = f.audio; if (!a) return;
      (typeof a === 'string' ? [a] : Object.keys(a).map(function (k) { return a[k]; })).forEach(function (src) {
        if (seen[src]) return; seen[src] = true;
        fetch(src).then(function (r) { return r.ok ? r.blob() : null; }).then(function (b) {
          loaded[src] = b ? URL.createObjectURL(b) : false;
          if (current && audioSrc(current) === src) audioBtn.hidden = !b;
        }, function () { loaded[src] = false; });
      });
    });
  }
  /* restart: true when the feeling is opened; false on a language switch (keeps playing if the file is the same) */
  function playFor(f, restart) {
    var src = audioSrc(f);
    if (!restart && player.dataset.src === src) return;
    stopAudio();
    if (!src || loaded[src] === false) { audioBtn.hidden = true; return; }
    audioBtn.hidden = false;
    player.dataset.src = src;
    player.src = loaded[src] || src; /* not preloaded yet: stream it */
    var p = player.play();
    if (p && p.catch) p.catch(function () {});
  }
  function stopAudio() {
    player.pause();
    try { player.currentTime = 0; } catch (e) {}
  }
  /* missing or unplayable file: hide the button and make sure the player counts as stopped (so idle return still works) */
  player.addEventListener('error', function () {
    if (player.dataset.src) loaded[player.dataset.src] = false;
    audioBtn.hidden = true;
    audioBtn.classList.remove('is-playing');
    player.pause();
    armIdle();
  });
  player.addEventListener('play', function () { audioBtn.classList.add('is-playing'); stopIdle(); });
  player.addEventListener('pause', function () { audioBtn.classList.remove('is-playing'); armIdle(); });
  player.addEventListener('ended', function () { audioBtn.classList.remove('is-playing'); armIdle(); });
  audioBtn.addEventListener('click', function () {
    if (player.paused) { var p = player.play(); if (p && p.catch) p.catch(function () {}); }
    else player.pause();
  });
  window.addEventListener('pagehide', stopAudio);

  /* ---------- Stage scaling ---------- */
  function fit() {
    var r = document.body.getBoundingClientRect();
    var vw = r.width || window.innerWidth, vh = r.height || window.innerHeight;
    var portrait = vh > vw * 1.1;
    root.classList.toggle('portrait', portrait);
    var W = portrait ? 834 : 1194, H = portrait ? 1194 : 834;
    stage.style.setProperty('--k', Math.min(vw / W, vh / H));
    if (current) fitVerse();
  }
  window.addEventListener('resize', fit);
  window.addEventListener('orientationchange', function () { setTimeout(fit, 50); setTimeout(fit, 400); });
  window.addEventListener('pageshow', fit);
  if (window.visualViewport) window.visualViewport.addEventListener('resize', fit);
  /* iOS home-screen apps sometimes report a short viewport at first paint and correct it a moment later */
  [100, 400, 1000, 2500].forEach(function (ms) { setTimeout(fit, ms); });

  setLang(readLang(), false);
  fit();
  /* ?feeling=calm opens that feeling directly (handy for testing and for linking) */
  var startId = new URLSearchParams(location.search).get('feeling');
  C.feelings.forEach(function (f) { if (f.id === startId) showFeeling(f); });
  /* Measure the verse text only once the fonts are in, or the fit is computed against fallback metrics. */
  if (document.fonts) {
    Promise.all([
      document.fonts.load('40px "Amiri Quran"', 'اللّٰه'),
      document.fonts.load('30px "Amiri"', 'Allah'),
      document.fonts.load('30px "QF"', 'QF')
    ]).then(function () { if (current) fitVerse(); }, function () {});
  }
  window.addEventListener('load', preloadAudio);

  /* ---------- Idle return ----------
     60 s without a touch (and no audio playing) → welcome screen in Arabic, ready for the next visitor. */
  var IDLE_MS = 60000, idleTimer = null;
  function stopIdle() { clearTimeout(idleTimer); }
  function armIdle() {
    clearTimeout(idleTimer);
    if (!player.paused) return; /* never cut off a recitation */
    idleTimer = setTimeout(function () {
      showHome();
      if (lang !== 'ar') setLang('ar', true);
    }, IDLE_MS);
  }
  ['touchstart', 'pointerdown', 'keydown'].forEach(function (ev) {
    document.addEventListener(ev, armIdle, { passive: true, capture: true });
  });
  armIdle();

  /* ---------- Offline ---------- */
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  }
})();
