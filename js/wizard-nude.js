/* =====================================================================
   wizard.js — AI 정밀진단 인라인 위저드 (카드 안에서 한 화면씩 전환)
   ---------------------------------------------------------------------
   [역할]
   - 6스텝을 트랙(translateX)으로 한 장씩 넘김 (carousel.js와 동일 원리)
   - 선택형(거주지역·혼인·부양가족): 칩 탭하면 hidden input에 값 넣고 자동 다음장
   - 입력형(소득·채무): 만원 단위 숫자 입력, 값 있으면 '다음' 활성화
   - 값은 전부 [data-field] hidden input/실입력에 모임
     → form-core-certification.js 가 기존처럼 f.xxx.value 로 읽어 제출
   - 마지막 스텝의 submit 버튼은 form-core의 submit 핸들러가 처리(무수정)

   ★ 이 파일은 form-core '앞'이든 '뒤'든 로드 순서 무관(제출은 form-core가 함).
   ★ 거절조건·계산 없음 — 순수 UI 전환 + 값 수집만.
   ===================================================================== */
(function () {
  'use strict';

  var form = document.querySelector('.wz[data-form="lead"]');
  if (!form) return;

  var track   = form.querySelector('[data-wz-track]');
  var slides  = Array.prototype.slice.call(form.querySelectorAll('.wz__slide'));
  var dots    = Array.prototype.slice.call(form.querySelectorAll('.wz__dot'));
  var curEl   = form.querySelector('[data-wz-cur]');
  var backBtn = form.querySelector('[data-wz-back]');
  if (!track || !slides.length) return;

  var index = 0;                 // 0-based 현재 스텝
  var LAST  = slides.length - 1; // 5 (스텝6)

  /* ---------- hidden input 헬퍼 ---------- */
  function hidden(fieldName) {
    return form.querySelector('input[type="hidden"][data-field="' + fieldName + '"]');
  }
  // 값 세팅 + form-core의 updateButton이 듣도록 change 이벤트 발생
  function setField(fieldName, value) {
    var h = hidden(fieldName);
    if (!h) return;
    h.value = value;
    try { h.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {}
  }

  /* ---------- 스텝 이동 ---------- */
  function goTo(i) {
    index = Math.max(0, Math.min(LAST, i));
    track.style.transform = 'translateX(' + (-index * 100) + '%)';

    dots.forEach(function (d, di) { d.classList.toggle('is-active', di <= index); });
    if (curEl) curEl.textContent = index + 1;

    // 뒤로가기 버튼: 첫 화면에선 숨김
    if (backBtn) backBtn.hidden = (index === 0);

    // 현재 스텝의 첫 입력에 포커스(입력형일 때만 — 모바일 키보드 편의)
    var numInput = slides[index].querySelector('.wz__num');
    if (numInput) { try { numInput.focus({ preventScroll: true }); } catch (e) { numInput.focus(); } }

    // 뷰포트 높이를 현재 슬라이드에 맞춤(스텝마다 내용 길이 달라 카드가 들쭉거리는 것 방지)
    syncHeight();
  }
  function next() { if (index < LAST) goTo(index + 1); }
  function prev() { if (index > 0) goTo(index - 1); }

  /* ---------- 뷰포트 높이 동기화 ---------- */
  var viewport = form.querySelector('.wz__viewport');
  function syncHeight() {
    if (!viewport) return;
    var h = slides[index].offsetHeight;
    if (h) viewport.style.height = h + 'px';
  }

  /* ---------- 선택형(칩) 처리: 탭 → 값저장 → 자동 다음 ---------- */
  form.querySelectorAll('[data-wz-group]').forEach(function (group) {
    var fieldName = group.getAttribute('data-wz-group');
    group.querySelectorAll('.wz__choice').forEach(function (btn) {
      btn.addEventListener('click', function () {
        // 같은 그룹 내 선택표시 갱신
        group.querySelectorAll('.wz__choice').forEach(function (b) { b.classList.remove('is-selected'); });
        btn.classList.add('is-selected');
        // hidden input에 값 저장(+ form-core 버튼 갱신 트리거)
        setField(fieldName, btn.getAttribute('data-value') || '');
        // 살짝 텀 주고 자동 전진(선택 피드백 보이게)
        setTimeout(next, 180);
      });
    });
  });

  /* ---------- 입력형(만원 단위): 숫자만 허용 + '다음' 활성 ---------- */
  form.querySelectorAll('.wz__num').forEach(function (input) {
    var fieldName = input.getAttribute('data-wz-num');
    var slide = input.closest('.wz__slide');
    var nextBtn = slide.querySelector('[data-wz-next]');

    function onInput() {
      // 숫자만 남김
      var digits = (input.value || '').replace(/\D/g, '');
      input.value = digits;
      setField(fieldName, digits);
      if (nextBtn) nextBtn.disabled = (digits.length === 0);
    }
    input.addEventListener('input', onInput);

    // 엔터로도 다음 (모바일 '완료' 키)
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); if (nextBtn && !nextBtn.disabled) next(); }
    });
  });

  /* ---------- '다음' 버튼(입력형) ---------- */
  form.querySelectorAll('[data-wz-next]').forEach(function (btn) {
    btn.addEventListener('click', function () { if (!btn.disabled) next(); });
  });

  /* ---------- '이전' 버튼 ---------- */
  if (backBtn) backBtn.addEventListener('click', prev);

  /* ---------- ★ 중간 스텝에서 Enter가 폼 제출로 새지 않게 방지 ----------
     마지막 스텝(6)의 submit 버튼만 form-core가 처리해야 함.
     앞 스텝에서 Enter 눌러 form submit 되는 것 차단(입력형은 위에서 next로 가로챔). */
  form.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && index < LAST) {
      var t = e.target;
      // 마지막 스텝의 실제 입력이 아니면 제출 막음
      if (!t.closest || !t.closest('[data-wz-step="6"]')) e.preventDefault();
    }
  });

  /* ---------- 리사이즈시 높이 재동기화 ---------- */
  var rHold = 0;
  window.addEventListener('resize', function () {
    clearTimeout(rHold);
    rHold = setTimeout(syncHeight, 120);
  });

  /* ---------- 초기화 ---------- */
  goTo(0);
  // 폰트/레이아웃 안정화 후 높이 한 번 더(첫 계산이 0으로 잡히는 것 방지)
  window.addEventListener('load', syncHeight);
  setTimeout(syncHeight, 300);
})();
