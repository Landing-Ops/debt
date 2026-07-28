/* js/footer.js — 매체별 푸터 프로필 적용 */
(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────
     ★ 여기만 관리하면 됨
     - 키: URL의 mp 파라미터 값 (소문자, MEDIA_MAP의 키와 동일)
     - 값: HTML의 data-foot 속성에 쓴 프로필 이름
     - 여기 없는 매체 + 파라미터 없이 들어온 경우 = 전부 'full'
     ───────────────────────────────────────────────────────── */
  var FOOTER_PROFILE = {
    meta:'simple',  // "simple - 간단한 푸터"
    facebook:'simple',
    insta:'simple',
    tiktok:'simple',
    youtube:'simple',
    google:'simple',
    carrot:'simple',
    kakao:'full',  // "full - 완전한 푸터"
    naversa:'full',
    naverda:'full',
  };

  var profile = FOOTER_PROFILE[window.FOOTER_MEDIA || ''] || 'full';

  var footer = document.querySelector('.site-footer');
  if (!footer) return;

  footer.setAttribute('data-profile', profile);   // CSS로 추가 스타일 걸고 싶을 때 활용
  footer.querySelectorAll('[data-foot]').forEach(function (el) {
    if (el.getAttribute('data-foot').split(/\s+/).indexOf(profile) === -1) el.remove();
  });
})();