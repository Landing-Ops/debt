/* =====================================================================
   carousel.js  —  후기 슬라이더 (Vanilla)
   기존 index.html 인라인 캐러셀 스크립트를 그대로 이식.
   translateX 슬라이드 · dots · prev/next · 자동재생(5.5s) · hover 정지 ·
   화살표키 · 터치 스와이프 · IntersectionObserver 진입 시작 ·
   before/after 막대높이 동적계산(0.32 / 0.92) · 리사이즈 재계산
===================================================================== */
(function () {
  'use strict';

  var root = document.querySelector('.section.testimonials');
  if (!root) return;

  var track   = root.querySelector('.ts__track');
  var slides  = Array.prototype.slice.call(root.querySelectorAll('.ts__slide'));
  var prevBtn = root.querySelector('.ts__nav--prev');
  var nextBtn = root.querySelector('.ts__nav--next');
  var dots    = Array.prototype.slice.call(root.querySelectorAll('.ts__dot'));
  if (!track || !slides.length) return;

  var index = 0;
  var DURATION = 5500;
  var timer = null;
  var isPaused = false;

  /* ── 그래프 높이 계산 & 적용 ── */
  function usableHeight(chartEl) {
    var cs = getComputedStyle(chartEl);
    var pt = parseFloat(cs.paddingTop) || 0;
    var pb = parseFloat(cs.paddingBottom) || 0;
    return Math.max(0, chartEl.clientHeight - pt - pb);
  }

  function setBarsForSlide(slide) {
    if (!slide) return;
    var chart = slide.querySelector('.ts__miniChart');
    if (!chart) return;
    var useH = usableHeight(chart);
    var beforeRatio = 0.32, afterRatio = 0.92;
    var beforeBar = chart.querySelector('.ts__bar--before');
    var afterBar  = chart.querySelector('.ts__bar--after');

    if (beforeBar) beforeBar.style.setProperty('--bar-h', '0px');
    if (afterBar)  afterBar.style.setProperty('--bar-h', '0px');

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (beforeBar) beforeBar.style.setProperty('--bar-h', Math.round(useH * beforeRatio) + 'px');
        if (afterBar)  afterBar.style.setProperty('--bar-h', Math.round(useH * afterRatio) + 'px');
      });
    });
  }

  function resetBars(slide) {
    slide.querySelectorAll('.ts__bar').forEach(function (b) { b.style.setProperty('--bar-h', '0px'); });
  }

  /* ── 슬라이더 동작 ── */
  function activate(i) {
    slides.forEach(function (s, si) {
      s.classList.toggle('is-active', si === i);
      if (si === i) setBarsForSlide(s); else resetBars(s);
    });
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = 'translate3d(' + (-index * 100) + '%,0,0)';
    dots.forEach(function (d, di) { d.setAttribute('aria-selected', di === index ? 'true' : 'false'); });
    activate(index);
  }
  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  function start() { stop(); timer = setInterval(function () { if (!isPaused) next(); }, DURATION); }
  function stop() { if (timer) clearInterval(timer); }

  if (nextBtn) nextBtn.addEventListener('click', function () { next(); start(); });
  if (prevBtn) prevBtn.addEventListener('click', function () { prev(); start(); });
  dots.forEach(function (d, di) { d.addEventListener('click', function () { goTo(di); start(); }); });

  root.addEventListener('mouseenter', function () { isPaused = true; });
  root.addEventListener('mouseleave', function () { isPaused = false; });

  root.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { next(); start(); }
    if (e.key === 'ArrowLeft')  { prev(); start(); }
  });
  root.setAttribute('tabindex', '0');

  /* 터치 스와이프 */
  var sx = 0, dx = 0;
  root.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; dx = 0; }, { passive: true });
  root.addEventListener('touchmove',  function (e) { dx = e.touches[0].clientX - sx; }, { passive: true });
  root.addEventListener('touchend',   function () { if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); start(); } });

  /* 진입 시 시작 */
  var io = new IntersectionObserver(function (entries) {
    if (entries.some(function (e) { return e.isIntersecting; })) { goTo(0); start(); io.disconnect(); }
  }, { threshold: 0.2 });
  io.observe(root);

  /* 리사이즈/회전 시 현재 슬라이드 그래프 재계산 */
  var resizeRaf = 0;
  function onResize() {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(function () { setBarsForSlide(slides[index]); });
  }
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);
})();
