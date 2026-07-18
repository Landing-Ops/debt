/* =====================================================================
   countdown.js  —  제한시간 띠배너 카운트다운 + 종료 팝업
   - 15분(기본) 카운트다운, 스크롤 따라다니는 하단 고정 배너
   - 시간 만료 시: 배너 숨김 + 종료 팝업 노출 + 배경 스크롤 잠금
   - 새로고침해도 이어지도록 최초 진입 시각을 sessionStorage에 저장
     (※ 나중에 서버 연동 시, 이 시작시각을 서버 응답값으로 대체하면 됨)
===================================================================== */
(function () {
  'use strict';

  var bar     = document.querySelector('[data-countdown-bar]');
  var timeEl  = document.querySelector('[data-countdown-time]');
  var modal   = document.querySelector('[data-countdown-modal]');
  if (!bar || !timeEl) return;   // 배너 없으면 아무것도 안 함 (다른 페이지 안전)

  /* ---------- 설정 ---------- */
  var LIMIT_MIN = 0.3;                 // ★ 제한시간(분) — 여기만 바꾸면 됨
  var LIMIT_MS  = LIMIT_MIN * 60 * 1000;
  var STORE_KEY = 'ttl_start_at';     // 시작 시각 저장 키

  /* ---------- 시작 시각 결정 (새로고침 시 이어지게) ---------- */
  var startAt;
  try {
    var saved = sessionStorage.getItem(STORE_KEY);
    if (saved) {
      startAt = parseInt(saved, 10);
    } else {
      startAt = Date.now();
      sessionStorage.setItem(STORE_KEY, String(startAt));
    }
  } catch (e) {
    // sessionStorage 막힌 환경(일부 인앱브라우저) → 이번 세션 기준으로만
    startAt = Date.now();
  }

  document.body.classList.add('has-ttl-bar');

  /* ---------- 남은 시간 표시 ---------- */
  function format(ms) {
    if (ms < 0) ms = 0;
    var totalSec = Math.floor(ms / 1000);
    var m = Math.floor(totalSec / 60);
    var s = totalSec % 60;
    return (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
  }

  var timer = null;

  function tick() {
    var elapsed = Date.now() - startAt;
    var remain = LIMIT_MS - elapsed;

    if (remain <= 0) {
      timeEl.textContent = '00:00';
      stop();
      expire();
      return;
    }
    timeEl.textContent = format(remain);
  }

  function start() {
    tick();                       // 즉시 1회
    timer = setInterval(tick, 1000);
  }
  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  /* ---------- 만료 처리 ---------- */
  function expire() {
    // 배너 숨김
    bar.classList.add('is-hidden');
    document.body.classList.remove('has-ttl-bar');

    // 종료 팝업 노출
    if (modal) {
      modal.hidden = false;
      document.body.classList.add('ttl-locked');
    }

    // ★ 나중에 서버 연동 지점 ★
    // 여기서 Apps Script로 "이 UID 만료됨" 기록을 보내거나,
    // 페이지 콘텐츠를 가리는 처리를 추가하면 됨.
    // 예: navigator.sendBeacon(EXPIRE_URL, ...);
  }

  start();
})();
