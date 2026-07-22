/* =====================================================================
   form-core.js  —  개인회생 리드폼 검증 + 전송 (Vanilla, data-* 기반)
   + 휴대폰 번호 인증 (OTP) 추가
===================================================================== */
(function () {
  'use strict';

  var form = document.querySelector('[data-form="lead"]');
  if (!form) return;

  /* ---------- 구글폼 매핑 ---------- */
  var ENTRY = {
    name:     'entry.498799052',
    phone:    'entry.1784497319',
    inco:     'entry.1214740303',
    deb:      'entry.269586254',
    comparison: 'entry.569624933',
    impossibility: 'entry.843968427',
    cause: 'entry.1097158195',
    calltime: 'entry.1437671360',
    message: 'entry.1633505487',
    phoneCheck: 'entry.1444531095',
    source:   'entry.1195646871'
  };
  var GOOGLE_FORM_URL = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSf2Od8eGVGDhTxzHl1bOHzVOgmY-vC1njarXFZBm4ZLSpssnQ/formResponse';
  var WEBAPP2_URL      = 'https://script.google.com/macros/s/AKfycbyffJczzp9k5rod1cW9sjA2cVC-XU-bgDerEF_7-UEekcnOzXwjEm7z-uPfEtjBJNPx/exec';   // ★ 구글앱스스크립트 웹앱2 (submit/lookup)
  var THANKYOU_URL    = 'https://landing-ops.github.io/debt/result';
  var SOURCE = (typeof LANDING_SOURCE !== 'undefined' ? LANDING_SOURCE : '인덱스');

  /* ---------- 핸드폰 인증 OTP 설정 (구글앱스 웹앱 API)---------- */
  var OTP_API_URL = 'https://script.google.com/macros/s/AKfycbwxPFlL7G0g0NDMqpTlJxmX3YltpkXmLkAXJ_foN2MT9Un2MsYCv2k3xkTrov-fFpw/exec';
  var isPhoneVerified = false;  // 인증 완료 여부

  /* ---------- 필드 수집 (data-field) ---------- */
  var $ = function (key) { return form.querySelector('[data-field="' + key + '"]'); };
  var f = {
    name: $('name'), phone: $('phone'),
    deb: $('deb'), inco: $('inco'),
    comparison: $('comparison'), impossibility: $('impossibility'),
    cause: $('cause'),
    calltime: $('calltime'), message: $('message'), agree: $('agree') 
  };
  var submitBtn = form.querySelector('[data-field="submit"]');
  if (!submitBtn) return;

  var nameRegex  = /^[가-힣]+$/;
  var phoneRegex = /^[0-9]+$/;
  var checkOrder = ['name', 'phone', 'deb', 'inco', 'comparison', 'impossibility', 'cause', 'calltime', 'message', 'agree'];
  function clearErrors() {
    checkOrder.forEach(function (k) { if (f[k]) f[k].classList.remove('is-invalid'); });
  }

  // /* =====================================================================
  //    핸드폰 번호인증 OTP — 폼에 생성된 UI에 스타일 주입 (★기능 OFF시 주석처리★)
  // ===================================================================== */
  // (function injectOtpStyle() {
  //   if (document.getElementById('otp-style')) return;
  //   var style = document.createElement('style');
  //   style.id = 'otp-style';
  //   style.textContent =
  //     '.otp-row{display:flex;gap:8px;margin-top:6px;align-items:stretch;}' +
  //     '.otp-code-input{flex:1 1 auto;min-width:0;}' +
  //     '.otp-action-btn{flex:0 0 auto;padding:0 18px;border-radius:var(--radius-lg,12px);' +
  //       'font-size:.9rem;font-weight:700;white-space:nowrap;cursor:pointer;' +
  //       'border:1.5px solid var(--primary);background:#fff;color:var(--primary);transition:all .15s;}' +
  //     '.otp-action-btn.is-verify{background:var(--secondary);border-color:var(--secondary);color:#fff;}' +
  //     '.otp-action-btn.is-done{background:var(--accent);border-color:var(--accent);color:#fff;cursor:default;}' +
  //     '.otp-action-btn:disabled{opacity:.6;cursor:default;}' +
  //     '.otp-msg{font-size:.8125rem;margin-top:6px;}';
  //   document.head.appendChild(style);
  // })();

  // /* =====================================================================
  //    핸드폰 번호인증 OTP — UI 주입 (연락처 입력칸 아래에 자동 삽입) / (★기능 OFF시 주석처리★)
  // ===================================================================== */
  // var phoneEl = f.phone;

  // var oldOtp = form.querySelector('[data-otp-box]');
  // if (oldOtp) oldOtp.remove();

  // var otpBox = null;
  // if (phoneEl) {
  //   otpBox = document.createElement('div');
  //   otpBox.setAttribute('data-otp-box', '');  
  //   otpBox.innerHTML =
  //     '<p style="font-size:14px;color:#d33;margin-bottom:4px; text-align:left;"></p>' + // 번호인증 카피 ) 정확한 탕감액 산정을 위해 번호 인증을 진행해주세요.
  //     '<div class="otp-row">' +
  //       '<input data-otp-code type="text" maxlength="6" inputmode="numeric" ' +
  //         'pattern="[0-9]*" autocomplete="off" ' +
  //         'class="lf__input otp-code-input" placeholder="인증번호를 입력해주세요" />' +
  //       '<button type="button" data-otp-action class="otp-action-btn">인증번호 받기</button>' +
  //     '</div>' +
  //     '<p data-otp-msg class="otp-msg"></p>';
  //   var phoneWrap = phoneEl.closest('.lf__field') || phoneEl.parentNode;
  //   phoneWrap.insertAdjacentElement('afterend', otpBox);
  // }

  // /* =====================================================================
  //    핸드폰 번호인증 OTP — 요소 참조 + 로직 /  (★기능 OFF시 주석처리★)
  // ===================================================================== */
  // var otpCodeEl    = otpBox ? otpBox.querySelector('[data-otp-code]')   : null;
  // var otpActionBtn = otpBox ? otpBox.querySelector('[data-otp-action]') : null;
  // var otpMsg       = otpBox ? otpBox.querySelector('[data-otp-msg]')    : null;

  // var codeSent = false;

  // function setOtpMsg(text, color) {
  //   if (!otpMsg) return;
  //   otpMsg.textContent = text || '';
  //   otpMsg.style.color = color || '';
  // }

  // function callOtpApi(payload) {
  //   return fetch(OTP_API_URL, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'text/plain;charset=utf-8' },
  //     body: JSON.stringify(payload)
  //   }).then(function (r) { return r.json(); });
  // }

  // function getValidPhoneDigits() {
  //   if (!phoneEl) return '';
  //   var d = (phoneEl.value || '').replace(/\D/g, '');
  //   return /^010\d{8}$/.test(d) ? d : '';
  // }

  // function getCode() {
  //   return ((otpCodeEl && otpCodeEl.value) || '').replace(/\D/g, '');
  // }

  // function refreshOtpButton() {
  //   if (!otpActionBtn) return;
  //   if (isPhoneVerified) {
  //     otpActionBtn.textContent = '인증 완료';
  //     otpActionBtn.className = 'otp-action-btn is-done';
  //     otpActionBtn.disabled = true;
  //     return;
  //   }
  //   otpActionBtn.disabled = false;
  //   if (codeSent && getCode().length === 6) {
  //     otpActionBtn.textContent = '인증번호 확인';
  //     otpActionBtn.className = 'otp-action-btn is-verify';
  //   } else {
  //     otpActionBtn.textContent = codeSent ? '인증번호 재발송' : '인증번호 받기';
  //     otpActionBtn.className = 'otp-action-btn';
  //   }
  // }

  // function doSend() {
  //   var phone = getValidPhoneDigits();
  //   if (!phone) { alert('휴대폰 번호를 정확히 입력해주세요.'); return; }

  //   otpActionBtn.disabled = true;
  //   setOtpMsg('인증번호를 발송했습니다. (3분 이내 입력)', '#1a7f37');

  //   setTimeout(function () {
  //     alert('핸드폰 문자로 [인증번호]가 전송되었습니다.\n6자리를 입력하고 [인증번호 확인]을 눌러주세요.');
  //   }, 500);

  //   callOtpApi({ action: 'send', phone: phone })
  //     .then(function (res) {
  //       if (res.ok) {
  //         codeSent = true;
  //         setOtpMsg('인증번호를 발송했습니다. (3분 이내 입력)', '#1a7f37');
  //         if (otpCodeEl) otpCodeEl.focus();
  //       } else {
  //         alert(res.message || '발송에 실패했습니다. 다시 시도해주세요.');
  //         setOtpMsg(res.message || '발송에 실패했습니다.', '#d33');
  //       }
  //     })
  //     .catch(function () {
  //       alert('네트워크 오류로 발송에 실패했습니다.');
  //       setOtpMsg('네트워크 오류로 발송에 실패했습니다.', '#d33');
  //     })
  //     .then(function () { refreshOtpButton(); });
  // }

  // function doVerify() {
  //   var phone = getValidPhoneDigits();
  //   var code = getCode();
  //   if (code.length !== 6) { alert('인증번호 6자리를 입력해주세요.'); return; }
  //   otpActionBtn.disabled = true;
  //   setOtpMsg('확인 중...', '');
  //   callOtpApi({ action: 'verify', phone: phone, code: code })
  //     .then(function (res) {
  //       if (res.ok) {
  //         isPhoneVerified = true;
  //         if (otpCodeEl) otpCodeEl.disabled = true;
  //         setOtpMsg('', '');
  //         alert('인증이 완료되었습니다.');
  //         refreshOtpButton();
  //         updateButton();  // 인증 완료 후 버튼 상태 갱신
  //       } else {
  //         alert(res.message || '인증에 실패했습니다.');
  //         setOtpMsg(res.message || '인증에 실패했습니다.', '#d33');
  //         refreshOtpButton();
  //       }
  //     })
  //     .catch(function () {
  //       alert('네트워크 오류로 확인에 실패했습니다.');
  //       refreshOtpButton();
  //     });
  // }

  // // 버튼 클릭 → 발송/확인 분기
  // if (otpActionBtn) {
  //   otpActionBtn.addEventListener('click', function () {
  //     if (isPhoneVerified) return;
  //     if (codeSent && getCode().length === 6) doVerify();
  //     else doSend();
  //   });
  // }

  // // 코드 입력 → 숫자 6자리 제한 + 버튼 갱신
  // if (otpCodeEl) {
  //   otpCodeEl.addEventListener('input', function () {
  //     otpCodeEl.value = otpCodeEl.value.replace(/\D/g, '').slice(0, 6);
  //     refreshOtpButton();
  //   });
  // }

  // // 전화번호 변경 시 → 인증 초기화
  // if (phoneEl) {
  //   phoneEl.addEventListener('input', function () {
  //     // 숫자만 + 최대 11자리
  //     var digits = phoneEl.value.replace(/\D/g, '');
  //     if (digits.length > 11) digits = digits.slice(0, 11);
  //     phoneEl.value = digits;

  //     // 인증 상태 초기화
  //     if (!isPhoneVerified && !codeSent) return;
  //     isPhoneVerified = false;
  //     codeSent = false;
  //     if (otpCodeEl) { otpCodeEl.disabled = false; otpCodeEl.value = ''; }
  //     setOtpMsg('번호가 변경되어 다시 인증이 필요합니다.', '#d33');
  //     refreshOtpButton();
  //     updateButton();
  //   });
  // }

  // refreshOtpButton(); // 초기 상태

  /* =====================================================================
     검증
  ===================================================================== */
  function validate() {
    clearErrors();
    var v = {};
    ['name', 'phone', 'inco', 'deb','comparison','impossibility', 'cause', 'calltime','message'].forEach(function (k) {
      v[k] = (f[k] && f[k].value || '').trim();
    });

    if (!nameRegex.test(v.name) || v.name.length < 2) {
      f.name.classList.add('is-invalid');
      return { ok: false, msg: '성함 입력을 확인하세요.' }; 
    }

    if (v.phone.length === 0) {
      f.phone.classList.add('is-invalid');
      return { ok: false, msg: '전화번호를 입력하세요.' };
    }
    if (!(v.phone.substr(0, 3) === '010' && v.phone.length === 11 && phoneRegex.test(v.phone))) {
      f.phone.classList.add('is-invalid');
      return { ok: false, msg: '전화번호 입력을 확인하세요.' };
    }
    // 휴대폰 번호 인증 완료 여부 확인 (★기능 OFF시 주석처리★)
    // if (!isPhoneVerified) {
    //   f.phone.classList.add('is-invalid');
    //   return { ok: false, msg: '휴대폰 인증을 완료해주세요.' };
    // }

    if (!v.inco) { f.inco.classList.add('is-invalid'); return { ok: false, msg: '소득 범주를 선택하세요.' }; }
    if (v.inco === 'disallow') {
      f.inco.classList.add('is-invalid');
      return { ok: false, msg: '개인회생 신청이 불가합니다.' };
    }

    if (!v.deb) { f.deb.classList.add('is-invalid'); return { ok: false, msg: '채무 범주를 선택하세요.' }; }
    if (v.deb === 'disallow') {
      f.deb.classList.add('is-invalid');
      return { ok: false, msg: '개인회생 신청이 불가합니다.' };
    }

    if (!v.comparison) { f.comparison.classList.add('is-invalid'); return { ok: false, msg: '재산대비 채무액 범주를 선택하세요.' }; }
    if (v.comparison === 'disallow') {
      f.comparison.classList.add('is-invalid');
      return { ok: false, msg: '개인회생 신청이 불가합니다.' };
    }

    if (!v.impossibility) { f.impossibility.classList.add('is-invalid'); return { ok: false, msg: '담보/세금체납 범주를 선택하세요.' }; }
    if (v.impossibility === 'disallow') {
      f.impossibility.classList.add('is-invalid');
      return { ok: false, msg: '개인회생 신청이 불가합니다.' };
    }

    if (!v.cause) { f.cause.classList.add('is-invalid'); return { ok: false, msg: '채무 발생 원인을 선택하세요.' }; }
    if (!v.calltime) { f.calltime.classList.add('is-invalid'); return { ok: false, msg: '통화 가능 시간대를 선택하세요.' }; }
    if (v.message.length < 2) { f.message.classList.add('is-invalid'); return { ok: false, msg: '문의사항을 입력하세요.' }; }
    if (!f.agree.checked) { f.agree.classList.add('is-invalid'); return { ok: false, msg: '개인정보 동의를 해주세요.' }; }

    return { ok: true, msg: '무료상담 신청하기' };
  }

  /* =====================================================================
     버튼 상태 갱신
  ===================================================================== */
  function updateButton() {
    var r = validate();
    if (r.ok) {
      submitBtn.disabled = false;
      submitBtn.textContent = '무료상담 신청하기';
      submitBtn.style.background = 'var(--color-cta-main-strong)';
      submitBtn.style.cursor = 'pointer';
    } else {
      submitBtn.disabled = true;
      submitBtn.textContent = r.msg;
      submitBtn.style.background = 'var(--color-cta-disabled)';
      submitBtn.style.cursor = 'default';
    }
  }

  checkOrder.forEach(function (k) {
    if (!f[k]) return;
    f[k].addEventListener('input', updateButton);
    f[k].addEventListener('change', updateButton);
  });
  updateButton(); // 초기 1회

/* =====================================================================
     전송 (웹앱2 submit — JSONP 방식, uid 발급받아 땡큐페이지로 이동)
  ======================================================================== */
  function buildSubmitParams(requestId) {
    var params = {
      action: 'submit',
      name: (f.name.value || '').trim(),
      phone: (f.phone.value || '').trim(),
      inco: (f.inco.value || '').trim(),
      deb: (f.deb.value || '').trim(),
      comparison: (f.comparison.value || '').trim(),
      impossibility: (f.impossibility.value || '').trim(),
      cause: (f.cause.value || '').trim(),
      calltime: (f.calltime.value || '').trim(),
      message: (f.message.value || '').trim(),
      phoneCheck: isPhoneVerified ? '번호인증 완료' : '번호인증 미완료',
      source: SOURCE,
      requestId: requestId   // ★ 이번 제출(1차+재시도) 전체가 공유하는 고유 ID — 서버가 재시도 감지용으로 사용
    };
    return new URLSearchParams(params);
  }

  /* ---------- 폼 제출 로딩 오버레이 (index.html의 #submit-loading-overlay 제어) ---------- */
  var submitLoadingOverlay = document.getElementById('submit-loading-overlay');
  function showLoadingOverlay() {
    if (submitLoadingOverlay) submitLoadingOverlay.style.display = 'flex';
  }
  function hideLoadingOverlay() {
    if (submitLoadingOverlay) submitLoadingOverlay.style.display = 'none';
  }

  function resetSubmitButton() {
    submitBtn.disabled = false;
    submitBtn.textContent = '무료상담 신청하기';
    submitBtn.style.background = 'var(--color-cta-main-strong)';
    submitBtn.style.cursor = 'pointer';
  }

  var SUBMIT_TIMEOUT_MS   = 10000;   // ★ 시도당 타임아웃 (8초 → 10초)
  var SUBMIT_MAX_ATTEMPTS = 2;        // 최초 시도 1 + 재시도 1

  function attemptSubmit(attemptNo, requestId) {
    var callbackName = 'leadSubmitCb_' + Date.now() + '_' + attemptNo;
    var script = document.createElement('script');
    var settled = false;

    function cleanup() {
      if (script.parentNode) script.parentNode.removeChild(script);
      delete window[callbackName];
    }

    var timeoutId = setTimeout(function () {
      if (settled) return;
      settled = true;
      cleanup();

      if (attemptNo < SUBMIT_MAX_ATTEMPTS) {
        attemptSubmit(attemptNo + 1, requestId);   // ★ 같은 requestId로 재시도 → 서버가 중복 아닌 재시도로 인식
      } else {
        hideLoadingOverlay();
        alert('네트워크 지연으로 접수가 지연되고 있습니다. 잠시 후 다시 시도해주세요.');
        resetSubmitButton();
      }
    }, SUBMIT_TIMEOUT_MS);

    window[callbackName] = function (data) {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutId);
      cleanup();
      hideLoadingOverlay();   // ★ 서버 응답 도착 → 결과 안내 직전에 오버레이 제거

      if (data && data.ok) {
        alert('신청이 완료되었습니다.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.location.href = THANKYOU_URL + '?uid=' + data.uid;
      } else if (data && data.reason === 'duplicate') {
        alert('이미 접수된 번호입니다. 신청이 불가합니다.');
        resetSubmitButton();
      } else {
        alert('접수 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
        resetSubmitButton();
      }
    };

    var params = buildSubmitParams(requestId);
    params.append('callback', callbackName);

    script.src = WEBAPP2_URL + '?' + params.toString();
    script.onerror = function () {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutId);
      cleanup();

      if (attemptNo < SUBMIT_MAX_ATTEMPTS) {
        attemptSubmit(attemptNo + 1, requestId);   // ★ 재시도
      } else {
        hideLoadingOverlay();
        alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
        resetSubmitButton();
      }
    };
    document.body.appendChild(script);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var r = validate();
    if (!r.ok) { alert(r.msg); return; }

    submitBtn.disabled = true;
    submitBtn.textContent = '전송 중입니다';
    submitBtn.style.background = 'var(--color-cta-disabled)';
    submitBtn.style.cursor = 'default';

    showLoadingOverlay();   // ★ 클릭 즉시 오버레이 표시 (재시도가 일어나도 계속 유지됨)
    var requestId = 'req_' + Date.now() + '_' + Math.random().toString(36).slice(2);
    attemptSubmit(1, requestId);
  });
})();