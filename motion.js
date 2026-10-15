// Kitakits DVO – motion layer (vanilla JS, no dependencies, no tracking)
// Effects: scroll progress, headline word reveal, hero parallax + orchid
// cursor trail, card spotlight/tilt, magnetic buttons, step line draw,
// phone scroll-parallax, active nav link.
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // ---------- Hero entrance (runs even before scroll) ----------
  if (!reduce) {
    var h1 = $('.hero h1');
    if (h1) {
      var n = 0;
      (function split(node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (c) {
          if (c.nodeType === 3) {
            var frag = document.createDocumentFragment();
            c.textContent.split(/(\s+)/).forEach(function (part) {
              if (!part) return;
              if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
              var w = document.createElement('span'); w.className = 'w';
              var i = document.createElement('span'); i.textContent = part;
              i.style.setProperty('--d', n++);
              w.appendChild(i); frag.appendChild(w);
            });
            c.parentNode.replaceChild(frag, c);
          } else if (c.nodeType === 1) { split(c); }
        });
      })(h1);
    }
    $$('.hero-copy > :not(h1)').forEach(function (el, i) {
      el.classList.add('rise');
      el.style.setProperty('--rd', (500 + i * 140) + 'ms');
    });
  }

  // ---------- Scroll-driven: progress bar, header, step line, phone parallax ----------
  var bar = $('.scroll-progress');
  var header = $('.site-header');
  var steps = $('.steps');
  var devices = $$('.device');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.setProperty('--progress', max > 0 ? Math.min(1, y / max).toFixed(4) : 0);
    if (header) header.classList.toggle('scrolled', y > 10);

    var vh = window.innerHeight;
    if (steps && !reduce) {
      var r = steps.getBoundingClientRect();
      var p = (vh * 0.85 - r.top) / (vh * 0.5);
      steps.style.setProperty('--p', Math.max(0, Math.min(1, p)).toFixed(3));
    }
    if (!reduce && window.innerWidth > 960) {
      devices.forEach(function (d, i) {
        var r2 = d.getBoundingClientRect();
        if (r2.bottom < -100 || r2.top > vh + 100) return;
        var off = (r2.top + r2.height / 2 - vh / 2) * (i % 2 ? 0.07 : -0.07);
        d.style.translate = '0 ' + off.toFixed(1) + 'px';
      });
    } else { devices.forEach(function (d) { d.style.translate = ''; }); }
    ticking = false;
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }
  window.addEventListener('scroll', req, { passive: true });
  window.addEventListener('resize', req);
  onScroll();

  // ---------- Reveal stagger + step number pop ----------
  $$('.reveal').forEach(function (el) {
    var sibs = Array.prototype.slice.call(el.parentNode.children).filter(function (c) { return c.classList.contains('reveal'); });
    var idx = sibs.indexOf(el);
    el.style.transitionDelay = (idx % 4) * 90 + 'ms';
  });
  $$('.steps li').forEach(function (li, i) { li.style.setProperty('--sd', (i * 160 + 150) + 'ms'); });

  // ---------- Active nav link ----------
  if ('IntersectionObserver' in window) {
    var links = {};
    $$('.nav-links a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        Object.keys(links).forEach(function (k) { links[k].classList.remove('active'); links[k].removeAttribute('aria-current'); });
        var a = links[en.target.id];
        if (a) { a.classList.add('active'); a.setAttribute('aria-current', 'true'); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) secObs.observe(s); });
  }

  // Everything below needs a mouse and motion allowed
  if (reduce) return;

  // ---------- Hero chips cycle (decorative) ----------
  var chips = $$('.hero .chip');
  if (chips.length) {
    var ci = 0;
    setInterval(function () {
      chips[ci].classList.remove('on');
      ci = (ci + 1) % chips.length;
      chips[ci].classList.add('on');
    }, 2400);
  }

  if (!fine) return;

  // ---------- Hero: mouse parallax + orchid cursor trail ----------
  var hero = $('.hero');
  var layer = $('.trail-layer');
  var depthEls = $$('[data-depth]', hero);
  var last = { x: -999, y: -999 }, live = 0, MAX_LIVE = 18, STEP = 70;

  hero.addEventListener('mousemove', function (e) {
    var hr = hero.getBoundingClientRect();
    var nx = (e.clientX - hr.left) / hr.width - 0.5;
    var ny = (e.clientY - hr.top) / hr.height - 0.5;
    depthEls.forEach(function (el) {
      var d = parseFloat(el.getAttribute('data-depth'));
      el.style.transform = 'translate3d(' + (nx * d).toFixed(1) + 'px,' + (ny * d).toFixed(1) + 'px,0)';
    });

    var x = e.clientX - hr.left, y = e.clientY - hr.top;
    if (Math.hypot(x - last.x, y - last.y) < STEP || live >= MAX_LIVE) return;
    last.x = x; last.y = y; live++;
    var img = document.createElement('img');
    img.src = 'assets/kitakits-icon.png'; img.alt = ''; img.setAttribute('aria-hidden', 'true');
    var size = 26 + Math.random() * 20;
    img.style.width = size + 'px'; img.style.left = x + 'px'; img.style.top = y + 'px';
    layer.appendChild(img);
    var rot = (Math.random() - 0.5) * 60;
    img.animate([
      { opacity: 0, transform: 'translate(-50%,-50%) scale(.3) rotate(' + rot + 'deg)' },
      { opacity: .85, offset: .25, transform: 'translate(-50%,-50%) scale(1) rotate(' + (rot + 15) + 'deg)' },
      { opacity: 0, transform: 'translate(-50%,calc(-50% + 36px)) scale(.8) rotate(' + (rot + 50) + 'deg)' }
    ], { duration: 1200, easing: 'cubic-bezier(.2,.7,.3,1)' }).onfinish = function () { img.remove(); live--; };
  });
  hero.addEventListener('mouseleave', function () {
    depthEls.forEach(function (el) { el.style.transform = ''; });
  });
  depthEls.forEach(function (el) { el.style.transition = 'transform .5s cubic-bezier(.2,.8,.2,1)'; });

  // ---------- Feature cards: spotlight + 3D tilt ----------
  $$('.card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', (px * 100) + '%');
      card.style.setProperty('--my', (py * 100) + '%');
      card.style.transition = 'transform .12s ease-out, opacity .6s';
      card.style.transform = 'perspective(800px) rotateX(' + ((0.5 - py) * 8).toFixed(2) + 'deg) rotateY(' + ((px - 0.5) * 10).toFixed(2) + 'deg) translateY(-6px)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transition = 'transform .5s cubic-bezier(.2,.8,.2,1), opacity .6s';
      card.style.transform = '';
    });
  });

  // ---------- Magnetic buttons ----------
  $$('.btn').forEach(function (b) {
    b.addEventListener('mousemove', function (e) {
      var r = b.getBoundingClientRect();
      var dx = (e.clientX - (r.left + r.width / 2)) * 0.18;
      var dy = (e.clientY - (r.top + r.height / 2)) * 0.28;
      b.style.translate = dx.toFixed(1) + 'px ' + dy.toFixed(1) + 'px';
    });
    b.addEventListener('mouseleave', function () { b.style.translate = ''; });
  });
})();
