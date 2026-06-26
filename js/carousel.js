/* =====================================================================
   carousel.js  —  후기 슬라이더 (Vanilla)
   슬라이드 전환(translateX) · dots · prev/next · 자동재생(5.5s) · hover 정지 ·
   화살표키 · 터치 스와이프 · IntersectionObserver 진입 시작
   + [자세히 읽기] 인라인 펼침/접힘
   자동재생 규칙:
     - 펼치면 자동재생 정지
     - 접거나 다른 슬라이드로 넘기면 5.5초 재생 재개
     - 슬라이드를 넘기면 새 슬라이드는 항상 "접힌" 기본 상태로 리셋
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
  var isPaused = false;   // hover 시 정지
  var expanded = false;   // 현재 슬라이드 본문 펼침 여부 (펼침 = 자동재생 정지)

  /* 모든 슬라이드 본문을 접힌 기본 상태로 리셋 */
  function collapseAll() {
    slides.forEach(function (s) {
      var q = s.querySelector('.ts__quote');
      var btn = s.querySelector('.ts__more');
      if (q) q.classList.remove('is-expanded');
      if (btn) { btn.setAttribute('aria-expanded', 'false'); btn.textContent = '자세히 읽기'; }
    });
    expanded = false;
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = 'translate3d(' + (-index * 100) + '%,0,0)';
    dots.forEach(function (d, di) { d.setAttribute('aria-selected', di === index ? 'true' : 'false'); });
    collapseAll();   // 슬라이드 바뀌면 항상 접힘 → 자동재생 자연 재개
  }
  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  function tick()  { if (!isPaused && !expanded) next(); }   // 펼침/hover 중엔 멈춤
  function start() { stop(); timer = setInterval(tick, DURATION); }
  function stop()  { if (timer) clearInterval(timer); }

  if (nextBtn) nextBtn.addEventListener('click', function () { next(); start(); });
  if (prevBtn) prevBtn.addEventListener('click', function () { prev(); start(); });
  dots.forEach(function (d, di) { d.addEventListener('click', function () { goTo(di); start(); }); });

  /* [자세히 읽기] / [접기] : 펼치면 정지, 접으면 재개 */
  slides.forEach(function (s) {
    var q = s.querySelector('.ts__quote');
    var btn = s.querySelector('.ts__more');
    if (!q || !btn) return;
    btn.addEventListener('click', function () {
      var open = q.classList.toggle('is-expanded');
      btn.setAttribute('aria-expanded', open);
      btn.textContent = open ? '접기' : '자세히 읽기';
      expanded = open;   // 펼침=true → tick 멈춤 / 접힘=false → 다음 tick부터 재생
    });
  });

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

  /* 화면에 들어오면 시작 */
  var io = new IntersectionObserver(function (entries) {
    if (entries.some(function (e) { return e.isIntersecting; })) { goTo(0); start(); io.disconnect(); }
  }, { threshold: 0.2 });
  io.observe(root);
})();
