
window.addEventListener('load', function () {
  var form      = document.getElementById('form_e11');
  var submitBtn = document.getElementById('send_message');

  // 이 페이지에 폼이 없으면 아무 것도 안 함
  if (!form || !submitBtn) return;

  var nameInput    = document.getElementById('name');
  var phoneInput   = document.getElementById('phone');
  var biznameInput = document.getElementById('bizname');
  var industrySel  = document.getElementById('industry');
  var regionSel    = document.getElementById('region');
  var revenueSel   = document.getElementById('revenue');
  var fundSel      = document.getElementById('fund');
  var arrearsSel   = document.getElementById('arrears');
  var agreeInput   = document.getElementById('agree11');

  var nameRegex  = /^[가-힣]+$/;
  var phoneRegex = /^[0-9]+$/;

  // 실제 유효성 검사 로직
  function validateForm() {
    var name    = nameInput.value.trim();
    var phone   = phoneInput.value.trim();
    var bizname = biznameInput.value.trim();
    var industry = industrySel.value;
    var region   = regionSel.value;
    var revenue  = revenueSel.value;
    var fund     = fundSel.value;
    var arrears  = arrearsSel.value;
    var agree    = agreeInput.checked;

    // 이전 에러 스타일 제거
    [
      nameInput, phoneInput, biznameInput,
      industrySel, regionSel, revenueSel, fundSel, arrearsSel,
      agreeInput
    ].forEach(function (el) {
      if (el) el.classList.remove('error_input');
    });

    // 이름
    if (!nameRegex.test(name) || name.length < 2) {
      nameInput.classList.add('error_input');
      return { ok: false, message: '성함 입력을 확인하세요.' };
    }

    // 전화번호
    if (phone.length === 0) {
      phoneInput.classList.add('error_input');
      return { ok: false, message: '전화번호를 입력하세요.' };
    }
    if (!(phone.substr(0, 3) === '010' && phone.length === 11 && phoneRegex.test(phone))) {
      phoneInput.classList.add('error_input');
      return { ok: false, message: '전화번호 입력을 확인하세요.' };
    }

    // 상호
    if (bizname.length === 0) {
      biznameInput.classList.add('error_input');
      return { ok: false, message: '상호명을 입력하세요.' };
    }

    // 셀렉트들
    if (!industry) {
      industrySel.classList.add('error_input');
      return { ok: false, message: '업종을 선택하세요.' };
    }

    if (!region) {
      regionSel.classList.add('error_input');
      return { ok: false, message: '지역을 선택하세요.' };
    }

    if (!revenue) {
      revenueSel.classList.add('error_input');
      return { ok: false, message: '연매출을 선택하세요.' };
    }

    if (!fund) {
      fundSel.classList.add('error_input');
      return { ok: false, message: '필요 자금을 선택하세요.' };
    }

    if (!arrears) {
      arrearsSel.classList.add('error_input');
      return { ok: false, message: '연체·국세 체납여부를 선택하세요.' };
    }

    // 동의 체크
    if (!agree) {
      agreeInput.classList.add('error_input');
      return { ok: false, message: '개인정보 동의를 해주세요.' };
    }

    return { ok: true, message: '' };
  }

  // 입력 변화에 따라 버튼 상태/문구 업데이트
  function updateSubmitButtonState() {
    var result = validateForm();

    if (result.ok) {
      submitBtn.disabled = false;
      submitBtn.textContent = '무료상담 신청하기';
      submitBtn.style.background = '#0e3b64';
      submitBtn.style.cursor = 'pointer';
    } else {
      submitBtn.disabled = true;
      submitBtn.textContent = result.message;
      submitBtn.style.background = '#595959';
      submitBtn.style.cursor = 'default';
    }
  }

  // 감시할 요소들
  var inputsToWatch = [
    nameInput, phoneInput, biznameInput,
    industrySel, regionSel, revenueSel, fundSel, arrearsSel,
    agreeInput
  ];

  inputsToWatch.forEach(function (el) {
    if (!el) return;
    el.addEventListener('input',  updateSubmitButtonState);
    el.addEventListener('change', updateSubmitButtonState);
  });

  // 초기 상태 한 번 세팅
  updateSubmitButtonState();

  // 최종 클릭 시 처리
  submitBtn.addEventListener('click', function (e) {
    var result = validateForm();

    // 다시 한 번 체크해서 문제 있으면 경고 후 막기
    if (!result.ok) {
      e.preventDefault();
      alert(result.message);
      return;
    }

    // ✅ 최종 통과 → action 설정 + 버튼 상태 변경 + 전송 + 땡큐페이지 예약
    form.setAttribute(
      'action',
      'https://docs.google.com/forms/d/e/1FAIpQLSceC-tDXVpVn3kit6Pky0_35rr4ZuBEYmD5IMsP7PkxhoXgLw/formResponse'
    );

    submitBtn.disabled = true;
    submitBtn.textContent = '전송 중입니다';
    submitBtn.style.background = '#595959';
    submitBtn.style.cursor = 'default';

    // 실제 폼 전송
    form.submit();

    // 1.5초 뒤 땡큐페이지 이동
    setTimeout(hoa, 700);
  });
});
/**
 * 폼 전송 후 호출되는 함수
 * - 알림
 * - 상단으로 스크롤
 * - 땡큐페이지로 이동
 */
function hoa() {
  alert('신청이 완료되었습니다.');

  // 상단으로 부드럽게 스크롤
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // 랜덤 토큰 생성
  var tx = Math.random().toString(36).substr(2) + Date.now().toString(36);

  // 땡큐페이지로 이동
  window.location.href = 'https://kbizconsult.com/result?tx=' + tx;
}