/* =====================================================================
   partner-form.js — 제휴사(리플 / 변호사 이정용 법률사무소) 폼 동시 전송
   ---------------------------------------------------------------------
   [역할]
   1) 화면에 보이지 않는 제휴사 전송용 <form>과 <iframe>을 문서에 심는다.
   2) 사용자가 우리 입력폼에 값을 입력할 때마다, 제휴사 폼의 대응 필드에
      실시간으로 값을 복사(미러링)해둔다.
   3) window.submitPartnerForm() 함수를 전역에 노출한다.
      → form-core-certification.js 의 제출 핸들러가 이 함수를 호출한다.

   [동작 원리]
   - 제휴사 서버는 CORS 때문에 AJAX(fetch/XHR)로는 호출할 수 없다.
     대신 네이티브 <form> POST 는 CORS 정책 대상이 아니므로 그대로 전송된다.
   - form 의 target 을 숨긴 iframe 으로 지정해두면, 서버 응답(JSON)이
     그 iframe 안에서 소비되고 우리 페이지는 이동하지 않는다.
   - 사용자 브라우저가 직접 전송하므로 제휴사 서버에 실제 사용자 IP가 기록된다.
     (우리 서버를 경유하면 모든 건이 동일 IP로 찍혀 어뷰징으로 간주될 수 있음)

   [연동 OFF 방법]
   - index.html 에서 이 파일의 <script> 태그만 제거하면 된다.
     form-core-certification.js 는 이 함수의 존재 여부를 확인 후 호출하므로,
     파일이 없어도 우리 폼 로직은 정상 동작한다.
===================================================================== */
(function () {
  'use strict';

  /* ---------- 제휴사 설정 ---------- */
  var PARTNER_ACTION = 'https://replyalba.com/proc/submit.frm.php';
  var PARTNER_CODE   = 'RMUPQLZwb8';   // 판매자(본인) 식별 고정값
  var PARTNER_AD_DATA = '_frm';        // 고정값
  // ridx: 제휴사가 페이지 로드 시 발급하는 내부 추적값.
  //       빈 값으로 보내도 서버가 정상 접수 처리함을 실측 확인 → 빈 값 고정.
  var PARTNER_RIDX   = '';

  var form = document.querySelector('[data-form="lead"]');
  if (!form) return;

  /* ---------- 우리 폼 필드 참조 ---------- */
  var $ = function (key) { return form.querySelector('[data-field="' + key + '"]'); };
  var f = {
    name: $('name'),
    phone1: $('phone1'), phone2: $('phone2'), phone3: $('phone3'),
    inco: $('inco'), deb: $('deb'),
    comparison: $('comparison'), impossibility: $('impossibility'),
    cause: $('cause'), calltime: $('calltime'), message: $('message')
  };

  /* =====================================================================
     1) 숨긴 제휴사 폼 + iframe 생성
        - display:none 으로 화면에서 감춤 (DOM 에는 실제로 존재)
  ===================================================================== */
  var wrap = document.createElement('div');
  wrap.style.display = 'none';
  wrap.setAttribute('aria-hidden', 'true');
  wrap.innerHTML =
    '<iframe name="partner_hidden_iframe" id="partner_hidden_iframe"></iframe>' +
    '<form id="partnerForm" method="post" target="partner_hidden_iframe" action="' + PARTNER_ACTION + '">' +
      '<input type="hidden" name="adData"   value="' + PARTNER_AD_DATA + '">' +
      '<input type="hidden" name="name"     value="">' +
      '<input type="hidden" name="hp1"      value="010">' +
      '<input type="hidden" name="hp2"      value="">' +
      '<input type="hidden" name="hp3"      value="">' +
      '<input type="hidden" name="item2"    value="">' +
      '<input type="hidden" name="contents" value="">' +
      '<input type="hidden" name="agree1"   value="on">' +
      '<input type="hidden" name="code"     value="' + PARTNER_CODE + '">' +
      '<input type="hidden" name="ridx"     value="' + PARTNER_RIDX + '">' +
    '</form>';
  document.body.appendChild(wrap);

  var partnerForm = document.getElementById('partnerForm');
  var p = function (name) { return partnerForm.querySelector('[name="' + name + '"]'); };

  /* =====================================================================
     2) 우리 폼 → 제휴사 폼 실시간 값 미러링
  ===================================================================== */
  function val(el) { return (el && el.value || '').trim(); }

  // 제휴사 폼에는 소득/채무/채무원인 등을 받을 칸이 없으므로,
  // item2(한줄문의) 한 칸에 우리 전용 항목들을 한 줄로 이어붙여 전달한다.
  function buildItem2() {
    var parts = [];
    // if (val(f.inco))          parts.push('소득 ' + val(f.inco));
    // if (val(f.deb))           parts.push('채무 ' + val(f.deb));
    // if (val(f.comparison))    parts.push('재산대비 ' + val(f.comparison));
    // if (val(f.impossibility)) parts.push('담보세금 ' + val(f.impossibility));
    // if (val(f.cause))         parts.push('채무원인 ' + val(f.cause));
    // if (val(f.calltime))      parts.push('통화가능시간 ' + val(f.calltime));
    if (val(f.message))       parts.push('' + val(f.message));
    return parts.join(' / ');  // 입력폼 항목값과 항목값 사이 구분표기
  }

  function syncToPartnerForm() {
    p('name').value = val(f.name);
    p('hp1').value  = val(f.phone1) || '010';
    p('hp2').value  = val(f.phone2);
    p('hp3').value  = val(f.phone3);
    p('item2').value = buildItem2();
    // contents(궁금하신점)는 제휴사 자체 랜딩에도 노출되지 않는 필드라 미사용
  }

  // 우리 폼의 모든 입력 요소에 변경 감지를 걸어둠
  Object.keys(f).forEach(function (key) {
    var el = f[key];
    if (!el) return;
    el.addEventListener('input', syncToPartnerForm);
    el.addEventListener('change', syncToPartnerForm);
  });

  syncToPartnerForm();   // 초기 1회 (자동완성 등으로 이미 값이 있을 경우 대비)

  /* =====================================================================
     3) 전역 함수 노출 — form-core-certification.js 가 호출
  ===================================================================== */
  window.submitPartnerForm = function () {
    try {
      syncToPartnerForm();     // 제출 직전 최신값으로 한 번 더 동기화
      partnerForm.submit();    // 숨긴 iframe 으로 전송 (페이지 이동 없음)
    } catch (err) {
      // 제휴사 전송 실패가 우리 폼 접수를 막아서는 안 되므로 조용히 넘어감
      console.error('[partner-form] 전송 실패:', err);
    }
  };
})();
