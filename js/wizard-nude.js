/* =====================================================================
   wizard.js v2 — AI 정밀진단 위저드 (폰 목업 + 인트로 + 가로바 진행)
   ---------------------------------------------------------------------
   - 인트로(시작 버튼) → 6스텝 진단 → 마지막 submit(form-core가 처리)
   - 선택형(지역·혼인·부양): 칩 탭 → hidden 저장 → 자동 다음
   - 입력형(소득·채무): 만원 숫자, 값 있으면 '다음' 활성
   - 진행바: 1/6~6/6 채워짐 (도트 아님)
   - ★높이 고정: 뷰포트가 가장 긴 스텝(지역) 높이로 한번 고정 → 스텝마다 안 튐
   - 값은 [data-field] hidden/실입력에 모임 → form-core가 f.xxx.value로 읽어 제출
   ===================================================================== */
(function () {
  'use strict';

  var form = document.querySelector('.wz[data-form="lead"]');
  if (!form) return;

  var intro    = form.querySelector('[data-wz-intro]');
  var startBtn = form.querySelector('[data-wz-start]');
  var barWrap  = form.querySelector('[data-wz-bar]');
  var fill     = form.querySelector('[data-wz-fill]');
  var curEl    = form.querySelector('[data-wz-cur]');
  var viewport = form.querySelector('[data-wz-viewport]');
  var track    = form.querySelector('[data-wz-track]');
  var slides   = Array.prototype.slice.call(form.querySelectorAll('.wz__slide'));
  var backBtn  = form.querySelector('[data-wz-back]');
  if (!track || !slides.length) return;

  var index = 0;                 // 0-based 현재 스텝(진단 시작 후)
  var LAST  = slides.length - 1; // 5 (스텝6)
  var TOTAL = slides.length;     // 6

  /* ---------- hidden 값 세팅 + form-core 버튼 갱신 트리거 ---------- */
  function hidden(name) { return form.querySelector('input[type="hidden"][data-field="' + name + '"]'); }
  function setField(name, val) {
    var h = hidden(name); if (!h) return;
    h.value = val;
    try { h.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {}
  }

  /* ---------- 진행바 갱신 ---------- */
  function paintBar() {
    var pct = Math.round(((index + 1) / TOTAL) * 100);
    if (fill) fill.style.width = pct + '%';
    if (curEl) curEl.textContent = index + 1;
  }

  /* ---------- 스텝 이동 ---------- */
  function goTo(i) {
    index = Math.max(0, Math.min(LAST, i));
    track.style.transform = 'translateX(' + (-index * 100) + '%)';
    if (backBtn) backBtn.hidden = (index === 0);
    paintBar();

    // 입력형 스텝이면 포커스(모바일 키보드)
    var numInput = slides[index].querySelector('.wz__num');
    if (numInput) { try { numInput.focus({ preventScroll: true }); } catch (e) {} }
  }
  function next() { if (index < LAST) goTo(index + 1); }
  function prev() { if (index > 0) goTo(index - 1); }

  /* ---------- 뷰포트 높이 '고정' (가장 긴 슬라이드 기준, 1회) ----------
     스텝마다 높이 재계산하면 튀므로, 최초에 제일 큰 높이로 고정해버림. */
  function lockHeight() {
    if (!viewport) return;
    // 모든 슬라이드를 잠깐 보이게 해서 최대 높이 측정
    var max = 0;
    slides.forEach(function (s) {
      var h = s.scrollHeight;
      if (h > max) max = h;
    });
    if (max) viewport.style.height = max + 'px';
  }

  /* ---------- 인트로 → 진단 시작 ---------- */
  function startWizard() {
    if (intro) intro.hidden = true;
    if (barWrap) barWrap.hidden = false;
    if (viewport) viewport.hidden = false;
    lockHeight();       // 뷰포트 보인 뒤 높이 고정
    goTo(0);
  }
  if (startBtn) startBtn.addEventListener('click', startWizard);

  /* ---------- 선택형(칩): 탭 → 저장 → 자동 다음 ---------- */
  form.querySelectorAll('[data-wz-group]').forEach(function (group) {
    var name = group.getAttribute('data-wz-group');
    group.querySelectorAll('.wz__choice').forEach(function (btn) {
      btn.addEventListener('click', function () {
        group.querySelectorAll('.wz__choice').forEach(function (b) { b.classList.remove('is-selected'); });
        btn.classList.add('is-selected');
        setField(name, btn.getAttribute('data-value') || '');
        setTimeout(next, 200);
      });
    });
  });

  /* ---------- 입력형(만원): 숫자만 + '다음' 활성 ---------- */
  form.querySelectorAll('.wz__num').forEach(function (input) {
    var name = input.getAttribute('data-wz-num');
    var slide = input.closest('.wz__slide');
    var nextBtn = slide.querySelector('[data-wz-next]');
    function onInput() {
      var digits = (input.value || '').replace(/\D/g, '');
      input.value = digits;
      setField(name, digits);
      if (nextBtn) nextBtn.disabled = (digits.length === 0);
    }
    input.addEventListener('input', onInput);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); if (nextBtn && !nextBtn.disabled) next(); }
    });
  });

  /* ---------- '다음' 버튼 ---------- */
  form.querySelectorAll('[data-wz-next]').forEach(function (btn) {
    btn.addEventListener('click', function () { if (!btn.disabled) next(); });
  });

  /* ---------- '이전' 버튼 ---------- */
  if (backBtn) backBtn.addEventListener('click', prev);

  /* ---------- 중간 스텝 Enter 제출 차단 (마지막 스텝만 form-core 처리) ---------- */
  form.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && index < LAST) {
      var t = e.target;
      if (!t.closest || !t.closest('[data-wz-step="6"]')) e.preventDefault();
    }
  });

  /* ---------- 리사이즈 시 높이 재고정 ---------- */
  var rHold = 0;
  window.addEventListener('resize', function () {
    if (viewport && viewport.hidden) return;
    clearTimeout(rHold);
    rHold = setTimeout(lockHeight, 150);
  });
})();
