/* =====================================================================
   carousel.js  —  후기 슬라이더 (Vanilla JS)
   기능: 슬라이드 전환 · dots 연동 · prev/next 버튼 · 자동재생(11s)
        · PC hover 정지 · 모바일 터치 정지 · 화살표키 이동
        · 화면 진입 시 자동재생 시작
====================================================================== */
(function () {
  'use strict';

  /* ---------- 1. 요소 찾기 ---------- */
  // 섹션 자체가 없으면 아무것도 안 하고 종료 (다른 페이지에서 에러 방지)
  var root = document.querySelector('.section.testimonials');
  if (!root) return;

  var track   = root.querySelector('.ts__track');                                  // 슬라이드들을 감싼 트랙(가로로 이동시킬 대상)
  var slides  = Array.prototype.slice.call(root.querySelectorAll('.ts__slide'));    // 슬라이드 전체 배열
  var prevBtn = root.querySelector('.ts__nav--prev');                              // 이전 버튼
  var nextBtn = root.querySelector('.ts__nav--next');                              // 다음 버튼
  var dots    = Array.prototype.slice.call(root.querySelectorAll('.ts__dot'));      // 하단 점(dots) 배열
  if (!track || !slides.length) return;   // 트랙이나 슬라이드가 없으면 종료 (안전장치)

  /* ---------- 2. 상태 변수 ---------- */
  var index = 0;            // 현재 보여지는 슬라이드 번호 (0부터 시작)
  var DURATION = 11000;     // 자동재생 간격 (11초) — 카피 3단락을 편히 읽을 시간 확보
  var timer = null;         // setInterval 타이머 저장용
  var isPaused = false;     // true면 자동재생 멈춤 (hover 중 / 터치 중)

  /* ---------- 3. 슬라이드 이동 함수 ---------- */
  function goTo(i) {
    // 인덱스가 배열 범위를 벗어나도 순환되게 처리 (마지막에서 next → 처음으로, 처음에서 prev → 마지막으로)
    index = (i + slides.length) % slides.length;

    // 트랙을 가로로 이동시켜 해당 슬라이드가 보이게 함
    track.style.transform = 'translate3d(' + (-index * 100) + '%,0,0)';

    // 하단 dots 중 현재 슬라이드에 해당하는 dot만 aria-selected="true"로 표시 (접근성 + 시각적 표시)
    dots.forEach(function (d, di) {
      d.setAttribute('aria-selected', di === index ? 'true' : 'false');
    });
  }
  function next() { goTo(index + 1); }   // 다음 슬라이드로
  function prev() { goTo(index - 1); }   // 이전 슬라이드로

  /* ---------- 4. 자동재생 타이머 ---------- */
  function tick() {
    // 멈춤 상태(hover/터치 중)가 아닐 때만 다음 슬라이드로 이동
    if (!isPaused) next();
  }
  function start() {
    stop();  // 기존 타이머 있으면 먼저 제거 (중복 실행 방지)
    timer = setInterval(tick, DURATION);
  }
  function stop() {
    if (timer) clearInterval(timer);
  }

  /* ---------- 5. 버튼 클릭 이벤트 ---------- */
  // next 버튼 클릭 → 다음 슬라이드로 이동 + 자동재생 타이머 리셋(처음부터 11초 다시 카운트)
  if (nextBtn) nextBtn.addEventListener('click', function () { next(); start(); });
  // prev 버튼 클릭 → 이전 슬라이드로 이동 + 타이머 리셋
  if (prevBtn) prevBtn.addEventListener('click', function () { prev(); start(); });
  // dot 클릭 → 해당 번호 슬라이드로 직접 이동 + 타이머 리셋
  dots.forEach(function (d, di) {
    d.addEventListener('click', function () { goTo(di); start(); });
  });

  /* ---------- 6. PC: 마우스 hover 시 자동재생 정지 ---------- */
  root.addEventListener('mouseenter', function () { isPaused = true; });   // 섹션에 마우스 올라오면 멈춤
  root.addEventListener('mouseleave', function () { isPaused = false; });  // 마우스 벗어나면 재개

  /* ---------- 7. 모바일: 화면 터치 중 자동재생 정지 ---------- */
  // 섹션 영역 어디든 손가락이 닿으면(touchstart) 멈춤
  root.addEventListener('touchstart', function () { isPaused = true; }, { passive: true });
  // 손을 떼면(touchend) 재개 + 타이머 리셋 (터치 종료 시점부터 다시 11초 카운트)
  root.addEventListener('touchend', function () { isPaused = false; start(); }, { passive: true });

  /* ---------- 8. 키보드 화살표 이동 ---------- */
  root.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { next(); start(); }   // → 키: 다음 슬라이드
    if (e.key === 'ArrowLeft')  { prev(); start(); }   // ← 키: 이전 슬라이드
  });
  root.setAttribute('tabindex', '0');   // 섹션이 키보드 포커스를 받을 수 있게 설정 (안 하면 keydown이 안 먹힘)

  /* ---------- 9. 화면에 섹션이 보이면 자동재생 시작 ---------- */
  var io = new IntersectionObserver(function (entries) {
    // 섹션이 화면에 20% 이상 보이는 순간 1회 실행
    if (entries.some(function (e) { return e.isIntersecting; })) {
      goTo(0);          // 1번 슬라이드부터 시작
      start();          // 자동재생 시작
      io.disconnect();  // 한 번 실행 후 감시 중단 (스크롤 왔다갔다해도 재실행 안 됨)
    }
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