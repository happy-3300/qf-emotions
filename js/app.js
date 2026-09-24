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
  function starSvg(cls) {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    var u = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    u.setAttribute('href', '#star');
    s.appendChild(u);
    s.setAttribute('class', cls);
    s.setAttribute('aria-hidden', 'true');
    return s;
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
    if (current) fillVerse(current);
  }

  function fillVerse(f) {
    vTitle.textContent = f.label[lang];
    vBody.textContent = '';
    f.texts.forEach(function (item, i) {
      if (i) vBody.appendChild(starSvg('sep'));
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
    home.classList.remove('is-active');
    verse.classList.add('is-active');
  }
  function showHome() {
    current = null;
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

  /* ---------- Idle return ----------
     60 s without a touch → welcome screen in Arabic, ready for the next visitor. */
  var IDLE_MS = 60000, idleTimer = null;
  function armIdle() {
    clearTimeout(idleTimer);
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
