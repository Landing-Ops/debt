/* =====================================================================
   form-core.js  —  리드폼 검증 + 전송 (Vanilla, data-* 기반)
   기존 validation-fund-row.js + form-fund-row.js(전송흐름)를 nude 폼 규칙으로 이식.
   - HTML은 깨끗하게: 필드는 data-field="key" 로만 표시
   - 구글폼 매핑(entry.*) / 전송 URL / 땡큐 URL / 버튼 색·문구는 기존 그대로 보존
   - 전송: 숨김 iframe 대신 fetch(no-cors) 로 동일 동작
===================================================================== */
(function () {
  'use strict';

  var form = document.querySelector('[data-form="lead"]');
  if (!form) return;

  /* ---------- 구글폼 매핑 (기존 그대로) ---------- */
  var ENTRY = {
    name:    'entry.114372548',
    phone:   'entry.2053141744',
    bizname: 'entry.2013305819',
    industry:'entry.855034677',
    region:  'entry.1446743340',
    revenue: 'entry.853049962',
    fund:    'entry.1570139881',
    arrears: 'entry.425300914',
    source:  'entry.1767017674'
  };
  var GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSceC-tDXVpVn3kit6Pky0_35rr4ZuBEYmD5IMsP7PkxhoXgLw/formResponse';
  var THANKYOU_URL    = 'https://kbizconsult.com/result';
  var SOURCE = (document.body.getAttribute('data-source') || '인덱스');

  /* ---------- 필드 수집 (data-field) ---------- */
  var $ = function (key) { return form.querySelector('[data-field="' + key + '"]'); };
  var f = {
    name: $('name'), phone: $('phone'), bizname: $('bizname'),
    industry: $('industry'), region: $('region'), revenue: $('revenue'),
    fund: $('fund'), arrears: $('arrears'), agree: $('agree')
  };
  var submitBtn = form.querySelector('[data-field="submit"]');
  if (!submitBtn) return;

  var nameRegex  = /^[가-힣]+$/;
  var phoneRegex = /^[0-9]+$/;
  var checkOrder = ['name', 'phone', 'bizname', 'industry', 'region', 'revenue', 'fund', 'arrears', 'agree'];

  function clearErrors() {
    checkOrder.forEach(function (k) { if (f[k]) f[k].classList.remove('is-invalid'); });
  }

  /* ---------- 검증 (순서·문구 기존 그대로) ---------- */
  function validate() {
    clearErrors();
    var v = {};
    ['name', 'phone', 'bizname', 'industry', 'region', 'revenue', 'fund', 'arrears'].forEach(function (k) {
      v[k] = (f[k] && f[k].value || '').trim();
    });

    if (!nameRegex.test(v.name) || v.name.length < 2) { f.name.classList.add('is-invalid'); return { ok: false, msg: '성함 입력을 확인하세요.' }; }

    if (v.phone.length === 0) { f.phone.classList.add('is-invalid'); return { ok: false, msg: '전화번호를 입력하세요.' }; }
    if (!(v.phone.substr(0, 3) === '010' && v.phone.length === 11 && phoneRegex.test(v.phone))) { f.phone.classList.add('is-invalid'); return { ok: false, msg: '전화번호 입력을 확인하세요.' }; }

    if (v.bizname.length === 0) { f.bizname.classList.add('is-invalid'); return { ok: false, msg: '상호명을 입력하세요.' }; }
    if (!v.industry) { f.industry.classList.add('is-invalid'); return { ok: false, msg: '업종을 선택하세요.' }; }
    if (!v.region)   { f.region.classList.add('is-invalid');   return { ok: false, msg: '지역을 선택하세요.' }; }
    if (!v.revenue)  { f.revenue.classList.add('is-invalid');  return { ok: false, msg: '연매출을 선택하세요.' }; }
    if (!v.fund)     { f.fund.classList.add('is-invalid');     return { ok: false, msg: '필요 자금을 선택하세요.' }; }
    if (!v.arrears)  { f.arrears.classList.add('is-invalid');  return { ok: false, msg: '연체·국세 체납여부를 선택하세요.' }; }
    if (!f.agree.checked) { f.agree.classList.add('is-invalid'); return { ok: false, msg: '개인정보 동의를 해주세요.' }; }

    return { ok: true, msg: '무료상담 신청하기' };
  }

  /* ---------- 버튼 상태(문구·색) 갱신 — 기존 동작 그대로 ---------- */
  function updateButton() {
    var r = validate();
    if (r.ok) {
      submitBtn.disabled = false;
      submitBtn.textContent = '무료상담 신청하기';
      submitBtn.style.background = 'var(--color-cta-main-strong)';   /* #0e3b64 */
      submitBtn.style.cursor = 'pointer';
    } else {
      submitBtn.disabled = true;
      submitBtn.textContent = r.msg;
      submitBtn.style.background = 'var(--color-cta-disabled)';      /* #595959 */
      submitBtn.style.cursor = 'default';
    }
  }

  checkOrder.forEach(function (k) {
    if (!f[k]) return;
    f[k].addEventListener('input', updateButton);
    f[k].addEventListener('change', updateButton);
  });
  updateButton(); // 초기 1회

  /* ---------- 전송 ---------- */
  function buildBody() {
    var data = new URLSearchParams();
    ['name', 'phone', 'bizname', 'industry', 'region', 'revenue', 'fund', 'arrears'].forEach(function (k) {
      data.append(ENTRY[k], (f[k].value || '').trim());
    });
    data.append(ENTRY.source, SOURCE);
    return data.toString();
  }

  function thankyou() {
    alert('신청이 완료되었습니다.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    var tx = Math.random().toString(36).substr(2) + Date.now().toString(36);
    window.location.href = THANKYOU_URL + '?tx=' + tx;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();        // 엔터키/버튼 모두 여기서 처리(네이티브 제출 차단)
    var r = validate();
    if (!r.ok) { alert(r.msg); return; }

    submitBtn.disabled = true;
    submitBtn.textContent = '전송 중입니다';
    submitBtn.style.background = 'var(--color-cta-disabled)';
    submitBtn.style.cursor = 'default';

    fetch(GOOGLE_FORM_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: buildBody()
    }).catch(function () { /* no-cors: 응답 못 읽음, 정상 */ });

    setTimeout(thankyou, 700);
  });
})();
