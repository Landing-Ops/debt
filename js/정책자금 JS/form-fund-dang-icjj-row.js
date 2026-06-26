const form = document.getElementById('form');
form.innerHTML = `
<!--New스타일 입력폼, 배경에 이미지 삽입 (09.15)-->
<section class="section leadform" id="contact" aria-labelledby="leadform-title">
  <div class="leadform__bg" aria-hidden="true"></div>
  <div class="leadform__wrap">
    <header class="leadform__head">
      <p class="leadform__count" style="font-size: 18px;">오늘 최대한도&최저금리<br>무료진단 받으신 대표님
        <strong id="today-count">0</strong>명
      </p>
      <h2 id="leadform-title" class="leadform__title">2025년 하반기<br>인천광역시 제조업<br>정책자금 컨설팅<br>무료상담 신청</h2>
      <p class="leadform__desc" style="font-size: 18px;">
        오랜 경력을 가진 전문 컨설턴트가<br>
        대표님 기업에 필요한 <span style="color: #ffe600;"><b>최대한도·최저금리 조건</b></span>을 비교 분석해<br>
        <span style="color: #ffe600;"><b>최적의 자금승인</b></span> 전략을 제안드립니다.
      </p><br>
    </header>

    <form action="" id="form_e11" method="POST" target="hidden_iframe11"
          onsubmit="setTimeout(hoa, 1500); submitted=true;" class="leadform__card" novalidate>
      <input type="hidden" name="entry.1767017674" value="유입매체">

      <div class="lf__grid">
        <!-- 1. 이름 -->
        <div class="lf__field">
          <label for="name" class="lf__label">이름</label>
          <input
            type="text"
            id="name"
            name="entry.114372548"
            class="lf__input"
            placeholder="이름"
            maxlength="4"
            autocomplete="name"
            required
          >
        </div>

        <!-- 2. 연락처 -->
        <div class="lf__field">
          <label for="phone" class="lf__label">연락처</label>
          <input
            type="tel"
            id="phone"
            name="entry.2053141744"
            class="lf__input"
            inputmode="numeric"
            placeholder="숫자만 입력 (예: 01012345678)"
            maxlength="11"
            required
          >
        </div>

        <!-- 3. 사업자 상호 -->
        <div class="lf__field">
          <label for="bizname" class="lf__label">사업자 상호</label>
          <input
            type="text"
            id="bizname"
            name="entry.2013305819"
            class="lf__input"
            placeholder="상호명 입력"
            autocomplete="organization"
            required
          >
        </div>

        <!-- 4. 업종 -->
        <div class="lf__field">
          <label for="industry" class="lf__label">업종</label>
          <select id="industry" name="entry.855034677" class="lf__select" required>
            <option value="" selected disabled>업종을 선택해주세요</option>
            <option>제조업</option>
          </select>
        </div>

        <!-- 5. 지역 -->
        <div class="lf__field">
          <label for="region" class="lf__label">지역</label>
          <select id="region" name="entry.1446743340" class="lf__select" required>
            <option value="" selected disabled>지역을 선택해주세요</option>
            <option value="인천광역시">인천광역시</option>
          </select>
        </div>

        <!-- 6. 연매출 -->
        <div class="lf__field">
          <label for="revenue" class="lf__label">연매출</label>
          <select id="revenue" name="entry.853049962" class="lf__select" required>
            <option value="" selected disabled>연매출을 선택해주세요</option>
            <option>1억미만</option>
            <option>1~3억</option>
            <option>3~5억</option>
            <option>5~10억</option>
            <option>10~20억</option>
            <option>30~50억</option>
            <option>50억이상</option>
          </select>
        </div>

        <!-- 7. 필요자금 -->
        <div class="lf__field">
          <label for="fund" class="lf__label">필요자금</label>
          <select id="fund" name="entry.1570139881" class="lf__select" required>
            <option value="" selected disabled>필요자금을 선택해주세요</option>
            <option>1~3천만원</option>
            <option>3~6천만원</option>
            <option>6~9천만원</option>
            <option>1~2억</option>
            <option>2~3억</option>
            <option>3~4억</option>
            <option>4~7억</option>
            <option>7~10억</option>
            <option>10억이상</option>
          </select>
        </div>

        <!-- 8. 세금 체납/연체/결손 여부 -->
        <div class="lf__field">
          <label for="arrears" class="lf__label">세금 체납/연체/결손 여부</label>
          <select id="arrears" name="entry.425300914" class="lf__select" required>
            <option value="" selected disabled>선택해주세요</option>
            <option>O</option>
            <option>X</option>
          </select>
        </div>

        <!-- 동의 & 약관 -->
        <div class="lf__agree lf__field--full">
          <label class="lf__check" for="agree11">
            <input
              type="checkbox"
              id="agree11"
              name="agree11"
              value="개인정보보호정책 동의"
              checked
              required
            >
            <span>개인정보처리방침에 동의합니다.</span>
          </label>
          <!-- 반드시 유지 -->
          <span class="privacyBtn" style="color:#000;font-weight:400;font-size:13px;margin-top:-3px;"
                onclick="privacyPopUp()">[자세히 보기]</span>
        </div>

        <!-- 제출 버튼 (id, 클래스 유지) -->
        <button type="submit" id="send_message" class="lf__submit lf__field--full" disabled>
          무료지원하기
        </button>
      </div>
      <!-- 반드시 유지: 제출 흐름용 iframe -->
      <script type="text/javascript">var submitted = false;</script>
      <iframe name="hidden_iframe11" id="hidden_iframe11" style="display:none;"></iframe>
      <iframe name="hidden_iframe12" id="hidden_iframe12" style="display:none;"></iframe>
    </form>
  </div>
</section>

<!----form-end------>
`;
document.body.appendChild(form.content);