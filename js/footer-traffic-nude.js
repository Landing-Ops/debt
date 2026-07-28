/* footer-traffic.js — 랜딩/땡큐 공통. 푸터용 매체 판별 (읽기 전용) */
(function () {
  'use strict';

  var KEY = 'footer_media';   // ★ form-core의 'traffic' 키와 분리 — 절대 겹치지 않게
  var code = (new URLSearchParams(location.search).get('mp') || '').trim().toLowerCase();

  if (code) {
    try { sessionStorage.setItem(KEY, code); } catch (e) {}
  } else {
    // 파라미터 없음(땡큐페이지, 재방문 등) → 이전 값 재사용
    try { code = sessionStorage.getItem(KEY) || ''; } catch (e) {}
  }

  window.FOOTER_MEDIA = code;
})();