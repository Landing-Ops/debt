/* =====================================================================
   hopeworkout-track.js — 랜딩 섹션별 체류·이탈·후기카드 추적
   ---------------------------------------------------------------------
   추적 3층:
   [1] 섹션별 누적 체류초 (IntersectionObserver enter/exit)
   [2] 최대 도달 섹션 + 이탈 직전 마지막 섹션
   [3] 후기 캐러셀 카드별 조회 (is-active MutationObserver + dot/nav 클릭)

   전송: pagehide / visibilitychange(hidden) 에서 sendBeacon 1회 스냅샷
   ★ carousel.js·form-core 등 기존 코드 절대 무수정. 이벤트만 얹음.
====================================================================== */
(function () {
  'use strict';

  // ── 전송 대상 (새 worker 라우트) ──────────────────────────────
  var TRACK_URL = 'https://hopeworkout.softman007.workers.dev/track';

  // ── sid 발급 (세션 단위, AI진단 sid와 키 분리: hw_sid) ─────────
  var SID_KEY = 'hw_sid';
  var sid = '';
  try {
    sid = sessionStorage.getItem(SID_KEY) || '';
    if (!sid) {
      sid = (crypto && crypto.randomUUID) ? crypto.randomUUID()
            : 'hw-' + Date.now() + '-' + Math.random().toString(16).slice(2);
      sessionStorage.setItem(SID_KEY, sid);
    }
  } catch (e) {
    sid = 'hw-' + Date.now() + '-' + Math.random().toString(16).slice(2);
  }

  // ── 유입매체(footer-traffic.js가 채운 값) + 디바이스 ───────────
  var media = (window.FOOTER_MEDIA || '') + '';
  var device = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? 'Mobile' : 'PC';

  // ── 섹션 정의 (순서 = 퍼널 순서) ──────────────────────────────
  var SECTION_DEFS = [
    { key: 'hero',        sel: '#hero' },
    { key: 'testimonial', sel: '#testimonial' },
    { key: 'counter',     sel: '.section.success' },
    { key: 'qualify',     sel: '.section.industries' },
    { key: 'benefits',    sel: '.section.benefits' },
    { key: 'cta',         sel: '.leadform, #contact, [data-form="lead"]' },
    { key: 'form',        sel: '[data-form="lead"]' }
  ];
  var SECTION_ORDER = SECTION_DEFS.map(function (d) { return d.key; });

  // 체류 누적 상태
  var dwellMs = {};              // key -> 누적 ms
  var enterAt = {};              // key -> 현재 화면에 들어온 시각(ms), 없으면 미표시
  SECTION_ORDER.forEach(function (k) { dwellMs[k] = 0; });

  var maxSectionIdx = -1;        // 최대 도달 섹션 인덱스
  var lastVisibleKey = '';       // 이탈 직전 마지막으로 보인 섹션
  var pageEnterMs = Date.now();

  // sel로 실제 엘리먼트 찾기(cta/form은 같은 섹션이라 중복 가능 — 첫 매치)
  function resolveEl(sel) {
    var parts = sel.split(',');
    for (var i = 0; i < parts.length; i++) {
      var el = document.querySelector(parts[i].trim());
      if (el) return el;
    }
    return null;
  }

  // ── [1][2] 섹션 IntersectionObserver ─────────────────────────
  var keyByEl = new Map();
  var secObserver = new IntersectionObserver(function (entries) {
    var now = Date.now();
    entries.forEach(function (ent) {
      var key = keyByEl.get(ent.target);
      if (!key) return;
      if (ent.isIntersecting) {
        if (!enterAt[key]) enterAt[key] = now;
        lastVisibleKey = key;
        var idx = SECTION_ORDER.indexOf(key);
        if (idx > maxSectionIdx) maxSectionIdx = idx;
      } else {
        if (enterAt[key]) {
          dwellMs[key] += now - enterAt[key];
          enterAt[key] = 0;
        }
      }
    });
  }, { threshold: 0.35 });   // 섹션 35% 이상 보이면 '봤다'로 간주

  SECTION_DEFS.forEach(function (def) {
    var el = resolveEl(def.sel);
    if (!el) return;
    // 같은 엘리먼트에 두 key(cta/form)가 걸리면 뒤엣것이 덮어씀 → form 우선순위 위해 첫 등록만 유지
    if (!keyByEl.has(el)) {
      keyByEl.set(el, def.key);
      secObserver.observe(el);
    }
  });

  // 현재 화면에 떠있는 섹션들의 체류를 지금까지로 정산(전송 직전 호출)
  function settleDwell() {
    var now = Date.now();
    Object.keys(enterAt).forEach(function (key) {
      if (enterAt[key]) {
        dwellMs[key] += now - enterAt[key];
        enterAt[key] = now;   // 계속 보고 있으면 다음 정산 위해 리셋
      }
    });
  }

  // ── [3] 후기 캐러셀 카드별 추적 ──────────────────────────────
  var seenCards = {};            // slideNo -> true
  var seenCats  = {};            // category -> true
  var maxCard = 0;
  var tsRoot = document.querySelector('.section.testimonials');

  function slideNoOf(li) {
    // id="slide-3" → 3, 없으면 DOM 순서
    var m = (li.id || '').match(/slide-(\d+)/);
    if (m) return parseInt(m[1], 10);
    var arr = Array.prototype.slice.call(li.parentNode.children);
    return arr.indexOf(li) + 1;
  }
  function catOf(li) {
    var chip = li.querySelector('.chip');
    return chip ? (chip.textContent || '').trim() : '';
  }
  function markCard(li) {
    if (!li) return;
    var no = slideNoOf(li);
    if (!no) return;
    seenCards[no] = true;
    if (no > maxCard) maxCard = no;
    var c = catOf(li);
    if (c) seenCats[c] = true;
  }

  if (tsRoot) {
    // 초기 활성 슬라이드(보통 1번) 기록
    var initActive = tsRoot.querySelector('.ts__slide.is-active') ||
                     tsRoot.querySelector('.ts__slide');
    markCard(initActive);

    // is-active 클래스 변화 감지 → 자동재생·스와이프·버튼 전부 커버
    var slideEls = Array.prototype.slice.call(tsRoot.querySelectorAll('.ts__slide'));
    var mo = new MutationObserver(function (muts) {
      muts.forEach(function (mut) {
        var li = mut.target;
        if (li.classList && li.classList.contains('is-active')) markCard(li);
      });
    });
    slideEls.forEach(function (li) {
      mo.observe(li, { attributes: true, attributeFilter: ['class'] });
    });
  }

  // ── 스냅샷 만들기 ────────────────────────────────────────────
  function buildPayload() {
    settleDwell();

    var secObj = {};
    var total = 0;
    SECTION_ORDER.forEach(function (k) {
      var s = Math.round(dwellMs[k] / 1000);
      secObj[k] = s;
      total += s;
    });

    var cardsArr = Object.keys(seenCards)
      .map(Number).sort(function (a, b) { return a - b; });
    var catsArr = Object.keys(seenCats);

    return {
      sid: sid,
      media: media,
      device: device,
      enter: pageEnterMs,               // 최초 진입 epoch(ms) — worker가 KST 변환
      sections: secObj,                 // {hero:3, testimonial:40, ...}
      maxSection: SECTION_ORDER[maxSectionIdx] || '',
      lastSection: lastVisibleKey,
      cards: cardsArr.join(','),        // "1,2,3"
      maxCard: maxCard,
      cats: catsArr.join(','),          // "직장인,도박"
      total: total
    };
  }

  // ── 전송 (sendBeacon, 실패 시 fetch keepalive) ───────────────
  var sent = false;
  function flush(force) {
    if (sent && !force) return;
    var payload = buildPayload();
    var body = JSON.stringify(payload);
    var ok = false;
    try {
      if (navigator.sendBeacon) {
        ok = navigator.sendBeacon(TRACK_URL, body);  // text/plain 기본
      }
    } catch (e) {}
    if (!ok) {
      try {
        fetch(TRACK_URL, { method: 'POST', body: body, keepalive: true });
      } catch (e) {}
    }
    sent = true;
  }

  // 이탈/탭전환 시 전송
  window.addEventListener('pagehide', function () { flush(true); });
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') flush(true);
  });

  // 폼 제출 시점에도 한 번(제출 = 최종 도달, 놓치면 안 되니 강제)
  var leadForm = document.querySelector('[data-form="lead"]');
  if (leadForm) {
    leadForm.addEventListener('submit', function () { flush(true); }, true);
  }

  // 안전망: 30초마다 정산만(전송은 이탈 시) — 롱세션 데이터 보존
  setInterval(function () { settleDwell(); }, 30000);

})();