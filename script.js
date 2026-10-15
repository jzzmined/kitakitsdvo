// Kitakits DVO – small interactions only (no backend, no tracking)
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  // Mobile menu
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('nav-menu');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  // Current year in footer
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Phone previews: hide the placeholder only if the real screenshot loads
  document.querySelectorAll('.phone img').forEach(function (img) {
    function ok() { var p = img.parentElement.querySelector('.placeholder'); if (p) p.hidden = true; }
    function fail() { img.remove(); }
    if (img.complete) { img.naturalWidth ? ok() : fail(); }
    else { img.addEventListener('load', ok); img.addEventListener('error', fail); }
  });

  // QR code: show assets/qr-code.png if it exists, else keep the placeholder
  var qr = document.getElementById('qr-image');
  var qrPlaceholder = document.getElementById('qr-placeholder');
  if (qr) {
    var probe = new Image();
    probe.onload = function () { qr.hidden = false; qrPlaceholder.hidden = true; };
    probe.src = qr.getAttribute('src');
  }

  // Gentle reveal on scroll
  var items = document.querySelectorAll('.card, .steps li, .device, .why-grid li, .about-grid > div');
  items.forEach(function (el) { el.classList.add('reveal'); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }
})();
