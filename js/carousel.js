/* =====================================================================
   carousel.js  —  후기 슬라이더 (Vanilla)
   슬라이드 전환(translateX) · dots · prev/next · 자동재생(5.5s) · hover 정지 ·
   화살표키 · 터치 스와이프 · IntersectionObserver 진입 시작
   + [자세히 읽기] 인라인 펼침/접힘
   자동재생 규칙:
     - 펼치면 자동재생 정지
     - 접거나 다른 슬라이드로 넘기면 5.5초 재생 재개
     - 슬라이드를 넘기면 새 슬라이드는 항상 "접힌" 기본 상태로 리셋
====================================================================== */
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
  // var sx = 0, dx = 0;
  // root.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; dx = 0; }, { passive: true });
  // root.addEventListener('touchmove',  function (e) { dx = e.touches[0].clientX - sx; }, { passive: true });
  // root.addEventListener('touchend',   function () { if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); start(); } });

  /* 화면에 들어오면 시작 */
  var io = new IntersectionObserver(function (entries) {
    if (entries.some(function (e) { return e.isIntersecting; })) { goTo(0); start(); io.disconnect(); }
  }, { threshold: 0.2 });
  io.observe(root);
})();


// 섹션2 - ★★정책자금 그래프 가져옴★★
(() => {
  const root = document.querySelector('.section.testimonials');
  if (!root) return;

  const track   = root.querySelector('.ts__track');
  const slides  = Array.from(root.querySelectorAll('.ts__slide'));
  const prevBtn = root.querySelector('.ts__nav--prev');
  const nextBtn = root.querySelector('.ts__nav--next');
  const dots    = Array.from(root.querySelectorAll('.ts__dot'));

  let index = 0;
  const DURATION = 5500;
  let timer = null;
  let isPaused = false;

  /* ───────── 그래프 높이 계산 & 적용 ───────── */
  function usableHeight(chartEl){
    // 그래프 컨테이너의 내부 실사용 높이(패딩 제외)
    const cs = getComputedStyle(chartEl);
    const pt = parseFloat(cs.paddingTop)    || 0;
    const pb = parseFloat(cs.paddingBottom) || 0;
    return Math.max(0, chartEl.clientHeight - pt - pb);
  }

  function setBarsForSlide(slide){
    const chart = slide.querySelector('.ts__miniChart');
    if (!chart) return;

    const useH = usableHeight(chart);

    // ★ 고정값 대신 data 속성에서 읽기 (없으면 기본값)
  const beforeRatio = parseFloat(chart.dataset.before) || 0.90;
  const afterRatio  = parseFloat(chart.dataset.after)  || 0.20;

  const beforeBar = chart.querySelector('.ts__bar--before');
  const afterBar  = chart.querySelector('.ts__bar--after');

    // (안전) 먼저 0으로 리셋 → 다음 프레임에 목표값 적용해 애니메이션 유도
    if (beforeBar) beforeBar.style.setProperty('--bar-h', '0px');
    if (afterBar)  afterBar.style.setProperty('--bar-h',  '0px');

    // 레이아웃 안정 후 적용 (Safari 대비 2프레임 확보)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (beforeBar) {
          const h = Math.round(useH * beforeRatio);
          beforeBar.style.setProperty('--bar-h', h + 'px');
        }
        if (afterBar) {
          const h = Math.round(useH * afterRatio);
          afterBar.style.setProperty('--bar-h', h + 'px');
        }
      });
    });
  }

  function resetBars(slide){
    // 비활성화 시 0으로 내려서 다음에 다시 올라가도록
    slide.querySelectorAll('.ts__bar').forEach(b => {
      b.style.setProperty('--bar-h', '0px');
    });
  }

  /* ───────── 슬라이더 기본 동작 ───────── */
  function activate(i){
    slides.forEach((s, si) => {
      s.classList.toggle('is-active', si === i);
      if (si === i) setBarsForSlide(s);
      else          resetBars(s);
    });
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translate3d(${-index * 100}%,0,0)`;
    dots.forEach((d, di) => d.setAttribute('aria-selected', di === index ? 'true' : 'false'));
    activate(index);
  }
  function next(){ goTo(index + 1); }
  function prev(){ goTo(index - 1); }

  function start(){ stop(); timer = setInterval(() => { if (!isPaused) next(); }, DURATION); }
  function stop(){ if (timer) clearInterval(timer); }

  nextBtn?.addEventListener('click', () => { next(); start(); });
  prevBtn?.addEventListener('click', () => { prev(); start(); });
  dots.forEach((d, di) => d.addEventListener('click', () => { goTo(di); start(); }));

  root.addEventListener('mouseenter', () => { isPaused = true; });
  root.addEventListener('mouseleave', () => { isPaused = false; });

  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { next(); start(); }
    if (e.key === 'ArrowLeft')  { prev(); start(); }
  });
  root.setAttribute('tabindex', '0');

  // 터치 스와이프
  // let sx = 0, dx = 0;
  // root.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; dx = 0; }, {passive:true});
  // root.addEventListener('touchmove',  (e) => { dx = e.touches[0].clientX - sx; }, {passive:true});
  // root.addEventListener('touchend',   ()  => {
  //   if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); start(); }
  // });

  // 초기 진입: 섹션이 보이면 1번 슬라이드 활성화
  const io = new IntersectionObserver((entries) => {
    if (entries.some(e => e.isIntersecting)) {
      goTo(0);
      start();
      io.disconnect();
    }
  }, {threshold: 0.2});
  io.observe(root);

  // 리사이즈/회전 시 현재 슬라이드 그래프 재계산
  let resizeRaf = 0;
  function onResize(){
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      setBarsForSlide(slides[index]);
    });
  }
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);
})();